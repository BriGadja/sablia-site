import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePausable } from './usePausable'

afterEach(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
})

describe('usePausable', () => {
  it('toggle pauses and resumes', () => {
    const { result } = renderHook(() => usePausable())
    expect(result.current.paused).toBe(false)
    act(() => result.current.toggle())
    expect(result.current.paused).toBe(true)
    expect(result.current.userPaused).toBe(true)
    act(() => result.current.toggle())
    expect(result.current.paused).toBe(false)
  })

  it('hover and focus pause without touching userPaused', () => {
    const { result } = renderHook(() => usePausable())
    act(() => result.current.bind.onMouseEnter())
    expect(result.current.paused).toBe(true)
    expect(result.current.userPaused).toBe(false)
    act(() => result.current.bind.onMouseLeave())
    expect(result.current.paused).toBe(false)
    act(() => result.current.bind.onFocus())
    expect(result.current.paused).toBe(true)
    act(() => result.current.bind.onBlur())
    expect(result.current.paused).toBe(false)
  })

  it('hover:false ignores hover (Formations configurator)', () => {
    const { result } = renderHook(() => usePausable({ hover: false }))
    act(() => result.current.bind.onMouseEnter())
    expect(result.current.paused).toBe(false)
  })

  it('pauses while the tab is hidden and resumes on visibility', () => {
    const { result } = renderHook(() => usePausable())
    act(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current.paused).toBe(true)
    act(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false })
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current.paused).toBe(false)
  })

  it('buttonProps expose state to assistive tech', () => {
    const { result } = renderHook(() => usePausable())
    expect(result.current.buttonProps['aria-pressed']).toBe(false)
    act(() => result.current.buttonProps.onClick())
    expect(result.current.buttonProps['aria-pressed']).toBe(true)
  })
})
