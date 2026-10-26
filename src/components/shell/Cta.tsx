import Link from 'next/link'
import type { ReactNode } from 'react'
import { BookingButton } from './BookingButton'
import './cta.css'

type Props = {
  /** `dark` = ink on sand grounds, `light` = pale on night bands. */
  variant?: 'dark' | 'light'
  /** `md` = 44 px (header), `lg` = 48 px (bands). */
  size?: 'md' | 'lg'
  /** Trailing arrow, as on the band buttons. */
  arrow?: boolean
  /** Without `href` it is a booking button (the only way to write « Réserver 30 min »). */
  href?: string
  /** Overrides the booking link, see BookingButton. */
  url?: string
  children?: ReactNode
}

const Arrow = () => (
  <svg
    width="16"
    height="16"
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
)

export function Cta({ variant = 'dark', size = 'md', arrow = false, href, url, children }: Props) {
  const className = `v2-cta is-${variant} is-${size}`
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
        {arrow && <Arrow />}
      </Link>
    )
  }
  return (
    <BookingButton className={className} url={url}>
      {children ?? 'Réserver 30 min'}
      {arrow && <Arrow />}
    </BookingButton>
  )
}
