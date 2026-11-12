// « Le déroulé » of /formations (01b § 3 Déroulé, from the offer sheet « Le déroulé · proposé »).

export const EYEBROW = 'Le déroulé'
export const TITLE = 'Six demi-journées sur vos dossiers.'
export const NOTE =
  "Les trois jours peuvent se suivre ou s'étaler. Le programme exact est fixé dans la convention de formation."

/** Number of half-days in the bar. */
export const HALF_DAY_COUNT = 6

export interface HalfDays {
  key: string
  /** First and last half-day (1-based, inclusive) the group covers. */
  from: number
  to: number
  title: string
  what: string
}

export const HALF_DAYS: readonly HalfDays[] = [
  {
    key: 'direction',
    from: 1,
    to: 1,
    title: 'Demi-journée 1, avec la direction',
    what: "Les cas d'usage, les règles sur les données, l'espace de travail configuré, la mesure « avant ».",
  },
  {
    key: 'metier',
    from: 2,
    to: 5,
    title: 'Demi-journées 2 à 5, par métier',
    what: 'Chaque équipe travaille sur ses dossiers réels.',
  },
  {
    key: 'cloture',
    from: 6,
    to: 6,
    title: 'Demi-journée 6, clôture',
    what: 'La mesure « après », le plan de formation documenté, et la suite si vous la voulez.',
  },
]

/**
 * US-109 (copy deck B5 `form.short`): shorter formats exist, on request; no price, no programme.
 * Rendered after NOTE, next to the durations of the bar.
 */
export const SHORT_FORMATS = 'Des formats dès une demi-journée, sur demande.'
