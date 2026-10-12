import { z } from 'zod'
import { type FoundVia, FoundViaField, namesFoundVia, withFoundVia } from './_found-via.js'

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
 * A ticked box may carry a phone (optional, Brice 2026-10-12: a lead had asked to be contacted and
 * Raphaël had nothing to call). It is stored in E.164 like the rest of `sabcrm_leads.phone`, and
 * dropped when the box is unticked — nobody asked to be called.
 *
 * The box also sets the intention (canal/intention, Brice 2026-10-12): ticked is `veut_un_echange`
 * with a due date of the next business day (Paris), unticked is `ressource_seule` with none — the
 * Monday review and the J+14 metric skip those.
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
/** Same address, source, resource and contact flag, inside this window: a retry, not a second request. */
const DEDUP_WINDOW_MS = 10 * 60 * 1000
const TIMEOUT_MS = 4000

const PHONE_ERROR = 'Numéro de téléphone invalide (exemple : 06 12 34 56 78)'

/**
 * `null` = not a phone number. French numbers (`06…`, `+33 (0)6…`, `0033 6…`) come out as
 * `+33` + 9 digits; any other `+` or `00` number is kept if it has 8 to 15 digits (E.164).
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/[\s.()-]/g, '')
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`
  if (/^0\d{9}$/.test(digits)) return `+33${digits.slice(1)}`
  if (/^\+330\d{9}$/.test(digits)) return `+33${digits.slice(4)}`
  if (digits.startsWith('+33')) return /^\+33\d{9}$/.test(digits) ? digits : null
  return /^\+[1-9]\d{7,14}$/.test(digits) ? digits : null
}

/** How a French reader types their own number; a foreign one stays international. */
export function displayPhone(e164: string): string {
  const french = /^\+33(\d{9})$/.exec(e164)
  if (!french) return e164
  return `0${french[1]}`.replace(/(\d{2})(?=\d)/g, '$1 ')
}

const RequestSchema = z
  .object({
    prenom: z.string().trim().min(2).max(80),
    email: z.string().trim().max(200).email().toLowerCase(),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]{3,80}$/, 'slug invalide'),
    contact: z.boolean(),
    telephone: z.string().trim().max(40).optional().default(''),
    foundVia: FoundViaField,
    website: z.string().max(200).optional().default(''),
    elapsedMs: z.number().int().min(0),
  })
  .superRefine((value, ctx) => {
    if (value.contact && value.telephone !== '' && normalizePhone(value.telephone) === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['telephone'], message: PHONE_ERROR })
    }
  })
  .transform((value) => ({
    ...value,
    telephone: value.contact && value.telephone !== '' ? normalizePhone(value.telephone) : null,
  }))

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
  phone: string | null
  source: 'contenu'
  owner: 'Brice' | 'Raphael'
  stage: 'nouveau' | 'a_contacter'
  intention: 'ressource_seule' | 'veut_un_echange'
  relance_date: string | null
  lead_date: string
  project_details: string
  next_action: string
  updated_by: string
  updated_at: string
  raw: { origin: string; slug: string; contact: boolean }
  /** Present only when the visitor answered (contract C1). */
  found_via?: FoundVia
}

export interface MailPayload {
  from: string
  to: string[]
  reply_to: string
  subject: string
  text: string
  html?: string
}

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

/**
 * `?download=<name>` makes Supabase Storage answer with `Content-Disposition: attachment`, so a
 * click downloads the file instead of opening raw JSON or text in a tab (Brice, 2026-10-01).
 */
export function fileUrl(path: string): string {
  const name = path.split('/').pop() ?? path
  return `${BUCKET_PUBLIC}/${path}?download=${encodeURIComponent(name)}`
}

/**
 * The Paris civil date after `now`, Saturday and Sunday skipped (Friday → Monday). Public holidays
 * are NOT skipped. The Paris date is read from `formatToParts`, then +1 day is computed at 12:00 UTC
 * so a DST switch cannot move it.
 */
export function nextBusinessDay(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const next = new Date(Date.UTC(part('year'), part('month') - 1, part('day') + 1, 12))
  while (next.getUTCDay() === 0 || next.getUTCDay() === 6) next.setUTCDate(next.getUTCDate() + 1)
  return next.toISOString().slice(0, 10)
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
  const contactAction = value.telephone
    ? `Rappeler au ${displayPhone(value.telephone)}`
    : 'Écrire (aucun numéro laissé)'
  return withFoundVia(
    {
      full_name: value.prenom,
      email: value.email,
      phone: value.telephone,
      source: 'contenu',
      owner: wantsContact ? 'Raphael' : 'Brice',
      stage: wantsContact ? 'a_contacter' : 'nouveau',
      intention: wantsContact ? 'veut_un_echange' : 'ressource_seule',
      relance_date: wantsContact ? nextBusinessDay(now) : null,
      lead_date: now.toISOString().slice(0, 10),
      project_details: `Ressource : ${ressource.titre}`,
      next_action: wantsContact
        ? `${contactAction} : a demandé à être contacté depuis /ressources/${value.slug}`
        : 'Aucun contact (téléchargement de ressource)',
      updated_by: 'sablia-site/api/ressources-request',
      updated_at: now.toISOString(),
      raw: { origin: 'sablia.io/ressources', slug: value.slug, contact: wantsContact },
    },
    value.foundVia,
  )
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Text AND html (Brice, 2026-10-01): sent as text only, Gmail linkified the mail itself and glued
 * the first URL to the next file name, so the first link hit « Object not found ». The html part
 * carries real anchors; the text part keeps each URL alone on its line, a blank line between files.
 */
/**
 * Brice, 2026-10-12: the mail was the same whether the box was ticked or not, so a visitor who had
 * asked to be contacted got no sign the request was heard.
 */
function contactLine(value: RessourceRequest): string | null {
  if (!value.contact) return null
  return value.telephone
    ? `Vous avez demandé à être contacté : on vous appelle au ${displayPhone(value.telephone)} sous 24 h ouvrées.`
    : 'Vous avez demandé à être contacté : on vous répond par mail sous 24 h ouvrées.'
}

export function mailPayload(value: RessourceRequest, ressource: RessourceRow): MailPayload {
  const promise = contactLine(value)
  const text = [
    `Bonjour ${value.prenom},`,
    '',
    `Voici la ressource « ${ressource.titre} » :`,
    '',
    ...ressource.fichiers.flatMap((f) => [f.nom, fileUrl(f.path), '']),
    ...(ressource.youtube_id
      ? [`La vidéo : https://www.youtube.com/watch?v=${ressource.youtube_id}`, '']
      : []),
    ...(promise ? [promise, ''] : []),
    `Voir si ça marche chez vous, 30 min : ${BOOKING_URL}`,
    '',
    'Sablia',
  ].join('\n')

  const items = ressource.fichiers
    .map((f) => `<li><a href="${fileUrl(f.path)}">${escapeHtml(f.nom)}</a></li>`)
    .join('')
  const html = [
    `<p>Bonjour ${escapeHtml(value.prenom)},</p>`,
    `<p>Voici la ressource « ${escapeHtml(ressource.titre)} » :</p>`,
    `<ul>${items}</ul>`,
    ressource.youtube_id
      ? `<p>La vidéo : <a href="https://www.youtube.com/watch?v=${encodeURIComponent(ressource.youtube_id)}">la regarder sur YouTube</a></p>`
      : '',
    promise ? `<p>${escapeHtml(promise)}</p>` : '',
    `<p>Voir si ça marche chez vous, 30 min : <a href="${BOOKING_URL}">réserver un créneau</a></p>`,
    '<p>Sablia</p>',
  ].join('')

  return {
    from: SENDER,
    to: [value.email],
    reply_to: INTERNAL_RECIPIENT,
    subject: `Votre ressource Sablia : ${ressource.titre}`,
    text,
    html,
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
    `Téléphone : ${value.telephone ? displayPhone(value.telephone) : 'aucun, répondre par mail'}`,
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
async function findRecentLead(
  email: string,
  slug: string,
  contact: boolean,
  key: string,
): Promise<string | null> {
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
  const url =
    `${LEADS_ENDPOINT}?select=id&email=eq.${encodeURIComponent(email)}` +
    `&source=eq.contenu&raw->>slug=eq.${encodeURIComponent(slug)}` +
    `&raw->>contact=eq.${contact}` +
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

/**
 * Never throws: a CRM that refuses the row must not cost the visitor their resource. `found_via` is an
 * optional field: when the refusal names it, the row is retried ONCE without it so the lead is kept.
 */
async function insertLead(row: LeadRow, key: string, retried = false): Promise<string | null> {
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
      const refusal = await response.text().catch(() => '')
      console.error('[ressources] lead insert failed', response.status)
      if (!retried && row.found_via && namesFoundVia(refusal)) {
        const { found_via: _dropped, ...withoutKey } = row
        return await insertLead(withoutKey, key, true)
      }
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
        (await findRecentLead(value.email, value.slug, value.contact, serviceKey)) ??
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
