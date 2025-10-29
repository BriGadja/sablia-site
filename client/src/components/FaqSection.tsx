import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question:
      "J'ai zéro compétence en tech, est-ce que je vais comprendre comment utiliser vos solutions ?",
    answer:
      "Absolument ! Nos outils sont conçus pour être intuitifs et faciles à utiliser. Nous vous accompagnons pas à pas dans la prise en main et restons disponibles pour répondre à vos questions.",
  },
  {
    question: "Combien de temps faut-il pour mettre en place une automatisation ?",
    answer:
      "La durée dépend de la complexité de vos besoins. En général, nos solutions sont opérationnelles en 2 à 4 semaines, incluant les phases de test et d'ajustement.",
  },
  {
    question: "Est-ce que je peux personnaliser les automatisations selon mes besoins ?",
    answer:
      "Oui, toutes nos solutions sont développées sur mesure pour s'adapter parfaitement à vos processus existants et à vos objectifs spécifiques.",
  },
  {
    question: "Quel retour sur investissement puis-je espérer ?",
    answer:
      "Nos clients constatent en moyenne une réduction de 70% du temps passé sur les tâches automatisées, permettant de se concentrer sur les activités à plus forte valeur ajoutée.",
  },
  {
    question: "Comment assurez-vous la sécurité des données ?",
    answer:
      "Nous utilisons des technologies de pointe et respectons les normes de sécurité les plus strictes pour protéger vos données. Tous nos systèmes sont conformes au RGPD.",
  },
  {
    question: "Que se passe-t-il si j'ai besoin de support ?",
    answer:
      "Notre équipe support est disponible en continu pour vous accompagner. Nous garantissons un temps de réponse sous 24h pour toute demande d'assistance.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-12 text-3xl font-bold text-gray-100">
          Questions Fréquentes
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                <AccordionTrigger className="text-left text-gray-100">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
