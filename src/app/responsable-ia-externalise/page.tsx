import { FinBand } from '@/components/shell/FinBand'
import { ChaqueMois } from '@/components/temps-partage/chaque-mois'
import { Conditions } from '@/components/temps-partage/conditions'
import { FIN, META } from '@/components/temps-partage/content'
import { Gardez } from '@/components/temps-partage/gardez'
import { TempsPartageHero } from '@/components/temps-partage/hero'
import { PremierMois } from '@/components/temps-partage/premier-mois'
import { Questions } from '@/components/temps-partage/questions'
import { Qui } from '@/components/temps-partage/qui'
import { Role } from '@/components/temps-partage/role'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/responsable-ia-externalise',
  title: META.title,
  description: META.description,
})

/**
 * The monthly offer « Responsable IA externalisé » (US-99, renamed by US-105): price shown, FAQ as
 * visible text, every booking button on the « Échange de 30 minutes » Calendly. No page-level
 * structured data.
 */
export default function TempsPartagePage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <TempsPartageHero />
      <Role />
      <PremierMois />
      <ChaqueMois />
      <Gardez />
      <Conditions />
      <Qui />
      <Questions />
      <FinBand title={FIN.title} text={FIN.text} bookingUrl={site.formationBookingUrl} />
    </main>
  )
}
