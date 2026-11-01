import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { site } from '@/lib/site'
import { HERO } from '../content'
import './hero.css'

const { photo } = HERO
const srcSet = [540, 900, 1200].map((w) => `${photo.base}-${w}.webp ${w}w`).join(', ')

/** `#top` of « Après la formation »: the two ways to continue, and Brice in conversation (09/10). */
export function AccompagnementHero() {
  return (
    <section id="top" className="v2-acc-hero">
      <Dune back="#E8CFC8" front="#F2E3DF" edge="bottom" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
          <h1 className="hero-h1">{HERO.title}</h1>
          <p className="hero-lede">{HERO.lede}</p>
          <div className="hero-cta">
            <Cta size="lg" arrow url={site.formationBookingUrl}>
              {HERO.cta}
            </Cta>
          </div>
        </div>
        <figure className="hero-photo">
          {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
          <img
            src={`${photo.base}-900.webp`}
            srcSet={srcSet}
            sizes="(max-width: 900px) calc(100vw - 32px), 600px"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            fetchPriority="high"
          />
        </figure>
      </div>
    </section>
  )
}
