import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Search, Rocket, Zap } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment automatiser votre entreprise avec Sablia",
  "description": "Processus en 3 étapes pour transformer et automatiser vos opérations business avec n8n et Make.com",
  "totalTime": "P12W",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "minValue": "350",
    "maxValue": "60000",
  },
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Découvrir", "text": "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.", "url": "https://sablia.io/#process" },
    { "@type": "HowToStep", "position": 2, "name": "Implémenter", "text": "Formation de vos équipes et/ou développement des workflows selon votre besoin. Approche modulaire adaptée à votre contexte.", "url": "https://sablia.io/#process" },
    { "@type": "HowToStep", "position": 3, "name": "Optimiser & Accompagner", "text": "Sur la base des retours terrain, nous adaptons vos workflows : modifications, formation de nouveaux collaborateurs, mises à jour et optimisation continue.", "url": "https://sablia.io/#process" },
  ],
};

interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  badges?: Array<{ label: string; duration: string }>;
}

const steps: Step[] = [
  {
    id: 1,
    icon: <Search size={28} className="text-sablia-accent" />,
    title: "Découvrir",
    description: "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.",
    duration: "Modulaire",
    badges: [
      { label: "Audit Express", duration: "1h30" },
      { label: "Audit Complet", duration: "Jusqu'à 2 semaines" },
    ],
  },
  {
    id: 2,
    icon: <Zap size={28} className="text-sablia-accent" />,
    title: "Implémenter",
    description: "Formation de vos équipes et/ou développement des workflows selon votre besoin. Approche modulaire adaptée à votre contexte.",
    duration: "Modulaire",
    badges: [
      { label: "Formation", duration: "1-5 jours" },
      { label: "Développement", duration: "2-8 semaines" },
      { label: "Hybride", duration: "Combiné" },
    ],
  },
  {
    id: 3,
    icon: <Rocket size={28} className="text-sablia-accent" />,
    title: "Optimiser & Accompagner",
    description: "Sur la base des retours terrain, nous adaptons vos workflows : modifications, formation de nouveaux collaborateurs, mises à jour et optimisation continue.",
    duration: "Continu",
  },
];

export default function ThreeStepProcess() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      </Helmet>

      <section id="process" className="py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-center text-sablia-text mb-3">
              Notre processus en 3 étapes
            </h2>
            <p className="text-lg text-sablia-text-secondary text-center mb-20 max-w-2xl mx-auto">
              De l'audit initial à l'optimisation continue, nous accompagnons votre transformation digitale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="relative bg-sablia-bg border border-sablia-border rounded p-8 hover:shadow-warm-sm transition-all duration-200"
              >
                <div className="absolute top-4 right-4 text-6xl font-display font-bold text-sablia-accent/[0.06] leading-none">
                  {step.id}
                </div>

                <div className="relative z-10 mb-5">
                  <div className="w-14 h-14 rounded-full border border-sablia-accent/15 flex items-center justify-center bg-sablia-accent/[0.04]">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-sablia-text mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-base text-sablia-text-secondary mb-4 leading-relaxed relative z-10">
                  {step.description}
                </p>

                {step.badges && (
                  <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                    {step.badges.map((badge, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-sablia-surface border border-sablia-border text-sm"
                      >
                        <span className="text-sablia-text font-medium">{badge.label}</span>
                        <span className="text-sablia-text-tertiary text-xs">· {badge.duration}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="inline-block px-3 py-1.5 rounded bg-sablia-accent/[0.06] text-sablia-accent text-sm font-medium relative z-10">
                  {step.duration}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
