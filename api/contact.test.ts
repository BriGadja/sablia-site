/**
 * Contract of the contact function. Written before `contact.ts` existed: the honeypot and the
 * delay must answer 204 WITHOUT touching the CRM or the mailer, and a valid submission must reach
 * PostgREST before Resend, so the mail can carry the lead id.
 *
 * The dedup path (challenge round 1, DA #1) is part of the contract, not an optimisation:
 * `idx_sabcrm_leads_email` is non-unique, so a visitor retrying after a slow answer would silently
 * create a second lead. A GET on the last ten minutes is what refuses it.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler, { decide, leadRow, mailPayload } from './contact'

const VALID = {
  name: 'Nom Test',
  company: 'Société Test',
  email: 'Visiteur@Example.COM',
  teamSize: '2_à_5_personnes',
  message: 'Nous préparons un séminaire en novembre.',
  website: '',
  elapsedMs: 9000,
} as const

const LEADS_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co/rest/v1/sabcrm_leads'
const RESEND_URL = 'https://api.resend.com/emails'

interface Call {
  url: string
  method: string
  headers: Record<string, string>
  body: string | undefined
}

/** Replaces global fetch; `responder` decides per (url, method). Returns the recorded calls. */
function stubFetch(responder: (call: Call) => Response): Call[] {
  const calls: Call[] = []
  vi.stubGlobal('fetch', (input: unknown, init?: RequestInit) => {
    const call: Call = {
      url: String(input),
      method: (init?.method ?? 'GET').toUpperCase(),
      headers: (init?.headers ?? {}) as Record<string, string>,
      body: typeof init?.body === 'string' ? init.body : undefined,
    }
    calls.push(call)
    return Promise.resolve(responder(call))
  })
  return calls
}

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } })

/** Happy path: no recent lead, insert accepted, mail accepted. */
const happyResponder = (call: Call) => {
  if (call.url === RESEND_URL) return json({ id: 're_test_1' })
  if (call.method === 'GET') return json([])
  return json([{ id: 'lead-created-1' }], 201)
}

const post = (body: string) =>
  handler.fetch(
    new Request('https://sablia.io/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    }),
  )

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 're_test_key')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service_role_test')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('decide()', () => {
  it('accepts a valid payload', () => {
    const d = decide(VALID)
    expect(d.kind).toBe('accept')
    if (d.kind === 'accept') {
      expect(d.value.email).toBe('visiteur@example.com')
      expect(d.value.company).toBe('Société Test')
    }
  })

  it('ignores a filled honeypot without looking any further', () => {
    expect(decide({ ...VALID, website: 'http://spam.example' })).toEqual({
      kind: 'ignore',
      reason: 'honeypot',
    })
  })

  it('ignores a submission sent less than 3 seconds after the form mounted', () => {
    expect(decide({ ...VALID, elapsedMs: 500 })).toEqual({ kind: 'ignore', reason: 'too_fast' })
  })

  it('refuses a missing or malformed email', () => {
    for (const email of [undefined, '', 'pas-une-adresse']) {
      const d = decide({ ...VALID, email })
      expect(d.kind).toBe('invalid')
      if (d.kind === 'invalid') {
        expect(d.code).toBe('invalid_payload')
        expect(d.error).toContain('email')
      }
    }
  })

  it('refuses a team size outside the four portal values', () => {
    const d = decide({ ...VALID, teamSize: 'une_grosse_equipe' })
    expect(d.kind).toBe('invalid')
    if (d.kind === 'invalid') expect(d.error).toContain('teamSize')
  })

  it('refuses a message longer than 3000 characters', () => {
    expect(decide({ ...VALID, message: 'x'.repeat(3001) }).kind).toBe('invalid')
  })

  it('refuses a body that is not an object', () => {
    expect(decide('nope').kind).toBe('invalid')
    expect(decide(null).kind).toBe('invalid')
  })
})

describe('leadRow()', () => {
  const d = decide(VALID)
  if (d.kind !== 'accept') throw new Error('fixture must be valid')
  const row = leadRow(d.value, new Date('2026-09-18T10:00:00.000Z'))

  it('marks the lead as a formation lead owned by Brice, at stage nouveau', () => {
    expect(row.source).toBe('formation')
    expect(row.owner).toBe('Brice')
    expect(row.stage).toBe('nouveau')
  })

  it('carries the visitor fields the CRM reads', () => {
    expect(row.full_name).toBe('Nom Test')
    expect(row.email).toBe('visiteur@example.com')
    expect(row.company).toBe('Société Test')
    expect(row.team_size).toBe('2_à_5_personnes')
    expect(row.project_details).toBe('Nous préparons un séminaire en novembre.')
    expect(row.lead_date).toBe('2026-09-18')
  })

  it('signs the write and records where the lead came from', () => {
    expect(row.updated_by).toBe('sablia-site/api/contact')
    expect(row.raw.origin).toBe('sablia.io/#contact')
  })
})

describe('mailPayload()', () => {
  const d = decide(VALID)
  if (d.kind !== 'accept') throw new Error('fixture must be valid')
  const mail = mailPayload(d.value, 'lead-created-1')

  it('goes to Brice, from the transactional domain, answerable to the visitor', () => {
    expect(mail.to).toEqual(['brice@sablia.io'])
    expect(mail.from.endsWith('<site@send.sablia.io>')).toBe(true)
    expect(mail.reply_to).toBe('visiteur@example.com')
  })

  it('names the company in the subject and carries the lead id in the body', () => {
    expect(mail.subject).toContain('Société Test')
    expect(mail.text).toContain('lead-created-1')
    expect(mail.text).toContain('Nous préparons un séminaire en novembre.')
  })

  it('says so when no CRM row could be created', () => {
    expect(mailPayload(d.value, null).text).toContain('ligne CRM non créée')
  })
})

describe('POST /api/contact', () => {
  it('refuses a method other than POST', async () => {
    const calls = stubFetch(happyResponder)
    const res = await handler.fetch(new Request('https://sablia.io/api/contact'))
    expect(res.status).toBe(405)
    expect(res.headers.get('allow')).toBe('POST')
    expect(calls).toHaveLength(0)
  })

  it('refuses a body that is not JSON, without any I/O', async () => {
    const calls = stubFetch(happyResponder)
    const res = await post('{')
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ code: 'bad_json' })
    expect(calls).toHaveLength(0)
  })

  it('answers 204 to a filled honeypot, and touches nothing', async () => {
    const calls = stubFetch(happyResponder)
    const res = await post(JSON.stringify({ ...VALID, website: 'http://spam.example' }))
    expect(res.status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('answers 204 to a submission sent too fast, and touches nothing', async () => {
    const calls = stubFetch(happyResponder)
    const res = await post(JSON.stringify({ ...VALID, elapsedMs: 500 }))
    expect(res.status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('answers 400 to an invalid payload', async () => {
    const calls = stubFetch(happyResponder)
    const res = await post(JSON.stringify({ ...VALID, email: 'pas-une-adresse' }))
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject({ code: 'invalid_payload' })
    expect(calls).toHaveLength(0)
  })

  it('answers 500 when the server is not configured, and touches nothing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = stubFetch(happyResponder)
    const res = await post(JSON.stringify(VALID))
    expect(res.status).toBe(500)
    expect(await res.json()).toMatchObject({ code: 'not_configured' })
    expect(calls).toHaveLength(0)
  })

  it('looks the lead up, inserts it, then mails Brice — in that order', async () => {
    const calls = stubFetch(happyResponder)
    const res = await post(JSON.stringify(VALID))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, lead: true })
    expect(calls).toHaveLength(3)
    expect(calls[0].method).toBe('GET')
    expect(calls[0].url.startsWith(`${LEADS_URL}?`)).toBe(true)
    expect(calls[1].method).toBe('POST')
    expect(calls[1].url).toBe(LEADS_URL)
    expect(calls[2].url).toBe(RESEND_URL)
    expect(calls[2].headers.Authorization).toBe('Bearer re_test_key')
    expect(JSON.parse(calls[1].body ?? '{}')).toMatchObject({ source: 'formation', owner: 'Brice' })
  })

  it('does not create a second lead when the same address wrote minutes ago', async () => {
    const calls = stubFetch((call) => {
      if (call.url === RESEND_URL) return json({ id: 're_test_2' })
      if (call.method === 'GET') return json([{ id: 'lead-existing-1' }])
      return json([{ id: 'lead-created-2' }], 201)
    })
    const res = await post(JSON.stringify(VALID))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, lead: true })
    expect(calls.filter((c) => c.url.startsWith(LEADS_URL) && c.method === 'POST')).toHaveLength(0)
    expect(calls.filter((c) => c.method === 'GET')).toHaveLength(1)
    expect(calls.filter((c) => c.url === RESEND_URL)).toHaveLength(1)
    expect(calls[calls.length - 1].body).toContain('lead-existing-1')
  })

  it('falls through to the insert when the lookup itself fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = stubFetch((call) => {
      if (call.url === RESEND_URL) return json({ id: 're_test_3' })
      if (call.method === 'GET') return new Response('boom', { status: 500 })
      return json([{ id: 'lead-created-3' }], 201)
    })
    const res = await post(JSON.stringify(VALID))

    expect(res.status).toBe(200)
    expect(calls.filter((c) => c.url === LEADS_URL && c.method === 'POST')).toHaveLength(1)
    errorSpy.mockRestore()
  })

  it('still answers 200 when the CRM refuses the row — the mail is the channel', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = stubFetch((call) => {
      if (call.url === RESEND_URL) return json({ id: 're_test_4' })
      if (call.method === 'GET') return json([])
      return new Response('duplicate key', { status: 409 })
    })
    const res = await post(JSON.stringify(VALID))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, lead: false })
    expect(calls.filter((c) => c.url === RESEND_URL)).toHaveLength(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
    errorSpy.mockRestore()
  })

  it('answers 502 when the mail cannot be sent', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    stubFetch((call) => {
      if (call.url === RESEND_URL) return new Response('rate limited', { status: 429 })
      if (call.method === 'GET') return json([])
      return json([{ id: 'lead-created-5' }], 201)
    })
    const res = await post(JSON.stringify(VALID))
    expect(res.status).toBe(502)
    expect(await res.json()).toMatchObject({ code: 'mail_failed' })
  })
})
