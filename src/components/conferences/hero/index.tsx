import { Photo } from '@/components/formations/Photo'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { typo } from '@/components/temps-partage/text'
import { site } from '@/lib/site'
import { HERO } from '../content'
import './hero.css'

/** « Sur demande, prix sur devis » carries the weight; the rest of the sentence follows plainly. */
function Demande() {
  const cut = HERO.demande.indexOf(' : ')
  if (cut < 0) return <p className="ch-demande">{typo(HERO.demande)}</p>
  return (
    <p className="ch-demande">
      <strong>{HERO.demande.slice(0, cut)}</strong>
      {typo(HERO.demande.slice(cut))}
    </p>
  )
}

/**
 * `#top` of /conferences: what Brice comes to do, on request and on quote, the booking button, and the
 * photo of a real talk (09/10, photo 01). Above the fold: no entrance, nothing hidden.
 */
export function ConferencesHero() {
  return (
    <section id="top" className="v2-conf-hero">
      <div className="wrap ch-grid">
        <div className="ch-copy">
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
          <h1>{HERO.h1}</h1>
          <p className="ch-lede">{HERO.lede}</p>
          <Demande />
          <div className="ch-cta">
            <Cta size="lg" arrow url={site.formationBookingUrl}>
              {HERO.cta}
            </Cta>
          </div>
        </div>
        <figure className="ch-fig">
          <Photo
            id="01"
            alt={HERO.photoAlt}
            className="ch-photo"
            sizes="(max-width: 900px) calc(100vw - 32px), 580px"
            eager
          />
        </figure>
      </div>
      <Dune back="#E8CFC8" front="#F2E3DF" edge="bottom" />
    </section>
  )
}
