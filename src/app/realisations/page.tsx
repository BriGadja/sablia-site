import { Construit } from '@/components/realisations/construit'
import { FIN, META } from '@/components/realisations/content'
import { RealisationsHead } from '@/components/realisations/head'
import { FinBand } from '@/components/shell/FinBand'
import { MonthlyOfferLine } from '@/components/shell/MonthlyOfferLine'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/realisations',
  title: META.title,
  description: META.description,
})

/**
 * Réalisations: the wall of cards that left the home (`#construit`, same cards, same animation, same
 * pause; `/realisations#construit` lands on it), under the page h1, then the line toward the monthly offer
 * (Brice, 13/11) and the call on the formation Calendly.
 */
export default function RealisationsPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <RealisationsHead />
      <Construit underPageHead />
      <MonthlyOfferLine ground="paper" />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
