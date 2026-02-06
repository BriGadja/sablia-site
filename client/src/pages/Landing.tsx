import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CustomCursor from "@/components/animations/CustomCursor";

// Lazy load particles (heavy tsparticles dependency)
const AnimatedParticles = lazy(() => import("@/components/animations/AnimatedParticles"));
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
        <Suspense fallback={null}>
          <AnimatedParticles />
        </Suspense>

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
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="space-y-24 py-24">
                  {/* Calculator skeleton */}
                  <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                    <div className="h-10 w-64 bg-v2-charcoal/30 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="h-64 bg-v2-charcoal/20 rounded-2xl animate-pulse" />
                  </div>
                  {/* Contact skeleton */}
                  <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="h-10 w-48 bg-v2-charcoal/30 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="h-96 bg-v2-charcoal/20 rounded-2xl animate-pulse" />
                      <div className="h-96 bg-v2-charcoal/20 rounded-2xl animate-pulse" />
                    </div>
                  </div>
                  {/* FAQ skeleton */}
                  <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <div className="h-10 w-32 bg-v2-charcoal/30 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-14 bg-v2-charcoal/20 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              {/* Calculator ROI Section */}
              <CalculatorROI />

              {/* Contact Form Section */}
              <ContactFormSection />

              {/* FAQ Section */}
              <FaqSection />
            </Suspense>
          </ErrorBoundary>

        </main>

        <Footer />
      </div>

        {/* Custom cursor layer - renders last for highest z-index in paint order */}
        <CustomCursor />
      </motion.div>
    </>
  );
}
