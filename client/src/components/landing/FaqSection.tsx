import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  { id: 1, question: "Quels sont les outils d'automatisation que vous utilisez ?", answer: "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation." },
  { id: 2, question: "Combien de temps faut-il pour automatiser un processus ?", answer: "Un workflow simple peut être développé en 3-7 jours. Pour un système complet avec plusieurs processus interconnectés, comptez 2-4 semaines. Chaque projet inclut une phase d'audit pour vous donner un calendrier précis." },
  { id: 3, question: "Mes équipes doivent-elles avoir des compétences techniques ?", answer: "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Les formations sont adaptées au niveau de chacun et incluent des cas pratiques métier." },
  { id: 4, question: "Quel est le ROI typique d'un projet d'automatisation ?", answer: "En moyenne, nos clients économisent entre 50 000€ et 150 000€ par an pour une transformation complète. Le ROI se mesure en heures de travail économisées, réduction d'erreurs, et capacité à scaler sans recruter." },
  { id: 5, question: "Proposez-vous un support après la mise en production ?", answer: "Oui. Chaque projet inclut une période de support post-livraison (2 semaines à 3 mois selon l'offre). Nous proposons également des accompagnements continus via nos formules de retainer." },
  { id: 6, question: "Peut-on commencer petit avant de transformer toute l'entreprise ?", answer: "Absolument. Nous recommandons de démarrer par l'Audit Express (350€) ou un Workflow Simple (2 500-5 000€) pour valider l'approche. Vous pouvez ensuite scaler progressivement selon vos besoins." },
  { id: 7, question: "Travaillez-vous avec des entreprises de toutes tailles ?", answer: "Nous accompagnons principalement des PME et ETI (10-250 personnes). Notre expertise est particulièrement adaptée aux structures qui souhaitent gagner en efficacité sans déployer des solutions enterprise complexes." },
  { id: 8, question: "Quelle est la différence entre n8n et Make.com ?", answer: "N8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com (ex-Integromat) est un SaaS européen plus accessible pour débuter. Nous vous guidons vers l'outil le mieux adapté à votre contexte." },
];

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
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
              Tout ce que vous devez savoir sur nos services d'automatisation
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
                  aria-label={`${faq.question} - ${activeId === faq.id ? "Cliquez pour fermer" : "Cliquez pour voir la réponse"}`}
                >
                  <h3 className="text-base font-medium text-sablia-text pr-4">
                    {faq.question}
                  </h3>
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
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
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

          <div className="text-center mt-10">
            <a
              href="/faq"
              className="inline-block text-sablia-accent hover:text-sablia-accent-hover font-medium text-base underline underline-offset-4 transition-colors"
            >
              Voir toutes les questions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
