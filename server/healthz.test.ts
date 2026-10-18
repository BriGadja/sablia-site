// @vitest-environment node
/** /healthz is public and says nothing but ok + release; /healthz/full (env presence) is loopback only. */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from './app'
import { listen, makeDist } from './test-helpers'

let srv: Awaited<ReturnType<typeof listen>>
const releaseFile = join(mkdtempSync(join(tmpdir(), 'sablia-rel-')), 'RELEASE')
const saved = { r: process.env.RESEND_API_KEY, s: process.env.SUPABASE_SERVICE_ROLE_KEY }

beforeAll(async () => {
  writeFileSync(releaseFile, 'abc1234-20261018T100000Z\n')
  srv = await listen(createApp({ distPath: makeDist(), releaseFile }))
})
afterAll(() => srv.close())
afterEach(() => {
  for (const [k, v] of [
    ['RESEND_API_KEY', saved.r],
    ['SUPABASE_SERVICE_ROLE_KEY', saved.s],
  ] as const) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }
})

describe('/healthz', () => {
  it('returns ok and the release, nothing else', async () => {
    const r = await fetch(`${srv.url}/healthz`)
    expect(r.status).toBe(200)
    expect(r.headers.get('content-type')).toMatch(/^application\/json/)
    expect(r.headers.get('cache-control')).toBe('no-store')
    expect(await r.json()).toEqual({ ok: true, release: 'abc1234-20261018T100000Z' })
  })

  it('reports the env presence booleans on /healthz/full from loopback only, never values', async () => {
    process.env.RESEND_API_KEY = 're_secret_value_12345678901234567890'
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    const r = await fetch(`${srv.url}/healthz/full`)
    expect(r.status).toBe(200)
    const text = await r.text()
    expect(text).not.toContain('re_secret_value')
    expect(JSON.parse(text)).toEqual({
      ok: true,
      release: 'abc1234-20261018T100000Z',
      api: { contact: false, ressources: false },
    })
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-value'
    const ok = await (await fetch(`${srv.url}/healthz/full`)).json()
    expect(ok.api).toEqual({ contact: true, ressources: true })
  })

  it('refuses /healthz/full when the request came through the proxy from a public address', async () => {
    const r = await fetch(`${srv.url}/healthz/full`, {
      headers: { 'x-forwarded-for': '203.0.113.9' },
    })
    expect(r.status).toBe(403)
  })

  it('says "dev" when no RELEASE file exists', async () => {
    const s = await listen(createApp({ distPath: makeDist(), releaseFile: '/nonexistent/RELEASE' }))
    try {
      expect(await (await fetch(`${s.url}/healthz`)).json()).toEqual({ ok: true, release: 'dev' })
    } finally {
      await s.close()
    }
  })
})
