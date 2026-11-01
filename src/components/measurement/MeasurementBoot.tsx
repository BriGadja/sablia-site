'use client'

import { useEffect } from 'react'
import { applyStatsParam, initAnalytics } from '@/lib/analytics'
import { startEventTracking } from '@/lib/events'

/**
 * Starts the measurement once per page load, from the root layout. It runs after hydration, so
 * the tracker script is injected by `initAnalytics()` at runtime and never sits in the static HTML.
 */
export function MeasurementBoot() {
  useEffect(() => {
    applyStatsParam()
    initAnalytics()
    return startEventTracking()
  }, [])
  return null
}
