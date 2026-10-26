import { trackBooking } from '@/lib/events'
import { site } from '@/lib/site'

/** Opens the booking popup (and reports `cta_book`). Called only by `BookingButton`. */
export function openBookingUrl(url: string = site.bookingUrl): void {
  trackBooking()
  const w = 600
  const h = 700
  const left = (window.innerWidth - w) / 2 + window.screenX
  const top = (window.innerHeight - h) / 2 + window.screenY
  window.open(url, 'calendly', `width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`)
}
