'use client'

import { type RefObject, useEffect, useRef, useState } from 'react'

/**
 * Runs `measureFn(el)` on mount, on window resize and on element resize (ResizeObserver); returns the last result
 * (null before the element exists). For A's path dots (offsetTop) and the pipeline chip overlay.
 * Usage: `const dots = useMeasure(listRef, (el) => [...el.children].map((c) => (c as HTMLElement).offsetTop))`
 */
export function useMeasure<T>(
  ref: RefObject<HTMLElement | null>,
  measureFn: (el: HTMLElement) => T,
): T | null {
  const fnRef = useRef(measureFn)
  fnRef.current = measureFn
  const [value, setValue] = useState<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const run = () => setValue(fnRef.current(el))
    run()
    window.addEventListener('resize', run)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(run) : null
    ro?.observe(el)
    return () => {
      window.removeEventListener('resize', run)
      ro?.disconnect()
    }
  }, [ref])

  return value
}
