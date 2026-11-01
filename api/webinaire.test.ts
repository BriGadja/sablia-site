import { createHash, createHmac } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, { decide, ipHashFor, leadRow, registrationRow } from './webinaire'

/**
 * US-86. The checkbox is the business rule (consent + lead intention); the rest pins the abuse
 * budget and the "no information leak" duplicate answer. Fakes only: the table exists after R1.
 */

const payload = (over: Partial<Record<string, unknown>> = {}) => ({
  prenom: 'Claire',
  nom: 'Morel',
  email: 'Claire.Morel@Exemple.fr',
  telephone: '06 12 34 56 78',
  fonction: "Directrice d'un bureau d'études",
  taille: '10-49',
  usage_ia: 'essai',
  rappel_consent: false,
  website: '',
  elapsedMs: 9000,
  ...over,
})

interface Call {
  url: string
  method: string
  body: unknown
}

type Reply = Response | undefined
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

interface World {
  ipCount?: number
  dayCount?: number
  /** Rows `sabcrm_leads` returns for the person lookup, oldest first. */
  person?: { id: string; email: string; intention?: string; opted_out_at?: string | null }[]
  duplicate?: boolean
  /** Stored row returned by the duplicate-path lookup. */
  stored?: { id: string; rappel_consent: boolean; lead_id?: string | null }
  registrationInsert?: number
  leadInsert?: number
}

function world(w: World = {}) {
  const calls: Call[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET'
      const body = init?.body ? JSON.parse(String(init.body)) : undefined
      calls.push({ url, method, body })
      const reply: Reply = (() => {
        if (url.includes('site_webinar_registrations')) {
          if (method === 'GET' && url.includes('email=ilike.')) {
            return json(w.stored ? [w.stored] : [])
          }
          if (method === 'GET' && url.includes('ip_hash=eq.')) {
            return json(Array.from({ length: w.ipCount ?? 0 }, (_, i) => ({ id: `ip-${i}` })))
          }
          if (method === 'GET') {
            return json(Array.from({ length: w.dayCount ?? 0 }, (_, i) => ({ id: `d-${i}` })))
          }
          if (method === 'POST') {
            if (w.duplicate) return json({ code: '23505', message: 'duplicate key' }, 409)
            return w.registrationInsert && w.registrationInsert !== 201
              ? json({ message: 'boom' }, w.registrationInsert)
              : json([{ id: 'reg-1' }], 201)
          }
          if (method === 'PATCH') return json([{ id: 'reg-1' }])
        }
        if (url.includes('sabcrm_leads')) {
          if (method === 'GET') return json(w.person ?? [])
          if (method === 'PATCH') return json([{ id: 'lead-x' }])
          if (method === 'POST') {
            return w.leadInsert && w.leadInsert !== 201
              ? json({ message: 'refused' }, w.leadInsert)
              : json([{ id: 'lead-new' }], 201)
          }
        }
        return undefined
      })()
      if (!reply) throw new Error(`unexpected fetch ${method} ${url}`)
      return reply
    }),
  )
  return calls
}

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://sablia.io/api/webinaire', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: JSON.stringify(body),
  })

const writes = (calls: Call[], table: string, method = 'POST') =>
  calls.filter((c) => c.url.includes(table) && c.method === method)

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

const env = () => {
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key')
  vi.stubEnv('WEBINAR_IP_SALT', 'pepper')
}

describe('decide', () => {
  it('rejects a honeypot and a too-fast submit before anything else', () => {
    expect(decide(payload({ website: 'http://spam' }))).toEqual({
      kind: 'ignore',
      reason: 'honeypot',
    })
    expect(decide(payload({ elapsedMs: 2999 }))).toEqual({ kind: 'ignore', reason: 'too_fast' })
    expect(decide(payload({ elapsedMs: 3000 })).kind).toBe('accept')
  })

  it('refuses taille and usage_ia outside their lists, and missing required fields', () => {
    expect(decide(payload({ taille: '3-4' })).kind).toBe('invalid')
    expect(decide(payload({ usage_ia: 'souvent' })).kind).toBe('invalid')
    for (const field of ['prenom', 'nom', 'email', 'telephone', 'fonction']) {
      expect(decide(payload({ [field]: '' })).kind).toBe('invalid')
    }
    expect(decide(payload({ email: 'pas-un-mail' })).kind).toBe('invalid')
    expect(decide(payload({ telephone: 'abc' })).kind).toBe('invalid')
  })

  it('treats the callback box as unticked when absent', () => {
    const { rappel_consent: _omitted, ...rest } = payload()
    const d = decide(rest)
    expect(d.kind === 'accept' && d.value.rappel_consent).toBe(false)
  })
})

describe('rows', () => {
  const now = new Date('2026-11-10T09:00:00Z')
  const value = () => {
    const d = decide(payload())
    if (d.kind !== 'accept') throw new Error('rejected')
    return d.value
  }
  const ticked = () => {
    const d = decide(payload({ rappel_consent: true }))
    if (d.kind !== 'accept') throw new Error('rejected')
    return d.value
  }

  it('unticked box: consent false, consent_at null, intention ressource_seule', () => {
    const reg = registrationRow(value(), 'hash', now)
    expect(reg).toMatchObject({
      session_slug: '2026-11-19',
      status: 'inscrit',
      rappel_consent: false,
      consent_at: null,
      ip_hash: 'hash',
      email: 'Claire.Morel@Exemple.fr',
      telephone: '+33612345678',
    })
    expect(leadRow(value(), now)).toMatchObject({
      source: 'webinaire',
      stage: 'nouveau',
      intention: 'ressource_seule',
      email: 'claire.morel@exemple.fr',
    })
  })

  it('ticked box: consent true, consent_at set, intention veut_un_echange', () => {
    expect(registrationRow(ticked(), 'hash', now)).toMatchObject({
      rappel_consent: true,
      consent_at: now.toISOString(),
    })
    expect(leadRow(ticked(), now).intention).toBe('veut_un_echange')
  })

  it('hashes the IP with the day and the env salt: same day same hash, other day or salt differs', () => {
    const a = ipHashFor('203.0.113.7', '2026-11-10', 'pepper')
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(a).toBe(ipHashFor('203.0.113.7', '2026-11-10', 'pepper'))
    expect(a).not.toBe(ipHashFor('203.0.113.7', '2026-11-11', 'pepper'))
    expect(a).not.toBe(ipHashFor('203.0.113.7', '2026-11-10', 'other'))
    expect(a).not.toContain('203')
  })

  it('m2: without a salt the key is an HMAC under the service key, stable within a day', () => {
    const plain = createHash('sha256').update('2026-11-10||203.0.113.7').digest('hex')
    const h = ipHashFor('203.0.113.7', '2026-11-10', '', 'svc-key')
    expect(h).toMatch(/^[0-9a-f]{64}$/)
    expect(h).not.toBe(plain)
    expect(h).toBe(ipHashFor('203.0.113.7', '2026-11-10', '', 'svc-key'))
    expect(h).not.toBe(ipHashFor('203.0.113.7', '2026-11-11', '', 'svc-key'))
    expect(h).not.toBe(ipHashFor('203.0.113.7', '2026-11-10', '', 'other-key'))
    expect(h).toBe(createHmac('sha256', 'svc-key').update('2026-11-10|203.0.113.7').digest('hex'))
  })

  it('m2: the handler stores the HMAC (not the reversible hash) when WEBINAR_IP_SALT is absent', async () => {
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-key')
    const calls = world()
    await handler.fetch(post(payload()))
    const day = new Date().toISOString().slice(0, 10)
    const stored = (writes(calls, 'site_webinar_registrations')[0]?.body as { ip_hash: string })
      .ip_hash
    expect(stored).toBe(
      createHmac('sha256', 'service-key').update(`${day}|203.0.113.7`).digest('hex'),
    )
    expect(stored).not.toBe(ipHashFor('203.0.113.7', day, ''))
  })
})

describe('POST /api/webinaire', () => {
  it('405 on anything but POST, 400 on bad JSON', async () => {
    expect((await handler.fetch(new Request('https://sablia.io/api/webinaire'))).status).toBe(405)
    const bad = new Request('https://sablia.io/api/webinaire', { method: 'POST', body: '{' })
    expect((await handler.fetch(bad)).status).toBe(400)
  })

  it('answers 204 with NO I/O on honeypot and on too-fast', async () => {
    env()
    const calls = world()
    expect((await handler.fetch(post(payload({ website: 'x' })))).status).toBe(204)
    expect((await handler.fetch(post(payload({ elapsedMs: 100 })))).status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('400 without any write on an invalid taille or usage_ia', async () => {
    env()
    const calls = world()
    for (const bad of [{ taille: 'x' }, { usage_ia: 'x' }, { nom: '' }]) {
      const r = await handler.fetch(post(payload(bad)))
      expect(r.status).toBe(400)
      expect((await r.json()).code).toBe('invalid_payload')
    }
    expect(calls).toHaveLength(0)
  })

  it('500 not_configured without the service key, before any I/O', async () => {
    const calls = world()
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(500)
    expect((await r.json()).code).toBe('not_configured')
    expect(calls).toHaveLength(0)
  })

  it('new address, box unticked: one registration, one lead ressource_seule, 200 registered', async () => {
    env()
    const calls = world()
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'registered' })

    const [reg] = writes(calls, 'site_webinar_registrations')
    expect(reg?.body).toMatchObject({ rappel_consent: false, consent_at: null, status: 'inscrit' })
    const [lead] = writes(calls, 'sabcrm_leads')
    expect(lead?.body).toMatchObject({
      source: 'webinaire',
      stage: 'nouveau',
      intention: 'ressource_seule',
    })
    const [link] = writes(calls, 'site_webinar_registrations', 'PATCH')
    expect(link?.body).toEqual({ lead_id: 'lead-new' })
    // The service key is read from env and sent as a header, never in a URL or body.
    expect(JSON.stringify(calls)).not.toContain('service-key')
  })

  it('box ticked: veut_un_echange and consent_at on the registration', async () => {
    env()
    const calls = world()
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(writes(calls, 'site_webinar_registrations')[0]?.body).toMatchObject({
      rappel_consent: true,
    })
    expect(
      (writes(calls, 'site_webinar_registrations')[0]?.body as { consent_at: string }).consent_at,
    ).toEqual(expect.any(String))
    expect(writes(calls, 'sabcrm_leads')[0]?.body).toMatchObject({ intention: 'veut_un_echange' })
  })

  it('existing lead email (any case): no lead insert, lead_id is the OLDEST row', async () => {
    env()
    const calls = world({
      person: [
        { id: 'lead-oldest', email: 'claire.morel@exemple.fr' },
        { id: 'lead-newer', email: 'claire.morel@exemple.fr' },
      ],
    })
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(writes(calls, 'sabcrm_leads')).toHaveLength(0)
    expect(writes(calls, 'sabcrm_leads', 'PATCH')).toHaveLength(0)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')[0]?.body).toEqual({
      lead_id: 'lead-oldest',
    })
  })

  it('duplicate (session, lower(email)): same 200 body, no lead, no second write', async () => {
    env()
    const calls = world({ duplicate: true })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'registered' })
    expect(writes(calls, 'sabcrm_leads', 'GET')).toHaveLength(0)
    expect(writes(calls, 'sabcrm_leads')).toHaveLength(0)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')).toHaveLength(0)
    expect(writes(calls, 'site_webinar_registrations')).toHaveLength(1)
  })

  it('response of a new address and of a duplicate are byte-identical (no leak)', async () => {
    env()
    world()
    const fresh = await (await handler.fetch(post(payload()))).text()
    world({ duplicate: true })
    const dup = await (await handler.fetch(post(payload()))).text()
    expect(dup).toBe(fresh)
  })

  it('429 busy with no write at the per-IP cap (3 a day), counted in the table by ip_hash', async () => {
    env()
    const calls = world({ ipCount: 3 })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(429)
    expect((await r.json()).code).toBe('busy')
    expect(r.headers.get('retry-after')).toMatch(/^\d+$/)
    expect(writes(calls, 'site_webinar_registrations')).toHaveLength(0)
    const count = calls.find((c) => c.url.includes('ip_hash=eq.'))
    expect(count?.url).toMatch(/ip_hash=eq\.[0-9a-f]{64}/)
    expect(count?.url).not.toContain('203.0.113.7')
  })

  it('429 busy with no write at the daily ceiling (60)', async () => {
    env()
    const calls = world({ dayCount: 60 })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(429)
    expect(writes(calls, 'site_webinar_registrations')).toHaveLength(0)
  })

  it('2 earlier registrations from the IP and 59 today still pass', async () => {
    env()
    world({ ipCount: 2, dayCount: 59 })
    expect((await handler.fetch(post(payload()))).status).toBe(200)
  })

  it('lead insert refused: the registration stays and the answer is still 200', async () => {
    env()
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = world({ leadInsert: 400 })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'registered' })
    expect(writes(calls, 'site_webinar_registrations')).toHaveLength(1)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')).toHaveLength(0)
    expect(JSON.stringify(err.mock.calls)).not.toContain('claire')
  })

  it('person lookup failing degrades to a lead insert-free 200 (lead_id stays null)', async () => {
    env()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = world()
    const original = globalThis.fetch
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
      if (url.includes('sabcrm_leads') && (init?.method ?? 'GET') === 'GET') {
        throw new Error('network')
      }
      return original(url, init)
    })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(200)
    expect(writes(calls, 'sabcrm_leads')).toHaveLength(0)
  })

  it('registration insert failing (not a duplicate) answers 500 and never reaches the lead', async () => {
    env()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = world({ registrationInsert: 500 })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(500)
    expect((await r.json()).code).toBe('internal')
    expect(calls.filter((c) => c.url.includes('sabcrm_leads'))).toHaveLength(0)
  })

  it('sends no mail: nothing leaves towards Resend', async () => {
    env()
    const calls = world()
    await handler.fetch(post(payload({ rappel_consent: true })))
    expect(calls.some((c) => c.url.includes('resend'))).toBe(false)
  })
})

describe('M4 consent upgrades a known lead', () => {
  const person = (over: Record<string, unknown> = {}) => ({
    id: 'lead-old',
    email: 'claire.morel@exemple.fr',
    intention: 'ressource_seule',
    opted_out_at: null,
    ...over,
  })
  const leadPatches = (calls: Call[]) => writes(calls, 'sabcrm_leads', 'PATCH')

  it('new registration, ticked, existing ressource_seule lead: only intention is patched', async () => {
    env()
    const calls = world({ person: [person()] })
    expect((await handler.fetch(post(payload({ rappel_consent: true })))).status).toBe(200)
    expect(leadPatches(calls)).toHaveLength(1)
    expect(leadPatches(calls)[0]?.url).toContain('id=eq.lead-old')
    expect(leadPatches(calls)[0]?.body).toEqual({ intention: 'veut_un_echange' })
  })

  it('newsletter_seule is upgraded too', async () => {
    env()
    const calls = world({ person: [person({ intention: 'newsletter_seule' })] })
    await handler.fetch(post(payload({ rappel_consent: true })))
    expect(leadPatches(calls)[0]?.body).toEqual({ intention: 'veut_un_echange' })
  })

  it('unticked: the lead is never touched', async () => {
    env()
    const calls = world({ person: [person()] })
    await handler.fetch(post(payload()))
    expect(leadPatches(calls)).toHaveLength(0)
  })

  it('any opted-out row of the person: untouched', async () => {
    env()
    const calls = world({
      person: [person(), person({ id: 'lead-new', opted_out_at: '2026-09-02T09:00:00Z' })],
    })
    await handler.fetch(post(payload({ rappel_consent: true })))
    expect(leadPatches(calls)).toHaveLength(0)
  })

  it('never downgrades or rewrites an already engaged intention', async () => {
    env()
    const calls = world({ person: [person({ intention: 'veut_un_echange' })] })
    await handler.fetch(post(payload({ rappel_consent: true })))
    expect(leadPatches(calls)).toHaveLength(0)
    const calls2 = world({ person: [person({ intention: 'autre' })] })
    await handler.fetch(post(payload({ rappel_consent: true })))
    expect(leadPatches(calls2)).toHaveLength(0)
  })

  it('a failing lead patch never costs the registration (still 200, link still written)', async () => {
    env()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const calls = world({ person: [person()] })
    const inner = globalThis.fetch
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
      if (url.includes('sabcrm_leads') && init?.method === 'PATCH') {
        return new Response('x', { status: 500 })
      }
      return inner(url, init)
    })
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')[0]?.body).toEqual({
      lead_id: 'lead-old',
    })
  })

  it('duplicate, ticked after unticked: registration upgraded, lead upgraded, same 200 body', async () => {
    env()
    const calls = world({
      duplicate: true,
      stored: { id: 'reg-9', rappel_consent: false },
      person: [person()],
    })
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'registered' })
    const regPatch = writes(calls, 'site_webinar_registrations', 'PATCH')
    expect(regPatch).toHaveLength(1)
    expect(regPatch[0]?.url).toContain('id=eq.reg-9')
    expect(regPatch[0]?.body).toMatchObject({ rappel_consent: true })
    expect((regPatch[0]?.body as { consent_at: string }).consent_at).toEqual(expect.any(String))
    expect(leadPatches(calls)[0]?.body).toEqual({ intention: 'veut_un_echange' })
  })

  it('duplicate, unticked after ticked: nothing written, no downgrade', async () => {
    env()
    const calls = world({
      duplicate: true,
      stored: { id: 'reg-9', rappel_consent: true },
      person: [person()],
    })
    const r = await handler.fetch(post(payload()))
    expect(r.status).toBe(200)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')).toHaveLength(0)
    expect(leadPatches(calls)).toHaveLength(0)
  })

  it('duplicate, ticked after ticked: nothing to upgrade, nothing written', async () => {
    env()
    const calls = world({ duplicate: true, stored: { id: 'reg-9', rappel_consent: true } })
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(writes(calls, 'site_webinar_registrations', 'PATCH')).toHaveLength(0)
    expect(leadPatches(calls)).toHaveLength(0)
  })

  it('duplicate-path lookup failure still answers the same 200', async () => {
    env()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    world({ duplicate: true, stored: { id: 'reg-9', rappel_consent: false } })
    const inner = globalThis.fetch
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
      if (url.includes('email=ilike.') && url.includes('site_webinar')) throw new Error('net')
      return inner(url, init)
    })
    const r = await handler.fetch(post(payload({ rappel_consent: true })))
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ state: 'registered' })
  })
})
