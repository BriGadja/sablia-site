'use client'

// Client component: the bar fills once the section is in view (useStaged).
import { useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useStaged } from '../useStaged'
import { EYEBROW, HALF_DAY_COUNT, HALF_DAYS, NOTE, SHORT_FORMATS, TITLE } from './content'
import './deroule.css'

const DAYS = Array.from({ length: HALF_DAY_COUNT }, (_, i) => i + 1)

/**
 * `#deroule`, the page's signature moment: six equal half-days fill with gold sand, one after the
 * other; each group card lights when its last half-day is full. The cards carry the text, the bar is
 * decorative (aria-hidden). Plays once; the server HTML and reduced motion show it full.
 */
export function Deroule() {
  const ref = useRef<HTMLElement>(null)
  const stage = useStaged(ref, HALF_DAY_COUNT)

  return (
    <section id="deroule" ref={ref} className="v2-fm-deroule">
      <Dune back="#C68A8E" front="#161B29" />
      <div className="wrap">
        <Eyebrow onDark>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <ol className="dr-bar" aria-hidden="true">
          {DAYS.map((k) => (
            <li key={k} className={`dr-seg${stage >= k ? ' is-on' : ''}`}>
              <span className="dr-track">
                <span className="dr-fill" />
              </span>
              <span className="dr-n">{k}</span>
            </li>
          ))}
        </ol>
        <ol className="dr-cards">
          {HALF_DAYS.map((h) => {
            const on = stage >= h.to
            const cur = !on && stage >= h.from
            return (
              <li key={h.key} className={`dr-card${on ? ' is-on' : ''}${cur ? ' is-cur' : ''}`}>
                <span className="dr-pips" aria-hidden="true">
                  {DAYS.map((k) => (
                    <span key={k} className={k >= h.from && k <= h.to ? 'is-mine' : undefined} />
                  ))}
                </span>
                <h3>{h.title}</h3>
                <p>{h.what}</p>
              </li>
            )
          })}
        </ol>
        <p className="dr-note">{NOTE}</p>
        <p className="dr-short">{SHORT_FORMATS}</p>
      </div>
    </section>
  )
}
