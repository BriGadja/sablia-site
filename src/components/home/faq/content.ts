import { of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

export const EYEBROW = 'Questions'
export const TITLE = "Ce qu'on nous demande avant d'appeler."
export const CHAT_NAME = 'Sablia'

export interface Faq {
  q: string
  a: string
}

/**
 * Nine questions, the mockup's order. Figures come from `of1.ts` (price, delay), never typed twice.
 *
 * FAQ 5 (data) was rewritten by D3 (units/d3-faq5.md, VERIFIED live 2026-10-26). Sources:
 *  - https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training
 *    « By default, we will not use your inputs or outputs from our commercial products ... to train our models. »
 *  - https://www.anthropic.com/legal/commercial-terms (Section B) « Anthropic may not train models on Customer Content from Services. »
 *  - https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data
 *    « we automatically delete inputs and outputs on our backend within 30 days of receipt or generation »
 *    (exceptions: legal compliance, Usage Policy enforcement, agreed retention).
 * Deliberately not claimed: « conforme RGPD », « pas de sous-traitant », zero data retention, regional hosting.
 */
export const FAQS: readonly Faq[] = [
  {
    q: 'Ça marche avec mon CRM ?',
    a: 'Oui : HubSpot, Pipedrive, Zoho, Salesforce, Airtable, et tout outil ouvert aux intégrations (API, MCP). Et si votre CRM, c’est un Google Sheets ou un Excel, ça marche aussi.',
  },
  {
    q: "Nous n'avons pas de CRM.",
    a: 'Nous le construisons avec vous : un tableur bien tenu, un CRM du marché configuré pour vous, ou un outil sur mesure. Le prix vous est donné sous 24 heures.',
  },
  {
    q: 'Mes commerciaux appellent depuis leur portable.',
    a: "C'est le cas de la note vocale : 30 secondes de note vocale en raccrochant, et la fiche est remplie dans la minute.",
  },
  {
    q: 'Vous enregistrez nos appels ?',
    a: 'Jamais à votre place. Nous lisons le transcript que votre téléphonie produit déjà, ou la note vocale de votre commercial.',
  },
  {
    q: 'Où vont nos données ?',
    a: "Seul le texte de l'appel est envoyé à Claude pour en tirer le résumé, et par défaut Anthropic ne s'en sert pas pour entraîner ses modèles. Côté Anthropic, ce texte est effacé automatiquement sous 30 jours (sauf obligation légale ou règle d'usage), et le résumé reste dans votre CRM.",
  },
  {
    q: 'Combien de temps avant que ça tourne ?',
    a: `${of1.delay.days} jours après réception de vos accès, avec un test sur 5 de vos vrais appels avant la mise en service.`,
  },
  {
    q: 'Combien ça coûte ?',
    a: `${eurHt(of1.price.oneShotHt)} une fois, puis ${of1.price.monthlyHt} €/mois de supervision si vous la voulez, premier mois offert. Si ça ne tourne pas sur vos 5 appels de test, vous êtes intégralement remboursé.`,
  },
  {
    q: 'Qui fait le travail ?',
    a: "Nous, de l'appel de 30 minutes à la supervision. Votre interlocuteur reste Brice du début à la fin.",
  },
  {
    q: 'Faites-vous aussi des agents vocaux ?',
    a: "Oui, sur demande : une vingtaine mis en service depuis 2024, dont certains tournent encore aujourd'hui.",
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
 * Home `#fin` band copy (units/a8.md). The quiet link goes to `/ressources`: the free templates and
 * their form are what « le guide et les ressources gratuites » promises; the long guide page stays
 * reachable from there and from the footer.
 */
export const FIN_BAND = {
  title: 'Trente minutes pour voir si ça tourne chez vous.',
  text: "Vous nous montrez votre CRM, nous vous disons ce qui s'automatise, et pour combien.",
  link: { href: '/ressources', label: 'Pas encore prêt ? Le guide et les ressources gratuites.' },
} as const
