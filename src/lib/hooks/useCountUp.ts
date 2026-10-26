'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export interface CountUpOptions {
  active: boolean
  /** ms, default 1400 (mockup). */
  duration?: number
}

/**
 * Counts 0 to `target` with ease-out cubic once `active` first turns true; plays once.
 * Returns `target` before that (so the server HTML carries the final figure) and under reduced motion.
 * Frame time comes from the rAF timestamp, so a faked clock drives it.
 * Usage: `const n = useCountUp(1400, { active: inView })  // render n.toLocaleString('fr-FR')`
 */
export function useCountUp(target: number, { active, duration = 1400 }: CountUpOptions): number {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(target)
  const played = useRef(false)

  useEffect(() => {
    if (!active || reduced || played.current) {
      if (reduced) setValue(target)
      return
    }
    played.current = true
    let raf = 0
    let start: number | null = null
    setValue(0)
    const tick = (now: number) => {
      if (start === null) start = now
      const k = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, reduced, target, duration])

  return value
}
