'use client'

// Client component: the board's connectors draw once, after hydration, when it scrolls in.
import Link from 'next/link'
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { SURMESURE } from '../content'
import { useEntry } from '../useEntry'
import './surmesure.css'

const Arrow = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/**
 * Entry delay of tool `i`: on the two-sided desktop board the rows draw top to bottom, the right
 * side a beat after the left (`--d`); on the phone's single spine they draw in order (`--m`).
 */
const delays = (i: number) =>
  ({ '--d': `${(i % 3) * 140 + (i > 2 ? 70 : 0)}ms`, '--m': `${i * 110}ms` }) as CSSProperties

/** `#surmesure`: Claude wired into the team's tools; the six CRM pages hang from it as links. */
export function Surmesure() {
  const ref = useRef<HTMLDivElement>(null)
  const phase = useEntry(ref, { threshold: 0.4 })
  const state = phase === 'armed' ? ' is-armed' : phase === 'in' ? ' is-in' : ''

  return (
    <section id="surmesure" className="v2-acc-surmesure">
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap sm-grid">
        <div className="sm-copy">
          <Eyebrow>{SURMESURE.eyebrow}</Eyebrow>
          <h2 className="sm-h2">{SURMESURE.title}</h2>
          <p className="sm-line">{SURMESURE.line}</p>
          <div className="sm-actions">
            <Link href={SURMESURE.lead.href} className="sm-lead">
              {SURMESURE.lead.label}
              <Arrow />
            </Link>
            <Link href={SURMESURE.realisations.href} className="sm-quiet">
              {SURMESURE.realisations.label}
            </Link>
          </div>
        </div>
        {/* `panel` = dark ground: base.css turns the focus ring gold inside it. */}
        <div ref={ref} className={`board panel${state}`}>
          <span className="b-node" aria-hidden="true">
            <span className="b-spark" />
            {SURMESURE.node}
          </span>
          <ul className="b-tools" aria-label={SURMESURE.crmAria}>
            {SURMESURE.crms.map((c, i) => (
              <li key={c.href} style={delays(i)}>
                {i === 0 && <i className="b-token" aria-hidden="true" />}
                <Link href={c.href} className="b-tool">
                  {c.label}
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
