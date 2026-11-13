'use client'

// Client component: the entry is armed after hydration (useReveal).
import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { Photo } from '../Photo'
import { useReveal } from '../useReveal'
import { EYEBROW, LINE, PHOTO_ALT, TITLE } from './content'
import './pourqui.css'

/** `#pourqui`: who the programme is for, beside a photo of Brice with participants. */
export function PourQui() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useReveal(ref)

  return (
    <section id="pourqui" ref={ref} className="v2-fm-pourqui" data-reveal={reveal}>
      <div className="wrap pq-grid">
        <div className="pq-copy">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h2>{TITLE}</h2>
          <p className="pq-line">{LINE}</p>
        </div>
        <figure className="pq-fig">
          <Photo
            id="05"
            alt={PHOTO_ALT}
            className="pq-photo"
            sizes="(max-width: 900px) calc(100vw - 32px), 460px"
          />
        </figure>
      </div>
    </section>
  )
}
