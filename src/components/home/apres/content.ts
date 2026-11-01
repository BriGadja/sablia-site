/**
 * Home `#apres`, what comes after the three days (plan site-formation-lot1 U8, copy 01b « After the
 * training »). No price: the référent's terms live on `/accompagnement`, the price in the quote.
 */

export interface SuiteCard {
  readonly key: 'referent' | 'surmesure'
  readonly title: string
  readonly line: string
  /** Optional words of `line` that link to a page (plain internal link, no UTM). */
  readonly link?: { readonly text: string; readonly href: string }
}

export const APRES = {
  eyebrow: 'Après la formation',
  title: 'Et après les trois jours ?',
  cards: [
    {
      key: 'referent',
      title: 'Un référent IA',
      line: 'Une séance de 2 h par mois, et vos questions sous 48 h.',
    },
    {
      key: 'surmesure',
      title: 'Des outils sur mesure',
      line: 'Claude intégré dans votre CRM, et des automatisations pour les tâches qui reviennent.',
      link: { text: 'Claude intégré dans votre CRM', href: '/offres/compte-rendu-appel' },
    },
  ] satisfies readonly SuiteCard[],
  link: { label: 'Voir ce qui vient après', href: '/accompagnement' },
} as const
