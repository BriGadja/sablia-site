import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardDescription, CardContent } from "./Card";

const testimonials = [
  {
    name: "Sophie Durand",
    role: "Directrice Opérations",
    company: "TechStart SaaS",
    content: "Sablia a transformé notre onboarding client. Ce qui prenait 2h se fait maintenant en 10 minutes. Notre équipe peut enfin se concentrer sur l'accompagnement personnalisé.",
    metric: "85% de temps gagné",
    avatar: "SD"
  },
  {
    name: "Marc Lefebvre",
    role: "CEO",
    company: "Agence Digital Plus",
    content: "La formation-first approach fait toute la différence. Mon équipe maîtrise n8n et crée ses propres workflows. Plus de dépendance à un prestataire externe.",
    metric: "100% autonomie à J+45",
    avatar: "ML"
  },
  {
    name: "Julie Chen",
    role: "COO",
    company: "Retail Connect",
    content: "ROI atteint en 3 mois. Notre sync multi-canal (Shopify, Amazon, WooCommerce) fonctionne 24/7 sans intervention. Zéro erreur de stock depuis le déploiement.",
    metric: "ROI 320% en 6 mois",
    avatar: "JC"
  },
  {
    name: "Thomas Bernard",
    role: "Head of Sales",
    company: "CloudSolutions",
    content: "Le reporting automatisé nous fait gagner 12h/semaine. Les données de 5 sources différentes sont consolidées en temps réel dans notre dashboard.",
    metric: "12h/semaine économisées",
    avatar: "TB"
  },
  {
    name: "Émilie Rousseau",
    role: "DRH",
    company: "Talents & Co",
    content: "L'automatisation du process de recrutement a changé la donne. Tri CV, emails de suivi, planification entretiens... Tout se fait automatiquement.",
    metric: "50% de candidats en plus traités",
    avatar: "ER"
  },
  {
    name: "Alexandre Martin",
    role: "CTO",
    company: "FinTech Innovate",
    content: "Stack souverain, données on-premise, full control. Exactement ce qu'on cherchait. La compliance RGPD était notre priorité absolue.",
    metric: "100% RGPD compliant",
    avatar: "AM"
  }
];

export default function TestimonialGrid() {
  return (
    <Section background="white" spacing="default" id="cas-clients">
      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Ils ont transformé leurs opérations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Des résultats mesurables, des équipes autonomes
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-v2-electric to-v2-cyan flex items-center justify-center text-v2-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-v2-navy text-base truncate">{testimonial.name}</h3>
                      <p className="text-sm text-v2-charcoal/60">{testimonial.role}</p>
                      <p className="text-xs text-v2-charcoal/50">{testimonial.company}</p>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-v2-cyan/10 rounded-full">
                      <span className="text-sm font-semibold text-v2-navy">{testimonial.metric}</span>
                    </div>
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
