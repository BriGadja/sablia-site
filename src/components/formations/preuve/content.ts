// The proof block of /formations (01b § 3, optional proof block, choice 8). Titled « Retours d'un
// séminaire » since Brice's answer at VP2 (13/11, question 8): the score comes from a one-morning seminar.
// FIGURE and LINE verbatim from webinaire.ts PREUVE and kept side by side: red line R05 wants the base
// (7 réponses sur 23 participants) within 250 characters of 9,1. Answers and note verbatim from the old
// /formations avis block.

export const EYEBROW = "Retours d'un séminaire"
export const FIGURE = '9,1/10'
export const LINE =
  "de note moyenne, donnée par les équipes d'une société d'ingénierie d'environ 110 personnes (7 réponses sur 23 participants)."
export const SURVEY_LABEL = "Extraits du questionnaire anonyme rempli à la fin d'une matinée"
export const SURVEY_NOTE =
  "Participants au séminaire d'un cabinet de conseil en ingénierie, octobre 2026. Réponses recopiées telles quelles."

export interface Answer {
  question: string
  text: string
}

export const ANSWERS: readonly Answer[] = [
  { question: 'Votre avis en quelques mots', text: 'Très bon pédagogue' },
  { question: 'Ce que vous avez le plus aimé', text: "Super à l'écoute sur les questions" },
  { question: 'Ce que vous avez le plus aimé', text: 'La clarté des explications' },
  { question: 'Votre avis en quelques mots', text: 'Très instructif, belle découverte' },
]
