/**
 * Every visitor string of `/conferences` (US-107, plan sablia-site-structure-offre F3), verbatim from
 * the copy deck B4 `conf.*` as corrected after its content review. Talks are sold on request, the price
 * in the quote: no amount here. Each topic shows the duration its support actually has (the selling
 * durations were question T5 of validation point 2); the deduction rule of the conference option stays on
 * `/formations#conference`, which no longer announces a duration (Brice, 13/11). The recommendation is signed by a role and a sector only.
 */

export const META = {
  title: "Conférences et séminaires sur l'IA, à Rouen · Sablia",
  description:
    "Une conférence ou une matinée de séminaire sur l'IA, pour toute votre équipe. Sur demande, prix sur devis.",
} as const

export const HERO = {
  eyebrow: 'Conférences et séminaires',
  h1: "Une conférence ou une matinée sur l'IA, pour toute votre équipe.",
  lede: "Je viens parler à votre équipe de ce que l'IA fait dans son métier, avec des démonstrations en direct et du temps pour les questions.",
  demande: 'Sur demande, prix sur devis : le devis suit un échange gratuit de 30 minutes.',
  cta: 'Réserver 30 min',
  /** Photo 01 of 09/10, the talk photo, alt as `/formations#conference` writes it. */
  photoAlt:
    "Brice Gachadoat parle debout à un pupitre, devant une salle d'une vingtaine de personnes assises.",
} as const

export const SUJETS = {
  eyebrow: 'Les sujets',
  title: 'Trois sujets, à choisir selon votre équipe.',
  labels: { public: 'Pour qui', format: 'Format' },
} as const

/** The duration gauge of each topic is drawn against a morning of 4 h (decorative, aria-hidden). */
export const MORNING_MINUTES = 240

export interface Topic {
  key: string
  title: string
  public: string
  format: string
  /** Length of the format in minutes, for its gauge: keep it in step with `format`. */
  minutes: number
  text: string
  history: string
}

export const TOPICS: readonly Topic[] = [
  {
    key: 'generative',
    title: "Comprendre et utiliser l'IA générative",
    public: 'Toute une équipe, sans prérequis',
    format: "Séminaire, une matinée d'environ 4 h",
    minutes: 240,
    text: "Les bases de l'IA générative, puis des démonstrations sur des cas de votre métier, et un temps sur les garde-fous : données personnelles et confidentialité.",
    history: "Donné en octobre 2026 à l'équipe d'un cabinet de conseil en ingénierie.",
  },
  {
    key: 'regles',
    title: "Votre équipe utilise déjà l'IA. Avec quelles règles ?",
    public: "Une équipe qui se sert déjà de l'IA, et sa direction",
    format: "Conférence d'une heure, questions comprises",
    minutes: 60,
    text: "Des documents de travail fictifs passés à l'IA en direct : ce qu'on lui demande, ce qu'on vérifie, et ce qui ne doit jamais entrer dans un outil d'IA public.",
    history: "Construit pour un webinaire destiné aux bureaux d'études.",
  },
  {
    key: 'couts',
    title: 'IA et coûts : le bon modèle pour la bonne tâche',
    public: 'Direction, équipe technique',
    format: "Intervention d'environ 20 minutes, démonstration en direct comprise",
    minutes: 20,
    text: "Quel modèle choisir selon la demande, comment ne pas payer plus que nécessaire, et quand mieux vaut ne pas utiliser l'IA.",
    history:
      'Donnée en octobre 2026 devant des consultants en IA, avec une démonstration en direct.',
  },
]

/** P-19 of the proof file, word for word (its typographic apostrophes kept), signed by role and sector. */
export const PREUVE = {
  eyebrow: 'Recommandation',
  quote:
    'Brice est intervenu pour une matinée de sensibilisation à l’IA avec nos équipes. Le contenu était clair, concret et adapté à nos métiers : chacun est reparti avec des usages applicables dès le lendemain. Très bonne pédagogie et beaucoup d’échanges. Je recommande sans hésiter.',
  signature: "Responsable d'activités, cabinet de conseil en ingénierie",
} as const

export const FIN = {
  title: 'Trente minutes pour choisir le sujet et le format.',
  text: 'Vous me dites qui sera dans la salle et ce que vous en attendez, je vous propose un sujet, un format et un devis.',
} as const
