import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'
import PricingSection from '@/components/landing/PricingSection'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'

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
        <Navigation />

        <main className="pt-20">
          <section className="bg-sable-50 border-b border-encre/10 py-12">
            <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-tuile mb-3">
                Nouveau point d'entrée
              </p>
              <h1 className="text-3xl sm:text-4xl font-display font-semibold text-encre mb-4">
                La porte d'entrée Sablia, c'est le Diagnostic.
              </h1>
              <p className="text-base sm:text-lg text-encre-70 leading-relaxed mb-6">
                490€ HT, 5 jours ouvrés, un PDF de 10-15 pages. Il cartographie vos process et
                recommande un (et un seul) des 3 paths ci-dessous. Les 490€ sont déduits de la
                première facture si vous signez ensuite un contrat Développement ou Accompagnement
                dans les 90 jours.
              </p>
              <a
                href="/#diagnostic-form"
                className="inline-flex items-center gap-2 bg-tuile text-white px-8 py-3.5 rounded-md font-medium hover:bg-tuile-dark transition-colors"
              >
                Démarrer mon diagnostic, 490€
                <ArrowRight size={18} />
              </a>
              <p className="text-xs text-encre-50 mt-6">
                La grille ci-dessous reste accessible pour référence, mais tout engagement Formation
                / Développement / Accompagnement passe par un diagnostic au préalable.
              </p>
            </div>
          </section>

          <PricingSection />
        </main>

        <Footer />
        <ScrollToTop />
      </motion.div>
    </>
  )
}
