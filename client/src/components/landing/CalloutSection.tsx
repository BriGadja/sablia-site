import { Link } from 'wouter'
import { ArrowRight } from '@/components/icons/lucide-crm'
import { BOOKING_LABEL, FINAL_CALL_TITLE } from '@/content/home'
import { openBooking } from './BookingModal'

/**
 * The final call (grill 2026-09-28, decisions 3 and 6): a new title shown to Brice on the preview,
 * the existing paragraph, one « Réserver 30 min » button. The band is light like the rest of the
 * home, without the `on-light` class: its heading rule would repaint the coral card's white text.
 */
export default function CalloutSection() {
  return (
    <section className="bg-surface-light px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-editorial">
        {/* primary-active, not primary: white on the site coral reads 3.28:1, and the paragraph
            needs 4.5 (2026-09-29, coral-contrast.test.tsx). */}
        <div className="grid items-center gap-8 rounded-xl bg-primary-active p-8 sm:p-14 lg:grid-cols-[1fr_auto] lg:gap-14">
          <div className="min-w-0">
            <h2 className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-on-primary [text-wrap:balance]">
              {FINAL_CALL_TITLE}
            </h2>
            <p className="mt-4 max-w-[560px] text-on-primary">
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
            {BOOKING_LABEL} <ArrowRight size={18} />
          </button>
        </div>
        {/* Second path for visitors not ready to talk (7 of the 27 agencies audited on
            2026-09-09 offer one: a diagnostic, a scorecard, a guide). Both already existed. */}
        <div className="mx-auto mt-8 flex max-w-editorial flex-wrap items-center gap-x-8 gap-y-3 text-[14px] text-body">
          <span className="text-muted-text">Pas encore prêt à parler&nbsp;?</span>
          <Link
            href="/guides/integrer-l-ia-dans-votre-entreprise"
            className="underline decoration-primary/60 underline-offset-4 hover:text-ink"
          >
            Lire le guide : intégrer l'IA dans votre entreprise
          </Link>
          <a
            href="https://app.sablia.io/questionnaire"
            className="underline decoration-primary/60 underline-offset-4 hover:text-ink"
          >
            Décrire votre terrain en 3 minutes, on vous répond par mail
          </a>
        </div>
      </div>
    </section>
  )
}
