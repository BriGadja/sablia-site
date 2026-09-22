import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, {
  decide,
  fileUrl,
  internalMailPayload,
  leadRow,
  mailPayload,
  type RessourceRequest,
  type RessourceRow,
} from './ressources-request'

/**
 * The checkbox is the business rule, so most of these cases exist to pin what it changes:
 * the stage, the owner, the next action, and whether a second mail leaves at all.
 */

const RESSOURCE: RessourceRow = {
  slug: 'demo-of1',
  titre: "Le template n8n du compte rendu d'appel",
  youtube_id: 'dQw4w9WgXcQ',
  fichiers: [
    { nom: 'template-of1.json', path: 'ressources/demo-of1/uuid4/template-of1.json' },
    { nom: 'schema-of1.png', path: 'ressources/demo-of1/uuid4/schema-of1.png' },
  ],
}

const payload = (over: Partial<Record<string, unknown>> = {}) => ({
  prenom: 'Camille',
  email: 'Camille@Exemple.FR',
  slug: 'demo-of1',
  contact: false,
  website: '',
  elapsedMs: 9000,
  ...over,
})

const accepted = (over: Partial<RessourceRequest> = {}): RessourceRequest => {
  const decision = decide(payload(over as Record<string, unknown>))
  if (decision.kind !== 'accept') throw new Error(`payload rejeté : ${decision.kind}`)
  return decision.value
}

interface Call {
  url: string
  init?: RequestInit
}

function recorder(responses: (url: string) => Response | Promise<Response>) {
  const calls: Call[] = []
  const spy = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return await responses(url)
  })
  vi.stubGlobal('fetch', spy)
  return calls
}

const ok = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

const post = (body: unknown) =>
  new Request('https://sablia.io/api/ressources-request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

/** Resource found, no recent lead, insert returns an id, both mails accepted. */
const happyPath = (url: string) => {
  if (url.includes('contenu_ressources')) return ok([RESSOURCE])
  if (url.includes('sabcrm_leads') && url.includes('select=id')) return ok([])
  if (url.includes('sabcrm_leads')) return ok([{ id: 'lead-1' }])
  return ok({ id: 'mail-1' })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('decide', () => {
  it('accepts a well-formed payload and lowercases the address', () => {
    const decision = decide(payload())
    expect(decision.kind).toBe('accept')
    if (decision.kind === 'accept') expect(decision.value.email).toBe('camille@exemple.fr')
  })

  it('ignores a filled honeypot', () => {
    expect(decide(payload({ website: 'http://spam' }))).toEqual({
      kind: 'ignore',
      reason: 'honeypot',
    })
  })

  it('ignores a submission faster than three seconds', () => {
    expect(decide(payload({ elapsedMs: 900 }))).toEqual({ kind: 'ignore', reason: 'too_fast' })
  })

  it('rejects a malformed slug before the spam checks', () => {
    const decision = decide(payload({ slug: '../etc/passwd', website: 'http://spam' }))
    expect(decision.kind).toBe('invalid')
  })

  it('rejects a missing email', () => {
    expect(decide(payload({ email: 'pas-une-adresse' })).kind).toBe('invalid')
  })

  it('rejects a non-boolean checkbox', () => {
    expect(decide(payload({ contact: 'oui' })).kind).toBe('invalid')
  })
})

describe('leadRow', () => {
  it('box unchecked: nouveau, owner Brice, nobody is contacted', () => {
    const row = leadRow(accepted({ contact: false }), RESSOURCE)
    expect(row.stage).toBe('nouveau')
    expect(row.owner).toBe('Brice')
    expect(row.source).toBe('contenu')
    expect(row.next_action).toBe('Aucun contact (téléchargement de ressource)')
    expect(row.raw).toEqual({ origin: 'sablia.io/ressources', slug: 'demo-of1', contact: false })
  })

  it('box checked: a_contacter, owner Raphael WITHOUT the accent', () => {
    const row = leadRow(accepted({ contact: true }), RESSOURCE)
    expect(row.stage).toBe('a_contacter')
    expect(row.owner).toBe('Raphael')
    expect(row.next_action).toContain('/ressources/demo-of1')
    expect(row.raw.contact).toBe(true)
  })

  it('carries the resource title into project_details', () => {
    expect(leadRow(accepted(), RESSOURCE).project_details).toBe(
      "Ressource : Le template n8n du compte rendu d'appel",
    )
  })
})

describe('mailPayload', () => {
  it('lists every file as a public URL and adds the video and the booking link', () => {
    const mail = mailPayload(accepted(), RESSOURCE)
    expect(mail.to).toEqual(['camille@exemple.fr'])
    expect(mail.subject).toContain("Le template n8n du compte rendu d'appel")
    expect(mail.text).toContain(fileUrl('ressources/demo-of1/uuid4/template-of1.json'))
    expect(mail.text).toContain('youtube.com/watch?v=dQw4w9WgXcQ')
    expect(mail.text).toContain('calendly.com/brice-gachadoat')
  })

  it('omits the video line when the resource has no video yet', () => {
    const mail = mailPayload(accepted(), { ...RESSOURCE, youtube_id: null })
    expect(mail.text).not.toContain('youtube.com')
  })
})

describe('internalMailPayload', () => {
  it('goes to Brice alone until V3 adds the team addresses', () => {
    const mail = internalMailPayload(accepted({ contact: true }), RESSOURCE, 'lead-1')
    expect(mail.to).toEqual(['brice@sablia.io'])
    expect(mail.text).toContain('lead-1')
  })
})

describe('handler', () => {
  it('405 on a GET', async () => {
    const response = await handler.fetch(
      new Request('https://sablia.io/api/ressources-request', { method: 'GET' }),
    )
    expect(response.status).toBe(405)
  })

  it('400 on invalid JSON', async () => {
    const response = await handler.fetch(
      new Request('https://sablia.io/api/ressources-request', { method: 'POST', body: '{' }),
    )
    expect(response.status).toBe(400)
  })

  it('204 on the honeypot, with no I/O at all', async () => {
    const calls = recorder(happyPath)
    const response = await handler.fetch(post(payload({ website: 'http://spam' })))
    expect(response.status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('204 when submitted too fast, with no I/O at all', async () => {
    const calls = recorder(happyPath)
    const response = await handler.fetch(post(payload({ elapsedMs: 10 })))
    expect(response.status).toBe(204)
    expect(calls).toHaveLength(0)
  })

  it('400 on a bad payload', async () => {
    recorder(happyPath)
    const response = await handler.fetch(post(payload({ prenom: 'A' })))
    expect(response.status).toBe(400)
  })

  it('500 when the environment is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', '')
    recorder(happyPath)
    const response = await handler.fetch(post(payload()))
    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({ code: 'not_configured' })
  })

  it('404 on an unknown or unpublished slug, and writes nothing', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder((url) => (url.includes('contenu_ressources') ? ok([]) : ok([])))
    const response = await handler.fetch(post(payload({ slug: 'jamais-publiee' })))
    expect(response.status).toBe(404)
    expect(calls.filter((c) => c.url.includes('sabcrm_leads'))).toHaveLength(0)
  })

  it('500 when the resource lookup itself fails', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    recorder((url) =>
      url.includes('contenu_ressources') ? new Response('boom', { status: 503 }) : ok([]),
    )
    const response = await handler.fetch(post(payload()))
    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({ code: 'lookup_failed' })
  })

  it('502 when the visitor mail is refused', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    recorder((url) => {
      if (url.includes('contenu_ressources')) return ok([RESSOURCE])
      if (url.includes('sabcrm_leads') && url.includes('select=id')) return ok([])
      if (url.includes('sabcrm_leads')) return ok([{ id: 'lead-1' }])
      return new Response('nope', { status: 422 })
    })
    const response = await handler.fetch(post(payload()))
    expect(response.status).toBe(502)
  })

  it('200 with the file links, box unchecked, and NO internal mail', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)

    const response = await handler.fetch(post(payload({ contact: false })))

    expect(response.status).toBe(200)
    const body = (await response.json()) as { files: { nom: string; url: string }[]; lead: boolean }
    expect(body.lead).toBe(true)
    expect(body.files).toHaveLength(2)
    expect(body.files[0].url).toContain('/storage/v1/object/public/contenu-ressources/')

    const mails = calls.filter((c) => c.url.includes('resend.com'))
    expect(mails).toHaveLength(1)
    const inserted = calls.find((c) => c.url.includes('sabcrm_leads') && c.init?.method === 'POST')
    expect(JSON.parse(String(inserted?.init?.body))).toMatchObject({
      stage: 'nouveau',
      owner: 'Brice',
    })
  })

  it('200 with a SECOND internal mail when the box is ticked', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)

    const response = await handler.fetch(post(payload({ contact: true })))

    expect(response.status).toBe(200)
    expect(calls.filter((c) => c.url.includes('resend.com'))).toHaveLength(2)
    const inserted = calls.find((c) => c.url.includes('sabcrm_leads') && c.init?.method === 'POST')
    expect(JSON.parse(String(inserted?.init?.body))).toMatchObject({
      stage: 'a_contacter',
      owner: 'Raphael',
    })
  })

  it('a failed INTERNAL mail still returns 200: the visitor already has the resource', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    let mails = 0
    recorder((url) => {
      if (url.includes('contenu_ressources')) return ok([RESSOURCE])
      if (url.includes('sabcrm_leads') && url.includes('select=id')) return ok([])
      if (url.includes('sabcrm_leads')) return ok([{ id: 'lead-1' }])
      mails += 1
      return mails === 1 ? ok({ id: 'm' }) : new Response('nope', { status: 500 })
    })

    const response = await handler.fetch(post(payload({ contact: true })))
    expect(response.status).toBe(200)
  })

  it('reuses a recent lead instead of inserting a duplicate', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder((url) => {
      if (url.includes('contenu_ressources')) return ok([RESSOURCE])
      if (url.includes('sabcrm_leads') && url.includes('select=id')) return ok([{ id: 'deja' }])
      return ok({ id: 'mail' })
    })

    const response = await handler.fetch(post(payload()))

    expect(response.status).toBe(200)
    expect(calls.some((c) => c.url.includes('sabcrm_leads') && c.init?.method === 'POST')).toBe(
      false,
    )
  })

  it('the dedup lookup is scoped to this resource, not to every content lead', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)
    await handler.fetch(post(payload()))
    const lookup = calls.find((c) => c.url.includes('select=id'))
    expect(lookup?.url).toContain('source=eq.contenu')
    expect(lookup?.url).toContain('slug=eq.demo-of1')
  })

  it('never enrols a sequence: no call touches sabcrm_lead_sequences', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)
    await handler.fetch(post(payload({ contact: true })))
    expect(calls.some((c) => c.url.includes('sequence'))).toBe(false)
  })

  it('still returns 200 when the CRM refuses the row', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    recorder((url) => {
      if (url.includes('contenu_ressources')) return ok([RESSOURCE])
      if (url.includes('sabcrm_leads')) return new Response('refus', { status: 400 })
      return ok({ id: 'mail' })
    })
    const response = await handler.fetch(post(payload()))
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ lead: false })
  })
})
