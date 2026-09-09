import { useState } from 'react'
import { Link } from 'wouter'
import { Menu, X } from '@/components/icons/lucide-crm'
import { OF1_ROUTE } from '@/content/of1'
import { site } from '@/lib/site'
import { openBookingUrl } from './BookingModal'

interface TopNavProps {
  items?: readonly { label: string; href: string }[]
  bookingUrl?: string
  ctaLabel?: string
}

const NAV_ITEMS = [
  { label: 'Offres', href: OF1_ROUTE },
  { label: 'Problématiques', href: '#problemes' },
  { label: 'Accompagnement', href: '#process' },
  { label: 'Votre interlocuteur', href: '#equipe' },
  { label: 'Témoignages', href: '#proof' },
  { label: 'FAQ', href: '#faq' },
]

function NavItem({
  href,
  className,
  onNavigate,
  children,
}: {
  href: string
  className: string
  onNavigate?: () => void
  children: React.ReactNode
}) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className} onClick={onNavigate}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} className={className} onClick={onNavigate}>
      {children}
    </a>
  )
}

export default function TopNav({
  items = NAV_ITEMS,
  bookingUrl = site.bookingUrl,
  ctaLabel = 'Réserver un call audit',
}: TopNavProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-canvas-soft/82 backdrop-blur-xl backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-16 max-w-editorial items-center gap-10 px-8">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/wordmark-dark.svg" alt="Sablia" className="block h-12" />
        </a>

        <div className="hidden flex-1 items-center gap-7 md:flex">
          {items.map((item) => (
            <NavItem
              key={item.label}
              href={item.href}
              className="t-nav-link transition-colors duration-fast hover:text-on-dark"
            >
              {item.label}
            </NavItem>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => openBookingUrl(bookingUrl)}
            className="t-button inline-flex h-10 items-center rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
          >
            {ctaLabel}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-surface-card text-on-dark md:hidden"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-hairline bg-canvas-soft p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <NavItem
                key={item.label}
                href={item.href}
                onNavigate={() => setMobileOpen(false)}
                className="t-title-sm text-on-dark-body transition-colors hover:text-on-dark"
              >
                {item.label}
              </NavItem>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                openBookingUrl(bookingUrl)
              }}
              className="t-button h-10 rounded-md bg-primary px-5 text-on-primary"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
