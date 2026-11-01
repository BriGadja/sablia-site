'use client'

// Client component: the ticket's entrance is armed after hydration (useArmedReveal).
import { useRef } from 'react'
import { BookingButton } from '@/components/shell/BookingButton'
import { Cta } from '@/components/shell/Cta'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { site } from '@/lib/site'
import './webinaire-band.css'
import { WEBINAIRE_BAND as B } from './content'

/** The band itself: title and lede on the left, the session's facts on a paper ticket on the right. */
export function WebinaireBandView() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section id="webinaire" ref={ref} className="v2-home-webinaire" data-reveal={reveal}>
      <div className="panel wb-panel">
        <div className="wrap wb-grid">
          <div className="wb-head">
            <Eyebrow onDark>{B.eyebrow}</Eyebrow>
            <h2 className="wb-h2">{B.title}</h2>
          </div>
          <div className="wb-aside">
            <SandIllustration src="/illus/formations-contour-nuit.webp" height={210} bare />
            <dl className="wb-ticket">
              {B.facts.map((f) => (
                <div key={f.key} className={`wb-fact is-${f.key}`}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="wb-body">
            <p className="wb-lede">{B.line}</p>
            <div className="wb-actions">
              <Cta variant="light" size="lg" arrow href={B.href}>
                {B.cta}
              </Cta>
              <p className="wb-autre">
                <span>{B.autre.lead}</span>{' '}
                <BookingButton className="wb-book" url={site.formationBookingUrl}>
                  {B.autre.action}
                </BookingButton>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
