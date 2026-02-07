import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric: string;
  project: string;
  before: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Hélène",
    role: "Fondatrice",
    company: "GirlsGang",
    avatar: "HE",
    quote:
      "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes.",
    metric: "Économie de 90% du temps",
    project: "Génération de menus",
    before: "1h de conception manuelle par menu client",
  },
  {
    name: "Directeur",
    role: "Direction",
    company: "Entreprise anonyme",
    avatar: "DI",
    quote:
      "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive.",
    metric: "Avantage compétitif décisif",
    project: "Veille concurrentielle",
    before: "Veille manuelle, toujours en retard sur le marché",
  },
  {
    name: "Yassine",
    role: "Fondateur",
    company: "Norloc",
    avatar: "YN",
    quote:
      "Notre gestion des prospects est passée au niveau supérieur. L'agent vocal couplé à l'automatisation du CRM nous fait gagner des heures chaque semaine et améliore nos taux de conversion.",
    metric: "Taux de conversion amélioré",
    project: "Agent vocal + CRM",
    before: "Suivi prospect manuel, relances oubliées",
  },
  {
    name: "Valentin",
    role: "Fondateur",
    company: "Stefano Design & Exotic Design",
    avatar: "VD",
    quote:
      "Des milliers de contacts dormants transformés en opportunités commerciales concrètes. L'agent vocal nous a permis d'exploiter un gisement de valeur que nous avions sous-estimé.",
    metric: "Milliers de contacts réactivés",
    project: "Réactivation automatisée de BDD",
    before: "Base de données de contacts dormante et inexploitée",
  },
  {
    name: "Amir",
    role: "Fondateur",
    company: "Entreprise BTP",
    avatar: "AM",
    quote:
      "De la demande client au suivi de chantier, tout est automatisé. Plus de temps perdu, plus d'erreurs, juste de l'efficacité. Notre organisation a été transformée.",
    metric: "Organisation transformée",
    project: "Gestion des interventions",
    before: "Gestion papier des demandes et suivis de chantier",
  },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sablia",
  "url": "https://sablia.io",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "5",
    "bestRating": "5",
    "worstRating": "1",
  },
  "review": testimonials.map((t) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": t.name },
    "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
    "reviewBody": t.quote,
    "datePublished": "2025-01-01",
    "itemReviewed": {
      "@type": "Service",
      "name": t.project,
      "provider": { "@type": "Organization", "name": "Sablia" },
    },
  })),
};

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-sablia-bg border border-sablia-border rounded p-6 hover:shadow-warm-sm transition-all duration-200"
    >
      <div className="bg-sablia-sienna/10 text-sablia-sienna px-3 py-1.5 rounded mb-4 inline-block">
        <span className="text-base font-bold">{testimonial.metric}</span>
      </div>

      <p className="text-xs text-sablia-text-tertiary mb-3 italic">
        Avant : {testimonial.before}
      </p>

      <p className="text-sablia-text-secondary leading-relaxed mb-4 text-sm">
        "{testimonial.quote}"
      </p>

      <div className="pt-4 border-t border-sablia-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sablia-accent/8 flex items-center justify-center flex-shrink-0">
          <span className="text-sablia-accent font-semibold text-sm">{testimonial.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sablia-text text-sm leading-tight">
            {testimonial.name}
          </h3>
          <p className="text-xs text-sablia-text-secondary">{testimonial.role}, {testimonial.company}</p>
        </div>
        <p className="text-xs text-sablia-text-tertiary">{testimonial.project}</p>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(reviewSchema)}
        </script>
      </Helmet>

      <section id="testimonials" className="py-32 bg-sablia-surface">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-medium uppercase tracking-[0.15em] text-sablia-sienna mb-3"
            >
              Ils ont transformé leurs opérations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text"
            >
              Des résultats mesurables
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-sm"
            >
              <span><strong className="text-sablia-sienna">15+</strong>{" "}<span className="text-sablia-text-secondary">projets livrés</span></span>
              <span className="text-sablia-border">·</span>
              <span><strong className="text-sablia-sienna">4.9/5</strong>{" "}<span className="text-sablia-text-secondary">satisfaction</span></span>
              <span className="text-sablia-border">·</span>
              <span><strong className="text-sablia-sienna">5</strong>{" "}<span className="text-sablia-text-secondary">secteurs d'activité</span></span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
            {testimonials.slice(3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index + 3} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10 text-sm text-sablia-text-tertiary"
          >
            Projets réels · Résultats vérifiables
          </motion.p>
        </div>
      </section>
    </>
  );
}
