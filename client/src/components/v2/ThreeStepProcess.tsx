import { motion } from "framer-motion";
import { useState } from "react";
import Container from "./Container";
import Section from "./Section";
import { Button } from "./Button";

const steps = [
  {
    number: "01",
    title: "Audit & Design",
    duration: "1-2 semaines",
    description: "Cartographie de vos processus actuels et conception de l'architecture d'automation",
    deliverables: [
      "Document d'architecture détaillé",
      "Identification des quick wins (ROI rapide)",
      "Roadmap priorisée sur 90 jours"
    ]
  },
  {
    number: "02",
    title: "Build & Train",
    duration: "2-6 semaines",
    description: "Construction des workflows n8n et formation de votre équipe en parallèle",
    deliverables: [
      "Workflows opérationnels et documentés",
      "Formation hands-on de votre équipe",
      "Documentation technique complète"
    ]
  },
  {
    number: "03",
    title: "Scale & Optimize",
    duration: "Continu",
    description: "Expansion progressive et optimisation continue avec support à la demande",
    deliverables: [
      "Nouvelles automatisations au fil de l'eau",
      "Support technique ponctuel",
      "Revues trimestrielles de performance"
    ]
  }
];

export default function ThreeStepProcess() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <Section background="white" spacing="default" id="processus">
      <Container maxWidth="narrow">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Comment on travaille ensemble
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Un processus simple et transparent en 3 phases
          </motion.p>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-12 top-24 w-0.5 h-12 bg-v2-electric/30" />
              )}

              <button
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                className="w-full text-left bg-v2-white border-2 border-gray-200 hover:border-v2-electric rounded-lg p-6 transition-all duration-200"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-v2-electric to-v2-cyan flex items-center justify-center">
                    <span className="text-2xl font-bold text-v2-white">{step.number}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-v2-navy">{step.title}</h3>
                      <span className="text-sm font-semibold text-v2-electric">{step.duration}</span>
                    </div>
                    <p className="text-v2-charcoal/80 mb-4">{step.description}</p>

                    {expandedStep === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <p className="text-sm font-semibold text-v2-navy mb-3">Livrables:</p>
                        <ul className="space-y-2">
                          {step.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-v2-charcoal/80">
                              <span className="text-v2-cyan mt-1">✓</span>
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <motion.svg
                      animate={{ rotate: expandedStep === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-6 h-6 text-v2-charcoal/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
          >
            Commencer par l'étape 1
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
