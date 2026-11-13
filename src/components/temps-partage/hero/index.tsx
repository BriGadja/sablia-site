import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { site } from '@/lib/site'
import { HERO, PHOTOS } from '../content'
import { Emphasis, photoSrcSet, typo } from '../text'
import './hero.css'

/** The role, never split across two lines, at any width. */
const ROLE = 'responsable IA'
/** Kept on one line so the title breaks after the comma, never inside « sans le recruter ». */
const KEEP = 'sans le recruter'

/** The h1 with `ROLE` and `KEEP` wrapped, or the plain title if the copy no longer holds them. */
function Title() {
  const h1 = HERO.h1
  const role = h1.indexOf(ROLE)
  const at = h1.indexOf(KEEP)
  if (role < 0 || at < role + ROLE.length) return <h1>{typo(h1)}</h1>
  return (
    <h1>
      {typo(h1.slice(0, role))}
      <span className="tph-nowrap">{ROLE}</span>
      {typo(h1.slice(role + ROLE.length, at))}
      <span className="tph-keep">{typo(KEEP)}</span>
      {typo(h1.slice(at + KEEP.length))}
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
          <p className="tph-by">
            <Emphasis text={typo(HERO.byline)} terms={['Brice Gachadoat']} className="tph-name" />
          </p>
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
