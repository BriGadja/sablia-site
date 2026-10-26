'use client'

import { type RefObject, useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export interface ScrollProgressOptions {
  /** Element sliding over the hero (the mockup's scene panel). */
  target: RefObject<HTMLElement | null>
  /** Element whose height is the travel distance (the hero). */
  reference: RefObject<HTMLElement | null>
  /** Default true; pass false on phones, where the recede is disabled. */
  enabled?: boolean
}

/**
 * Scroll-linked progress 0..1 = clamp(1 - target.top / reference.height), rounded to .01, rAF-throttled
 * (the mockup's `measure()`, M:1964). Always 0 under reduced motion or when disabled.
 * Usage: `const p = useScrollProgress({ target: sceneRef, reference: heroRef, enabled: !isPhone })`
 */
export function useScrollProgress({
  target,
  reference,
  enabled = true,
}: ScrollProgressOptions): number {
  const reduced = useReducedMotion()
  const [p, setP] = useState(0)
  const on = enabled && !reduced

  useEffect(() => {
    if (!on) {
      setP(0)
      return
    }
    let raf = 0
    const measure = () => {
      raf = 0
      const t = target.current
      const r = reference.current
      if (!t || !r) return
      const h = r.offsetHeight || 800
      const v = Math.max(0, Math.min(1, 1 - t.getBoundingClientRect().top / h))
      setP(Math.round(v * 100) / 100)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    schedule()
    document.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    return () => {
      document.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [on, target, reference])

  return p
}
