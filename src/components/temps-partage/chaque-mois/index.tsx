'use client'

// Client component: each row rises once it scrolls in (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { CHAQUE_MOIS } from '../content'
import { typo } from '../text'
import './chaque-mois.css'

/**
 * One row of the ruled list. The row itself starts its rise: under the title the list sits ~160 px
 * below the section top on desktop and runs ~330 px on a phone, so a section trigger raised rows
 * under the fold; on desktop two rows share a grid row and rise together, in turn.
 */
function Row({ text, i }: { text: string; i: number }) {
  const ref = useRef<HTMLLIElement>(null)
  const reveal = useArmedReveal(ref, { threshold: 0.5 })
  return (
    <li ref={ref} className="tpc-item" data-reveal={reveal} style={{ '--i': i } as CSSProperties}>
      {typo(text)}
    </li>
  )
}

/** `#chaque-mois`: what each following month holds, four rows set as the page's ruled list. */
export function ChaqueMois() {
  return (
    <section id="chaque-mois" className="v2-tp-chaque-mois">
      <div className="wrap">
        <div className="tpc-head">
          <Eyebrow>{CHAQUE_MOIS.eyebrow}</Eyebrow>
          <h2>{CHAQUE_MOIS.title}</h2>
        </div>
        <ul className="tpc-list">
          {CHAQUE_MOIS.items.map((item, i) => (
            <Row key={item.key} text={item.text} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
