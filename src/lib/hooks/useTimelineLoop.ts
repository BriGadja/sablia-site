'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export interface TimelineCtx {
  /** Resolves after `ms` (setTimeout). Throws internally when the run is cancelled, so code after it never runs stale. */
  wait: (ms: number) => Promise<void>
  /** False once the run was cancelled (use inside rAF/other callbacks the script starts itself). */
  alive: () => boolean
}
export type TimelineScript = (ctx: TimelineCtx) => Promise<void>

export interface TimelineOptions {
  /** The loop runs only while true (in view, not paused). Going false cancels; true again restarts from the top. */
  active: boolean
  /** Repeat the script until cancelled. Default true (the mockup's `while (alive())`). */
  loop?: boolean
  /** Reduced motion: called once instead of running the script; put the section in its final state. */
  final?: () => void
}

class Cancelled extends Error {}

/**
 * Replaces the mockup's `alive()/wait()` run-id loops. Timing is setTimeout only (Playwright `page.clock` and Vitest fake timers drive it).
 * The script may be an inline closure: the latest one is used, a new identity never restarts the run.
 * Usage: `useTimelineLoop(async ({ wait }) => { setStep(1); await wait(800); setStep(2); await wait(4000) }, { active: inView && !paused, final: showFinal })`
 */
export function useTimelineLoop(
  script: TimelineScript,
  { active, loop = true, final }: TimelineOptions,
) {
  const reduced = useReducedMotion()
  const scriptRef = useRef(script)
  const finalRef = useRef(final)
  scriptRef.current = script
  finalRef.current = final
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!active) return
    if (reduced) {
      finalRef.current?.()
      return
    }
    let live = true
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const rejects = new Set<(e: Error) => void>()
    const alive = () => live
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (!live) return reject(new Cancelled())
        const id = setTimeout(() => {
          timers.delete(id)
          rejects.delete(reject)
          resolve()
        }, ms)
        timers.add(id)
        rejects.add(reject)
      })

    setRunning(true)
    ;(async () => {
      do {
        await scriptRef.current({ wait, alive })
        // yield so a script that never waits cannot freeze the page (1 ms so fake timers terminate too)
        if (loop) await wait(1)
      } while (loop && live)
    })()
      .catch((e) => {
        if (!(e instanceof Cancelled)) console.error('[useTimelineLoop]', e)
      })
      .finally(() => {
        if (live) setRunning(false)
      })

    return () => {
      live = false
      for (const t of timers) clearTimeout(t)
      timers.clear()
      for (const r of rejects) r(new Cancelled())
      rejects.clear()
      setRunning(false)
    }
  }, [active, reduced, loop])

  return { running }
}
