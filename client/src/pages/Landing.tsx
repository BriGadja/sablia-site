import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Footer from '@/components/Footer'
import ClientLogosStrip from '@/components/landing/ClientLogosStrip'
import DiagnosticForm from '@/components/landing/DiagnosticForm'
import OffersSection from '@/components/landing/OffersSection'
import HeroSection from '@/components/landing/HeroSection'
import Navigation from '@/components/landing/Navigation'
import FrictionSection from '@/components/landing/FrictionSection'
import WhatRevealsSection from '@/components/landing/WhatRevealsSection'
import SEO from '@/components/SEO'

const TestimonialsSection = lazy(() => import('@/components/landing/TestimonialsSection'))
const CalculatorROI = lazy(() => import('@/components/landing/CalculatorROI'))
const FaqSection = lazy(() => import('@/components/landing/FaqSection'))
const FooterCTABand = lazy(() => import('@/components/landing/FooterCTABand'))

export default function Landing() {
  return (
    <>
      <SEO page="/" />
      <motion.div
        className="min-h-screen bg-sablia-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navigation />

        <main>
          {/* §1 Hero */}
          <HeroSection />

          {/* §2 Client logos strip */}
          <ClientLogosStrip />

          {/* §3 Le constat */}
          <FrictionSection />

          {/* §4 Le diagnostic (narratif, sans formulaire) */}
          <OffersSection />

          {/* §diagnostic-form anchor (Phase 4 final placement — temp inline) */}
          <section id="diagnostic-form" className="container-editorial py-24">
            <DiagnosticForm />
          </section>

          {/* §5 Ce que révèle votre diagnostic */}
          <WhatRevealsSection />

          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="space-y-24 py-24">
                  <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
                    <div className="h-10 w-64 bg-sablia-surface rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="grid md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-80 bg-sablia-bg rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                  <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
                    <div className="h-10 w-64 bg-sablia-surface rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="h-96 bg-sablia-bg rounded-lg animate-pulse" />
                      <div className="h-96 bg-sablia-bg rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
                    <div className="h-10 w-32 bg-sablia-surface rounded-lg animate-pulse mx-auto mb-8" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-14 bg-sablia-bg rounded-lg animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              {/* §6 Témoignages (3 max, ≥2 ROI-quantified) */}
              <TestimonialsSection />

              {/* §7 ROI calculator */}
              <CalculatorROI />

              {/* §8 FAQ (diagnostic-focused + Sablia vs IAPreneurs) */}
              <FaqSection />

              {/* §9 Footer CTA band */}
              <FooterCTABand />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </motion.div>
    </>
  )
}
