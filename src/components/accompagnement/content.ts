/**
 * Every visitor string of `/accompagnement`, « Après la formation » (plan site-formation-lot1 U11,
 * copy 01b § 4, « je » voice). No price: the référent's terms are a duration, its price is in the
 * quote. The CRM pages it links to keep their own prices and stay unchanged.
 */

const CRM = '/offres/compte-rendu-appel'

export const META = {
  title: 'Après la formation : référent IA et sur-mesure · Sablia',
  description:
    'Après les trois jours, un référent IA pour votre équipe (une séance de 2 h par mois, vos questions sous 48 h), ou Claude intégré sur mesure dans votre CRM et vos outils.',
} as const

export const HERO = {
  eyebrow: 'Après la formation',
  title: 'Après les trois jours.',
  lede: 'Deux façons de continuer : un référent IA qui suit votre équipe chaque mois, ou des outils construits pour elle.',
  cta: 'Réserver 30 min',
  /** Photo 5 of 09/10 (run 01c, U6): `-540/-900/-1200.webp`, 3:2. Alt from the U6 report. */
  photo: {
    base: '/photos/formation-05',
    width: 1200,
    height: 800,
    alt: 'Brice Gachadoat échange avec deux participants pendant la pause.',
  },
} as const

export const REFERENT = {
  eyebrow: 'Référent IA',
  title: 'Un appui chaque mois.',
  line: 'Une séance de 2 h par mois avec votre équipe, et vos questions sous 48 h.',
  terms: 'Trois mois au moins, puis résiliable chaque mois. Le prix est dans le devis.',
  /** The drawn month (aria-hidden): weekday initials, two figures taken from `line`, and Brice's
   *  face on each answer (photo 2 of 09/10, decorative). */
  month: {
    days: ['L', 'M', 'M', 'J', 'V'],
    session: '2 h',
    answer: 'sous 48 h',
    face: '/photos/formation-02-540.webp',
  },
} as const

export const SURMESURE = {
  eyebrow: 'Sur mesure',
  title: 'Claude branché sur vos outils.',
  line: "L'intégration de Claude dans votre CRM, et des automatisations pour les tâches qui reviennent.",
  lead: { label: "Le compte rendu d'appel dans votre CRM", href: CRM },
  crmAria: "Le compte rendu d'appel, selon votre CRM",
  /** The node the six tools hang from in the drawing (the product named in `title`). */
  node: 'Claude',
  crms: [
    { label: 'HubSpot', href: `${CRM}/hubspot` },
    { label: 'Pipedrive', href: `${CRM}/pipedrive` },
    { label: 'Zoho', href: `${CRM}/zoho` },
    { label: 'Salesforce', href: `${CRM}/salesforce` },
    { label: 'Google Sheets', href: `${CRM}/google-sheets` },
    { label: 'Excel', href: `${CRM}/excel-365` },
  ],
  realisations: { label: 'Voir les réalisations', href: '/realisations' },
} as const

export const FIN = {
  title: 'Trente minutes pour préparer la suite.',
  text: 'On regarde votre semaine ensemble, je vous dis ce que Claude peut prendre.',
} as const
