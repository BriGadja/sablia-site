/**
 * Visitor text of the home hero (US-104, plan sablia-site-structure-offre, copy deck B2 `home.*`). The
 * webinar day is derived from `SESSION` (webinaire.ts, read only): never typed twice.
 */
import { SESSION } from '@/content/webinaire'

const day = SESSION.date.replace(/\s+\d{4}$/, '') // « Jeudi 3 décembre »

export const HERO = {
  pill: 'Sablia, à Rouen · PME de 10 à 50 personnes',
  /** The h1, split so the last words can carry the gold underline (`home.h1`). */
  h1: { lead: "L'IA mise en place dans votre PME, et ", mark: 'votre équipe formée', tail: '.' },
  sub: "Brice Gachadoat, fondateur de Sablia, à Rouen, pour les PME de 10 à 50 personnes qui n'ont personne en interne pour s'en occuper.",
  cta: {
    webinaire: `Prochain webinaire : ${day.charAt(0).toLowerCase()}${day.slice(1)}`,
    book: 'Réserver 30 min',
  },
  reassure: 'Webinaire et échange gratuits, sans engagement.',
} as const

export interface Door {
  readonly href: string
  readonly label: string
  readonly line: string
}

/** The four doors of the site, in the menu's order and words (`home.door.1..4`), the monthly offer first. */
export const DOORS: readonly Door[] = [
  {
    href: '/responsable-ia-externalise',
    label: 'Responsable IA externalisé',
    line: "Quelqu'un qui construit et entretient vos outils, chaque mois.",
  },
  {
    href: '/formations',
    label: 'Formations',
    line: "D'une demi-journée à trois jours, pour votre équipe.",
  },
  {
    href: '/conferences',
    label: 'Conférences',
    line: 'Une conférence ou un séminaire, sur demande.',
  },
  {
    href: '/realisations',
    label: 'Réalisations',
    line: 'Outils, sites et formations construits pour des clients.',
  },
]

/** Photo slot 1 of 01c (09/10 event, audience softened by U6), 3:2. */
export const PHOTO = {
  src: '/photos/formation-01-1200.webp',
  srcSet:
    '/photos/formation-01-540.webp 540w, /photos/formation-01-900.webp 900w, /photos/formation-01-1200.webp 1200w',
  width: 1200,
  height: 800,
  alt: "Brice Gachadoat parle debout à un pupitre, devant une salle d'une vingtaine de personnes assises.",
} as const
