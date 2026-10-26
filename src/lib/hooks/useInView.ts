'use client'

import { type RefObject, useEffect, useState } from 'react'

export interface InViewOptions {
  /** IntersectionObserver threshold (mockup values: .25 .3 .35). Default .25. */
  threshold?: number
  /** Latch to true after the first intersection and disconnect. */
  once?: boolean
  rootMargin?: string
}

/**
 * Whether the element is intersecting the viewport. Reports true when IntersectionObserver is missing.
 * Usage: `const inView = useInView(ref, { threshold: 0.35, once: true })`
 */
export function useInView(ref: RefObject<Element | null>, opts: InViewOptions = {}): boolean {
  const { threshold = 0.25, once = false, rootMargin } = opts
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.some((e) => e.isIntersecting)
        if (v) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, once, rootMargin])

  return inView
}
