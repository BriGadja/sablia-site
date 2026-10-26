import { of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

/** SVG path data of the two tab icons (the mockup's I.phone / I.mic). */
const ICON_PHONE = 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2'
const ICON_MIC = 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3'
export const ICON_CLOCK = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2'

export interface Quote {
  a: string
  /** First highlighted phrase. */
  k: string
  b: string
  /** Second highlighted phrase (the reminder date), last quote only. */
  k2?: string
  c?: string
}

export interface CallCase {
  tab: string
  icon: string
  kind: 'call' | 'note'
  title: string
  /** Avatar initials; empty on the note case (a microphone is drawn). */
  av: string
  who: string
  sub: string
  /** Length of the recording in seconds (the clock under the waveform). */
  dur: number
  live: string
  end: string
  read: string
  /** The 40-second counter is shown on the CRM side (note case only). */
  clock?: boolean
  q: readonly [Quote, Quote, Quote]
  f: readonly [{ k: string; v: string }, { k: string; v: string }, { k: string; v: string }]
  rel: string
  task: string
  when: string
  crm: 'sheets' | 'hubspot'
  crmAv: string
  crmTitle: string
  crmSub: string
}

export const CALLS: readonly [CallCase, CallCase] = [
  {
    tab: 'Appel · Google Sheets',
    icon: ICON_PHONE,
    kind: 'call',
    title: "L'appel",
    av: 'CD',
    who: 'Catherine Durand',
    sub: 'Atelier Durand',
    dur: 372,
    live: 'En ligne',
    end: 'Raccroché',
    read: "Lit l'appel…",
    q: [
      { a: "« Aujourd'hui, ", k: 'nos devis sont sur Excel', b: '. »' },
      { a: '« Il nous faut ça ', k: 'avant le 15 novembre', b: '. »' },
      { a: '« Je vois ça avec ', k: 'mon comptable', b: ', rappelez-moi ', k2: 'mardi', c: '. »' },
    ],
    f: [
      { k: 'Besoin', v: 'Remplacer les devis Excel' },
      { k: 'Échéance', v: 'Avant le 15 novembre' },
      { k: 'Décideurs', v: 'La gérante et son comptable' },
    ],
    rel: 'Relancer mardi 10 h',
    task: 'Relancer Catherine',
    when: 'Mar. 10:00',
    crm: 'sheets',
    crmAv: 'CD',
    crmTitle: 'Catherine Durand',
    crmSub: 'Atelier Durand',
  },
  {
    tab: 'Note vocale · HubSpot',
    icon: ICON_MIC,
    kind: 'note',
    title: 'La note vocale',
    av: '',
    who: 'Marc, commercial',
    sub: 'Après son appel, sur son portable',
    dur: 30,
    live: 'Enregistre',
    end: 'Envoyée',
    read: 'Lit la note vocale…',
    clock: true,
    q: [
      { a: '« Paul Lemoine veut ', k: 'la prise de rendez-vous en ligne', b: '. »' },
      { a: '« Il a ', k: 'environ 3 000 euros', b: ' de budget. »' },
      { a: '« ', k: 'Il décide seul', b: ', je le rappelle ', k2: 'jeudi', c: '. »' },
    ],
    f: [
      { k: 'Besoin', v: 'Rendez-vous en ligne' },
      { k: 'Budget', v: 'Environ 3 000 €' },
      { k: 'Décideur', v: 'Paul Lemoine, seul' },
    ],
    rel: 'Rappeler jeudi 9 h',
    task: 'Rappeler Paul',
    when: 'Jeu. 09:00',
    crm: 'hubspot',
    crmAv: 'PL',
    crmTitle: 'Paul Lemoine',
    crmSub: 'Garage Lemoine',
  },
]

/** The line under the pipeline follows the case on screen. The call case quotes no figure. */
export const CALL_LINES: readonly [{ figure: string | null; text: string }, { figure: string | null; text: string }] = [
  {
    figure: null,
    text: 'Appel passé sur votre téléphonie (Ringover, Aircall) : Claude lit la transcription, rien à dicter.',
  },
  { figure: '40 s', text: 'Note vocale dictée, fiche remplie 40 secondes plus tard : mesuré sur notre démo HubSpot.' },
]

export const EYEBROW = 'Après chaque appel'
export const TITLE = 'Ce qui se passe quand votre commercial raccroche.'
export const SR_INTRO =
  "Exemple animé : pendant l'appel, les phrases utiles sont repérées dans le transcript. Quand le commercial raccroche, Claude les reprend, rédige le compte rendu, remplit les champs du CRM et crée la relance datée."

export const STEP_TITLES = ['Il raccroche.', 'Claude écrit le compte rendu.', 'La fiche est à jour.', 'La relance est créée.']
/** Duration of the progress line of each step, in ms (the mockup's measured laps). */
export const STEP_MS = [1900, 5150, 1460, 900]

export const TOOLS_LABEL = 'Outils compatibles'
export const TOOLS: ReadonlyArray<{ name: string; logo?: string; h?: number }> = [
  { name: 'HubSpot', logo: '/logos/crm/hubspot.svg', h: 18 },
  { name: 'Pipedrive', logo: '/logos/crm/pipedrive.svg', h: 16 },
  { name: 'Zoho', logo: '/logos/crm/zoho.svg', h: 18 },
  { name: 'Salesforce', logo: '/logos/crm/salesforce.svg', h: 22 },
  { name: 'Airtable' },
  { name: 'Google Sheets' },
  { name: 'Excel' },
]

/** Price and delay come from the OF-1 file, never typed here. */
export function offerFigures() {
  return { price: eurHt(of1.price.oneShotHt), days: `${of1.delay.days} jours` }
}

export const OFFER = {
  eyebrow: "L'offre",
  title: 'Ce que vous payez, ce que vous risquez.',
  once: 'une fois',
  inPlace: 'pour être en place',
  refunded: 'Remboursé',
  refundedSub: 'si ça ne tourne pas',
  link: "Voir l'offre en détail",
}

export type Look = 'raw' | 'clean' | 'task'

export interface ChipState {
  /** Column the chip is in: 1 call, 2 Claude, 3 CRM. */
  x: 1 | 2 | 3
  vis: boolean
  /** Animate left/top (the flight). */
  tr: boolean
  look: Look
  /** Measured pixel start of the chip on its highlighted word (column 1 only). */
  px: number | null
  py: number | null
}

export interface CallState {
  /** Quotes shown / highlighted / ghosted (lifted to Claude). */
  pq: number
  hl: number
  lift: number
  hung: boolean
  /** Progress of the recording, 0 to 1. */
  p: number
  /** Rail 1 and rail 2 lit up to this index. */
  t1: number
  t2: number
  /** Raw phrases arrived in column 2 (mv1), clean values written (cl), clean values left (mv2), landed in the CRM (land). */
  mv1: number
  cl: number
  mv2: number
  land: number
  rel: boolean
  k2: boolean
  upd: boolean
  /** 0 idle, 1-4 step in progress, 5 all done. */
  step: number
  st: 'wait' | 'read' | 'write' | 'plan' | 'send' | 'done'
  fade: boolean
  /** Note case: seconds on the CRM clock, 0 to 40. */
  clk: number
  chips: ChipState[]
}

const idleChip = (): ChipState => ({ x: 1, vis: false, tr: false, look: 'raw', px: null, py: null })

export function callReset(): CallState {
  return {
    pq: 0, hl: 0, lift: 0, hung: false, p: 0, t1: 0, mv1: 0, cl: 0, rel: false, k2: false, t2: 0, mv2: 0, land: 0,
    upd: false, step: 0, st: 'wait', fade: false, clk: 0,
    chips: [0, 1, 2, 3].map(idleChip),
  }
}

export function callFinal(): CallState {
  return {
    pq: 3, hl: 3, lift: 3, hung: true, p: 1, t1: 3, mv1: 3, cl: 3, rel: true, k2: true, t2: 4, mv2: 4, land: 4,
    upd: true, step: 5, st: 'done', fade: false, clk: 40,
    chips: [0, 1, 2, 3].map(idleChip),
  }
}

const STATUS: Record<CallState['st'], (c: CallCase) => string> = {
  wait: () => "En attente de l'appel",
  read: (c) => c.read,
  write: () => 'Rédige le compte rendu…',
  plan: () => 'Prépare la relance…',
  send: () => 'Écrit dans votre CRM…',
  done: () => 'Fait : fiche à jour',
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Everything the markup reads, derived from the case on screen and the loop state (the mockup's renderVals). */
export function derive(caseIdx: number, S: CallState) {
  const C = CALLS[caseIdx] ?? CALLS[0]
  const onCall = S.p > 0 && !S.hung
  const secs = Math.round(C.dur * S.p)
  const working = S.st === 'read' || S.st === 'write' || S.st === 'plan'
  return {
    C,
    onCall,
    working,
    time: `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`,
    pct: Math.round(100 * S.p),
    state: S.hung ? C.end : onCall ? C.live : 'En attente',
    stateDone: S.hung,
    claudeStatus: STATUS[S.st](C),
    quotes: C.q.map((q, i) => ({
      ...q,
      show: S.pq > i,
      hl: S.hl > i,
      hl2: S.k2,
      ghost: S.lift > i,
    })),
    mids: C.f.map((f, i) => {
      const flying = S.mv2 > i && S.land <= i
      return {
        raw: C.q[i]?.k ?? '',
        v: f.v,
        empty: S.mv1 <= i || flying,
        isRaw: S.mv1 > i && S.cl <= i,
        isClean: S.cl > i && S.mv2 <= i,
        isSent: S.land > i,
      }
    }),
    relEmpty: !S.rel || (S.mv2 > 3 && S.land <= 3),
    relOn: S.rel && S.mv2 < 4,
    relSent: S.land > 3,
    fields: C.f.map((f, i) => ({ k: f.k, v: f.v, n: String(i + 2), on: S.land > i })),
    taskOn: S.land > 3,
    updText: S.upd ? "Mise à jour à l'instant" : C.crmSub,
    clkOn: !!C.clock && S.hung,
    clkText: `00:${pad(S.clk)}`,
    clkDone: S.clk >= 40,
    steps: STEP_TITLES.map((t, i) => {
      const k = i + 1
      return {
        n: `0${k}`,
        t,
        on: S.step === k,
        done: S.step > k,
        cls: S.step > k ? 'done' : S.step === k ? 'on' : '',
        dur: STEP_MS[i] ?? 0,
      }
    }),
    chips: S.chips.map((c, i) => ({
      ...c,
      text: i === 3 ? (c.look === 'raw' ? (C.q[2].k2 ?? '') : C.rel) : c.look === 'raw' ? (C.q[i]?.k ?? '') : (C.f[i]?.v ?? ''),
      ...chipPlace(caseIdx, c.x, i, c),
    })),
  }
}

/** Left / top of a flying chip inside the pipeline box (the mockup's XS table and per-row offsets). */
export function chipPlace(
  caseIdx: number,
  x: 1 | 2 | 3,
  i: number,
  c: { x?: number; px: number | null; py: number | null },
): { left: string; top: number } {
  const col = c.x ?? x
  const xs = ['calc(0% + 17px)', 'calc(35% + 17px)', CALLS[caseIdx]?.crm === 'sheets' ? 'calc(70% + 33px)' : 'calc(70% + 7px)']
  const left = c.px != null ? `${c.px}px` : i === 3 && col === 3 ? 'calc(70% + 17px)' : (xs[col - 1] ?? xs[0] ?? '')
  const top = c.py != null ? c.py : i === 3 ? (col === 1 ? 250 : 334) : (col === 3 ? 134 : 122) + 64 * i
  return { left, top }
}

export const WAVE = [10, 18, 26, 14, 30, 22, 12, 28, 34, 20, 16, 30, 24, 10, 18, 32, 26, 14, 22, 30, 12, 20]
