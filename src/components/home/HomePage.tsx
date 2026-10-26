import { FinBand } from '@/components/shell/FinBand'
import { Automatisations } from './automatisations'
import { Construit } from './construit'
import { Derriere } from './derriere'
import { Faq } from './faq'
import { FIN_BAND } from './faq/content'
import { Formations } from './formations'
import { Scene } from './scene'
import { Top } from './top'
import { Videos } from './videos'

/** Home: nine bands in the mockup's order, inside the skip-link target. */
export function HomePage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <Top />
      <Scene />
      <Automatisations />
      <Construit />
      <Formations />
      <Derriere />
      <Videos />
      <Faq />
      <FinBand {...FIN_BAND} />
    </main>
  )
}
