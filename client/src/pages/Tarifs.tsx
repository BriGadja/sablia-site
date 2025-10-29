import { motion } from "framer-motion";
import Navigation from "@/components/landing/Navigation";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";

/**
 * Page Tarifs - Grille tarifaire détaillée complète
 * Séparée de la landing pour ne pas surcharger
 */
export default function Tarifs() {
  return (
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
      {/* Animated particles background */}
      <AnimatedParticles />

      {/* Content layer */}
      <div className="relative z-10">
        <Navigation />
        <main className="pt-20">
          <PricingSection />
        </main>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Custom cursor layer */}
      <CustomCursor />
    </motion.div>
  );
}
