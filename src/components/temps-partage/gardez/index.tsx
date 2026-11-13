'use client'

// Client component: each gold rule draws once its statement scrolls in (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { GARDEZ } from '../content'
import { splitLead, typo } from '../text'
import './gardez.css'

/**
 * One statement under its rule. The statement itself starts its rule: on a phone the three sit one
 * under the other (the third ~250 px below the first), so one trigger for the list drew the last
 * rule under the fold; on desktop they share a row, scroll in together and keep the stagger.
 */
function GardezItem({ text, i }: { text: string; i: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const reveal = useArmedReveal(ref, { threshold: 0.5 })
  const [lead, rest] = splitLead(typo(text))
  return (
    <li ref={ref} className="tpg-item" data-reveal={reveal} style={{ '--i': i } as CSSProperties}>
      <span className="tpg-rule" aria-hidden="true" />
      <p>
        <strong className="tpg-lead">{lead}</strong>
        {rest}
      </p>
    </li>
  )
}

/** `#gardez`: what stays yours, three statements; each opens on its first clause, set large. */
export function Gardez() {
  return (
    <section id="gardez" className="v2-tp-gardez">
      <Dune back="#C68A8E" front="#F2E3DF" />
      <div className="wrap">
        <div className="tpg-head">
          <Eyebrow>{GARDEZ.eyebrow}</Eyebrow>
          <h2>{GARDEZ.title}</h2>
        </div>
        <ul className="tpg-list">
          {GARDEZ.items.map((item, i) => (
            <GardezItem key={item.key} text={item.text} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
