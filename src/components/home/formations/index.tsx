import { Dune } from '@/components/shell/Dune'
import { photoSrcSet } from '../derriere/content'
import './formations.css'
import { STRIP } from './content'

/**
 * `#formations`: three photos of a real session open the trainer band; `#derriere` names him right
 * after. A dune carries the rose of the agents band into the sand. The photos drift a few pixels
 * against each other on scroll (CSS view timeline, final state without support or under reduced motion).
 */
export function Formations() {
  return (
    <section id="formations" className="v2-formations">
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap fm-strip">
        {STRIP.map((p) => (
          <figure key={p.n} className="fm-shot">
            {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
            <img
              src={`/photos/formation-${p.n}-900.webp`}
              srcSet={photoSrcSet(p.n)}
              sizes="(max-width: 900px) 100vw, 400px"
              width={1200}
              height={800}
              loading="lazy"
              decoding="async"
              alt={p.alt}
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
