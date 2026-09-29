import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CalloutSection from './landing/CalloutSection'
import OffreCallout from './offre/OffreCallout'

/**
 * Brice, 2026-09-29: the coral buttons go WCAG AA, site-wide. White on the brand coral read 3.28:1,
 * under the 4.5:1 a 14-15 px label needs, so every filled coral button rests on `primary-active`
 * and darkens to `primary-hover` on hover and press; the two callout cards carrying white text
 * moved to `primary-active` too. Every colour below is read from the tokens of `index.css`.
 */
const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(HERE, '..')
const CSS = readFileSync(resolve(SRC, 'index.css'), 'utf8')

/** WCAG 2.x thresholds: normal text, and large text (24 px, or 18.66 px bold). */
const AA_NORMAL = 4.5
const AA_LARGE = 3

type Rgb = readonly [number, number, number]

function token(name: string): Rgb {
  const match = CSS.match(new RegExp(`--color-${name}:\\s*(\\d+) (\\d+) (\\d+);`))
  if (match === null) throw new Error(`--color-${name} is not defined in index.css`)
  return [Number(match[1]), Number(match[2]), Number(match[3])]
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

/** `fg` at `alpha` over an opaque `bg`, as the browser paints `text-on-primary/NN`. */
function over(fg: Rgb, bg: Rgb, alpha: number): Rgb {
  const mix = (i: 0 | 1 | 2) => Math.round(alpha * fg[i] + (1 - alpha) * bg[i])
  return [mix(0), mix(1), mix(2)]
}

/** Every non-test TSX source of the client, with its text. */
function sources(dir: string): { path: string; text: string }[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    if (!entry.name.endsWith('.tsx') || entry.name.includes('.test.')) return []
    return [{ path: relative(SRC, path), text: readFileSync(path, 'utf8') }]
  })
}

const has = (classes: string, name: string) =>
  new RegExp(`(^|\\s)${name.replace(/[/[\]]/g, '\\$&')}(\\s|$)`).test(classes)

/** The filled coral CTAs: a button class (`t-button`) painting white label text (`text-on-primary`). */
const FILLED_BUTTONS = sources(SRC).flatMap(({ path, text }) =>
  Array.from(text.matchAll(/(["'`])([^"'`]*\bt-button\b[^"'`]*)\1/g))
    .map((match) => match[2])
    .filter((classes) => has(classes, 'text-on-primary'))
    .map((classes) => ({ path, classes })),
)

describe('coral buttons: tokens', () => {
  it('white reads AA on the resting fill and on the hover/press fill', () => {
    const white = token('on-primary')
    expect(contrast(white, token('primary-active'))).toBeGreaterThanOrEqual(AA_NORMAL)
    expect(contrast(white, token('primary-hover'))).toBeGreaterThanOrEqual(AA_NORMAL)
  })

  it('the hover/press fill is darker than the resting one', () => {
    expect(luminance(token('primary-hover'))).toBeLessThan(luminance(token('primary-active')))
  })
})

describe('coral buttons: every one uses those tokens', () => {
  it('finds the filled coral buttons in the sources', () => {
    expect(FILLED_BUTTONS.length).toBeGreaterThan(0)
  })

  it('rests on primary-active, never on the brand coral, and darkens on hover and press', () => {
    const offenders = FILLED_BUTTONS.filter(
      ({ classes }) =>
        has(classes, 'bg-primary') ||
        !has(classes, 'bg-primary-active') ||
        !has(classes, 'hover:bg-primary-hover') ||
        !has(classes, 'active:bg-primary-hover'),
    ).map(({ path }) => path)
    expect(offenders).toEqual([])
  })
})

describe('callout cards: white text at AA', () => {
  const CARD_FILL = /(?:^|\s)bg-(primary(?:-active|-hover)?)(?:\s|$)/
  const WHITE_TEXT = /(?:^|\s)text-on-primary(?:\/(\d+))?(?:\s|$)/

  function paint(el: Element, background: Rgb): Rgb {
    const match = (el.getAttribute('class') ?? '').match(WHITE_TEXT)
    if (match === null) throw new Error(`no text-on-primary on <${el.tagName.toLowerCase()}>`)
    const alpha = match[1] === undefined ? 1 : Number(match[1]) / 100
    return over(token('on-primary'), background, alpha)
  }

  for (const [name, Card] of [
    ['home final call', CalloutSection],
    ['offer page final call', OffreCallout],
  ] as const) {
    it(`${name}: the paragraph reaches 4.5:1 and the title 3:1`, () => {
      const { container } = render(<Card />)
      const card = Array.from(container.querySelectorAll('div')).find((div) =>
        CARD_FILL.test(div.getAttribute('class') ?? ''),
      )
      expect(card, 'coral card').toBeDefined()
      const fill = token(
        ((card as Element).getAttribute('class') ?? '').match(CARD_FILL)?.[1] ?? '',
      )
      const paragraph = (card as Element).querySelector('p') as Element
      const title = (card as Element).querySelector('h2') as Element
      expect(contrast(paint(paragraph, fill), fill)).toBeGreaterThanOrEqual(AA_NORMAL)
      expect(contrast(paint(title, fill), fill)).toBeGreaterThanOrEqual(AA_LARGE)
    })
  }
})
