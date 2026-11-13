'use client' // the figures rise and the sand pours across the six half-days once, when they scroll in and the band has settled

import Link from 'next/link'
import { type CSSProperties, type RefObject, useEffect, useRef, useState } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { OFFRE } from './content'
import './offre.css'

/** `final` is the static HTML; `armed` and `playing` exist only after hydration, below the fold. */
type Phase = 'final' | 'armed' | 'playing'

/** Time the sand takes to fill one half-day. */
const CELL_MS = 380
const HALF_DAYS = OFFRE.groups.reduce((n, g) => n + g.halfDays, 0)
const RISE_MS = 1100

/** First half-day of each group (0-based): where the sand reaches its label and its caption. */
const STARTS = OFFRE.groups.map((_, i) =>
  OFFRE.groups.slice(0, i).reduce((n, g) => n + g.halfDays, 0),
)

/** Groups started before or at half-day `i`, the first one excluded: the gap tracks and beats before it. */
const breaks = (i: number) => STARTS.filter((s, k) => k > 0 && s <= i).length

/** The sand pauses between two groups (1 | 4 | 1), so the closing half-day lands on its own beat. */
const HOLD_MS = 300

/** When the sand starts filling half-day `i`. */
const delay = (i: number) => i * CELL_MS + breaks(i) * HOLD_MS
const POUR_MS = delay(HALF_DAYS - 1) + CELL_MS + 700
const ms = (n: number) => `${n}ms`

/**
 * One grid for the bar and its captions: an equal track per half-day and a narrow empty track
 * (`--of-gap`) between two groups, so the cells stay equal and each caption spans its own half-days.
 */
const COLS = OFFRE.groups
  .map((g) => (g.halfDays === 1 ? 'minmax(0, 1fr)' : `repeat(${g.halfDays}, minmax(0, 1fr))`))
  .join(' var(--of-gap) ')

/** Grid column of half-day `i` (0-based): its index plus the gap tracks before it. */
const col = (i: number) => i + 1 + breaks(i)

const WIDE = '(min-width: 901px)'

const vars = (v: Record<string, string | number>) => v as CSSProperties

/** How long the page must stay still before a stopped scroll counts as settled. */
const STILL_MS = 400

/**
 * True when the band's arrival is over: for good once its top has reached the bottom of the sticky
 * header (docked), or for now while the page has not scrolled for 400 ms (a visitor who stops on the
 * way). It was written for the slide over the hero (the band's rank until US-104) and keeps the pour
 * for a still page at any rank. Phones: true at once.
 */
function useSlideOver(ref: RefObject<HTMLElement | null>): boolean {
  const [docked, setDocked] = useState(false)
  const [still, setStill] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(WIDE).matches) {
      setDocked(true)
      return
    }
    let raf = 0
    let timer = 0
    const stop = () => {
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      raf = 0
    }
    const check = () => {
      raf = 0
      const line = document.querySelector('.v2-header')?.getBoundingClientRect().bottom ?? 0
      if (el.getBoundingClientRect().top <= Math.max(0, line) + 2) {
        setDocked(true)
        stop()
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    const onScroll = () => {
      setStill(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setStill(true), STILL_MS)
      schedule()
    }
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', schedule)
    schedule()
    return stop
  }, [ref])

  return docked || still
}

/**
 * Plays once: armed (emptied) after hydration only while the element is still below the fold, then
 * played when it scrolls in and `gate` holds, then back to the final state for good. Reduced motion:
 * always final.
 */
function usePlayOnce(
  ref: RefObject<HTMLElement | null>,
  ms: number,
  threshold: number,
  gate = true,
): Phase {
  const reduced = useReducedMotion()
  const inView = useInView(ref, { threshold })
  const [phase, setPhase] = useState<Phase>('final')

  useEffect(() => {
    if (reduced) {
      setPhase('final')
      return
    }
    const el = ref.current
    if (el && el.getBoundingClientRect().top > window.innerHeight) setPhase('armed')
  }, [ref, reduced])

  useEffect(() => {
    if (phase === 'armed' && inView && gate) setPhase('playing')
  }, [phase, inView, gate])

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setTimeout(() => setPhase('final'), ms)
    return () => window.clearTimeout(timer)
  }, [phase, ms])

  return phase
}

function Arrow() {
  return (
    <svg
      width="16"
      height="16"
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
}

/**
 * The training, three days on site, on a night band (4th on the home since US-104, opened by its own
 * dune): three figures, then the six half-days as a bar the gold sand fills from the management's
 * half-day to the closing one (an hourglass laid flat, like the hour of `/webinaire`), once the band
 * has docked under the header or the visitor has stopped scrolling. Each caption sits
 * under its own half-days and its label lights as the sand reaches them; on phones, where captions
 * stack, a six-cell locator says which half-days each covers. No price: the quote carries it.
 */
export function Offre() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLUListElement>(null)
  const daysRef = useRef<HTMLDivElement>(null)
  const slideOver = useSlideOver(sectionRef)
  const cards = usePlayOnce(cardsRef, RISE_MS, 0.3)
  const days = usePlayOnce(daysRef, POUR_MS, 0.45, slideOver)

  return (
    <section
      id="offre"
      ref={sectionRef}
      className="v2-offre panel"
      data-zone="offre"
      aria-labelledby="offre-h2"
    >
      <Dune back="#C68A8E" front="#161B29" />
      <div className="wrap">
        <IllHead>
          <div>
            <Eyebrow onDark>{OFFRE.eyebrow}</Eyebrow>
            <h2 id="offre-h2" className="of-h2">
              {OFFRE.title}
            </h2>
          </div>
          <SandIllustration
            src="/illus/offre-contour-nuit.webp"
            height={190}
            bare
            position="50% 52%"
          />
        </IllHead>

        <ul className="of-cards" ref={cardsRef} data-phase={cards}>
          {OFFRE.cards.map((card, i) => (
            <li key={card.key} className="of-card" style={vars({ '--i': i })}>
              <span className="of-big">{card.big}</span>
              <span className="of-sub">{card.sub}</span>
            </li>
          ))}
        </ul>

        <div
          className="of-days"
          ref={daysRef}
          data-phase={days}
          style={vars({ '--cell': `${CELL_MS}ms`, '--cols': COLS })}
        >
          <div className="of-bar" aria-hidden="true">
            {Array.from({ length: HALF_DAYS }, (_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: six fixed half-days, the index is the half-day
                key={i}
                className="of-cell"
                style={vars({ '--d': ms(delay(i)), '--c': col(i) })}
              />
            ))}
          </div>
          <ol className="of-steps">
            {OFFRE.groups.map((g, i) => (
              <li
                key={g.key}
                className="of-step"
                style={vars({ '--col': `${col(STARTS[i])} / span ${g.halfDays}` })}
              >
                <span className="of-step-head">
                  <span className="of-mini" aria-hidden="true">
                    {Array.from({ length: HALF_DAYS }, (_, c) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: six fixed half-days, the index is the half-day
                        key={c}
                        className="of-mini-cell"
                        data-on={c >= STARTS[i] && c < STARTS[i] + g.halfDays ? '' : undefined}
                        style={vars({ '--d': ms(delay(c)) })}
                      />
                    ))}
                  </span>
                  <span className="of-label" style={vars({ '--d': ms(delay(STARTS[i])) })}>
                    {g.label}
                  </span>
                </span>
                <span className="of-step-text">{g.step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="of-foot">
          <p className="of-prix">{OFFRE.prix}</p>
          <Link href={OFFRE.href} className="of-link">
            {OFFRE.link}
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}
