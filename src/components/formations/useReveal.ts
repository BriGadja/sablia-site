'use client'

import { type RefObject, useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/**
 * `static` = final state (server HTML, reduced motion, or already on screen at mount);
 * `armed` = hidden by the section's CSS, waiting to enter view; `in` = played.
 */
export type RevealState = 'static' | 'armed' | 'in'

/**
 * Arms a section's entry only after hydration and only below the fold, so the static HTML never
 * carries a hidden text and a section on screen at load never blinks. Each section's CSS decides
 * what the entry looks like (`[data-reveal='armed']` then `[data-reveal='in']`).
 */
export function useReveal(ref: RefObject<HTMLElement | null>): RevealState {
  const reduced = useReducedMotion()
  const [state, setState] = useState<RevealState>('static')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setState('static')
      return
    }
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setState('armed')
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        setState('in')
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, reduced])

  return state
}
