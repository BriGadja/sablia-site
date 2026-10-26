import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { FORMATS, formatFigure, QUOTES, STATS } from './content'
import { Formations } from './index'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('static HTML (SSR content rule)', () => {
  const html = renderToString(<Formations />).replace(/&#x27;/g, "'")

  it('is the #formations section with the scoped class', () => {
    expect(html).toContain('id="formations"')
    expect(html).toContain('v2-formations')
  })

  it('carries the final figures, formats, and every full testimonial', () => {
    expect(html).toContain('1 400+')
    expect(html).toContain('30+')
    for (const s of STATS) expect(html).toContain(s.label)
    for (const f of FORMATS) expect(html).toContain(f.label)
    for (const q of QUOTES) {
      expect(html).toContain(q.full)
      expect(html).toContain(`<b>${q.name}</b>`)
    }
  })

  it('names Noésia, never the old school name, no company and no em dash', () => {
    expect(html).toContain('noesia.school')
    expect(html).not.toMatch(/IAPreneurs/i)
    expect(html).not.toContain('—')
  })

  it('carries the signature right after the quote block (figcaption is the last child)', () => {
    expect(html).toMatch(/<\/button><figcaption>/)
  })
})

describe('expand', () => {
  it('toggles aria-expanded and the label, the full text is hidden until opened', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    render(<Formations />)
    const [first] = screen.getAllByRole('button', { name: 'Lire la suite' })
    expect(first.getAttribute('aria-expanded')).toBe('false')
    const full = document.getElementById(first.getAttribute('aria-controls') ?? '')
    expect(full?.hasAttribute('hidden')).toBe(true)
    fireEvent.click(first)
    expect(first.getAttribute('aria-expanded')).toBe('true')
    expect(first.textContent).toBe('Réduire')
    expect(full?.hasAttribute('hidden')).toBe(false)
  })
})

describe('count-up', () => {
  it('formats thousands with a narrow no-break space', () => {
    expect(formatFigure(1400)).toBe('1 400')
    expect(formatFigure(29)).toBe('29')
  })

  it('counts from 0 to the target once the band is 35 % in view, 1.4 s', async () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    let t = 0
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: (n: number) => void) => setTimeout(() => cb(++t * 100), 100) as unknown as number,
    )
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
    const { container } = render(<Formations />)
    expect(container.textContent).toContain('1 400+')
    const band = container.querySelector('.fo-band') as Element
    expect(io.observers.map((o) => o.options?.threshold)).toContain(0.35)
    act(() => io.trigger(band, true))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(container.textContent).not.toContain('1 400+')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(container.textContent).toContain('1 400+')
  })

  it('shows the final figures under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Formations />)
    expect(container.textContent).toContain('1 400+')
  })
})
