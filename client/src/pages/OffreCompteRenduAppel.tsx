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
import ProofStrip from '@/components/offre/ProofStrip'
import VariantsSection from '@/components/offre/VariantsSection'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { OF1_BOOKING_URL, OF1_ROUTE } from '@/content/of1'
import { faqSchema, serviceSchema } from '@/content/of1-schema'

/**
 * Light from end to end since 2026-09-29, like the home (Brice: « toutes les fenêtres de l'offre
 * sur le même ton »); the footer stays dark. The bar is the site-wide one with « Offre » marked:
 * the page's own anchor bar made the way back to the home hard to find. The section ids
 * (#variantes, #inclus, #prix, #preuve, #faq) stay, for the links that point into the page.
 */
export default function OffreCompteRenduAppel() {
  useEffect(() => {
    // createRoot re-renders the prerendered page, and an unconditional scrollTo(0, 0) sent every
    // deep link (#prix, #faq…) back to the top (measured on sablia.io, 2026-09-29). Without a hash
    // the page still opens at the top: a wouter navigation would keep the previous page's offset.
    const target = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
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
        <TopNav
          tone="light"
          current={OF1_ROUTE}
          bookingUrl={OF1_BOOKING_URL}
          ctaLabel="Réserver 30 min"
        />
        <main>
          <OffreHero />
          <AudienceStrip />
          <VariantsSection />
          <IncludedExcludedSection />
          <PricingSection />
          <ObjectionSection />
          <ProofStrip />
          <OffreFaq />
          <OffreCallout />
        </main>
        <FooterSection />
        <ScrollToTop />
      </motion.div>
    </>
  )
}
