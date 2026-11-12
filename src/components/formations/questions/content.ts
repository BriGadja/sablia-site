// « Questions » of /formations (01b § 3 Questions): items faq.1 to faq.6 and faq.9 of the home FAQ,
// same strings (01b § 2). The title is kept from the previous page.
// Since US-104 the home's item 1 also names the monthly offer: items 2 to 6 and 9 alone stay the same strings.

export const EYEBROW = 'Questions'
export const TITLE = "Ce qu'on me demande avant."

export interface Question {
  q: string
  a: string
}

export const QUESTIONS: readonly Question[] = [
  {
    q: 'Combien ça coûte ?',
    a: "Le prix dépend de votre équipe et du format retenu. Il arrive dans le devis, après l'échange de 30 minutes. Le webinaire et l'échange sont gratuits.",
  },
  {
    q: 'Mon équipe utilise déjà Copilot ou ChatGPT.',
    a: "La formation se fait aujourd'hui sur Claude. Si votre équipe travaille déjà avec Copilot ou ChatGPT, dites-le pendant l'échange : on en parle avant tout devis.",
  },
  {
    q: 'Où se passe la formation ?',
    a: "Dans vos locaux, avec votre équipe. Les trois jours peuvent se suivre ou s'étaler, selon votre organisation.",
  },
  {
    q: 'Combien de personnes ?',
    a: "Jusqu'à 12 personnes par programme. Pour une équipe plus grande, on en parle pendant l'échange.",
  },
  {
    q: 'Que faut-il préparer ?',
    a: "Une salle, un ordinateur par participant et une connexion internet. Avant la première demi-journée, la liste des tâches que votre équipe aimerait confier à l'IA.",
  },
  {
    q: 'Nos dossiers sont confidentiels.',
    a: "Les règles se posent d'abord : la première demi-journée, avec la direction, fixe ce qui peut passer par l'IA et ce qui ne sort pas du bureau. Sur les offres de Claude pour les entreprises, Anthropic ne se sert pas par défaut de vos échanges pour entraîner ses modèles.",
  },
  {
    q: "Mon équipe n'a jamais utilisé l'IA.",
    a: "C'est le cas le plus fréquent. On part des tâches qu'elle fait déjà, sans prérequis technique.",
  },
]
