// @vitest-environment node
/** Hardening of the production app (plan Decision 1): headers, no crash on a thrown error, quiet logs. */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { createApp } from './app'
import { listen, makeDist } from './test-helpers'

let srv: Awaited<ReturnType<typeof listen>>
beforeAll(async () => {
  const app = createApp({
    distPath: makeDist(),
    releaseFile: '/nonexistent',
    extraRoutes: (a) =>
      a.get('/__boom', () => {
        throw new Error('kaboom')
      }),
  })
  srv = await listen(app)
})
afterAll(() => srv.close())

describe('createApp', () => {
  it('does not advertise Express and sends the security headers Vercel/Caddy agree on', async () => {
    const r = await fetch(`${srv.url}/`)
    expect(r.headers.get('x-powered-by')).toBeNull()
    expect(r.headers.get('strict-transport-security')).toBe('max-age=63072000')
    expect(r.headers.get('x-content-type-options')).toBe('nosniff')
    expect(r.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
  })

  it('answers a thrown route error with a JSON 500 and stays up (the old middleware re-threw)', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await fetch(`${srv.url}/__boom`)
    expect(r.status).toBe(500)
    expect((await r.json()).code).toBe('internal')
    const again = await fetch(`${srv.url}/`)
    expect(again.status).toBe(200)
    err.mockRestore()
  })

  it('never logs an API response body', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    await fetch(`${srv.url}/api/contact`, {
      method: 'POST',
      body: '{}',
      headers: { 'content-type': 'application/json' },
    })
    await new Promise((r) => setTimeout(r, 50))
    const logged = log.mock.calls.map((c) => c.join(' ')).join('\n')
    log.mockRestore()
    expect(logged).not.toContain('invalid_payload')
  })
})
