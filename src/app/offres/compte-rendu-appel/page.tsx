import { Scene } from '@/components/home/scene'
import AudienceStrip from '@/components/offre/AudienceStrip'
import { HashScroll } from '@/components/offre/HashScroll'
import IncludedExcludedSection from '@/components/offre/IncludedExcludedSection'
import ObjectionSection from '@/components/offre/ObjectionSection'
import OffreCallout from '@/components/offre/OffreCallout'
import OffreFaq from '@/components/offre/OffreFaq'
import OffreHero from '@/components/offre/OffreHero'
import PricingSection from '@/components/offre/PricingSection'
import ProofStrip from '@/components/offre/ProofStrip'
import VariantsSection from '@/components/offre/VariantsSection'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import '@/components/offre/offre.css'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { faqSchema, serviceSchema } from '@/content/of1-schema'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: OF1_ROUTE,
  title: `Compte rendu d'appel dans votre CRM : installé en ${of1.delay.days} jours | Sablia`,
  description: `${of1.promise} ${of1.price.oneShotHt.toLocaleString('fr-FR')} € HT, livré en ${of1.delay.days} jours, remboursé si cela ne tourne pas.`,
})

/**
 * Sections keep their ids (#variantes, #inclus, #prix, #preuve, #faq): links point into the page.
 * The wrapper turns scroll anchoring off, so a deep link lands where it was aimed.
 * `#scene` is the home's call → CRM record animation (moved here by the 01/11 training repositioning),
 * without its own priced block: the page prices the offer once, in `#prix`.
 */
export default function OffreCompteRenduAppel() {
  return (
    <main id="contenu" tabIndex={-1} className="v2-offre">
      <HashScroll />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      <BreadcrumbJsonLd items={[{ name: of1.title, path: OF1_ROUTE }]} />
      <OffreHero />
      <Scene showOffer={false} />
      <AudienceStrip />
      <VariantsSection />
      <IncludedExcludedSection />
      <PricingSection />
      <ObjectionSection />
      <ProofStrip />
      <OffreFaq />
      <OffreCallout />
    </main>
  )
}
