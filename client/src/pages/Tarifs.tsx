import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'
import PricingSection from '@/components/landing/PricingSection'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'

/**
 * Page Tarifs - Grille tarifaire détaillée complète
 * Séparée de la landing pour ne pas surcharger
 */
export default function Tarifs() {
  return (
    <>
      <SEO page="/tarifs" />
      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Navigation />
          <main className="pt-20">
            <PricingSection />
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </motion.div>
    </>
  )
}
