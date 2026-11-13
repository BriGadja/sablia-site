'use client'

// Client component: the entry is armed after hydration (useReveal).
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { useReveal } from '../useReveal'
import { EYEBROW, ITEMS, TITLE } from './content'
import './inclus.css'

/** `#inclus`: what the team keeps, laid out as the documents handed over, beside the sand book. */
export function Inclus() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useReveal(ref)

  return (
    <section id="inclus" ref={ref} className="v2-fm-inclus" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap in-grid">
        <div className="in-head">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h2>{TITLE}</h2>
          <div className="in-ill">
            <SandIllustration
              src="/illus/formations-contour-nuit.webp"
              height={240}
              position="50% 40%"
            />
          </div>
        </div>
        <ol className="in-docs">
          {ITEMS.map((it, i) => (
            <li key={it.key} className="in-doc" style={{ '--i': i } as CSSProperties}>
              <span className="in-n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="in-t">{it.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
