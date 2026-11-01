import { Cta } from '@/components/shell/Cta'
import { MERCI } from '@/content/webinaire'

/**
 * The optional booking line of `/webinaire/merci`. It opens the webinar's OWN booking link (the
 * dedicated event type, amendment A1) through `BookingButton`, so `cta_book` is counted once; while
 * the link is not set (`BOOKING_URL` null) it renders nothing.
 */
export function MerciBooking({ url }: { url: string | null }) {
  if (!url) return null
  return (
    <div className="wbn-booking">
      <p>{MERCI.booking.line}</p>
      <Cta url={url} size="lg" arrow>
        {MERCI.booking.cta}
      </Cta>
    </div>
  )
}
