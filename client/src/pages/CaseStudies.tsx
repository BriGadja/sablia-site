import { motion } from "framer-motion";
import { ArrowRight, Clock, TrendingUp, Users } from "lucide-react";
import Navigation from "@/components/landing/Navigation";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import ScrollReveal from "@/components/animations/ScrollReveal";

// ============================================
// Case Study Data
// ============================================

interface CaseStudy {
  id: number;
  sector: string;
  title: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string; icon: React.ReactNode }[];
  quote: string;
  author: string;
  role: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    sector: "E-commerce",
    title: "Automatisation du traitement des commandes",
    challenge:
      "Une entreprise e-commerce de 25 personnes perdait des heures chaque jour sur le traitement manuel des commandes, la mise à jour des stocks et les relances clients.",
    solution:
      "Mise en place de workflows n8n automatisant la synchronisation commandes-stocks, les emails de suivi, et les alertes de réapprovisionnement.",
    results: [
      { label: "Heures économisées/an", value: "1 000h", icon: <Clock size={20} /> },
      { label: "Réduction des erreurs", value: "-80%", icon: <TrendingUp size={20} /> },
      { label: "Capacité commandes", value: "x3", icon: <Users size={20} /> },
    ],
    quote:
      "En 4 mois, l'investissement était rentabilisé. Nos équipes se concentrent enfin sur la relation client.",
    author: "Directeur des Opérations",
    role: "E-commerce, 25 personnes",
  },
  {
    id: 2,
    sector: "Cabinet de conseil",
    title: "Transformation des processus administratifs",
    challenge:
      "Un cabinet de conseil passait 60% de son temps sur des tâches administratives : facturation, reporting, relances, et synchronisation CRM.",
    solution:
      "Déploiement de Make.com pour automatiser la chaîne facturation-CRM-reporting avec formation de 3 champions internes.",
    results: [
      { label: "Tâches admin réduites", value: "-60%", icon: <Clock size={20} /> },
      { label: "Délai facturation", value: "-75%", icon: <TrendingUp size={20} /> },
      { label: "Collaborateurs formés", value: "12", icon: <Users size={20} /> },
    ],
    quote:
      "La formation a été clé. Nos consultants créent maintenant leurs propres automatisations.",
    author: "Associé fondateur",
    role: "Cabinet de conseil, 40 personnes",
  },
  {
    id: 3,
    sector: "Association",
    title: "Scaling sans recrutement",
    challenge:
      "Une association en forte croissance ne pouvait pas recruter proportionnellement. Les bénévoles croulaient sous les tâches manuelles de gestion des dons et événements.",
    solution:
      "Architecture n8n auto-hébergée pour gérer les dons, communications adhérents, et la logistique événementielle de bout en bout.",
    results: [
      { label: "Volume traité", value: "x3", icon: <TrendingUp size={20} /> },
      { label: "Sans recrutement", value: "0 ETP", icon: <Users size={20} /> },
      { label: "ROI", value: "6 mois", icon: <Clock size={20} /> },
    ],
    quote:
      "Nous avons triplé notre capacité sans ajouter une seule personne. L'automatisation a changé notre façon de travailler.",
    author: "Directrice générale",
    role: "Association, 15 personnes",
  },
];

// ============================================
// Main Component
// ============================================

export default function CaseStudies() {
  return (
    <>
      <SEO page="/cas-clients" />

      <motion.div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(to bottom, #2B9AB8 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatedParticles />

        <div className="relative z-10">
          <Navigation />

          <main className="pt-20">
            <section className="py-24">
              <div className="container mx-auto px-6 lg:px-8">
                {/* Page Header */}
                <ScrollReveal>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
                    Cas clients
                  </h1>
                  <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
                    Des transformations concrètes, des résultats mesurables
                  </p>
                </ScrollReveal>

                {/* Case Studies Grid */}
                <div className="max-w-5xl mx-auto space-y-12">
                  {caseStudies.map((study, index) => (
                    <motion.article
                      key={study.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl border border-v2-cyan/20 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-8 pb-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-v2-cyan/20 text-v2-cyan text-sm font-medium mb-4">
                          {study.sector}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-v2-white mb-4">
                          {study.title}
                        </h2>
                      </div>

                      {/* Challenge & Solution */}
                      <div className="p-8 grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-semibold text-v2-cyan uppercase tracking-wider mb-2">
                            Le Défi
                          </h3>
                          <p className="text-base text-v2-off-white/80 leading-relaxed">
                            {study.challenge}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-v2-cyan uppercase tracking-wider mb-2">
                            La Solution
                          </h3>
                          <p className="text-base text-v2-off-white/80 leading-relaxed">
                            {study.solution}
                          </p>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="px-8 pb-4">
                        <div className="grid grid-cols-3 gap-4">
                          {study.results.map((result, i) => (
                            <div
                              key={i}
                              className="bg-v2-navy/30 rounded-xl p-4 text-center border border-v2-cyan/10"
                            >
                              <div className="flex justify-center text-v2-cyan mb-2">
                                {result.icon}
                              </div>
                              <div className="text-2xl sm:text-3xl font-bold text-v2-white">
                                {result.value}
                              </div>
                              <div className="text-xs sm:text-sm text-v2-off-white/60 mt-1">
                                {result.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="px-8 pb-8 pt-4">
                        <blockquote className="border-l-2 border-v2-cyan/50 pl-4">
                          <p className="text-base italic text-v2-off-white/70 mb-2">
                            "{study.quote}"
                          </p>
                          <cite className="text-sm text-v2-off-white/50 not-italic">
                            {study.author}, {study.role}
                          </cite>
                        </blockquote>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* CTA */}
                <ScrollReveal>
                  <div className="text-center mt-16">
                    <p className="text-lg text-v2-off-white/70 mb-6">
                      Prêt à écrire votre propre success story ?
                    </p>
                    <a
                      href="/#contact"
                      className="inline-flex items-center gap-2 bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-cyan/90 transition-colors"
                    >
                      Discutons de votre projet
                      <ArrowRight size={20} />
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </main>

          <Footer />
          <ScrollToTop />
        </div>

        <CustomCursor />
      </motion.div>
    </>
  );
}
