'use client'

// Client component: the two cards slide in from the sides once the band scrolls in (useArmedReveal).
import Link from 'next/link'
import { type CSSProperties, useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import './apres.css'
import { APRES, type SuiteCard } from './content'

/** Stroke icons, gold-dark on the cards: a monthly session (calendar) and two tools wired together. */
const ICONS: Record<SuiteCard['key'], string> = {
  referent:
    'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M9 14l2 2 4-4',
  surmesure: 'M4 4h6v6H4zM14 14h6v6h-6zM10 7h3a2 2 0 0 1 2 2v5M7 10v3a2 2 0 0 0 2 2h5',
}

function CardLine({ card }: { card: SuiteCard }) {
  if (!card.link) return <p className="ap-line">{card.line}</p>
  const [before, after] = card.line.split(card.link.text)
  return (
    <p className="ap-line">
      {before}
      <Link href={card.link.href} className="ap-inline">
        {card.link.text}
      </Link>
      {after}
    </p>
  )
}

/** `#apres`: what comes after the three days, a teaser of the « Après la formation » page. */
export function Apres() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section id="apres" ref={ref} className="v2-home-apres" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F2E3DF" />
      <div className="wrap">
        <IllHead>
          <div className="ap-head">
            <Eyebrow>{APRES.eyebrow}</Eyebrow>
            <h2 className="ap-h2">{APRES.title}</h2>
            <Link href={APRES.link.href} className="ap-more">
              {APRES.link.label}
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
          <SandIllustration src="/illus/realisations-contour-nuit.webp" height={200} />
        </IllHead>
        <ul className="ap-cards">
          {APRES.cards.map((c, i) => (
            <li key={c.key} className="ap-card" style={{ '--i': i } as CSSProperties}>
              <svg
                className="ap-icon"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#835A0C"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={ICONS[c.key]} />
              </svg>
              <h3 className="ap-title">{c.title}</h3>
              <CardLine card={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
