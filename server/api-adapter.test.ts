// @vitest-environment node
/**
 * US-4 / US-5 / US-7 / US-8 through Express: the Fetch handlers in api/ answer exactly as they did
 * as Vercel Functions (measured 2026-10-18: GET → 405 + allow: POST with an empty body, POST {} →
 * 400 JSON, cache-control public, max-age=0, must-revalidate). Every case here answers BEFORE any
 * I/O to Resend or Supabase.
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from './app'
import { listen, makeDist } from './test-helpers'

let srv: Awaited<ReturnType<typeof listen>>
const saved = { r: process.env.RESEND_API_KEY, s: process.env.SUPABASE_SERVICE_ROLE_KEY }

beforeAll(async () => {
  delete process.env.RESEND_API_KEY
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  srv = await listen(createApp({ distPath: makeDist(), releaseFile: '/nonexistent' }))
})
afterAll(() => srv.close())
afterEach(() => {
  delete process.env.RESEND_API_KEY
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
})
afterAll(() => {
  for (const [k, v] of [
    ['RESEND_API_KEY', saved.r],
    ['SUPABASE_SERVICE_ROLE_KEY', saved.s],
  ] as const) {
    if (v !== undefined) process.env[k] = v
  }
})

const post = (path: string, body: unknown, raw = false) =>
  fetch(srv.url + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: raw ? (body as string) : JSON.stringify(body),
  })

const CONTACT = {
  name: 'Claire Martin',
  company: 'Atelier Verde',
  email: 'claire@atelier-verde.example',
  teamSize: '2_à_5_personnes',
  message: 'Nous voulons relier Pipedrive à Claude',
  website: '',
  elapsedMs: 9000,
}
const RESSOURCE = {
  prenom: 'Claire',
  email: 'claire@atelier-verde.example',
  slug: 'pipedrive-nouveau-lead',
  contact: false,
  website: '',
  elapsedMs: 9000,
}

describe.each([
  ['/api/contact', CONTACT],
  ['/api/ressources-request', RESSOURCE],
])('%s', (path, valid) => {
  it('answers a GET with 405, allow: POST and an empty body', async () => {
    const r = await fetch(srv.url + path)
    expect(r.status).toBe(405)
    expect(r.headers.get('allow')).toBe('POST')
    expect(await r.text()).toBe('')
    expect(r.headers.get('cache-control')).toBe('public, max-age=0, must-revalidate')
  })

  it('answers a HEAD with 405 and allow: POST', async () => {
    const r = await fetch(srv.url + path, { method: 'HEAD' })
    expect(r.status).toBe(405)
    expect(r.headers.get('allow')).toBe('POST')
  })

  it('answers {} with 400 invalid_payload as JSON', async () => {
    const r = await post(path, {})
    expect(r.status).toBe(400)
    expect(r.headers.get('content-type')).toMatch(/^application\/json/)
    expect((await r.json()).code).toBe('invalid_payload')
  })

  it('answers broken JSON with 400 bad_json', async () => {
    const r = await post(path, '{not json', true)
    expect(r.status).toBe(400)
    expect((await r.json()).code).toBe('bad_json')
  })

  it('answers the honeypot and the too-fast submit with 204 and no body', async () => {
    const bot = await post(path, { ...valid, website: 'http://spam.example' })
    expect(bot.status).toBe(204)
    expect(await bot.text()).toBe('')
    const fast = await post(path, { ...valid, elapsedMs: 800 })
    expect(fast.status).toBe(204)
  })

  it('answers 500 not_configured when the keys are absent (no I/O)', async () => {
    const r = await post(path, valid)
    expect(r.status).toBe(500)
    expect((await r.json()).code).toBe('not_configured')
  })

  it('answers 413 payload_too_large above 100 kB, before the handler parses anything', async () => {
    const r = await post(path, { ...valid, message: 'x'.repeat(150_000) })
    expect(r.status).toBe(413)
    expect((await r.json()).code).toBe('payload_too_large')
  })
})

describe('other /api paths', () => {
  it('answers 404 (Vercel has no function there), never the SPA shell', async () => {
    for (const p of ['/api/nope', '/api/', '/api/contact/extra']) {
      const r = await fetch(srv.url + p)
      expect(r.status).toBe(404)
      expect(r.headers.get('content-type')).not.toMatch(/html/)
    }
  })
})
