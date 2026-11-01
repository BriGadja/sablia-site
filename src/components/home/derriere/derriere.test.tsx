import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FOUNDER_LINE } from '@/content/proof'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { formatFigure } from './content'
import { Derriere } from './index'

/**
 * `#derriere` is the trainer (plan site-formation-lot1 U8, copy 01b « The trainer »). It keeps its id:
 * `/about` 301s to `/#derriere`. Career facts follow memory/identity/CAREER.md.
 */
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const html = renderToString(<Derriere />).replace(/&#x27;/g, "'")
const text = html.replace(/<[^>]+>/g, '')

describe('#derriere static HTML', () => {
  it('is the #derriere section with the scoped class', () => {
    expect(html).toContain('id="derriere"')
    expect(html).toContain('v2-derriere')
  })

  it('eyebrow, heading (h2) and the career line of 01b', () => {
    expect(html).toContain('Qui forme votre équipe')
    expect(html).toMatch(/<h2[^>]*>Brice Gachadoat, fondateur de Sablia\.<\/h2>/)
    expect(html).toContain(
      "Six ans au sein de la DSI du groupe LVMH, dont cinq comme Product Owner, puis deux ans Consultant senior BI. Depuis janvier 2025, avec Sablia, il installe l'IA dans les outils des entreprises et forme les équipes qui s'en servent.",
    )
  })

  it('the timeline: LVMH, MeltOne, then Sablia (Noésia left it)', () => {
    expect(html).toContain('aria-label="Parcours"')
    const rows = [
      ['2016 · 2023', 'LVMH', "Au sein de la DSI, jusqu'à Head of Controlling Domain"],
      ['2023 · 2025', 'MeltOne', 'Consultant senior BI'],
      ['Depuis 2025', 'Sablia', 'fondateur'],
    ]
    const tl = html.slice(html.indexOf('aria-label="Parcours"'))
    let last = -1
    for (const row of rows) {
      for (const s of row) expect(tl).toContain(s)
      const at = tl.indexOf(`>${row[1]}<`)
      expect(at).toBeGreaterThan(last)
      last = at
    }
    expect(html).not.toContain('les deux en parallèle')
  })

  it('the four counters carry their final figure in the static HTML', () => {
    for (const s of ['1\u202f400+', '30+', 'élèves', 'ateliers animés', 'masterclass']) {
      expect(html).toContain(s)
    }
    expect(html).toMatch(/>4<\/div>/)
    expect(html).toMatch(/>29<\/div>/)
    expect(html).toContain('vidéos, le module Claude Code, 10 heures')
  })

  it('« 1 400+ élèves » leads the counters; each counter names its key for the layout', () => {
    const keys = [...html.matchAll(/class="dr-stat is-(\w+)"/g)].map((m) => m[1])
    expect(keys).toEqual(['students', 'workshops', 'master', 'videos'])
    expect(html).toMatch(/class="dr-stat is-students"><div class="dr-big">1 400\+<\/div>/)
  })

  it('Noésia is ONE proof line under the counters, linked to the school', () => {
    expect(text.match(/Noésia/g)).toHaveLength(1)
    expect(text).toContain("À l'école Noésia, où il est expert depuis juin 2025.")
    expect(html).toMatch(/<a [^>]*href="https:\/\/noesia\.school"[^>]*>école Noésia<\/a>/)
    expect(html.indexOf('masterclass')).toBeLessThan(html.indexOf('noesia.school'))
  })

  it('the 4:5 portrait is the main photo (U6 slot 02)', () => {
    const img = html.match(/<img [^>]*formation-02[^>]*>/)?.[0] ?? ''
    expect(img).toContain('src="/photos/formation-02-900.webp"')
    expect(img).toContain('formation-02-540.webp 540w')
    expect(img).toContain('formation-02-1200.webp 1200w')
    expect(img).toContain('width="1200"')
    expect(img).toContain('height="1500"')
    expect(img).toContain('alt="Brice Gachadoat en pleine intervention, les deux mains ouvertes."')
    expect(html).not.toContain('accueil-meetup')
  })

  it('no frozen CRM founder line, no other employer or school name, no price, no em dash', () => {
    expect(html).not.toContain(FOUNDER_LINE)
    expect(html).not.toMatch(/IAPreneurs/i)
    expect(html).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)/i)
    expect(html).not.toContain('—')
  })
})

describe('#derriere counters', () => {
  it('formats thousands with a narrow no-break space', () => {
    expect(formatFigure(1400)).toBe('1\u202f400')
    expect(formatFigure(29)).toBe('29')
  })

  it('count from 0 to the target once the row is 60 % in view', async () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    let t = 0
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: (n: number) => void) => setTimeout(() => cb(++t * 100), 100) as unknown as number,
    )
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
    const { container } = render(<Derriere />)
    expect(container.textContent).toContain('1\u202f400+')
    const row = container.querySelector('.dr-stats') as Element
    expect(io.observers.map((o) => o.options?.threshold)).toContain(0.6)
    act(() => io.trigger(row, true))
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(container.textContent).not.toContain('1\u202f400+')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(container.textContent).toContain('1\u202f400+')
  })

  it('show the final figures under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Derriere />)
    expect(container.textContent).toContain('1\u202f400+')
    expect(container.querySelector('#derriere')?.getAttribute('data-reveal')).toBe('final')
  })
})
