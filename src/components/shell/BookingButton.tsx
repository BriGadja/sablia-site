'use client'

import type { ReactNode } from 'react'
import { openBookingUrl } from '@/lib/booking'

type Props = {
  /** Visible label; defaults to the site-wide « Réserver 30 min ». */
  children?: ReactNode
  className?: string
  /** Overrides the default Calendly link (OF-1 pages pass their own). */
  url?: string
}

/**
 * The single call site of every « Réserver 30 min » button. `data-cta-book` lets the document
 * capture listener tag the zone; `openBookingUrl()` reports `cta_book` once (events.ts dedupes).
 */
export function BookingButton({ children = 'Réserver 30 min', className, url }: Props) {
  return (
    <button type="button" data-cta-book="" className={className} onClick={() => openBookingUrl(url)}>
      {children}
    </button>
  )
}
