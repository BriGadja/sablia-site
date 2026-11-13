import { CashbackCard } from './cards/cashback'
import { HeleneCard } from './cards/helene'
import { InstitutCard } from './cards/institut'
import { NoesiaCard } from './cards/noesia'
import { SeminaireCard } from './cards/seminaire'
import { VoixCard } from './cards/voix'
import type { BlueprintCard, CardKind, CardStage, RealisationType } from './types'

export const EYEBROW = 'Réalisations'
export const TITLE = 'Exemples de réalisations.'
export const SUBTITLE = 'Plus de 20 clients accompagnés depuis 2025.'
export const LIST_LABEL = 'Toutes les réalisations'
export const PAUSE_LABEL = 'Mettre en pause'
export const RESUME_LABEL = 'Reprendre le défilement'

/** A chip of the filter row: every type, or one of them. */
export type RealisationFilter = 'toutes' | RealisationType

/**
 * Copy deck B5 (US-108): `real.filter.group` names the row; `real.filter.1` to `.5` are the chip labels, which
 * never change with the pressed state (WAI-ARIA button pattern); `real.list.label` names the list per chip.
 */
export const FILTER_GROUP_LABEL = 'Filtrer les réalisations'
export const FILTERS: readonly { key: RealisationFilter; label: string; listLabel: string }[] = [
  { key: 'toutes', label: 'Toutes', listLabel: LIST_LABEL },
  { key: 'outils', label: 'Outils', listLabel: 'Réalisations : outils' },
  { key: 'formations', label: 'Formations', listLabel: 'Réalisations : formations' },
  { key: 'conferences', label: 'Conférences', listLabel: 'Réalisations : conférences' },
  { key: 'sites', label: 'Sites', listLabel: 'Réalisations : sites' },
]

/** Copy deck B5 `real.status`: « {n} réalisations sur {total} », singular for one. */
export const statusText = (n: number, total: number) =>
  `${n} ${n === 1 ? 'réalisation' : 'réalisations'} sur ${total}`
/** The band's sand drawing (charte « Sablier »); `/realisations` shows it in its page head instead. */
export const ILLUSTRATION = '/illus/realisations-contour-nuit.webp'

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

/**
 * The wall, in the decided order: voice agents last. Figures: units/d4-cashback.md (recount of 26/10).
 * Brice at VP2 (13/11): the maintenance card left; the cashback card is named for what was built and said
 * in the past (the service stopped on 07/11); the voice card keeps « une vingtaine ».
 */
export const CARDS: BlueprintCard[] = [
  {
    kind: 'helene',
    types: ['outils', 'sites'],
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
    types: ['sites'],
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
    types: ['outils'],
    panels: 5,
    lines: 3,
    fig: { n: 699000, plus: true, unit: ' relevés' },
    tags: 'Application',
    icon: ICON.app,
    sector: 'Plateforme de veille concurrentielle',
    text: 'Pour une plateforme de cashback : les taux de ses concurrents, relevés chaque jour pendant huit mois dans une application.',
    Drawing: CashbackCard,
  },
  {
    kind: 'noesia',
    types: ['formations'],
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
    types: ['conferences', 'formations'],
    panels: 2,
    lines: 2,
    /** The « matinée de sensibilisation » of proof line P-19 (adversarial review K6). */
    tags: 'Séminaire',
    icon: ICON.cap,
    sector: 'Un cabinet de conseil en ingénierie',
    text: "Une matinée pour mettre l'IA générative entre les mains de son équipe.",
    Drawing: SeminaireCard,
  },
  {
    kind: 'voice',
    types: ['outils'],
    panels: 2,
    lines: 6,
    lineStep: 500,
    fig: { n: 68, unit: ' rendez-vous pris en cinq mois' },
    /**
     * A past réalisation, no longer sold (« Agent vocal », not « Sur demande »); the 68 bookings as proof
     * line P-8 states them: sector and period, no name (adversarial review K6, dir-4 and fai-4). « Une
     * vingtaine … depuis 2024 » is Brice's own count (19/10, CAREER.md), kept at his word at VP2 (13/11).
     */
    tags: 'Agent vocal',
    icon: ICON.phone,
    sector: 'Agents vocaux',
    text: "Une vingtaine mis en service depuis 2024 : accueil téléphonique, rappels, prise de rendez-vous. Les 68 rendez-vous : un agent sortant, dans l'investissement locatif clé en main, d'avril à août 2026.",
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

/** The cards a chip keeps, in the wall's order (`toutes` = the whole wall). */
export const cardsFor = (filter: RealisationFilter): readonly BlueprintCard[] =>
  filter === 'toutes' ? CARDS : CARDS.filter((c) => c.types.includes(filter))

/**
 * Stack position of a card behind the front one: transform, opacity and z-order (mockup `cards`), in a set of
 * `n` cards. The last card of the stack is the one leaving (below, faded out) only when the stack has a third
 * card: in a set of two the card behind is the next one, in a set of one the front card is alone.
 */
export function deckSlot(i: number, deck: number, n: number) {
  const o = (i - deck + n) % n
  const out = n > 2 && o === n - 1
  return {
    active: o === 0,
    second: o === 1,
    ty: o <= 2 ? -14 * o : out ? 16 : -28,
    sc: o <= 2 ? (1 - o * 0.035).toFixed(3) : out ? '0.960' : '0.930',
    op: o <= 2 ? 1 : 0,
    z: out ? 1 : 10 - o,
  }
}
