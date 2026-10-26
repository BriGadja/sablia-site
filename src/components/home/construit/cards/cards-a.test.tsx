import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CARDS, FINAL_STAGE, IDLE_STAGE } from '../content'
import type { CardStage } from '../types'
import { CashbackCard } from './cashback'
import { HeleneCard } from './helene'
import { InstitutCard } from './institut'

const html = (C: (p: { stage: CardStage }) => React.ReactNode, stage: CardStage) =>
  render(<>{C({ stage })}</>).container

const FORBIDDEN = /cliente|IAPreneurs|—|wix\.com|€|\bprix\b/i

describe('Hélène card', () => {
  it('draws the week and the Thursday 20:30 mail, no headcount, no « cliente », no price', () => {
    const c = html(HeleneCard, FINAL_STAGE)
    expect(c.textContent).toContain('Jeudi 20:30')
    expect(c.textContent).toContain('Mails de suivi')
    expect(c.textContent).not.toMatch(FORBIDDEN)
    expect(c.textContent).not.toMatch(/\d+\s*(clients|patients)/i)
  })
  it('lights one row per detail step starting at step 2, the site pill at step 1', () => {
    const rows = (l: number) => html(HeleneCard, { plan: true, b: 2, l, f: 0 }).querySelectorAll('.bp-sr.on').length
    expect(rows(1)).toBe(0)
    expect(rows(3)).toBe(2)
    expect(rows(5)).toBe(4)
    expect(html(HeleneCard, { plan: true, b: 2, l: 1, f: 0 }).querySelector('.bp-ok.on')).not.toBeNull()
  })
  it('is empty-looking before the build starts', () => {
    const c = html(HeleneCard, IDLE_STAGE)
    expect(c.querySelectorAll('.on')).toHaveLength(0)
  })
})

describe('institute card', () => {
  it('stays sector-only: the beauty institute is never named', () => {
    const c = html(InstitutCard, FINAL_STAGE)
    expect(c.textContent).toContain('Son propre domaine')
    expect(c.textContent).not.toMatch(/beauty|green|camille/i)
  })
  it('swaps the address and locks at step 1, ticks at 2, goes online at 3', () => {
    const q = (l: number) => html(InstitutCard, { plan: true, b: 4, l, f: 0 })
    expect(q(0).querySelector('.bp-swap.on')).toBeNull()
    expect(q(1).querySelector('.bp-swap.on')).not.toBeNull()
    expect(q(1).querySelectorAll('.bp-tick.on')).toHaveLength(0)
    expect(q(2).querySelectorAll('.bp-tick.on')).toHaveLength(2)
    expect(q(2).querySelector('.bp-ok.on')).toBeNull()
    expect(q(3).querySelector('.bp-ok.on')).not.toBeNull()
  })
})

describe('cashback card', () => {
  it('renders the rate table and the alert, naming no client', () => {
    const c = html(CashbackCard, FINAL_STAGE)
    expect(c.textContent).toContain('Taux du jour')
    expect(c.textContent).toContain('Un concurrent est passé devant ce matin')
    expect(c.textContent).not.toMatch(/qwertys/i)
  })
  it('lets competitor A overtake (step 1) then swaps the two rows (step 2)', () => {
    const q = (l: number) => html(CashbackCard, { plan: true, b: 5, l, f: 0 })
    expect(q(0).textContent).toContain('4,4 %')
    expect(q(1).textContent).toContain('5,0 %')
    expect(q(1).querySelector('.bp-val.hot')).not.toBeNull()
    const moves = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('.bp-c.mv')].map((e) => e.style.transform)
    expect(moves(q(1))[0]).toBe('translateY(0px)')
    expect(moves(q(2))[0]).toBe('translateY(44px)')
    expect(moves(q(2))[1]).toBe('translateY(-44px)')
    expect(q(2).querySelector('.bp-alert.on')).toBeNull()
    expect(q(3).querySelector('.bp-alert.on')).not.toBeNull()
  })
  it('carries the recounted figure: 699 000+ relevés (units/d4-cashback.md)', () => {
    const cash = CARDS.find((c) => c.kind === 'cash')
    expect(cash?.fig).toEqual({ n: 699000, plus: true, unit: ' relevés' })
  })
})
