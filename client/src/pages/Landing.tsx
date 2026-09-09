import CalloutSection from '@/components/landing/CalloutSection'
import CatalogueSection from '@/components/landing/CatalogueSection'
import CRMStrip from '@/components/landing/CRMStrip'
import FaqSection from '@/components/landing/FaqSection'
import FooterSection from '@/components/landing/FooterSection'
import HeroSection from '@/components/landing/HeroSection'
import ProblemsSection from '@/components/landing/ProblemsSection'
import ProcessSection from '@/components/landing/ProcessSection'
import ProofSection from '@/components/landing/ProofSection'
import TeamSection from '@/components/landing/TeamSection'
import TopNav from '@/components/landing/TopNav'
import SEO from '@/components/SEO'

export default function Landing() {
  return (
    <>
      <SEO page="home" />
      <TopNav />
      <main>
        <HeroSection />
        <CRMStrip />
        <CatalogueSection />
        <ProblemsSection />
        <ProcessSection />
        <TeamSection />
        <ProofSection />
        <CalloutSection />
        <FaqSection />
      </main>
      <FooterSection />
    </>
  )
}
