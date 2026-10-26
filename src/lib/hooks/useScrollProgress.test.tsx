import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from './test-utils'
import { useScrollProgress } from './useScrollProgress'

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] })
  mockReducedMotion(false)
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function boxes(top: number, h: number) {
  const target = document.createElement('div')
  const reference = document.createElement('div')
  target.getBoundingClientRect = () => ({ top }) as DOMRect
  Object.defineProperty(reference, 'offsetHeight', { value: h })
  return { target: { current: target }, reference: { current: reference } }
}
const flush = () =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(20)
  })

describe('useScrollProgress', () => {
  it('p = clamp(1 - top/h), rounded to .01, updated on scroll (rAF-throttled)', async () => {
    let top = 800
    const refs = boxes(0, 800)
    refs.target.current.getBoundingClientRect = () => ({ top }) as DOMRect
    const { result } = renderHook(() => useScrollProgress(refs))
    await flush()
    expect(result.current).toBe(0)
    top = 400
    act(() => {
      document.dispatchEvent(new Event('scroll'))
      document.dispatchEvent(new Event('scroll'))
    })
    await flush()
    expect(result.current).toBe(0.5)
    top = -50
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    await flush()
    expect(result.current).toBe(1)
  })

  it('reduced motion: always 0', async () => {
    mockReducedMotion(true)
    const { result } = renderHook(() => useScrollProgress(boxes(100, 800)))
    await flush()
    expect(result.current).toBe(0)
  })

  it('enabled:false: 0 and no listeners', async () => {
    const add = vi.spyOn(document, 'addEventListener')
    const { result } = renderHook(() => useScrollProgress({ ...boxes(100, 800), enabled: false }))
    await flush()
    expect(result.current).toBe(0)
    expect(add.mock.calls.filter(([t]) => t === 'scroll')).toHaveLength(0)
  })

  it('removes listeners on unmount', async () => {
    const remove = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useScrollProgress(boxes(100, 800)))
    unmount()
    expect(remove.mock.calls.some(([t]) => t === 'scroll')).toBe(true)
  })
})
