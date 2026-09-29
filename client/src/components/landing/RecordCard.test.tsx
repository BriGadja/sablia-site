import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RecordCard from './RecordCard'

/**
 * US-9, the record over the hero photo since Brice's pick of 2026-09-29: option A « La fiche
 * contact » of the run 2026-09-28-refonte-accueil-sablia (`mockups/fiche-crm-options.html`). The
 * words below are the mockup's, typed here on purpose: a constant edited in RecordCard.tsx goes red.
 */
const HERE = dirname(fileURLToPath(import.meta.url))
const CSS = readFileSync(resolve(HERE, '../../index.css'), 'utf8')

const ROWS = [
  ['Besoin', 'Remplacer les devis sur Excel'],
  ['Échéance', 'Avant le 15 novembre'],
  ['Décideurs', 'La gérante et son comptable'],
  ['Prochaine étape', 'Relance mardi à 10 h'],
]

/** No-break spaces are typography, not words: compare the text a reader sees. */
const text = (el: Element | null) => (el?.textContent ?? '').replace(/ /g, ' ')

function renderCard() {
  const { container } = render(<RecordCard />)
  const card = container.querySelector('.record-card')
  if (card === null) throw new Error('no .record-card rendered')
  return card
}

describe('RecordCard: the contact record of option A', () => {
  it('is decorative: the whole card is hidden from assistive tech', () => {
    expect(renderCard().getAttribute('aria-hidden')).toBe('true')
  })

  it('shows the avatar, the contact, the company and the stage pill', () => {
    const card = renderCard()
    expect(text(card.querySelector('.bg-primary-active'))).toBe('CD')
    expect(text(card.querySelector('.record-name'))).toBe('Catherine Durand')
    expect(text(card.querySelector('.record-name')?.nextElementSibling ?? null)).toBe(
      'Atelier Durand · 12 salariés',
    )
    expect(text(card.querySelector('.record-stage'))).toBe('Proposition')
  })

  it('carries the four rows, labels and values word for word, in order', () => {
    const rows = Array.from(renderCard().querySelectorAll('.record-row')).map((row) => [
      text(row.querySelector('dt')),
      text(row.querySelector('dd')),
    ])
    expect(rows).toEqual(ROWS)
  })

  it('types the four values one after another', () => {
    const values = Array.from(renderCard().querySelectorAll('dd'))
    expect(values.map((dd) => dd.classList.contains('record-value'))).toEqual([
      true,
      true,
      true,
      true,
    ])
    expect(values.map((dd) => (dd as HTMLElement).style.getPropertyValue('--d'))).toEqual([
      '0',
      '1',
      '2',
      '3',
    ])
  })

  it('is signed by Claude, after the call', () => {
    expect(text(renderCard().querySelector('.record-signature'))).toBe(
      "Écrit par Claude après l'appel · il y a 12 s",
    )
  })
})

/** The body of the first `@media (…)` block whose query is `query`, braces balanced. */
function mediaBlock(css: string, query: string): { start: number; end: number; body: string } {
  const start = css.indexOf(`@media (${query})`)
  if (start < 0) throw new Error(`no @media (${query}) in index.css`)
  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}' && --depth === 0) return { start, end: i + 1, body: css.slice(open + 1, i) }
  }
  throw new Error(`unbalanced @media (${query})`)
}

describe('RecordCard: motion, and none under reduced motion', () => {
  const motion = mediaBlock(CSS, 'prefers-reduced-motion: no-preference')

  it('pops, floats and types under `no-preference`', () => {
    expect(motion.body).toMatch(/\.record-card\s*\{[^}]*record-pop[^}]*record-float/)
    expect(motion.body).toMatch(/\.record-value\s*\{[^}]*animation:\s*record-type/)
  })

  it('declares no record animation nor clip-path anywhere else, so reduced motion is static', () => {
    // A rule outside that block would have to win a cascade fight under `reduce`, the fight
    // `.strip-copy` loses to the `flex` utility (03-validate, 2026-09-29).
    const rest = CSS.slice(0, motion.start) + CSS.slice(motion.end)
    const leaks = Array.from(rest.matchAll(/([^{}]+)\{([^{}]*)\}/g))
      .filter(
        ([, selector, body]) => selector.includes('.record-') && /animation|clip-path/.test(body),
      )
      .map(([, selector]) => selector.trim())
    expect(leaks).toEqual([])
  })

  it('animates the loop with clip-path and opacity only', () => {
    const typing = CSS.match(/@keyframes record-type\s*\{([\s\S]*?)\n {2}\}/)?.[1] ?? ''
    const properties = Array.from(typing.matchAll(/([a-z-]+)\s*:/g)).map(([, name]) => name)
    expect(new Set(properties)).toEqual(
      new Set(['clip-path', 'opacity', 'animation-timing-function']),
    )
  })
})

type Rgb = readonly [number, number, number]

function token(name: string): Rgb | null {
  const match = CSS.match(new RegExp(`--color-${name}:\\s*(\\d+) (\\d+) (\\d+);`))
  return match === null ? null : [Number(match[1]), Number(match[2]), Number(match[3])]
}

function channel(value: number): number {
  const s = value / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function luminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** The colour a `text-*` / `bg-*` class paints (token, `/NN` alpha, `[#hex]`, white), or null. */
function paint(cls: string, prefix: 'text' | 'bg'): { rgb: Rgb; alpha: number } | null {
  if (cls === `${prefix}-white`) return { rgb: [255, 255, 255], alpha: 1 }
  const hex = cls.match(new RegExp(`^${prefix}-\\[#([0-9a-f]{6})\\]$`, 'i'))?.[1]
  if (hex !== undefined) {
    const n = Number.parseInt(hex, 16)
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], alpha: 1 }
  }
  const named = cls.match(new RegExp(`^${prefix}-([a-z-]+?)(?:/(\\d+))?$`))
  const rgb = named === null ? null : token(named[1])
  return rgb === null || named === null
    ? null
    : { rgb, alpha: named[2] ? Number(named[2]) / 100 : 1 }
}

/** Nearest painted colour on the element or an ancestor; translucent fills composite downward. */
function painted(el: Element | null, prefix: 'text' | 'bg'): Rgb {
  if (el === null) return [255, 255, 255]
  const own = Array.from(el.classList)
    .map((cls) => paint(cls, prefix))
    .find((p) => p !== null)
  if (own === undefined || own === null) return painted(el.parentElement, prefix)
  if (own.alpha === 1) return own.rgb
  const under = painted(el.parentElement, prefix)
  const mix = (i: 0 | 1 | 2) => Math.round(own.alpha * own.rgb[i] + (1 - own.alpha) * under[i])
  return [mix(0), mix(1), mix(2)]
}

describe('RecordCard: every text reads AA on its background (Brice, 2026-09-29)', () => {
  const card = renderCard()
  const texts = Array.from(card.querySelectorAll('*')).filter((el) =>
    Array.from(el.childNodes).some((node) => node.nodeType === 3 && node.textContent?.trim()),
  )

  it('finds the thirteen text runs of the card', () => {
    // Avatar, name, company and pill, then four labels and four values, then the signature.
    expect(texts).toHaveLength(13)
  })

  for (const el of texts) {
    it(`« ${text(el)} » is at least 4.5:1`, () => {
      expect(contrast(painted(el, 'text'), painted(el, 'bg'))).toBeGreaterThanOrEqual(4.5)
    })
  }
})
