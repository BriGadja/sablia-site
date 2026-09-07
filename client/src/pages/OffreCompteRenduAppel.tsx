import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import AudienceStrip from '@/components/offre/AudienceStrip'
import IncludedExcludedSection from '@/components/offre/IncludedExcludedSection'
import ObjectionSection from '@/components/offre/ObjectionSection'
import OffreCallout from '@/components/offre/OffreCallout'
import OffreFaq from '@/components/offre/OffreFaq'
import OffreHero from '@/components/offre/OffreHero'
import PricingSection from '@/components/offre/PricingSection'
import VariantsSection from '@/components/offre/VariantsSection'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { OF1_BOOKING_URL, OF1_ROUTE } from '@/content/of1'
import { faqSchema, serviceSchema } from '@/content/of1-schema'

const NAV_ITEMS = [
  { label: 'Deux variantes', href: '#variantes' },
  { label: 'Ce qui est inclus', href: '#inclus' },
  { label: 'Prix', href: '#prix' },
  { label: 'FAQ', href: '#faq' },
]

export default function OffreCompteRenduAppel() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page={OF1_ROUTE} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      {/* Enter fade only: with Wouter Routes as direct AnimatePresence children, exit
          animations do not fire (molefrog/wouter#414). Pre-existing, site-wide. */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <TopNav items={NAV_ITEMS} bookingUrl={OF1_BOOKING_URL} ctaLabel="Réserver 30 minutes" />
        <main>
          <OffreHero />
          <AudienceStrip />
          <VariantsSection />
          <IncludedExcludedSection />
          <PricingSection />
          <ObjectionSection />
          <OffreFaq />
          <OffreCallout />
        </main>
        <FooterSection />
        <ScrollToTop />
      </motion.div>
    </>
  )
}
