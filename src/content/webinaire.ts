/**
 * Every visitor-facing string of the four `/webinaire` pages (plan webinaire-bureaux-etudes-2026-11-01,
 * unit U3, stories US-86, US-88, US-90), the session facts and the form options. ONE file on purpose:
 * the hub's two text gates (`scripts/anti_slop.py --audience client,site` and the red-line guard
 * `check-redlines.py`, class client) read it as the single client-visible source of these pages.
 *
 * Red lines kept here (brief 2026-10-31, Q1-Q13): no funding word, no state label, no promised
 * figure, no scarcity or countdown, the client of October is never named (the anonymised line keeps
 * its base « 7 réponses sur 23 participants »), nothing borrowed from a competitor's titles or pages.
 */

/** The session the form registers for. `slug` is the one `api/webinaire.ts` writes. */
export const SESSION = {
  slug: '2026-11-19',
  title: "Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ?",
  date: 'Jeudi 19 novembre 2026',
  hours: 'de 12 h à 13 h',
  place: 'En visio, sur Google Meet',
} as const

/**
 * Booking link of the 30-minute call: the DEDICATED Calendly event type of the webinar (amendment
 * A1), NEVER `site.bookingUrl` (the CRM event type opens CRM-worded mail sequences). Its single owner
 * is unit U8, which writes it in the post-VP2 commit (hub `webinaire/config.json` holds the value).
 * While it is null, no page shows a booking button.
 */
export const BOOKING_URL: string | null = null

export const PATHS = {
  page: '/webinaire',
  merci: '/webinaire/merci',
  apresReservation: '/webinaire/apres-reservation',
  questionnaire: '/webinaire/questionnaire',
} as const

export const CONTACT_EMAIL = 'brice@sablia.io'

// ── /webinaire ────────────────────────────────────────────────────────────────

export const PAGE_META = {
  title:
    "Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? · Webinaire Sablia",
  description:
    "Webinaire gratuit le jeudi 19 novembre 2026 de 12 h à 13 h, sur Google Meet : l'IA à l'œuvre sur des documents fictifs de bureau d'études, et les règles à poser dans votre équipe. Animé par Brice Gachadoat.",
} as const

export const HERO = {
  eyebrow: 'Webinaire gratuit · en ligne',
  lede: "Une heure en visio pour voir l'IA travailler sur des documents fictifs de bureau d'études, et repartir avec les règles à poser dans votre équipe.",
  facts: [
    { key: 'quand', label: 'Quand', value: 'Jeudi 19 novembre, de 12 h à 13 h' },
    { key: 'ou', label: 'Où', value: 'En visio, sur Google Meet' },
    { key: 'prix', label: 'Prix', value: 'Gratuit' },
  ],
  cta: "Je m'inscris",
  byline: 'Animé par',
} as const

/** Figures of the branch study, quoted from the press release of 21/02/2025 (read 2026-11-01). */
export const CONSTAT = {
  eyebrow: 'Étude de la branche, février 2025',
  title: "Dans votre branche, l'IA arrive sans cadre.",
  stats: [
    {
      key: 'seuls',
      figure: '86 %',
      label: "des utilisateurs de l'IA générative se sont formés seuls",
    },
    {
      key: 'cadre',
      figure: '57 %',
      label:
        "des répondants estiment qu'aucun cadre n'a été défini par leur entreprise pour son usage",
    },
  ],
  source:
    "Source : étude de la branche Betic (bureaux d'études, ingénierie, conseil, numérique), publiée par la Fédération Cinov en février 2025 ; 628 salariés et 477 dirigeants interrogés.",
  sourceLink: 'Lire le communiqué',
  sourceHref:
    'https://pressclub.fr/wp-content/uploads/2025/02/CP_20250221_Etude-IAG_Federation-Cinov.pdf',
} as const

export const PROGRAMME = {
  eyebrow: 'Au programme',
  title: 'Une heure, quatre démonstrations',
  start: '12 h 00',
  end: '13 h 00',
  replay: 'Rejouer',
  /** Segments of the hour, in order; `weight` = approximate minutes (they add up to 60). */
  segments: [
    { key: 'cadrage', label: 'Cadrage', weight: 10 },
    { key: 'd1', label: 'Démo 1', weight: 8 },
    { key: 'd2', label: 'Démo 2', weight: 8 },
    { key: 'd3', label: 'Démo 3', weight: 8 },
    { key: 'd4', label: 'Démo 4', weight: 10 },
    { key: 'questions', label: 'Questions', weight: 16 },
  ],
  demos: [
    {
      key: 'd1',
      title: 'Le compte rendu de réunion',
      line: 'Des notes prises en vrac deviennent un compte rendu propre, prêt à relire.',
    },
    {
      key: 'd2',
      title: "L'extrait de CCTP",
      line: "L'IA relit la pièce écrite et signale ce qui manque ou se contredit.",
    },
    {
      key: 'd3',
      title: "Le fil de mails d'un client",
      line: 'Un long échange résumé en une page, avec une réponse préparée.',
    },
    {
      key: 'd4',
      title: 'Les sources et la confidentialité',
      line: 'Vérifier chaque référence citée, et savoir ce qui ne sort jamais du bureau.',
    },
  ],
  note: 'Tous les documents sont fictifs, et les démonstrations ne touchent ni aux calculs ni au dimensionnement : la décision technique reste à vos ingénieurs.',
} as const

/** The client of October stays anonymous until its written agreement; R05 needs the base right here. */
export const PREUVE = {
  eyebrow: "Séminaire d'octobre 2026",
  figure: '9,1/10',
  line: "de note moyenne, donnée par les équipes d'une société d'ingénierie d'environ 110 personnes (7 réponses sur 23 participants).",
} as const

export const INTERVENANT = {
  eyebrow: 'Qui anime',
  name: 'Brice Gachadoat',
  role: 'Fondateur de Sablia',
  /** From the site's validated founder line (`proof.ts` FOUNDER_LINE, hub memory/identity/CAREER.md). */
  line: "J'ai passé six ans au sein de la DSI du groupe LVMH, dont cinq comme Product Owner, puis deux ans comme Consultant senior BI. Depuis janvier 2025, avec Sablia, j'installe l'IA dans les outils des entreprises.",
  photo: '/photos/accueil-meetup-ecran-720.webp',
  photoAlt: 'Brice Gachadoat anime une formation IA devant un public',
} as const

export const INSCRIPTION = {
  eyebrow: 'Gratuit',
  title: "S'inscrire à la session du 19 novembre",
  next: [
    "L'invitation Google Agenda arrive dans les minutes qui suivent, avec le lien Meet.",
    'Un rappel par mail la veille à 18 h, un autre 30 minutes avant le début.',
  ],
} as const

/** Values are the enums of `api/webinaire.ts` (TAILLES, USAGES_IA); labels are what a visitor reads. */
export const TAILLE_OPTIONS = [
  { value: '1', label: '1 personne' },
  { value: '2-9', label: '2 à 9' },
  { value: '10-49', label: '10 à 49' },
  { value: '50-249', label: '50 à 249' },
  { value: '250+', label: '250 et plus' },
] as const

export const USAGE_OPTIONS = [
  { value: 'jamais', label: 'Jamais' },
  { value: 'essai', label: "À l'essai" },
  { value: 'chaque_semaine', label: 'Chaque semaine' },
  { value: 'tous_les_jours', label: 'Tous les jours' },
] as const

export const FORM = {
  labels: {
    prenom: 'Prénom',
    nom: 'Nom',
    email: 'E-mail professionnel',
    telephone: 'Téléphone',
    fonction: 'Fonction',
    taille: "Taille de l'entreprise",
    usage_ia: "Votre usage de l'IA aujourd'hui",
    pourquoi: 'Ce que vous aimeriez y trouver (facultatif)',
  },
  placeholders: {
    telephone: '06 12 34 56 78',
    fonction: 'Ex. : gérant, associée, chef de projet',
  },
  /** The callback box: UNTICKED by default (`rappel_consent` false), with its information line. */
  rappel: {
    label: "J'accepte d'être rappelé(e) après la session.",
    info: "Case non cochée, personne ne vous appelle. Cochée, quelqu'un de l'équipe Sablia vous appelle une fois au sujet de la formation. Pour retirer cet accord, écrivez à brice@sablia.io.",
  },
  privacy:
    "Vos coordonnées servent à l'invitation et aux rappels de cette session ; le détail est dans la politique de confidentialité.",
  privacyLink: 'Politique de confidentialité',
  submit: "Je m'inscris",
  sending: 'Inscription en cours…',
  busy: "Trop d'inscriptions depuis cette connexion aujourd'hui. Réessayez demain, ou écrivez à brice@sablia.io.",
  error: "L'inscription n'a pas abouti. Réessayez dans un instant, ou écrivez à brice@sablia.io.",
  /** Same text as `PHONE_ERROR` of `api/webinaire.ts`. */
  phoneError: 'Numéro de téléphone invalide (exemple : 06 12 34 56 78)',
  /** `{champ}` = the field's label above. */
  fieldError: 'Vérifiez le champ « {champ} ».',
} as const

// ── /webinaire/merci ──────────────────────────────────────────────────────────

export const MERCI = {
  meta: {
    title: 'Inscription enregistrée · Webinaire Sablia',
    description: 'Votre inscription au webinaire du jeudi 19 novembre 2026 est enregistrée.',
  },
  eyebrow: 'Inscription enregistrée',
  title: 'À jeudi 19 novembre, 12 h',
  lede: "Voici ce qui arrive d'ici là.",
  steps: [
    {
      key: 'invitation',
      when: 'Dans les minutes qui suivent',
      what: "L'invitation Google Agenda, avec le lien Meet.",
    },
    { key: 'veille', when: 'Mercredi 18 novembre, 18 h', what: 'Un rappel par mail.' },
    { key: 'h0', when: 'Jeudi 19 novembre, 11 h 30', what: 'Le dernier rappel, avec le lien.' },
    { key: 'debut', when: '12 h', what: 'La session commence.' },
  ],
  spam: 'Rien reçu dans dix minutes ? Regardez dans les courriers indésirables, puis écrivez-moi à brice@sablia.io.',
  leave:
    "Un empêchement : déclinez l'invitation. Pour ne plus rien recevoir sur cette session, répondez à un rappel ou écrivez-moi.",
  booking: {
    line: 'Vous préférez en parler sans attendre la session ?',
    cta: 'Réserver un échange de 30 minutes',
  },
  home: "Retour à l'accueil",
} as const

// ── /webinaire/apres-reservation ──────────────────────────────────────────────

export const APRES = {
  meta: {
    title: 'Votre échange est réservé · Sablia',
    description:
      'Ce qui se passe après la réservation de votre échange de 30 minutes avec Brice Gachadoat.',
  },
  eyebrow: 'Échange réservé',
  title: 'Votre échange de 30 minutes est réservé',
  lede: "Avant l'appel, un mail vous propose dix questions sur votre équipe. Comptez environ cinq minutes.",
  stepsTitle: 'Et ensuite',
  steps: [
    {
      key: 'appel',
      title: "L'appel",
      line: '30 minutes sur votre équipe, ses dossiers et ses outils.',
    },
    {
      key: 'resume',
      title: 'Le résumé écrit',
      line: 'Je vous envoie ce que nous nous sommes dit.',
    },
    {
      key: 'devis',
      title: 'Le devis',
      line: 'Ce que je propose pour votre équipe, avec son prix.',
    },
    {
      key: 'convention',
      title: 'La convention de formation',
      line: 'Le document qui fixe les dates, le lieu et le programme.',
    },
    {
      key: 'paiement',
      title: 'Le paiement',
      line: 'Selon les conditions écrites dans la convention.',
    },
  ],
  move: "Besoin de déplacer l'appel ? Le lien est dans le mail de confirmation de la réservation.",
  home: "Retour à l'accueil",
} as const

// ── /webinaire/questionnaire ──────────────────────────────────────────────────

export type QuestionKind = 'long' | 'single' | 'multi'

export interface Question {
  /** Key sent to `POST /api/webinaire-questionnaire` (q1..q10, all always sent). */
  readonly key: `q${number}`
  readonly label: string
  readonly kind: QuestionKind
  readonly hint?: string
  readonly options?: readonly string[]
  /** A short free-text box next to the options (its text is appended to the answer). */
  readonly detail?: string
}

export const QUESTIONS: readonly Question[] = [
  {
    key: 'q1',
    label: "Quelles tâches votre équipe confierait-elle volontiers à l'IA ?",
    kind: 'long',
    hint: "Ex. : comptes rendus, relecture de pièces écrites, réponses aux appels d'offres.",
  },
  {
    key: 'q2',
    label: "Quels outils d'IA sont déjà utilisés chez vous ?",
    kind: 'multi',
    options: [
      'ChatGPT',
      'Microsoft Copilot',
      'Claude',
      'Gemini',
      'Le Chat (Mistral)',
      'Autre',
      'Aucun',
      'Je ne sais pas',
    ],
  },
  {
    key: 'q3',
    label: 'Combien de personnes seraient concernées par la formation ?',
    kind: 'single',
    options: ['1 à 5', '6 à 12', '13 à 25', 'Plus de 25'],
  },
  {
    key: 'q4',
    label: 'Quelles données sensibles votre équipe manipule-t-elle ?',
    kind: 'multi',
    options: [
      'Dossiers clients',
      'Données personnelles',
      'Plans et pièces techniques',
      'Données financières',
      'Pièces de marchés publics',
      'Aucune en particulier',
    ],
  },
  {
    key: 'q5',
    label: "Qu'aimeriez-vous ne plus faire à la main ?",
    kind: 'long',
  },
  {
    key: 'q6',
    label: "Existe-t-il déjà des règles sur l'usage de l'IA chez vous ?",
    kind: 'single',
    options: ['Oui, écrites', "Oui, à l'oral", 'Pas encore', 'Je ne sais pas'],
  },
  {
    key: 'q7',
    label: 'Qui décide d’une formation dans votre entreprise ?',
    kind: 'single',
    options: ['Moi', 'Un associé ou la direction', 'Les ressources humaines', 'À plusieurs'],
  },
  {
    key: 'q8',
    label: 'Pour les trois jours de formation, quel format et quelle période ?',
    kind: 'single',
    options: ["Trois jours d'affilée", 'Trois jours étalés', 'À voir ensemble'],
    detail: 'Période souhaitée (ex. : janvier, avant l’été)',
  },
  {
    key: 'q9',
    label: 'Des contraintes sur place ?',
    kind: 'long',
    hint: 'Salle, ordinateurs, accès à internet, horaires.',
  },
  {
    key: 'q10',
    label: "Une question ou un sujet à aborder pendant l'appel ?",
    kind: 'long',
  },
]

export const QUESTIONNAIRE = {
  meta: {
    title: 'Dix questions avant notre échange · Sablia',
    description: "Le questionnaire envoyé avant l'échange de 30 minutes avec Brice Gachadoat.",
  },
  eyebrow: 'Avant notre échange',
  title: 'Dix questions sur votre équipe',
  hello: 'Bonjour {prenom},',
  lede: "Vos réponses me servent à arriver à l'appel en connaissant déjà votre situation. Comptez cinq minutes ; aucune question n'est obligatoire.",
  loading: 'Ouverture du questionnaire…',
  /** `{n}` answered questions. */
  progress: '{n} sur 10',
  progressLabel: 'Questions répondues',
  submit: 'Envoyer mes réponses',
  sending: 'Envoi en cours…',
  needOne: 'Répondez à au moins une question pour envoyer.',
  unknown:
    "Ce lien n'est pas reconnu. Il a peut-être été copié en partie : rouvrez le lien du mail, ou écrivez à brice@sablia.io.",
  already:
    'Vos réponses sont déjà enregistrées. Pour ajouter quelque chose, répondez au mail ou écrivez à brice@sablia.io.',
  /** `{prenom}` may be empty: the comma goes with it. */
  done: "Merci{prenom}. Vos réponses sont enregistrées, on en parle pendant l'appel.",
  error:
    "L'envoi n'a pas abouti. Vos réponses sont toujours là : réessayez, ou écrivez à brice@sablia.io.",
  unreachable:
    "Le questionnaire ne s'ouvre pas pour le moment. Réessayez dans un instant, ou écrivez à brice@sablia.io.",
  invalid:
    'Une réponse est trop longue (1 000 caractères au plus). Raccourcissez-la, puis renvoyez.',
} as const

// ── « prochain webinaire » banner (flag OFF until relay R4) ───────────────────

/**
 * The banner of todo t-20261031-33. Shipped OFF: it renders nothing while `enabled` is false, and it
 * is mounted nowhere yet (turning it on = this flag + one mount line, after the merge to main).
 */
export const NEXT_WEBINAR_BANNER = {
  enabled: false as boolean,
  label: 'Prochain webinaire',
  text: "Jeudi 19 novembre à 12 h : « Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? »",
  cta: "S'inscrire",
  href: '/webinaire',
}
