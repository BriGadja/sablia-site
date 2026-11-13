'use client'

import { type RefObject, useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/**
 * Half-day k (1-based) fills `stageDelay(k)` ms after the déroulé is first about a third visible
 * (IntersectionObserver threshold 0.35).
 */
export function stageDelay(k: number): number {
  return 180 + (k - 1) * 430
}

/**
 * Staged fill of the déroulé bar. The server HTML and reduced motion carry the final stage
 * (`count`); in a motion-enabled browser the stage drops to 0 once mounted and climbs to `count`,
 * once, after the section scrolls into view.
 */
export function useStaged(ref: RefObject<Element | null>, count: number): number {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(count)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      // useReducedMotion is false during hydration and flips afterwards: undo a stage-0 reset.
      setStage(count)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    setStage(0)
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        for (let k = 1; k <= count; k++) {
          timers.push(setTimeout(() => setStage(k), stageDelay(k)))
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      for (const t of timers) clearTimeout(t)
    }
  }, [ref, reduced, count])

  return stage
}
