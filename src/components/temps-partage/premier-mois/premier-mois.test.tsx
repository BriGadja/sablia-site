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

  // AC-23 evaluation 2 #1: solid gradient fills under a drop shadow read as a dashboard card, while
  // DESIGN.md draws illustrations « in gold sand, CONTOURS ONLY ». Each bar is a gold outline on its
  // track; its share is its width (a scaleX would squash the stroke of its ends).
  it('draws every bar as a gold contour on its track, at 3:1 or more, with no fill', () => {
    expect(css).not.toMatch(/gradient/)
    const track = css.match(/\.tpm-track \{[^}]*background: (#[0-9a-f]{6})/i)?.[1]
    expect(track).toBeDefined()
    const fills = [...css.matchAll(/\.tpm-fill \{([^}]*)\}/g)].map((m) => m[1])
    expect(fills.length).toBeGreaterThanOrEqual(1)
    for (const body of fills) expect(body).not.toMatch(/background: (?!transparent)/)
    const base = fills[0]
    expect(base).toMatch(/background: transparent/)
    expect(base).toMatch(/width: calc\(var\(--share, 1\) \* 100%\)/)
    expect(base).not.toMatch(/scaleX\(var\(--share/)
    const stroke = base.match(/box-shadow: inset 0 0 0 ([\d.]+)px (#[0-9a-f]{6})/i)
    expect(Number(stroke?.[1])).toBeGreaterThanOrEqual(1.5)
    expect(stroke?.[2].toLowerCase()).toBe('#d9a441')
    expect(contrast(stroke?.[2] ?? '#000000', track ?? '#ffffff')).toBeGreaterThanOrEqual(3)
  })

  it('sets the drawing on the night without a drop shadow', () => {
    const card = css.match(/\.tpm-drawing \{([^}]*)\}/)?.[1] ?? ''
    expect(card).toMatch(/background: #161b29/)
    expect(card).not.toMatch(/box-shadow/)
  })

  it('keeps the sequence: bars drawn 150 ms apart, then the ring, then the two tags', () => {
    const armed = css.match(/&\[data-reveal='armed'\] \{([\s\S]*?)\n {4}\}/)?.[1] ?? ''
    expect(armed).toMatch(/\.tpm-fill \{\s*clip-path: inset\(0 100% 0 0\);/)
    const played = css.match(/&\[data-reveal='in'\] \{([\s\S]*?)\n {4}\}/)?.[1] ?? ''
    expect(played).toMatch(
      // the played state ends on an inset() too: `none` does not interpolate with inset(), the bars
      // would snap in whole instead of being drawn
      /\.tpm-fill \{\s*clip-path: inset\(0 0 0 0\);\s*transition: clip-path 0\.7s [^;]*;\s*transition-delay: calc\(var\(--i, 0\) \* 150ms \+ 120ms\);/,
    )
    expect(played).toMatch(/\.tpm-step\.is-stuck \.tpm-node \{\s*transition: box-shadow [^;]* 1s;/)
    expect(played).toMatch(/\.tpm-step\.is-stuck \.tpm-tag \{\s*transition-delay: 1\.05s;/)
    expect(played).toMatch(/\.tpm-step\.is-next \.tpm-tag \{\s*transition-delay: 1\.4s;/)
  })
})
