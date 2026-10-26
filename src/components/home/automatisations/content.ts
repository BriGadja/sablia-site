/** Copy and data of the « Automatisations » section, ported from the v143 mockup (`#automatisations`). */

const I = {
  doc: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  lead: 'M15 19a6 6 0 0 0-12 0M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M16 11h6',
  sun: 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  wrench:
    'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3',
  app: 'M3 5h18v14H3zM3 9h18M7 7h.01',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
}
const USER = 'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
const FOLDER = 'M3 6h6l2 2h10v11H3z'
const MAIL = 'M4 6h16v12H4zM4 7l8 6 8-6'
const SEND = 'M22 2L11 13M22 2l-7 20-4-9-9-4z'
const LINK =
  'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1'
const CHECK = 'M9 11l3 3L22 4M21 12v7H3V5h11'
const RECEIPT = 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6'
const SCALE = 'M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z'

export interface JobOutput {
  icon: string
  title: string
  sub: string
}
export interface Job {
  label: string
  icon: string
  agent: string
  request: string
  context: string[]
  outputs: JobOutput[]
}

export const JOBS: Job[] = [
  {
    label: 'Un devis',
    icon: I.doc,
    agent: 'Agent devis',
    request: 'Fais le devis de la demande reçue ce matin.',
    context: ['votre grille de prix', 'votre mise en page', 'vos conditions'],
    outputs: [
      { icon: I.doc, title: 'Le devis en PDF', sub: 'vos prix, TVA calculée' },
      { icon: USER, title: 'Vous relisez, vous envoyez', sub: 'rien ne part sans vous' },
      { icon: FOLDER, title: 'Rangé dans le dossier client', sub: 'facile à retrouver' },
    ],
  },
  {
    label: 'Un nouveau lead',
    icon: I.lead,
    agent: 'Agent leads',
    request: 'Un nouveau lead vient d’arriver dans Pipedrive.',
    context: ['la fiche du lead', 'votre équipe', 'vos règles'],
    outputs: [
      { icon: MAIL, title: 'Un mail clair à l’équipe', sub: 'nom, besoin, source' },
      { icon: SEND, title: 'À la bonne personne', sub: 'selon vos règles' },
      { icon: CHECK, title: 'Rien à ressaisir', sub: 'tout vient de Pipedrive' },
    ],
  },
  {
    label: 'Une veille',
    icon: I.sun,
    agent: 'Agent veille',
    request: 'Fais-moi la veille de mon marché ce matin.',
    context: ['vos sources', 'vos sujets', 'votre format'],
    outputs: [
      { icon: MAIL, title: 'Le résumé du matin', sub: 'dans votre boîte' },
      { icon: LINK, title: 'Les sources citées', sub: 'pour vérifier d’un clic' },
      { icon: USER, title: 'Vous décidez de la suite', sub: 'rien n’est publié seul' },
    ],
  },
  {
    label: 'Une intervention',
    icon: I.wrench,
    agent: 'Agent interventions',
    request: 'Une demande d’intervention vient d’arriver par mail.',
    context: ['le PDF joint', 'vos techniciens', 'vos modèles'],
    outputs: [
      { icon: I.doc, title: 'La fiche d’intervention', sub: 'créée sans ressaisie' },
      { icon: I.wrench, title: 'Le bon d’intervention', sub: 'prêt pour le technicien' },
      { icon: RECEIPT, title: 'La facture', sub: 'générée à la fin' },
    ],
  },
  {
    label: 'Une séance',
    icon: I.mic,
    agent: 'Agent séances',
    request: 'Prépare le compte rendu de la séance de ce matin.',
    context: ['l’enregistrement', 'votre format', 'vos règles'],
    outputs: [
      { icon: I.doc, title: 'Le compte rendu', sub: 'structuré, prêt à relire' },
      { icon: USER, title: 'Vous relisez', sub: 'rien ne part sans vous' },
      { icon: MAIL, title: 'Le mail de suivi', sub: 'prêt pour jeudi soir' },
    ],
  },
]

export const THINK_STEPS = ['Lit', 'Rédige', 'Vérifie'] as const
export const THINK_STATUS = ['Lit votre demande…', 'Rédige…', 'Vérifie vos règles…'] as const

export interface Lead {
  name: string
  who: string
  src: string
  size: string
  city: string
  need: string
  /** Index of the team member the rules route this lead to. */
  m: number
}
export const LEADS: Lead[] = [
  {
    name: 'Cabinet Martin',
    who: 'Claire Martin',
    src: 'formulaire du site',
    size: '12 personnes',
    city: 'Rouen',
    need: 'Devis pour 3 postes',
    m: 1,
  },
  {
    name: 'Atelier Roy',
    who: 'Hugo Roy',
    src: 'salon pro',
    size: '4 personnes',
    city: 'Nantes',
    need: 'Une démonstration',
    m: 0,
  },
]
export const RULES = ['Moins de 10 personnes', '10 personnes et plus', 'Hors de France']
export const TEAM = [
  { av: 'JU', name: 'Julie' },
  { av: 'KA', name: 'Karim' },
  { av: 'LÉ', name: 'Léa' },
]

export const TILES = [
  { t: 'Presse pro', icon: I.doc, n: 0 },
  { t: 'Concurrent A', icon: I.globe, n: 1 },
  { t: 'Blog du secteur', icon: I.app, n: 0 },
  { t: 'Fournisseurs', icon: MAIL, n: 0 },
  { t: 'Concurrent B', icon: I.globe, n: 0 },
  { t: "Appels d'offres", icon: RECEIPT, n: 2 },
  { t: 'Réglementation', icon: SCALE, n: 3 },
  { t: 'Salon du secteur', icon: I.cap, n: 0 },
  { t: 'Avis clients', icon: USER, n: 0 },
]
export const BULLETINS = [
  "Concurrent A lance une offre d'entrée de gamme.",
  "Un appel d'offres dans votre région, clôture le 30.",
  'Facture électronique : ce qui change pour vous.',
]
export const VEILLE_PILLS = ['Dans votre boîte', 'Sources citées', "Rien n'est publié seul"]

export const FICHE: [string, string][] = [
  ['Adresse', '12 rue des Tilleuls, Rouen'],
  ['Problème', "Fuite sous l'évier, 3e étage"],
  ['Créneau', 'Jeudi matin'],
]
export const BON: [string, string][] = [
  ['Technicien', 'Thomas'],
  ['Rendez-vous', 'Jeu. 8 h 30'],
  ['À prévoir', 'Flexible et joint'],
]
export const FACTURE: [string, string][] = [
  ['Déplacement', '45,00 €'],
  ["Main-d'œuvre, 1 h", '55,00 €'],
  ['Flexible et joint', '18,00 €'],
]
export const FACTURE_AMOUNTS = [45, 55, 18]
export const THUMBS = ['Fiche', 'Bon', 'Facture']

export const SEANCE_MARKS = [
  { t: 'Objectif', at: '22.5%' },
  { t: 'Difficulté', at: '50%' },
  { t: 'Exercice', at: '77.5%' },
]
export const SEANCE_ROWS: [string, string][] = [
  ['Objectif', 'Des repas à heures fixes'],
  ['Difficulté', 'Les grignotages du soir'],
  ['Exercice', 'Un carnet alimentaire, 7 jours'],
]
export const SEANCE_BARS = Array.from({ length: 48 }, (_, i) =>
  8 + Math.round(22 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))),
)
export const SEANCE_DAYS = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.']

export const SR_INTRO =
  "Exemples animés : pour chaque cas, une demande arrive et Claude produit ce que vous validez : un devis, un mail envoyé à la bonne personne, le résumé de la veille du matin, les documents d'une intervention, le compte rendu d'une séance et son mail de suivi."

/** Readable text of the four bespoke scenes, kept in the static HTML for crawlers and screen readers. */
export const SCENE_TEXT: string[][] = [
  [],
  [
    ...LEADS.map((l) => `${l.name}, ${l.who}, ${l.src}, ${l.size}, ${l.city}, ${l.need}.`),
    `Vos règles : ${RULES.join(', ')}.`,
    `Votre équipe : ${TEAM.map((p) => p.name).join(', ')}.`,
  ],
  [`Vos sources : ${TILES.map((t) => t.t).join(', ')}.`, `Votre veille du matin : ${BULLETINS.join(' ')}`],
  [
    "Demande d'intervention du syndic : fuite au 3e étage.",
    ...[FICHE, BON, FACTURE].map((rows) => rows.map(([k, v]) => `${k} : ${v}`).join(', ')),
  ],
  [
    `Compte rendu de séance : ${SEANCE_ROWS.map(([k, v]) => `${k} : ${v}`).join(', ')}.`,
    'Le mail de suivi est programmé le jeudi à 20 h 30.',
  ],
]

export const HOLD_MS = 4000
export const SWAP_MS = 320
export const CHAR_MS = 26
