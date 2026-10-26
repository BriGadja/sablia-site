import { AccompagnementExemples } from '@/components/accompagnement/exemples'
import { AccompagnementHero } from '@/components/accompagnement/hero'
import { AccompagnementModeProvider } from '@/components/accompagnement/hero/mode'
import { AccompagnementLivrables } from '@/components/accompagnement/livrables'
import { AccompagnementParcours } from '@/components/accompagnement/parcours'
import { AccompagnementPourquoi } from '@/components/accompagnement/pourquoi'
import { AccompagnementQuestions } from '@/components/accompagnement/questions'
import { AccompagnementSituations } from '@/components/accompagnement/situations'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/accompagnement',
  title: 'Accompagnement IA pour dirigeants et équipes | Sablia',
  description:
    'Un accompagnement à votre rythme pour apprendre à confier vos tâches à Claude : séances sur vos vrais dossiers, questions entre les séances, outils configurés. Pour un dirigeant ou une équipe.',
})

export default function AccompagnementPage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <AccompagnementModeProvider>
        <AccompagnementHero />
        <AccompagnementParcours />
        <AccompagnementSituations />
        <AccompagnementLivrables />
        <AccompagnementExemples />
        <AccompagnementPourquoi />
        <AccompagnementQuestions />
        <FinBand
          title="Trente minutes pour voir par où commencer."
          text="On regarde votre semaine ensemble, je vous dis ce que Claude peut prendre."
        />
      </AccompagnementModeProvider>
    </main>
  )
}
