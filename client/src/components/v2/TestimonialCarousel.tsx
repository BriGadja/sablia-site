import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardDescription, CardContent } from "./Card";

const testimonials = [
  {
    name: "Hélène",
    role: "Fondatrice",
    company: "GirlsGang",
    content: "Avant Sablia, je passais 1h à concevoir chaque menu personnalisé pour mes clientes. Aujourd'hui, 30 minutes de relecture suffisent pour TOUTES mes clientes. L'automatisation n8n développée m'a redonné du temps pour me concentrer sur l'essentiel : le conseil nutritionnel et l'accompagnement personnalisé.",
    metric: "90% de temps économisé",
    avatar: "HG",
    project: "Génération automatisée de menus nutritionnels"
  },
  {
    name: "Yassine",
    role: "Fondateur",
    company: "Norloc",
    content: "L'intégration de notre agent vocal avec l'automatisation CRM a révolutionné notre gestion des prospects. Nos équipes gagnent un temps précieux, les informations se centralisent automatiquement, et nous ne perdons plus aucune opportunité. Nos taux de conversion ont significativement augmenté. Un investissement rentabilisé en quelques semaines.",
    metric: "Zéro opportunité perdue",
    avatar: "YN",
    project: "Agent vocal + Automatisation CRM"
  },
  {
    name: "Valentin",
    role: "Fondateur",
    company: "Stefano Design & Exotic Design",
    content: "Nous avions des milliers de contacts dormants dans nos bases de données, un trésor inexploité. L'agent vocal nous permet aujourd'hui de réactiver ces prospects de manière automatisée et personnalisée. C'est comme avoir une équipe commerciale qui travaille 24/7 pour redonner vie à notre portefeuille client. Un ROI impressionnant sur un actif que nous pensions perdu.",
    metric: "Milliers de contacts réactivés",
    avatar: "VD",
    project: "Réactivation automatisée de base de données"
  },
  {
    name: "Amir",
    role: "Fondateur",
    company: "Entreprise BTP",
    content: "Dans le BTP, chaque minute compte et la désorganisation coûte cher. L'automatisation de la gestion de nos interventions a rationalisé l'ensemble de notre process : de la demande client à la planification des équipes, en passant par le suivi des chantiers. Fini les doublons, les oublis, les plannings à refaire manuellement. Nos clients le ressentent.",
    metric: "Zéro erreur de planification",
    avatar: "AB",
    project: "Gestion complète des interventions BTP"
  },
  {
    name: "Confidentiel",
    role: "Directeur",
    company: "Scale-up française",
    content: "Le système de veille concurrentielle développé par Sablia a été un véritable game-changer pour notre stratégie. Nous avons obtenu une visibilité complète sur notre marché et repositionné notre relation avec nos partenaires. Nous ne subissons plus la concurrence, nous l'anticipons. Cette longueur d'avance est devenue notre principal avantage compétitif.",
    metric: "Vision 360° du marché",
    avatar: "XX",
    project: "Veille concurrentielle automatisée"
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Section background="white" spacing="default" id="cas-clients">
      <Container>
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Ils ont transformé leurs opérations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Des résultats mesurables, des équipes autonomes
          </motion.p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-v2-electric to-v2-cyan flex items-center justify-center text-v2-white font-bold text-lg">
                      {currentTestimonial.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-v2-navy text-xl mb-1">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-sm text-v2-charcoal/70">
                        {currentTestimonial.role} · {currentTestimonial.company}
                      </p>
                      <p className="text-xs text-v2-electric font-semibold mt-2">
                        {currentTestimonial.project}
                      </p>
                    </div>
                  </div>
                  <CardDescription className="text-lg leading-relaxed text-v2-charcoal/90">
                    "{currentTestimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-6 border-t border-gray-200">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-v2-cyan/10 rounded-full">
                      <span className="text-sm font-semibold text-v2-navy">
                        {currentTestimonial.metric}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-v2-white shadow-lg border-2 border-v2-electric/20 flex items-center justify-center text-v2-electric hover:bg-v2-electric hover:text-v2-white transition-all duration-200 hover:scale-110"
            aria-label="Témoignage précédent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-v2-white shadow-lg border-2 border-v2-electric/20 flex items-center justify-center text-v2-electric hover:bg-v2-electric hover:text-v2-white transition-all duration-200 hover:scale-110"
            aria-label="Témoignage suivant"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-v2-electric'
                  : 'w-3 h-3 bg-v2-charcoal/20 hover:bg-v2-charcoal/40'
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-v2-charcoal/60 mb-4">
            Projets réels · Résultats vérifiables
          </p>
        </div>
      </Container>
    </Section>
  );
}
