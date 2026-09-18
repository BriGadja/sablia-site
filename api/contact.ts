import { z } from 'zod'

/**
 * `POST /api/contact` — the contact form of sablia.io (decision A7, 2026-09-18).
 *
 * The site is a STATIC Vercel deployment: the Express app under `server/` is built but never
 * served, so the form needs a Vercel Function. Two effects, in this order: a row in
 * `sabcrm_leads` (the CRM trace) and a mail to Brice (the channel he actually reads). The mail
 * carries the lead id, so a refused insert is visible in the inbox instead of being silent.
 *
 * Anti-spam is a honeypot plus a minimum delay — both answer 204 BEFORE any I/O, so a bot costs
 * nothing and sees the same success as a visitor.
 *
 * The service-role key is the only way into `sabcrm_leads`: RLS is enabled with zero policies, so
 * anon cannot write. That key therefore never leaves this file's process (Vercel env var,
 * `sensitive`, Preview + Production).
 */

/** Public project ref — no secret, so it stays a constant instead of a third env var. */
const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const LEADS_ENDPOINT = `${SUPABASE_URL}/rest/v1/sabcrm_leads`
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const RECIPIENT = 'brice@sablia.io'
const SENDER = 'Sablia <site@send.sablia.io>'
const MIN_ELAPSED_MS = 3000
/** Same address, same source, inside this window: a retry, not a second request. */
const DEDUP_WINDOW_MS = 10 * 60 * 1000
const TIMEOUT_MS = 4000

/** The four values the portal questionnaire already writes into `sabcrm_leads.team_size`. */
const TEAM_SIZES = [
  'je_suis_seul(e)',
  '2_à_5_personnes',
  '6_à_20_personnes',
  'plus_de_20_personnes',
] as const

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(1).max(160),
  email: z.string().trim().max(200).email().toLowerCase(),
  teamSize: z.enum(TEAM_SIZES),
  message: z.string().trim().min(1).max(3000),
  website: z.string().max(200).optional().default(''),
  elapsedMs: z.number().int().min(0),
})

export type Contact = z.infer<typeof ContactSchema>

export type Decision =
  | { kind: 'invalid'; error: string; code: 'invalid_payload' }
  | { kind: 'ignore'; reason: 'honeypot' | 'too_fast' }
  | { kind: 'accept'; value: Contact }

export interface LeadRow {
  full_name: string
  email: string
  company: string
  team_size: string
  source: 'formation'
  owner: 'Brice'
  stage: 'nouveau'
  lead_date: string
  project_details: string
  next_action: string
  updated_by: string
  updated_at: string
  raw: { origin: string; form: string }
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
  const parsed = ContactSchema.safeParse(body)
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

/** No `id`, no `optout_token`: both carry a database default, and the table has no generated column. */
export function leadRow(value: Contact, now = new Date()): LeadRow {
  return {
    full_name: value.name,
    email: value.email,
    company: value.company,
    team_size: value.teamSize,
    source: 'formation',
    owner: 'Brice',
    stage: 'nouveau',
    lead_date: now.toISOString().slice(0, 10),
    project_details: value.message,
    next_action: 'Répondre à la demande de contact (formulaire sablia.io)',
    updated_by: 'sablia-site/api/contact',
    updated_at: now.toISOString(),
    raw: { origin: 'sablia.io/#contact', form: 'contact' },
  }
}

export function mailPayload(value: Contact, leadId: string | null): MailPayload {
  const text = [
    `Nom : ${value.name}`,
    `Société : ${value.company}`,
    `Email : ${value.email}`,
    `Taille de l'équipe : ${value.teamSize}`,
    '',
    'Demande :',
    value.message,
    '',
    leadId ? `Fiche CRM : ${leadId}` : 'Fiche CRM : ligne CRM non créée',
    'Portail : https://app.sablia.io/leads',
  ].join('\n')

  return {
    from: SENDER,
    to: [RECIPIENT],
    reply_to: value.email,
    subject: `Demande via sablia.io : ${value.company}`,
    text,
  }
}

const detail = (error: unknown) => (error instanceof Error ? error.message : 'unknown')

/**
 * `idx_sabcrm_leads_email` is NOT unique and nothing else would refuse a second row, so a visitor
 * retrying after a slow answer would create a silent duplicate. A failed lookup returns null and
 * the insert proceeds — degrading to "no dedup" is safer than refusing a real request.
 */
async function findRecentLead(email: string, key: string): Promise<string | null> {
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
  const url =
    `${LEADS_ENDPOINT}?select=id&email=eq.${encodeURIComponent(email)}` +
    `&source=eq.formation&created_at=gte.${encodeURIComponent(since)}&limit=1`

  try {
    const response = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error('[contact] lead lookup failed', response.status)
      return null
    }
    const rows = (await response.json()) as { id?: string }[] | null
    return rows?.[0]?.id ?? null
  } catch (error) {
    console.error('[contact] lead lookup threw', detail(error))
    return null
  }
}

/** Never throws: a CRM that refuses the row must not cost the visitor their mail. */
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
      console.error('[contact] lead insert failed', response.status)
      return null
    }
    const rows = (await response.json()) as { id?: string }[] | null
    return rows?.[0]?.id ?? null
  } catch (error) {
    console.error('[contact] lead insert threw', detail(error))
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
      console.error('[contact] missing env', {
        resend: Boolean(resendKey),
        supabase: Boolean(serviceKey),
      })
      return jsonResponse({ error: 'Service indisponible', code: 'not_configured' }, 500)
    }

    // Everything past this point is wrapped: an unexpected shape must never escape as a bare 500.
    try {
      const { value } = decision
      const leadId =
        (await findRecentLead(value.email, serviceKey)) ??
        (await insertLead(leadRow(value), serviceKey))

      try {
        await sendMail(mailPayload(value, leadId), resendKey)
      } catch (error) {
        console.error('[contact] mail failed', detail(error))
        return jsonResponse({ error: 'Envoi impossible', code: 'mail_failed' }, 502)
      }

      return jsonResponse({ ok: true, lead: leadId !== null }, 200)
    } catch (error) {
      console.error('[contact] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
