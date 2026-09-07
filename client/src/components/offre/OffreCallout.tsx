import { ArrowRight } from '@/components/icons/lucide-crm'
import { openBookingUrl } from '@/components/landing/BookingModal'
import { OF1_BOOKING_URL } from '@/content/of1'

export default function OffreCallout() {
  return (
    <section className="bg-canvas px-8 py-16">
      <div className="mx-auto max-w-editorial">
        <div className="grid items-center gap-14 rounded-xl bg-primary p-14 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-on-primary [text-wrap:balance]">
              On regarde votre CRM et votre téléphonie ensemble.
            </h2>
            <p className="mt-4 max-w-[560px] text-on-primary/75">
              30 minutes en partage d'écran avec Brice. Vous repartez avec la variante qui colle à
              votre terrain et une date de livraison, que nous travaillions ensemble ou non.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openBookingUrl(OF1_BOOKING_URL)}
            className="t-button inline-flex h-[52px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-canvas px-7 text-[15px] text-on-dark transition-transform duration-base hover:translate-x-0.5 lg:w-auto"
          >
            Réserver 30 minutes avec Brice <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
