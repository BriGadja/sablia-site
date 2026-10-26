export const EYEBROW = 'Déjà formés'
export const TITLE = 'Des équipes très différentes.'
export const SURVEY_LABEL = "Extraits du questionnaire anonyme rempli à la fin d'une matinée"
export const SURVEY_NOTE =
  "Participants au séminaire d'un cabinet de conseil en ingénierie, octobre 2026. Réponses recopiées telles quelles."

export interface Case {
  tag: string
  title: string
  what: string
}

export const CASES: readonly Case[] = [
  {
    tag: 'Séminaire',
    title: 'Un cabinet de conseil en ingénierie',
    what: "Une matinée pour toute l'équipe, construite sur les cas envoyés par son responsable : offres d'emploi, propositions, CRM.",
  },
  {
    tag: 'Cycle · pour un cabinet partenaire',
    title: "L'équipe IT d'un grand groupe",
    what: "Des séances régulières sur Claude Code, des bases du prompt jusqu'aux tests automatisés.",
  },
  {
    tag: 'Ateliers',
    title: 'École Noésia',
    what: 'Un atelier en direct toutes les deux semaines, et un module Claude Code en vidéo.',
  },
]

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
