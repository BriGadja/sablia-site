import { motion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticElements";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { GradientText } from "@/components/animations/AnimatedText";

/**
 * HeroSection - Premium hero with animated gradient and magnetic CTAs
 *
 * Features:
 * - Animated 3-color gradient background (Navy → Electric → Cyan)
 * - 72px headline with gradient text animation
 * - Two CTA buttons with magnetic hover effects
 * - ScrollReveal animation on re-entrance
 * - Full viewport height, content centered
 */

export default function HeroSection() {
  const handleCTAClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal direction="fade" duration={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Headline with gradient animation */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold leading-tight tracking-tight">
              <GradientText
                colors={["#FFFFFF", "#FFA559", "#FFFFFF"]}
                className="inline-block"
              >
                L'IA au service de votre croissance
              </GradientText>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-v2-off-white/90 max-w-3xl mx-auto">
              On forme vos équipes. On installe les systèmes. Vous gardez le contrôle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {/* Primary CTA */}
              <MagneticButton
                strength={0.5}
                onClick={() => handleCTAClick("#contact")}
                className="bg-v2-cyan text-v2-navy px-8 py-4 rounded-xl text-lg font-semibold hover:bg-v2-electric hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Diagnostic Gratuit
              </MagneticButton>

              {/* Secondary CTA */}
              <MagneticButton
                strength={0.3}
                onClick={() => handleCTAClick("#calculator")}
                className="border-2 border-v2-cyan text-v2-cyan px-8 py-4 rounded-xl text-lg font-semibold hover:bg-v2-cyan hover:text-v2-navy transition-all duration-300"
              >
                Calculer mon ROI
              </MagneticButton>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
