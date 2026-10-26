/**
 * « Comment nous avez-vous trouvés ? »: the optional select of the contact and resource forms
 * (contract C1). Keys and labels mirror `api/_found-via.ts`; `api/contact.test.ts` pins the parity.
 * The order is Brice's decision (Google first).
 */

export const FOUND_VIA_LABEL = 'Comment nous avez-vous trouvés ?'

/** Wording of the empty option (assumption A5: not in Brice's decision, shown at validation). */
export const FOUND_VIA_EMPTY = 'Choisir (facultatif)'

export const FOUND_VIA_LABELS = {
  google: 'Google',
  ia: 'ChatGPT ou une autre IA',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  bouche_a_oreille: 'Bouche-à-oreille',
  autre: 'Autre',
} as const

export type FoundVia = keyof typeof FOUND_VIA_LABELS

export const FOUND_VIA_OPTIONS = (Object.entries(FOUND_VIA_LABELS) as [FoundVia, string][]).map(
  ([value, label]) => ({ value, label }),
)
