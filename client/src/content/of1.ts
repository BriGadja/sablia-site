/**
 * OF-1 content module : the single place in code that carries the offer's words.
 *
 * Source of truth: `projects/sablia/offre/of-1-compte-rendu-appel.md` on the hub (grilled
 * 2026-09-03). This module RENDERS that file, it never reinvents it: `of1.parity.test.ts` reads
 * the hub file and turns RED when a price, a delay, the guarantee, the team size, the CRM list or
 * the included/excluded counts diverge. Change the offer THERE first, then here.
 */

export const OF1_ROUTE = '/offres/compte-rendu-appel' as const
export const OF1_BOOKING_URL = 'https://calendly.com/brice-gachadoat/30min' as const

export interface Of1Price {
  oneShotHt: number
  depositPct: number
  monthlyHt: number
  firstMonthFree: boolean
  claudeCallsPerMonth: number
  bricksIncluded: number
  extraBrickMonthlyHt: number
  brickHt: number
  brickFloorHt: number
}

export interface Of1Variant {
  key: 'A' | 'B'
  label: string
  title: string
  body: string
}

export interface Of1Faq {
  q: string
  a: string
}

export interface Of1Offer {
  id: 'OF-1'
  title: string
  promise: string
  teamSize: { min: number; max: number }
  audience: string
  crms: readonly string[]
  variants: readonly [Of1Variant, Of1Variant]
  noRecording: string
  included: readonly string[]
  excluded: readonly string[]
  delay: { days: number; sabliaWorkDaysMax: number }
  price: Of1Price
  guarantee: string
  recurring: { covers: readonly string[]; terms: string; exit: string }
  objectionN8n: { q: string; answer: readonly string[] }
  faq: readonly Of1Faq[]
}

export const of1: Of1Offer = {
  id: 'OF-1',
  title: 'Le CRM qui se remplit tout seul après chaque appel',
  promise:
    "Le commercial raccroche, le CRM est déjà à jour : recap et tâche de relance créées automatiquement, sans qu'il tape une ligne.",

  teamSize: { min: 2, max: 20 },
  audience:
    "Pour les équipes commerciales de 2 à 20 personnes qui ont déjà un CRM en place et qui perdent leurs informations d'appel entre deux rendez-vous.",
  crms: ['HubSpot', 'Zoho', 'Pipedrive', 'Salesforce', 'Airtable'],

  variants: [
    {
      key: 'A',
      label: 'Variante A',
      title: 'Téléphonie VoIP',
      body: "Ringover, Aircall, ou tout système qui produit un transcript. Le transcript de l'appel part automatiquement vers Claude, qui en tire une synthèse structurée. La fiche du contact est mise à jour dans votre CRM et la tâche de relance est créée avec sa date. Vous ne changez rien à votre façon de téléphoner.",
    },
    {
      key: 'B',
      label: 'Variante B',
      title: 'Débrief vocal de 30 secondes',
      body: 'Pour les commerciaux en mobilité, au téléphone classique. En raccrochant, le commercial dicte une note vocale de 30 secondes sur son téléphone. Elle est transcrite, structurée, et déposée dans le CRM avec la tâche de relance.',
    },
  ],
  noRecording:
    "Dans les deux cas, nous ne faisons jamais enregistrer un appel à votre place. L'enregistrement d'un appel impose le consentement des deux interlocuteurs : la variante A n'utilise que ce que votre téléphonie produit déjà, et la variante B ne capte que la voix de votre commercial.",

  included: [
    'Installation de la chaîne complète (n8n + Claude) sur votre CRM et votre téléphonie.',
    'Prompt de synthèse adapté à votre vocabulaire : vos étapes de vente, vos objections, vos champs.',
    'Création automatique de la tâche de relance, avec sa date et son propriétaire.',
    'Test sur 5 appels réels, avec vous, avant la mise en service.',
    "Rituel de 10 minutes avec le dirigeant pour fermer l'ancien canal de prise de notes. C'est la seule conduite du changement nécessaire, et elle est incluse.",
    'Recette écrite : ce qui a été livré, ce qui tourne, ce qui a été testé.',
    'Premier mois de supervision offert.',
  ],
  excluded: [
    "Les licences : CRM, téléphonie VoIP, n8n cloud si vous le choisissez hébergé. Elles restent à votre charge et à votre nom. L'option de transcription de votre téléphonie en fait partie : Empower chez Ringover, AI Assist chez Aircall. Elle est payante, elle est à votre nom, et sans elle la variante A n'a pas de transcript à lire.",
    "L'astreinte et les interventions hors heures ouvrées. Elles ne font partie ni de cette offre ni du récurrent.",
    "L'enregistrement ou la transcription d'appels passés depuis un mobile classique sans téléphonie d'entreprise. C'est exactement ce que la variante B contourne, autrement.",
    "L'agent vocal, c'est-à-dire une intelligence artificielle qui parle à vos clients à votre place. Nous n'en vendons pas.",
    'La refonte de votre CRM, ou un CRM construit sur mesure.',
    'La migration de vos données existantes.',
    'La formation au-delà du rituel de 10 minutes.',
    'Tout développement hors de ce périmètre passe par une demande de changement chiffrée à part.',
  ],

  delay: { days: 7, sabliaWorkDaysMax: 2 },
  price: {
    oneShotHt: 1490,
    depositPct: 50,
    monthlyHt: 149,
    firstMonthFree: true,
    claudeCallsPerMonth: 1000,
    bricksIncluded: 3,
    extraBrickMonthlyHt: 49,
    brickHt: 1490,
    brickFloorHt: 990,
  },
  guarantee:
    "Si à la recette le compte rendu ne tourne pas sur vos 5 appels de test, vous ne payez rien : le solde n'est pas dû et l'acompte vous est intégralement remboursé.",

  recurring: {
    covers: [
      'Surveillance des exécutions et reprise des échecs.',
      "Adaptation aux changements d'API de votre CRM et de votre téléphonie (ils changent leurs schémas plusieurs fois par an, c'est la raison principale du récurrent).",
      'Une évolution mineure de prompt par mois.',
      "Jusqu'à 1 000 appels Claude par mois.",
      "Jusqu'à trois briques. Au-delà, 49 €/mois par brique supplémentaire.",
    ],
    terms:
      "Sans engagement, mensuel, résiliable par simple mail avant le 20 du mois pour le mois suivant. L'astreinte et les interventions hors heures ouvrées ne sont pas comprises.",
    exit: "Quand vous l'arrêtez, la chaîne continue de tourner. Vous créez votre propre clé Anthropic, nous la remplaçons dans le flux, et nous vous montrons où tout se trouve. Trente minutes de passation sont incluses.",
  },

  objectionN8n: {
    q: "C'est gratuit sur n8n, non ?",
    answer: [
      'Oui. Le modèle est public et gratuit, il en existe même plusieurs versions.',
      "Ce que nous vendons n'est pas le modèle : c'est qu'il soit installé sur votre CRM avec votre vocabulaire sans que vous y passiez vos soirées, et qu'il tourne encore dans 6 mois quand votre téléphonie aura changé son API.",
      'La majorité des équipes qui téléchargent un modèle gratuit ne le mettent jamais en service.',
    ],
  },

  faq: [
    {
      q: "Où tourne l'automatisation ?",
      a: "Chez vous, sur n8n, pas sur une plateforme Sablia. Trois cas, dans cet ordre : vous avez déjà n8n et nous y déposons le flux, sans rien à payer de plus ; vous n'en avez pas et vous ouvrez un compte n8n Cloud Starter à 20 €/mois à votre nom ; vous voulez l'héberger vous-même et nous installons un VPS Hostinger à votre nom, 390 € HT une fois. Dans les trois cas, le compte est le vôtre. Si vous partez, le flux reste là où il est.",
    },
    {
      q: 'Qui paie Claude ?',
      a: "Nous. La synthèse tourne sur la clé API de Sablia : vous n'ouvrez pas de compte Anthropic et vous ne recevez pas de facture d'API. Le récurrent inclut jusqu'à 1 000 appels Claude par mois, ce qui couvre largement une équipe de 2 à 20 personnes ; au-delà, la consommation est refacturée au réel, sans marge. La même règle s'applique pendant le mois de supervision offert.",
    },
    {
      q: 'Que se passe-t-il en cas de panne ?',
      a: "Reprise sous un jour ouvré, en heures ouvrées, comprise dans le récurrent. Rien la nuit, rien le week-end : ce n'est ni dans cette offre ni dans le récurrent. Une astreinte est une prestation distincte, elle se discute et elle se paie.",
    },
    {
      q: 'Enregistrez-vous nos appels ?',
      a: "Jamais à votre place. L'enregistrement d'un appel impose le consentement des deux interlocuteurs : la variante A n'utilise que ce que votre téléphonie produit déjà, et la variante B ne capte que la voix de votre commercial.",
    },
    {
      q: 'Et si mon besoin ne rentre pas dans cette offre ?',
      a: "La règle de chiffrage est publique. L'unité est la brique : un automatisme livrable en deux jours de travail Sablia au plus, à 1 490 € HT. Un besoin qui tient en une seule journée est une brique simple, au plancher de 990 € HT. Au-delà de deux jours, ça sort du format et fait l'objet d'un devis séparé. Le chiffre exact vous est confirmé sous 24 heures.",
    },
  ],
}
