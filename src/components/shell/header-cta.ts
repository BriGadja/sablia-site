import { HERO, PATHS } from '@/content/webinaire'

/** What the header's call to action is on a route. */
export type HeaderCtaKind =
  | { kind: 'book' }
  | { kind: 'link'; href: string; label: string }
  | { kind: 'none' }

/**
 * The CRM booking button (`site.bookingUrl`) everywhere, except on the webinar pages (plan
 * webinaire-bureaux-etudes-2026-11-01, U3b): `/webinaire` has ONE action, its form, so the header
 * points there; its after-pages are read by people already registered, for whom « Je m'inscris » is
 * false and the CRM Calendly the wrong event type (amendment A1), so the header carries none.
 */
export function headerCtaFor(pathname: string | null): HeaderCtaKind {
  const path = pathname && pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (path === PATHS.page) return { kind: 'link', href: '#inscription', label: HERO.cta }
  if (path?.startsWith(`${PATHS.page}/`)) return { kind: 'none' }
  return { kind: 'book' }
}
