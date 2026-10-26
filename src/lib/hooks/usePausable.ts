'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export interface PausableOptions {
  /** Pause while the pointer is over the bound element. Default true (false for the Formations configurator). */
  hover?: boolean
}

/**
 * Pause state for a loop: user button, hover, keyboard focus and tab visibility.
 * Spread `bind` on the animated region and `buttonProps` on the pause button; feed `!paused` to `useTimelineLoop` `active`.
 * Usage: `const p = usePausable(); <section {...p.bind}><button {...p.buttonProps}>{p.paused ? 'Lecture' : 'Pause'}</button></section>`
 */
export function usePausable({ hover = true }: PausableOptions = {}) {
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const sync = () => setHidden(document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  const toggle = useCallback(() => setUserPaused((v) => !v), [])
  const paused = userPaused || (hover && hovered) || focused || hidden

  const bind = useMemo(
    () => ({
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    }),
    [],
  )
  const buttonProps = { onClick: toggle, 'aria-pressed': userPaused }

  return { paused, userPaused, toggle, bind, buttonProps }
}
