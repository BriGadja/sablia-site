import { Link } from 'wouter'
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
        {/* Second path for visitors not ready to talk (7 of the 27 agencies audited on
            2026-09-09 offer one: a diagnostic, a scorecard, a guide). Both already existed. */}
        <div className="mx-auto mt-8 flex max-w-editorial flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-on-dark-body">
          <span className="text-on-dark-muted">Pas encore prêt à parler&nbsp;?</span>
          <Link
            href="/guides/integrer-l-ia-dans-votre-entreprise"
            className="underline decoration-primary/60 underline-offset-4 hover:text-on-dark"
          >
            Lire le guide : intégrer l'IA dans votre entreprise
          </Link>
          <a
            href="https://app.sablia.io/questionnaire"
            className="underline decoration-primary/60 underline-offset-4 hover:text-on-dark"
          >
            Décrire votre terrain en 3 minutes, on vous répond par mail
          </a>
        </div>
      </div>
    </section>
  )
}
