import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FINAL_STAGE, IDLE_STAGE } from '../content'
import type { CardStage } from '../types'
import { MaintenanceCard } from './maintenance'
import { NoesiaCard } from './noesia'
import { SeminaireCard } from './seminaire'
import { VoixCard } from './voix'

const stage = (over: Partial<CardStage>): CardStage => ({ ...IDLE_STAGE, ...over })
const on = (c: HTMLElement, sel: string) => c.querySelectorAll(`${sel}.on`).length

describe('MaintenanceCard', () => {
  it('draws two panels, three mails and three rows, nothing lit while idle', () => {
    const { container } = render(<MaintenanceCard stage={IDLE_STAGE} />)
    expect(container.querySelectorAll('.bp-p')).toHaveLength(2)
    expect(container.querySelectorAll('.bp-mr')).toHaveLength(3)
    expect(container.querySelectorAll('.bp-tr:not(.hd)')).toHaveLength(3)
    expect(on(container, '.bp-tick')).toBe(0)
    expect(on(container, '.bp-ok')).toBe(0)
  })
  it('lights rows and ticks step by step, then the closing pill at step 7', () => {
    const { container } = render(<MaintenanceCard stage={stage({ plan: true, b: 2, l: 4 })} />)
    expect(container.querySelectorAll('.bp-tr.in')).toHaveLength(2)
    expect(on(container, '.bp-tick')).toBe(6)
    expect(on(container, '.bp-ok')).toBe(0)
    const done = render(<MaintenanceCard stage={FINAL_STAGE} />)
    expect(on(done.container, '.bp-ok')).toBe(1)
    expect(done.container.textContent).toContain('Aucune ressaisie')
  })
})

describe('NoesiaCard', () => {
  it('has 29 video tiles and 8 weeks with 4 workshops lit at the end', () => {
    const { container } = render(<NoesiaCard stage={FINAL_STAGE} />)
    expect(container.querySelectorAll('.bp-tile.in')).toHaveLength(29)
    expect(container.querySelectorAll('.bp-wk')).toHaveLength(8)
    expect(container.querySelectorAll('.bp-wk b.on')).toHaveLength(4)
    expect(container.textContent).toContain('Module Claude Code')
  })
  it('shows no tile before the second panel', () => {
    const { container } = render(<NoesiaCard stage={stage({ plan: true, b: 1 })} />)
    expect(container.querySelectorAll('.bp-tile.in')).toHaveLength(0)
  })
})

describe('SeminaireCard', () => {
  it('draws a grid of seats that is not a headcount (never 23) and fills them at step 2', () => {
    const { container } = render(<SeminaireCard stage={FINAL_STAGE} />)
    const seats = container.querySelectorAll('.bp-seat')
    expect(seats.length).toBeGreaterThan(0)
    expect(seats.length).not.toBe(23)
    expect(on(container, '.bp-seat')).toBe(seats.length)
    expect(on(container, '.bp-screen')).toBe(1)
  })
  it('names no client and no number of people', () => {
    const { container } = render(<SeminaireCard stage={FINAL_STAGE} />)
    expect(container.textContent).not.toMatch(/Madeca|\d+ (personnes|participants)/i)
  })
})

describe('VoixCard', () => {
  it('waves while calls come in, then holds the three booked slots', () => {
    const mid = render(<VoixCard stage={stage({ plan: true, b: 2, l: 3 })} />)
    expect(mid.container.querySelectorAll('.bar')).toHaveLength(18)
    const end = render(<VoixCard stage={FINAL_STAGE} />)
    expect(end.container.querySelectorAll('.bar')).toHaveLength(0)
    expect(end.container.querySelectorAll('.bp-ag.on')).toHaveLength(3)
    expect(end.container.querySelectorAll('.bp-quote:not(.gone)')).toHaveLength(1)
    expect(end.container.querySelectorAll('.bp-quote.on')).toHaveLength(1)
  })
  it('carries no price and no em dash', () => {
    const { container } = render(<VoixCard stage={FINAL_STAGE} />)
    expect(container.textContent).not.toMatch(/€|—/)
  })
})

describe('all four cards', () => {
  it('carry no em dash, no IAPreneurs and no client name', () => {
    for (const C of [MaintenanceCard, NoesiaCard, SeminaireCard, VoixCard]) {
      const { container } = render(<C stage={FINAL_STAGE} />)
      expect(container.textContent).not.toMatch(/—|IAPreneurs|Qwertys|Madeca|Pluriel|MASSA/)
    }
  })
})
