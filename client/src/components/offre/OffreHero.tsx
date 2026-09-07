import { motion } from 'framer-motion'
import { ArrowRight, Check } from '@/components/icons/lucide-crm'
import { openBookingUrl } from '@/components/landing/BookingModal'
import { OF1_BOOKING_URL, of1 } from '@/content/of1'
import FlowDiagram from './FlowDiagram'
import { euros } from './format'

const CHECKS = [
  'Prix affiché, pas de devis surprise',
  'Remboursé si ça ne tourne pas',
  'Aucun appel enregistré à votre place',
]

export default function OffreHero() {
  const pills = [
    `${euros(of1.price.oneShotHt)} € HT`,
    `${of1.price.monthlyHt} €/mois de supervision, premier mois offert`,
    `Livré en ${of1.delay.days} jours`,
  ]

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
            Offre n°1 · Compte rendu d'appel
          </div>
          <h1 className="t-display-xl text-on-dark-strong [text-wrap:balance]">{of1.title}</h1>
          <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-on-dark-body">
            {of1.promise}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {pills.map((pill) => (
              <li
                key={pill}
                className="t-caption whitespace-nowrap rounded-pill border border-hairline bg-surface-card px-3.5 py-2 text-on-dark"
              >
                {pill}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openBookingUrl(OF1_BOOKING_URL)}
              className="t-button inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
            >
              Réserver 30 minutes avec Brice <ArrowRight size={16} />
            </button>
            <a
              href="#variantes"
              className="t-button inline-flex h-11 items-center rounded-md border border-hairline px-5 text-on-dark transition-colors hover:border-on-dark-muted"
            >
              Voir les deux variantes
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-on-dark-muted">
            {CHECKS.map((check) => (
              <li key={check} className="inline-flex items-center gap-1.5">
                <Check size={14} className="shrink-0 text-accent-teal" />
                {check}
              </li>
            ))}
          </ul>

          <FlowDiagram
            orientation="vertical"
            className="mx-auto mt-12 block h-[300px] w-full max-w-[280px] text-on-dark-body lg:hidden"
          />
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
