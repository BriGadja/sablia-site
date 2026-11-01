'use client'

// Client module: the session state needs a state and an effect (the visitor's clock).
import { type ReactNode, useEffect, useState } from 'react'
import { buildTime, sessionUpcoming } from '@/content/session-clock'

/**
 * Is the next webinar still ahead? The first render (static HTML and hydration alike) answers for
 * the build instant, so both agree and nothing mismatches; an effect then answers for the visitor's
 * clock. The ONLY session switch of the site: sections go through `WhenUpcoming`, never `new Date()`.
 */
export function useSessionUpcoming(): boolean {
  const [upcoming, setUpcoming] = useState(() => sessionUpcoming(buildTime() ?? new Date()))
  useEffect(() => {
    setUpcoming(sessionUpcoming(new Date()))
  }, [])
  return upcoming
}

/** Renders `upcoming` while the session is ahead, `past` from its start (see useSessionUpcoming). */
export function WhenUpcoming({ upcoming, past }: { upcoming: ReactNode; past: ReactNode }) {
  return <>{useSessionUpcoming() ? upcoming : past}</>
}
