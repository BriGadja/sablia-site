import { motion } from "framer-motion";
import { useState } from "react";
import Container from "./Container";
import Section from "./Section";
import { Button } from "./Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

const pathways = [
  {
    id: 'discover',
    title: 'DÉCOUVRIR',
    subtitle: 'Voir si l\'automation a du sens',
    popular: false,
    items: [
      {
        name: 'Appel gratuit',
        price: 'GRATUIT',
        duration: '30 min',
        features: [
          'Qualification de vos besoins',
          'Première recommandation',
          'Estimation ROI rapide'
        ],
        ctaText: 'Réserver mon appel',
        ctaHref: 'https://calendly.com/brice-gachadoat/30min',
      },
      {
        name: 'Audit Express',
        price: '350€',
        duration: '1h30 + document',
        features: [
          'Analyse approfondie de 1-2 processus',
          'Document 5-10 pages avec recommandations',
          'Estimations de gains chiffrées'
        ],
        ctaText: 'Commander un audit',
        ctaHref: '/contact',
      },
    ],
  },
  {
    id: 'transform',
    title: 'TRANSFORMER',
    subtitle: 'Premiers workflows opérationnels',
    popular: true,
    items: [
      {
        name: 'Mission Sprint',
        price: '2 500€',
        duration: '2 semaines',
        features: [
          '2-3 workflows n8n clés en main',
          'Formation de votre équipe (4h)',
          'Documentation complète',
          '1 mois de support'
        ],
        ctaText: 'Démarrer un sprint',
        ctaHref: '/contact',
      },
      {
        name: 'Programme Pilote',
        price: 'À partir de 5 000€',
        duration: '1-2 mois',
        features: [
          'Audit complet + architecture',
          '5-10 workflows interconnectés',
          'Formation approfondie (2 jours)',
          '3 mois de support et optimisation'
        ],
        ctaText: 'Lancer un pilote',
        ctaHref: '/contact',
      },
    ],
  },
  {
    id: 'realize',
    title: 'RÉALISER',
    subtitle: 'Transformation à l\'échelle',
    popular: false,
    items: [
      {
        name: 'Transformation Complète',
        price: 'Sur devis',
        duration: '3-6 mois',
        features: [
          'Architecture enterprise complète',
          'Automatisation de tous vos processus critiques',
          'Formation continue de vos équipes',
          'Support illimité pendant la mission',
          'Roadmap évolutive post-lancement'
        ],
        ctaText: 'Discuter de mon projet',
        ctaHref: '/contact',
      },
    ],
  },
];

export default function PricingPathways() {
  const [expandedPathway, setExpandedPathway] = useState<string | null>('transform');

  return (
    <Section background="navy" spacing="default" id="tarifs">
      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-white mb-6"
          >
            Choisissez votre{" "}
            <span className="text-v2-cyan">point d'entrée</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-white/80"
          >
            3 parcours adaptés à votre maturité et vos ambitions
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pathways.map((pathway, pathwayIndex) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: pathwayIndex * 0.1 }}
              className="relative"
            >
              {pathway.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-v2-cyan text-v2-navy px-4 py-1 rounded-full text-xs font-bold z-10">
                  PLUS POPULAIRE
                </div>
              )}

              <Card className={`h-full ${pathway.popular ? 'border-2 border-v2-cyan' : ''}`}>
                <CardHeader>
                  <div className="text-xs font-bold text-v2-electric uppercase tracking-wider mb-2">
                    {pathway.title}
                  </div>
                  <CardTitle className="text-xl">{pathway.subtitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pathway.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="font-bold text-v2-navy">{item.name}</h4>
                          <span className="text-lg font-bold text-v2-electric">{item.price}</span>
                        </div>
                        <p className="text-sm text-v2-charcoal/60 mb-3">{item.duration}</p>

                        <button
                          onClick={() => setExpandedPathway(
                            expandedPathway === `${pathway.id}-${itemIndex}`
                              ? null
                              : `${pathway.id}-${itemIndex}`
                          )}
                          className="text-sm text-v2-electric hover:text-v2-cyan transition-colors mb-3 flex items-center gap-1"
                        >
                          {expandedPathway === `${pathway.id}-${itemIndex}` ? 'Masquer' : 'Voir'} les détails
                          <motion.svg
                            animate={{ rotate: expandedPathway === `${pathway.id}-${itemIndex}` ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>

                        {expandedPathway === `${pathway.id}-${itemIndex}` && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 mb-4"
                          >
                            {item.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-2 text-sm text-v2-charcoal/80">
                                <span className="text-v2-cyan mt-0.5">✓</span>
                                {feature}
                              </li>
                            ))}
                          </motion.ul>
                        )}

                        <Button
                          size="sm"
                          variant={pathway.popular ? "primary" : "outline"}
                          className="w-full"
                          onClick={() => {
                            if (item.ctaHref.startsWith('http')) {
                              window.open(item.ctaHref, '_blank');
                            } else {
                              window.location.href = item.ctaHref;
                            }
                          }}
                        >
                          {item.ctaText}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
