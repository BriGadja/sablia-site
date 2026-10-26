export const EYEBROW = 'Pour tous les niveaux'
export const TITLE = 'Du premier prompt aux agents autonomes.'
export const LEAD = 'Débutant complet ou déjà loin : je pars de là où vous en êtes.'

export interface Rung {
  title: string
  what: string
  who: string
}

export const RUNGS: readonly Rung[] = [
  {
    title: 'Découvrir',
    what: 'Bien demander, bien relire ce que Claude produit.',
    who: "ceux qui n'ont jamais essayé",
  },
  {
    title: 'Pratiquer',
    what: 'Vos documents, vos modèles, vos Projets.',
    who: "ceux qui l'utilisent un peu",
  },
  {
    title: 'Automatiser',
    what: 'Des tâches qui tournent sans vous : mails, CRM, veille.',
    who: 'ceux qui veulent déléguer',
  },
  {
    title: 'Repousser les limites',
    what: 'Claude Code, agents, connecteurs et MCP.',
    who: 'les équipes techniques et les curieux',
  },
]
