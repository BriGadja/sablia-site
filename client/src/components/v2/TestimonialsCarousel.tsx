import { motion } from "framer-motion";
import Container from "./Container";
import Section from "./Section";

const testimonials = [
  {
    name: "Hélène",
    role: "Fondatrice",
    company: "GirlsGang",
    avatar: "HE",
    quote: "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes.",
    metric: "Économie de 90% du temps",
    project: "Génération de menus"
  },
  {
    name: "Yassine",
    role: "Fondateur",
    company: "Norloc",
    avatar: "YN",
    quote: "L'intégration de notre agent vocal avec l'automatisation CRM a révolutionné notre gestion des prospects. Nos équipes gagnent un temps précieux, les informations se centralisent automatiquement, et nous ne perdons plus aucune opportunité.",
    metric: "Zéro opportunité perdue",
    project: "Agent vocal + CRM"
  },
  {
    name: "Valentin",
    role: "Fondateur",
    company: "Stefano Design & Exotic Design",
    avatar: "VD",
    quote: "Nous avions des milliers de contacts dormants dans nos bases de données, un trésor inexploité. L'agent vocal nous permet aujourd'hui de réactiver ces prospects de manière automatisée et personnalisée. C'est comme avoir une équipe commerciale qui travaille 24/7.",
    metric: "Milliers de contacts réactivés",
    project: "Réactivation automatisée de BDD"
  },
  {
    name: "Amir",
    role: "Fondateur",
    company: "Entreprise BTP",
    avatar: "AM",
    quote: "De la demande client au suivi de chantier, tout est automatisé. Plus de temps perdu, plus d'erreurs, juste de l'efficacité. Notre organisation a été transformée.",
    metric: "Organisation transformée",
    project: "Gestion des interventions"
  },
  {
    name: "Directeur",
    role: "Direction",
    company: "Scale-up française",
    avatar: "DI",
    quote: "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive.",
    metric: "Avantage compétitif décisif",
    project: "Veille concurrentielle"
  }
];

export default function TestimonialsCarousel() {
  // Triple the testimonials for seamless infinite scroll
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Calculate total width: card width (400px) + gap (24px)
  const cardWidth = 400 + 24;
  const totalWidth = testimonials.length * cardWidth;

  return (
    <Section background="off-white" spacing="compact">
      <Container>
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-v2-electric uppercase tracking-wider mb-3"
          >
            Ils ont transformé leurs opérations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-v2-navy"
          >
            Des résultats mesurables, des équipes autonomes
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          {/* Continuously scrolling testimonials */}
          <motion.div
            className="flex gap-6"
            animate={{
              x: [`0px`, `-${totalWidth}px`]
            }}
            transition={{
              duration: 30, // 30 seconds for full cycle
              ease: "linear",
              repeat: Infinity
            }}
          >
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="flex-shrink-0 w-[400px]"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Social Media Post Card */}
                <div className="bg-v2-white rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
                  {/* Header with Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-v2-electric to-v2-cyan flex items-center justify-center flex-shrink-0">
                      <span className="text-v2-white font-bold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-v2-navy text-lg leading-tight">{testimonial.name}</h3>
                      <p className="text-sm text-v2-charcoal/70">{testimonial.role}</p>
                      <p className="text-xs text-v2-charcoal/50">{testimonial.company}</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-v2-charcoal/80 leading-relaxed mb-4 flex-grow">
                    "{testimonial.quote}"
                  </p>

                  {/* Footer with Metric & Project */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="inline-flex items-center gap-2 bg-v2-electric/10 text-v2-electric px-3 py-1.5 rounded-full">
                      <span className="text-xl">✓</span>
                      <span className="text-sm font-semibold">{testimonial.metric}</span>
                    </div>
                    <p className="text-xs text-v2-charcoal/50">Projet : {testimonial.project}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-sm text-v2-charcoal/60">
            Projets réels · Résultats vérifiables
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
