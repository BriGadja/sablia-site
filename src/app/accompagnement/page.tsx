import { FIN, META } from '@/components/accompagnement/content'
import { AccompagnementHero } from '@/components/accompagnement/hero'
import { Referent } from '@/components/accompagnement/referent'
import { Surmesure } from '@/components/accompagnement/surmesure'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/accompagnement',
  title: META.title,
  description: META.description,
})

/** « Après la formation »: the référent IA, the made-to-measure work (CRM pages), the call. */
export default function AccompagnementPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <AccompagnementHero />
      <Referent />
      <Surmesure />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
