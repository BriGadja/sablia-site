import { afterEach, describe, expect, it, vi } from 'vitest'
import handler, {
  decide,
  displayPhone,
  fileUrl,
  internalMailPayload,
  leadRow,
  mailPayload,
  normalizePhone,
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

const accepted = (over: Partial<Record<string, unknown>> = {}) => {
  const decision = decide(payload(over))
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

/**
 * Brice, 2026-10-12: Achille ticked « être contacté » and the lead landed on Raphaël as
 * « Rappeler » with no number to call. A ticked box now offers an optional phone; the email stays
 * required. The CRM stores phones in E.164 (`+33612345678`, like every row already there).
 */
describe('normalizePhone', () => {
  it.each([
    ['06 12 34 56 78', '+33612345678'],
    ['06.12.34.56.78', '+33612345678'],
    ['06-12-34-56-78', '+33612345678'],
    ['+33 6 12 34 56 78', '+33612345678'],
    ['+33 (0)6 12 34 56 78', '+33612345678'],
    ['0033 6 12 34 56 78', '+33612345678'],
    ['+32 470 12 34 56', '+32470123456'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each([
    '12',
    'abc',
    '06 12 34',
    '+33 6 12 34 56 78 90',
    '1234567890',
  ])('rejects %s', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('displayPhone', () => {
  it('reads a French number back the way it is typed in France', () => {
    expect(displayPhone('+33612345678')).toBe('06 12 34 56 78')
  })

  it('leaves a foreign number in its international form', () => {
    expect(displayPhone('+32470123456')).toBe('+32470123456')
  })
})

describe('decide: the optional phone', () => {
  it('box ticked + phone: keeps the number, normalised', () => {
    expect(accepted({ contact: true, telephone: '06 12 34 56 78' }).telephone).toBe('+33612345678')
  })

  it('box ticked, no phone: accepted, the email is enough', () => {
    expect(accepted({ contact: true, telephone: '' }).telephone).toBeNull()
  })

  it('an older page that never sends the field is still accepted', () => {
    expect(accepted({ contact: true }).telephone).toBeNull()
  })

  it('box unticked: a number is never kept, nobody asked to be called', () => {
    expect(accepted({ contact: false, telephone: '06 12 34 56 78' }).telephone).toBeNull()
  })

  it('box ticked + unreadable phone: invalid, with a message that names the phone', () => {
    const decision = decide(payload({ contact: true, telephone: '12' }))
    expect(decision.kind).toBe('invalid')
    if (decision.kind === 'invalid') expect(decision.error).toContain('téléphone')
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

  it('box checked + phone: the number lands in `phone` and the next action says to call it', () => {
    const row = leadRow(accepted({ contact: true, telephone: '06 12 34 56 78' }), RESSOURCE)
    expect(row.phone).toBe('+33612345678')
    expect(row.next_action).toBe(
      'Rappeler au 06 12 34 56 78 : a demandé à être contacté depuis /ressources/demo-of1',
    )
  })

  it('box checked, no phone: the next action says to write, since there is nothing to call', () => {
    const row = leadRow(accepted({ contact: true }), RESSOURCE)
    expect(row.phone).toBeNull()
    expect(row.next_action).toBe(
      'Écrire (aucun numéro laissé) : a demandé à être contacté depuis /ressources/demo-of1',
    )
  })

  it('box unchecked: no phone column filled', () => {
    expect(leadRow(accepted({ contact: false }), RESSOURCE).phone).toBeNull()
  })

  it('carries the resource title into project_details', () => {
    expect(leadRow(accepted(), RESSOURCE).project_details).toBe(
      "Ressource : Le template n8n du compte rendu d'appel",
    )
  })
})

describe('fileUrl', () => {
  // Brice, 2026-10-01: a resource link must DOWNLOAD the file, not open it raw in a tab.
  // Supabase Storage answers `?download=<name>` with `Content-Disposition: attachment`.
  it('asks the bucket for a download, named after the file', () => {
    expect(fileUrl('ressources/demo-of1/uuid4/template-of1.json')).toBe(
      'https://qlxoitzdxjqhljjoeqoq.supabase.co/storage/v1/object/public/contenu-ressources/ressources/demo-of1/uuid4/template-of1.json?download=template-of1.json',
    )
  })

  it('encodes a file name the URL cannot carry as is', () => {
    expect(fileUrl('ressources/x/uuid4/aperçu mail.png')).toContain(
      '?download=aper%C3%A7u%20mail.png',
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

  // Brice, 2026-10-01: Gmail linkified the plain-text mail itself and glued the first URL to the
  // next file name (`…template.jsonmail-nouveau-lead.txt` → « Object not found »). An HTML part
  // with real anchors leaves nothing for Gmail to guess.
  it('carries an HTML part with one real anchor per file', () => {
    const mail = mailPayload(accepted(), RESSOURCE)
    for (const f of RESSOURCE.fichiers) {
      expect(mail.html).toContain(`<a href="${fileUrl(f.path)}">`)
    }
  })

  it('escapes the visitor-typed first name in the HTML part', () => {
    const mail = mailPayload(accepted({ prenom: '<b>Camille</b>' }), RESSOURCE)
    expect(mail.html).toContain('&lt;b&gt;Camille&lt;/b&gt;')
    expect(mail.html).not.toContain('<b>Camille</b>')
  })

  it('keeps every URL alone on its line in the text part, a blank line between files', () => {
    const mail = mailPayload(accepted(), RESSOURCE)
    for (const f of RESSOURCE.fichiers) {
      expect(mail.text).toContain(`\n${fileUrl(f.path)}\n\n`)
    }
  })

  it('omits the video line when the resource has no video yet', () => {
    const mail = mailPayload(accepted(), { ...RESSOURCE, youtube_id: null })
    expect(mail.text).not.toContain('youtube.com')
  })

  // Brice, 2026-10-12: the mail was identical whether the box was ticked or not, so a visitor
  // who asked to be contacted had no sign the request was heard.
  it('box ticked + phone: tells the visitor they will be called, on which number', () => {
    const mail = mailPayload(accepted({ contact: true, telephone: '0612345678' }), RESSOURCE)
    const line =
      'Vous avez demandé à être contacté : on vous appelle au 06 12 34 56 78 sous 24 h ouvrées.'
    expect(mail.text).toContain(line)
    expect(mail.html).toContain(line)
  })

  it('box ticked, no phone: tells the visitor the answer comes by mail', () => {
    const mail = mailPayload(accepted({ contact: true }), RESSOURCE)
    expect(mail.text).toContain(
      'Vous avez demandé à être contacté : on vous répond par mail sous 24 h ouvrées.',
    )
  })

  it('box unticked: no contact promise at all', () => {
    expect(mailPayload(accepted({ contact: false }), RESSOURCE).text).not.toContain('contacté')
  })
})

describe('internalMailPayload', () => {
  it('goes to Brice alone until V3 adds the team addresses', () => {
    const mail = internalMailPayload(accepted({ contact: true }), RESSOURCE, 'lead-1')
    expect(mail.to).toEqual(['brice@sablia.io'])
    expect(mail.text).toContain('lead-1')
  })

  it('gives the number to call when there is one', () => {
    const mail = internalMailPayload(
      accepted({ contact: true, telephone: '06 12 34 56 78' }),
      RESSOURCE,
      'lead-1',
    )
    expect(mail.text).toContain('Téléphone : 06 12 34 56 78')
  })

  it('says to answer by mail when there is none', () => {
    const mail = internalMailPayload(accepted({ contact: true }), RESSOURCE, 'lead-1')
    expect(mail.text).toContain('Téléphone : aucun, répondre par mail')
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
    expect(body.files[0].url).toContain('?download=')

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

  it('writes the normalised phone into the CRM row', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)

    await handler.fetch(post(payload({ contact: true, telephone: '06 12 34 56 78' })))

    const inserted = calls.find((c) => c.url.includes('sabcrm_leads') && c.init?.method === 'POST')
    expect(JSON.parse(String(inserted?.init?.body))).toMatchObject({ phone: '+33612345678' })
  })

  it('400 on an unreadable phone, and writes nothing', async () => {
    vi.stubEnv('RESEND_API_KEY', 'rk')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'sk')
    const calls = recorder(happyPath)
    const response = await handler.fetch(post(payload({ contact: true, telephone: 'abc' })))
    expect(response.status).toBe(400)
    expect(calls).toHaveLength(0)
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
