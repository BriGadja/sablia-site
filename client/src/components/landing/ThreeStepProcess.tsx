import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Rocket, Zap } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  badges?: Array<{ icon: string; label: string; duration: string }>;
}

const steps: Step[] = [
  {
    id: 1,
    icon: <Search size={48} className="text-v2-cyan" />,
    title: "Découvrir",
    description:
      "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.",
    duration: "Modulaire",
    badges: [
      { icon: "⚡", label: "Audit Express", duration: "1h30" },
      { icon: "🔍", label: "Audit Complet", duration: "Jusqu'à 2 semaines" },
    ],
  },
  {
    id: 2,
    icon: <Zap size={48} className="text-v2-cyan" />,
    title: "Implémenter",
    description:
      "Formation de vos équipes et/ou développement des workflows selon votre besoin. Approche modulaire adaptée à votre contexte.",
    duration: "Modulaire",
    badges: [
      { icon: "🎓", label: "Formation", duration: "1-5 jours" },
      { icon: "⚙️", label: "Développement", duration: "2-8 semaines" },
      { icon: "🔄", label: "Hybride", duration: "Combiné" },
    ],
  },
  {
    id: 3,
    icon: <Rocket size={48} className="text-v2-cyan" />,
    title: "Optimiser & Accompagner",
    description:
      "Sur la base des retours terrain, nous adaptons vos workflows : modifications, formation de nouveaux collaborateurs, mises à jour et optimisation continue.",
    duration: "Continu",
  },
];

export default function ThreeStepProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".step-card");
    const cardBorders = containerRef.current.querySelectorAll(".step-card-border");

    // If user prefers reduced motion, set final state immediately with no animation
    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.set(cardBorders, {
        boxShadow: "0 0 30px rgba(82, 209, 220, 0.6), 0 0 60px rgba(82, 209, 220, 0.3)",
        borderColor: "rgba(82, 209, 220, 0.8)",
      });
      return;
    }

    // Staggered card reveal
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    );

    // Progressive light border animation (left to right)
    gsap.fromTo(
      cardBorders,
      {
        boxShadow: "0 0 0px rgba(82, 209, 220, 0)",
        borderColor: "rgba(82, 209, 220, 0.2)",
      },
      {
        boxShadow: "0 0 30px rgba(82, 209, 220, 0.6), 0 0 60px rgba(82, 209, 220, 0.3)",
        borderColor: "rgba(82, 209, 220, 0.8)",
        duration: 1.2,
        stagger: 0.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none pause",
        },
      },
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            Notre processus en 3 étapes
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-20 max-w-3xl mx-auto">
            De l'audit initial à l'optimisation continue, nous accompagnons votre transformation
            digitale avec une méthodologie éprouvée
          </p>
        </ScrollReveal>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:flex items-start justify-between gap-8 relative">
            {steps.map((step, _index) => (
              <div key={step.id} className="step-card flex-1 relative">
                {/* Step Card */}
                <div className="step-card-border bg-v2-charcoal/20 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/20 relative">
                  {/* Step Number Watermark */}
                  <div className="absolute top-4 right-4 text-[80px] font-bold text-v2-white/10 leading-none">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-v2-cyan/50 flex items-center justify-center bg-v2-navy/50">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg text-v2-off-white/80 mb-4 leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Badges modulaires (si présents) */}
                  {step.badges && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {step.badges.map((badge, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-v2-navy/30 border border-v2-cyan/10 hover:border-v2-cyan/30 transition-colors text-sm"
                        >
                          <span className="text-base">{badge.icon}</span>
                          <span className="text-v2-white font-medium">{badge.label}</span>
                          <span className="text-v2-cyan text-xs">· {badge.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="inline-block px-4 py-2 rounded-full bg-v2-cyan/20 text-v2-cyan text-sm font-semibold relative z-10">
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Vertical Stack */}
          <div className="flex lg:hidden flex-col gap-8">
            {steps.map((step) => (
              <div key={step.id} className="step-card">
                <div className="step-card-border bg-v2-charcoal/20 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/20 relative">
                  {/* Step Number Watermark */}
                  <div className="absolute top-4 right-4 text-[48px] font-bold text-v2-white/10 leading-none">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 rounded-full border-2 border-v2-cyan/50 flex items-center justify-center bg-v2-navy/50">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-v2-white mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-base sm:text-lg text-v2-off-white/80 mb-4 leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Badges modulaires (si présents) */}
                  {step.badges && (
                    <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                      {step.badges.map((badge, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-v2-navy/30 border border-v2-cyan/10 hover:border-v2-cyan/30 transition-colors text-sm"
                        >
                          <span className="text-base">{badge.icon}</span>
                          <span className="text-v2-white font-medium">{badge.label}</span>
                          <span className="text-v2-cyan text-xs">· {badge.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Duration Badge */}
                  <div className="inline-block px-4 py-2 rounded-full bg-v2-cyan/20 text-v2-cyan text-sm font-semibold relative z-10">
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
