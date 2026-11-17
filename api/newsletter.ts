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
 * `POST /api/newsletter`: « L'IA au travail », the Tuesday letter (plan sablia-newsletter-resend,
 * US-81 and US-83). Three kinds of body, one per entry point of `/newsletter`:
 *
 * - `request` (the public form): a row in `site_newsletter_pending` (with its `via` source tag when
 *   the page had a valid one) and ONE confirmation mail. It never writes `sabcrm_leads`: every insert
 *   there pages the sales group with the person's contact data (trigger `sabcrm_leads_notify_n8n_trg`),
 *   and a bot's address must not reach them. The answer is the same for a new, a subscribed and an
 *   opposed address, so the form tells nobody who is on the list. One asymmetry, kept from the old
 *   502: a NEW address whose confirmation mail failed answers 202 `queued` (the row is kept with
 *   `mail_failed_at` and the hub's `newsletter.py pending` pass sends it), where a subscribed or
 *   opposed one answers 200 `pending`. Abuse budget: 3 requests per IP and 30 per UTC day (the Resend
 *   free quota is shared with client mail), one mail per address per hour. Expiry (plan
 *   sablia-newsletter-circuit-croissance, Q2-A): an unconfirmed row expires 7 days after our LAST mail
 *   (`reminded_at`, else `created_at`); a row no mail ever left for (`mail_failed_at` set, never
 *   reminded) is left to the hub, with a 30-day backstop (`expiredOnSite`, `purgeExpired`).
 * - `confirm` (`?c=` in the confirmation mail): the click writes the CRM, after a claim on the pending
 *   row so two concurrent clicks write once. The row then keeps only the token, the dates and `via`,
 *   the proof of the double opt-in. The FIRST confirmation then sends one welcome mail
 *   (`welcomeMail`, its own idempotency key); its failure never undoes the subscription.
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

/** Public project ref (no secret), so it stays a constant instead of another env var. */
const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const LEADS_ENDPOINT = `${SUPABASE_URL}/rest/v1/sabcrm_leads`
const PENDING_ENDPOINT = `${SUPABASE_URL}/rest/v1/site_newsletter_pending`
const LETTRES_ENDPOINT = `${SUPABASE_URL}/rest/v1/contenu_lettres`
const RESEND_ENDPOINT = 'https://api.resend.com/emails'
/** Transactional and carrying a token link: the warm domain, tracking off (plan B, « who sends what »). */
const SENDER = 'Brice Gachadoat <brice@send.sablia.io>'
const REPLY_TO = 'brice@sablia.io'
const CONFIRM_URL = 'https://sablia.io/newsletter?c='
const SUBJECT = "Confirmez votre inscription à L'IA au travail"
const WELCOME_SUBJECT = "Bienvenue dans L'IA au travail"
const LETTRE_URL = 'https://sablia.io/lettre/'
/** Where the welcome mail points while no issue is published (or the register cannot be read). */
const ISSUES_FALLBACK_URL = 'https://sablia.io/newsletter#numeros'
const UPDATED_BY = 'sablia-site/api/newsletter'
const MIN_ELAPSED_MS = 3000
const DAY_MS = 24 * 60 * 60 * 1000
/** Life of an unconfirmed request after our last mail to it (Q2-A). */
const PENDING_TTL_MS = 7 * DAY_MS
/** Backstop for a request no mail ever left for: the hub reminds it, or alerts, well before. */
const NEVER_MAILED_TTL_MS = 30 * DAY_MS
const SAME_ADDRESS_WINDOW_MS = 60 * 60 * 1000
const DAILY_CEILING = 30
const PER_IP_DAILY = 3
const TIMEOUT_MS = 4000
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** The `via` source tag (P1): same format as the CHECK `site_newsletter_pending_via_format`. */
const VIA_FORMAT = /^[a-z0-9][a-z0-9-]{0,59}$/

const RequestSchema = z.object({
  kind: z.literal('request'),
  prenom: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).email().toLowerCase(),
  foundVia: FoundViaField,
  /** Invalid or absent → not written, never a refusal: a mangled link must not cost a sign-up. */
  via: z.string().regex(VIA_FORMAT).optional().catch(undefined),
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

interface PendingRow extends ExpiryFields {
  token: string
  email: string | null
  prenom: string | null
  found_via: string | null
  confirmed_at: string | null
}

/** What decides the expiry of an unconfirmed request (columns of migration 20261118090000). */
export interface ExpiryFields {
  created_at: string
  reminded_at?: string | null
  mail_failed_at?: string | null
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

/**
 * The site's expiry rule (Q2-A, shared vectors `api/__fixtures__/newsletter-expiry-vectors.json`,
 * column `expired_site`): 7 days after `reminded_at`, else after `created_at`; a never-mailed row
 * (`mail_failed_at` set, `reminded_at` null) is left to the hub and expires here only after 30 days.
 * `purgeExpired` writes the same rule as a PostgREST filter.
 */
export function expiredOnSite(row: ExpiryFields, now: Date): boolean {
  const before = (iso: string, ttl: number) => Date.parse(iso) < now.getTime() - ttl
  if (row.reminded_at) return before(row.reminded_at, PENDING_TTL_MS)
  if (row.mail_failed_at) return before(row.created_at, NEVER_MAILED_TTL_MS)
  return before(row.created_at, PENDING_TTL_MS)
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** A short note from Brice. The link opens a page with a button: opening it alone confirms nothing. */
export function confirmMail(prenom: string, email: string, token: string): MailPayload {
  const link = `${CONFIRM_URL}${token}`
  const letter =
    "L'IA au travail, ma lettre du mardi : chaque mardi, la vidéo de la semaine poussée plus loin."
  const ignore =
    "Si vous n'avez rien demandé, ignorez ce message : sans clic, rien ne se passe et la demande s'efface 7 jours après notre dernier message."
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

/**
 * Sent once, at the FIRST confirmation click (decision 4), from Brice's address: who writes, the
 * rhythm, the last issue, one question to answer by mail, how to leave. Not a broadcast, so no
 * unsubscribe merge tag: the person just subscribed, and each letter carries the link.
 */
export function welcomeMail(prenom: string, email: string, lastIssueUrl: string): MailPayload {
  const hello = prenom ? `Bonjour ${prenom},` : 'Bonjour,'
  const who =
    "Je suis Brice Gachadoat. Avec Sablia, j'aide les PME à mettre l'IA au travail, et c'est moi qui écris cette lettre."
  const rhythm = "Vous la recevrez chaque mardi matin : une idée concrète d'IA au travail."
  const last = 'Le dernier numéro est en ligne :'
  const question =
    "Qu'est-ce qui vous fait perdre le plus de temps au bureau en ce moment ? Répondez simplement à ce mail."
  const leave = 'Pour vous désinscrire, il y a un lien en bas de chaque lettre.'
  const text = [
    hello,
    '',
    who,
    '',
    rhythm,
    '',
    last,
    lastIssueUrl,
    '',
    question,
    '',
    leave,
    '',
    'Brice Gachadoat',
    'Sablia',
  ].join('\n')
  const html = [
    `<p>${escapeHtml(hello)}</p>`,
    `<p>${escapeHtml(who)}</p>`,
    `<p>${escapeHtml(rhythm)}</p>`,
    `<p>${escapeHtml(last)} <a href="${escapeHtml(lastIssueUrl)}">${escapeHtml(lastIssueUrl)}</a></p>`,
    `<p>${escapeHtml(question)}</p>`,
    `<p>${escapeHtml(leave)}</p>`,
    '<p>Brice Gachadoat<br>Sablia</p>',
  ].join('')
  return { from: SENDER, to: [email], reply_to: REPLY_TO, subject: WELCOME_SUBJECT, text, html }
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

/**
 * The PostgREST form of `expiredOnSite` (plan D2): anchor `reminded_at`, else `created_at`; never-mailed
 * rows only past the 30-day backstop. Timestamps are double-quoted: PostgREST reserves `.` and `:`
 * inside a logic tree.
 */
export function purgeFilter(now: Date): string {
  const x = new Date(now.getTime() - PENDING_TTL_MS).toISOString()
  const x30 = new Date(now.getTime() - NEVER_MAILED_TTL_MS).toISOString()
  const tree = `(and(reminded_at.is.null,mail_failed_at.is.null,created_at.lt."${x}"),reminded_at.lt."${x}",and(reminded_at.is.null,created_at.lt."${x30}"))`
  return `confirmed_at=is.null&or=${enc(tree)}`
}

/** Housekeeping, never a reason to refuse a visitor: a failed purge is retried by the next request. */
async function purgeExpired(now: Date, key: string): Promise<void> {
  try {
    await rest(`${PENDING_ENDPOINT}?${purgeFilter(now)}`, key, { method: 'DELETE' })
  } catch (error) {
    console.error('[newsletter] purge failed', detail(error))
  }
}

/** A refused insert whose body names the column `via` as a word (`found_via` does not count). */
const namesVia = (body: string) => /\bvia\b/.test(body)

/**
 * The pending INSERT. A refusal naming the column `via` (migration not applied, schema-cache lag,
 * rollback) is retried ONCE without it, like `namesFoundVia` in `ressources-request.ts`: a missing
 * column never costs the visitor their sign-up.
 */
async function insertPending(row: Record<string, unknown>, key: string): Promise<string> {
  const response = await fetch(PENDING_ENDPOINT, {
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
    if ('via' in row && namesVia(refusal)) {
      console.error('[newsletter] pending insert refused the via column, retried without it')
      const { via: _dropped, ...withoutVia } = row
      return await insertPending(withoutVia, key)
    }
    throw new DbError(`POST /rest/v1/site_newsletter_pending answered ${response.status}`)
  }
  const rows = (await response.json()) as { token?: string }[] | null
  const token = Array.isArray(rows) ? rows[0]?.token : undefined
  if (!token) throw new DbError('POST site_newsletter_pending returned no token')
  return token
}

/** The newest published issue, for the welcome mail; the issue list of `/newsletter` otherwise. */
async function lastIssueUrl(key: string): Promise<string> {
  try {
    const [row] = await rest<{ slug?: string }>(
      `${LETTRES_ENDPOINT}?select=slug&published=eq.true&order=published_at.desc&limit=1`,
      key,
    )
    return row?.slug ? `${LETTRE_URL}${row.slug}` : ISSUES_FALLBACK_URL
  } catch (error) {
    console.error('[newsletter] last issue read failed', detail(error))
    return ISSUES_FALLBACK_URL
  }
}

/** `idempotencyKey` is per mail and per row: a `409` means this very mail already left. */
async function sendMail(payload: MailPayload, idempotencyKey: string, key: string): Promise<void> {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      'Idempotency-Key': idempotencyKey,
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
const queuedAnswer = () => jsonResponse({ ok: true, state: 'queued' }, 202)
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
  // Salted with the UTC day: the per-day limit still matches, and a stored fingerprint cannot be
  // reversed with one table of every IPv4 address.
  const ipHash = createHash('sha256')
    .update(`${dayStart.slice(0, 10)}|${ip}`)
    .digest('hex')
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

  // Subscribed or opposed: the same answer as a new address, and nothing is written or sent. A person
  // who LEFT may come back here: the confirmation click is the verified consent.
  const state = personState(await findPerson(value.email, key))
  if (state === 'subscribed' || state === 'opposed') return pendingAnswer()

  const fields = withFoundVia(
    { email: value.email, prenom: value.prenom, ip_hash: ipHash },
    value.foundVia,
  )
  const token = await insertPending(value.via ? { ...fields, via: value.via } : fields, key)

  try {
    await sendMail(
      confirmMail(value.prenom, value.email, token),
      `newsletter-confirm-${token}`,
      keys.resend,
    )
  } catch (error) {
    console.error('[newsletter] mail failed', detail(error))
    // S2: the row is KEPT and marked; the hub's reminder pass sends the confirmation at once. A
    // retry within the hour gets the « pending » answer and no second mail (same-address rule).
    await rest(`${PENDING_ENDPOINT}?token=eq.${token}`, key, {
      method: 'PATCH',
      body: { mail_failed_at: now.toISOString() },
    }).catch((e) => console.error('[newsletter] mail_failed_at mark failed', detail(e)))
    return queuedAnswer()
  }
  return pendingAnswer()
}

async function handleConfirm(
  token: string,
  keys: { service: string; resend: string | undefined },
): Promise<Response> {
  const now = new Date()
  const key = keys.service
  const [pending] = await rest<PendingRow>(
    `${PENDING_ENDPOINT}?select=token,email,prenom,found_via,created_at,confirmed_at,reminded_at,mail_failed_at&token=eq.${token}&limit=1`,
    key,
  )
  if (!pending) return unknownToken()
  if (pending.confirmed_at) return jsonResponse({ ok: true, state: 'subscribed' }, 200)
  if (expiredOnSite(pending, now)) return unknownToken()
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

  await sendWelcome(token, prenom, email, keys)
  return jsonResponse({ ok: true, state: 'subscribed', prenom }, 200)
}

/** After a FIRST confirmation only (the claim succeeded). Never throws: the subscription holds. */
async function sendWelcome(
  token: string,
  prenom: string,
  email: string,
  keys: { service: string; resend: string | undefined },
): Promise<void> {
  if (!keys.resend) {
    console.error('[newsletter] welcome skipped: RESEND_API_KEY missing')
    return
  }
  try {
    const url = await lastIssueUrl(keys.service)
    await sendMail(welcomeMail(prenom, email, url), `newsletter-welcome-${token}`, keys.resend)
  } catch (error) {
    console.error('[newsletter] welcome mail failed', detail(error))
  }
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
        ? await handleConfirm(decision.token, { service: serviceKey, resend: resendKey })
        : await handleInvite(decision.token, serviceKey)
    } catch (error) {
      console.error('[newsletter] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
