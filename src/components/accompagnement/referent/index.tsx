'use client'

// Client component: the month drawing arms after hydration and plays its steps once in view.
import { useLayoutEffect, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import { REFERENT } from '../content'
import { useEntry } from '../useEntry'
import './referent.css'

const { month } = REFERENT
/** French unit typography at render time (the copy stays as gated): « 48 h » never splits over two lines. */
const keepUnits = (s: string) => s.replace(/(\d) h\b/g, '$1\u00a0h')

/** What lands in the 4 x 5 weekday grid, by cell index, and at which step of the sequence. */
type Mark =
  | { kind: 'session'; step: number }
  | { kind: 'q'; step: number }
  | { kind: 'a'; step: number; tag: boolean }

/** Week 1 stays empty, so the month reads as a month before anything lands in it. */
const MARKS: Readonly<Record<number, Mark>> = {
  6: { kind: 'session', step: 1 },
  8: { kind: 'q', step: 2 },
  9: { kind: 'a', step: 3, tag: true },
  10: { kind: 'q', step: 4 },
  11: { kind: 'a', step: 5, tag: false },
  17: { kind: 'q', step: 6 },
  18: { kind: 'a', step: 7, tag: false },
}
export const MONTH_STEPS = 7
/** Day number of cell `i` in a month whose first Monday is the 2nd (weekdays only). */
const dayOf = (i: number) => 2 + Math.floor(i / 5) * 7 + (i % 5)
/** Pause before each step (ms): the session lands, then each question is answered in turn. */
const BEATS = [350, 950, 650, 850, 500, 850, 500] as const

const Bubble = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5z"
      fill="currentColor"
    />
    <path
      d="M10.2 7.6a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.4"
      stroke="#161B29"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12.9" r="1" fill="#161B29" />
  </svg>
)

const Check = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
)

/** `#referent`: one 2-hour session a month, questions answered within 48 h, drawn as a month. */
export function Referent() {
  const ref = useRef<HTMLDivElement>(null)
  // Armed only while the LAST mark is still below the fold; the marks already on screen at that
  // moment stay shown (set before paint), so nothing the visitor sees ever vanishes.
  const phase = useEntry(ref, { threshold: 0.6, probe: `[data-step="${MONTH_STEPS}"]` })
  const [step, setStep] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (phase !== 'armed' || !el) return
    let seen = 0
    while (seen < MONTH_STEPS) {
      const mark = el.querySelector(`[data-step="${seen + 1}"]`)
      if (!mark || mark.getBoundingClientRect().top >= window.innerHeight) break
      seen++
    }
    setStep(seen)
  }, [phase])

  useTimelineLoop(
    async ({ wait }) => {
      for (let k = step + 1; k <= MONTH_STEPS; k++) {
        await wait(BEATS[k - 1])
        setStep(k)
      }
    },
    { active: phase === 'in', loop: false, final: () => setStep(MONTH_STEPS) },
  )

  const on = (k: number) => (phase === 'final' || step >= k ? ' on' : '')

  return (
    <section id="referent" className="v2-acc-referent">
      <div className="wrap ref-grid">
        <div className="ref-copy">
          <Eyebrow>{REFERENT.eyebrow}</Eyebrow>
          <h2 className="ref-h2">{REFERENT.title}</h2>
          <p className="ref-line">{keepUnits(REFERENT.line)}</p>
          <p className="ref-terms">{REFERENT.terms}</p>
        </div>
        <div
          ref={ref}
          className={`month${phase === 'final' ? '' : ' is-armed'}`}
          aria-hidden="true"
        >
          <div className="m-head">
            {month.days.map((d, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: two weekdays share the initial « M »
              <span key={i} className="m-day">
                {d}
              </span>
            ))}
          </div>
          <div className="m-grid">
            {Array.from({ length: 20 }, (_, i) => {
              const mark = MARKS[i]
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed grid, the index is the cell
                <div key={i} className={`m-cell${mark ? ` has-${mark.kind}` : ''}`}>
                  <span className="m-num">{dayOf(i)}</span>
                  {mark?.kind === 'session' && (
                    <span data-step={mark.step} className={`m-session${on(mark.step)}`}>
                      {month.session}
                    </span>
                  )}
                  {mark?.kind === 'q' && (
                    <span data-step={mark.step} className={`m-q${on(mark.step)}`}>
                      <Bubble />
                    </span>
                  )}
                  {mark?.kind === 'a' && (
                    <span data-step={mark.step} className={`m-a${on(mark.step)}`}>
                      <i className="m-link" />
                      <span className="m-ok">
                        <span className="m-pic">
                          {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
                          <img
                            className="m-face"
                            src={month.face}
                            alt=""
                            width={540}
                            height={675}
                            loading="lazy"
                          />
                        </span>
                        <span className="m-badge">
                          <Check />
                        </span>
                      </span>
                      {mark.tag && <span className="m-tag">{month.answer}</span>}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
