'use client'

// Client hook: it reads the layout and observes the viewport after hydration.
import { type RefObject, useEffect, useState } from 'react'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/** `final` = everything shown (server HTML, reduced motion, on screen at load); `armed` = staged, waiting; `in` = entering. */
export type EntryPhase = 'final' | 'armed' | 'in'

/**
 * Entrance of one drawing of `/accompagnement`. The server HTML and the first client render are
 * `final` (SSR content rule); after hydration the drawing is `armed` only while its first staged
 * part (`probe`, a selector inside it; default the drawing itself) is still below the fold, so a
 * load or an anchor that lands on it never blinks; it turns `in` once `threshold` of it is in view.
 * Usage: `const phase = useEntry(ref, { probe: '[data-step]' })`, then the CSS stages `.is-armed` / `.is-in`.
 */
export function useEntry(
  ref: RefObject<HTMLElement | null>,
  { threshold = 0.3, probe }: { threshold?: number; probe?: string } = {},
): EntryPhase {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<EntryPhase>('final')
  const inView = useInView(ref, { threshold, once: true })

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) {
      // useReducedMotion can flip after hydration: undo an arming made before it did.
      setPhase('final')
      return
    }
    // `probe`: the first staged part; arming is safe as long as THAT part is not on screen yet.
    const first = (probe && el.querySelector(probe)) || el
    if (first.getBoundingClientRect().top > window.innerHeight) setPhase('armed')
  }, [ref, reduced, probe])

  useEffect(() => {
    if (inView) setPhase((p) => (p === 'armed' ? 'in' : p))
  }, [inView])

  return phase
}
