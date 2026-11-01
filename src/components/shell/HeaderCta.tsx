'use client'

// Client component: the call to action depends on the pathname (usePathname), like NavToggle's
// current-page mark, and on the session clock (useSessionUpcoming: build state first, then the
// visitor's clock); the static export prerenders each route with its own value.
import { usePathname } from 'next/navigation'
import { useSessionUpcoming } from '@/content/session-bar'
import { site } from '@/lib/site'
import { Cta } from './Cta'
import { headerCtaWhen } from './header-cta'

export function HeaderCta() {
  const cta = headerCtaWhen(usePathname(), useSessionUpcoming())
  if (cta.kind === 'none') return null
  if (cta.kind === 'book') return <Cta />
  if (cta.kind === 'book-formation') return <Cta url={site.formationBookingUrl} />
  // A plain anchor for a same-route hash: a hash Link updates the URL without scrolling.
  if (cta.href.startsWith('#'))
    return (
      <a href={cta.href} className="v2-cta is-dark is-md">
        {cta.label}
      </a>
    )
  return <Cta href={cta.href}>{cta.label}</Cta>
}
