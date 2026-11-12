import { ILLUSTRATION } from '@/components/realisations/construit/content'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { site } from '@/lib/site'
import { BESOIN, HEAD } from '../content'
import './head.css'

/**
 * `#top` of /realisations: the page title and its one line, then the « Un besoin précis ? » block (US-108:
 * one tool on request, a quote after the 30-minute call; `data-zone="besoin"` names its clicks), with the
 * band's sand drawing beside them (hidden on phones), over the moved band.
 */
/** The question on its own line, the answer under it (same text for assistive tech and crawlers). */
const cut = BESOIN.title.indexOf('? ') + 1
const QUESTION = cut > 0 ? BESOIN.title.slice(0, cut) : ''
const ANSWER = cut > 0 ? BESOIN.title.slice(cut + 1) : BESOIN.title

export function RealisationsHead() {
  return (
    <section id="top" className="v2-real-head">
      <Dune back="#E8CFC8" front="#FBF7F0" edge="bottom" />
      <div className="wrap rh-grid">
        <div>
          <h1 className="rh-h1">{HEAD.title}</h1>
          <p className="rh-intro">{HEAD.intro}</p>
          <div className="rh-besoin" data-zone="besoin">
            <h2 className="rh-besoin-title">
              {QUESTION && <span className="rh-besoin-q">{QUESTION}</span>} {ANSWER}
            </h2>
            <p className="rh-besoin-text">{BESOIN.text}</p>
            <Cta arrow url={site.formationBookingUrl}>
              {BESOIN.cta}
            </Cta>
          </div>
        </div>
        <div className="rh-ill">
          <SandIllustration src={ILLUSTRATION} height={168} />
        </div>
      </div>
    </section>
  )
}
