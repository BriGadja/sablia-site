'use client'

// Client component: the rule under the monthly price draws once the band scrolls in (useArmedReveal).
import { useRef } from 'react'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { site } from '@/lib/site'
import { CONDITIONS } from '../content'
import { splitLead, typo } from '../text'
import './conditions.css'

/**
 * `#conditions`, on the night band: the four conditions of the offer as a plain list (the monthly
 * price set large, the opening price, the commitment, the first-month clause), and the booking button.
 */
export function Conditions() {
  // The list, not the band, starts the rule: the rule hangs under the price, the list's first line,
  // so half the list on screen shows it; on a phone the band's top is ~150 px above the price.
  const list = useRef<HTMLUListElement>(null)
  const reveal = useArmedReveal(list, { threshold: 0.5 })

  return (
    <section id="conditions" className="v2-tp-conditions" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#161B29" />
      <div className="wrap tpk-grid">
        <div className="tpk-head">
          <Eyebrow onDark>{CONDITIONS.eyebrow}</Eyebrow>
          <h2>{CONDITIONS.title}</h2>
        </div>
        <ul ref={list} className="tpk-list">
          {CONDITIONS.items.map((item) => {
            const [lead, rest] = splitLead(typo(item.text))
            return (
              <li key={item.key} className={`tpk-item is-${item.key}`}>
                <span className="tpk-text">
                  {rest ? (
                    <>
                      <strong className="tpk-lead">{lead}</strong>
                      {rest}
                    </>
                  ) : (
                    lead
                  )}
                </span>
              </li>
            )
          })}
        </ul>
        <div className="tpk-cta">
          <Cta variant="light" size="lg" arrow url={site.formationBookingUrl} />
        </div>
      </div>
    </section>
  )
}
