import { useState } from 'react'
import { LogIn, Menu, X } from '@/components/icons/lucide-crm'
import { openBooking } from './BookingModal'

const NAV_ITEMS = [
  { label: 'Problématiques', href: '#problemes' },
  { label: 'Accompagnement', href: '#process' },
  { label: 'Équipe', href: '#equipe' },
  { label: 'Témoignages', href: '#proof' },
  { label: 'FAQ', href: '#faq' },
]

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-canvas-soft/82 backdrop-blur-xl backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-16 max-w-editorial items-center gap-10 px-8">
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <img src="/wordmark-dark.svg" alt="Sablia" className="block h-12" />
        </a>

        <div className="hidden flex-1 items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="t-nav-link transition-colors duration-fast hover:text-on-dark"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a
            href="https://app.sablia.io"
            className="t-button inline-flex h-10 items-center gap-2 rounded-md border border-hairline px-4 text-on-dark-body transition-colors duration-base hover:border-primary/60 hover:text-on-dark"
          >
            <LogIn size={16} />
            Portail
          </a>
          <button
            type="button"
            onClick={openBooking}
            className="t-button inline-flex h-10 items-center rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
          >
            Réserver un call audit
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
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="t-title-sm text-on-dark-body transition-colors hover:text-on-dark"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://app.sablia.io"
              onClick={() => setMobileOpen(false)}
              className="t-button mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-hairline px-5 text-on-dark-body"
            >
              <LogIn size={16} />
              Portail
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                openBooking()
              }}
              className="t-button h-10 rounded-md bg-primary px-5 text-on-primary"
            >
              Réserver un call audit
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
