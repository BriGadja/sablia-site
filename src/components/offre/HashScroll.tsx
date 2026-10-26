'use client'

import { useEffect } from 'react'

/**
 * Deep links (#prix, #faq…) land again once the webfonts have swapped in: they reflow the text above
 * the target (up to 166 px at 390, measured on the old site, 2026-09-29). Skipped when the visitor
 * has already moved, and the page wrapper turns scroll anchoring off (`overflow-anchor`).
 */
export function HashScroll() {
  useEffect(() => {
    const target = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null
    if (!target) return
    target.scrollIntoView()
    let moved = false
    const stop = () => {
      moved = true
    }
    const gestures = ['wheel', 'touchstart', 'keydown'] as const
    for (const gesture of gestures) window.addEventListener(gesture, stop, { passive: true })
    document.fonts?.ready.then(() => {
      if (!moved) target.scrollIntoView()
    })
    return () => {
      for (const gesture of gestures) window.removeEventListener(gesture, stop)
    }
  }, [])
  return null
}
