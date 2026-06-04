import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from '@/components/icons/lucide-crm'

const FAQ = [
  {
    q: 'Devrons-nous changer de CRM ?',
    a: 'Non. Nous nous adaptons à votre outil (Zoho, HubSpot, Salesforce, Pipedrive). Vous conservez votre stack.',
  },
  {
    q: 'Quel budget prévoir ?',
    a: "Une automatisation simple démarre entre 1 000 et 2 000 €. Selon l'ampleur, l'accompagnement se construit par paliers. Le devis est établi après le call audit, jamais avant.",
  },
  {
    q: 'Combien de temps avant la mise en production ?',
    a: 'Le premier workflow est livré en production sous 30 jours.',
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
                  <p className="pb-5 text-[15px] leading-relaxed text-on-dark-body">{item.a}</p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
