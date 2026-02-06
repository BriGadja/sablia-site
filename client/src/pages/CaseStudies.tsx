import { motion } from "framer-motion";
import { ArrowRight, Clock, TrendingUp, Users } from "lucide-react";
import Navigation from "@/components/landing/Navigation";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Navigation />

          <main className="pt-20">
            <section className="py-24">
              <div className="container mx-auto px-6 lg:px-8">
                {/* Page Header */}
                <ScrollReveal>
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-sablia-text mb-4">
                    Cas clients
                  </h1>
                  <p className="text-xl sm:text-2xl text-sablia-text-secondary text-center mb-16 max-w-3xl mx-auto">
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
                      className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    >
                      {/* Header */}
                      <div className="p-8 pb-0">
                        <span className="inline-block px-3 py-1 rounded-full bg-sablia-accent/10 text-sablia-accent text-sm font-medium mb-4">
                          {study.sector}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-sablia-text mb-4">
                          {study.title}
                        </h2>
                      </div>

                      {/* Challenge & Solution */}
                      <div className="p-8 grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-semibold text-sablia-accent uppercase tracking-wider mb-2">
                            Le Défi
                          </h3>
                          <p className="text-base text-sablia-text-secondary leading-relaxed">
                            {study.challenge}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-sablia-accent uppercase tracking-wider mb-2">
                            La Solution
                          </h3>
                          <p className="text-base text-sablia-text-secondary leading-relaxed">
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
                              className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100"
                            >
                              <div className="flex justify-center text-sablia-accent mb-2">
                                {result.icon}
                              </div>
                              <div className="text-2xl sm:text-3xl font-bold text-sablia-text">
                                {result.value}
                              </div>
                              <div className="text-xs sm:text-sm text-sablia-text-tertiary mt-1">
                                {result.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="px-8 pb-8 pt-4">
                        <blockquote className="border-l-2 border-sablia-accent/50 pl-4">
                          <p className="text-base italic text-sablia-text-secondary mb-2">
                            "{study.quote}"
                          </p>
                          <cite className="text-sm text-sablia-text-tertiary not-italic">
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
                    <p className="text-lg text-sablia-text-secondary mb-6">
                      Prêt à écrire votre propre success story ?
                    </p>
                    <a
                      href="/#contact"
                      className="inline-flex items-center gap-2 bg-sablia-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-sablia-accent-hover transition-colors"
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
      </motion.div>
    </>
  );
}
