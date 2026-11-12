'use client'

// Client component: the entrance is armed after hydration, below the fold only (useArmedReveal).
import { type CSSProperties, Fragment, useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { typo } from '@/components/temps-partage/text'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { MORNING_MINUTES, SUJETS, TOPICS } from '../content'
import './sujets.css'

/** Share of the morning a format takes, three decimals (1, 0.25, 0.083). */
const share = (minutes: number) => Math.round((minutes / MORNING_MINUTES) * 1000) / 1000

/**
 * A two-sentence title breaks between its sentences, never inside the first one when it fits
 * (« Votre équipe utilise déjà l'IA. » / « Avec quelles règles ? »). The words are the copy's own.
 */
function Sentences({ text }: { text: string }) {
  const parts = text.split(/(?<=[.?!]) /)
  if (parts.length < 2) return <>{text}</>
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 && ' '}
          <span className="cs-s">{part}</span>
        </Fragment>
      ))}
    </>
  )
}

/**
 * A format's gauge (decorative). It arms on its own position, not the band's: at 1440 the band starts
 * inside the first screen while its gauges do not, and each one fills as it scrolls in.
 */
function Gauge({ minutes }: { minutes: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reveal = useArmedReveal(ref, { threshold: 0.5 })
  return (
    <span
      ref={ref}
      className="cs-gauge"
      aria-hidden="true"
      style={{ '--share': share(minutes) } as CSSProperties}
      data-reveal={reveal}
    >
      <span className="cs-fill" />
    </span>
  )
}

/**
 * `#sujets`, the page's signature: three topics as a ruled programme, each with its audience, its
 * format and a gauge of gold sand measuring that format against a morning of 4 h (a seminar fills
 * it, a talk of 20 minutes barely starts it). The gauges are decorative: the format text says the
 * duration. Each fills as it scrolls in; the static HTML and reduced motion show them full.
 */
export function Sujets() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref, { threshold: 0.15 })

  return (
    <section
      id="sujets"
      ref={ref}
      className="v2-conf-sujets"
      data-reveal={reveal}
      aria-labelledby="sujets-h2"
    >
      <div className="wrap">
        <div className="cs-head">
          <Eyebrow>{SUJETS.eyebrow}</Eyebrow>
          <h2 id="sujets-h2">{SUJETS.title}</h2>
        </div>
        <ul className="cs-list">
          {TOPICS.map((t, i) => (
            <li key={t.key} className="cs-topic" style={{ '--i': i } as CSSProperties}>
              <h3 className="cs-title">
                <Sentences text={t.title} />
              </h3>
              <dl className="cs-facts">
                <div className="cs-fact">
                  <dt>{SUJETS.labels.public}</dt>
                  <dd>{t.public}</dd>
                </div>
                <div className="cs-fact">
                  <dt>{SUJETS.labels.format}</dt>
                  <dd>
                    <span className="cs-format">{typo(t.format)}</span>
                    <Gauge minutes={t.minutes} />
                  </dd>
                </div>
              </dl>
              <p className="cs-text">{t.text}</p>
              <p className="cs-history">{t.history}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
