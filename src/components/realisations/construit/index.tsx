'use client'

import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import {
  CARD_LINKS,
  CARDS,
  cardsFor,
  deckSlot,
  EYEBROW,
  FILTER_GROUP_LABEL,
  FILTERS,
  FINAL_STAGE,
  figureText,
  IDLE_STAGE,
  ILLUSTRATION,
  PAUSE_LABEL,
  RESUME_LABEL,
  type RealisationFilter,
  SUBTITLE,
  statusText,
  TITLE,
} from './content'
import type { CardStage } from './types'
import './construit.css'

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

type ConstruitProps = {
  /**
   * The band opens a page under that page's head (`/realisations`): the page h1 takes the role of the
   * « Réalisations » kicker, which is not rendered a second time; the head carries the sand drawing, so
   * the band's own head keeps its title and the pause; the head's dune opens the band, which drops its
   * top hairline and most of its top padding. Default: a band among others (home).
   */
  underPageHead?: boolean
}

export function Construit({ underPageHead = false }: ConstruitProps = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(sectionRef, { threshold: 0.3 })
  // Hover (and focus) on the deck pause it; the button is the user's own pause.
  const pause = usePausable()
  const live = inView && !pause.paused && !reduced
  // Reduced motion: nothing scrolls by itself, so the button already reads « Reprendre » (as the mockup).
  const stopped = pause.userPaused || reduced

  // US-108: the chip row keeps the cards of one type. The server and the first client render show them all
  // (« Toutes »), so the static HTML, no-JS and reduced motion keep the seven cards and hydration matches.
  const [filter, setFilter] = useState<RealisationFilter>('toutes')
  // A chip has been pressed: from then on the rows of a new set rise into place (never on the first paint).
  const [picked, setPicked] = useState(false)
  const shown = useMemo(() => cardsFor(filter), [filter])
  const n = shown.length
  const chip = FILTERS.find((f) => f.key === filter) ?? FILTERS[0]

  // `deck` and `prev` are positions in `shown`, not in the whole wall.
  const [deck, setDeck] = useState(0)
  const [prev, setPrev] = useState(-1)
  // Server HTML and reduced motion carry the finished picture; the first scroll into view restarts it.
  const [stage, setStage] = useState<CardStage>(FINAL_STAGE)
  const [run, setRun] = useState(0)

  const liveRef = useRef(live)
  liveRef.current = live
  const deckRef = useRef(deck)
  deckRef.current = deck
  const shownRef = useRef(shown)
  shownRef.current = shown
  const runRef = useRef(0)
  const playedRun = useRef(0)
  const started = useRef(false)

  /**
   * The mockup's goCard: show card `i` of the set; build it up only if the wall is playing right now. A new
   * run cancels the previous build-up (its effect cleanup clears every timer). `fresh` = a new set: no card
   * of the old set is leaving.
   */
  const goCard = useCallback((i: number, fresh = false) => {
    const r = ++runRef.current
    const playing = liveRef.current
    if (!playing) playedRun.current = r // a frozen wall stays on the finished picture until the next turn
    if (fresh) setPrev(-1)
    else if (i !== deckRef.current) setPrev(deckRef.current)
    setDeck(i)
    setStage(playing ? IDLE_STAGE : FINAL_STAGE)
    setRun(r)
  }, [])

  const next = useCallback(() => goCard((deckRef.current + 1) % shownRef.current.length), [goCard])

  /** A chip press: the set changes and the deck starts again on its first card; the visitor's pause stays. */
  const choose = (f: RealisationFilter) => {
    if (f === filter) return
    setFilter(f)
    setPicked(true)
    goCard(0, true)
  }

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
    const card = shownRef.current[deckRef.current]
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

  const stageOf = (j: number): CardStage =>
    j === deck ? stage : j === prev ? FINAL_STAGE : IDLE_STAGE

  return (
    <section
      id="construit"
      ref={sectionRef}
      className={`v2-construit${underPageHead ? ' is-under-head' : ''}`}
    >
      <div className="wrap">
        <div className="cn-head">
          <div>
            {!underPageHead && <Eyebrow>{EYEBROW}</Eyebrow>}
            <h2 className="cn-h2">{TITLE}</h2>
            <p className="cn-sub">{SUBTITLE}</p>
          </div>
          {!underPageHead && (
            <div className="ill-side">
              <SandIllustration src={ILLUSTRATION} height={196} />
            </div>
          )}
        </div>

        <div className="cn-bar">
          {/* biome-ignore lint/a11y/useSemanticElements: a chip row, not a form fieldset; a fieldset would bring its default border and legend box */}
          <div role="group" aria-label={FILTER_GROUP_LABEL} className="cn-chips">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`cn-chip${f.key === filter ? ' is-on' : ''}`}
                aria-pressed={f.key === filter}
                onClick={() => choose(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Outside the rotating deck: announced on a chip press only, never on each turn of the wall. */}
          <p role="status" className="cn-count">
            {statusText(n, CARDS.length)}
          </p>
          {/* One card does not turn: nothing to pause, so no button (the visitor's pause is kept for later). */}
          {n > 1 && (
            <button type="button" className="pausebtn" onClick={pause.toggle}>
              {stopped ? <PlayIcon /> : <PauseIcon />}
              {stopped ? RESUME_LABEL : PAUSE_LABEL}
            </button>
          )}
        </div>

        <div className="wall-grid">
          <div className="deck-wrap" {...pause.bind}>
            {CARDS.map((card) => {
              // Every card stays in the HTML; a card outside the set is `hidden` (out of the page and of the
              // accessibility tree) and holds no stage of its own.
              const j = shown.indexOf(card)
              const inSet = j >= 0
              const slot = deckSlot(inSet ? j : 0, deck, n)
              const active = inSet && slot.active
              const st = inSet ? stageOf(j) : IDLE_STAGE
              const showFig = !!card.fig && st.l >= card.lines
              return (
                <article
                  key={card.kind}
                  className="deck-card"
                  hidden={!inSet}
                  aria-hidden={active ? 'false' : 'true'}
                  style={
                    inSet
                      ? {
                          transform: `translate(0px, ${slot.ty}px) scale(${slot.sc})`,
                          opacity: slot.op,
                          zIndex: slot.z,
                          pointerEvents: active ? 'auto' : 'none',
                        }
                      : undefined
                  }
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
                            className="cn-link"
                            tabIndex={active ? undefined : -1}
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
                    style={{
                      background: slot.second ? '#EEF0F5' : '#E3E6EE',
                      opacity: active ? 0 : 1,
                    }}
                  />
                </article>
              )
            })}
          </div>

          <ol aria-label={chip.listLabel} className={`cn-list${picked ? ' is-picked' : ''}`}>
            {shown.map((card, j) => {
              const active = j === deck
              return (
                // Keyed by the set too: a new set's rows mount again and rise into place (`is-picked`).
                <li key={`${filter}:${card.kind}`} style={{ '--i': j } as CSSProperties}>
                  <button
                    type="button"
                    className={`caserow${active ? ' is-on' : ''}`}
                    onClick={() => goCard(j)}
                    aria-current={active ? 'true' : undefined}
                  >
                    <span className="cn-row-tag">{card.tags}</span>
                    <span className="cn-row-sector">{card.sector}</span>
                    <span className="cn-row-bar">
                      {/* The bar drives the turn; a set of one card has no turn, so no bar. */}
                      {active && n > 1 && (
                        <span
                          key={`${filter}:${deck}`}
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
