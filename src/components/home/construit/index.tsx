'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import {
  CARDS,
  CARD_LINKS,
  EYEBROW,
  FINAL_STAGE,
  IDLE_STAGE,
  LIST_LABEL,
  PAUSE_LABEL,
  RESUME_LABEL,
  SUBTITLE,
  TITLE,
  deckSlot,
  figureText,
} from './content'
import type { CardStage } from './types'
import './construit.css'

const N = CARDS.length

const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
  </svg>
)
const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
)

export function Construit() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(sectionRef, { threshold: 0.3 })
  // Hover (and focus) on the deck pause it; the button is the user's own pause.
  const pause = usePausable()
  const live = inView && !pause.paused && !reduced
  // Reduced motion: nothing scrolls by itself, so the button already reads « Reprendre » (as the mockup).
  const stopped = pause.userPaused || reduced

  const [deck, setDeck] = useState(0)
  const [prev, setPrev] = useState(-1)
  // Server HTML and reduced motion carry the finished picture; the first scroll into view restarts it.
  const [stage, setStage] = useState<CardStage>(FINAL_STAGE)
  const [run, setRun] = useState(0)

  const liveRef = useRef(live)
  liveRef.current = live
  const deckRef = useRef(deck)
  deckRef.current = deck
  const runRef = useRef(0)
  const playedRun = useRef(0)
  const started = useRef(false)

  /** The mockup's goCard: show card `i`; build it up only if the wall is playing right now. */
  const goCard = useCallback((i: number) => {
    const r = ++runRef.current
    const playing = liveRef.current
    if (!playing) playedRun.current = r // a frozen wall stays on the finished picture until the next turn
    if (i !== deckRef.current) setPrev(deckRef.current)
    setDeck(i)
    setStage(playing ? IDLE_STAGE : FINAL_STAGE)
    setRun(r)
  }, [])

  const next = useCallback(() => goCard((deckRef.current + 1) % N), [goCard])

  // First time the wall is on screen: build the first card up.
  useEffect(() => {
    if (inView && !started.current && !reduced) {
      started.current = true
      goCard(deckRef.current)
    }
  }, [inView, reduced, goCard])

  // Build-up of the front card; freezing (hover, pause, off screen) jumps to the finished picture.
  useEffect(() => {
    if (!live) {
      setStage(FINAL_STAGE)
      return
    }
    if (run === 0 || playedRun.current === run) return
    playedRun.current = run
    const card = CARDS[deckRef.current]
    let dead = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms))
      })
    const count = async () => {
      for (let s = 1; s <= 24; s++) {
        if (dead) return
        setStage((st) => ({ ...st, f: s / 24 }))
        await wait(50)
      }
    }
    ;(async () => {
      setStage((st) => ({ ...st, plan: true }))
      await wait(500)
      for (let b = 1; b <= card.panels; b++) {
        if (dead) return
        setStage((st) => ({ ...st, b }))
        await wait(260)
      }
      if (dead) return
      await wait(card.panelHold ?? 450)
      for (let l = 1; l <= card.lines; l++) {
        if (dead) return
        setStage((st) => ({ ...st, l }))
        if (l === card.lines && card.fig) void count()
        await wait(card.lineStep ?? 650)
      }
    })()
    return () => {
      dead = true
      for (const t of timers) clearTimeout(t)
    }
  }, [live, run])

  const stageOf = (i: number): CardStage =>
    i === deck ? stage : i === prev ? FINAL_STAGE : IDLE_STAGE

  return (
    <section id="construit" ref={sectionRef} className="v2-construit">
      <div className="wrap">
        <div className="cn-head">
          <div>
            <Eyebrow>{EYEBROW}</Eyebrow>
            <h2 className="cn-h2">{TITLE}</h2>
            <p className="cn-sub">{SUBTITLE}</p>
          </div>
          <div className="ill-side">
            <SandIllustration src="/illus/realisations-contour-nuit.webp" height={196} />
            <button type="button" className="pausebtn" onClick={pause.toggle}>
              {stopped ? <PlayIcon /> : <PauseIcon />}
              {stopped ? RESUME_LABEL : PAUSE_LABEL}
            </button>
          </div>
        </div>

        <div className="wall-grid">
          <div className="deck-wrap" {...pause.bind}>
            {CARDS.map((card, i) => {
              const slot = deckSlot(i, deck, N)
              const st = stageOf(i)
              const showFig = !!card.fig && st.l >= card.lines
              return (
                <article
                  key={card.kind}
                  className="deck-card"
                  aria-hidden={slot.active ? 'false' : 'true'}
                  style={{
                    transform: `translate(0px, ${slot.ty}px) scale(${slot.sc})`,
                    opacity: slot.op,
                    zIndex: slot.z,
                    pointerEvents: slot.active ? 'auto' : 'none',
                  }}
                >
                  <div className="bp-area" aria-hidden="true">
                    <div className="bp-ground" />
                    <div className="bp-stage">
                      <card.Drawing stage={st} />
                    </div>
                  </div>
                  <div className="cn-body">
                    <div className="cn-meta">
                      <span className={`cn-tag${card.muted ? ' is-muted' : ''}`}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={card.icon} />
                        </svg>
                        {card.tags}
                      </span>
                      {card.fig && (
                        <span className={`cn-fig${showFig ? '' : ' is-off'}`}>
                          <i />
                          {figureText(card, showFig ? st.f : 1)}
                        </span>
                      )}
                    </div>
                    <h3 className="cn-sector">{card.sector}</h3>
                    <p className="cn-text">
                      {card.text}
                      {CARD_LINKS[card.kind] && (
                        <>
                          {' '}
                          <a
                            href={CARD_LINKS[card.kind]?.href}
                            rel="noopener"
                            tabIndex={slot.active ? undefined : -1}
                            style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
                          >
                            {CARD_LINKS[card.kind]?.label}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div
                    className="cn-veil"
                    style={{ background: slot.second ? '#EEF0F5' : '#E3E6EE', opacity: slot.active ? 0 : 1 }}
                  />
                </article>
              )
            })}
          </div>

          <ol aria-label={LIST_LABEL} className="cn-list">
            {CARDS.map((card, i) => {
              const active = i === deck
              return (
                <li key={card.kind}>
                  <button
                    type="button"
                    className={`caserow${active ? ' is-on' : ''}`}
                    onClick={() => goCard(i)}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className="cn-row-tag">{card.tags}</span>
                    <span className="cn-row-sector">{card.sector}</span>
                    <span className="cn-row-bar">
                      {active && (
                        <span
                          key={deck}
                          className="grow"
                          onAnimationEnd={next}
                          style={{ animationPlayState: live ? 'running' : 'paused' }}
                        />
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
