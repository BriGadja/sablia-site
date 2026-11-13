import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { Deroule } from './deroule'
import { HALF_DAYS } from './deroule/content'
import { Inclus } from './inclus'
import { stageDelay } from './useStaged'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const lit = (root: ParentNode, sel: string) => root.querySelectorAll(`${sel}.is-on`).length

describe('déroulé: six half-days fill in order, each group lights when its half-days are done', () => {
  it('the server HTML carries the final state (every half-day and every group lit)', () => {
    const html = renderToString(<Deroule />)
    expect(html.match(/class="dr-seg is-on"/g)).toHaveLength(6)
    expect(html.match(/class="dr-card is-on"/g)).toHaveLength(3)
    expect(HALF_DAYS).toHaveLength(3)
    expect(HALF_DAYS.map((h) => h.from)).toEqual([1, 2, 6])
    expect(HALF_DAYS.map((h) => h.to)).toEqual([1, 5, 6])
  })

  it('drops to zero once mounted, then fills half-day k at stageDelay(k) after entering view', () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Deroule />)
    expect(lit(container, '.dr-seg')).toBe(0)
    expect(lit(container, '.dr-card')).toBe(0)

    act(() => io.trigger(container.querySelector('#deroule') as Element, true))
    act(() => {
      vi.advanceTimersByTime(stageDelay(1) - 1)
    })
    expect(lit(container, '.dr-seg')).toBe(0)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(lit(container, '.dr-seg')).toBe(1)
    expect(lit(container, '.dr-card')).toBe(1)

    act(() => {
      vi.advanceTimersByTime(stageDelay(4) - stageDelay(1))
    })
    expect(lit(container, '.dr-seg')).toBe(4)
    expect(lit(container, '.dr-card')).toBe(1)

    act(() => {
      vi.advanceTimersByTime(stageDelay(5) - stageDelay(4))
    })
    expect(lit(container, '.dr-seg')).toBe(5)
    expect(lit(container, '.dr-card')).toBe(2)

    act(() => {
      vi.advanceTimersByTime(stageDelay(6) - stageDelay(5))
    })
    expect(lit(container, '.dr-seg')).toBe(6)
    expect(lit(container, '.dr-card')).toBe(3)
  })

  it('the whole fill plays once, in under 3.5 s', () => {
    expect(stageDelay(1)).toBeGreaterThan(0)
    expect(stageDelay(6)).toBeLessThan(3500)
    for (let k = 2; k <= 6; k++) expect(stageDelay(k)).toBeGreaterThan(stageDelay(k - 1))
  })

  it('reduced motion keeps the final state', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Deroule />)
    expect(lit(container, '.dr-seg')).toBe(6)
    expect(lit(container, '.dr-card')).toBe(3)
  })

  it('returns to the final state when reduced motion turns on after the reset', () => {
    const rm = mockReducedMotion(false)
    mockIntersectionObserver()
    const { container } = render(<Deroule />)
    expect(lit(container, '.dr-seg')).toBe(0)
    act(() => rm.set(true))
    expect(lit(container, '.dr-seg')).toBe(6)
  })
})

describe('reveal of a section below the fold (inclus)', () => {
  const placeAt = (top: number) =>
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top,
      bottom: top + 400,
      left: 0,
      right: 1000,
      width: 1000,
      height: 400,
      x: 0,
      y: top,
      toJSON: () => ({}),
    } as DOMRect)

  it('the server HTML is never armed (text visible without JavaScript)', () => {
    const html = renderToString(<Inclus />)
    expect(html).toContain('data-reveal="static"')
    expect(html).not.toContain('opacity:0')
  })

  it('below the fold: armed after mount, shown once it enters view', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeAt(5000)
    const { container } = render(<Inclus />)
    const section = container.querySelector('#inclus') as HTMLElement
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(section, true))
    expect(section.dataset.reveal).toBe('in')
  })

  it('already on screen at mount: never armed, so it never blinks', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    placeAt(100)
    const { container } = render(<Inclus />)
    expect((container.querySelector('#inclus') as HTMLElement).dataset.reveal).toBe('static')
  })

  it('reduced motion: never armed', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    placeAt(5000)
    const { container } = render(<Inclus />)
    expect((container.querySelector('#inclus') as HTMLElement).dataset.reveal).toBe('static')
  })
})
