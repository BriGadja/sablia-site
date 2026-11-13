'use client'

// Client component: the three lines rise into place once the band scrolls in (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Cta } from '@/components/shell/Cta'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { MENSUEL } from './content'
import './mensuel.css'

/**
 * `#mensuel`: the monthly offer, first band after the hero, on the night panel the hero recedes under
 * (`PANEL_ID` of `top/index.tsx`). The offer's name, its title, three lines and the door to its page.
 * `panel` gives it the gold focus ring of the dark bands (base.css).
 */
export function Mensuel() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section
      id="mensuel"
      ref={ref}
      className="v2-home-mensuel panel"
      data-zone="mensuel"
      data-reveal={reveal}
      aria-labelledby="mensuel-h2"
    >
      <div className="wrap ms-grid">
        <div className="ms-head">
          <Eyebrow onDark>{MENSUEL.eyebrow}</Eyebrow>
          <h2 id="mensuel-h2" className="ms-h2">
            {MENSUEL.title}
          </h2>
        </div>
        <ul className="ms-lines">
          {MENSUEL.lines.map((l, i) => (
            <li key={l.key} className="ms-line" style={{ '--i': i } as CSSProperties}>
              {l.text}
            </li>
          ))}
        </ul>
        <div className="ms-cta">
          <Cta variant="light" size="lg" arrow href={MENSUEL.link.href}>
            {MENSUEL.link.label}
          </Cta>
        </div>
      </div>
    </section>
  )
}
