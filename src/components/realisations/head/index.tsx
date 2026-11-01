import { ILLUSTRATION } from '@/components/realisations/construit/content'
import { Dune } from '@/components/shell/Dune'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { HEAD } from '../content'
import './head.css'

/**
 * `#top` of /realisations: the page title and its one line, with the band's sand drawing beside them
 * (hidden on phones, so the first card of the wall enters the first screen), over the moved band.
 */
export function RealisationsHead() {
  return (
    <section id="top" className="v2-real-head">
      <Dune back="#E8CFC8" front="#FBF7F0" edge="bottom" />
      <div className="wrap rh-grid">
        <div>
          <h1 className="rh-h1">{HEAD.title}</h1>
          <p className="rh-intro">{HEAD.intro}</p>
        </div>
        <div className="rh-ill">
          <SandIllustration src={ILLUSTRATION} height={168} />
        </div>
      </div>
    </section>
  )
}
