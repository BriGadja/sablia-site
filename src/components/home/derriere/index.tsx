'use client'

// Client component: the counters count up and the timeline stages in once scrolled into view.
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { useInView } from '@/lib/hooks/useInView'
import './derriere.css'
import {
  CAREER,
  EYEBROW,
  formatFigure,
  HEADING,
  LINE,
  NOESIA,
  PORTRAIT,
  photoSrcSet,
  STATS,
  type Stat,
  TIMELINE_LABEL,
} from './content'

function Counter({ stat, active }: { stat: Stat; active: boolean }) {
  const n = useCountUp(stat.value, { active })
  return (
    <div className={`dr-stat is-${stat.key}`}>
      <div className="dr-big">{`${formatFigure(n)}${stat.suffix}`}</div>
      <div className="dr-stat-label">{stat.label}</div>
    </div>
  )
}

/** The Noésia line with its school name as the link, split from the one gated string. */
function NoesiaLine() {
  const [before, after] = NOESIA.line.split(NOESIA.link)
  return (
    <p className="dr-noesia">
      {before}
      <a href={NOESIA.href} className="dr-school">
        {NOESIA.link}
      </a>
      {after}
    </p>
  )
}

/**
 * `#derriere`: who is behind Sablia. Keeps its id: `/about` 301s to `/#derriere`. It follows the night
 * `#videos` band (US-104), so it opens on its own dune, front = its sand ground.
 */
export function Derriere() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const reveal = useArmedReveal(sectionRef)
  const counting = useInView(statsRef, { threshold: 0.6, once: true })

  return (
    <section id="derriere" ref={sectionRef} className="v2-derriere" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap dr-grid">
        <div className="dr-head">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h2 className="dr-h2">{HEADING}</h2>
        </div>
        <figure className="dr-portrait">
          {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
          <img
            src={`/photos/formation-${PORTRAIT.n}-900.webp`}
            srcSet={photoSrcSet(PORTRAIT.n)}
            sizes="(max-width: 900px) 100vw, 480px"
            width={1200}
            height={1500}
            loading="lazy"
            decoding="async"
            alt={PORTRAIT.alt}
          />
        </figure>
        <div className="dr-body">
          <p className="dr-line">{LINE}</p>
          <ul className="dr-tl" aria-label={TIMELINE_LABEL}>
            {CAREER.map((c, i) => (
              <li
                key={c.key}
                className={`dr-step${c.key === 'sablia' ? ' is-now' : ''}`}
                style={{ '--i': i } as CSSProperties}
              >
                <div className="dr-period">{c.period}</div>
                <div className="dr-employer">{c.employer}</div>
                <div className="dr-role">{c.role}</div>
              </li>
            ))}
          </ul>
          <div ref={statsRef} className="dr-stats">
            {STATS.map((s) => (
              <Counter key={s.key} stat={s} active={counting} />
            ))}
          </div>
          <NoesiaLine />
        </div>
      </div>
    </section>
  )
}
