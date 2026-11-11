/**
 * Every visitor string of the issue pages `/lettre/<slug>` and of the list of issues on `/newsletter`
 * (US-101, US-102). French, « je » voice, « vous » to the reader. The hub's anti-slop gate reads this
 * file as plain text (client and site audiences). The issue text itself comes from the hub.
 */
export const LETTRE = {
  eyebrow: 'La lettre du mardi',
  /** « Par Brice Gachadoat, le 17 novembre 2026 »: the name links to the trainer section of the home. */
  byline: { by: 'Par', on: 'le' },
  abonnement: {
    text: 'Chaque mardi matin, je reprends la vidéo de la semaine et je la pousse plus loin, dans votre boîte mail.',
    label: 'Recevoir ma newsletter',
  },
  /** The <title> of a slug that is not a published issue (never built: `dynamicParams = false`). */
  missingTitle: 'Numéro introuvable',
} as const

export const NUMEROS = {
  eyebrow: 'Les numéros',
  title: 'Les lettres déjà parues',
  empty: "Aucun numéro n'est encore paru : je publie ici chaque lettre le mardi de son envoi.",
} as const
