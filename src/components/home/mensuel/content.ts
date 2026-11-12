/**
 * Home `#mensuel`, the monthly offer right after the hero (US-104, plan sablia-site-structure-offre E4,
 * copy deck B2 `home.mensuel.*`). It names the offer and opens its page; no amount and no price word:
 * the price lives on the offer page only.
 */

export const MENSUEL = {
  eyebrow: 'Responsable IA externalisé',
  title: 'Votre responsable IA, sans le recruter.',
  lines: [
    {
      key: 'outil',
      text: "Un outil de plus en service chaque mois, en commençant par l'étape qui coince.",
    },
    { key: 'equipe', text: "Votre équipe s'en sert : rien de technique à apprendre." },
    {
      key: 'comptes',
      text: 'Tout est installé dans vos comptes, et vos données restent chez vous.',
    },
  ],
  link: { label: "Voir l'offre mensuelle", href: '/responsable-ia-externalise' },
} as const
