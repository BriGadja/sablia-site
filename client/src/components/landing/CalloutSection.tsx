import { ArrowRight } from '@/components/icons/lucide-crm'
import { openBooking } from './BookingModal'

export default function CalloutSection() {
  return (
    <section className="bg-canvas px-8 py-16">
      <div className="mx-auto max-w-editorial">
        <div className="grid items-center gap-14 rounded-xl bg-primary p-14 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-on-primary [text-wrap:balance]">
              Prêt à optimiser votre CRM&nbsp;?
            </h2>
            <p className="mt-4 max-w-[560px] text-on-primary/70">
              45&nbsp;min avec un expert pour cartographier votre pipeline et identifier les trois
              automatisations les plus rentables. Gratuit, sans engagement.
            </p>
          </div>
          <button
            type="button"
            onClick={openBooking}
            className="t-button inline-flex h-[52px] items-center gap-2.5 whitespace-nowrap rounded-md bg-canvas px-7 text-[15px] text-on-dark transition-transform duration-base hover:translate-x-0.5"
          >
            Réserver un call <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
