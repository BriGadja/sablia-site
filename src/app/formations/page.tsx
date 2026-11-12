import { Conference } from '@/components/formations/conference'
import { FIN, META } from '@/components/formations/content'
import { Deroule } from '@/components/formations/deroule'
import { FormationsHero } from '@/components/formations/hero'
import { Inclus } from '@/components/formations/inclus'
import { PourQui } from '@/components/formations/pourqui'
import { Preuve } from '@/components/formations/preuve'
import { Questions } from '@/components/formations/questions'
import { FinBand } from '@/components/shell/FinBand'
import { WebinarReminder } from '@/components/shell/WebinarReminder'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/formations',
  title: META.title,
  description: META.description,
})

/** The offer page « L'IA au travail » (plan site-formation-lot1, U10): no price, the quote follows the call. */
export default function FormationsPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <FormationsHero />
      <PourQui />
      <Deroule />
      <Inclus />
      <Conference />
      <WebinarReminder />
      <Preuve />
      <Questions />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
