import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

interface FaqItem {
  id: number
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: 'Combien coûte le Diagnostic Sablia ?',
    answer:
      "490€ HT. TVA non applicable (art. 293 B du CGI). Paiement upfront par Stripe ou virement. Ce prix couvre l'intake, la session de deep-dive de 3 heures, la rédaction du livrable PDF de 10 à 15 pages, et la restitution d'une heure. Pas de coût caché, pas de dépassement. Si, dans les 90 jours suivant la restitution, vous signez un contrat Développement ou Accompagnement avec Sablia, les 490€ sont intégralement déduits de votre première facture. Non applicable au path Formation d'équipes internes (qui reste facturé au plein tarif de sa fourchette).",
  },
  {
    id: 2,
    question: 'Combien de temps ça prend ?',
    answer:
      "Cinq jours ouvrés entre la fin de l'intake et la restitution du PDF. L'intake lui-même dure 45 minutes (un formulaire asynchrone + un appel de 15 minutes pour clarifier). Le deep-dive synchrone dure 3 heures. La restitution dure 1 heure.",
  },
  {
    id: 3,
    question: "Pour quel type d'entreprise ?",
    answer:
      "PME de 10 à 250 salariés avec au moins un process manuel qui coûte 5 heures ou plus par semaine à l'équipe. Le diagnostic est taillé pour les structures qui ont déjà des opérations en place, pas pour valider une idée de startup. Si votre process ne saigne pas encore 5h+/semaine, attendez.",
  },
  {
    id: 4,
    question: 'Que se passe-t-il après le diagnostic ?',
    answer:
      "Le livrable PDF contient une recommandation claire parmi trois paths : formation d'équipes internes, accompagnement d'un sponsor interne, ou développement des automatisations par Sablia. Vous êtes libre de choisir n'importe lequel, de les combiner, ou de décliner, le diagnostic se tient seul, sans obligation de continuer.",
  },
  {
    id: 5,
    question: 'Quelle est la politique de remboursement ?',
    answer:
      "Jusqu'à 72 heures avant l'intake, annulation avec remboursement intégral sans justification. Une fois l'intake démarré, le diagnostic est non-remboursable, parce que le travail d'analyse commence immédiatement après.",
  },
  {
    id: 6,
    question: 'Pourquoi un diagnostic payant et pas un audit gratuit ?',
    answer:
      "Un audit gratuit dure 30 minutes et finit toujours par recommander ce que le prestataire vend. Un diagnostic payant de 5 jours cartographie réellement vos process et peut conclure qu'aucune implémentation IA n'est pertinente chez vous. On préfère qu'on vous dise ça plutôt qu'on vous vende une solution qui ne marchera pas. Le coût du diagnostic protège la qualité de la recommandation.",
  },
  {
    id: 7,
    question: "En quoi Sablia est-il différent d'IAPreneurs ?",
    answer:
      "IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'intelligence artificielle. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients, Brice exerce simplement les deux rôles. IAPreneurs s'adresse à des freelances et consultants IA en construction. Sablia s'adresse à des dirigeants de PME de 10 à 250 salariés avec des process opérationnels déjà en place.",
  },
]

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null)

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id)
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <section id="faq" className="py-32 bg-sablia-surface">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-center text-sablia-text mb-3">
              Questions fréquentes
            </h2>
            <p className="text-lg text-sablia-text-secondary text-center mb-16 max-w-2xl mx-auto">
              Tout ce que vous voulez savoir avant de démarrer votre diagnostic.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="bg-sablia-bg border border-sablia-border rounded overflow-hidden"
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-sablia-surface transition-colors"
                  aria-expanded={activeId === faq.id}
                  aria-label={`${faq.question} - ${activeId === faq.id ? 'Cliquez pour fermer' : 'Cliquez pour voir la réponse'}`}
                >
                  <h3 className="text-base font-medium text-sablia-text pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {activeId === faq.id ? (
                      <Minus size={18} className="text-sablia-accent" />
                    ) : (
                      <Plus size={18} className="text-sablia-text-tertiary" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeId === faq.id && (
                    <motion.div
                      key={`answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <p className="text-base text-sablia-text-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
