import CalloutSection from '@/components/landing/CalloutSection'
import CRMStrip from '@/components/landing/CRMStrip'
import FooterSection from '@/components/landing/FooterSection'
import FormationsSection from '@/components/landing/FormationsSection'
import HeroSection from '@/components/landing/HeroSection'
import OffreSection from '@/components/landing/OffreSection'
import TopNav from '@/components/landing/TopNav'
import SEO from '@/components/SEO'

/**
 * The home of 2026-09-28 (grill decisions 1 to 4): five light sections that sell the CRM offer and
 * the trainings. Problems, Process, Team, Proof, Catalogue and FAQ left the page that day; the FAQ
 * questions moved to the offer page (`content/faq-carried.ts`), the proof figures to `home.ts`.
 */
export default function Landing() {
  return (
    <>
      <SEO page="home" />
      <TopNav tone="light" />
      <main>
        <HeroSection />
        <CRMStrip />
        <OffreSection />
        <FormationsSection />
        <CalloutSection />
      </main>
      <FooterSection />
    </>
  )
}
