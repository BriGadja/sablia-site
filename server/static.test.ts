// @vitest-environment node
/**
 * US-63 (v2): the static half serves a Next `output: 'export'` tree. Resolution is `<path>.html`
 * then `<path>/index.html`, an unknown path is a real 404 carrying 404.html (the Vercel-era
 * index.html fallback is gone), and Next's RSC payloads (`*.txt`) answer 200 text/plain.
 */
import { readFileSync } from 'node:fs'
import http from 'node:http'
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

/** A request sent as written: fetch would resolve `.` and `..` segments before sending. */
function raw(path: string): Promise<{ status: number; body: string; location?: string }> {
  const { hostname, port } = new URL(srv.url)
  return new Promise((resolve, reject) => {
    http
      .get({ hostname, port, path }, (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => {
          body += chunk
        })
        res.on('end', () =>
          resolve({ status: res.statusCode ?? 0, body, location: res.headers.location }),
        )
      })
      .on('error', reject)
  })
}

const REVALIDATE = 'public, max-age=0, must-revalidate'

describe('mountStatic — Next export', () => {
  it('serves / and /index.html with a revalidating cache', async () => {
    for (const p of ['/', '/index.html']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html('index.html'))
      expect(r.headers.get('cache-control')).toBe(REVALIDATE)
    }
  })

  it('resolves <path>.html at /x AND /x/ (no redirect)', async () => {
    for (const p of ['/cgv', '/cgv/', '/escalier-modeles']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html(`${p.replace(/\/$/, '')}.html`.slice(1)))
    }
    const nested = await get('/offres/compte-rendu-appel')
    expect(await nested.text()).toBe(html('offres/compte-rendu-appel.html'))
    const slug = await get('/ressources/pipedrive-nouveau-lead')
    expect(await slug.text()).toBe(html('ressources/pipedrive-nouveau-lead.html'))
  })

  it('answers /ressources from ressources.html although a ressources/ directory sits beside it', async () => {
    for (const p of ['/ressources', '/ressources/']) {
      const r = await get(p)
      expect(r.status).toBe(200)
      expect(await r.text()).toBe(html('ressources.html'))
    }
  })

  it('falls back to <path>/index.html when no <path>.html exists', async () => {
    const dir = join(dist, 'legacy')
    const { mkdirSync, writeFileSync } = await import('node:fs')
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), '<title>Legacy</title>')
    const r = await get('/legacy')
    expect(r.status).toBe(200)
    expect(await r.text()).toBe('<title>Legacy</title>')
  })

  it('answers an unknown path with 404.html, status 404 and a revalidating cache', async () => {
    for (const p of [
      '/nimporte-quoi',
      '/assets/x.js',
      '/ressources/inconnu/deep',
      '/ressources/inconnu',
    ]) {
      const r = await get(p)
      expect(r.status, p).toBe(404)
      expect(await r.text()).toBe(html('404.html'))
      expect(r.headers.get('cache-control')).toBe(REVALIDATE)
    }
  })

  it('answers 404 on /404*, /_not-found* and /ressources/__none*, payload files included', async () => {
    for (const p of [
      '/404',
      '/404.html',
      '/_not-found',
      '/_not-found/index.html',
      '/ressources/__none',
      '/ressources/__none.txt',
      '/ressources/__none/__next.ressources.__none.txt',
    ]) {
      const r = await get(p)
      expect(r.status, p).toBe(404)
      expect(await r.text(), p).not.toContain('must-not-be-served')
      expect(r.headers.get('cache-control'), p).toBe(REVALIDATE)
    }
  })

  it('serves every RSC payload as 200 text/plain with a revalidating cache', async () => {
    const payloads: Record<string, string> = {
      '/index.txt': 'rsc-index',
      '/formations.txt': 'rsc-formations',
      '/formations/__next.formations.__PAGE__.txt': 'rsc-formations-page',
      '/formations/__next.%24d%24slug.txt': 'rsc-dollar',
      '/formations/__next.$d$slug.txt': 'rsc-dollar',
      '/ressources/__next.ressources.txt': 'rsc-ressources',
      '/ressources/pipedrive-nouveau-lead/__next.ressources.pipedrive-nouveau-lead.txt': 'rsc-slug',
    }
    for (const [p, body] of Object.entries(payloads)) {
      const r = await get(p)
      expect(r.status, p).toBe(200)
      expect(r.headers.get('content-type'), p).toMatch(/^text\/plain/)
      expect(r.headers.get('cache-control'), p).toBe(REVALIDATE)
      expect(await r.text(), p).toBe(body)
    }
  })

  it('serves _next/static as immutable and everything else as must-revalidate', async () => {
    for (const p of ['/_next/static/chunks/x.js', '/_next/static/css/app-ff00aa11.css']) {
      const a = await get(p)
      expect(a.status).toBe(200)
      expect(a.headers.get('cache-control')).toBe('public, max-age=31536000, immutable')
    }
    const r = await get('/robots.txt')
    expect(r.headers.get('cache-control')).toBe(REVALIDATE)
  })

  it('redirects /roi and /about with a 301', async () => {
    const roi = await get('/roi')
    expect(roi.status).toBe(301)
    expect(roi.headers.get('location')).toBe('/offres/compte-rendu-appel')
    const about = await get('/about/')
    expect(about.status).toBe(301)
    expect(about.headers.get('location')).toBe('/#derriere')
  })

  it('redirects /lettre and /lettre/ to /newsletter with a 301 (the list of issues lives there)', async () => {
    for (const p of ['/lettre', '/lettre/']) {
      const r = await get(p)
      expect(r.status, p).toBe(301)
      expect(r.headers.get('location'), p).toBe('/newsletter')
    }
  })

  // US-105, US-106 (12/11): the monthly offer moved to /responsable-ia-externalise and
  // /accompagnement is gone; both old addresses answer 301 to the offer page.
  it('redirects the old offer address and /accompagnement to /responsable-ia-externalise with a 301', async () => {
    for (const p of [
      '/responsable-ia-temps-partage',
      '/responsable-ia-temps-partage/',
      '/accompagnement',
      '/accompagnement/',
    ]) {
      const r = await get(p)
      expect(r.status, p).toBe(301)
      expect(r.headers.get('location'), p).toBe('/responsable-ia-externalise')
    }
    for (const p of ['//responsable-ia-temps-partag%65', '/%61ccompagnement']) {
      const r = await raw(p)
      expect(r.status, p).toBe(301)
      expect(r.location, p).toBe('/responsable-ia-externalise')
    }
    // a target is never a key: no loop, no chain
    expect((await get('/responsable-ia-externalise')).status).not.toBe(301)
  })

  // Plan decision (12/11, kept after the K4 review): the redirect does not forward the query string,
  // UTM keys included; the Location is the bare offer path.
  it('drops the query string of the two old addresses: Location is exactly the offer path', async () => {
    for (const p of [
      '/responsable-ia-temps-partage?utm_source=x',
      '/accompagnement?utm_source=x',
    ]) {
      const r = await get(p)
      expect(r.status, p).toBe(301)
      expect(r.headers.get('location'), p).toBe('/responsable-ia-externalise')
    }
  })

  it('serves a built issue page, and 404 on the placeholder (lettre/__none*) and an unknown issue', async () => {
    const issue = await get('/lettre/2026-11-10-exemple-de-numero')
    expect(issue.status).toBe(200)
    expect(await issue.text()).toBe(html('lettre/2026-11-10-exemple-de-numero.html'))
    for (const p of [
      '/lettre/__none',
      '/lettre/__none/',
      '/lettre/__none.html',
      '/lettre/__none.txt',
      '/lettre/__none/__next.lettre.__none.txt',
      '/lettre/inconnu',
    ]) {
      const r = await get(p)
      expect(r.status, p).toBe(404)
      expect(await r.text(), p).not.toContain('must-not-be-served')
    }
  })

  it('applies the 404 list to the decoded path, slashes and dot segments resolved', async () => {
    for (const p of [
      '/lettre/%5F%5Fnone',
      '/lettre/__none%2Etxt',
      '/lettre/__none%2Ehtml',
      '/lettre/__none%2F__next.lettre.__none.txt',
      '//lettre/__none',
      '//lettre//__none.txt',
      '/lettre/./__none.txt',
      '/x/../lettre/__none.txt',
      '//_not-found',
      '/%5Fnot-found',
      '/ressources/%5F%5Fnone',
      '//ressources/__none',
      '/ressources/__none%2Etxt',
    ]) {
      const r = await raw(p)
      expect(r.status, p).toBe(404)
      expect(r.body, p).not.toContain('must-not-be-served')
    }
  })

  it('applies the redirects to the same decoded path', async () => {
    for (const [p, to] of [
      ['//lettre', '/newsletter'],
      ['/%6Cettre', '/newsletter'],
      ['//lettre//', '/newsletter'],
      ['//roi', '/offres/compte-rendu-appel'],
    ]) {
      const r = await raw(p)
      expect(r.status, p).toBe(301)
      expect(r.location, p).toBe(to)
    }
  })

  it('never crashes on a malformed escape: 400 or 404, nothing served', async () => {
    for (const p of ['/%E0%A4%A', '/lettre/%E0%A4%A', '/%']) {
      const r = await raw(p)
      expect([400, 404], p).toContain(r.status)
      expect(r.body, p).not.toContain('must-not-be-served')
    }
    expect((await get('/cgv')).status).toBe(200)
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
