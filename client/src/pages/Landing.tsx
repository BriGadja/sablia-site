import { motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Footer from '@/components/Footer'
import AuthoritySection from '@/components/landing/AuthoritySection'
import DiagnosticForm from '@/components/landing/DiagnosticForm'
import FrictionSection from '@/components/landing/FrictionSection'
import HeroSection from '@/components/landing/HeroSection'
import MethodSection from '@/components/landing/MethodSection'
import Navigation from '@/components/landing/Navigation'
import OffersSection from '@/components/landing/OffersSection'
import WhatRevealsSection from '@/components/landing/WhatRevealsSection'
import SEO from '@/components/SEO'

const ProofSection = lazy(() => import('@/components/landing/ProofSection'))
const CalculatorROI = lazy(() => import('@/components/landing/CalculatorROI'))
const FaqSection = lazy(() => import('@/components/landing/FaqSection'))
const FinalCtaSection = lazy(() => import('@/components/landing/FinalCtaSection'))

function SectionSkeleton() {
  return (
    <div className="container mx-auto px-6 lg:px-8 max-w-6xl py-24">
      <div className="h-10 w-64 bg-sablia-surface rounded-lg animate-pulse mx-auto mb-8" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-80 bg-sablia-bg rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}

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

          {/* §2 Friction — le constat */}
          <FrictionSection />

          {/* §3 Offers — le diagnostic (narratif) */}
          <OffersSection />

          {/* §4 Authority — intermède */}
          <AuthoritySection />

          {/* §5 WhatReveals — ce que révèle votre diagnostic */}
          <WhatRevealsSection />

          {/* §6 Method — la méthode Sablia */}
          <MethodSection />

          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton />}>
              {/* §7 Proof — terrain, preuves */}
              <ProofSection />

              {/* §7b ROI Calculator (garde sablia-site) */}
              <CalculatorROI />
            </Suspense>
          </ErrorBoundary>

          {/* §8 Diagnostic form — anchor target for hero/nav CTAs */}
          <section id="diagnostic-form" className="container-editorial py-24">
            <DiagnosticForm />
          </section>

          <ErrorBoundary>
            <Suspense fallback={<SectionSkeleton />}>
              {/* §9 FAQ */}
              <FaqSection />

              {/* §10 Final CTA band */}
              <FinalCtaSection />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </motion.div>
    </>
  )
}
