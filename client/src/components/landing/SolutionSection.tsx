import React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

interface Solution {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const solutions: Solution[] = [
  {
    id: 1,
    icon: <Search size={32} className="text-sablia-accent" />,
    title: "Diagnostic Complet",
    description:
      "Audit de vos processus, identification des opportunités d'automatisation et accompagnement personnalisé : formation, conseil ou développement.",
  },
  {
    id: 2,
    icon: <Sparkles size={32} className="text-sablia-accent" />,
    title: "Solutions Spécifiques",
    description:
      "Votre entreprise est unique, nos solutions aussi. Chaque automatisation est développée sur-mesure pour répondre précisément à vos besoins.",
  },
  {
    id: 3,
    icon: <ShieldCheck size={32} className="text-sablia-accent" />,
    title: "Sécurité & Conformité",
    description:
      "Vos données restent protégées. Nous respectons le RGPD et privilégions des solutions européennes pour garantir la sécurité de vos informations.",
  },
  {
    id: 4,
    icon: <TrendingUp size={32} className="text-sablia-accent" />,
    title: "ROI Mesurable",
    description:
      "Chaque automatisation génère un ROI quantifiable. Nous mesurons temps gagné et économies réalisées.",
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-32 bg-sablia-surface">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-sablia-text mb-3">
            La méthode Sablia
          </h2>
          <p className="text-lg text-sablia-text-secondary text-center mb-16 max-w-2xl mx-auto">
            Une approche qui place l'humain au centre de l'automatisation
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-0 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <React.Fragment key={solution.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex-1 flex flex-col items-center text-center px-6"
              >
                <div className="mb-5">{solution.icon}</div>
                <h3 className="text-xl font-semibold text-sablia-text mb-3">
                  {solution.title}
                </h3>
                <p className="text-base text-sablia-text-secondary leading-relaxed max-w-xs mx-auto">
                  {solution.description}
                </p>
              </motion.div>

              {index < solutions.length - 1 && (
                <div className="hidden lg:block h-40 w-px bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
