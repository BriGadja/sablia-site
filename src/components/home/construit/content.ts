import { CashbackCard } from './cards/cashback'
import { HeleneCard } from './cards/helene'
import { InstitutCard } from './cards/institut'
import { MaintenanceCard } from './cards/maintenance'
import { NoesiaCard } from './cards/noesia'
import { SeminaireCard } from './cards/seminaire'
import { VoixCard } from './cards/voix'
import type { BlueprintCard, CardKind, CardStage } from './types'

export const EYEBROW = 'Réalisations'
export const TITLE = 'Exemples de réalisations.'
export const SUBTITLE = 'Plus de 20 clients accompagnés depuis 2025.'
export const LIST_LABEL = 'Toutes les réalisations'
export const PAUSE_LABEL = 'Mettre en pause'
export const RESUME_LABEL = 'Reprendre le défilement'

/** Build-up stage of a card that has not started, and of one that is finished (frozen, reduced motion, no JS). */
export const IDLE_STAGE: CardStage = { plan: false, b: 0, l: 0, f: 0 }
export const FINAL_STAGE: CardStage = { plan: true, b: 9, l: 9, f: 1 }

const ICON = {
  zap: 'M13 3L4 14h7l-1 7 9-11h-7z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  app: 'M3 5h18v14H3zM3 9h18M7 7h.01',
  cap: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
  phone:
    'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
}

/** Outbound link in a card's text (the click is an `outbound` event through the global listener). Mockup: noesia.school. */
export const CARD_LINKS: Partial<Record<CardKind, { href: string; label: string }>> = {
  noesia: { href: 'https://noesia.school', label: 'noesia.school' },
}

/** The wall, in the decided order: voice agents last, Pluriel stays off. Figures: units/d4-cashback.md. */
export const CARDS: BlueprintCard[] = [
  {
    kind: 'helene',
    panels: 2,
    lines: 5,
    lineStep: 550,
    tags: 'Automatisation · Site',
    icon: ICON.zap,
    sector: 'Hélène, psychopraticienne et conseillère en nutrition',
    text: 'Après chaque séance, le compte rendu et le mail de suivi du jeudi soir. Son site aussi.',
    Drawing: HeleneCard,
  },
  {
    kind: 'site',
    panels: 4,
    lines: 3,
    tags: 'Site',
    icon: ICON.globe,
    sector: 'Un institut de beauté à Rouen',
    text: 'Son site a quitté Wix pour son propre domaine, hébergé à son nom.',
    Drawing: InstitutCard,
  },
  {
    kind: 'cash',
    panels: 5,
    lines: 3,
    fig: { n: 699000, plus: true, unit: ' relevés' },
    tags: 'Application',
    icon: ICON.app,
    sector: 'Une plateforme de cashback',
    text: 'Les taux de ses concurrents, relevés chaque jour dans une application.',
    Drawing: CashbackCard,
  },
  {
    kind: 'maint',
    panels: 2,
    lines: 7,
    lineStep: 420,
    tags: 'Automatisation',
    icon: ICON.zap,
    sector: 'Une entreprise de maintenance du bâtiment',
    text: "Les demandes d'intervention reçues par mail deviennent fiches, bons et factures, sans ressaisie.",
    Drawing: MaintenanceCard,
  },
  {
    kind: 'noesia',
    panels: 3,
    lines: 1,
    lineStep: 1000,
    panelHold: 900,
    tags: 'Formation',
    icon: ICON.cap,
    sector: 'École Noésia',
    text: 'Le module Claude Code, 10 heures en 29 vidéos, et un atelier toutes les deux semaines.',
    Drawing: NoesiaCard,
  },
  {
    kind: 'seminar',
    panels: 2,
    lines: 2,
    tags: 'Formation',
    icon: ICON.cap,
    sector: 'Un cabinet de conseil en ingénierie',
    text: "Une matinée pour mettre l'IA générative entre les mains de son équipe.",
    Drawing: SeminaireCard,
  },
  {
    kind: 'voice',
    panels: 2,
    lines: 6,
    lineStep: 500,
    fig: { n: 68, unit: ' rendez-vous pris en cinq mois' },
    tags: 'Sur demande',
    icon: ICON.phone,
    sector: 'Agents vocaux',
    text: 'Une vingtaine mis en service depuis 2024 : accueil téléphonique, rappels, prise de rendez-vous.',
    muted: true,
    Drawing: VoixCard,
  },
]

/** Thousands separated by a plain space (the same on the server and in the browser). */
export const fmt = (v: number) =>
  Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** Pill text at counter progress `f` (0..1, ease-out cubic); the « + » only appears at the end. */
export function figureText(card: BlueprintCard, f: number): string {
  if (!card.fig) return ''
  const e = 1 - (1 - f) ** 3
  return `${fmt(card.fig.n * e)}${card.fig.plus && e >= 1 ? '+' : ''}${card.fig.unit}`
}

/** Stack position of a card behind the front one: transform, opacity and z-order (mockup `cards`). */
export function deckSlot(i: number, deck: number, n: number) {
  const o = (i - deck + n) % n
  const out = o === n - 1
  return {
    active: o === 0,
    second: o === 1,
    ty: o <= 2 ? -14 * o : out ? 16 : -28,
    sc: o <= 2 ? (1 - o * 0.035).toFixed(3) : out ? '0.960' : '0.930',
    op: o <= 2 ? 1 : 0,
    z: out ? 1 : 10 - o,
  }
}
