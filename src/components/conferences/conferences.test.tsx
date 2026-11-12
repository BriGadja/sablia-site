import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { MORNING_MINUTES, TOPICS } from './content'
import { ConferencesPreuve } from './preuve'
import { Sujets } from './sujets'

/**
 * The sections of `/conferences` (US-107, plan sablia-site-structure-offre F3): the topics' duration
 * gauges (the page's signature: each format's length against a morning of 4 h, filled with gold sand),
 * their entrance armed only below the fold after hydration, the reduced-motion final state, and the
 * CSS discipline of every stylesheet of the folder.
 */
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const CSS = ['hero/hero.css', 'sujets/sujets.css', 'preuve/preuve.css', 'rappel/rappel.css']

describe('topic durations', () => {
  it('each gauge follows its format: about 4 h, one hour, about 20 minutes, on a morning of 4 h', () => {
    expect(MORNING_MINUTES).toBe(240)
    expect(TOPICS.map((t) => [t.format, t.minutes])).toEqual([
      ["Séminaire, une matinée d'environ 4 h", 240],
      ["Conférence d'une heure, questions comprises", 60],
      ["Intervention d'environ 20 minutes, démonstration en direct comprise", 20],
    ])
  })

  it('the static HTML draws three decorative gauges at their final share, in topic order', () => {
    const html = renderToString(<Sujets />)
    const gauges = [...html.matchAll(/<span class="cs-gauge" aria-hidden="true"[^>]*>/g)]
    expect(gauges).toHaveLength(3)
    const shares = [...html.matchAll(/--share:([\d.]+)/g)].map((m) => Number(m[1]))
    expect(shares).toEqual([1, 0.25, 0.083])
    expect(html).toContain('data-reveal="final"')
  })
})

describe('entrances', () => {
  it('sujets and preuve stay final under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const a = render(<Sujets />)
    expect(a.container.querySelector('#sujets')?.getAttribute('data-reveal')).toBe('final')
    const b = render(<ConferencesPreuve />)
    expect(b.container.querySelector('#preuve')?.getAttribute('data-reveal')).toBe('final')
  })

  it('sujets: armed below the fold, played when it scrolls in', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 5000,
    } as DOMRect)
    const { container } = render(<Sujets />)
    const el = container.querySelector('#sujets') as HTMLElement
    expect(el.getAttribute('data-reveal')).toBe('armed')
    act(() => io.trigger(el, true))
    expect(el.getAttribute('data-reveal')).toBe('in')
  })

  // At 1440 the band's top is inside the first screen while its gauges are not: each gauge arms on
  // its own position, so the signature still plays where the band itself shows its final state.
  it('each gauge fills on its own when it scrolls in, even when the band starts on screen', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      return { top: this.id === 'sujets' ? 400 : 5000 } as DOMRect
    })
    const { container } = render(<Sujets />)
    expect(container.querySelector('#sujets')?.getAttribute('data-reveal')).toBe('final')
    const gauges = [...container.querySelectorAll<HTMLElement>('.cs-gauge')]
    expect(gauges.map((g) => g.getAttribute('data-reveal'))).toEqual(['armed', 'armed', 'armed'])
    act(() => io.trigger(gauges[0], true))
    expect(gauges.map((g) => g.getAttribute('data-reveal'))).toEqual(['in', 'armed', 'armed'])
  })

  it('the gauges stay full under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Sujets />)
    const states = [...container.querySelectorAll('.cs-gauge')].map((g) =>
      g.getAttribute('data-reveal'),
    )
    expect(states).toEqual(['final', 'final', 'final'])
  })
})

describe('CSS discipline of /conferences', () => {
  it.each(CSS)('%s: layer order, one v2-conf scope, hex colours', (file) => {
    const css = readFileSync(join(__dirname, file), 'utf8')
    expect(css.split('\n')[0]).toBe('@layer theme, base, components, utilities;')
    expect(css).toMatch(/\.v2-conf-[a-z]+ \{/)
    expect(css).not.toMatch(/var\(--color-/)
  })

  it('the staged sections hide content only in the armed state, and show it under reduced motion', () => {
    for (const file of ['sujets/sujets.css', 'preuve/preuve.css']) {
      const css = readFileSync(join(__dirname, file), 'utf8')
      expect(css, file).toMatch(/\[data-reveal='armed'\]/)
      expect(css, file).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
    }
  })
})
