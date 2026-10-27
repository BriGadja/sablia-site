import { createHash } from 'node:crypto'
import { z } from 'zod'
import { FoundViaField, withFoundVia } from './_found-via.js'
import {
  findPerson,
  PERSON_SELECT,
  type PersonRow,
  patchLead,
  personState,
} from './_newsletter-person.js'

/**
 * `POST /api/newsletter` — « L'IA au travail », the Tuesday letter (plan sablia-newsletter-resend,
 * US-81 and US-83). Three kinds of body, one per entry point of `/newsletter`:
 *
 * - `request` (the public form): a row in `site_newsletter_pending` and ONE confirmation mail. It
 *   never writes `sabcrm_leads`: every insert there pages the sales group with the person's contact
 *   data (trigger `sabcrm_leads_notify_n8n_trg`), and a bot's address must not reach them. The answer
 *   is the same for a new, a subscribed and an opposed address, so the form tells nobody who is on
 *   the list. Abuse budget: 3 requests per IP and 30 per UTC day (the Resend free quota is shared with
 *   client mail), one mail per address per hour, unconfirmed rows deleted after 7 days.
 * - `confirm` (`?c=` in the confirmation mail): the click writes the CRM, after a claim on the pending
 *   row so two concurrent clicks write once. The row then keeps only the token and the dates, the
 *   proof of the double opt-in.
 * - `invite` (`?t=` in the invitation of `scripts/newsletter.py invite`): the token is the lead's
 *   `optout_token`, a bearer secret that only reaches its owner's mailbox.
 *
 * A person is `lower(email)` across rows (`sabcrm_leads.email` is not unique, one row per resource
 * download, mixed case in base): opposed if ANY row carries `opted_out_at`, subscribed if any row's
 * subscription is newer than its unsubscription, and every write goes to the OLDEST row.
 *
 * Nothing here writes Resend Contacts (the hub's `newsletter.py sync` does) and nothing opens a
 * sequence. Anti-spam of `request` is the honeypot plus the minimum delay of `api/contact.ts`,
 * answering 204 BEFORE any I/O. The page never posts on load: a scanner that opens a link subscribes
 * nobody.
 */

/** Public project ref — no secret, so it stays a constant instead of another env var. */
const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const LEADS_ENDPOINT = `${SUPABASE_URL}/rest/v1/sabcrm_leads`
const PENDING_ENDPOINT = `${SUPABASE_URL}/rest/v1/site_newsletter_pending`
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
/** Transactional and carrying a token link: the warm domain, tracking off (plan B, « who sends what »). */
const SENDER = 'Brice Gachadoat <brice@send.sablia.io>'
const REPLY_TO = 'brice@sablia.io'
const CONFIRM_URL = 'https://sablia.io/newsletter?c='
const SUBJECT = "Confirmez votre inscription à L'IA au travail"
const UPDATED_BY = 'sablia-site/api/newsletter'
const MIN_ELAPSED_MS = 3000
const PENDING_TTL_MS = 7 * 24 * 60 * 60 * 1000
const SAME_ADDRESS_WINDOW_MS = 60 * 60 * 1000
const DAILY_CEILING = 30
const PER_IP_DAILY = 3
const TIMEOUT_MS = 4000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const RequestSchema = z.object({
  kind: z.literal('request'),
  prenom: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).email().toLowerCase(),
  foundVia: FoundViaField,
  website: z.string().max(200).optional().default(''),
  elapsedMs: z.number().int().min(0),
})

const BodySchema = z.discriminatedUnion('kind', [
  RequestSchema,
  z.object({ kind: z.literal('confirm'), token: z.string().trim().max(100) }),
  z.object({ kind: z.literal('invite'), token: z.string().trim().max(100) }),
])

export type NewsletterRequest = z.infer<typeof RequestSchema>

export type Decision =
  | { kind: 'invalid'; error: string; code: 'invalid_payload' }
  | { kind: 'ignore'; reason: 'honeypot' | 'too_fast' }
  | { kind: 'request'; value: NewsletterRequest }
  | { kind: 'confirm'; token: string }
  | { kind: 'invite'; token: string }

interface PendingRow {
  token: string
  email: string | null
  prenom: string | null
  found_via: string | null
  created_at: string
  confirmed_at: string | null
}

export interface MailPayload {
  from: string
  to: string[]
  reply_to: string
  subject: string
  text: string
  html: string
}

/** Parse, then honeypot, then delay. A malformed payload never reaches the spam checks. */
export function decide(body: unknown): Decision {
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join('.') || 'inconnu'
    return {
      kind: 'invalid',
      error: `Formulaire incomplet ou invalide (champ : ${field})`,
      code: 'invalid_payload',
    }
  }
  const value = parsed.data
  if (value.kind !== 'request') return { kind: value.kind, token: value.token }
  if (value.website.trim() !== '') return { kind: 'ignore', reason: 'honeypot' }
  if (value.elapsedMs < MIN_ELAPSED_MS) return { kind: 'ignore', reason: 'too_fast' }
  return { kind: 'request', value }
}

/**
 * The address Caddy saw. Caddy sets `X-Forwarded-For` from the TCP peer (no `trusted_proxies` in
 * `deploy/Caddyfile.sablia-site`), so the LAST entry is the one a visitor cannot forge.
 */
export function clientIp(request: Request): string {
  const last = request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()
  return last || 'unknown'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A short note from Brice. The link opens a page with a button: opening it alone confirms nothing. */
export function confirmMail(prenom: string, email: string, token: string): MailPayload {
  const link = `${CONFIRM_URL}${token}`
  const letter =
    "L'IA au travail, ma lettre du mardi : chaque mardi, la vidéo de la semaine poussée plus loin."
  const ignore =
    "Si vous n'avez rien demandé, ignorez ce message : sans clic, rien ne se passe et la demande s'efface sous 7 jours."
  const text = [
    `Bonjour ${prenom},`,
    '',
    `Vous avez demandé à recevoir ${letter}`,
    '',
    'Pour confirmer votre inscription, ouvrez ce lien puis cliquez sur « Confirmer mon inscription » :',
    link,
    '',
    ignore,
    '',
    'Brice Gachadoat',
    'Sablia',
  ].join('\n')
  const html = [
    `<p>Bonjour ${escapeHtml(prenom)},</p>`,
    `<p>Vous avez demandé à recevoir ${escapeHtml(letter)}</p>`,
    `<p>Pour confirmer votre inscription, ouvrez <a href="${link}">la page de confirmation</a> puis cliquez sur « Confirmer mon inscription ».</p>`,
    `<p style="color:#61677a;font-size:13px">Lien direct : ${link}</p>`,
    `<p>${escapeHtml(ignore)}</p>`,
    '<p>Brice Gachadoat<br>Sablia</p>',
  ].join('')
  return { from: SENDER, to: [email], reply_to: REPLY_TO, subject: SUBJECT, text, html }
}

const detail = (error: unknown) => (error instanceof Error ? error.message : 'unknown')
const enc = encodeURIComponent

/** A Supabase call that did not answer as expected. Its message names the table, never the query (it holds addresses). */
class DbError extends Error {}

/** One PostgREST round trip that must succeed; reads and `return=representation` writes answer rows. */
async function rest<T>(
  url: string,
  key: string,
  init: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; returning?: boolean } = {},
): Promise<T[]> {
  const method = init.method ?? 'GET'
  const headers: Record<string, string> = { apikey: key, Authorization: `Bearer ${key}` }
  if (init.body !== undefined) headers['content-type'] = 'application/json'
  if (method !== 'GET') headers.Prefer = init.returning ? 'return=representation' : 'return=minimal'
  const response = await fetch(url, {
    method,
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new DbError(`${method} ${new URL(url).pathname} answered ${response.status}`)
  }
  if (method !== 'GET' && !init.returning) return []
  const rows = (await response.json()) as T[] | null
  return Array.isArray(rows) ? rows : []
}

/** Housekeeping, never a reason to refuse a visitor: a failed purge is retried by the next request. */
async function purgeExpired(now: Date, key: string): Promise<void> {
  const before = new Date(now.getTime() - PENDING_TTL_MS).toISOString()
  try {
    await rest(`${PENDING_ENDPOINT}?confirmed_at=is.null&created_at=lt.${enc(before)}`, key, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('[newsletter] purge failed', detail(error))
  }
}

async function sendMail(payload: MailPayload, token: string, key: string): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      'Idempotency-Key': `newsletter-confirm-${token}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  // 409 = this key was already used: the mail for this row is out, or on its way.
  if (!response.ok && response.status !== 409) throw new Error(`resend ${response.status}`)
}

const jsonResponse = (body: unknown, status: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const pendingAnswer = () => jsonResponse({ ok: true, state: 'pending' }, 200)
const unknownToken = () =>
  jsonResponse({ error: 'Lien inconnu ou expiré', code: 'unknown_token' }, 404)
const opposedAnswer = () =>
  jsonResponse({ error: 'Cette adresse ne reçoit plus nos messages', code: 'opposed' }, 410)

function busy(now: Date): Response {
  const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const retryAfter = Math.max(1, Math.ceil((tomorrow - now.getTime()) / 1000))
  return jsonResponse({ error: "Trop d'inscriptions aujourd'hui", code: 'busy' }, 429, {
    'Retry-After': String(retryAfter),
  })
}

async function handleRequest(
  value: NewsletterRequest,
  ip: string,
  keys: { service: string; resend: string },
): Promise<Response> {
  const now = new Date()
  const key = keys.service
  await purgeExpired(now, key)

  const dayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString()
  const ipHash = createHash('sha256').update(ip).digest('hex')
  const fromIp = await rest<{ token: string }>(
    `${PENDING_ENDPOINT}?select=token&ip_hash=eq.${ipHash}&created_at=gte.${enc(dayStart)}&limit=${PER_IP_DAILY}`,
    key,
  )
  if (fromIp.length >= PER_IP_DAILY) return busy(now)

  const today = await rest<{ token: string }>(
    `${PENDING_ENDPOINT}?select=token&created_at=gte.${enc(dayStart)}&limit=${DAILY_CEILING}`,
    key,
  )
  if (today.length >= DAILY_CEILING) {
    // The signal to revisit a captcha (decision A7 keeps third-party scripts out until then).
    console.error('newsletter: daily ceiling reached')
    return busy(now)
  }

  const since = new Date(now.getTime() - SAME_ADDRESS_WINDOW_MS).toISOString()
  const recent = await rest<{ token: string }>(
    `${PENDING_ENDPOINT}?select=token&email=eq.${enc(value.email)}&confirmed_at=is.null&created_at=gte.${enc(since)}&limit=1`,
    key,
  )
  if (recent.length > 0) return pendingAnswer()

  // Subscribed or opposed: the same answer as a new address, and nothing is written or sent.
  if (personState(await findPerson(value.email, key)) !== 'none') return pendingAnswer()

  const [row] = await rest<{ token: string }>(PENDING_ENDPOINT, key, {
    method: 'POST',
    body: withFoundVia(
      { email: value.email, prenom: value.prenom, ip_hash: ipHash },
      value.foundVia,
    ),
    returning: true,
  })
  if (!row?.token) throw new DbError('POST site_newsletter_pending returned no token')

  try {
    await sendMail(confirmMail(value.prenom, value.email, row.token), row.token, keys.resend)
  } catch (error) {
    console.error('[newsletter] mail failed', detail(error))
    // No mail left: without its row, a retry within the hour sends one instead of waiting.
    await rest(`${PENDING_ENDPOINT}?token=eq.${row.token}`, key, { method: 'DELETE' }).catch((e) =>
      console.error('[newsletter] pending cleanup failed', detail(e)),
    )
    return jsonResponse({ error: 'Envoi impossible', code: 'mail_failed' }, 502)
  }
  return pendingAnswer()
}

async function handleConfirm(token: string, key: string): Promise<Response> {
  const now = new Date()
  const [pending] = await rest<PendingRow>(
    `${PENDING_ENDPOINT}?select=token,email,prenom,found_via,created_at,confirmed_at&token=eq.${token}&limit=1`,
    key,
  )
  if (!pending) return unknownToken()
  if (pending.confirmed_at) return jsonResponse({ ok: true, state: 'subscribed' }, 200)
  if (now.getTime() - Date.parse(pending.created_at) > PENDING_TTL_MS) return unknownToken()
  if (!pending.email) throw new DbError('unconfirmed pending row without an email')

  const person = await findPerson(pending.email, key)
  if (personState(person) === 'opposed') return opposedAnswer()

  // The claim: only the click that flips `confirmed_at` goes on; a concurrent one gets the same answer.
  const [claimed] = await rest<PendingRow>(
    `${PENDING_ENDPOINT}?token=eq.${token}&confirmed_at=is.null`,
    key,
    { method: 'PATCH', body: { confirmed_at: now.toISOString() }, returning: true },
  )
  if (!claimed) return jsonResponse({ ok: true, state: 'subscribed' }, 200)
  const email = claimed.email ?? pending.email
  const prenom = claimed.prenom ?? pending.prenom ?? ''

  let leadId: string
  try {
    const oldest = person[0]
    if (oldest) {
      await patchLead(
        oldest.id,
        {
          newsletter_requested_at: claimed.created_at,
          newsletter_subscribed_at: now.toISOString(),
          newsletter_unsubscribed_at: null,
          newsletter_source: 'site_form',
          updated_by: UPDATED_BY,
          updated_at: now.toISOString(),
        },
        key,
      )
      leadId = oldest.id
    } else {
      const foundVia = FoundViaField.safeParse(claimed.found_via ?? undefined)
      const [created] = await rest<{ id: string }>(LEADS_ENDPOINT, key, {
        method: 'POST',
        body: withFoundVia(
          {
            full_name: prenom,
            email,
            source: 'newsletter',
            owner: 'Brice',
            stage: 'nouveau',
            intention: 'newsletter_seule',
            newsletter_requested_at: claimed.created_at,
            newsletter_subscribed_at: now.toISOString(),
            newsletter_source: 'site_form',
            lead_date: now.toISOString().slice(0, 10),
            project_details: "Newsletter « L'IA au travail »",
            next_action: 'Aucun contact (abonné newsletter)',
            updated_by: UPDATED_BY,
            updated_at: now.toISOString(),
            raw: { origin: 'sablia.io/newsletter' },
          },
          foundVia.success ? foundVia.data : undefined,
        ),
        returning: true,
      })
      if (!created?.id) throw new DbError('POST sabcrm_leads returned no id')
      leadId = created.id
    }
  } catch (error) {
    // Give the click back: without this, the next click would read « already confirmed » and nobody
    // would be subscribed. The row still carries email and prenom, so the CHECK accepts it.
    await rest(`${PENDING_ENDPOINT}?token=eq.${token}`, key, {
      method: 'PATCH',
      body: { confirmed_at: null },
    }).catch((e) => console.error('[newsletter] claim release failed', detail(e)))
    console.error('[newsletter] lead write failed', detail(error))
    return jsonResponse({ error: 'Service indisponible', code: 'write_failed' }, 500)
  }

  // Only the proof stays: token, dates, lead. A failure is logged; the subscription itself holds.
  await rest(`${PENDING_ENDPOINT}?token=eq.${token}`, key, {
    method: 'PATCH',
    body: { lead_id: leadId, email: null, prenom: null, ip_hash: null },
  }).catch((e) => console.error('[newsletter] pending scrub failed', detail(e)))

  return jsonResponse({ ok: true, state: 'subscribed', prenom }, 200)
}

async function handleInvite(token: string, key: string): Promise<Response> {
  const now = new Date()
  const [row] = await rest<PersonRow>(
    `${LEADS_ENDPOINT}?select=${PERSON_SELECT}&optout_token=eq.${token}&limit=1`,
    key,
  )
  if (!row) return unknownToken()
  const others = row.email ? await findPerson(row.email, key) : []
  const person = others.some((r) => r.id === row.id) ? others : [...others, row]
  if (personState(person) === 'opposed') return opposedAnswer()

  await patchLead(
    (others[0] ?? row).id,
    {
      newsletter_subscribed_at: now.toISOString(),
      newsletter_unsubscribed_at: null,
      newsletter_source: 'invitation',
      updated_by: UPDATED_BY,
      updated_at: now.toISOString(),
    },
    key,
  )
  return jsonResponse({ ok: true, state: 'subscribed' }, 200)
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

    const resendKey = process.env.RESEND_API_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const needsMail = decision.kind === 'request'
    if (!serviceKey || (needsMail && !resendKey)) {
      console.error('[newsletter] missing env', {
        resend: Boolean(resendKey),
        supabase: Boolean(serviceKey),
      })
      return jsonResponse({ error: 'Service indisponible', code: 'not_configured' }, 500)
    }

    // Everything past this point is wrapped: an unexpected shape must never escape as a bare 500.
    try {
      if (decision.kind === 'request') {
        return await handleRequest(decision.value, clientIp(request), {
          service: serviceKey,
          resend: resendKey ?? '',
        })
      }
      // A token that is not a uuid can match nothing: answered without asking the database.
      if (!UUID.test(decision.token)) return unknownToken()
      return decision.kind === 'confirm'
        ? await handleConfirm(decision.token, serviceKey)
        : await handleInvite(decision.token, serviceKey)
    } catch (error) {
      console.error('[newsletter] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
