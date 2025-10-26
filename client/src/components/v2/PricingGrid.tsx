import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "./Button";

const pricingServices = [
  {
    title: "Audit de Processus",
    price: "350€",
    duration: "1h30",
    roi: "Identifie 5-10h/semaine de gains",
    features: [
      "Analyse 1-2 processus métier",
      "Document 5-10 pages",
      "Recommandations actionnables",
      "Estimations ROI chiffrées"
    ],
    examples: ["Onboarding client", "Facturation mensuelle"]
  },
  {
    title: "Workflow Simple",
    price: "800€",
    duration: "1 semaine",
    roi: "ROI en 2-3 mois",
    features: [
      "1 workflow n8n opérationnel",
      "Formation utilisateur (1h)",
      "Documentation",
      "1 mois de support"
    ],
    examples: ["Sync CRM → Facturation", "Veille concurrentielle"]
  },
  {
    title: "Mission Sprint",
    price: "2 500€",
    duration: "2 semaines",
    roi: "ROI en 3-4 mois",
    features: [
      "2-3 workflows interconnectés",
      "Formation équipe (4h)",
      "Documentation complète",
      "2 mois de support"
    ],
    examples: ["Onboarding automatisé", "Reporting multi-sources"]
  },
  {
    title: "Programme Pilote",
    price: "5 000€+",
    duration: "1-2 mois",
    roi: "ROI en 4-6 mois",
    features: [
      "Audit complet + architecture",
      "5-10 workflows clés",
      "Formation approfondie (2j)",
      "3 mois de support"
    ],
    examples: ["Hub d'intégration", "Automatisation ventes"]
  },
  {
    title: "Formation n8n",
    price: "1 200€/jour",
    duration: "1-2 jours",
    roi: "Autonomie à long terme",
    features: [
      "Formation sur mesure",
      "Exercices pratiques",
      "Documentation personnalisée",
      "Support post-formation (1 mois)"
    ],
    examples: ["Équipe IT", "Power users"]
  },
  {
    title: "Support Mensuel",
    price: "500€/mois",
    duration: "Récurrent",
    roi: "Continuité opérationnelle",
    features: [
      "4h de support technique/mois",
      "Optimisation continue",
      "Nouveaux workflows simples",
      "Veille technologique"
    ],
    examples: ["Maintenance", "Évolution progressive"]
  }
];

export default function PricingGrid() {
  return (
    <Section background="off-white" spacing="default">
      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Grille tarifaire détaillée
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80 mb-4"
          >
            Transparence totale sur nos prix et le ROI attendu
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-v2-charcoal/60"
          >
            Tous les prix sont HT. Projets personnalisés sur devis.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-baseline mb-2">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <span className="text-2xl font-bold text-v2-electric">{service.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-v2-charcoal/60 mb-3">
                    <span>⏱️ {service.duration}</span>
                    <span className="text-v2-cyan font-semibold">{service.roi}</span>
                  </div>
                  <CardDescription className="text-sm">
                    Exemples: {service.examples.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-v2-cyan mt-0.5">✓</span>
                        <span className="text-v2-charcoal/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
                  >
                    Discuter de ce service
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-6 bg-v2-white rounded-lg border-2 border-v2-electric"
        >
          <h3 className="text-xl font-bold text-v2-navy mb-2">Besoin d'un projet sur mesure ?</h3>
          <p className="text-v2-charcoal/80 mb-4">
            Pour les transformations complètes et projets enterprise, nous établissons un devis personnalisé
          </p>
          <Button onClick={() => window.location.href = '/contact'}>
            Demander un devis personnalisé
          </Button>
        </motion.div>
      </Container>
    </Section>
  );
}
