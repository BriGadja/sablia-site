import { of1 } from './of1'

/**
 * What the OF-1 product page is allowed to offer as proof, and nothing more.
 *
 * Zero client has bought this offer, so none of these lines is a client's word. Each one is a fact
 * about us that a reader can check, and each one has a source line in the hub's proof dossier
 * (projects/sablia/offre/preuve/dossier-de-preuve.md):
 *
 *   - the guarantee comes from `of1.guarantee`, never retyped here          -> P-1
 *   - DOGFOODING_LINE is frozen word for word by the hub guard              -> P-6
 *   - FOUNDER_LINE follows memory/identity/CAREER.md, the only source       -> P-11
 *
 * Those dossier references are why these lines carry no out-of-source marker: the marker exists to
 * make a line beyond OF-1 traceable, and a dossier line with a frozen query does it better. Do not
 * add one here either, since the page guard counts exactly two marked components.
 *
 * The copy guard of this page bans client names, the word it would use for a client's quote, and
 * every outside statistic. Do not reintroduce one here: a validated client comes back on the home
 * page first, and only a deliberate amendment of that guard puts a name on this page.
 */

/**
 * The recorded demonstration, once Brice has filmed it. `null` means the block is not rendered at
 * all: an announced but missing demo is worse than no demo.
 */
export const PROOF_DEMO_URL: string | null = null

/**
 * Frozen sentence, near future, because it is measured: the chain writes no report on a real
 * meeting yet. It switches to the present tense only when the hub's rule of time says so, and it
 * switches everywhere at once. Any divergent wording on a single surface fails the hub guard.
 */
export const DOGFOODING_LINE =
  'La chaîne que nous vendons, nous sommes en train de la brancher sur nos propres rendez-vous : nos comptes rendus commerciaux seront écrits par elle, pas à la main.'

/** Canonical wording of the founder's background. Never "DSI" as a job title. */
export const FOUNDER_LINE =
  "Six ans au sein de la DSI du groupe LVMH comme Proxy Product Owner, sur huit applications et deux mille utilisateurs, puis deux ans Data Senior Consultant chez MeltOne. Sablia depuis février 2025. C'est la même personne qui installe la chaîne, qui la répare quand une interface change, et qui décroche quand vous appelez."

export interface ProofItem {
  readonly key: string
  readonly label: string
  readonly body: string
}

export const PROOF_ITEMS: readonly ProofItem[] = [
  {
    key: 'garantie',
    label: 'Si elle ne tourne pas, vous ne payez rien',
    body: of1.guarantee,
  },
  {
    key: 'usage',
    label: 'Nous la branchons sur nos propres rendez-vous',
    body: DOGFOODING_LINE,
  },
  {
    key: 'fondateur',
    label: 'Une seule personne, du premier appel à la panne',
    body: FOUNDER_LINE,
  },
]
