import { readFileSync } from 'node:fs'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { choose, derive, initialCfg, LEVELS, PROFILES, SECTORS, USES } from './content'
import { Configurator } from './index'

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('static HTML (SSR content rule)', () => {
  const html = renderToString(<Configurator />).replace(/&#x27;/g, "'")

  it('is the #top section with the scoped class', () => {
    expect(html).toContain('id="top"')
    expect(html).toContain('v2-formations-top')
  })

  it('carries every chip and a settled programme as readable text', () => {
    for (const o of [...SECTORS, ...USES, ...LEVELS]) expect(html).toContain(o.t)
    expect(html).toContain('Votre programme')
    expect(html).toContain('Conseil · Débutant')
    expect(html).toContain('Premiers pas : bien demander à Claude')
  })

  it('uses one level vocabulary, no price, no em dash, no IAPreneurs', () => {
    expect(LEVELS.map((l) => l.t)).toEqual(['Débutant', "À l'aise", 'Avancé'])
    expect(html).not.toContain('—')
    expect(html).not.toMatch(/IAPreneurs|€/i)
  })
})

describe('programme logic', () => {
  it('rolls only the rows a change touches', () => {
    const c = choose(initialCfg(), 'u', 2)
    expect(c.rv).toEqual([0, 1, 1, 0, 0])
    expect(derive(c).rows[1].flip).toBe('sa')
    expect(derive(choose(c, 'u', 0)).rows[1].flip).toBe('sb')
    expect(derive(c).rows[0].flip).toBe('')
  })

  it("cycles a profile that includes Industrie et BTP / Mails et comptes rendus / À l'aise", () => {
    expect(PROFILES).toHaveLength(3)
    expect(PROFILES).toContainEqual({ s: 1, u: 0, l: 1 })
  })
})

describe('auto-demo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion(false)
  })

  function start() {
    const io = mockIntersectionObserver()
    const view = render(<Configurator />)
    act(() => io.trigger(view.container.querySelector('.cfg') as Element, true))
    return view
  }

  it('first change ~1.5 s after entering view, then a 7 s hold', async () => {
    start()
    await tick(1400)
    expect(screen.getByText('Conseil · Débutant')).toBeTruthy()
    await tick(200)
    expect(screen.getByText(/^Industrie et BTP · Débutant$/)).toBeTruthy()
    await tick(1800)
    expect(screen.getByText("Industrie et BTP · À l'aise")).toBeTruthy()
    await tick(6000)
    expect(screen.getByText("Industrie et BTP · À l'aise")).toBeTruthy()
    await tick(1200)
    expect(document.querySelector('.pg-sum')?.textContent).toMatch(/^Commerce/)
  })

  it('cycles Conseil, BTP, Commerce, Conseil with no Numérique profile (CP4 4)', async () => {
    start()
    const seen = new Set<string>()
    for (let t = 0; t < 24000; t += 100) {
      await tick(100)
      seen.add(document.querySelector('.pg-sum')?.textContent ?? '')
    }
    expect([...seen].some((x) => /^Industrie et BTP · À l'aise$/.test(x))).toBe(true)
    expect([...seen].some((x) => /^Commerce/.test(x))).toBe(true)
    expect([...seen].some((x) => /^Numérique/.test(x))).toBe(false)
    expect(document.querySelector('.pg-sum')?.textContent).toBe('Conseil · Débutant')
    expect(document.body.textContent).not.toContain('Claude Code dans vos dépôts')
  })

  it("announces to screen readers only the visitor's own picks", () => {
    start()
    const pg = () => document.querySelector('.pg')?.getAttribute('aria-live')
    expect(pg()).toBe('off')
    fireEvent.click(screen.getByRole('button', { name: 'Services' }))
    expect(pg()).toBe('polite')
  })

  it('Pause stops it and the label flips to Démonstration', async () => {
    start()
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    await tick(20000)
    expect(screen.getByText('Conseil · Débutant')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Démonstration' })).toBeTruthy()
  })

  it('hover on the programme pauses it, leaving resumes it', async () => {
    start()
    const pg = document.querySelector('.pg') as HTMLElement
    fireEvent.mouseEnter(pg.parentElement as HTMLElement)
    await tick(20000)
    expect(screen.getByText('Conseil · Débutant')).toBeTruthy()
    fireEvent.mouseLeave(pg.parentElement as HTMLElement)
    await tick(1700)
    expect(screen.queryByText('Conseil · Débutant')).toBeNull()
  })

  it('picking a chip stops the demo', async () => {
    start()
    fireEvent.click(screen.getByRole('button', { name: 'Services' }))
    await tick(20000)
    expect(screen.getByText('Services · Débutant')).toBeTruthy()
  })
})

describe('reduced motion', () => {
  it('shows the settled programme, never runs, and has no pause button', async () => {
    vi.useFakeTimers()
    mockReducedMotion(true)
    const io = mockIntersectionObserver()
    const view = render(<Configurator />)
    act(() => io.trigger(view.container.querySelector('.cfg') as Element, true))
    await tick(20000)
    expect(screen.getByText('Conseil · Débutant')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Pause' })).toBeNull()
  })
})

describe('phone programme summary', () => {
  it('stays at 12 px or more, never wraps or truncates (CP4 5)', () => {
    const css = readFileSync(`${__dirname}/configurator.css`, 'utf8')
    const phone = css.slice(css.indexOf('/* CP4 5'))
    const rule = phone.slice(phone.indexOf('.pg-sum'), phone.indexOf('}', phone.indexOf('.pg-sum')))
    expect(Number(/font-size:\s*([\d.]+)px/.exec(rule)?.[1])).toBeGreaterThanOrEqual(12)
    const base = css.slice(css.indexOf('.pg-head'), css.indexOf('.pg-ex {'))
    expect(base).toMatch(/white-space:\s*nowrap/)
  })
})
