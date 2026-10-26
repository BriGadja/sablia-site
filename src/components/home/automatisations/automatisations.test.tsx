import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { Automatisations } from './index'
import { BULLETINS, FACTURE, FICHE, JOBS, LEADS, SEANCE_ROWS } from './content'

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('static HTML (SSR content rule)', () => {
  const html = renderToString(<Automatisations />)

  it('is the #automatisations section with the scoped class', () => {
    expect(html).toContain('id="automatisations"')
    expect(html).toContain('v2-automatisations')
  })

  it('carries every job label, request and output as readable text', () => {
    for (const job of JOBS) {
      expect(html).toContain(job.label)
      expect(html).toContain(job.request.replace(/’/g, '’'))
      for (const o of job.outputs) expect(html).toContain(o.title.replace(/’/g, '’'))
    }
  })

  it('carries the text of the four bespoke scenes', () => {
    for (const l of LEADS) expect(html).toContain(l.name)
    for (const b of BULLETINS) expect(html.replace(/&#x27;/g, "'")).toContain(b)
    for (const [, v] of FICHE) expect(html.replace(/&#x27;/g, "'")).toContain(v)
    for (const [k] of FACTURE) expect(html.replace(/&#x27;/g, "'")).toContain(k)
    for (const [, v] of SEANCE_ROWS) expect(html).toContain(v)
  })

  it('server-renders job 0 in its final state (nothing waits for an effect)', () => {
    expect(html).toContain('fl-card on')
    expect(html).toContain('Prêt · à valider')
    expect(html).toContain(JOBS[0].request)
  })

  it('has no em dash, no company name, no IAPreneurs', () => {
    expect(html).not.toContain('—')
    expect(html).not.toMatch(/IAPreneurs/i)
  })
})

describe('loop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockReducedMotion(false)
  })

  function start() {
    const io = mockIntersectionObserver()
    const view = render(<Automatisations />)
    const stage = view.container.querySelector('.auto-stage') as Element
    act(() => io.trigger(stage, true))
    return { io, stage, ...view }
  }

  it('types the request at 26 ms a character, then shows the three outputs', async () => {
    const { container } = start()
    await tick(0)
    expect(container.querySelector('.fl-msg')?.textContent).toBe(JOBS[0].request.slice(0, 1))
    await tick(26 * 10 + 5)
    expect(container.querySelector('.fl-msg')?.textContent).toBe(JOBS[0].request.slice(0, 11))
    await tick(26 * JOBS[0].request.length)
    await tick(350 + 700 + 3 * 800 + 3 * 420 + 50)
    expect(container.querySelectorAll('.fl-card.on')).toHaveLength(3)
  })

  it('holds 4 s, swaps for 320 ms, then plays the lead scene', async () => {
    const { container } = start()
    await tick(26 * JOBS[0].request.length + 350 + 700 + 2400 + 1260 + 4000 + 100)
    expect(container.querySelector('.fl-ico.swap')).not.toBeNull()
    await tick(400)
    expect(container.querySelector('.ld')).not.toBeNull()
  })

  it('a chip starts that job from the top', async () => {
    const { container } = start()
    await tick(100)
    fireEvent.click(screen.getByRole('button', { name: /Une veille/ }))
    await tick(3000)
    expect(container.querySelector('.vl')).not.toBeNull()
    expect(screen.getByRole('button', { name: /Une veille/ }).getAttribute('aria-pressed')).toBe('true')
  })

  it('Pause freezes on the finished picture and Reprendre restarts', async () => {
    const { container } = start()
    await tick(500)
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    await tick(10)
    expect(container.querySelectorAll('.fl-card.on')).toHaveLength(3)
    await tick(10000)
    expect(container.querySelector('.fl-card.on')).not.toBeNull()
    expect(container.querySelector('.ld')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Reprendre' }))
    await tick(100)
    expect(container.querySelector('.fl-msg')?.textContent?.length).toBeLessThan(10)
  })

  it('leaving the viewport cancels the run', async () => {
    const { container, io, stage } = start()
    await tick(500)
    act(() => io.trigger(stage, false))
    const typed = container.querySelector('.fl-msg')?.textContent
    await tick(5000)
    expect(container.querySelector('.fl-msg')?.textContent).toBe(typed)
  })
})

describe('reduced motion', () => {
  it('stays on the finished picture and never types', async () => {
    vi.useFakeTimers()
    mockReducedMotion(true)
    const io = mockIntersectionObserver()
    const { container } = render(<Automatisations />)
    act(() => io.trigger(container.querySelector('.auto-stage') as Element, true))
    await tick(10000)
    expect(container.querySelectorAll('.fl-card.on')).toHaveLength(3)
    expect(container.querySelector('.fl-msg')?.textContent).toBe(JOBS[0].request)
  })

  it('a chip shows that job finished', async () => {
    vi.useFakeTimers()
    mockReducedMotion(true)
    const { container } = render(<Automatisations />)
    fireEvent.click(screen.getByRole('button', { name: /Une séance/ }))
    await tick(10)
    expect(container.querySelector('.se-player')).not.toBeNull()
    expect(container.textContent).toContain('Relu par vous')
  })
})
