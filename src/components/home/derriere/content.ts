/** Home `#derriere` copy. Dates and titles follow memory/identity/CAREER.md (LinkedIn ruling 2026-10-14). */

export const HEADING =
  "Derrière Sablia, Brice Gachadoat\u00a0: il installe Claude dans les outils des entreprises, et l'enseigne à l'école Noésia."

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
]

export const PARALLEL = [
  { key: 'sablia', name: 'Sablia', role: 'fondateur', dark: true },
  { key: 'noesia', name: 'Noésia', role: 'expert', dark: false },
] as const

export const PHOTO_ALT = 'Brice Gachadoat anime une formation IA devant un public'
