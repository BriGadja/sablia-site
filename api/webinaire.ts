import { createHash, createHmac } from 'node:crypto'
import { z } from 'zod'
import { findPerson, likeValue, type PersonRow, patchLead } from './_newsletter-person.js'
import { normalizePhone } from './ressources-request.js'

/**
 * `POST /api/webinaire` — registration to the « Bureaux d'études » session (US-86, plan
 * webinaire-bureaux-etudes-2026-11-01, unit U2).
 *
 * Effects, in order: a row in `site_webinar_registrations`, then the person is reported into
 * `sabcrm_leads` (`source='webinaire'`). The server sends NO mail: the invitation is Google's and
 * the reminders belong to `scripts/webinar.py`.
 *
 * The callback box is the whole business logic, as in `ressources-request.ts`: unticked →
 * `rappel_consent=false`, `consent_at=null`, lead `intention='ressource_seule'` (hidden from the
 * default sales list); ticked → `rappel_consent=true`, `consent_at=now`, `veut_un_echange`.
 *
 * A ticked box also raises a KNOWN lead hidden by its intention (`ressource_seule`,
 * `newsletter_seule`) to `veut_un_echange` (only that column, never a downgrade, never a person with
 * any `opted_out_at`), and a second registration with the box ticked upgrades a stored unticked one.
 *
 * An address already in `sabcrm_leads` (`lower(email)`, `_newsletter-person.ts`) is NOT duplicated:
 * `lead_id` points at the oldest row. A lead failure never costs the registration: the answer stays
 * 200 and the hub `status` flags `lead_id is null`.
 *
 * No information leak: a second registration of the same address for the session (unique index
 * `(session_slug, lower(email))`, PostgREST 409) gets the very same 200 body and writes nothing.
 *
 * Abuse budget, counted IN THE TABLE so it survives deploys: 3 registrations per `ip_hash` per UTC
 * day, 60 per day overall (429 `busy`). `ip_hash = sha256(day | salt | ip)`, salt in
 * `WEBINAR_IP_SALT`. With no salt the key is `HMAC_SHA256(service key, day|ip)`: an empty salt would
 * leave a hash anyone reading the table could brute-force over the IPv4 space.
 * Honeypot and a 3 s floor answer 204 BEFORE any I/O, as `contact.ts` does.
 */

const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const REGISTRATIONS = `${SUPABASE_URL}/rest/v1/site_webinar_registrations`
const LEADS = `${SUPABASE_URL}/rest/v1/sabcrm_leads`
const SESSION_SLUG = '2026-12-03'
const MIN_ELAPSED_MS = 3000
const PER_IP_DAILY = 3
const DAILY_CEILING = 60
const TIMEOUT_MS = 4000

export const TAILLES = ['1', '2-9', '10-49', '50-249', '250+'] as const
export const USAGES_IA = ['jamais', 'essai', 'chaque_semaine', 'tous_les_jours'] as const

const PHONE_ERROR = 'Numéro de téléphone invalide (exemple : 06 12 34 56 78)'

const RequestSchema = z
  .object({
    prenom: z.string().trim().min(1).max(80),
    nom: z.string().trim().min(1).max(80),
    email: z.string().trim().max(200).email(),
    telephone: z.string().trim().min(1).max(40),
    fonction: z.string().trim().min(1).max(120),
    taille: z.enum(TAILLES),
    usage_ia: z.enum(USAGES_IA),
    pourquoi: z.string().trim().max(1000).optional().default(''),
    /** Absent from a client built before the box existed: unticked. */
    rappel_consent: z.boolean().optional().default(false),
    website: z.string().max(200).optional().default(''),
    elapsedMs: z.number().int().min(0),
  })
  .superRefine((value, ctx) => {
    if (normalizePhone(value.telephone) === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['telephone'], message: PHONE_ERROR })
    }
  })
  .transform((value) => ({ ...value, telephone: normalizePhone(value.telephone) as string }))

export type WebinaireRequest = z.infer<typeof RequestSchema>

export type Decision =
  | { kind: 'invalid'; error: string; code: 'invalid_payload' }
  | { kind: 'ignore'; reason: 'honeypot' | 'too_fast' }
  | { kind: 'accept'; value: WebinaireRequest }

/** Parse, then honeypot, then delay. A malformed payload never reaches the spam checks. */
export function decide(body: unknown): Decision {
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join('.') || 'inconnu'
    return {
      kind: 'invalid',
      error:
        field === 'telephone' ? PHONE_ERROR : `Formulaire incomplet ou invalide (champ : ${field})`,
      code: 'invalid_payload',
    }
  }
  const value = parsed.data
  if (value.website.trim() !== '') return { kind: 'ignore', reason: 'honeypot' }
  if (value.elapsedMs < MIN_ELAPSED_MS) return { kind: 'ignore', reason: 'too_fast' }
  return { kind: 'accept', value }
}

/** The last `X-Forwarded-For` entry is the one Caddy saw (see `newsletter.ts`). */
export function clientIp(request: Request): string {
  const last = request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
  return last || 'unknown'
}

export function ipHashFor(ip: string, day: string, salt: string, fallbackKey = ''): string {
  if (salt === '' && fallbackKey !== '') {
    return createHmac('sha256', fallbackKey).update(`${day}|${ip}`).digest('hex')
  }
  return createHash('sha256').update(`${day}|${salt}|${ip}`).digest('hex')
}

export function registrationRow(value: WebinaireRequest, ipHash: string, now = new Date()) {
  return {
    session_slug: SESSION_SLUG,
    prenom: value.prenom,
    nom: value.nom,
    email: value.email,
    telephone: value.telephone,
    fonction: value.fonction,
    taille: value.taille,
    usage_ia: value.usage_ia,
    pourquoi: value.pourquoi === '' ? null : value.pourquoi,
    rappel_consent: value.rappel_consent,
    consent_at: value.rappel_consent ? now.toISOString() : null,
    status: 'inscrit',
    ip_hash: ipHash,
  }
}

/** `relance_date` stays null: the callback list is the portal view, dated after the session by Raphaël. */
export function leadRow(value: WebinaireRequest, now = new Date()) {
  return {
    full_name: `${value.prenom} ${value.nom}`,
    email: value.email.toLowerCase(),
    phone: value.telephone,
    source: 'webinaire',
    owner: value.rappel_consent ? 'Raphael' : 'Brice',
    stage: 'nouveau',
    intention: value.rappel_consent ? 'veut_un_echange' : 'ressource_seule',
    relance_date: null,
    lead_date: now.toISOString().slice(0, 10),
    project_details: `Webinaire ${SESSION_SLUG} : ${value.fonction}, taille ${value.taille}, IA : ${value.usage_ia}`,
    next_action: value.rappel_consent
      ? 'Inscrit au webinaire, a accepté d’être rappelé(e)'
      : 'Inscrit au webinaire, aucun rappel demandé',
    updated_by: 'sablia-site/api/webinaire',
    updated_at: now.toISOString(),
    raw: { origin: 'sablia.io/webinaire', session: SESSION_SLUG, rappel: value.rappel_consent },
  }
}

const detail = (error: unknown) => (error instanceof Error ? error.message : 'unknown')
const enc = encodeURIComponent

/** Names the table, never the query: queries hold addresses. */
class DbError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

async function rest<T>(
  url: string,
  key: string,
  init: { method?: 'GET' | 'POST' | 'PATCH'; body?: unknown } = {},
): Promise<T[]> {
  const method = init.method ?? 'GET'
  const headers: Record<string, string> = { apikey: key, Authorization: `Bearer ${key}` }
  if (init.body !== undefined) headers['content-type'] = 'application/json'
  if (method !== 'GET') headers.Prefer = 'return=representation'
  const response = await fetch(url, {
    method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new DbError(
      `${method} ${new URL(url).pathname} answered ${response.status}`,
      response.status,
    )
  }
  const rows = (await response.json()) as T[] | null
  return Array.isArray(rows) ? rows : []
}

const jsonResponse = (body: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })

const registered = () => jsonResponse({ state: 'registered' }, 200)

function busy(now: Date): Response {
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const retryAfter = Math.max(1, Math.ceil((tomorrow - now.getTime()) / 1000))
  return jsonResponse({ error: "Trop d'inscriptions aujourd'hui", code: 'busy' }, 429, {
    'Retry-After': String(retryAfter),
  })
}

const UPGRADABLE = ['ressource_seule', 'newsletter_seule']

/** Consent given: raise the oldest row of a known, not-opposed person that sits hidden. Only `intention`. */
async function upgradeLead(person: PersonRow[], key: string): Promise<void> {
  const oldest = person[0]
  if (!oldest || person.some((r) => r.opted_out_at)) return
  if (!oldest.intention || !UPGRADABLE.includes(oldest.intention)) return
  await patchLead(oldest.id, { intention: 'veut_un_echange' }, key)
}

/** Duplicate path: a ticked box upgrades a stored unticked one, never the reverse. Never throws. */
async function upgradeDuplicate(value: WebinaireRequest, key: string, now: Date): Promise<void> {
  if (!value.rappel_consent) return
  try {
    const [stored] = await rest<{ id: string; rappel_consent: boolean }>(
      `${REGISTRATIONS}?select=id,rappel_consent&session_slug=eq.${SESSION_SLUG}&email=ilike.${likeValue(
        value.email.toLowerCase(),
      )}&limit=1`,
      key,
    )
    if (!stored || stored.rappel_consent) return
    await rest(`${REGISTRATIONS}?id=eq.${enc(stored.id)}`, key, {
      method: 'PATCH',
      body: { rappel_consent: true, consent_at: now.toISOString() },
    })
    await upgradeLead(await findPerson(value.email, key), key)
  } catch (error) {
    console.error('[webinaire] duplicate upgrade failed', detail(error))
  }
}

/** Never throws: whatever happens here, the registration is already stored. */
async function reportLead(
  value: WebinaireRequest,
  registrationId: string,
  key: string,
  now: Date,
): Promise<void> {
  try {
    const person = await findPerson(value.email, key)
    const leadId =
      person[0]?.id ??
      (await rest<{ id?: string }>(LEADS, key, { method: 'POST', body: leadRow(value, now) }))[0]
        ?.id
    if (!leadId) return
    await rest(`${REGISTRATIONS}?id=eq.${enc(registrationId)}`, key, {
      method: 'PATCH',
      body: { lead_id: leadId },
    })
    if (value.rappel_consent) await upgradeLead(person, key)
  } catch (error) {
    console.error('[webinaire] lead report failed', detail(error))
  }
}

async function handleRegistration(
  value: WebinaireRequest,
  ip: string,
  key: string,
  salt: string,
): Promise<Response> {
  const now = new Date()
  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString()
  const ipHash = ipHashFor(ip, dayStart.slice(0, 10), salt, key)

  const fromIp = await rest<{ id: string }>(
    `${REGISTRATIONS}?select=id&ip_hash=eq.${ipHash}&created_at=gte.${enc(dayStart)}&limit=${PER_IP_DAILY}`,
    key,
  )
  if (fromIp.length >= PER_IP_DAILY) return busy(now)

  const today = await rest<{ id: string }>(
    `${REGISTRATIONS}?select=id&created_at=gte.${enc(dayStart)}&limit=${DAILY_CEILING}`,
    key,
  )
  if (today.length >= DAILY_CEILING) {
    console.error('webinaire: daily ceiling reached')
    return busy(now)
  }

  let row: { id?: string } | undefined
  try {
    ;[row] = await rest<{ id?: string }>(REGISTRATIONS, key, {
      method: 'POST',
      body: registrationRow(value, ipHash, now),
    })
  } catch (error) {
    // Unique index (session_slug, lower(email)): same answer as a new row, nothing else written.
    if (error instanceof DbError && error.status === 409) {
      await upgradeDuplicate(value, key, now)
      return registered()
    }
    throw error
  }
  if (!row?.id) throw new DbError('POST site_webinar_registrations returned no id', 500)

  await reportLead(value, row.id, key, now)
  return registered()
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { allow: 'POST' } })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return jsonResponse({ error: 'JSON invalide', code: 'bad_json' }, 400)
    }

    const decision = decide(body)
    if (decision.kind === 'ignore') return new Response(null, { status: 204 })
    if (decision.kind === 'invalid') {
      return jsonResponse({ error: decision.error, code: decision.code }, 400)
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      console.error('[webinaire] missing env')
      return jsonResponse({ error: 'Service indisponible', code: 'not_configured' }, 500)
    }

    try {
      return await handleRegistration(
        decision.value,
        clientIp(request),
        serviceKey,
        process.env.WEBINAR_IP_SALT ?? '',
      )
    } catch (error) {
      console.error('[webinaire] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
