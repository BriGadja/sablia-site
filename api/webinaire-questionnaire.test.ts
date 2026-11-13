import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { decide, isToken } from './webinaire-questionnaire'

/**
 * US-90. A GET never writes; a POST writes once (conditional PATCH on `submitted_at is null`);
 * the e-mail never leaves the server. Fakes only: the live round trip is the unit's e2e.
 */

const TOKEN = 'a1'.repeat(32)
const answers = (over: Record<string, unknown> = {}) => ({
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`q${i + 1}`, `réponse ${i + 1}`])),
  ...over,
})

interface Call {
  url: string
  method: string
  body: unknown
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

interface World {
  /** Row of the questionnaires table, absent = unknown token. */
  token?: { registration_id: string | null; submitted_at: string | null; email?: string }
  prenom?: string
  patchStatus?: number
}

function world(w: World = {}) {
  const calls: Call[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET'
      const body = init?.body ? JSON.parse(String(init.body)) : undefined
      calls.push({ url, method, body })
      if (url.includes('site_webinar_questionnaires')) {
        if (method === 'GET') return json(w.token ? [w.token] : [])
        if (method === 'PATCH') {
          if (w.patchStatus) return json({ message: 'boom' }, w.patchStatus)
          // The conditional PATCH only matches an unsubmitted row.
          return json(w.token && w.token.submitted_at === null ? [{ token: TOKEN }] : [])
        }
      }
      if (url.includes('site_webinar_registrations') && method === 'GET') {
        return json(w.prenom ? [{ prenom: w.prenom, email: 'secret@exemple.fr' }] : [])
      }
      throw new Error(`unexpected fetch ${method} ${url}`)
    }),
  )
  return calls
}

const get = (query: string) =>
  handler.fetch(new Request(`https://sablia.io/api/webinaire-questionnaire${query}`))
const post = (body: unknown) =>
  handler.fetch(
    new Request('https://sablia.io/api/webinaire-questionnaire', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
const writes = (calls: Call[]) => calls.filter((c) => c.method !== 'GET')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})
const env = () => vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key')

describe('token format', () => {
  it('accepts exactly 64 lower-case hex chars', () => {
    expect(isToken(TOKEN)).toBe(true)
    expect(isToken(TOKEN.toUpperCase())).toBe(false)
    expect(isToken(TOKEN.slice(1))).toBe(false)
    expect(isToken(`${TOKEN}0`)).toBe(false)
    expect(isToken('z'.repeat(64))).toBe(false)
    expect(isToken("' or 1=1 --")).toBe(false)
    expect(isToken(undefined)).toBe(false)
  })
})

describe('decide', () => {
  it('accepts exactly q1..q10, empty strings allowed', () => {
    const blank = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`q${i + 1}`, '']))
    expect(decide({ token: TOKEN, answers: blank }).kind).toBe('accept')
    expect(decide({ token: TOKEN, answers: answers() }).kind).toBe('accept')
  })

  it('rejects a missing, extra or non-string key and an oversize answer', () => {
    const { q10: _q10, ...nine } = answers()
    expect(decide({ token: TOKEN, answers: nine }).kind).toBe('invalid')
    expect(decide({ token: TOKEN, answers: answers({ q11: 'x' }) }).kind).toBe('invalid')
    expect(decide({ token: TOKEN, answers: answers({ q3: 42 }) }).kind).toBe('invalid')
    expect(decide({ token: TOKEN, answers: answers({ q3: 'x'.repeat(1001) }) }).kind).toBe(
      'invalid',
    )
    expect(decide({ token: TOKEN, answers: answers({ q3: 'x'.repeat(1000) }) }).kind).toBe('accept')
    expect(decide({ token: TOKEN, answers: 'nope' }).kind).toBe('invalid')
    expect(decide({ token: TOKEN, answers: answers(), extra: 1 }).kind).toBe('invalid')
  })

  it('answers 204 to a honeypot or a too-fast submit, after validation', () => {
    expect(decide({ token: TOKEN, answers: answers(), website: 'http://spam' })).toEqual({
      kind: 'ignore',
    })
    expect(decide({ token: TOKEN, answers: answers(), elapsedMs: 2999 })).toEqual({
      kind: 'ignore',
    })
    expect(decide({ token: TOKEN, answers: answers(), elapsedMs: 3000, website: '' }).kind).toBe(
      'accept',
    )
  })
})

describe('GET ?t=', () => {
  it('returns the first name and nothing else, never the e-mail, and writes nothing', async () => {
    env()
    const calls = world({
      token: { registration_id: 'reg-1', submitted_at: null, email: 'secret@exemple.fr' },
      prenom: 'Claire',
    })
    const r = await get(`?t=${TOKEN}`)
    expect(r.status).toBe(200)
    const text = await r.text()
    expect(JSON.parse(text)).toEqual({ prenom: 'Claire' })
    expect(text).not.toContain('@')
    expect(writes(calls)).toHaveLength(0)
  })

  it('answers 404 for an unknown token, with no write', async () => {
    env()
    const calls = world({})
    expect((await get(`?t=${TOKEN}`)).status).toBe(404)
    expect(writes(calls)).toHaveLength(0)
  })

  it('rejects a malformed or missing token before any I/O (404)', async () => {
    env()
    const calls = world({})
    expect((await get('?t=abc')).status).toBe(404)
    expect((await get('')).status).toBe(404)
    expect(calls).toHaveLength(0)
  })

  it('gives an empty first name when the token has no registration', async () => {
    env()
    world({ token: { registration_id: null, submitted_at: null } })
    const r = await get(`?t=${TOKEN}`)
    expect(await r.json()).toEqual({ prenom: '' })
  })
})

describe('POST', () => {
  it('writes answers and submitted_at once, with a conditional PATCH', async () => {
    env()
    const calls = world({ token: { registration_id: 'reg-1', submitted_at: null } })
    const r = await post({ token: TOKEN, answers: answers(), elapsedMs: 20000 })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'saved' })
    const [w] = writes(calls)
    expect(w?.method).toBe('PATCH')
    expect(w?.url).toContain(`token=eq.${TOKEN}`)
    expect(w?.url).toContain('submitted_at=is.null')
    const body = w?.body as { answers: Record<string, string>; submitted_at: string }
    expect(Object.keys(body.answers)).toHaveLength(10)
    expect(Number.isNaN(Date.parse(body.submitted_at))).toBe(false)
  })

  it('answers 409 to a second submit (the conditional PATCH matched nothing)', async () => {
    env()
    world({ token: { registration_id: 'reg-1', submitted_at: '2026-11-10T10:00:00Z' } })
    const r = await post({ token: TOKEN, answers: answers() })
    expect(r.status).toBe(409)
  })

  it('answers 404 for an unknown token', async () => {
    env()
    world({})
    expect((await post({ token: TOKEN, answers: answers() })).status).toBe(404)
  })

  it('answers 400 on oversize, bad JSON or a bad token, with no I/O', async () => {
    env()
    const calls = world({ token: { registration_id: 'reg-1', submitted_at: null } })
    expect((await post({ token: TOKEN, answers: answers({ q1: 'x'.repeat(1001) }) })).status).toBe(
      400,
    )
    expect((await post({ token: 'short', answers: answers() })).status).toBe(400)
    const bad = await handler.fetch(
      new Request('https://sablia.io/api/webinaire-questionnaire', { method: 'POST', body: '{' }),
    )
    expect(bad.status).toBe(400)
    expect(calls).toHaveLength(0)
  })

  it('answers 204 with no I/O to a honeypot', async () => {
    env()
    const calls = world({})
    const r = await post({ token: TOKEN, answers: answers(), website: 'x' })
    expect(r.status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('answers 500 without leaking when the table fails, and when the key is missing', async () => {
    env()
    world({ token: { registration_id: null, submitted_at: null }, patchStatus: 500 })
    const r = await post({ token: TOKEN, answers: answers() })
    expect(r.status).toBe(500)
    expect(JSON.stringify(await r.json())).not.toContain(TOKEN)
    vi.unstubAllEnvs()
    const r2 = await post({ token: TOKEN, answers: answers() })
    expect(r2.status).toBe(500)
  })
})

describe('methods', () => {
  it('405 with allow GET, POST otherwise', async () => {
    for (const method of ['PUT', 'DELETE', 'PATCH']) {
      const r = await handler.fetch(
        new Request('https://sablia.io/api/webinaire-questionnaire', { method }),
      )
      expect(r.status).toBe(405)
      expect(r.headers.get('allow')).toBe('GET, POST')
    }
  })
})
