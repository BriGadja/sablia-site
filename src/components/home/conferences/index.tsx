'use client'

// Client component: the heading and the line converge from the sides once the band scrolls in (useArmedReveal).
import Link from 'next/link'
import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import './conferences.css'
import { CONFERENCES } from './content'

/** `#conferences`: talks and seminars on request, one line and the door to `/conferences`. */
export function Conferences() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section
      id="conferences"
      ref={ref}
      className="v2-home-conferences"
      data-zone="conferences"
      data-reveal={reveal}
      aria-labelledby="conferences-h2"
    >
      <div className="wrap cf-grid">
        <div className="cf-head">
          <Eyebrow>{CONFERENCES.eyebrow}</Eyebrow>
          <h2 id="conferences-h2" className="cf-h2">
            {CONFERENCES.title}
          </h2>
        </div>
        <div className="cf-body">
          <p className="cf-line">{CONFERENCES.line}</p>
          <Link href={CONFERENCES.link.href} className="cf-more">
            {CONFERENCES.link.label}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
