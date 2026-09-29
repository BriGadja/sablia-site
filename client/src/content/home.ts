/**
 * Home page content module : proof line, video, final call, photo assets and the Formations quotes.
 *
 * The two new sentences (PROOF_LINE, FINAL_CALL_TITLE) are shown to Brice on the preview
 * (decision 6, 2026-09-28) before this content ships.
 */

export interface HomeVideo {
  youtubeId: string
  title: string
  durationLabel: string
}

export const HOME_VIDEO: HomeVideo = {
  youtubeId: 'd5fo00AFqVM',
  title:
    "J'ai branché Claude sur mon CRM : il se remplit tout seul après chaque appel (démo en direct)",
  durationLabel: '7 min',
}

/**
 * The proof line, rewritten by Brice on 2026-09-29 after the preview: « Ne parle pas d'appels ».
 * The call and meeting figures left the home that day; this sentence replaced them word for word.
 * Row P-15 of the hub's proof dossier (projects/sablia/offre/preuve/dossier-de-preuve.md) holds
 * its source: the founder's written statement of 2026-09-29, over a measured floor of 10 clients
 * invoiced in Qonto since 13/02/2025 (the others were served through partners). Declared, not
 * document-proven. No client is ever named next to it.
 */
// confirmed by Brice on 2026-09-29, after the preview
export const PROOF_LINE = 'Plus de 20 clients accompagnés depuis 2025.'

// shown to Brice on the preview (decision 6, 2026-09-28)
export const FINAL_CALL_TITLE = 'Trente minutes pour voir si ça tourne chez vous.'

export const BOOKING_LABEL = 'Réserver 30 min'

export interface HomePhoto {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

export const HERO_PHOTO: HomePhoto = {
  src: '/photos/accueil-meetup-ecran-1200.webp',
  srcSet:
    '/photos/accueil-meetup-ecran-720.webp 720w, /photos/accueil-meetup-ecran-1200.webp 1200w',
  width: 1200,
  height: 1339,
  alt: "Brice Gachadoat montre l'écran pendant une formation IA",
}

export const FORMATIONS_PHOTO: HomePhoto = {
  src: '/photos/accueil-meetup-public-900.webp',
  srcSet:
    '/photos/accueil-meetup-public-540.webp 540w, /photos/accueil-meetup-public-900.webp 900w',
  width: 900,
  height: 1350,
  alt: 'Brice Gachadoat anime une formation IA devant un public',
}

export interface HomeQuote {
  quote: string
  /** First name and role only: no surname, photo or company (dossier rule 6 and its exception). */
  who: string
}

/**
 * Two training testimonials supplied by Brice on 2026-09-29, each written by its author (rows P-16
 * and P-17 of the hub's proof dossier). Word for word: the only edits are typographic (an accent,
 * a doubled opening quote mark). `landing.copy.test.ts` pins both texts against the dossier.
 */
export const FORMATION_QUOTES: readonly HomeQuote[] = [
  {
    quote:
      "J'ai retrouvé Brice dans une posture inattendue : il a été étudiant dans une école où j'intervenais moi-même. Mais cette fois-ci, c'était lui le formateur et moi l'apprenant. J'apprécie particulièrement le fait que Brice parvienne à transmettre une compréhension solide de sujets très techniques pour des publics qui ne sont eux-mêmes pas des profils techniques. Un très bon pédagogue sur des sujets arides. Je vois aussi en lui une rare capacité à mettre la technique en perspective et à lui donner vie. Je ne peux que recommander ses interventions.",
    who: 'Vassili, intervenant en école',
  },
  {
    quote:
      "À mes débuts, après avoir commencé à apprendre seul, la formation Claude Code de Brice et son accompagnement dans sa prise en main m'ont beaucoup aidé. Ses ateliers techniques m'ont permis de découvrir de nombreuses fonctionnalités et méthodes de travail que je n'exploitais pas encore, et de gagner rapidement en efficacité dans mon apprentissage. Une formation concrète, accessible et directement applicable au quotidien.",
    who: 'Franky, apprenant de la formation Claude Code',
  },
]
