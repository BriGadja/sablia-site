// @vitest-environment node
/**
 * US-63: the static half of the server answers like Vercel did (vercel.json rewrites + the
 * filesystem). Measured against sablia.io on 2026-10-18: /cgv 200 (not 301), /escalier-modeles =
 * escalier-modeles.html, unknown paths and a missing /assets/x.js = index.html 200, .well-known
 * served, only /assets/* immutable.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import express from 'express'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mountStatic } from './static'
import { listen, makeDist, PNG } from './test-helpers'

let dist: string
let srv: Awaited<ReturnType<typeof listen>>

beforeAll(async () => {
  dist = makeDist()
  const app = express()
  mountStatic(app, dist)
  srv = await listen(app)
})
afterAll(() => srv.close())

const get = (path: string, init?: RequestInit) =>
  fetch(srv.url + path, { redirect: 'manual', ...init })
const html = (rel: string) => readFileSync(join(dist, rel), 'utf8')

describe('mountStatic — Vercel parity', () => {
  it('serves / and /index.html with a revalidating cache', async () => {
    for (const p of ['/', '/index.html']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html('index.html'))
      expect(r.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate')
    }
  })

  it('answers 200 at /cgv AND /cgv/ with the directory page (no 301)', async () => {
    for (const p of ['/cgv', '/cgv/']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html('cgv/index.html'))
    }
    const nested = await get('/ressources/pipedrive-nouveau-lead')
    expect(await nested.text()).toBe(html('ressources/pipedrive-nouveau-lead/index.html'))
  })

  it('rewrites /escalier-modeles to escalier-modeles.html', async () => {
    const r = await get('/escalier-modeles')
    expect(r.status).toBe(200)
    expect(await r.text()).toBe(html('escalier-modeles.html'))
  })

  it('falls back to index.html (200) for unknown paths and missing assets', async () => {
    for (const p of ['/nimporte-quoi', '/assets/x.js', '/ressources/inconnu/deep']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html('index.html'))
      expect(r.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate')
    }
  })

  it('serves hashed assets as immutable and everything else as must-revalidate', async () => {
    const a = await get('/assets/main-abc12345.js')
    expect(a.status).toBe(200)
    expect(a.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
    const r = await get('/robots.txt')
    expect(r.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate')
  })

  it('serves .well-known but never another dotfile', async () => {
    const ai = await get('/.well-known/ai.txt')
    expect(ai.status).toBe(200)
    expect(ai.headers.get('content-type')).toMatch(/^text\/plain/)
    expect(await ai.text()).toBe('ai policy')
    const env = await get('/.env')
    expect(await env.text()).not.toContain('SECRET_SHOULD_NEVER_BE_SERVED')
  })

  it('keeps the content types Vercel gave', async () => {
    expect((await get('/sitemap.xml')).headers.get('content-type')).toMatch(/^application\/xml/)
    expect((await get('/favicon.svg')).headers.get('content-type')).toMatch(/^image\/svg\+xml/)
    expect(
      (await get('/b726ffc356cf2894abdd81a5a309a181.txt')).headers.get('content-type'),
    ).toMatch(/^text\/plain/)
  })

  it('returns binary files byte for byte', async () => {
    const r = await get('/photos/a.webp')
    expect(Buffer.from(await r.arrayBuffer()).equals(PNG)).toBe(true)
  })

  it('does not escape the dist directory', async () => {
    const r = await get('/..%2f..%2f..%2f..%2fetc%2fpasswd')
    expect(await r.text()).not.toContain('root:')
    const r2 = await fetch(`${srv.url}/%2e%2e/%2e%2e/etc/passwd`)
    expect(await r2.text()).not.toContain('root:')
  })

  it('answers HEAD without a body and refuses other methods with 405', async () => {
    const h = await get('/', { method: 'HEAD' })
    expect(h.status).toBe(200)
    expect(await h.text()).toBe('')
    const p = await get('/nimporte-quoi', { method: 'POST', body: 'x' })
    expect(p.status).toBe(405)
    expect(p.headers.get('allow')).toBe('GET, HEAD')
  })
})
