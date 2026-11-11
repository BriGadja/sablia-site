import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { PremierMois } from '.'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

/** Puts every element `top` px from the viewport top (innerHeight is 768 in happy-dom). */
function placeAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 300,
    left: 0,
    right: 300,
    width: 300,
    height: 300,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

// AC-23 design evaluation #3 (US-99): on a phone the section is ~860 px tall and the drawing starts
// ~515 px down it, so a trigger on the section played the 2.2 s sequence before the card was seen.
describe('#premier-mois signature trigger', () => {
  it('plays when the drawing itself scrolls in, not when the top of the section does', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeAt(2000)
    const { container } = render(<PremierMois />)
    const section = container.querySelector<HTMLElement>('#premier-mois')
    const drawing = container.querySelector<HTMLElement>('.tpm-drawing')
    if (!section || !drawing) throw new Error('section or drawing missing')
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(section, true))
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(drawing, true))
    expect(section.dataset.reveal).toBe('in')
  })

  it('waits for most of the drawing to be on screen', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeAt(2000)
    const { container } = render(<PremierMois />)
    const drawing = container.querySelector('.tpm-drawing')
    const watching = io.observers.find((o) => drawing && o.elements.has(drawing))
    expect(Number(watching?.options?.threshold)).toBeGreaterThanOrEqual(0.5)
  })
})

/** WCAG 2.x contrast ratio of two `#rrggbb` colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl
  }
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// AC-23 design evaluation #2a (US-99): DESIGN.md « `gold` itself only sits on night or violet »,
// `gold-dark` is text on LIGHT grounds and `gold-mid` a stroke; the bars drew `#835a0c` on the night
// track (2.3:1, the start of each bar vanished). A bar is a graphical object: 3:1 on its track.
describe('#premier-mois drawing colours', () => {
  const css = readFileSync(join(__dirname, 'premier-mois.css'), 'utf8')

  it('never uses gold-dark on the night drawing', () => {
    expect(css.toLowerCase()).not.toContain('#835a0c')
  })

  it('fills every bar with the gold of the night, each stop at 3:1 or more on its track', () => {
    const track = css.match(/\.tpm-track \{[^}]*background: (#[0-9a-f]{6})/i)?.[1]
    expect(track).toBeDefined()
    const fills = [...css.matchAll(/\.tpm-fill \{([^}]*)\}/g)].map((m) => m[1])
    expect(fills.length).toBeGreaterThanOrEqual(2)
    const stops = fills.flatMap((body) => [
      ...(body.match(/background:[^;]*/)?.[0].matchAll(/#[0-9a-f]{6}/gi) ?? []),
    ])
    expect(stops.length).toBeGreaterThanOrEqual(2)
    for (const [stop] of stops) {
      expect(['#d9a441', '#b9852a'], stop).toContain(stop.toLowerCase())
      expect(contrast(stop, track ?? '#ffffff'), stop).toBeGreaterThanOrEqual(3)
    }
  })
})
