import { motion } from "framer-motion";
import Navigation from "@/components/v2/Navigation";
import Hero from "@/components/v2/Hero";
import LogosCloud from "@/components/v2/LogosCloud";
import ProblemSection from "@/components/v2/ProblemSection";
import SolutionSection from "@/components/v2/SolutionSection";
import ThreeStepProcess from "@/components/v2/ThreeStepProcess";
import PricingPathways from "@/components/v2/PricingPathways";
import PricingGrid from "@/components/v2/PricingGrid";
import CalculatorROI from "@/components/v2/CalculatorROI";
import TestimonialCarousel from "@/components/v2/TestimonialCarousel";
import FaqSection from "@/components/v2/FaqSection";
import Footer from "@/components/Footer"; // Reuse existing footer for now

export default function LandingV2() {
  return (
    <motion.div
      className="min-h-screen bg-v2-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navigation />
      <main>
        <Hero />
        <LogosCloud />
        <ProblemSection />
        <SolutionSection />
        <ThreeStepProcess />
        <CalculatorROI />
        <PricingPathways />
        <PricingGrid />
        <TestimonialCarousel />
        <FaqSection />
      </main>
      <Footer />
    </motion.div>
  );
}
