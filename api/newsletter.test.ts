/**
 * Contract of `POST /api/newsletter` (US-81, US-83; plan sablia-newsletter-resend, C1). Written before
 * `newsletter.ts` existed.
 *
 * The three properties that cost the most if they break:
 * - the public form (`request`) NEVER writes `sabcrm_leads`: every insert there pages the sales group,
 *   so an unconfirmed request lives in `site_newsletter_pending` until the click;
 * - the answer is the same for a new, a subscribed and an opposed address (the form is not an oracle);
 * - a person is `lower(email)` across rows, and every write lands on the OLDEST row.
 *
 * Supabase is a small in-memory PostgREST (filters eq/gte/lt/is/ilike, order, limit, representation)
 * behind a stubbed `fetch`; Resend answers whatever the test sets. Zero network.
 */
import { createHash } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './newsletter'

const REST = 'https://qlxoitzdxjqhljjoeqoq.supabase.co/rest/v1'
const RESEND_URL = 'https://api.resend.com/emails'
const NOW = new Date('2026-10-29T10:00:00.000Z')
const NOW_ISO = NOW.toISOString()
const IP = '203.0.113.7'
const IP_HASH = createHash('sha256').update(IP).digest('hex')
const TOKEN = '6f1c2a9e-4b7d-4c1e-9a3f-2d5e8b7c1a40'

const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString()
const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

interface Call {
  url: string
  method: string
  headers: Record<string, string>
  body: unknown
}

type Row = Record<string, unknown>

/** A LIKE pattern as PostgREST reads it: `*` and `%` match anything, `_` one character, `\x` is x. */
function likeRegex(pattern: string): RegExp {
  let source = ''
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i] as string
    if (c === '\\' && i + 1 < pattern.length) {
      source += (pattern[++i] as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    } else if (c === '*' || c === '%') source += '.*'
    else if (c === '_') source += '.'
    else source += c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${source}$`, 'i')
}

function matches(row: Row, params: URLSearchParams): boolean {
  for (const [key, raw] of params) {
    if (key === 'select' || key === 'order' || key === 'limit') continue
    const dot = raw.indexOf('.')
    const op = raw.slice(0, dot)
    const value = raw.slice(dot + 1)
    const cell = row[key]
    if (op === 'eq') {
      if (cell === null || cell === undefined || String(cell) !== value) return false
    } else if (op === 'gte') {
      if (typeof cell !== 'string' || cell < value) return false
    } else if (op === 'lt') {
      if (typeof cell !== 'string' || !(cell < value)) return false
    } else if (op === 'is') {
      if (value !== 'null') throw new Error(`fake PostgREST: is.${value}`)
      if (cell !== null && cell !== undefined) return false
    } else if (op === 'ilike') {
      if (typeof cell !== 'string' || !likeRegex(value).test(cell)) return false
    } else {
      throw new Error(`fake PostgREST: unsupported operator ${op} on ${key}`)
    }
  }
  return true
}

/** The two tables, plus every call in order. */
class Fake {
  pending: Row[] = []
  leads: Row[] = []
  calls: Call[] = []
  resend: () => Response = () => json({ id: 're_test_1' })
  private seq = 0

  table(name: 'site_newsletter_pending' | 'sabcrm_leads'): Row[] {
    return name === 'site_newsletter_pending' ? this.pending : this.leads
  }

  respond(call: Call): Response {
    if (call.url === RESEND_URL) return this.resend()
    const url = new URL(call.url)
    const name = url.pathname.replace('/rest/v1/', '')
    if (name !== 'site_newsletter_pending' && name !== 'sabcrm_leads') {
      throw new Error(`fake PostgREST: unknown table ${name}`)
    }
    const rows = this.table(name)
    const params = url.searchParams
    const representation = (call.headers.Prefer ?? '').includes('return=representation')

    if (call.method === 'GET') {
      let found = rows.filter((r) => matches(r, params))
      if (params.get('order') === 'created_at.asc') {
        found = [...found].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
      }
      const limit = params.get('limit')
      if (limit) found = found.slice(0, Number(limit))
      return json(found.map((r) => ({ ...r })))
    }
    if (call.method === 'POST') {
      const body = call.body as Row
      const row: Row =
        name === 'site_newsletter_pending'
          ? {
              token: `00000000-0000-4000-8000-${String(++this.seq).padStart(12, '0')}`,
              found_via: null,
              ip_hash: null,
              confirmed_at: null,
              lead_id: null,
              created_at: new Date().toISOString(),
              ...body,
            }
          : {
              id: `lead-new-${++this.seq}`,
              optout_token: `11111111-0000-4000-8000-${String(this.seq).padStart(12, '0')}`,
              opted_out_at: null,
              archived_at: null,
              created_at: new Date().toISOString(),
              ...body,
            }
      rows.push(row)
      return representation ? json([{ ...row }], 201) : new Response(null, { status: 201 })
    }
    if (call.method === 'PATCH') {
      const hit = rows.filter((r) => matches(r, params))
      for (const r of hit) Object.assign(r, call.body as Row)
      return representation ? json(hit.map((r) => ({ ...r }))) : new Response(null, { status: 204 })
    }
    if (call.method === 'DELETE') {
      const keep = rows.filter((r) => !matches(r, params))
      rows.splice(0, rows.length, ...keep)
      return new Response(null, { status: 204 })
    }
    throw new Error(`fake PostgREST: ${call.method}`)
  }

  install() {
    vi.stubGlobal('fetch', async (input: unknown, init?: RequestInit) => {
      const raw = typeof init?.body === 'string' ? init.body : undefined
      const call: Call = {
        url: String(input),
        method: (init?.method ?? 'GET').toUpperCase(),
        headers: (init?.headers ?? {}) as Record<string, string>,
        body: raw === undefined ? undefined : JSON.parse(raw),
      }
      this.calls.push(call)
      // One tick before answering, so two concurrent requests interleave like real I/O.
      await Promise.resolve()
      return this.respond(call)
    })
    return this
  }

  writes(table: string) {
    return this.calls.filter((c) => c.url.startsWith(`${REST}/${table}`) && c.method !== 'GET')
  }
  mails() {
    return this.calls.filter((c) => c.url === RESEND_URL)
  }
}

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } })

const post = (body: unknown, ip = IP) =>
  handler.fetch(
    new Request('https://sablia.io/api/newsletter', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

const REQUEST = {
  kind: 'request',
  prenom: 'Léa',
  email: 'Lea@Exemple.FR',
  website: '',
  elapsedMs: 8000,
  foundVia: 'youtube',
} as const

function lead(overrides: Row): Row {
  return {
    id: 'lead-x',
    email: 'someone@exemple.fr',
    full_name: 'Someone',
    optout_token: '22222222-0000-4000-8000-000000000001',
    opted_out_at: null,
    archived_at: null,
    newsletter_subscribed_at: null,
    newsletter_unsubscribed_at: null,
    stage: 'a_contacter',
    owner: 'Raphael',
    intention: 'veut_un_echange',
    created_at: '2026-05-01T09:00:00.000Z',
    ...overrides,
  }
}

function pendingRow(overrides: Row): Row {
  return {
    token: TOKEN,
    email: 'lea@exemple.fr',
    prenom: 'Léa',
    found_via: 'youtube',
    ip_hash: IP_HASH,
    created_at: ago(2 * HOUR),
    confirmed_at: null,
    lead_id: null,
    ...overrides,
  }
}

let fake: Fake

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  vi.stubEnv('RESEND_API_KEY', 're_test_key')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service_role_test')
  fake = new Fake().install()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('POST /api/newsletter — request (public form)', () => {
  it('demande : purge, then the pending INSERT, then Resend, in that order; the CRM is never written', async () => {
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'pending' })

    const order = fake.calls
      .filter((c) => c.method !== 'GET')
      .map((c) => `${c.method} ${new URL(c.url).pathname.split('/').pop()}`)
    expect(order).toEqual([
      'DELETE site_newsletter_pending',
      'POST site_newsletter_pending',
      'POST emails',
    ])
    expect(fake.writes('sabcrm_leads')).toHaveLength(0)

    const insert = fake.writes('site_newsletter_pending').find((c) => c.method === 'POST')
    expect(insert?.body).toEqual({
      email: 'lea@exemple.fr',
      prenom: 'Léa',
      found_via: 'youtube',
      ip_hash: IP_HASH,
    })
    expect(JSON.stringify(fake.pending)).not.toContain(IP)

    const [mail] = fake.mails()
    const token = String(fake.pending[0]?.token)
    expect(mail?.headers['Idempotency-Key']).toBe(`newsletter-confirm-${token}`)
    const payload = mail?.body as Record<string, unknown>
    expect(payload.from).toBe('Brice Gachadoat <brice@send.sablia.io>')
    expect(payload.reply_to).toBe('brice@sablia.io')
    expect(payload.to).toEqual(['lea@exemple.fr'])
    expect(payload.subject).toBe("Confirmez votre inscription à L'IA au travail")
    for (const part of [payload.text, payload.html]) {
      expect(String(part)).toContain(`https://sablia.io/newsletter?c=${token}`)
      expect(String(part)).toContain('sous 7 jours')
    }
  })

  it('demande : the purge deletes unconfirmed rows older than 7 days and keeps the confirmed proofs', async () => {
    fake.pending.push(
      pendingRow({ token: 'old-unconfirmed', email: 'a@exemple.fr', created_at: ago(8 * DAY) }),
      pendingRow({
        token: 'old-proof',
        email: null,
        prenom: null,
        ip_hash: null,
        created_at: ago(30 * DAY),
        confirmed_at: ago(29 * DAY),
      }),
      pendingRow({ token: 'young', email: 'b@exemple.fr', created_at: ago(6 * DAY) }),
    )
    await post(REQUEST)
    const purge = fake.calls.find((c) => c.method === 'DELETE')
    const params = new URL(String(purge?.url)).searchParams
    expect(params.get('confirmed_at')).toBe('is.null')
    expect(params.get('created_at')).toBe(`lt.${ago(7 * DAY)}`)
    expect(fake.pending.map((p) => p.token)).toEqual(expect.arrayContaining(['old-proof', 'young']))
    expect(fake.pending.map((p) => p.token)).not.toContain('old-unconfirmed')
  })

  it('demande : a second request for the same address within the hour sends no second mail', async () => {
    fake.pending.push(pendingRow({ created_at: ago(20 * 60 * 1000) }))
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'pending' })
    expect(fake.mails()).toHaveLength(0)
    expect(fake.writes('site_newsletter_pending').filter((c) => c.method === 'POST')).toHaveLength(
      0,
    )
  })

  it('plafond : the 31st request of the UTC day → 429 busy with Retry-After, no write, no mail, one log line', async () => {
    for (let i = 0; i < 30; i++) {
      fake.pending.push(
        pendingRow({
          token: `t-${i}`,
          email: `v${i}@exemple.fr`,
          ip_hash: `other-${i}`,
          created_at: ago((i + 1) * 60 * 1000),
        }),
      )
    }
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await post(REQUEST)
    expect(r.status).toBe(429)
    expect((await r.json()).code).toBe('busy')
    // 10:00 UTC → 14 hours until the next UTC day.
    expect(r.headers.get('retry-after')).toBe(String(14 * 60 * 60))
    expect(fake.writes('site_newsletter_pending').filter((c) => c.method === 'POST')).toHaveLength(
      0,
    )
    expect(fake.mails()).toHaveLength(0)
    expect(log.mock.calls.filter((c) => c[0] === 'newsletter: daily ceiling reached')).toHaveLength(
      1,
    )
  })

  it('plafond : the 4th request from one IP in the UTC day → 429, no write; yesterday does not count', async () => {
    fake.pending.push(
      pendingRow({ token: 'y-1', email: 'old@exemple.fr', created_at: ago(11 * HOUR) }),
      ...[1, 2, 3].map((i) =>
        pendingRow({ token: `ip-${i}`, email: `ip${i}@exemple.fr`, created_at: ago(i * HOUR) }),
      ),
    )
    const blocked = await post(REQUEST)
    expect(blocked.status).toBe(429)
    expect((await blocked.json()).code).toBe('busy')
    expect(fake.writes('site_newsletter_pending').filter((c) => c.method === 'POST')).toHaveLength(
      0,
    )

    // Another address on the same network, after one of the three rows has gone (yesterday's never counted).
    fake.pending.splice(
      fake.pending.findIndex((p) => p.token === 'ip-3'),
      1,
    )
    const allowed = await post({ ...REQUEST, email: 'autre@exemple.fr' })
    expect(allowed.status).toBe(200)
    expect(fake.mails()).toHaveLength(1)
  })

  it('déjà abonné : 200 pending like a new address, zero write, zero mail', async () => {
    fake.leads.push(
      lead({
        id: 'lead-a',
        email: 'LEA@exemple.fr',
        newsletter_subscribed_at: '2026-10-20T08:00:00.000Z',
      }),
    )
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'pending' })
    expect(fake.writes('site_newsletter_pending').filter((c) => c.method === 'POST')).toHaveLength(
      0,
    )
    expect(fake.writes('sabcrm_leads')).toHaveLength(0)
    expect(fake.mails()).toHaveLength(0)
  })

  it('opposé : 200 pending like a new address, zero write, zero mail (an opposition on any row counts)', async () => {
    fake.leads.push(
      lead({ id: 'lead-a', email: 'lea@exemple.fr', created_at: '2026-05-01T09:00:00.000Z' }),
      lead({
        id: 'lead-b',
        email: 'Lea@Exemple.fr',
        created_at: '2026-09-01T09:00:00.000Z',
        opted_out_at: '2026-09-02T09:00:00.000Z',
      }),
    )
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'pending' })
    expect(fake.writes('site_newsletter_pending').filter((c) => c.method === 'POST')).toHaveLength(
      0,
    )
    expect(fake.writes('sabcrm_leads')).toHaveLength(0)
    expect(fake.mails()).toHaveLength(0)
  })

  it('demande : a person who unsubscribed may ask again and gets a confirmation mail', async () => {
    fake.leads.push(
      lead({
        email: 'lea@exemple.fr',
        newsletter_subscribed_at: '2026-10-01T08:00:00.000Z',
        newsletter_unsubscribed_at: '2026-10-10T08:00:00.000Z',
      }),
    )
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(fake.mails()).toHaveLength(1)
  })

  it('demande : the person lookup escapes the LIKE wildcards and percent-encodes « + »', async () => {
    fake.leads.push(
      lead({ id: 'lead-plus', email: 'Jean_Paul+News@Exemple.fr', opted_out_at: NOW_ISO }),
    )
    fake.leads.push(lead({ id: 'lead-lookalike', email: 'jeanXpaul+news@exemple.fr' }))
    const r = await post({ ...REQUEST, email: 'jean_paul+news@exemple.fr' })
    expect(r.status).toBe(200)
    const lookup = fake.calls.find((c) => c.url.startsWith(`${REST}/sabcrm_leads`))
    expect(lookup?.url).toContain('email=ilike.jean%5C_paul%2Bnews%40exemple.fr')
    expect(lookup?.url).toContain('order=created_at.asc')
    // Found despite the case, so the opposition holds: no mail.
    expect(fake.mails()).toHaveLength(0)
  })

  it('honeypot : 204 and zero fetch', async () => {
    const r = await post({ ...REQUEST, website: 'http://spam.example' })
    expect(r.status).toBe(204)
    expect(fake.calls).toHaveLength(0)
  })

  it('too fast : a form sent under 3 seconds → 204 and zero fetch', async () => {
    const r = await post({ ...REQUEST, elapsedMs: 1200 })
    expect(r.status).toBe(204)
    expect(fake.calls).toHaveLength(0)
  })

  it('env missing : 500 not_configured with zero I/O', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await post(REQUEST)
    expect(r.status).toBe(500)
    expect(await r.json()).toEqual({ error: 'Service indisponible', code: 'not_configured' })
    expect(fake.calls).toHaveLength(0)
  })

  it('mail failure : 502 mail_failed, and the pending row is removed so a retry can mail again', async () => {
    fake.resend = () => json({ message: 'boom' }, 500)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const r = await post(REQUEST)
    expect(r.status).toBe(502)
    expect(await r.json()).toEqual({ error: 'Envoi impossible', code: 'mail_failed' })
    expect(fake.pending).toHaveLength(0)

    fake.resend = () => json({ id: 're_retry' })
    const retry = await post(REQUEST)
    expect(retry.status).toBe(200)
    expect(fake.mails()).toHaveLength(2)
  })

  it('Resend 409 on the idempotency key : already sent, 200 pending', async () => {
    fake.resend = () => json({ name: 'invalid_idempotent_request' }, 409)
    const r = await post(REQUEST)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'pending' })
    expect(fake.pending).toHaveLength(1)
  })

  it('refuses a malformed payload with { error, code } and answers 405 to anything but POST', async () => {
    const bad = await post({ ...REQUEST, email: 'pas-une-adresse' })
    expect(bad.status).toBe(400)
    const body = await bad.json()
    expect(body.code).toBe('invalid_payload')
    expect(body.error).toContain('email')
    expect((await post('{nope')).status).toBe(400)
    expect((await post({ kind: 'autre' })).status).toBe(400)
    expect((await post({ ...REQUEST, foundVia: 'tiktok' })).status).toBe(400)

    const get = await handler.fetch(new Request('https://sablia.io/api/newsletter'))
    expect(get.status).toBe(405)
    expect(get.headers.get('allow')).toBe('POST')
    expect(fake.calls).toHaveLength(0)
  })
})

describe('POST /api/newsletter — confirm (?c= link)', () => {
  it('confirme : a new person → one INSERT newsletter_seule with the C1 fields, then the pending row keeps only the proof', async () => {
    fake.pending.push(pendingRow({}))
    const r = await post({ kind: 'confirm', token: TOKEN })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'subscribed', prenom: 'Léa' })

    const inserts = fake.writes('sabcrm_leads').filter((c) => c.method === 'POST')
    expect(inserts).toHaveLength(1)
    expect(inserts[0]?.body).toEqual({
      full_name: 'Léa',
      email: 'lea@exemple.fr',
      source: 'newsletter',
      owner: 'Brice',
      stage: 'nouveau',
      intention: 'newsletter_seule',
      newsletter_requested_at: ago(2 * HOUR),
      newsletter_subscribed_at: NOW_ISO,
      newsletter_source: 'site_form',
      found_via: 'youtube',
      lead_date: '2026-10-29',
      project_details: "Newsletter « L'IA au travail »",
      next_action: 'Aucun contact (abonné newsletter)',
      updated_by: 'sablia-site/api/newsletter',
      updated_at: NOW_ISO,
      raw: { origin: 'sablia.io/newsletter' },
    })

    const proof = fake.pending[0] as Row
    expect(proof).toMatchObject({
      token: TOKEN,
      confirmed_at: NOW_ISO,
      lead_id: fake.leads[0]?.id,
      email: null,
      prenom: null,
      ip_hash: null,
    })
    expect(fake.mails()).toHaveLength(0)
  })

  it('confirme : an existing person stored with an uppercase email → PATCH of the oldest row, no INSERT', async () => {
    fake.pending.push(pendingRow({ email: 'achille@exemple.fr', prenom: 'Achille' }))
    fake.leads.push(
      lead({
        id: 'lead-young',
        email: 'achille@exemple.fr',
        created_at: '2026-10-01T09:00:00.000Z',
      }),
      lead({ id: 'lead-old', email: 'Achille@Exemple.fr', created_at: '2026-04-01T09:00:00.000Z' }),
    )
    const r = await post({ kind: 'confirm', token: TOKEN })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'subscribed', prenom: 'Achille' })

    const writes = fake.writes('sabcrm_leads')
    expect(writes.filter((c) => c.method === 'POST')).toHaveLength(0)
    expect(writes).toHaveLength(1)
    expect(new URL(String(writes[0]?.url)).searchParams.get('id')).toBe('eq.lead-old')
    expect(writes[0]?.body).toEqual({
      newsletter_requested_at: ago(2 * HOUR),
      newsletter_subscribed_at: NOW_ISO,
      newsletter_unsubscribed_at: null,
      newsletter_source: 'site_form',
      updated_by: 'sablia-site/api/newsletter',
      updated_at: NOW_ISO,
    })
    const old = fake.leads.find((l) => l.id === 'lead-old')
    expect(old).toMatchObject({
      stage: 'a_contacter',
      owner: 'Raphael',
      intention: 'veut_un_echange',
    })
    expect(fake.pending[0]).toMatchObject({ lead_id: 'lead-old', email: null })
  })

  it('jeton périmé : an unconfirmed token older than 7 days → 404, no write', async () => {
    fake.pending.push(pendingRow({ created_at: ago(7 * DAY + 60 * 1000) }))
    const r = await post({ kind: 'confirm', token: TOKEN })
    expect(r.status).toBe(404)
    expect((await r.json()).code).toBe('unknown_token')
    expect(fake.calls.filter((c) => c.method !== 'GET')).toHaveLength(0)
  })

  it('jeton inconnu : 404 unknown_token, no write, for an unknown uuid and for a malformed token', async () => {
    const unknown = await post({ kind: 'confirm', token: TOKEN })
    expect(unknown.status).toBe(404)
    expect((await unknown.json()).code).toBe('unknown_token')
    const calls = fake.calls.length

    const malformed = await post({ kind: 'confirm', token: "x' or 1=1" })
    expect(malformed.status).toBe(404)
    expect(fake.calls.length).toBe(calls)
    expect(fake.calls.filter((c) => c.method !== 'GET')).toHaveLength(0)
  })

  it('double confirmation : two concurrent clicks → both 200, ONE lead write', async () => {
    fake.pending.push(pendingRow({}))
    const [a, b] = await Promise.all([
      post({ kind: 'confirm', token: TOKEN }),
      post({ kind: 'confirm', token: TOKEN }),
    ])
    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
    expect((await a.json()).state).toBe('subscribed')
    expect((await b.json()).state).toBe('subscribed')
    // Both reached the claim: the guard, not the luck of the first read, kept the second out.
    const claims = fake.calls.filter(
      (c) => c.method === 'PATCH' && c.url.includes('confirmed_at=is.null'),
    )
    expect(claims).toHaveLength(2)
    expect(fake.writes('sabcrm_leads')).toHaveLength(1)
    expect(fake.leads).toHaveLength(1)
  })

  it('confirme : a link already used → 200 subscribed again, no write', async () => {
    fake.pending.push(
      pendingRow({
        email: null,
        prenom: null,
        ip_hash: null,
        confirmed_at: ago(HOUR),
        lead_id: 'lead-1',
      }),
    )
    const r = await post({ kind: 'confirm', token: TOKEN })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'subscribed' })
    expect(fake.calls.filter((c) => c.method !== 'GET')).toHaveLength(0)
  })

  it('confirme : a person who opposed since the request → 410 opposed, no write', async () => {
    fake.pending.push(pendingRow({}))
    fake.leads.push(lead({ email: 'lea@exemple.fr', opted_out_at: ago(HOUR) }))
    const r = await post({ kind: 'confirm', token: TOKEN })
    expect(r.status).toBe(410)
    expect((await r.json()).code).toBe('opposed')
    expect(fake.calls.filter((c) => c.method !== 'GET')).toHaveLength(0)
  })

  it('confirme : a refused lead write releases the claim, so the same link works on the next click', async () => {
    fake.pending.push(pendingRow({}))
    const respond = fake.respond.bind(fake)
    let failures = 1
    fake.respond = (call: Call) => {
      if (call.method === 'POST' && call.url.startsWith(`${REST}/sabcrm_leads`) && failures-- > 0) {
        return json({ message: 'refused' }, 500)
      }
      return respond(call)
    }
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const first = await post({ kind: 'confirm', token: TOKEN })
    expect(first.status).toBe(500)
    expect(fake.pending[0]).toMatchObject({ confirmed_at: null, email: 'lea@exemple.fr' })

    const second = await post({ kind: 'confirm', token: TOKEN })
    expect(second.status).toBe(200)
    expect(fake.leads).toHaveLength(1)
  })
})

describe('POST /api/newsletter — invite (?t= link of the invitation)', () => {
  const OLD_TOKEN = '33333333-0000-4000-8000-000000000001'
  const YOUNG_TOKEN = '33333333-0000-4000-8000-000000000002'

  it('invite : PATCH the oldest row of the person even when the token belongs to a younger row; no INSERT', async () => {
    fake.leads.push(
      lead({
        id: 'lead-old',
        email: 'Sophie@Exemple.fr',
        optout_token: OLD_TOKEN,
        stage: 'fup',
        created_at: '2026-03-01T09:00:00.000Z',
      }),
      lead({
        id: 'lead-young',
        email: 'sophie@exemple.fr',
        optout_token: YOUNG_TOKEN,
        archived_at: '2026-10-01T09:00:00.000Z',
        created_at: '2026-09-01T09:00:00.000Z',
      }),
    )
    const r = await post({ kind: 'invite', token: YOUNG_TOKEN })
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true, state: 'subscribed' })

    const writes = fake.writes('sabcrm_leads')
    expect(writes).toHaveLength(1)
    expect(writes[0]?.method).toBe('PATCH')
    expect(new URL(String(writes[0]?.url)).searchParams.get('id')).toBe('eq.lead-old')
    expect(writes[0]?.body).toEqual({
      newsletter_subscribed_at: NOW_ISO,
      newsletter_unsubscribed_at: null,
      newsletter_source: 'invitation',
      updated_by: 'sablia-site/api/newsletter',
      updated_at: NOW_ISO,
    })
    expect(fake.leads.find((l) => l.id === 'lead-old')).toMatchObject({
      stage: 'fup',
      opted_out_at: null,
    })
    expect(fake.writes('site_newsletter_pending')).toHaveLength(0)
    expect(fake.mails()).toHaveLength(0)
  })

  it('invite : a person who opposed → 410, no write', async () => {
    fake.leads.push(
      lead({ id: 'lead-old', email: 'sophie@exemple.fr', optout_token: OLD_TOKEN }),
      lead({
        id: 'lead-young',
        email: 'SOPHIE@exemple.fr',
        optout_token: YOUNG_TOKEN,
        opted_out_at: ago(DAY),
        created_at: '2026-09-01T09:00:00.000Z',
      }),
    )
    const r = await post({ kind: 'invite', token: OLD_TOKEN })
    expect(r.status).toBe(410)
    expect((await r.json()).code).toBe('opposed')
    expect(fake.writes('sabcrm_leads')).toHaveLength(0)
  })

  it('invite : a forged token → 404, no write', async () => {
    fake.leads.push(lead({ optout_token: OLD_TOKEN }))
    const r = await post({ kind: 'invite', token: YOUNG_TOKEN })
    expect(r.status).toBe(404)
    expect((await r.json()).code).toBe('unknown_token')
    expect(fake.calls.filter((c) => c.method !== 'GET')).toHaveLength(0)
  })
})
