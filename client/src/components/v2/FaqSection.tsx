import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Pourquoi n8n plutôt que Zapier ou Make ?",
    answer: "n8n est open-source et peut être self-hosted, vous donnant un contrôle total sur vos données et évitant le vendor lock-in. Les coûts sont prévisibles (pas de tarification par tâche), et votre équipe peut personnaliser entièrement les workflows. Pour la conformité RGPD et la souveraineté des données, c'est un avantage majeur."
  },
  {
    question: "Combien de temps avant de voir des résultats ?",
    answer: "Pour un Workflow Simple: 1 semaine. Pour une Mission Sprint: 2-3 semaines. Les premiers gains de productivité sont visibles dès la mise en production. Le ROI complet est généralement atteint en 3-6 mois selon la complexité du projet."
  },
  {
    question: "Mon équipe doit-elle avoir des compétences techniques ?",
    answer: "Non. Notre approche formation-first signifie que nous adaptons la formation à votre équipe. Pour utiliser les workflows: aucune compétence technique requise. Pour les créer/modifier: une formation de 4h à 2 jours suffit selon le niveau d'autonomie souhaité."
  },
  {
    question: "Que se passe-t-il après la fin de la mission ?",
    answer: "Vous êtes 100% autonome. Tous les workflows sont documentés, votre équipe est formée, et vous possédez le code. Nous proposons du support optionnel (500€/mois pour 4h) si vous souhaitez un accompagnement continu, mais ce n'est jamais obligatoire."
  },
  {
    question: "Les données restent-elles chez moi ?",
    answer: "Oui, si vous choisissez le self-hosting. n8n peut tourner sur votre infrastructure (serveur dédié, cloud privé, ou même on-premise). Pour les projets nécessitant une conformité stricte, nous recommandons systématiquement cette approche."
  },
  {
    question: "Quel est le coût de maintenance à long terme ?",
    answer: "Les workflows n8n nécessitent très peu de maintenance une fois en place. Si vous êtes self-hosted: coût du serveur (~30-100€/mois selon la charge). Si vous prenez notre support optionnel: 500€/mois pour 4h d'assistance. Aucun coût caché ou frais récurrents obligatoires."
  },
  {
    question: "Comment calculez-vous le ROI ?",
    answer: "Nous mesurons: (1) Temps gagné × coût horaire de votre équipe, (2) Erreurs évitées × coût moyen d'une erreur, (3) Opportunités capturées grâce au temps libéré. Chaque projet inclut un dashboard avec ces métriques actualisées en temps réel."
  },
  {
    question: "Que se passe-t-il si un workflow casse ?",
    answer: "Les workflows n8n sont robustes et incluent une gestion d'erreur native. Si un problème survient: (1) Notifications automatiques, (2) Logs détaillés pour diagnostic, (3) Votre équipe formée peut corriger 90% des problèmes courants. Pour le reste, notre support est disponible."
  }
];

export default function FaqSection() {
  return (
    <Section background="off-white" spacing="default">
      <Container maxWidth="narrow">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Questions fréquentes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Tout ce que vous devez savoir avant de vous lancer
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-v2-white border border-gray-200 rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-v2-navy pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-v2-charcoal/80 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-v2-white rounded-lg border-2 border-v2-cyan"
        >
          <h3 className="text-2xl font-bold text-v2-navy mb-3">Encore des questions ?</h3>
          <p className="text-v2-charcoal/80 mb-6">
            Réservez un appel gratuit de 30 minutes pour discuter de votre projet
          </p>
          <button
            onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-v2-cyan text-v2-white font-semibold rounded-md hover:bg-v2-cyan/90 transition-colors"
          >
            Réserver mon appel gratuit
          </button>
        </motion.div>
      </Container>
    </Section>
  );
}
