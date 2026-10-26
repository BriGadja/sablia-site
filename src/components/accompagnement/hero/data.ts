/** Both audiences of /accompagnement, from the v143 mockup's `data`. Index 0 = « Pour vous », 1 = « Pour votre équipe ». */
export type Mode = 0 | 1

export interface AccData {
  who: string
  week: ReadonlyArray<readonly [day: string, text: string]>
  situs: readonly string[]
  steps: ReadonlyArray<readonly [when: string, title: string, what: string]>
  /** [label, handed to Claude?] */
  tasks: ReadonlyArray<readonly [label: string, toClaude: 0 | 1]>
  human: string
  /** [title, text, svg path] */
  delivs: ReadonlyArray<readonly [title: string, what: string, icon: string]>
}

export const MODE_LABELS = ['Pour vous', 'Pour votre équipe'] as const

export const ACC_DATA: readonly [AccData, AccData] = [
  {
    who: 'Dirigeant, indépendant',
    week: [
      ['Lundi', 'Une séance sur vos vrais dossiers'],
      ['Mardi à jeudi', 'Vos questions, par message'],
      ['Vendredi', 'Une tâche de plus confiée à Claude'],
    ],
    situs: [
      'Vous payez un abonnement IA sans vraiment vous en servir.',
      'Vous savez ce que vous voulez déléguer, pas comment.',
      'Vous voulez aller plus loin : agents, automatisations, Claude Code.',
    ],
    steps: [
      ['Semaine 0', 'Un appel de 30 minutes', 'Ce que vous faites, ce que vous voulez déléguer.'],
      [
        'Semaine 1',
        'Le tour de votre semaine',
        'Tâche par tâche : ce que vous confiez à Claude, ce que vous gardez.',
      ],
      [
        'Les semaines suivantes',
        'Une séance par semaine',
        'Sur vos vrais dossiers, à votre niveau.',
      ],
      [
        'Entre les séances',
        'Vos questions, par message',
        'Et je mets en place ce qui peut tourner seul.',
      ],
      ['À la fin', 'Vous êtes autonome', 'Vos outils configurés, votre méthode, vos assistants.'],
    ],
    tasks: [
      ['Répondre aux mails clients', 1],
      ['Préparer vos rendez-vous', 1],
      ['Négocier un devis', 0],
      ['Relancer vos prospects', 1],
    ],
    human: 'Vous la gardez',
    delivs: [
      [
        'Vos outils configurés',
        'Claude, vos Projets et vos connecteurs, réglés pour vous.',
        'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
      ],
      [
        'Des assistants sur vos tâches',
        'Ceux qui reviennent chaque semaine.',
        'M13 3L4 14h7l-1 7 9-11h-7z',
      ],
      ['Une méthode', 'Savoir quoi confier à Claude, et comment.', 'M9 11l3 3L22 4M21 12v7H3V5h11'],
      [
        'Des ressources à garder',
        'Vos modèles, vos consignes, les vidéos des séances.',
        'M3 6h6l2 2h10v11H3z',
      ],
    ],
  },
  {
    who: 'Équipe',
    week: [
      ['Mercredi', 'Une séance de groupe sur vos outils'],
      ['Toute la semaine', 'Un canal pour les questions'],
      ['Vendredi', 'Une automatisation mise en place'],
    ],
    situs: [
      "Les licences sont là, l'usage ne suit pas.",
      'Chacun bricole dans son coin, sans méthode commune.',
      'Votre équipe technique veut industrialiser avec Claude Code.',
    ],
    steps: [
      ['Semaine 0', 'Le cadrage avec le responsable', 'Les objectifs, les outils, les personnes.'],
      [
        'Semaine 1',
        'Le point de départ de chacun',
        "Ce que l'équipe fait aujourd'hui, ce que Claude peut prendre.",
      ],
      [
        'Les semaines suivantes',
        'Des séances régulières par groupe',
        'Chaque groupe sur ses propres tâches.',
      ],
      [
        'Entre les séances',
        'Un canal pour les questions',
        'Et des automatisations mises en place sur vos outils.',
      ],
      ['À la fin', 'Une équipe autonome', 'Des pratiques communes et un référent pour la suite.'],
    ],
    tasks: [
      ['Rédiger les comptes rendus', 1],
      ['Répondre au support interne', 1],
      ['Arbitrer les priorités', 0],
      ['Écrire les tests', 1],
    ],
    human: "L'équipe la garde",
    delivs: [
      [
        'Des outils déployés',
        'Licences, Projets et connecteurs partagés.',
        'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 12h3M18 12h3M12 3v3M12 18v3',
      ],
      [
        'Des pratiques communes',
        "Une charte et des modèles d'équipe.",
        'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
      ],
      [
        'Des automatisations en place',
        'Sur vos outils, à votre nom.',
        'M13 3L4 14h7l-1 7 9-11h-7z',
      ],
      [
        'Un référent désigné',
        'Pour faire vivre la suite en interne.',
        'M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
      ],
    ],
  },
]
