import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { site } from '@/lib/site'
import { HERO, PHOTOS } from '../content'
import { photoSrcSet, typo } from '../text'
import './hero.css'

/** Kept on one line on desktop so the title breaks after the role, never inside it. */
const KEEP = 'à temps partagé,'

/** The h1 with `KEEP` wrapped, or the plain title if the copy no longer holds it. */
function Title() {
  const at = HERO.h1.indexOf(KEEP)
  if (at < 0) return <h1>{typo(HERO.h1)}</h1>
  return (
    <h1>
      {typo(HERO.h1.slice(0, at))}
      <span className="tph-keep">{typo(KEEP)}</span>
      {typo(HERO.h1.slice(at + KEEP.length))}
    </h1>
  )
}

/**
 * `#top`: the role, Rouen, the booking button, and the three facts a manager looks for first
 * (price, commitment, size) as a plain list. Above the fold: no entrance, nothing hidden.
 */
export function TempsPartageHero() {
  const photo = PHOTOS.hero
  return (
    <section id="top" className="v2-tp-hero">
      <div className="wrap tph-grid">
        <div className="tph-copy">
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
          <Title />
          <p className="tph-lede">{typo(HERO.lede)}</p>
          <p className="tph-for">{typo(HERO.audience)}</p>
          <div className="tph-cta">
            <Cta size="lg" arrow url={site.formationBookingUrl}>
              {HERO.cta}
            </Cta>
            <span className="tph-free">{typo(HERO.reassure)}</span>
          </div>
        </div>
        <figure className="tph-fig">
          {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
          <img
            src={`/photos/formation-${photo.n}-900.webp`}
            srcSet={photoSrcSet(photo.n)}
            sizes="(max-width: 900px) calc(100vw - 32px), 540px"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
        <dl className="tph-facts">
          {HERO.facts.map((f) => (
            <div key={f.key} className={`tph-fact is-${f.key}`}>
              <dt>{f.label}</dt>
              <dd>{typo(f.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Dune back="#E8CFC8" front="#F2E3DF" edge="bottom" />
    </section>
  )
}
