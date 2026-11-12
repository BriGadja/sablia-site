import { FinBand } from '@/components/shell/FinBand'
import { WhenUpcoming } from '@/content/session-bar'
import { Apres } from './apres'
import { Automatisations } from './automatisations'
import { Derriere } from './derriere'
import { Faq } from './faq'
import { FIN_BAND } from './faq/content'
import { Formations } from './formations'
import { Offre } from './offre'
import { Top } from './top'
import { Videos } from './videos'
import { WebinaireBand } from './webinaire'

/**
 * The training home (plan site-formation-lot1, Data contract « Home order »), inside the skip-link
 * target. `Offre` follows `Top` directly: the hero recedes under the `#offre` panel. `#webinaire`
 * and the closing band's quiet webinar link exist only while the 03/12 session is ahead; from its
 * start the band keeps its booking button and loses the dated link (switch: `WhenUpcoming` only).
 */
export function HomePage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <Top />
      <Offre />
      <Automatisations />
      <Formations />
      <Derriere />
      <WebinaireBand />
      <Apres />
      <Videos />
      <Faq />
      <WhenUpcoming
        upcoming={<FinBand {...FIN_BAND} />}
        past={<FinBand {...FIN_BAND} link={undefined} />}
      />
    </main>
  )
}
