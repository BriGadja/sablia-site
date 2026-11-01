import { sessionUpcoming } from '@/content/session-bar'
import { HERO, PATHS } from '@/content/webinaire'
import { NAV_CTA } from './nav-links'

/** What the header's call to action is on a route. */
export type HeaderCtaKind =
  | { kind: 'book' }
  | { kind: 'book-formation' }
  | { kind: 'link'; href: string; label: string }
  | { kind: 'none' }

/**
 * Webinar pages first (plan webinaire-bureaux-etudes-2026-11-01, U3b): `/webinaire` has ONE action,
 * its form, so the header points there; its after-pages are read by people already registered, so
 * the header carries none. `/offres/**` keeps the CRM booking button (`site.bookingUrl`). Everywhere
 * else (plan site-formation-lot1, US-92): « Prochain webinaire » while the session is upcoming, then
 * « Réserver 30 min » on the formation Calendly (`book-formation`).
 */
export function headerCtaWhen(pathname: string | null, upcoming: boolean): HeaderCtaKind {
  const path = pathname && pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (path === PATHS.page) return { kind: 'link', href: '#inscription', label: HERO.cta }
  if (path?.startsWith(`${PATHS.page}/`)) return { kind: 'none' }
  if (path === '/offres' || path?.startsWith('/offres/')) return { kind: 'book' }
  return upcoming ? { kind: 'link', href: PATHS.page, label: NAV_CTA } : { kind: 'book-formation' }
}

/** The same map read at an instant (tests and tools); the header reads `useSessionUpcoming`. */
export function headerCtaFor(pathname: string | null, now: Date = new Date()): HeaderCtaKind {
  return headerCtaWhen(pathname, sessionUpcoming(now))
}
