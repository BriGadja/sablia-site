import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { Link, useLocation } from 'wouter'
import { LogoWordmark } from '@/components/brand/logo-wordmark'
import { ButtonLink } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

type NavLink =
  | { label: string; href: string; type: 'anchor' }
  | { label: string; href: string; type: 'route' }

const navLinks: NavLink[] = [
  { label: 'Le diagnostic', href: '#offres', type: 'anchor' },
  { label: 'Les suites', href: '#paths', type: 'anchor' },
  { label: 'Preuves', href: '#preuves', type: 'anchor' },
  { label: 'FAQ', href: '#faq', type: 'anchor' },
]

export default function Navigation() {
  const [location, setLocation] = useLocation()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onEscape)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleAnchorClick = (href: string) => {
    setOpen(false)
    if (location !== '/') {
      setLocation('/')
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:top-5 md:px-6">
      <div
        className={cn(
          'mx-auto flex h-[56px] w-full max-w-[980px] items-center justify-between gap-4 rounded-full border px-4 pl-5 transition-[background,border-color,box-shadow] duration-500 md:gap-6 md:px-5 md:pl-6',
          scrolled
            ? 'border-[color:var(--color-encre)]/12 bg-[color:var(--color-sable)]/80 backdrop-blur-xl shadow-[0_12px_40px_-18px_rgba(26,22,19,0.28)]'
            : 'border-[color:var(--color-encre)]/8 bg-[color:var(--color-sable)]/50 backdrop-blur-md shadow-[0_6px_20px_-14px_rgba(26,22,19,0.22)]',
        )}
      >
        <Link href="/" className="focus-visible:outline-none" aria-label="Sablia · retour à l'accueil">
          <LogoWordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleAnchorClick(link.href)
              }}
              className="text-[0.875rem] tracking-[-0.005em] text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink
            href={site.diagnosticAnchor}
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              trackEvent('cta_start_diagnostic', { location: 'header' })
              handleAnchorClick(site.diagnosticAnchor)
            }}
            className="hidden sm:inline-flex"
          >
            Démarrer, 490€
          </ButtonLink>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-[color:var(--color-encre)] md:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 8h16" strokeLinecap="round" />
                  <path d="M4 16h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[88px] bottom-0 bg-[color:var(--color-sable)] md:hidden"
          >
            <nav
              className="container-editorial flex h-full flex-col justify-between py-10"
              aria-label="Menu mobile"
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="border-b border-[color:var(--color-encre)]/10">
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAnchorClick(link.href)
                      }}
                      className="flex items-baseline gap-4 py-5 text-[color:var(--color-encre)]"
                    >
                      <span className="folio">0{i + 1}</span>
                      <span className="font-display text-2xl tracking-[-0.02em]">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3">
                <ButtonLink
                  href={site.diagnosticAnchor}
                  variant="primary"
                  size="lg"
                  onClick={(e) => {
                    e.preventDefault()
                    trackEvent('cta_start_diagnostic', { location: 'mobile-menu' })
                    handleAnchorClick(site.diagnosticAnchor)
                  }}
                >
                  Démarrer mon diagnostic, 490€
                </ButtonLink>
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent('cta_book_call', { location: 'mobile-menu' })
                    setOpen(false)
                  }}
                  className="text-center font-display text-[1rem] italic text-[color:var(--color-encre-70)]"
                >
                  Préférer en discuter d'abord →
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
