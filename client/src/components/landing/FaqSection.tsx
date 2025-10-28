import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * FaqSection - Accordion FAQ with Framer Motion animations
 *
 * Features:
 * - 8 FAQ items with accordion behavior
 * - Exclusive accordion: only 1 open at a time
 * - Smooth height animation (300ms)
 * - Plus/Minus icon swap with rotation
 * - 2-column desktop, 1-column mobile
 * - Glassmorphism styling
 * - Staggered reveal on scroll
 */

// ============================================
// TypeScript Interface
// ============================================

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// ============================================
// FAQ Data
// ============================================

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "Quels sont les outils d'automatisation que vous utilisez ?",
    answer: "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation."
  },
  {
    id: 2,
    question: "Combien de temps faut-il pour automatiser un processus ?",
    answer: "Un workflow simple peut être développé en 3-7 jours. Pour un système complet avec plusieurs processus interconnectés, comptez 2-4 semaines. Chaque projet inclut une phase d'audit pour vous donner un calendrier précis."
  },
  {
    id: 3,
    question: "Mes équipes doivent-elles avoir des compétences techniques ?",
    answer: "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Les formations sont adaptées au niveau de chacun et incluent des cas pratiques métier."
  },
  {
    id: 4,
    question: "Quel est le ROI typique d'un projet d'automatisation ?",
    answer: "En moyenne, nos clients économisent entre 50 000€ et 150 000€ par an pour une transformation complète. Le ROI se mesure en heures de travail économisées, réduction d'erreurs, et capacité à scaler sans recruter."
  },
  {
    id: 5,
    question: "Proposez-vous un support après la mise en production ?",
    answer: "Oui. Chaque projet inclut une période de support post-livraison (2 semaines à 3 mois selon l'offre). Nous proposons également des accompagnements continus via nos formules de retainer."
  },
  {
    id: 6,
    question: "Peut-on commencer petit avant de transformer toute l'entreprise ?",
    answer: "Absolument. Nous recommandons de démarrer par l'Audit Express (350€) ou un Workflow Simple (2 500-5 000€) pour valider l'approche. Vous pouvez ensuite scaler progressivement selon vos besoins."
  },
  {
    id: 7,
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Nous accompagnons principalement des PME et ETI (10-250 personnes). Notre expertise est particulièrement adaptée aux structures qui souhaitent gagner en efficacité sans déployer des solutions enterprise complexes."
  },
  {
    id: 8,
    question: "Quelle est la différence entre n8n et Make.com ?",
    answer: "N8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com (ex-Integromat) est un SaaS européen plus accessible pour débuter. Nous vous guidons vers l'outil le mieux adapté à votre contexte."
  }
];

// ============================================
// Main Component
// ============================================

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur nos services d'automatisation
          </p>
        </ScrollReveal>

        {/* FAQ Grid - 2 columns desktop, 1 column mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-v2-charcoal/30 backdrop-blur-md rounded-xl overflow-hidden border border-v2-cyan/20"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-v2-charcoal/50 transition-colors"
                aria-expanded={activeId === faq.id}
                aria-label={`${faq.question} - ${activeId === faq.id ? 'Cliquez pour fermer' : 'Cliquez pour voir la réponse'}`}
              >
                <h3 className="text-base sm:text-lg font-semibold text-v2-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeId === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                  aria-hidden="true"
                >
                  {activeId === faq.id ? (
                    <Minus size={24} className="text-v2-cyan" />
                  ) : (
                    <Plus size={24} className="text-v2-cyan" />
                  )}
                </motion.div>
              </button>

              {/* Answer (Animated with AnimatePresence) */}
              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div
                    key={`answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-base sm:text-lg text-v2-off-white/80 leading-relaxed">
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
  );
}
