'use client'

// Client component: shown per route (usePathname) and per session state (useSessionUpcoming). The
// static HTML carries it as at build time; past the start, the effect removes it without a mismatch.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BAR, barShownOn, useSessionUpcoming } from '@/content/session-bar'
import './session-bar.css'

/**
 * The thin webinar bar above the header (US-92): every page but `/webinaire*`, while the session
 * is upcoming. One link, stretched over the whole bar; `data-zone="bar"` separates its clicks from
 * the hero's in the 15/12 read. Long text on wide screens, short text below 1180 px.
 */
export function SessionBar() {
  const shown = barShownOn(usePathname())
  const upcoming = useSessionUpcoming()
  if (!shown || !upcoming) return null
  return (
    <aside className="v2-sbar" aria-label={BAR.aria} data-zone="bar">
      <div className="wrap v2-sbar-in">
        <span className="v2-sbar-label">{BAR.label}</span>
        <span className="v2-sbar-text is-long">{BAR.text}</span>
        <span className="v2-sbar-text is-short">{BAR.textShort}</span>
        <Link href={BAR.href} className="v2-sbar-cta">
          {BAR.cta}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </aside>
  )
}
