import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'wouter'
import { ChevronDown } from '@/components/icons/lucide-crm'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

interface FaqItem {
  q: string
  a: string
  /** Optional page the answer opens onto (kept out of the FAQPage schema: plain text there). */
  href?: string
  hrefLabel?: string
}

// Figures come from the OF-1 module, never typed here: on 2026-09-09 the home still quoted the
// pre-catalogue price range and delay one click away from a page selling 1 490 € HT in 7 days.
export const FAQ: readonly FaqItem[] = [
  {
    q: 'Devrons-nous changer de CRM ?',
    a: `Non. Nous nous adaptons à votre outil (${of1.crms.join(', ')}). Vous conservez votre stack.`,
  },
  {
    q: 'Quel budget prévoir ?',
    a: `Nos offres cadrées ont un prix affiché, avant tout paiement. Le CRM qui se remplit tout seul après chaque appel est à ${eurHt(of1.price.oneShotHt)}, avec un récurrent de ${of1.price.monthlyHt} € HT par mois, premier mois offert. Un besoin hors catalogue est chiffré par brique : ${eurHt(of1.price.brickHt)} pour au plus ${of1.delay.sabliaWorkDaysMax} jours de travail, plancher ${eurHt(of1.price.brickFloorHt)}, confirmé sous 24 heures.`,
    href: OF1_ROUTE,
    hrefLabel: "Voir l'offre et son prix",
  },
  {
    q: 'Combien de temps avant la mise en production ?',
    a: `${of1.delay.days} jours pour une offre cadrée, avec un test sur 5 appels réels avec vous avant la mise en service. Un besoin spécifique est planifié dans son devis.`,
  },
  {
    q: "Nous n'avons personne sur l'IA en interne.",
    a: "C'est exactement notre cas client. Nous concevons, déployons et formons votre équipe pour qu'elle reste autonome.",
  },
  {
    // ⚠️ HITL Brice : confirmer la formulation exacte (Anthropic Enterprise vs API commerciale)
    // avant de revendiquer un tier précis. Formulation tier-safe par défaut ci-dessous.
    q: 'Quelles garanties sur la sécurité de nos données ?',
    a: "Claude est déployé via l'API commerciale d'Anthropic : par engagement contractuel, aucune de vos données n'entraîne le modèle. Conforme RGPD. Un DPA peut être signé.",
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <section id="faq" className="border-t border-hairline bg-canvas-soft px-8 py-section">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="mx-auto max-w-[760px]">
        <div className="mb-12 text-center">
          <div className="eyebrow mb-4 text-primary">FAQ</div>
          <h2 className="t-display-lg">Les questions que vous vous posez.</h2>
        </div>
        <div className="border-y border-hairline">
          {FAQ.map((item, i) => {
            const isOpen = open === i
            const btnId = `faq-btn-${i}`
            const panelId = `faq-panel-${i}`
            return (
              <div key={item.q} className="border-b border-hairline last:border-b-0">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-on-dark"
                  >
                    <span className="t-title-sm text-on-dark">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                      className="shrink-0 text-primary"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-[15px] leading-relaxed text-on-dark-body">
                    {item.a}
                    {item.href ? (
                      <>
                        {' '}
                        <Link
                          href={item.href}
                          // A collapsed panel is aria-hidden and clipped, yet a link inside it stays
                          // keyboard-reachable: keep it out of the tab order until the panel opens.
                          tabIndex={isOpen ? 0 : -1}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {item.hrefLabel ?? "Voir l'offre"}
                        </Link>
                      </>
                    ) : null}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
