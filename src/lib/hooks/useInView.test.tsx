import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver } from './test-utils'
import { useInView } from './useInView'

afterEach(() => vi.unstubAllGlobals())

function setup(opts?: Parameters<typeof useInView>[1]) {
  const io = mockIntersectionObserver()
  const el = document.createElement('div')
  const ref = { current: el }
  const hook = renderHook(() => useInView(ref, opts))
  return { io, el, ...hook }
}

describe('useInView', () => {
  it('follows intersection and passes the threshold', () => {
    const { io, el, result } = setup({ threshold: 0.35 })
    expect(result.current).toBe(false)
    expect(io.observers[0].options?.threshold).toBe(0.35)
    act(() => io.trigger(el, true))
    expect(result.current).toBe(true)
    act(() => io.trigger(el, false))
    expect(result.current).toBe(false)
  })

  it('once: stays true and disconnects', () => {
    const { io, el, result } = setup({ once: true })
    act(() => io.trigger(el, true))
    expect(result.current).toBe(true)
    expect(io.observers[0].disconnected).toBe(true)
    act(() => io.trigger(el, false))
    expect(result.current).toBe(true)
  })

  it('without IntersectionObserver reports visible', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const ref = { current: document.createElement('div') }
    const { result } = renderHook(() => useInView(ref))
    expect(result.current).toBe(true)
  })

  it('disconnects on unmount', () => {
    const { io, unmount } = setup()
    unmount()
    expect(io.observers[0].disconnected).toBe(true)
  })
})
