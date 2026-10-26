/** Home `#formations` copy, from the v143 mockup. Figures are Brice's declared ones (lot-2 grill, 18-19/10). */

export interface Stat {
  readonly key: string
  readonly value: number
  /** Appended after the figure ("+" = "at least"). */
  readonly suffix: string
  readonly label: string
}

export const STATS: readonly Stat[] = [
  { key: 'students', value: 1400, suffix: '+', label: 'élèves' },
  { key: 'workshops', value: 30, suffix: '+', label: 'ateliers animés' },
  { key: 'master', value: 4, suffix: '', label: 'masterclass' },
  { key: 'videos', value: 29, suffix: '', label: 'vidéos, le module Claude Code, 10 heures' },
]

export const FORMATS = [
  {
    key: 'direction',
    label: 'En réunion de direction',
    path: 'M3 4h18M5 4v10h14V4M12 14v4M8 21l4-3 4 3',
  },
  {
    key: 'ateliers',
    label: 'En ateliers',
    path: 'M16 20a4 4 0 0 0-8 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 19a3 3 0 0 0-3-3M17 10a2.5 2.5 0 1 0 0-5M3 19a3 3 0 0 1 3-3M7 10a2.5 2.5 0 1 1 0-5',
  },
  {
    key: 'seminaire',
    label: 'En séminaire',
    path: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3',
  },
] as const

export interface Quote {
  readonly key: string
  readonly line: string
  readonly full: string
  /** First name only, as in the proof dossier (P-14, P-16, P-17). */
  readonly name: string
  readonly role: string
}

export const QUOTES: readonly Quote[] = [
  {
    key: 'denis',
    line: "J'ai englouti tout son tutoriel en un mois.",
    full: "J'ai englouti tout son tutoriel en un mois. Je pensais avoir atteint mon plafond dans ma façon de travailler ; en fait j'ai tout remis à plat, la technique, la méthode, et surtout la rigueur que je m'imposais. Ça m'a ouvert des portes que je n'avais même pas imaginées.",
    name: 'Denis',
    role: "développeur d'une application de devis pour artisans",
  },
  {
    key: 'vassili',
    line: 'Un très bon pédagogue sur des sujets arides.',
    full: "J'ai retrouvé Brice dans une posture inattendue : il a été étudiant dans une école où j'intervenais moi-même. Mais cette fois-ci, c'était lui le formateur et moi l'apprenant. J'apprécie particulièrement le fait que Brice parvienne à transmettre une compréhension solide de sujets très techniques pour des publics qui ne sont eux-mêmes pas des profils techniques. Un très bon pédagogue sur des sujets arides. Je vois aussi en lui une rare capacité à mettre la technique en perspective et à lui donner vie. Je ne peux que recommander ses interventions.",
    name: 'Vassili',
    role: 'intervenant en école',
  },
  {
    key: 'franky',
    line: 'Une formation concrète, accessible et directement applicable au quotidien.',
    full: "À mes débuts, après avoir commencé à apprendre seul, la formation Claude Code de Brice et son accompagnement dans sa prise en main m'ont beaucoup aidé. Ses ateliers techniques m'ont permis de découvrir de nombreuses fonctionnalités et méthodes de travail que je n'exploitais pas encore, et de gagner rapidement en efficacité dans mon apprentissage. Une formation concrète, accessible et directement applicable au quotidien.",
    name: 'Franky',
    role: 'apprenant de la formation Claude Code',
  },
]

/** Thousands separator = narrow no-break space, fixed here so server and browser print the same string. */
export function formatFigure(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
