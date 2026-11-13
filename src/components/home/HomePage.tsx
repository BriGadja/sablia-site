import { FinBand } from '@/components/shell/FinBand'
import { WhenUpcoming } from '@/content/session-bar'
import { Automatisations } from './automatisations'
import { Conferences } from './conferences'
import { Derriere } from './derriere'
import { Faq } from './faq'
import { FIN_BAND } from './faq/content'
import { Formations } from './formations'
import { Mensuel } from './mensuel'
import { Offre } from './offre'
import { Top } from './top'
import { Videos } from './videos'
import { WebinaireBand } from './webinaire'

/**
 * The home (US-104, plan sablia-site-structure-offre, home order of E1), inside the skip-link target:
 * the four doors in the hero, then the monthly offer, the agents, the training, the photos, the
 * talks, the videos, the founder, the webinar, the questions. `Mensuel` follows `Top` directly: the
 * hero recedes under the `#mensuel` panel (`PANEL_ID` in top/index.tsx). `#webinaire` and the
 * closing band's quiet webinar link exist only while the 03/12 session is ahead; from its start the
 * band keeps its booking button and loses the dated link (switch: `WhenUpcoming` only).
 */
export function HomePage() {
  return (
    <main id="contenu" tabIndex={-1}>
      <Top />
      <Mensuel />
      <Automatisations />
      <Offre />
      <Formations />
      <Conferences />
      <Videos />
      <Derriere />
      <WebinaireBand />
      <Faq />
      <WhenUpcoming
        upcoming={<FinBand {...FIN_BAND} />}
        past={<FinBand {...FIN_BAND} link={undefined} />}
      />
    </main>
  )
}
