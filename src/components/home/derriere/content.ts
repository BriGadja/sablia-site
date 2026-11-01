/**
 * Home `#derriere`: the trainer (plan site-formation-lot1 U8, copy 01b « The trainer »). Career facts
 * follow memory/identity/CAREER.md (six years in the LVMH DSI, five as Product Owner, MeltOne
 * 2023-2025, Sablia since January 2025). Counters are Brice's declared figures (lot-2 grill, 18-19/10),
 * moved here from `#formations`. Noésia appears in ONE proof line, under the counters.
 */

export const EYEBROW = 'Qui forme votre équipe'

export const HEADING = 'Brice Gachadoat, fondateur de Sablia.'

export const LINE =
  "Six ans au sein de la DSI du groupe LVMH, dont cinq comme Product Owner, puis deux ans Consultant senior BI. Depuis janvier 2025, avec Sablia, il installe l'IA dans les outils des entreprises et forme les équipes qui s'en servent."

export const TIMELINE_LABEL = 'Parcours'

export interface CareerRow {
  readonly key: string
  readonly period: string
  readonly employer: string
  readonly role: string
}

export const CAREER: readonly CareerRow[] = [
  {
    key: 'lvmh',
    period: '2016 · 2023',
    employer: 'LVMH',
    role: "Au sein de la DSI, jusqu'à Head of Controlling Domain",
  },
  { key: 'meltone', period: '2023 · 2025', employer: 'MeltOne', role: 'Consultant senior BI' },
  { key: 'sablia', period: 'Depuis 2025', employer: 'Sablia', role: 'fondateur' },
]

export interface Stat {
  readonly key: string
  readonly value: number
  /** Appended after the figure ("+" = "at least"). */
  readonly suffix: string
  readonly label: string
}

export const STATS: readonly Stat[] = [
  { key: 'students', value: 1400, suffix: '+', label: 'élèves' },
  { key: 'workshops', value: 30, suffix: '+', label: 'ateliers animés' },
  { key: 'master', value: 4, suffix: '', label: 'masterclass' },
  { key: 'videos', value: 29, suffix: '', label: 'vidéos, le module Claude Code, 10 heures' },
]

/** The single Noésia line; `link` is the part of it that links to the school's page of experts. */
export const NOESIA = {
  line: "À l'école Noésia, où il est expert depuis juin 2025.",
  link: 'école Noésia',
  href: 'https://noesia.school',
} as const

/** Photos of the 9 October 2026 session (U6): `formation-NN-{540,900,1200}.webp`. */
export interface Photo {
  readonly n: string
  readonly alt: string
}

export const PORTRAIT: Photo = {
  n: '02',
  alt: 'Brice Gachadoat en pleine intervention, les deux mains ouvertes.',
}

export function photoSrcSet(n: string): string {
  return [540, 900, 1200].map((w) => `/photos/formation-${n}-${w}.webp ${w}w`).join(', ')
}

/** Thousands separator = narrow no-break space, fixed here so server and browser print the same string. */
export function formatFigure(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
