import { z } from 'zod'

/**
 * `POST /api/ressources-request` — the download form of `/ressources/{slug}` (NS-19, decision D7).
 *
 * Three effects, in this order: the resource is read (so an unknown or unpublished slug is a 404
 * before anything is written), a row lands in `sabcrm_leads`, and the visitor gets a mail with
 * the links. The links are ALSO returned in the response, because the form captures the lead — it
 * does not lock the file (decision D8, "on donne un maximum").
 *
 * The checkbox is the whole business logic: unchecked means `stage='nouveau'`, owner Brice, and
 * nobody is contacted; checked means `stage='a_contacter'`, owner Raphael (no accent — the 51 rows
 * already in the table spell it that way), and Brice gets a second mail. No sequence is ever
 * enrolled: nothing on this path can open one.
 *
 * Anti-spam is the honeypot plus a minimum delay of `api/contact.ts`, answering 204 BEFORE any I/O.
 */

/** Public project ref — no secret, so it stays a constant instead of another env var. */
const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const LEADS_ENDPOINT = `${SUPABASE_URL}/rest/v1/sabcrm_leads`
const RESSOURCES_ENDPOINT = `${SUPABASE_URL}/rest/v1/contenu_ressources`
const BUCKET_PUBLIC = `${SUPABASE_URL}/storage/v1/object/public/contenu-ressources`
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const INTERNAL_RECIPIENT = 'brice@sablia.io'
const SENDER = 'Sablia <site@send.sablia.io>'
const BOOKING_URL = 'https://calendly.com/brice-gachadoat/30min'
const MIN_ELAPSED_MS = 3000
/** Same address, same source, same resource, inside this window: a retry, not a second request. */
const DEDUP_WINDOW_MS = 10 * 60 * 1000
const TIMEOUT_MS = 4000

const RequestSchema = z.object({
  prenom: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).email().toLowerCase(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]{3,80}$/, 'slug invalide'),
  contact: z.boolean(),
  website: z.string().max(200).optional().default(''),
  elapsedMs: z.number().int().min(0),
})

export type RessourceRequest = z.infer<typeof RequestSchema>

export type Decision =
  | { kind: 'invalid'; error: string; code: 'invalid_payload' }
  | { kind: 'ignore'; reason: 'honeypot' | 'too_fast' }
  | { kind: 'accept'; value: RessourceRequest }

export interface Fichier {
  nom: string
  path: string
  taille_octets?: number
  type?: string
}

export interface RessourceRow {
  slug: string
  titre: string
  youtube_id: string | null
  fichiers: Fichier[]
}

export interface LeadRow {
  full_name: string
  email: string
  source: 'contenu'
  owner: 'Brice' | 'Raphael'
  stage: 'nouveau' | 'a_contacter'
  lead_date: string
  project_details: string
  next_action: string
  updated_by: string
  updated_at: string
  raw: { origin: string; slug: string; contact: boolean }
}

export interface MailPayload {
  from: string
  to: string[]
  reply_to: string
  subject: string
  text: string
}

/** Parse, then honeypot, then delay. A malformed payload never reaches the spam checks. */
export function decide(body: unknown): Decision {
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join('.') || 'inconnu'
    return {
      kind: 'invalid',
      error: `Formulaire incomplet ou invalide (champ : ${field})`,
      code: 'invalid_payload',
    }
  }

  const value = parsed.data
  if (value.website.trim() !== '') return { kind: 'ignore', reason: 'honeypot' }
  if (value.elapsedMs < MIN_ELAPSED_MS) return { kind: 'ignore', reason: 'too_fast' }
  return { kind: 'accept', value }
}

export function fileUrl(path: string): string {
  return `${BUCKET_PUBLIC}/${path}`
}

/**
 * The checkbox decides the stage, the owner and the next action. Unchecked leads still exist in
 * the CRM — that is deliberate, they are the measure of what the content brings in.
 */
export function leadRow(
  value: RessourceRequest,
  ressource: RessourceRow,
  now = new Date(),
): LeadRow {
  const wantsContact = value.contact
  return {
    full_name: value.prenom,
    email: value.email,
    source: 'contenu',
    owner: wantsContact ? 'Raphael' : 'Brice',
    stage: wantsContact ? 'a_contacter' : 'nouveau',
    lead_date: now.toISOString().slice(0, 10),
    project_details: `Ressource : ${ressource.titre}`,
    next_action: wantsContact
      ? `Rappeler : a demandé à être contacté depuis /ressources/${value.slug}`
      : 'Aucun contact (téléchargement de ressource)',
    updated_by: 'sablia-site/api/ressources-request',
    updated_at: now.toISOString(),
    raw: { origin: 'sablia.io/ressources', slug: value.slug, contact: wantsContact },
  }
}

export function mailPayload(value: RessourceRequest, ressource: RessourceRow): MailPayload {
  const links = ressource.fichiers.map((f) => `${f.nom} : ${fileUrl(f.path)}`)
  const text = [
    `Bonjour ${value.prenom},`,
    '',
    `Voici la ressource « ${ressource.titre} » :`,
    ...links,
    ...(ressource.youtube_id
      ? ['', `La vidéo : https://www.youtube.com/watch?v=${ressource.youtube_id}`]
      : []),
    '',
    `Voir si ça marche chez vous, 30 min : ${BOOKING_URL}`,
    '',
    'Sablia',
  ].join('\n')

  return {
    from: SENDER,
    to: [value.email],
    reply_to: INTERNAL_RECIPIENT,
    subject: `Votre ressource Sablia : ${ressource.titre}`,
    text,
  }
}

/** Only sent when the box was ticked. Raphaël's address is added at V3, not before. */
export function internalMailPayload(
  value: RessourceRequest,
  ressource: RessourceRow,
  leadId: string | null,
  extraRecipients: string[] = [],
): MailPayload {
  const text = [
    `${value.prenom} <${value.email}> a demandé à être contacté.`,
    `Ressource : ${ressource.titre} (/ressources/${value.slug})`,
    '',
    leadId ? `Fiche CRM : ${leadId}` : 'Fiche CRM : ligne CRM non créée',
    'Portail : https://app.sablia.io/leads',
  ].join('\n')

  return {
    from: SENDER,
    to: [INTERNAL_RECIPIENT, ...extraRecipients],
    reply_to: value.email,
    subject: `Demande de contact via une ressource : ${value.prenom}`,
    text,
  }
}

const detail = (error: unknown) => (error instanceof Error ? error.message : 'unknown')

/** `null` = the read failed. `undefined` = read fine, no such published resource. */
async function findRessource(slug: string, key: string): Promise<RessourceRow | null | undefined> {
  const url =
    `${RESSOURCES_ENDPOINT}?select=slug,titre,youtube_id,fichiers` +
    `&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`
  try {
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error('[ressources] resource lookup failed', response.status)
      return null
    }
    const rows = (await response.json()) as RessourceRow[] | null
    const row = rows?.[0]
    if (!row) return undefined
    return { ...row, fichiers: Array.isArray(row.fichiers) ? row.fichiers : [] }
  } catch (error) {
    console.error('[ressources] resource lookup threw', detail(error))
    return null
  }
}

/**
 * `idx_sabcrm_leads_email` is NOT unique, so a visitor retrying after a slow answer would create a
 * silent duplicate. A failed lookup returns null and the insert proceeds: degrading to "no dedup"
 * is safer than refusing a real request.
 */
async function findRecentLead(email: string, slug: string, key: string): Promise<string | null> {
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
  const url =
    `${LEADS_ENDPOINT}?select=id&email=eq.${encodeURIComponent(email)}` +
    `&source=eq.contenu&raw->>slug=eq.${encodeURIComponent(slug)}` +
    `&created_at=gte.${encodeURIComponent(since)}&limit=1`
  try {
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error('[ressources] lead lookup failed', response.status)
      return null
    }
    const rows = (await response.json()) as { id?: string }[] | null
    return rows?.[0]?.id ?? null
  } catch (error) {
    console.error('[ressources] lead lookup threw', detail(error))
    return null
  }
}

/** Never throws: a CRM that refuses the row must not cost the visitor their resource. */
async function insertLead(row: LeadRow, key: string): Promise<string | null> {
  try {
    const response = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'content-type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error('[ressources] lead insert failed', response.status)
      return null
    }
    const rows = (await response.json()) as { id?: string }[] | null
    return rows?.[0]?.id ?? null
  } catch (error) {
    console.error('[ressources] lead insert threw', detail(error))
    return null
  }
}

async function sendMail(payload: MailPayload, key: string): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`resend ${response.status}`)
}

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

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

    const resendKey = process.env.RESEND_API_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!resendKey || !serviceKey) {
      console.error('[ressources] missing env', {
        resend: Boolean(resendKey),
        supabase: Boolean(serviceKey),
      })
      return jsonResponse({ error: 'Service indisponible', code: 'not_configured' }, 500)
    }

    try {
      const { value } = decision

      const ressource = await findRessource(value.slug, serviceKey)
      if (ressource === null) {
        return jsonResponse({ error: 'Service indisponible', code: 'lookup_failed' }, 500)
      }
      if (ressource === undefined) {
        return jsonResponse({ error: 'Ressource introuvable', code: 'not_found' }, 404)
      }

      const leadId =
        (await findRecentLead(value.email, value.slug, serviceKey)) ??
        (await insertLead(leadRow(value, ressource), serviceKey))

      try {
        await sendMail(mailPayload(value, ressource), resendKey)
      } catch (error) {
        console.error('[ressources] mail failed', detail(error))
        return jsonResponse({ error: 'Envoi impossible', code: 'mail_failed' }, 502)
      }

      if (value.contact) {
        // The visitor already has their resource: a failed internal mail must not undo that.
        try {
          await sendMail(internalMailPayload(value, ressource, leadId), resendKey)
        } catch (error) {
          console.error('[ressources] internal mail failed', detail(error))
        }
      }

      return jsonResponse(
        {
          ok: true,
          files: ressource.fichiers.map((f) => ({ nom: f.nom, url: fileUrl(f.path) })),
          lead: leadId !== null,
        },
        200,
      )
    } catch (error) {
      console.error('[ressources] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
