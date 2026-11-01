import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { site } from '@/lib/site'
import { Photo } from '../Photo'
import { CTA, EYEBROW, FACTS, H1, LEDE, PHOTO_ALT, REASSURE } from './content'
import './hero.css'

/** `#top` of /formations: the offer, its booking button, a photo of 09/10 and the four facts. */
export function FormationsHero() {
  return (
    <section id="top" className="v2-fm-hero">
      <div className="wrap">
        <div className="fh-grid">
          <div className="fh-copy">
            <Eyebrow>{EYEBROW}</Eyebrow>
            <h1>{H1}</h1>
            <p className="fh-lede">{LEDE}</p>
            <div className="fh-cta">
              <Cta size="lg" arrow url={site.formationBookingUrl}>
                {CTA}
              </Cta>
              <span className="fh-free">{REASSURE}</span>
            </div>
          </div>
          <figure className="fh-fig">
            <Photo
              id="04"
              alt={PHOTO_ALT}
              className="fh-photo"
              sizes="(max-width: 900px) calc(100vw - 32px), 600px"
              eager
            />
          </figure>
        </div>
        <dl className="fh-facts">
          {FACTS.map((f) => (
            <div key={f.key} className="fh-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Dune back="#E8CFC8" front="#F2E3DF" edge="bottom" />
    </section>
  )
}
