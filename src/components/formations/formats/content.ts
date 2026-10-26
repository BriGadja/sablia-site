export const EYEBROW = 'Les formats'
export const TITLE = 'Une matinée, une journée ou un cycle.'
export const LINK_LABEL = "Voir l'accompagnement"

export interface Format {
  title: string
  what: string
  icon: string
  link: boolean
}

export const FORMATS: readonly Format[] = [
  {
    title: 'Séminaire',
    what: "Toute l'équipe, une matinée ou une journée, sur site ou à distance.",
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    link: false,
  },
  {
    title: 'Ateliers par métier',
    what: 'Des petits groupes, un métier à la fois, sur ses propres tâches.',
    icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    link: false,
  },
  {
    title: 'Cycle',
    what: 'Des séances régulières sur plusieurs semaines, avec une aide entre les séances.',
    icon: 'M21 12a9 9 0 1 1-3-6.7M21 4v5h-5',
    link: true,
  },
]
