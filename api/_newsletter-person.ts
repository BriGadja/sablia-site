/**
 * « A person is `lower(email)`, not a row » (plan sablia-newsletter-resend, Phase A). Shared by
 * `newsletter.ts` and `ressources-request.ts`.
 *
 * `sabcrm_leads.email` is not unique (one row per resource download, mixed case in base), so every
 * reader fetches all rows of the address, oldest first: the person is OPPOSED if any row carries
 * `opted_out_at`, SUBSCRIBED if any row's subscription is newer than its unsubscription, and every
 * write goes to the OLDEST row (the one whose `optout_token` the invitation carries).
 *
 * The leading underscore keeps this file from being read as a handler, like `_found-via.ts`.
 */

const LEADS_ENDPOINT = 'https://qlxoitzdxjqhljjoeqoq.supabase.co/rest/v1/sabcrm_leads'
const TIMEOUT_MS = 4000

export const PERSON_SELECT =
  'id,email,full_name,optout_token,opted_out_at,archived_at,newsletter_subscribed_at,newsletter_unsubscribed_at'

export interface PersonRow {
  id: string
  email: string | null
  full_name: string | null
  optout_token: string
  opted_out_at: string | null
  archived_at: string | null
  newsletter_subscribed_at: string | null
  newsletter_unsubscribed_at: string | null
}

/**
 * The value of a PostgREST `ilike` filter matching exactly this address: the LIKE wildcards are
 * escaped, then everything is percent-encoded (a bare `+` would arrive as a space).
 */
export function likeValue(email: string): string {
  return encodeURIComponent(email.replace(/[\\*%_]/g, (c) => `\\${c}`))
}

export function personState(rows: PersonRow[]): 'opposed' | 'subscribed' | 'none' {
  if (rows.some((r) => r.opted_out_at)) return 'opposed'
  const subscribed = rows.some(
    (r) =>
      r.newsletter_subscribed_at !== null &&
      (r.newsletter_unsubscribed_at === null ||
        Date.parse(r.newsletter_subscribed_at) > Date.parse(r.newsletter_unsubscribed_at)),
  )
  return subscribed ? 'subscribed' : 'none'
}

const headers = (key: string) => ({ apikey: key, Authorization: `Bearer ${key}` })

/** Every row of the person, oldest first, exact lowercase matches only (ilike also matches look-alikes). Throws on failure. */
export async function findPerson(email: string, key: string): Promise<PersonRow[]> {
  const target = email.toLowerCase()
  const response = await fetch(
    `${LEADS_ENDPOINT}?select=${PERSON_SELECT}&email=ilike.${likeValue(target)}&order=created_at.asc`,
    { headers: headers(key), signal: AbortSignal.timeout(TIMEOUT_MS) },
  )
  // The message names the table, never the query: it holds an address.
  if (!response.ok) throw new Error(`GET sabcrm_leads answered ${response.status}`)
  const rows = (await response.json()) as PersonRow[] | null
  return (Array.isArray(rows) ? rows : []).filter((r) => (r.email ?? '').toLowerCase() === target)
}

/** Writes one lead row by id and proves it: a PATCH that matches nothing is silent in PostgREST. Throws on failure. */
export async function patchLead(
  id: string,
  fields: Record<string, unknown>,
  key: string,
): Promise<void> {
  const response = await fetch(`${LEADS_ENDPOINT}?id=eq.${encodeURIComponent(id)}&select=id`, {
    method: 'PATCH',
    headers: {
      ...headers(key),
      'content-type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(fields),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`PATCH sabcrm_leads answered ${response.status}`)
  const rows = (await response.json()) as unknown[] | null
  if (!Array.isArray(rows) || rows.length !== 1) {
    throw new Error(`PATCH sabcrm_leads matched ${Array.isArray(rows) ? rows.length : 0} rows`)
  }
}
