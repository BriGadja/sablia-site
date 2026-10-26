import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMeasure } from './useMeasure'

afterEach(() => vi.unstubAllGlobals())

describe('useMeasure', () => {
  it('measures on mount, on window resize and on element resize; disconnects on unmount', () => {
    let roCb: () => void = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: () => void) {
          roCb = cb
        }
        observe() {}
        disconnect = disconnect
      },
    )
    const el = document.createElement('div')
    let n = 0
    const fn = vi.fn(() => ++n)
    const ref = { current: el }
    const { result, unmount } = renderHook(() => useMeasure(ref, fn))
    expect(result.current).toBe(1)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(2)
    act(() => roCb())
    expect(result.current).toBe(3)
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('returns null before the ref is set', () => {
    const ref = { current: null }
    const { result } = renderHook(() => useMeasure(ref, () => 1))
    expect(result.current).toBeNull()
  })
})
