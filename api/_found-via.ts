import { z } from 'zod'

/**
 * « Comment nous avez-vous trouvés ? » (contract C1, plan visibilite-llm-sablia). Shared by
 * `contact.ts` and `ressources-request.ts`.
 *
 * The leading underscore keeps Vercel from deploying this file as a function: every other file
 * directly under `api/` is one. It is imported as `'./_found-via.js'` (explicit extension) because
 * the site is `"type": "module"` and Node ESM on Vercel does not resolve the extensionless form
 * (https://github.com/vercel/vercel/issues/14910).
 *
 * The keys and labels are mirrored in `client/src/content/found-via.ts`; a parity test in
 * `api/contact.test.ts` keeps the two in step (the function bundle must not reach into `client/`).
 */

export const FOUND_VIA_KEYS = [
  'google',
  'ia',
  'youtube',
  'linkedin',
  'bouche_a_oreille',
  'autre',
] as const

export type FoundVia = (typeof FOUND_VIA_KEYS)[number]

export const FOUND_VIA_LABELS: Record<FoundVia, string> = {
  google: 'Google',
  ia: 'ChatGPT ou une autre IA',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  bouche_a_oreille: 'Bouche-à-oreille',
  autre: 'Autre',
}

/** Optional; the empty string of an unselected `<select>` means "not answered". */
export const FoundViaField = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.enum(FOUND_VIA_KEYS).optional(),
)

/** The key is written only when non-null: an absent answer never reaches the column. */
export function withFoundVia<T extends object>(row: T, foundVia: FoundVia | undefined) {
  return foundVia ? { ...row, found_via: foundVia } : row
}

/** A refused insert whose body names the column (unknown column, schema-cache lag, rollback). */
export function namesFoundVia(body: string): boolean {
  return body.includes('found_via')
}
