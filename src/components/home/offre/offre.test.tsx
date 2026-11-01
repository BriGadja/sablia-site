import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { OFFRE } from './content'
import { Offre } from './index'

/**
 * US-91 (home offer band, plan site-formation-lot1 U7): the three days as six half-days (1 with the
 * management, 2 to 5 by trade, 6 to close), up to 12 people, the team's own files, the price said to
 * come in the quote: never an amount. The sand pours across the six half-days once, below the fold.
 */
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const STEPS = [
  "Demi-journée 1, avec la direction : vos cas d'usage et vos règles sur les données.",
  'Demi-journées 2 à 5, par métier : chaque équipe travaille sur ses dossiers réels.',
  'Demi-journée 6 : la mesure « après » et le plan de formation.',
]

describe('static HTML (SSR content rule)', () => {
  const html = renderToString(<Offre />)
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')

  it('is the #offre section, zone « offre », with its h2', () => {
    expect(html).toMatch(/<section[^>]*id="offre"/)
    expect(html).toContain('v2-offre')
    expect(html).toContain('data-zone="offre"')
    expect(html).toMatch(/<h2[^>]*>Trois jours, six demi-journées\.<\/h2>/)
    expect(html).toContain("L'offre")
  })

  it('carries the three figures: 3 jours, 12 people at most, your own files', () => {
    for (const [big, sub] of [
      ['3 jours', 'chez vous, en six demi-journées'],
      ['12', 'personnes au plus'],
      ['Vos dossiers', 'et vos règles sur les données'],
    ]) {
      expect(html).toContain(`>${big}<`)
      expect(html).toContain(sub)
    }
  })

  it('draws six half-days grouped 1, 4, 1 and labelled Direction, Par métier, Clôture', () => {
    expect(html.match(/class="of-cell"/g)).toHaveLength(6)
    expect(OFFRE.groups.map((g) => [g.label, g.halfDays])).toEqual([
      ['Direction', 1],
      ['Par métier', 4],
      ['Clôture', 1],
    ])
    for (const g of OFFRE.groups) expect(html).toContain(`>${g.label}<`)
  })

  it('carries the three steps word for word, in order', () => {
    const at = STEPS.map((s) => html.indexOf(s))
    expect(at.every((i) => i > 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('says the price comes in the quote and shows no amount', () => {
    // Same words as the FAQ (« après l'échange de 30 minutes »), G0 contradiction 2; « 30 » stays
    // with « minutes » on a phone (no-break space).
    expect(html).toContain("Le prix arrive dans le devis, après l'échange de 30\u00a0minutes.")
    expect(html).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
    expect(html).not.toMatch(/sur devis|garanti|rembours/i)
  })

  it('links to the offer page', () => {
    expect(html).toMatch(
      /<a[^>]*href="\/formations"[^>]*>Voir l&#x27;offre en détail|<a[^>]*href="\/formations"[^>]*>Voir l'offre en détail/,
    )
  })

  it('is the final state: the bar full and the figures in place', () => {
    expect(html.match(/data-phase="final"/g)).toHaveLength(2)
    expect(html).not.toContain('opacity:0')
  })
})

/** Puts the section below the fold (top past the viewport) so it arms after hydration. */
function belowTheFold() {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    top: 5000,
    bottom: 5400,
    left: 0,
    right: 1000,
    width: 1000,
    height: 400,
    x: 0,
    y: 5000,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('the pour', () => {
  it('arms below the fold, plays once when it scrolls in, then rests on the final state', async () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    belowTheFold()
    const { container } = render(<Offre />)
    const days = container.querySelector('.of-days') as HTMLElement
    const cards = container.querySelector('.of-cards') as HTMLElement
    expect(days.dataset.phase).toBe('armed')
    expect(cards.dataset.phase).toBe('armed')
    act(() => {
      io.trigger(days, true)
      io.trigger(cards, true)
    })
    expect(days.dataset.phase).toBe('playing')
    expect(cards.dataset.phase).toBe('playing')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000)
    })
    expect(days.dataset.phase).toBe('final')
    expect(cards.dataset.phase).toBe('final')
    act(() => {
      io.trigger(days, false)
      io.trigger(days, true)
    })
    expect(days.dataset.phase).toBe('final')
  })

  it('a band already on screen at load keeps its final state', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    const { container } = render(<Offre />)
    expect((container.querySelector('.of-days') as HTMLElement).dataset.phase).toBe('final')
  })

  it('never leaves the final state under reduced motion', () => {
    mockReducedMotion(true)
    const io = mockIntersectionObserver()
    belowTheFold()
    const { container } = render(<Offre />)
    const days = container.querySelector('.of-days') as HTMLElement
    act(() => io.trigger(days, true))
    expect(days.dataset.phase).toBe('final')
  })
})

/** Query-aware matchMedia: wide screens (> 900 px) or phones, no reduced motion. */
function mockScreen(wide: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('min-width: 901px') ? wide : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

/** Every element far below the fold, except the sticky header (0-72) and the #offre panel (`top`). */
function layout(panel: { top: number }) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const box = (top: number, height: number) =>
      ({
        top,
        bottom: top + height,
        left: 0,
        right: 1000,
        width: 1000,
        height,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect
    if (this.classList.contains('v2-header')) return box(0, 72)
    if (this.id === 'offre') return box(panel.top, 800)
    return box(panel.top + 460, 160)
  })
}

/**
 * U7b (critics of U7): on wide screens the night panel slides over the sticky hero; the sand must
 * pour only once that slide is over (the panel's top under the sticky header), so the eye is not
 * split between the slide and the bar. Phones have no slide: the pour plays when the bar scrolls in.
 */
describe('the pour waits for the panel', () => {
  it('on wide screens: armed until the panel has finished its slide, then plays', async () => {
    vi.useFakeTimers()
    mockScreen(true)
    const io = mockIntersectionObserver()
    const panel = { top: 5000 }
    layout(panel)
    const { container } = render(
      <>
        <header className="v2-header" />
        <Offre />
      </>,
    )
    const days = container.querySelector('.of-days') as HTMLElement
    expect(days.dataset.phase).toBe('armed')
    panel.top = 300 // sliding: the bar is on screen, the panel is not docked yet
    await act(async () => {
      io.trigger(days, true)
      document.dispatchEvent(new Event('scroll'))
      await vi.advanceTimersByTimeAsync(50)
    })
    expect(days.dataset.phase).toBe('armed')
    panel.top = 72 // docked under the header
    await act(async () => {
      document.dispatchEvent(new Event('scroll'))
      await vi.advanceTimersByTimeAsync(50)
    })
    expect(days.dataset.phase).toBe('playing')
  })

  it('on wide screens: a visitor who stops mid-slide (400 ms still) gets the pour too', async () => {
    vi.useFakeTimers()
    mockScreen(true)
    const io = mockIntersectionObserver()
    const panel = { top: 5000 }
    layout(panel)
    const { container } = render(
      <>
        <header className="v2-header" />
        <Offre />
      </>,
    )
    const days = container.querySelector('.of-days') as HTMLElement
    panel.top = 200
    await act(async () => {
      io.trigger(days, true)
      document.dispatchEvent(new Event('scroll'))
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(days.dataset.phase).toBe('armed')
    await act(async () => {
      document.dispatchEvent(new Event('scroll')) // still moving: the wait starts again
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(days.dataset.phase).toBe('armed')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150)
    })
    expect(days.dataset.phase).toBe('playing')
  })

  it('on phones: plays as soon as the bar scrolls in', () => {
    mockScreen(false)
    const io = mockIntersectionObserver()
    layout({ top: 5000 })
    const { container } = render(<Offre />)
    const days = container.querySelector('.of-days') as HTMLElement
    expect(days.dataset.phase).toBe('armed')
    act(() => io.trigger(days, true))
    expect(days.dataset.phase).toBe('playing')
  })

  it('fills each half-day in 380 ms, holds 300 ms between two groups, rests on the final state at 3.58 s', async () => {
    vi.useFakeTimers()
    mockScreen(false)
    const io = mockIntersectionObserver()
    layout({ top: 5000 })
    const { container } = render(<Offre />)
    const days = container.querySelector('.of-days') as HTMLElement
    expect(days.style.getPropertyValue('--cell')).toBe('380ms')
    const delays = (sel: string) =>
      Array.from(container.querySelectorAll<HTMLElement>(sel)).map((e) =>
        e.style.getPropertyValue('--d'),
      )
    // 1 | 4 | 1: a beat after the management's half-day, another before the closing one
    expect(delays('.of-cell')).toEqual(['0ms', '680ms', '1060ms', '1440ms', '1820ms', '2500ms'])
    expect(delays('.of-label')).toEqual(['0ms', '680ms', '2500ms'])
    act(() => io.trigger(days, true))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3500)
    })
    expect(days.dataset.phase).toBe('playing')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150)
    })
    expect(days.dataset.phase).toBe('final')
  })
})

/**
 * U7b: the six cells are equal grid tracks with a narrow empty track between two groups, and each
 * caption spans exactly its own half-days (1 | 2-5 | 6), so a caption sits under its segment.
 */
describe('bar and captions share one grid', () => {
  const mount = () => render(<Offre />).container

  it('declares six equal tracks and two group gaps', () => {
    const days = mount().querySelector('.of-days') as HTMLElement
    const cols = days.style.getPropertyValue('--cols')
    expect(cols.match(/minmax\(0, 1fr\)/g)).toHaveLength(3)
    expect(cols).toContain('repeat(4, minmax(0, 1fr))')
    expect(cols.match(/var\(--of-gap\)/g)).toHaveLength(2)
  })

  it('puts each half-day on its own track, skipping the gap tracks', () => {
    const cells = Array.from(mount().querySelectorAll<HTMLElement>('.of-cell'))
    expect(cells.map((c) => c.style.getPropertyValue('--c'))).toEqual([
      '1',
      '3',
      '4',
      '5',
      '6',
      '8',
    ])
  })

  it('makes each caption span the half-days of its group', () => {
    const steps = Array.from(mount().querySelectorAll<HTMLElement>('.of-step'))
    expect(steps.map((s) => s.style.getPropertyValue('--col'))).toEqual([
      '1 / span 1',
      '3 / span 4',
      '8 / span 1',
    ])
  })
})
