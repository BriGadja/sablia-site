import { of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

/** One frame of the hero loop (the mockup's hxS / hxR / hxSec / hxFade state). */
export interface Frame {
  /** Step: 0 idle, 1 on call, 2 hang-up pressed, 3 call ended, 4 Claude writing, 5 record updated, 6 next call announced. */
  s: number
  /** Record fill: 0 empty, 1 note typed, 2-4 rows filled one by one. */
  r: number
  /** Call clock in seconds. */
  sec: number
  /** The stage fades out between two laps. */
  fade: boolean
  /** Which caller the lap is about: laps alternate, the phone announces the next one (CP4 16). */
  lap: 0 | 1
}

export const START_FRAME: Frame = { s: 0, r: 0, sec: 358, fade: false, lap: 0 }
export const FINAL_FRAME: Frame = { s: 6, r: 4, sec: 372, fade: false, lap: 0 }

export const H1_LINES = ['Appel terminé,', 'CRM à jour.'] as const

export const PILL = "Compte rendu d'appel"

export const CLAIM_LINES = [
  'Vos commerciaux raccrochent : Claude écrit le compte rendu dans la fiche et crée la relance datée. Pour les équipes de 2 à 20 personnes, sur HubSpot comme sur un simple Google Sheets.',
  'Gratuit, sans engagement.',
]

export const FIGURE_LABEL =
  'Un commercial raccroche : Claude écrit le compte rendu et la fiche du CRM se met à jour toute seule.'

/** Price and delay come from the OF-1 file, never typed here. */
export function proofLine(): string[] {
  return [
    eurHt(of1.price.oneShotHt),
    `en place en ${of1.delay.days} jours`,
    'remboursé si ça ne tourne pas',
  ]
}

/** One caller's record. Catherine Durand is the scene section's first call case (same facts, one story). */
export interface Caller {
  name: string
  sub: string
  av: string
  /** CRM mark and tab label of the record window. */
  logo: string | null
  tag: string
  /** Note lines: [text, highlighted word or null] runs, the four highlights light up in order. */
  note: ReadonlyArray<ReadonlyArray<readonly [string, number | null]>>
  rows: ReadonlyArray<readonly [string, string]>
  relance: string
}

export const CALLERS: readonly [Caller, Caller] = [
  {
    name: 'Paul Lemoine',
    sub: 'Garage Lemoine',
    av: 'PL',
    logo: '/logos/crm/hubspot.svg',
    tag: 'Fiche contact',
    note: [
      [
        ['Veut prendre ses ', null],
        ['rendez-vous en ligne', 0],
        [',', null],
      ],
      [
        ['budget env. 3 000 €', 1],
        [', ', null],
        ['décide seul', 2],
        ['. ', null],
        ['Rappel jeudi matin', 3],
        ['.', null],
      ],
    ],
    rows: [
      ['Besoin', 'Rendez-vous en ligne'],
      ['Budget', 'Environ 3 000 €'],
      ['Décideur', 'Paul Lemoine, seul'],
    ],
    relance: 'Relance · Jeu. 09:00',
  },
  {
    name: 'Catherine Durand',
    sub: 'Atelier Durand',
    av: 'CD',
    logo: null,
    tag: 'Google Sheets',
    note: [
      [
        ['Veut remplacer ses ', null],
        ['devis sur Excel', 0],
        [',', null],
      ],
      [
        ['avant le 15 novembre', 1],
        [', ', null],
        ['la gérante et son comptable', 2],
        ['. ', null],
        ['Relance mardi matin', 3],
        ['.', null],
      ],
    ],
    rows: [
      ['Besoin', 'Remplacer les devis Excel'],
      ['Échéance', 'Avant le 15 novembre'],
      ['Décideurs', 'La gérante et son comptable'],
    ],
    relance: 'Relance · Mar. 10:00',
  },
]

/** Wave bar heights while the call runs. */
export const WAVE = [6, 12, 16, 9, 14, 18, 10, 13, 7] as const

export function clock(sec: number): string {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
}

/** Everything the markup needs, derived from a frame (the mockup's renderVals, hero part). */
export function derive({ s, r, sec, fade, lap }: Frame) {
  const who = CALLERS[lap]
  const next = CALLERS[lap === 0 ? 1 : 0]
  return {
    who,
    nextName: next.name,
    u1: s >= 2,
    u2: s >= 5,
    fade,
    phoneIn: s >= 1,
    phoneDown: s >= 3,
    live: s === 1,
    onCall: s <= 2,
    ended: s >= 3,
    next: s >= 6,
    hangPress: s === 2,
    claudeIn: s >= 4,
    claudeDone: s >= 5,
    working: s < 5,
    updOn: s >= 5,
    updText: s >= 5 ? 'Mis à jour · 14:02' : 'Dernier échange il y a 3 jours',
    noteFill: r >= 1,
    lit: [r >= 2, r >= 3, r >= 4, s >= 5],
    rowsOn: who.rows.map((_, i) => r > i + 1),
    relance: s >= 5,
    time: clock(sec),
    bars: WAVE.map((h, i) => ({ h: s === 1 ? h : 3, d: i * 60, on: s === 1 })),
  }
}
