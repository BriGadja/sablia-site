import CalloutSection from '@/components/landing/CalloutSection'
import CRMStrip from '@/components/landing/CRMStrip'
import FooterSection from '@/components/landing/FooterSection'
import HeroSection from '@/components/landing/HeroSection'
import ProcessSection from '@/components/landing/ProcessSection'
import ProofSection from '@/components/landing/ProofSection'
import TopNav from '@/components/landing/TopNav'
import UseCases from '@/components/landing/UseCases'
import SEO from '@/components/SEO'

export default function Landing() {
  return (
    <>
      <SEO page="home" />
      <TopNav />
      <main>
        <HeroSection />
        <CRMStrip />
        <UseCases />
        <ProcessSection />
        <ProofSection />
        <CalloutSection />
      </main>
      <FooterSection />
    </>
  )
}
