import { FIN, META } from '@/components/conferences/content'
import { ConferencesHero } from '@/components/conferences/hero'
import { ConferencesPreuve } from '@/components/conferences/preuve'
import { ConferencesRappel } from '@/components/conferences/rappel'
import { Sujets } from '@/components/conferences/sujets'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/conferences',
  title: META.title,
  description: META.description,
})

/**
 * Conférences et séminaires (US-107): on request, the price in the quote, three topics with their own
 * format, the published recommendation signed by role and sector, the webinar reminder while a session
 * is ahead, and the call on the « Échange de 30 minutes » Calendly. No price, no structured data.
 */
export default function ConferencesPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <ConferencesHero />
      <Sujets />
      <ConferencesPreuve />
      <ConferencesRappel />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
