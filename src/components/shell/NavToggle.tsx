'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSessionUpcoming } from '@/content/session-bar'
import { navLinksFor } from './nav-links'

/**
 * The header links plus the phone menu button. Server-rendered with every link in the HTML; the
 * state only decides whether the 2-column list shows on a phone. A click on a link closes it.
 * « Webinaires » leaves both lists at the session start (`navLinksFor`, the shared session clock).
 */
export function NavToggle() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const links = navLinksFor(useSessionUpcoming())
  return (
    <>
      <button
        type="button"
        className="v2-header-menubtn"
        aria-expanded={open}
        aria-controls="nav-links"
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: delegated close, the links stay the focus targets */}
      <div
        id="nav-links"
        className={`v2-header-links${open ? ' is-open' : ''}`}
        onClick={() => setOpen(false)}
        onKeyDown={undefined}
      >
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            aria-current={l.match === pathname ? 'page' : undefined}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  )
}
