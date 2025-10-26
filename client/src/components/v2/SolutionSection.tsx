import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

const solutions = [
  {
    title: "Formation-First",
    headline: "Votre équipe POSSÈDE le système",
    description: "Pas de dépendance. Nous formons vos talents pour qu'ils maîtrisent et fassent évoluer leurs automatisations.",
    metrics: ["95% d'autonomie à J+30", "0 ticket de support récurrent"]
  },
  {
    title: "Stack Souverain",
    headline: "100% self-hosted possible",
    description: "n8n open-source sur votre infrastructure. Vos données restent chez vous. Pas de vendor lock-in.",
    metrics: ["RGPD compliant", "Coûts prévisibles"]
  },
  {
    title: "ROI Mesurable",
    headline: "Impact visible en semaines",
    description: "Métriques claires : temps gagné, erreurs évitées, coûts réduits. Transparence totale sur la valeur créée.",
    metrics: ["ROI moyen: 300%", "Payback < 6 mois"]
  }
];

export default function SolutionSection() {
  return (
    <Section background="off-white" spacing="default" id="solutions">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            3 piliers qui nous{" "}
            <span className="text-v2-electric">différencient</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Notre approche unique pour une automation durable
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full border-2 hover:border-v2-electric transition-colors">
                <CardHeader>
                  <div className="text-xs font-bold text-v2-electric uppercase tracking-wider mb-2">
                    {solution.title}
                  </div>
                  <CardTitle className="text-xl">{solution.headline}</CardTitle>
                  <CardDescription>{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {solution.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-v2-cyan">▸</span>
                        <span className="text-sm font-semibold text-v2-navy">{metric}</span>
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
