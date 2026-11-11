'use client'

// Client component: the journey drawing plays once, armed after hydration (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { PARCOURS, PREMIER_MOIS } from '../content'
import { typo } from '../text'
import './premier-mois.css'

/**
 * `#premier-mois`, the page's signature moment: the client journey drawn in gold on the night, the
 * four steps' bars settle one after the other (no figure: the diagnostic finds the real ones), then
 * the step where the count falls most is ringed as the one that jams, and the next one is marked.
 * The two items carry the text; the drawing is decorative. Server HTML and reduced motion: drawn.
 */
export function PremierMois() {
  // The drawing, not the section, starts the sequence: on a phone it sits ~515 px down a ~860 px
  // section, so a trigger on the section played it before the card was on screen.
  const drawing = useRef<HTMLDivElement>(null)
  const reveal = useArmedReveal(drawing, { threshold: 0.6 })
  const { steps, stuck } = PARCOURS

  return (
    <section id="premier-mois" className="v2-tp-premier-mois" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap tpm-grid">
        <div className="tpm-copy">
          <Eyebrow>{PREMIER_MOIS.eyebrow}</Eyebrow>
          <h2>{PREMIER_MOIS.title}</h2>
          <ul className="tpm-items">
            {PREMIER_MOIS.items.map((item) => (
              <li key={item.key}>{typo(item.text)}</li>
            ))}
          </ul>
        </div>
        <div ref={drawing} className="tpm-drawing" aria-hidden="true">
          <div className="tpm-caption">{PARCOURS.caption}</div>
          <ol className="tpm-steps">
            {steps.map((step, i) => {
              const role = i === stuck ? ' is-stuck' : i === stuck + 1 ? ' is-next' : ''
              return (
                <li
                  key={step.key}
                  className={`tpm-step${role}`}
                  style={{ '--i': i, '--share': step.share } as CSSProperties}
                >
                  <span className="tpm-node" />
                  <span className="tpm-label">{step.label}</span>
                  {i === stuck && <span className="tpm-tag">{PARCOURS.stuckLabel}</span>}
                  {i === stuck + 1 && <span className="tpm-tag">{PARCOURS.nextLabel}</span>}
                  <span className="tpm-track">
                    <span className="tpm-fill" />
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
