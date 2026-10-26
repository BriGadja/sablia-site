import { describe, expect, it } from 'vitest'
import { applyAt, TL_FINAL, TL_START, timeline, tlHeight } from './timeline'

describe('timeline (the mockup playTl chain)', () => {
  it('shows the summary at 8.0 s on desktop, 8.6 s on phones, and lights the last step 200 ms later', () => {
    const d = timeline(false)
    const p = timeline(true)
    expect(d).toContainEqual([8000, { sum: true }])
    expect(p).toContainEqual([8600, { sum: true }])
    expect(d[d.length - 1]).toEqual([8200, { tl: 5 }])
    expect(applyAt(d, 8200)).toEqual({ ...TL_FINAL, tags: 4 })
  })

  it('reaches the five steps in order and lights step n 500 ms after the rail reaches it', () => {
    const d = timeline(false)
    expect(applyAt(d, 150).tlTo).toBe(0)
    expect(applyAt(d, 649).tl).toBe(0)
    expect(applyAt(d, 650).tl).toBe(1)
    expect(applyAt(d, 7700).tlTo).toBe(4)
    expect(applyAt(d, 8200).tl).toBe(5)
  })

  it('lands the task tags one by one, then confirms the three delegated ones', () => {
    const d = timeline(false)
    expect([1100, 1900, 2700, 4100].map((t) => applyAt(d, t).tags)).toEqual([1, 2, 3, 4])
    expect([5300, 5900, 6500].map((t) => applyAt(d, t).conf)).toEqual([1, 2, 3])
  })

  it('runs the rail down the tasks panel on phones only', () => {
    expect(timeline(false).some(([, p]) => 'rail' in p)).toBe(false)
    const p = timeline(true)
    expect([1200, 2000, 2800, 4200].map((t) => applyAt(p, t).rail)).toEqual([0, 1, 2, 3])
  })

  it('starts blank and the final state is everything on', () => {
    expect(TL_START).toEqual({ tl: 0, tlTo: -1, tags: 0, conf: 0, sum: false, rail: -1 })
    expect(TL_FINAL).toEqual({ tl: 5, tlTo: 4, tags: 4, conf: 3, sum: true, rail: -1 })
  })
})

describe('tlHeight (the rail fill)', () => {
  const dotY = [11, 120, 230, 340, 450]
  it('follows the dot of the step being reached, minus 8 px', () => {
    expect(tlHeight({ ...TL_START, tlTo: 2 }, dotY, [])).toBe(222)
  })
  it('is 0 before anything is reached or before the dots are measured', () => {
    expect(tlHeight(TL_START, dotY, [])).toBe(0)
    expect(tlHeight({ ...TL_START, tlTo: 1 }, [], [])).toBe(0)
  })
  it('on phones, while step 2 is reached, follows the tasks row the rail is on', () => {
    expect(tlHeight({ ...TL_START, tlTo: 1, rail: 2 }, dotY, [150, 200, 250, 300])).toBe(242)
  })
})
