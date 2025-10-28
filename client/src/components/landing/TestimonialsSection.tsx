import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * TestimonialsSection - Infinite scrolling carousel with social media-style cards
 *
 * Features:
 * - Infinite horizontal scroll (tripled array for seamless loop)
 * - Pause on hover functionality (CSS animation-play-state)
 * - Social media post card design (compact, scannable)
 * - Short testimonial versions for readability while scrolling
 * - Glassmorphism cards with dark theme (v3)
 * - Gradient fade overlays on edges
 * - ScrollReveal animation on section entry
 *
 * Technical Note:
 * - Uses CSS animations instead of Framer Motion for infinite scroll
 *   to preserve position when pausing (animation-play-state: paused)
 * - Framer Motion's animate prop restarts from beginning after pause
 */

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric: string;
  project: string;
}

const testimonials: Testimonial[] = [
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
    name: "Directeur",
    role: "Direction",
    company: "Entreprise anonyme",
    avatar: "DI",
    quote: "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive.",
    metric: "Avantage compétitif décisif",
    project: "Veille concurrentielle"
  },
  {
    name: "Yassine",
    role: "Fondateur",
    company: "Norloc",
    avatar: "YN",
    quote: "Notre gestion des prospects est passée au niveau supérieur. L'agent vocal couplé à l'automatisation du CRM nous fait gagner des heures chaque semaine et améliore nos taux de conversion.",
    metric: "Taux de conversion amélioré",
    project: "Agent vocal + CRM"
  },
  {
    name: "Valentin",
    role: "Fondateur",
    company: "Stefano Design & Exotic Design",
    avatar: "VD",
    quote: "Des milliers de contacts dormants transformés en opportunités commerciales concrètes. L'agent vocal nous a permis d'exploiter un gisement de valeur que nous avions sous-estimé.",
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
  }
];

export default function TestimonialsSection() {
  // Triple array for seamless infinite loop
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl font-semibold text-v2-white/70 uppercase tracking-wider mb-4"
            >
              Ils ont transformé leurs opérations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-v2-white"
            >
              Des résultats mesurables
            </motion.h2>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            {/* Gradient fade overlays - color matches the background gradient at this scroll position (~14% = between #2B9AB8 and #3E92CC) */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#3D92CB] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#3D92CB] to-transparent z-10 pointer-events-none" />

            {/* Scrolling cards wrapper with pause on hover (CSS animation) */}
            <div
              className="flex gap-6 animate-scroll-testimonials"
            >
              {displayTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="flex-shrink-0 w-[320px] md:w-[380px]"
                >
                  {/* Social Media Post Card */}
                  <div className="bg-v2-navy/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-v2-cyan/20 h-full flex flex-col">
                    {/* Header: Avatar + Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-v2-cyan to-v2-electric flex items-center justify-center flex-shrink-0">
                        <span className="text-v2-navy font-bold text-sm">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-v2-white text-lg leading-tight">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-v2-off-white/70">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-v2-off-white/50">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-v2-off-white/90 leading-relaxed mb-4 flex-grow text-sm md:text-base">
                      "{testimonial.quote}"
                    </p>

                    {/* Footer: Metric Badge + Project Tag */}
                    <div className="pt-4 border-t border-v2-white/10 space-y-2">
                      <div className="inline-flex items-center gap-2 bg-v2-cyan/30 text-v2-white px-3 py-1.5 rounded-full">
                        <span className="text-lg">✓</span>
                        <span className="text-sm font-semibold">
                          {testimonial.metric}
                        </span>
                      </div>
                      <p className="text-xs text-v2-off-white/60">
                        Projet : {testimonial.project}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-base sm:text-lg text-v2-off-white/60">
              Projets réels · Résultats vérifiables
            </p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
