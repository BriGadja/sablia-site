import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { REFERENT } from '../content'
import { MONTH_STEPS, Referent } from '.'

/** Puts the month card below (or inside) the first viewport, as the arming check reads it. */
function placeCard(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 400,
    left: 0,
    right: 600,
    width: 600,
    height: 400,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

const card = (c: HTMLElement) => c.querySelector('.month') as HTMLElement
const shown = (c: HTMLElement) => c.querySelectorAll('.month [data-step].on').length
const steps = (c: HTMLElement) => c.querySelectorAll('.month [data-step]').length

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('#referent, server HTML', () => {
  const html = renderToString(<Referent />)

  it('carries the copy and the month in its final state (no hidden step, no inline opacity)', () => {
    const text = html.replace(/\u00a0/g, ' ')
    for (const s of [REFERENT.eyebrow, REFERENT.title, REFERENT.line, REFERENT.terms])
      expect(text).toContain(s.replace(/'/g, '&#x27;'))
    expect(html).toContain('2\u00a0h par mois')
    expect(html).toContain('sous 48\u00a0h.')
    expect(html).toContain('id="referent"')
    expect(html).not.toContain('is-armed')
    expect(html).not.toMatch(/opacity:\s*0/)
    const total = (html.match(/data-step="/g) ?? []).length
    expect(total).toBe(MONTH_STEPS)
    expect((html.match(/data-step="\d+" class="[^"]*\bon\b/g) ?? []).length).toBe(total)
  })

  it('draws a month of five weekdays: one 2-hour session, three questions answered', () => {
    expect((html.match(/class="m-day"/g) ?? []).length).toBe(5)
    expect((html.match(/class="m-cell[ "]/g) ?? []).length).toBe(20)
    expect((html.match(/m-session/g) ?? []).length).toBeGreaterThanOrEqual(1)
    expect((html.match(/class="m-q[ "]/g) ?? []).length).toBe(3)
    expect((html.match(/class="m-a[ "]/g) ?? []).length).toBe(3)
    expect(html).toContain(REFERENT.month.session)
    expect(html).toContain(REFERENT.month.answer)
  })

  it('keeps the drawing out of the accessibility tree (the line says it)', () => {
    expect(html).toMatch(/<div[^>]*class="month[^"]*"[^>]*aria-hidden="true"/)
  })
})

describe('#referent, motion', () => {
  it('below the fold: arms after hydration, then plays every step once in view', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeCard(2000)
    const { container } = render(<Referent />)
    const m = card(container)
    expect(m.classList.contains('is-armed')).toBe(true)
    expect(shown(container)).toBe(0)
    act(() => io.trigger(m, true))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })
    const early = shown(container)
    expect(early).toBeGreaterThan(0)
    expect(early).toBeLessThan(steps(container))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(shown(container)).toBe(steps(container))
  })

  it('partly on screen at load: the marks already visible stay, only the rest plays', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const k = Number(this.getAttribute('data-step') ?? 0)
      const top = k >= 1 && k <= 2 ? 700 : 2000
      return {
        top,
        bottom: top + 30,
        left: 0,
        right: 30,
        width: 30,
        height: 30,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }
    })
    const { container } = render(<Referent />)
    const m = card(container)
    expect(m.classList.contains('is-armed')).toBe(true)
    expect(shown(container)).toBe(2)
    act(() => io.trigger(m, true))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000)
    })
    expect(shown(container)).toBe(steps(container))
  })

  it('answers carry Brice as the référent (a decorative portrait, no alt text)', () => {
    const html = renderToString(<Referent />)
    const faces = html.match(/<img[^>]*class="m-face"[^>]*>/g) ?? []
    expect(faces).toHaveLength(3)
    for (const f of faces) {
      expect(f).toContain('alt=""')
      expect(f).toContain('/photos/formation-02-540.webp')
    }
  })

  it('on screen at load: stays in its final state (no blink)', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    placeCard(100)
    const { container } = render(<Referent />)
    expect(card(container).classList.contains('is-armed')).toBe(false)
    expect(shown(container)).toBe(steps(container))
  })

  it('reduced motion: never arms, final state at once', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    placeCard(2000)
    const { container } = render(<Referent />)
    expect(card(container).classList.contains('is-armed')).toBe(false)
    expect(shown(container)).toBe(steps(container))
  })
})
