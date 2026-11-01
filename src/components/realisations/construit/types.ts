import type { ComponentType } from 'react'

/**
 * Where a card is in its build-up. The shell owns the clock; a card only maps this to class names.
 * Mockup names: `plan` = wPlan, `b` = wB, `l` = wL, `f` = wFig.
 *  - plan: the dashed outlines (`.bp-s`) are drawn
 *  - b: number of filled panels (`.bp-p`), 0..P
 *  - l: number of lit details (ticks, "En ligne" pills, rows), 0..L
 *  - f: 0..1 progress of the figure counter (only the pill below the drawing uses it)
 */
export interface CardStage {
  plan: boolean
  b: number
  l: number
  f: number
}

/** Props of the seven drawing components under `./cards/` (they render the inside of `.bp-stage`). */
export interface CardProps {
  stage: CardStage
}

export type CardKind = 'helene' | 'site' | 'cash' | 'maint' | 'noesia' | 'seminar' | 'voice'

/** One wall entry: its timing, the footer under the drawing, and the drawing itself. */
export interface BlueprintCard {
  kind: CardKind
  /** Number of panels filled one after the other (mockup `P`). */
  panels: number
  /** Number of detail steps (mockup `L`). */
  lines: number
  /** ms between two detail steps (default 650). */
  lineStep?: number
  /** ms to wait between the last panel and the first detail step (default 450). */
  panelHold?: number
  /** Figure pill next to the tag: counted up from 0 once the last detail step is reached. */
  fig?: { n: number; plus?: boolean; unit: string }
  tags: string
  /** SVG path of the tag icon (24 px grid, stroke). */
  icon: string
  sector: string
  text: string
  /** Greyed tag (the « sur demande » card). */
  muted?: boolean
  Drawing: ComponentType<CardProps>
}

/** `bp-s` outline class of a drawing piece. */
export const outline = (s: CardStage) => (s.plan ? 'bp-s on' : 'bp-s')
/** `bp-p` panel class: panel `j` (0-based) is on once `b > j`. Add `dark` as `extra` for the night panels. */
export const panel = (s: CardStage, j: number, extra = '') =>
  `bp-p${extra ? ` ${extra}` : ''}${s.b > j ? ' on' : ''}`
/** `on` once detail step `j` (1-based) is reached, `''` before. */
export const lit = (s: CardStage, j: number) => (s.l >= j ? 'on' : '')
