import { track } from '@vercel/analytics'
import { site } from '@/lib/site'

export function openBookingUrl(url: string) {
  track('book_call', { url, path: window.location.pathname })
  const w = 600
  const h = 700
  const left = (window.innerWidth - w) / 2 + window.screenX
  const top = (window.innerHeight - h) / 2 + window.screenY
  window.open(url, 'calendly', `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`)
}

export function openBooking() {
  openBookingUrl(site.bookingUrl)
}
