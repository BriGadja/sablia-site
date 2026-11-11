'use client'

// Client component: the gold rules draw once the section scrolls in (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { GARDEZ } from '../content'
import { splitLead, typo } from '../text'
import './gardez.css'

/** `#gardez`: what stays yours, three statements; each opens on its first clause, set large. */
export function Gardez() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section id="gardez" ref={ref} className="v2-tp-gardez" data-reveal={reveal}>
      <div className="wrap">
        <div className="tpg-head">
          <Eyebrow>{GARDEZ.eyebrow}</Eyebrow>
          <h2>{GARDEZ.title}</h2>
        </div>
        <ul className="tpg-list">
          {GARDEZ.items.map((item, i) => {
            const [lead, rest] = splitLead(typo(item.text))
            return (
              <li key={item.key} className="tpg-item" style={{ '--i': i } as CSSProperties}>
                <span className="tpg-rule" aria-hidden="true" />
                <p>
                  <strong className="tpg-lead">{lead}</strong>
                  {rest}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
