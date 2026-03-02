import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { getConsentState, trackPageView } from '@/lib/analytics'

export function usePageTracking(): void {
  const [location] = useLocation()

  useEffect(() => {
    if (getConsentState() === 'accepted') {
      trackPageView(location)
    }
  }, [location])
}
