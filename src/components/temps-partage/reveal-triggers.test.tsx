import { act, render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { ChaqueMois } from './chaque-mois'
import { Conditions } from './conditions'
import { Gardez } from './gardez'
import { Qui } from './qui'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

/** Puts every element `top` px from the viewport top (innerHeight is 768 in happy-dom). */
function placeAt(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 300,
    left: 0,
    right: 300,
    width: 300,
    height: 300,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

/** Renders a section well below the fold, motion on, IntersectionObserver under control. */
function mount(ui: ReactElement, id: string) {
  mockReducedMotion(false)
  const io = mockIntersectionObserver()
  placeAt(2000)
  const { container } = render(ui)
  const section = container.querySelector<HTMLElement>(`#${id}`)
  if (!section) throw new Error(`#${id} missing`)
  const watching = (el: Element) => io.observers.find((o) => o.elements.has(el))
  return { io, section, watching }
}

// AC-23 evaluation 2 #5 (US-99): these three sections observed the whole section at 0.2, so on a
// phone the #qui portrait (~310 px down a ~815 px section) uncovered ~150 px before it was on
// screen and the #gardez rules drew up to ~335 px before. The #premier-mois pattern: the hook
// watches the animated element itself, at 0.5 or more.
describe('#qui: the portrait starts its entrance, not the section', () => {
  it('stays armed while only the section scrolls in, plays when the portrait does', () => {
    const { io, section, watching } = mount(<Qui />, 'qui')
    const portrait = section.querySelector('.tpq-portrait')
    if (!portrait) throw new Error('portrait missing')
    // read before any trigger: the observer latches once and disconnects
    expect(Number(watching(portrait)?.options?.threshold)).toBeGreaterThanOrEqual(0.5)
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(section, true))
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(portrait, true))
    expect(section.dataset.reveal).toBe('in')
  })
})

describe('#conditions: the price list starts the gold rule under the price, not the band', () => {
  it('stays armed while only the band scrolls in, plays when half the list is on screen', () => {
    const { io, section, watching } = mount(<Conditions />, 'conditions')
    const list = section.querySelector('.tpk-list')
    if (!list) throw new Error('list missing')
    // the rule hangs under the price, the list's first line: half the list on screen shows it
    expect(list.firstElementChild?.classList.contains('is-mensuel')).toBe(true)
    expect(Number(watching(list)?.options?.threshold)).toBeGreaterThanOrEqual(0.5)
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(section, true))
    expect(section.dataset.reveal).toBe('armed')
    act(() => io.trigger(list, true))
    expect(section.dataset.reveal).toBe('in')
  })
})

describe('#gardez: each statement draws its own rule when it is on screen', () => {
  it('draws a rule only when its own statement scrolls in', () => {
    const { io, section, watching } = mount(<Gardez />, 'gardez')
    const items = [...section.querySelectorAll<HTMLElement>('.tpg-item')]
    expect(items).toHaveLength(3)
    for (const li of items)
      expect(Number(watching(li)?.options?.threshold)).toBeGreaterThanOrEqual(0.5)
    expect(items.map((li) => li.dataset.reveal)).toEqual(['armed', 'armed', 'armed'])
    act(() => io.trigger(section, true))
    expect(items.map((li) => li.dataset.reveal)).toEqual(['armed', 'armed', 'armed'])
    act(() => io.trigger(items[0], true))
    expect(items.map((li) => li.dataset.reveal)).toEqual(['in', 'armed', 'armed'])
  })
})

// AC-23 evaluation 2 #2 then #5: set as a ruled list under its title, the four rows of #chaque-mois
// sit ~160 px under the section top at 1440 and run ~330 px on a phone, so a section trigger played
// their rise under the fold; each row now rises when it is on screen.
describe('#chaque-mois: each row rises when it is on screen', () => {
  it('raises a row only when that row scrolls in', () => {
    const { io, section, watching } = mount(<ChaqueMois />, 'chaque-mois')
    const rows = [...section.querySelectorAll<HTMLElement>('.tpc-item')]
    expect(rows).toHaveLength(4)
    for (const li of rows)
      expect(Number(watching(li)?.options?.threshold)).toBeGreaterThanOrEqual(0.5)
    expect(rows.map((li) => li.dataset.reveal)).toEqual(['armed', 'armed', 'armed', 'armed'])
    act(() => io.trigger(section, true))
    expect(rows.map((li) => li.dataset.reveal)).toEqual(['armed', 'armed', 'armed', 'armed'])
    act(() => io.trigger(rows[2], true))
    expect(rows.map((li) => li.dataset.reveal)).toEqual(['armed', 'armed', 'in', 'armed'])
  })
})
