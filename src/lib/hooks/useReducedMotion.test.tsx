import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from './test-utils'
import { useReducedMotion } from './useReducedMotion'

afterEach(() => vi.unstubAllGlobals())

describe('useReducedMotion', () => {
  it('reads the media query and follows its change event', () => {
    const mq = mockReducedMotion(false)
    const { result, unmount } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => mq.set(true))
    expect(result.current).toBe(true)
    unmount()
    expect(mq.listenerCount()).toBe(0)
  })

  it('is false when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})
