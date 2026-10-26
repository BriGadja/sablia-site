import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { CARDS, FINAL_STAGE, IDLE_STAGE, figureText, fmt } from './content'
import { Construit } from './index'
import { lit, panel } from './types'

vi.mock('./cards/helene', () => ({
  HeleneCard: ({ stage }: { stage: import('./types').CardStage }) => (
    <div data-testid="helene" className={panel(stage, 1)} data-l={lit(stage, 5)} data-plan={String(stage.plan)} />
  ),
}))

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

describe('content', () => {
  it('lists the seven wall cards in the decided order, Pluriel off the wall, voice last', () => {
    expect(CARDS.map((c) => c.kind)).toEqual([
      'helene',
      'site',
      'cash',
      'maint',
      'noesia',
      'seminar',
      'voice',
    ])
    expect(CARDS[CARDS.length - 1].muted).toBe(true)
  })

  it('carries the recounted cashback figure and the voice figure', () => {
    const cash = CARDS.find((c) => c.kind === 'cash')
    expect(figureText(cash!, FINAL_STAGE.f)).toBe('699 000+ relevés')
    const voice = CARDS.find((c) => c.kind === 'voice')
    expect(figureText(voice!, 1)).toBe('68 rendez-vous pris en cinq mois')
    expect(fmt(0)).toBe('0')
  })

  it('counts up with ease-out and only adds the plus at the end', () => {
    const cash = CARDS.find((c) => c.kind === 'cash')!
    expect(figureText(cash, 0)).toBe('0 relevés')
    expect(figureText(cash, 0.5).endsWith('+ relevés')).toBe(false)
  })

  it('has no em dash, no IAPreneurs and no client name in the visitor copy', () => {
    const all = CARDS.map((c) => `${c.tags} ${c.sector} ${c.text}`).join(' ')
    expect(all).not.toMatch(/—|IAPreneurs|Qwertys|Pluriel|MASSA|cliente/)
  })

  it('exposes an idle and a final stage', () => {
    expect(IDLE_STAGE).toEqual({ plan: false, b: 0, l: 0, f: 0 })
    expect(FINAL_STAGE).toEqual({ plan: true, b: 9, l: 9, f: 1 })
  })
})

describe('Construit', () => {
  it('server-renders the title, the seven rows and the final figures', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const section = container.querySelector('section#construit.v2-construit')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Exemples de réalisations.')
    expect(screen.getByText('Plus de 20 clients accompagnés depuis 2025.')).toBeTruthy()
    expect(section?.querySelectorAll('ol[aria-label="Toutes les réalisations"] li').length).toBe(7)
    expect(section?.querySelectorAll('article.deck-card').length).toBe(7)
    expect(section?.textContent).toContain('699 000+ relevés')
    expect(section?.textContent).toContain('68 rendez-vous pris en cinq mois')
    expect(section?.textContent).not.toMatch(/—/)
  })

  it('shows only the first card to assistive tech and marks its row current', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const cards = container.querySelectorAll('article.deck-card')
    expect(cards[0].getAttribute('aria-hidden')).toBe('false')
    expect(cards[1].getAttribute('aria-hidden')).toBe('true')
    const rows = container.querySelectorAll('button.caserow')
    expect(rows[0].getAttribute('aria-current')).toBe('true')
    expect(rows[1].getAttribute('aria-current')).toBeNull()
  })

  it('jumps to a card when its row is clicked', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const rows = container.querySelectorAll('button.caserow')
    fireEvent.click(rows[2])
    const cards = container.querySelectorAll('article.deck-card')
    expect(cards[2].getAttribute('aria-hidden')).toBe('false')
    expect(cards[0].getAttribute('aria-hidden')).toBe('true')
    expect(rows[2].getAttribute('aria-current')).toBe('true')
  })

  it('advances to the next card when the progress bar ends, and wraps to the first', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const rows = () => container.querySelectorAll('button.caserow')
    fireEvent.click(rows()[6])
    const grow = container.querySelector('.grow') as HTMLElement
    fireEvent.animationEnd(grow)
    expect(rows()[0].getAttribute('aria-current')).toBe('true')
  })

  it('pauses the bar with the button and says so', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    const section = container.querySelector('section') as HTMLElement
    act(() => io.trigger(section, true))
    const grow = () => container.querySelector('.grow') as HTMLElement
    expect(grow().style.animationPlayState).toBe('running')
    const btn = screen.getByRole('button', { name: /Mettre en pause/ })
    expect(btn.getAttribute('aria-pressed')).toBeNull()
    fireEvent.click(btn)
    expect(grow().style.animationPlayState).toBe('paused')
    expect(screen.getByRole('button', { name: /Reprendre le défilement/ })).toBeTruthy()
  })

  it('plays the first card when scrolled into view: plan, panels, then lines', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    const section = container.querySelector('section') as HTMLElement
    act(() => io.trigger(section, true))
    const first = () => container.querySelectorAll('article.deck-card')[0]
    const d = () => first().querySelector('[data-testid="helene"]') as HTMLElement
    expect(d().dataset.plan).toBe('true')
    expect(d().className).not.toContain('on')
    await tick(510)
    await tick(260 * 2 + 10)
    expect(d().className).toContain('on')
    expect(d().dataset.l).toBe('')
    await tick(450 + 550 * 5 + 10)
    expect(d().dataset.l).toBe('on')
  })

  it('under reduced motion nothing advances on its own and the bar is not animated', () => {
    mockReducedMotion(true)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    act(() => io.trigger(container.querySelector('section') as HTMLElement, true))
    const d = container.querySelector('[data-testid="helene"]') as HTMLElement
    expect(d.dataset.l).toBe('on')
    expect(d.className).toContain('on')
  })
})

describe('card footers', () => {
  it('links the Noésia card to noesia.school as a real anchor', () => {
    mockIntersectionObserver()
    const { container } = render(<Construit />)
    const link = container.querySelector('a[href="https://noesia.school"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('rel')).toBe('noopener')
    expect(link?.closest('article')?.textContent).toContain('École Noésia')
  })

  it('names no client company and no headcount on the séminaire card', () => {
    const seminar = CARDS.find((c) => c.kind === 'seminar')!
    expect(`${seminar.sector} ${seminar.text}`).not.toMatch(/Madeca|\d+\s*(personnes|participants|collaborateurs)/i)
  })
})

describe('touch target', () => {
  it('the noesia.school link carries cn-link, rel kept, with a 44 px hit area', () => {
    const { container } = render(<Construit />)
    const a = container.querySelector('a[href="https://noesia.school"]') as HTMLAnchorElement
    expect(a.className).toContain('cn-link')
    expect(a.getAttribute('rel')).toBe('noopener')
    const css = readFileSync(join(__dirname, 'construit.css'), 'utf8')
    expect(css.match(/\.cn-link \{([^}]*)\}/)?.[1] ?? '').toMatch(/padding-block:\s*12px/)
  })
})
