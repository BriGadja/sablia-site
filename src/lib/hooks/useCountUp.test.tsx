import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from './test-utils'
import { useCountUp } from './useCountUp'

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date', 'performance'],
  })
  mockReducedMotion(false)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})
const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

describe('useCountUp', () => {
  it('renders the final value until activated (SSR content)', () => {
    const { result } = renderHook(() => useCountUp(1400, { active: false }))
    expect(result.current).toBe(1400)
  })

  it('eases 0 to target over 1400 ms (ease-out cubic) when active', async () => {
    const { result } = renderHook(() => useCountUp(1000, { active: true }))
    await tick(16)
    expect(result.current).toBeLessThan(100)
    await tick(684) // ~700 ms: 1-(1-.5)^3 = .875
    expect(result.current).toBeGreaterThan(800)
    expect(result.current).toBeLessThan(950)
    await tick(800)
    expect(result.current).toBe(1000)
  })

  it('reduced motion: final value immediately', async () => {
    mockReducedMotion(true)
    const { result } = renderHook(() => useCountUp(68, { active: true }))
    await tick(50)
    expect(result.current).toBe(68)
  })

  it('plays once: leaving view does not reset', async () => {
    const { result, rerender } = renderHook(({ a }) => useCountUp(30, { active: a }), {
      initialProps: { a: true },
    })
    await tick(2000)
    rerender({ a: false })
    await tick(100)
    expect(result.current).toBe(30)
  })

  it('cancels the frame on unmount', async () => {
    const { unmount } = renderHook(() => useCountUp(30, { active: true }))
    await tick(16)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
