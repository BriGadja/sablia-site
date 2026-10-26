import { Avis } from '@/components/formations/avis'
import { Configurator } from '@/components/formations/configurator'
import { Deroule } from '@/components/formations/deroule'
import { Formats } from '@/components/formations/formats'
import { Niveaux } from '@/components/formations/niveaux'
import { Outils } from '@/components/formations/outils'
import { Questions } from '@/components/formations/questions'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/formations',
  title: 'Formations Claude et IA pour votre équipe, construites sur vos cas | Sablia',
  description:
    "Séminaire, ateliers par métier ou cycle : une formation à l'IA construite sur votre secteur, vos cas d'usage et l'aisance de votre équipe. Sur site ou à distance, sans prérequis technique.",
})

export default function FormationsPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <Configurator />
      <Niveaux />
      <Outils />
      <Deroule />
      <Avis />
      <Formats />
      <Questions />
      <FinBand
        title="Trente minutes pour cadrer votre formation."
        text="Vous me parlez de votre équipe, je vous propose un programme."
      />
    </main>
  )
}
