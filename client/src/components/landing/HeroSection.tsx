import { motion } from 'framer-motion'
import { ArrowRight, Check } from '@/components/icons/lucide-crm'
import FlowDiagram from '@/components/offre/FlowDiagram'
import { of1 } from '@/content/of1'
import { openBooking } from './BookingModal'

/**
 * The home opens on the product the site sells (audit of 2026-09-09: the concrete promise lived
 * one click away, behind a slogan and a mock dashboard). Words come from the OF-1 module.
 */
const CHECKS = [
  'Call audit gratuit, sans engagement',
  `Livré en ${of1.delay.days} jours`,
  'Remboursé si ça ne tourne pas',
]

export default function HeroSection() {
  return (
    <section className="bg-canvas px-8 pb-20 pt-section">
      <div className="mx-auto grid max-w-editorial items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
        >
          <div className="eyebrow mb-6 inline-flex items-center gap-2 text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Agence d'intégration Claude AI × CRM
          </div>
          <h1 className="t-display-xl text-on-dark-strong [text-wrap:balance]">{of1.title}.</h1>
          <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-on-dark-body">
            {of1.promise} Pour les équipes commerciales de {of1.teamSize.min} à {of1.teamSize.max}{' '}
            personnes qui ont déjà un CRM.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="t-button inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
            >
              Réserver un call audit — 30&nbsp;min <ArrowRight size={16} />
            </button>
            <a
              href="#catalogue"
              className="t-button inline-flex h-11 items-center rounded-md border border-hairline px-5 text-on-dark transition-colors hover:border-on-dark-muted"
            >
              Voir le catalogue
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-on-dark-muted">
            {CHECKS.map((check) => (
              <li key={check} className="inline-flex items-center gap-1.5">
                <Check size={14} className="shrink-0 text-success" /> {check}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0, 0, 1] }}
          className="hidden lg:block"
        >
          <div className="rounded-xl border border-hairline bg-surface-card/60 p-8">
            <div className="t-caption-uppercase mb-6 text-on-dark-muted">
              Ce qui se passe quand votre commercial raccroche
            </div>
            <FlowDiagram orientation="horizontal" className="block w-full text-on-dark-body" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
