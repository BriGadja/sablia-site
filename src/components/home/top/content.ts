/**
 * Visitor text of the home hero (run site-formation-lot1, copy draft 01b § Home « Hero »). The
 * webinar day is derived from `SESSION` (webinaire.ts, read only): never typed twice.
 */
import { SESSION } from '@/content/webinaire'

const day = SESSION.date.replace(/\s+\d{4}$/, '') // « Jeudi 19 novembre »

export const HERO = {
  pill: "L'IA au travail · formation sur site",
  /** The h1, split so the last words can carry the gold underline. Q1 (b), Brice's choice. */
  h1: { lead: "Votre équipe apprend l'IA sur ", mark: 'ses propres dossiers', tail: '.' },
  sub: "Trois jours chez vous, jusqu'à 12 personnes, pour se former à Claude. Premier pas : un webinaire gratuit d'une heure, le jeudi midi.",
  cta: {
    webinaire: `Prochain webinaire : ${day.charAt(0).toLowerCase()}${day.slice(1)}`,
    book: 'Réserver 30 min',
    /** Second door once the session has started: the offer page, quietly. */
    offre: "Voir l'offre en détail",
  },
  reassure: 'Webinaire et échange gratuits, sans engagement.',
} as const

/** Photo slot 1 of 01c (09/10 event, audience softened by U6), 3:2. */
export const PHOTO = {
  src: '/photos/formation-01-1200.webp',
  srcSet:
    '/photos/formation-01-540.webp 540w, /photos/formation-01-900.webp 900w, /photos/formation-01-1200.webp 1200w',
  width: 1200,
  height: 800,
  alt: "Brice Gachadoat parle debout à un pupitre, devant une salle d'une vingtaine de personnes assises.",
} as const
