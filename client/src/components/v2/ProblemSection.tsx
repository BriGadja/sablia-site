import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

const problems = [
  {
    icon: "⏱️",
    title: "Collaborateurs surchargés",
    description: "Vos talents passent 40% de leur temps sur des tâches répétitives au lieu d'innover",
    before: "15h/semaine perdues en copier-coller",
    after: "Focus sur stratégie et relation client"
  },
  {
    icon: "📊",
    title: "Données éparpillées",
    description: "8 outils différents, 0 vision d'ensemble. Les informations critiques se perdent",
    before: "Erreurs de saisie, doublons, incohérences",
    after: "Source unique de vérité, synchro temps réel"
  },
  {
    icon: "🔥",
    title: "Burnout silencieux",
    description: "Votre équipe accomplit des tâches qu'un robot ferait mieux, plus vite et sans fatigue",
    before: "Démotivation, turnover élevé",
    after: "Équipe concentrée sur haute valeur ajoutée"
  }
];

export default function ProblemSection() {
  return (
    <Section background="white" spacing="default" id="probleme">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Vous êtes coincé entre{" "}
            <span className="text-v2-electric">croissance</span> et{" "}
            <span className="text-v2-cyan">burnout</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Ces problèmes vous empêchent de scaler sans casser votre équipe
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="text-5xl mb-4">{problem.icon}</div>
                  <CardTitle className="text-xl">{problem.title}</CardTitle>
                  <CardDescription>{problem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">❌</span>
                      <span className="text-sm text-v2-charcoal/70">{problem.before}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✅</span>
                      <span className="text-sm text-v2-charcoal/70">{problem.after}</span>
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
