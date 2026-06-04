import { site } from '@/lib/site'

export function openBooking() {
  const w = 600
  const h = 700
  const left = (window.innerWidth - w) / 2 + window.screenX
  const top = (window.innerHeight - h) / 2 + window.screenY
  window.open(
    site.bookingUrl,
    'calendly',
    `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`,
  )
}
