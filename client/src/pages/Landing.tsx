import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navigation />

        <main>
          <HeroSection />
          <TestimonialsSection />
          <LogosCloud />
          <ProblemSection />
          <SolutionSection />
          <ThreeStepProcess />
          <PricingSection />

          {/* Lazy-loaded below-fold sections */}
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="space-y-24 py-24">
                  <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                    <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
                  </div>
                  <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
                      <div className="h-96 bg-gray-50 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <CalculatorROI />
              <ContactFormSection />
              <FaqSection />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
