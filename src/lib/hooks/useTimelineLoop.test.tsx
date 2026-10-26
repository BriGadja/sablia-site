import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockReducedMotion } from './test-utils'
import { type TimelineScript, useTimelineLoop } from './useTimelineLoop'

beforeEach(() => {
  vi.useFakeTimers()
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

describe('useTimelineLoop', () => {
  it('runs steps on the timer clock and loops', async () => {
    const log: string[] = []
    const script: TimelineScript = async ({ wait }) => {
      log.push('a')
      await wait(100)
      log.push('b')
      await wait(200)
    }
    renderHook(() => useTimelineLoop(script, { active: true }))
    await tick(0)
    expect(log).toEqual(['a'])
    await tick(100)
    expect(log).toEqual(['a', 'b'])
    await tick(205)
    expect(log).toEqual(['a', 'b', 'a'])
  })

  it('loop:false runs once', async () => {
    const run = vi.fn(async ({ wait }) => {
      await wait(50)
    })
    renderHook(() => useTimelineLoop(run, { active: true, loop: false }))
    await tick(1000)
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('cancels pending steps when active turns false, restarts from the top when true again', async () => {
    const log: string[] = []
    const script: TimelineScript = async ({ wait }) => {
      log.push('a')
      await wait(100)
      log.push('b')
      await wait(100)
    }
    const { rerender } = renderHook(({ active }) => useTimelineLoop(script, { active }), {
      initialProps: { active: true },
    })
    await tick(50)
    rerender({ active: false })
    await tick(1000)
    expect(log).toEqual(['a'])
    expect(vi.getTimerCount()).toBe(0)
    rerender({ active: true })
    await tick(0)
    expect(log).toEqual(['a', 'a'])
  })

  it('cancels on unmount and leaves no timer', async () => {
    const log: string[] = []
    const { unmount } = renderHook(() =>
      useTimelineLoop(
        async ({ wait }) => {
          log.push('a')
          await wait(100)
          log.push('b')
        },
        { active: true },
      ),
    )
    await tick(10)
    unmount()
    await tick(500)
    expect(log).toEqual(['a'])
    expect(vi.getTimerCount()).toBe(0)
  })

  it('a changing script identity does not restart the run', async () => {
    const log: string[] = []
    const { rerender } = renderHook(
      ({ n }) =>
        useTimelineLoop(
          async ({ wait }) => {
            log.push(`s${n}`)
            await wait(100)
          },
          { active: true },
        ),
      { initialProps: { n: 1 } },
    )
    await tick(0)
    rerender({ n: 2 })
    await tick(50)
    expect(log).toEqual(['s1'])
  })

  it('reduced motion: no run, final() called once', async () => {
    mockReducedMotion(true)
    const run = vi.fn(async () => {})
    const final = vi.fn()
    renderHook(() => useTimelineLoop(run, { active: true, final }))
    await tick(1000)
    expect(run).not.toHaveBeenCalled()
    expect(final).toHaveBeenCalledTimes(1)
  })

  it('a script error does not become an unhandled rejection or spin', async () => {
    const run = vi.fn(async () => {
      throw new Error('boom')
    })
    renderHook(() => useTimelineLoop(run, { active: true }))
    await tick(5000)
    expect(run).toHaveBeenCalledTimes(1)
  })

  it('a loop whose script never waits yields instead of freezing', async () => {
    const run = vi.fn(async () => {})
    renderHook(() => useTimelineLoop(run, { active: true }))
    await tick(100)
    expect(run.mock.calls.length).toBeGreaterThan(1)
    expect(run.mock.calls.length).toBeLessThan(1000)
  })
})
