import Link from 'next/link'
import { Cta } from './Cta'
import { Logo } from './Logo'
import { NavToggle } from './NavToggle'
import './site-header.css'

/**
 * Sticky, opaque on every band. The whole bar is the `<nav>`: the booking button must live inside
 * a nav (analytics-e2e and the zone tagging of events.ts both look for it there).
 */
export function SiteHeader() {
  return (
    <header className="v2-header">
      <nav className="wrap v2-header-bar" aria-label="Navigation principale">
        <Link href="/" className="v2-header-logo">
          <Logo />
          <span>Sablia</span>
        </Link>
        <NavToggle />
        <Cta />
      </nav>
    </header>
  )
}
