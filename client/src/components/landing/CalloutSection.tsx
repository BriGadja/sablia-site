import { ArrowRight } from '@/components/icons/lucide-crm'
import { openBooking } from './BookingModal'

export default function CalloutSection() {
  return (
    <section className="bg-canvas px-8 py-16">
      <div className="mx-auto max-w-editorial">
        <div className="grid items-center gap-8 rounded-xl bg-primary p-8 sm:p-14 lg:grid-cols-[1fr_auto] lg:gap-14">
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-on-primary [text-wrap:balance]">
              Prêt à découvrir ce que votre CRM peut véritablement faire&nbsp;?
            </h2>
            <p className="mt-4 max-w-[560px] text-on-primary/70">
              30&nbsp;minutes en partage d'écran. Vous nous montrez votre CRM. Vous repartez avec ce
              qui rentre dans une offre cadrée, à prix affiché, et un chiffrage sous 24 heures pour
              le reste, que nous travaillions ensemble ou non.
            </p>
          </div>
          <button
            type="button"
            onClick={openBooking}
            className="t-button inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-md bg-canvas px-7 py-3 text-center text-[15px] text-on-dark transition-transform duration-base hover:translate-x-0.5 sm:w-auto sm:whitespace-nowrap"
          >
            Réserver mon call audit — 30&nbsp;min <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
