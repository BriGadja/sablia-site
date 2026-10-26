import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from '@/lib/hooks/test-utils'
import { CALLERS, CLAIM_LINES, clock, derive, FINAL_FRAME, proofLine, START_FRAME } from './content'
import { Top } from './index'

type IoCb = (entries: Array<{ isIntersecting: boolean }>) => void
let ioCb: IoCb | null = null
const setInView = (v: boolean) =>
  act(() => {
    ioCb?.([{ isIntersecting: v }])
  })

beforeEach(() => {
  vi.useFakeTimers()
  ioCb = null
  // The hero loop runs only while the hero is in view; the stub starts in view and lets a test flip it.
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IoCb) {
        ioCb = cb
        queueMicrotask(() => cb([{ isIntersecting: true }]))
      }
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  )
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

/** The call is announced 6.82 s into a lap (0.5 s + 15 clock ticks + the staged steps). */
const NEXT_AT = 500 + 15 * 140 + 380 + 550 + 450 + 900 + 3 * 380 + 800

/** Advances in 100 ms steps so React renders between timers (one big act batches them all). */
const steps = async (ms: number) => {
  for (let t = 0; t < ms; t += 100) await tick(100)
}

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

describe('content', () => {
  it('takes price and delay from the OF-1 file', () => {
    expect(proofLine()).toEqual([
      '1 490 € HT',
      'en place en 7 jours',
      'remboursé si ça ne tourne pas',
    ])
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

  it('alternates the caller and the next-call card names the other one', () => {
    const a = derive({ ...FINAL_FRAME, lap: 0 })
    expect(a.who.name).toBe('Paul Lemoine')
    expect(a.nextName).toBe('Catherine Durand')
    const b = derive({ ...FINAL_FRAME, lap: 1 })
    expect(b.who.name).toBe('Catherine Durand')
    expect(b.who.sub).toBe('Atelier Durand')
    expect(b.nextName).toBe('Paul Lemoine')
    expect(b.who.rows.map(([, v]) => v)).toContain('La gérante et son comptable')
  })

  it('carries no em dash, no headcount and no banned name in the copy', () => {
    const all = [
      ...CLAIM_LINES,
      ...proofLine(),
      ...CALLERS.flatMap((x) => [x.relance, ...x.rows.flat()]),
    ].join(' ')
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
    expect(section?.querySelector('button[data-cta-book]')?.textContent).toContain(
      'Réserver 30 min',
    )
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

  it('lap 1 is Paul Lemoine announcing Catherine Durand, lap 2 is Catherine Durand announcing Paul', async () => {
    mockReducedMotion(false)
    const { container } = render(<Top />)
    await steps(NEXT_AT + 100)
    expect(container.querySelector('.hs-nm')?.textContent).toBe('Catherine Durand')
    expect(container.querySelector('.hs-who b')?.textContent).toBe('Paul Lemoine')
    // 4 s hold, 450 ms fade, 600 ms gap, then lap 2 starts
    await steps(4000 + 450 + 600 + 600 - 100)
    expect(container.querySelector('.hs-who b')?.textContent).toBe('Catherine Durand')
    expect(container.querySelector('.hs-phone b')?.textContent).toBe('Catherine Durand')
    await steps(NEXT_AT)
    expect(container.querySelector('.hs-nm')?.textContent).toBe('Paul Lemoine')
  })

  it('does not run while the hero is out of view, and starts when it comes back', async () => {
    mockReducedMotion(false)
    const { container } = render(<Top />)
    await tick(0)
    await setInView(false)
    await tick(3000)
    expect(container.querySelector('.hs-phone.in')).toBeNull()
    await setInView(true)
    await tick(700)
    expect(container.querySelector('.hs-phone.in')).not.toBeNull()
    await setInView(false)
    await tick(0)
    const before = container.innerHTML
    await tick(5000)
    expect(container.innerHTML).toBe(before)
  })
})
