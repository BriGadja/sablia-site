'use client'

// Client component: the entry is armed after hydration (useReveal).
import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { Photo } from '../Photo'
import { useReveal } from '../useReveal'
import { EYEBROW, LINE, PHOTO_ALT, TITLE } from './content'
import './conference.css'

/** `#conference`: the talk before deciding, a card laid over the photo of a real talk. */
export function Conference() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useReveal(ref)

  return (
    <section id="conference" ref={ref} className="v2-fm-conf" data-reveal={reveal}>
      <div className="wrap cf-stage">
        <figure className="cf-fig">
          <Photo
            id="01"
            alt={PHOTO_ALT}
            className="cf-photo"
            sizes="(max-width: 900px) calc(100vw - 32px), 780px"
          />
        </figure>
        <div className="cf-card">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h2>{TITLE}</h2>
          <p className="cf-line">{LINE}</p>
        </div>
      </div>
    </section>
  )
}
