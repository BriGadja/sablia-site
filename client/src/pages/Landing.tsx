import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import Navigation from "@/components/landing/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LogosCloud from "@/components/landing/LogosCloud";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import ThreeStepProcess from "@/components/landing/ThreeStepProcess";
import PricingSection from "@/components/landing/PricingSection";
import SEO from "@/components/SEO";

// Lazy load below-fold sections for better LCP
const CalculatorROI = lazy(() => import("@/components/landing/CalculatorROI"));
const ContactFormSection = lazy(() => import("@/components/landing/ContactFormSection"));
const FaqSection = lazy(() => import("@/components/landing/FaqSection"));

export default function Landing() {
  return (
    <>
      <SEO page="/" />
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
        {/* Animated particles background - renders first for proper layering */}
        <AnimatedParticles />

      {/* Content layer - must have relative z-10 to appear above particles */}
      <div className="relative z-10">
        {/* Navigation - logo séparé + capsule nav */}
        <Navigation />

        <main>
          {/* Hero Section */}
          <HeroSection />

          {/* Testimonials Section */}
          <TestimonialsSection />

          {/* Logos Cloud Section */}
          <LogosCloud />

          {/* Problem Section */}
          <ProblemSection />

          {/* Solution Section */}
          <SolutionSection />

          {/* Three Step Process Timeline */}
          <ThreeStepProcess />

          {/* Pricing Section - 3 Columns */}
          <PricingSection />

          {/* Lazy-loaded below-fold sections */}
          <Suspense fallback={<div className="min-h-[400px]" />}>
            {/* Calculator ROI Section */}
            <CalculatorROI />

            {/* Contact Form Section */}
            <ContactFormSection />

            {/* FAQ Section */}
            <FaqSection />
          </Suspense>

          {/* Hidden section placeholders - will be visible in DOM inspector */}
          <div className="hidden">
            <section id="process" className="py-24" />
            <section id="pricing" className="py-24" />
            <section id="calculator" className="py-24" />
            <section id="contact" className="py-24" />
            <section id="faq" className="py-24" />
          </div>
        </main>

        <Footer />
      </div>

        {/* Custom cursor layer - renders last for highest z-index in paint order */}
        <CustomCursor />
      </motion.div>
    </>
  );
}
