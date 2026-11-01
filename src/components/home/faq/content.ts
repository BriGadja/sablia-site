import { site } from '@/lib/site'

export const EYEBROW = 'Questions'
export const TITLE = "Ce qu'on nous demande avant d'appeler."
export const CHAT_NAME = 'Sablia'

export interface Faq {
  q: string
  a: string
}

/**
 * The training FAQ, 01b order (plan site-formation-lot1, U9; `/formations` reuses items 1 to 6 and 9).
 * No amount anywhere: the price is in the quote after the 30-minute call (as `/webinaire/apres-reservation`
 * says). Answers are impersonal so the « nous » home and the « je » offer page share them.
 *
 * « Nos dossiers sont confidentiels. » says only what Anthropic does by default on its business offers,
 * read live on 2026-11-01: https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training
 * « By default, we will not use your inputs or outputs from our commercial products ... to train our models. »
 * Silent on Free, Pro and Max (consumer products, another article). Deliberately not claimed: « conforme
 * RGPD », « pas de sous-traitant », zero data retention, regional hosting.
 */
export const FAQS: readonly Faq[] = [
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
    q: 'Et après les trois jours ?',
    a: 'Trente jours de questions par mail sont inclus, avec une réponse sous 48 h. Ensuite, un référent IA peut suivre votre équipe : une séance de 2 h par mois et les questions sous 48 h.',
  },
  {
    q: 'Qui anime ?',
    a: 'Brice Gachadoat, fondateur de Sablia, du premier échange à la dernière demi-journée.',
  },
  {
    q: "Mon équipe n'a jamais utilisé l'IA.",
    a: "C'est le cas le plus fréquent. On part des tâches qu'elle fait déjà, sans prérequis technique.",
  },
]

/** How many question/answer pairs the stack keeps. */
export const STACK_SIZE = 3

/** The question list after a click: the asked one moves to the end, the oldest falls off. */
export function ask(history: readonly number[], i: number): number[] {
  return history
    .filter((x) => x !== i)
    .concat([i])
    .slice(-STACK_SIZE)
}

/**
 * Home `#fin` band copy (01b « Final band »). The button books on the formation Calendly (« Échange de
 * 30 minutes »); the quiet link goes to the webinar. The label names the session day of `SESSION`
 * (webinaire.ts): the content test fails when the session changes and this label does not.
 */
export const FIN_BAND = {
  title: 'Trente minutes pour parler de votre équipe.',
  text: 'Vous nous parlez de vos dossiers, nous vous envoyons un programme et son devis.',
  link: {
    href: '/webinaire',
    label: 'Pas encore prêt ? Le webinaire gratuit du jeudi 19 novembre.',
  },
  bookingUrl: site.formationBookingUrl,
} as const
