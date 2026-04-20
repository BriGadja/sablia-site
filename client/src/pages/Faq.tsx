import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '@/components/animations/ScrollReveal'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'Combien coûte le Diagnostic Sablia ?',
    answer:
      "490€ HT. TVA non applicable (art. 293 B du CGI). Paiement upfront par Stripe ou virement. Ce prix couvre l'intake, la session de deep-dive de 3 heures, la rédaction du livrable PDF de 10 à 15 pages, et la restitution d'une heure. Pas de coût caché, pas de dépassement. Si, dans les 90 jours suivant la restitution, vous signez un contrat Développement ou Accompagnement avec Sablia, les 490€ sont intégralement déduits de votre première facture. Non applicable au path Formation d'équipes internes (qui reste facturé au plein tarif de sa fourchette).",
  },
  {
    question: 'Combien de temps ça prend ?',
    answer:
      "Cinq jours ouvrés entre la fin de l'intake et la restitution du PDF. L'intake lui-même dure 45 minutes (un formulaire asynchrone + un appel de 15 minutes pour clarifier). Le deep-dive synchrone dure 3 heures. La restitution dure 1 heure.",
  },
  {
    question: "Pour quel type d'entreprise ?",
    answer:
      "PME de 10 à 250 salariés avec au moins un process manuel qui coûte 5 heures ou plus par semaine à l'équipe. Le diagnostic est taillé pour les structures qui ont déjà des opérations en place, pas pour valider une idée de startup. Si votre process ne saigne pas encore 5h+/semaine, attendez.",
  },
  {
    question: 'Que se passe-t-il après le diagnostic ?',
    answer:
      "Le livrable PDF contient une recommandation claire parmi trois paths : formation d'équipes internes, accompagnement d'un sponsor interne, ou développement des automatisations par Sablia. Vous êtes libre de choisir n'importe lequel, de les combiner, ou de décliner, le diagnostic se tient seul, sans obligation de continuer.",
  },
  {
    question: 'Quelle est la politique de remboursement ?',
    answer:
      "Jusqu'à 72 heures avant l'intake, annulation avec remboursement intégral sans justification. Une fois l'intake démarré, le diagnostic est non-remboursable, parce que le travail d'analyse commence immédiatement après.",
  },
  {
    question: 'Pourquoi un diagnostic payant et pas un audit gratuit ?',
    answer:
      "Un audit gratuit dure 30 minutes et finit toujours par recommander ce que le prestataire vend. Un diagnostic payant de 5 jours cartographie réellement vos process et peut conclure qu'aucune implémentation IA n'est pertinente chez vous. On préfère qu'on vous dise ça plutôt qu'on vous vende une solution qui ne marchera pas. Le coût du diagnostic protège la qualité de la recommandation.",
  },
  {
    question: "En quoi Sablia est-il différent d'IAPreneurs ?",
    answer:
      "IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'intelligence artificielle. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients, Brice exerce simplement les deux rôles. IAPreneurs s'adresse à des freelances et consultants IA en construction. Sablia s'adresse à des dirigeants de PME de 10 à 250 salariés avec des process opérationnels déjà en place.",
  },
  {
    question: 'Quels outils utilisez-vous pour implémenter les automatisations ?',
    answer:
      "Principalement n8n (auto-hébergé, souveraineté totale) pour les workflows, Dipler pour les agents vocaux, et les modèles LLM (OpenAI, Claude, Mistral) pour les capacités IA. Le choix exact est arbitré pendant le diagnostic selon votre stack existante et vos contraintes de confidentialité.",
  },
  {
    question: 'Comment garantissez-vous la sécurité des données ?',
    answer:
      "Hébergement Europe (RGPD-compliant), chiffrement TLS 1.3 en transit et AES-256 au repos, 2FA obligatoire côté Sablia. NDA systématique. Pour les PME qui souhaitent un contrôle total, n8n peut être déployé sur vos propres serveurs — c'est l'un des paths Développement possibles.",
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function Faq() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <>
      <SEO page="/faq" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navigation />

        <main className="pt-20">
          <section className="py-24">
            <div className="container mx-auto px-6 lg:px-8">
              <ScrollReveal>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-sablia-text mb-4">
                  Questions fréquentes
                </h1>
                <p className="text-lg sm:text-xl text-sablia-text-secondary text-center mb-16 max-w-3xl mx-auto">
                  Tout ce que vous voulez savoir avant de démarrer votre diagnostic.
                </p>
              </ScrollReveal>

              <div className="max-w-3xl mx-auto space-y-3">
                {faqs.map((item, index) => {
                  const isOpen = openItems.has(index)

                  return (
                    <div
                      key={item.question}
                      className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(index)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <h2 className="text-base sm:text-lg font-semibold text-sablia-text pr-4">
                          {item.question}
                        </h2>
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                          aria-hidden="true"
                        >
                          {isOpen ? (
                            <Minus size={24} className="text-sablia-accent" />
                          ) : (
                            <Plus size={24} className="text-sablia-accent" />
                          )}
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <p className="text-base sm:text-lg text-sablia-text-secondary leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

              <ScrollReveal>
                <div className="text-center mt-16">
                  <p className="text-lg text-sablia-text-secondary mb-6">
                    Prêt à savoir ce qui est automatisable dans votre PME ?
                  </p>
                  <a
                    href="/#diagnostic-form"
                    className="inline-block bg-sablia-accent text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-sablia-accent-hover transition-colors"
                  >
                    Démarrer mon diagnostic, 490€
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <Footer />
        <ScrollToTop />
      </motion.div>
    </>
  )
}
