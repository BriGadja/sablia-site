/**
 * Home page content module : proof line, video, final call and photo assets.
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
 * The two proof figures come from our own execution logs, frozen queries P-7 and P-8 of the hub's
 * proof dossier (projects/sablia/offre/preuve/dossier-de-preuve.md). No client is named and no
 * sentence is quoted (decision A4 then the 2026-09-17 ruling): consent to be named was never
 * traced, and a name goes back up only once its owner has validated, in writing, the sentence
 * written about them. Moved here from the retired ProofSection on 2026-09-28 (decision 4).
 */
// shown to Brice on the preview (decision 6, 2026-09-28)
export const PROOF_LINE =
  'Déjà en production chez nos clients : 289 appels sur 326 décrochés ont eu une suite concrète, soit 89 %, et 68 rendez-vous posés sans un seul appel manuel.'

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
