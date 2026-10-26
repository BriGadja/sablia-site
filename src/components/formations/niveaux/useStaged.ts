'use client'

import { type RefObject, useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/** Mockup timing: step k lights up 120 + k * 380 ms after the section first reaches 35 % visibility. */
export const STAGE_COUNT = 4
const stageDelay = (k: number) => 120 + k * 380

/**
 * Staged reveal shared by #niveaux, #deroule and #avis. The server HTML and reduced motion carry the
 * final stage (4); in a motion-enabled browser the stage drops to 0 once mounted and climbs to 4
 * after the section scrolls into view.
 */
export function useStaged(ref: RefObject<Element | null>): number {
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(STAGE_COUNT)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      // useReducedMotion is false during hydration and flips afterwards: undo a stage-0 reset.
      setStage(STAGE_COUNT)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    setStage(0)
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        for (let k = 1; k <= STAGE_COUNT; k++) {
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
  }, [ref, reduced])

  return stage
}
