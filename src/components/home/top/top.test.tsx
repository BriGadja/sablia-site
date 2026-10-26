import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from '@/lib/hooks/test-utils'
import { CLAIM_LINES, FINAL_FRAME, START_FRAME, clock, derive, proofLine } from './content'
import { Top } from './index'

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
  it('takes price and delay from the OF-1 file', () => {
    expect(proofLine()).toEqual(['1 490 € HT', 'en place en 7 jours', "remboursé si ça ne tourne pas"])
  })

  it('formats the call clock', () => {
    expect(clock(358)).toBe('05:58')
    expect(clock(372)).toBe('06:12')
  })

  it('derives the start and final frames', () => {
    const a = derive(START_FRAME)
    expect(a.phoneIn).toBe(false)
    expect(a.rowsOn).toEqual([false, false, false])
    expect(a.relance).toBe(false)
    const z = derive(FINAL_FRAME)
    expect(z.rowsOn).toEqual([true, true, true])
    expect(z.relance).toBe(true)
    expect(z.next).toBe(true)
    expect(z.updText).toBe('Mis à jour · 14:02')
  })

  it('carries no em dash, no headcount and no banned name in the copy', () => {
    const all = [...CLAIM_LINES, ...proofLine()].join(' ')
    expect(all).not.toMatch(/—|IAPreneurs/)
  })
})

describe('Top', () => {
  it('server-renders the headline, the claim and the proof line', () => {
    mockReducedMotion(false)
    const { container } = render(<Top />)
    const section = container.querySelector('section#top.v2-top')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Appel terminé, CRM à jour.')
    expect(screen.queryByText("Compte rendu d'appel", { selector: 'h1' })).toBeNull()
    expect(section?.textContent).toContain('1 490 € HT')
    expect(section?.textContent).toContain('en place en 7 jours')
    expect(section?.querySelector('button[data-cta-book]')?.textContent).toContain('Réserver 30 min')
  })

  it('under reduced motion shows the final frame and no pause button', () => {
    mockReducedMotion(true)
    const { container } = render(<Top />)
    expect(container.textContent).toContain('Relance · Jeu. 09:00')
    expect(container.textContent).toContain('Compte rendu écrit, relance créée')
    expect(screen.queryByRole('button', { name: /pause/i })).toBeNull()
  })

  it('plays the loop on the timer clock and loops back to the start', async () => {
    mockReducedMotion(false)
    const { container } = render(<Top />)
    await tick(0)
    expect(container.querySelector('.hs-phone.in')).toBeNull()
    await tick(600)
    expect(container.querySelector('.hs-phone.in')).not.toBeNull()
    expect(container.textContent).toContain('Appel en cours')
    await tick(14 * 140 + 600)
    expect(container.textContent).toContain('Appel terminé')
    await tick(3300)
    expect(container.textContent).toContain('Relance · Jeu. 09:00')
    await tick(4500)
    expect(container.querySelector('.hs-stage.fade')).not.toBeNull()
  })

  it('pauses on the button, parks on the final frame and resumes from the start', async () => {
    mockReducedMotion(false)
    const { container } = render(<Top />)
    await tick(700)
    const btn = screen.getByRole('button', { name: "Mettre l'animation en pause" })
    fireEvent.click(btn)
    expect(container.textContent).toContain('Relance · Jeu. 09:00')
    expect(screen.getByRole('button', { name: "Reprendre l'animation" })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: "Reprendre l'animation" }))
    await tick(0)
    expect(container.textContent).not.toContain('Relance · Jeu. 09:00')
  })
})
