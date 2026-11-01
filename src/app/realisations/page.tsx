import { Construit } from '@/components/realisations/construit'
import { FIN, META } from '@/components/realisations/content'
import { RealisationsHead } from '@/components/realisations/head'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/realisations',
  title: META.title,
  description: META.description,
})

/**
 * Réalisations: the wall of cards that left the home (`#construit`, same cards, same animation, same
 * pause; `/realisations#construit` lands on it), under the page h1, then the call on the formation Calendly.
 */
export default function RealisationsPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <RealisationsHead />
      <Construit underPageHead />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
