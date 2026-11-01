'use client'

// Client component: the call to action depends on the pathname (usePathname), like NavToggle's
// current-page mark; the static export prerenders each route with its own value.
import { usePathname } from 'next/navigation'
import { Cta } from './Cta'
import { headerCtaFor } from './header-cta'

export function HeaderCta() {
  const cta = headerCtaFor(usePathname())
  if (cta.kind === 'none') return null
  if (cta.kind === 'book') return <Cta />
  // A plain anchor, not next/link: a same-route hash Link updates the URL without scrolling.
  return (
    <a href={cta.href} className="v2-cta is-dark is-md">
      {cta.label}
    </a>
  )
}
