'use client'

// Client component: the entry is armed after hydration (useReveal).
import { type CSSProperties, useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useReveal } from '../useReveal'
import { ANSWERS, EYEBROW, FIGURE, LINE, SURVEY_LABEL, SURVEY_NOTE } from './content'
import './preuve.css'

/** `#preuve`: the seminar score with its base, then four anonymous answers as written. */
export function Preuve() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useReveal(ref)

  return (
    <section id="preuve" ref={ref} className="v2-fm-preuve" data-reveal={reveal}>
      <div className="wrap pv-grid">
        <div className="pv-score">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <p className="pv-figure">{FIGURE}</p>
          <p className="pv-line">{LINE}</p>
        </div>
        <div className="pv-survey proof-temoignages">
          <div className="pv-label">{SURVEY_LABEL}</div>
          <ul className="pv-list">
            {ANSWERS.map((a, i) => (
              <li
                key={`${a.question}-${a.text}`}
                className="pv-item"
                style={{ '--i': i } as CSSProperties}
              >
                <figure className="temoignage">
                  {/* no-break spaces inside the guillemets: a closing » never wraps alone */}
                  <blockquote>{`«\u00a0${a.text}\u00a0»`}</blockquote>
                  <figcaption>{a.question}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="pv-note">{SURVEY_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
