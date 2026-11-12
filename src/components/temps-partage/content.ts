/**
 * Every visitor string of `/responsable-ia-externalise` (plan sablia-site-seo-offre-lettres,
 * Phase A, US-99; renamed « Responsable IA externalisé » by plan sablia-site-structure-offre, US-105,
 * strings from its copy deck B3), « je » voice, « vous » to the reader.
 *
 * Source of every claim: the hub offer text `projects/sablia/offre/temps-partage/offre.md` and the
 * meeting script beside it. `content.parity.test.ts` pins this module to `offre.md`; the sentence
 * by sentence traceability is in the run report of Phase A.
 *
 * The prices ARE shown on this page (Brice, 11/11). The module lives outside `src/content/` and
 * outside the training folders on purpose: two existing tests scan those for amounts.
 */

/** Keeps « 2 000 », « € » and « HT » on one line. */
const NBSP = '\u00a0'

/** « 2 000 € HT » with no-break spaces, built without a locale call so server and browser agree. */
function priceHt(amount: number): string {
  const grouped = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)
  return `${grouped}${NBSP}€${NBSP}HT`
}

/** The offer's numbers (offre.md § Conditions); every displayed amount is built from them. */
const PRICE = {
  monthlyHt: 2000,
  openingHt: 1500,
  openingCount: 5,
  engagementMonths: 3,
} as const

const MONTHLY = `${priceHt(PRICE.monthlyHt)} par mois`
const OPENING = `${priceHt(PRICE.openingHt)} par mois`

export interface Item {
  readonly key: string
  readonly text: string
}

export interface Fact {
  readonly key: string
  readonly label: string
  readonly value: string
}

export interface Question {
  readonly q: string
  readonly a: string
}

export interface Section<T = Item> {
  readonly eyebrow: string
  readonly title: string
  readonly items: readonly T[]
}

/** A sentence whose part `link` (taken from `text` itself) links to `href`. */
export interface InlineLink {
  readonly text: string
  readonly link: string
  readonly href: string
}

export const META = {
  title: 'Responsable IA externalisé pour PME, à Rouen · Sablia',
  description: `Responsable IA externalisé à Rouen : je construis vos outils d'IA, je forme votre équipe, j'entretiens ce qui tourne. ${MONTHLY}.`,
} as const

const FACTS: readonly Fact[] = [
  { key: 'prix', label: 'Prix', value: MONTHLY },
  { key: 'engagement', label: 'Engagement', value: 'Trois mois, puis résiliable chaque mois' },
  { key: 'pour-qui', label: 'Pour qui', value: 'PME de 10 à 50 personnes' },
]

/** The opening words of offre.md § Qui je suis: the hero's byline and the title of `#qui`. */
const WHO = 'Brice Gachadoat, fondateur de Sablia, à Rouen.'

export const HERO = {
  eyebrow: 'Responsable IA externalisé · offre mensuelle',
  /** The offer's title (line 1 of offre.md); Rouen is in the byline and the tab title. */
  h1: 'Votre responsable IA, sans le recruter',
  lede: "Chaque mois, un outil de plus en service dans votre entreprise, une équipe qui sait s'en servir, et quelqu'un qui veille à ce que tout continue de tourner.",
  /** One quiet line under the lede: the first phone screen names the person (AC-23 #8). */
  byline: WHO,
  audience:
    "Pour les PME de 10 à 50 personnes qui savent que l'IA peut leur faire gagner du temps, et qui n'ont personne en interne pour la mettre en place.",
  cta: 'Réserver 30 min',
  reassure: "L'échange de 30 minutes est gratuit.",
  facts: FACTS,
} as const

export const ROLE = {
  eyebrow: 'Le rôle',
  title: 'Entre consultant IA et DSI à temps partagé',
  /** The two neighbours of the role, one sentence each, shown side by side; `term` is emphasised. */
  poles: [
    {
      key: 'consultant',
      term: 'consultant IA',
      text: "Comme un consultant IA, je cherche où l'IA peut vous faire gagner du temps, puis je construis les outils.",
    },
    {
      key: 'dsi',
      term: 'DSI à temps partagé',
      text: "Comme un DSI à temps partagé le fait pour l'informatique, je tiens le rôle dans la durée : deux jours de travail par mois, pour une entreprise qui n'a personne en interne pour s'en occuper.",
    },
  ],
  pillars:
    "Concrètement, je construis l'outil qui débloque l'étape la plus faible de votre parcours client, je forme votre équipe pour qu'elle s'en serve vraiment, et j'entretiens ce qui tourne en passant chaque mois à l'étape suivante.",
  /** The three verbs of `pillars` (script-rdv.md § 4), emphasised in place. */
  verbs: ['je construis', 'je forme', "j'entretiens"],
  place: "Je suis basé à Rouen, en Normandie, et j'interviens dans toute la France.",
} as const

export const PREMIER_MOIS: Section & { readonly crm: InlineLink } = {
  eyebrow: 'Le premier mois',
  title: "On commence par l'étape qui coince.",
  items: [
    {
      key: 'diagnostic',
      text: "Un diagnostic chiffré de votre parcours client : combien de personnes vous découvrent, combien vous contactent, combien signent, combien reviennent. On repère l'étape qui coince le plus.",
    },
    {
      key: 'premier-outil',
      text: "Un premier outil construit sur cette étape, et utilisé par votre équipe avant la fin du mois. Par exemple : répondre aux demandes entrantes dans l'heure, ranger le compte rendu de chaque appel dans votre CRM, préparer les relances.",
    },
  ],
  /** One line under the two items: the call-report tool of the example also sells on its own page. */
  crm: {
    text: "Le compte rendu d'appel dans votre CRM se commande aussi seul, sans contrat mensuel, à prix fixe.",
    link: "Le compte rendu d'appel dans votre CRM",
    href: '/offres/compte-rendu-appel',
  },
}

/**
 * The drawing of `#premier-mois` (decorative, aria-hidden): the four steps of the client journey
 * that the diagnostic counts, bars falling from one step to the next without any figure, the step
 * where the count falls most marked as the one that jams, and the next one after it. The shape is
 * an example (the diagnostic finds the real step), so the caption says « Exemple ».
 */
export const PARCOURS = {
  caption: 'Exemple de parcours client',
  steps: [
    { key: 'decouvrent', label: 'Vous découvrent', share: 1 },
    { key: 'contactent', label: 'Vous contactent', share: 0.62 },
    { key: 'signent', label: 'Signent', share: 0.2 },
    { key: 'reviennent', label: 'Reviennent', share: 0.14 },
  ],
  /** Index in `steps` of the step drawn as the one that jams (the largest fall), then the next. */
  stuck: 2,
  stuckLabel: "L'étape qui coince",
  nextLabel: "L'étape suivante",
} as const

export const CHAQUE_MOIS: Section = {
  eyebrow: 'Chaque mois ensuite',
  title: "Puis l'étape suivante, chaque mois.",
  items: [
    { key: 'deux-jours', text: "Deux jours de travail sur l'étape suivante." },
    {
      key: 'seance',
      text: "Une séance avec votre équipe : ce qui marche chez l'un devient l'outil de tous.",
    },
    {
      key: 'suivi',
      text: 'Le suivi de ce qui tourne : je vérifie, je corrige, je mets à jour quand les outils changent.',
    },
    { key: 'questions', text: 'Vos questions par mail, avec une réponse sous 48 heures ouvrées.' },
  ],
}

export const GARDEZ: Section = {
  eyebrow: 'Ce que vous gardez',
  title: 'Vos outils restent les vôtres.',
  items: [
    {
      key: 'comptes',
      text: 'Tout est installé dans vos propres comptes. Vous restez propriétaire des outils, et vos données restent chez vous.',
    },
    {
      key: 'mesure',
      text: "On mesure avant et après. Vous voyez ce qui a changé, chiffres à l'appui.",
    },
    {
      key: 'rien-a-apprendre',
      text: "Rien de technique à apprendre : je construis, votre équipe s'en sert.",
    },
  ],
}

export const CONDITIONS: Section & { readonly price: typeof PRICE } = {
  eyebrow: 'Conditions',
  title: "Le prix et l'engagement.",
  price: PRICE,
  /** The four bullets of offre.md § Conditions, in order; the last one word for word. */
  items: [
    { key: 'mensuel', text: `${MONTHLY}.` },
    {
      key: 'ouverture',
      text: `Prix d'ouverture : ${OPENING} pour les cinq premières entreprises, en échange d'un bilan avec moi à la fin du troisième mois.`,
    },
    { key: 'engagement', text: 'Engagement de trois mois, puis résiliable chaque mois.' },
    {
      key: 'premier-mois',
      text: 'Si le premier mois ne vous convient pas, vous arrêtez là et vous ne payez pas les deux mois suivants.',
    },
  ],
}

/** Real photos of Brice (09/10, `public/photos/`), alt texts as the home writes them. */
export const PHOTOS = {
  /** 3:2, photo 3 of the home strip. */
  hero: {
    n: '03',
    width: 1200,
    height: 800,
    alt: 'Brice Gachadoat sourit au public, derrière un pupitre et un ordinateur portable.',
  },
  /** 4:5, the portrait of the home's `#derriere`. */
  portrait: {
    n: '02',
    width: 1200,
    height: 1500,
    alt: 'Brice Gachadoat en pleine intervention, les deux mains ouvertes.',
  },
} as const

export const QUI = {
  eyebrow: 'Qui je suis',
  title: WHO,
  text: "Je construis des automatisations et des outils d'IA pour des PME, et je forme des équipes à l'IA, notamment dans l'école Noésia. Références et avis sur demande.",
  /** The part of `text` that links to the school, as on the home (`#derriere`). */
  school: { link: 'école Noésia', href: 'https://noesia.school' },
} as const

export const QUESTIONS: Section<Question> = {
  eyebrow: 'Questions',
  title: "Ce qu'on me demande avant.",
  items: [
    {
      q: 'Quelle différence avec un consultant IA ?',
      a: "Le diagnostic du premier mois repère l'étape qui coince, puis je construis l'outil sur cette étape, dans vos propres comptes, et votre équipe s'en sert avant la fin du mois. Ensuite, je l'entretiens et je passe chaque mois à l'étape suivante.",
    },
    {
      q: 'Combien de temps ça prend à mon équipe ?',
      a: "C'est moi qui construis. De votre côté, une heure de séance par mois avec l'équipe, et vos questions par mail quand vous en avez, avec une réponse sous 48 heures ouvrées.",
    },
    {
      q: "Deux jours par mois, c'est assez ?",
      a: "Chaque mois, vous avez un outil de plus en service, une équipe qui s'en sert et le suivi de ce qui tourne. Pour une entreprise de votre taille, deux jours suffisent pour ça.",
    },
    {
      q: 'Et si le premier mois ne me convient pas ?',
      a: "Vous arrêtez là, et vous ne payez pas les deux mois suivants. On mesure avant et après : vous voyez ce qui a changé, chiffres à l'appui.",
    },
    {
      q: 'À qui appartiennent les outils et les données ?',
      a: 'À vous. Tout est installé dans vos propres comptes : vous restez propriétaire des outils, et vos données restent chez vous.',
    },
    {
      q: 'Combien ça coûte ?',
      a: `${MONTHLY}, avec un engagement de trois mois, puis résiliable chaque mois. Pour les cinq premières entreprises, le prix d'ouverture est de ${OPENING}, en échange d'un bilan avec moi à la fin du troisième mois.`,
    },
  ],
}

/** The closing `#fin` band; it books on `site.formationBookingUrl` (« Échange de 30 minutes »). */
export const FIN = {
  title: 'Trente minutes pour voir par où commencer.',
  text: 'Vous me parlez de ce que vous avez déjà essayé et des chiffres de votre parcours client, je vous dis par quelle étape on commencerait.',
  /** FinBand prints this label by default; kept here so the page's strings are all in one place. */
  cta: 'Réserver 30 min',
} as const
