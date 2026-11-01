import { z } from 'zod'

/**
 * `GET|POST /api/webinaire-questionnaire` — the ten questions sent before the 30-minute call
 * (US-90, plan webinaire-bureaux-etudes-2026-11-01, unit U2b).
 *
 * The link carries a token (`site_webinar_questionnaires.token`, 32 random bytes in hex, minted by
 * `scripts/webinar.py`). `GET ?t=` answers `{prenom}` (first name of the linked registration) or
 * 404, and NEVER writes nor returns the e-mail. `POST {token, answers}` writes `answers` +
 * `submitted_at` once: a conditional PATCH on `submitted_at is null`, so a second submit (or a race
 * between two tabs) matches no row and gets 409 with the first answers intact.
 *
 * A token that is not 64 lower-case hex chars is refused before any I/O. Honeypot (`website`) and
 * the 3 s floor (`elapsedMs`, optional here: the page sends it) answer 204 like `webinaire.ts`.
 */

const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const QUESTIONNAIRES = `${SUPABASE_URL}/rest/v1/site_webinar_questionnaires`
const REGISTRATIONS = `${SUPABASE_URL}/rest/v1/site_webinar_registrations`
const MIN_ELAPSED_MS = 3000
const TIMEOUT_MS = 4000
const KEYS = Array.from({ length: 10 }, (_, i) => `q${i + 1}`)
const TOKEN_RE = /^[0-9a-f]{64}$/

export const isToken = (value: unknown): value is string =>
  typeof value === 'string' && TOKEN_RE.test(value)

const Answers = z.object(Object.fromEntries(KEYS.map((k) => [k, z.string().max(1000)]))).strict()

const RequestSchema = z
  .object({
    token: z.string().regex(TOKEN_RE),
    answers: Answers,
    website: z.string().max(200).optional().default(''),
    elapsedMs: z.number().int().min(0).optional(),
  })
  .strict()

export type Decision =
  | { kind: 'invalid' }
  | { kind: 'ignore' }
  | { kind: 'accept'; token: string; answers: Record<string, string> }

export function decide(body: unknown): Decision {
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) return { kind: 'invalid' }
  const { token, answers, website, elapsedMs } = parsed.data
  if (website.trim() !== '') return { kind: 'ignore' }
  if (elapsedMs !== undefined && elapsedMs < MIN_ELAPSED_MS) return { kind: 'ignore' }
  return { kind: 'accept', token, answers: answers as Record<string, string> }
}

const detail = (error: unknown) => (error instanceof Error ? error.message : 'unknown')
const enc = encodeURIComponent

const jsonResponse = (body: unknown, status: number, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extra },
  })

/** Names the table, never the query (a token is a credential). */
async function rest<T>(
  url: string,
  key: string,
  init: { method?: 'GET' | 'PATCH'; body?: unknown } = {},
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
    throw new Error(`${method} ${new URL(url).pathname} answered ${response.status}`)
  }
  const rows = (await response.json()) as T[] | null
  return Array.isArray(rows) ? rows : []
}

const notFound = () => jsonResponse({ error: 'Lien inconnu', code: 'not_found' }, 404)

async function handleGet(token: string, key: string): Promise<Response> {
  const [row] = await rest<{ registration_id: string | null }>(
    `${QUESTIONNAIRES}?select=registration_id&token=eq.${enc(token)}&limit=1`,
    key,
  )
  if (!row) return notFound()
  let prenom = ''
  if (row.registration_id) {
    const [registration] = await rest<{ prenom: string }>(
      `${REGISTRATIONS}?select=prenom&id=eq.${enc(row.registration_id)}&limit=1`,
      key,
    )
    prenom = registration?.prenom ?? ''
  }
  return jsonResponse({ prenom }, 200)
}

async function handlePost(
  token: string,
  answers: Record<string, string>,
  key: string,
): Promise<Response> {
  const written = await rest<{ token: string }>(
    `${QUESTIONNAIRES}?token=eq.${enc(token)}&submitted_at=is.null&select=token`,
    key,
    { method: 'PATCH', body: { answers, submitted_at: new Date().toISOString() } },
  )
  if (written.length > 0) return jsonResponse({ state: 'saved' }, 200)
  // No row matched: either the token does not exist (404) or it was already used (409).
  const [row] = await rest<{ token: string }>(
    `${QUESTIONNAIRES}?select=token&token=eq.${enc(token)}&limit=1`,
    key,
  )
  return row ? jsonResponse({ error: 'Déjà envoyé', code: 'already_submitted' }, 409) : notFound()
}

export default {
  async fetch(request: Request): Promise<Response> {
    const isGet = request.method === 'GET'
    if (!isGet && request.method !== 'POST') {
      return new Response(null, { status: 405, headers: { allow: 'GET, POST' } })
    }

    let token: string | undefined
    let answers: Record<string, string> = {}
    if (isGet) {
      const t = new URL(request.url).searchParams.get('t')
      if (!isToken(t)) return notFound()
      token = t
    } else {
      let body: unknown
      try {
        body = await request.json()
      } catch {
        return jsonResponse({ error: 'JSON invalide', code: 'bad_json' }, 400)
      }
      const decision = decide(body)
      if (decision.kind === 'ignore') return new Response(null, { status: 204 })
      if (decision.kind === 'invalid') {
        return jsonResponse({ error: 'Réponses invalides', code: 'invalid_payload' }, 400)
      }
      token = decision.token
      answers = decision.answers
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceKey) {
      console.error('[webinaire-questionnaire] missing env')
      return jsonResponse({ error: 'Service indisponible', code: 'not_configured' }, 500)
    }

    try {
      return isGet
        ? await handleGet(token, serviceKey)
        : await handlePost(token, answers, serviceKey)
    } catch (error) {
      console.error('[webinaire-questionnaire] unexpected', detail(error))
      return jsonResponse({ error: 'Service indisponible', code: 'internal' }, 500)
    }
  },
}
