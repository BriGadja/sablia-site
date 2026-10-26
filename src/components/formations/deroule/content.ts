export const EYEBROW = 'Le déroulé'
export const TITLE = "Vos cas d'abord, la séance ensuite."

export interface Step {
  n: string
  title: string
  what: string
  icon: string
}

export const STEPS: readonly Step[] = [
  {
    n: '01',
    title: 'Un appel de 30 minutes',
    what: 'Votre équipe, vos outils, ce qui vous prend du temps.',
    icon: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  },
  {
    n: '02',
    title: 'Vos cas, envoyés avant',
    what: "Les tâches que votre équipe aimerait confier à l'IA.",
    icon: 'M4 6h16v12H4zM4 7l8 6 8-6',
  },
  {
    n: '03',
    title: 'La séance, sur vos cas',
    what: 'Des démonstrations construites sur vos situations réelles.',
    icon: 'M3 5h18v12H3zM8 21h8M12 17v4',
  },
  {
    n: '04',
    title: 'Après la séance',
    what: 'Le support, une page de ressources et un questionnaire anonyme.',
    icon: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  },
]
