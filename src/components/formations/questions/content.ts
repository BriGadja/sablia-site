export const EYEBROW = 'Questions'
export const TITLE = "Ce qu'on me demande avant."

export interface Question {
  q: string
  a: string
}

export const QUESTIONS: readonly Question[] = [
  {
    q: "Mon équipe n'a jamais utilisé l'IA.",
    a: "C'est le cas le plus fréquent. On commence par les bons réflexes, sur des tâches qu'elle fait déjà.",
  },
  {
    q: 'Mon équipe est déjà avancée.',
    a: 'Alors on part de vos usages et on va plus loin : automatisations, connecteurs, agents, Claude Code.',
  },
  {
    q: 'Quels outils allez-vous nous apprendre ?',
    a: 'Ceux qui servent vos cas. Le plus souvent Claude, parfois n8n, Claude Code ou vos outils métier.',
  },
  {
    q: 'Et nos données ?',
    a: 'En formation, les démonstrations se font sur des exemples construits à partir de vos situations, jamais sur vos données réelles.',
  },
  { q: 'Sur place ou à distance ?', a: 'Les deux, selon votre équipe et le format choisi.' },
]
