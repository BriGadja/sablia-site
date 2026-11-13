'use client'

// Client component: the entrance is armed after hydration, below the fold only (useArmedReveal).
import { useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { PREUVE } from '../content'
import './preuve.css'

/**
 * `#preuve` of /conferences: the published recommendation word for word, signed by a role and a
 * sector (never the company: proof-file rule 4). Same markup as `/formations#preuve`.
 */
export function ConferencesPreuve() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section id="preuve" ref={ref} className="v2-conf-preuve" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap cp-grid">
        <div className="cp-head">
          <Eyebrow>{PREUVE.eyebrow}</Eyebrow>
        </div>
        <figure className="cp-figure">
          {/* no-break spaces inside the guillemets: a closing » never wraps alone */}
          <blockquote className="cp-quote">{`«\u00a0${PREUVE.quote}\u00a0»`}</blockquote>
          <figcaption className="cp-sign">{PREUVE.signature}</figcaption>
        </figure>
      </div>
    </section>
  )
}
