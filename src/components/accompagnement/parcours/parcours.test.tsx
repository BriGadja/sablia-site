import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { ACC_DATA } from '../hero/data'
import { AccompagnementModeProvider, useAccompagnementMode } from '../hero/mode'
import { AccompagnementParcours } from './index'

const norm = (n: string) => n.replace(/&#x27;/g, "'")
const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function Page() {
  const { setMode } = useAccompagnementMode()
  return (
    <>
      <button type="button" onClick={() => setMode(1)}>
        to-team
      </button>
      <AccompagnementParcours />
    </>
  )
}
const wrapped = () => (
  <AccompagnementModeProvider>
    <Page />
  </AccompagnementModeProvider>
)

describe('static HTML (SSR content rule)', () => {
  const out = norm(renderToString(wrapped()))

  it('is #parcours, carries the five steps and the tasks, and is the finished path', () => {
    expect(out).toContain('id="parcours"')
    for (const [when, title, what] of ACC_DATA[0].steps) {
      expect(out).toContain(when)
      expect(out).toContain(title)
      expect(out).toContain(what)
    }
    for (const [label] of ACC_DATA[0].tasks) expect(out).toContain(label)
    expect(out).toContain('3 tâches confiées à Claude · 1 que vous gardez')
    expect((out.match(/tl-step[^"]*? on"/g) ?? []).length).toBe(5)
  })

  it('keeps the selectors score.py reads', () => {
    expect(out).toContain('tl-dot')
    expect(out).toContain('tl-line')
    expect(out).toContain('tl-step')
  })
})

describe('the sequence', () => {
  const lit = (c: HTMLElement) => c.querySelectorAll('.tl-step.on').length
  const setup = () => {
    vi.useFakeTimers()
    const io = mockIntersectionObserver()
    mockReducedMotion(false)
    const r = render(wrapped())
    return { io, ...r }
  }

  it('blanks after hydration, plays once in view, and ends on the full path at 8.2 s', async () => {
    const { io, container } = setup()
    expect(lit(container)).toBe(0)
    const sec = container.querySelector('#parcours') as Element
    await act(async () => io.trigger(sec, true))
    await tick(700)
    expect(lit(container)).toBe(1)
    await tick(4500)
    expect(lit(container)).toBeGreaterThanOrEqual(3)
    await tick(3100)
    expect(lit(container)).toBe(5)
    expect(screen.getAllByText('Confiée').length).toBe(6) // inline + side panel, 3 delegated tasks each
    expect(container.querySelector('.tl-sum.on')).not.toBeNull()
  })

  it('turns « À confier » into « Confiée » one task at a time', async () => {
    const { io, container } = setup()
    await act(async () => io.trigger(container.querySelector('#parcours') as Element, true))
    await tick(5000)
    expect(screen.queryAllByText('Confiée').length).toBe(0)
    expect(screen.getAllByText('À confier').length).toBe(6)
    await tick(400)
    expect(screen.getAllByText('Confiée').length).toBe(2)
  })

  it('gives the last two steps their effect classes (CP4 12)', () => {
    const { container } = setup()
    const steps = [...container.querySelectorAll('.tl-step')]
    expect(steps[3]?.classList.contains('fx-ping')).toBe(true)
    expect(steps[4]?.classList.contains('fx-done')).toBe(true)
    expect(steps[4]?.querySelector('.tl-check')).not.toBeNull()
  })

  it('swaps to the team data and replays when the audience changes', async () => {
    const { io, container } = setup()
    await act(async () => io.trigger(container.querySelector('#parcours') as Element, true))
    await tick(9000)
    fireEvent.click(screen.getByText('to-team'))
    expect(screen.getByText('Le cadrage avec le responsable')).toBeTruthy()
    expect(
      screen.getAllByText("3 tâches confiées à Claude · 1 que l'équipe garde").length,
    ).toBeGreaterThan(0)
    await tick(10)
    expect(lit(container)).toBe(0)
    await tick(8500)
    expect(lit(container)).toBe(5)
  })
})

describe('reduced motion', () => {
  it('shows the finished path and never plays', async () => {
    vi.useFakeTimers()
    const io = mockIntersectionObserver()
    mockReducedMotion(true)
    const { container } = render(wrapped())
    await act(async () => io.trigger(container.querySelector('#parcours') as Element, true))
    await tick(100)
    expect(container.querySelectorAll('.tl-step.on').length).toBe(5)
    expect(container.querySelector('.tl-sum.on')).not.toBeNull()
  })
})
