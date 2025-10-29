import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * SolutionSection - 4-pillar horizontal layout with separators
 *
 * Features:
 * - Horizontal layout desktop (flex-row) with vertical separators
 * - Vertical stack mobile (flex-col) without separators
 * - Staggered fade-in animation (Framer Motion whileInView)
 * - Icons: Search (56px), Sparkles (56px), ShieldCheck (56px), TrendingUp (56px)
 * - Copy: Diagnostic Complet, Solutions Spécifiques, Sécurité & Conformité, ROI Mesurable
 */

interface Solution {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const solutions: Solution[] = [
  {
    id: 1,
    icon: <Search size={56} className="text-v2-cyan" />,
    title: "Diagnostic Complet",
    description:
      "Audit de vos processus, identification des opportunités d'automatisation et accompagnement personnalisé : formation, conseil ou développement.",
  },
  {
    id: 2,
    icon: <Sparkles size={56} className="text-v2-cyan" />,
    title: "Solutions Spécifiques",
    description:
      "Votre entreprise est unique, nos solutions aussi. Chaque automatisation est développée sur-mesure pour répondre précisément à vos besoins.",
  },
  {
    id: 3,
    icon: <ShieldCheck size={56} className="text-v2-cyan" />,
    title: "Sécurité & Conformité",
    description:
      "Vos données restent protégées. Nous respectons le RGPD et privilégions des solutions européennes pour garantir la sécurité de vos informations.",
  },
  {
    id: 4,
    icon: <TrendingUp size={56} className="text-v2-cyan" />,
    title: "ROI Mesurable",
    description:
      "Chaque automatisation génère un ROI quantifiable. Nous mesurons temps gagné et économies réalisées.",
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal direction="fade" duration={0.8}>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            La méthode Sablia
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Une approche qui place l'humain au centre de l'automatisation
          </p>
        </ScrollReveal>

        {/* Pillars Layout with Separators */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-0">
          {solutions.map((solution, index) => (
            <React.Fragment key={solution.id}>
              {/* Pillar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex-1 flex flex-col items-center text-center px-8"
              >
                {/* Icon */}
                <div className="mb-6">{solution.icon}</div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-4">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-base sm:text-lg text-v2-off-white/80 leading-relaxed max-w-sm mx-auto">
                  {solution.description}
                </p>
              </motion.div>

              {/* Separator (except after last pillar) */}
              {index < solutions.length - 1 && (
                <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
