'use client'

// Client hook: it reads the layout and observes the viewport after hydration.
import { type RefObject, useEffect, useState } from 'react'
import { useInView } from './useInView'
import { useReducedMotion } from './useReducedMotion'

export type RevealPhase = 'final' | 'armed' | 'in'

/**
 * Entrance of a section, for `data-reveal` and a CSS stage in the section's own scope.
 * The server HTML and the first client render are `final` (everything visible, SSR content rule).
 * After hydration the section is `armed` (hidden by its CSS) only when it is still below the fold,
 * so an anchor landing on it never shows an empty band; it turns `in` when it scrolls in.
 * Reduced motion stays `final`. Usage: `<section ref={ref} data-reveal={useArmedReveal(ref)}>`.
 */
export function useArmedReveal(
  ref: RefObject<Element | null>,
  { threshold = 0.2 }: { threshold?: number } = {},
): RevealPhase {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<RevealPhase>('final')
  const inView = useInView(ref, { threshold, once: true })

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) {
      // useReducedMotion flips after hydration: undo an arming that happened before it did.
      setPhase('final')
      return
    }
    if (el.getBoundingClientRect().top > window.innerHeight) setPhase('armed')
  }, [ref, reduced])

  useEffect(() => {
    if (inView) setPhase((p) => (p === 'armed' ? 'in' : p))
  }, [inView])

  return phase
}
