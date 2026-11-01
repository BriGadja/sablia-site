'use client' // plays the hour once when it scrolls into view, and on « Rejouer »

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { PROGRAMME } from '@/content/webinaire'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

/**
 * The signature moment of `/webinaire`: the hour from 12 h to 13 h drawn as a bar that fills with
 * gold sand, lighting each part and its demonstration card as the sand passes (an hourglass laid
 * flat). Plays ONCE, in about six seconds, so no pause control is needed (DESIGN.md § Motion: loops
 * over 5 s only).
 *
 * The server HTML is the FINAL state (bar full, every part lit). After hydration the bar is armed
 * (emptied) only when it is still below the fold, then plays when it scrolls in; under reduced
 * motion it never leaves the final state.
 */

type Phase = 'final' | 'armed' | 'playing'

const PLAY_MS = 6000
const TOTAL = PROGRAMME.segments.reduce((sum, s) => sum + s.weight, 0)

/** Start of each segment as a fraction of the hour (0..1), keyed by segment. */
const STARTS: Record<string, number> = {}
let acc = 0
for (const segment of PROGRAMME.segments) {
  STARTS[segment.key] = acc / TOTAL
  acc += segment.weight
}

const WEIGHTS: Record<string, number> = Object.fromEntries(
  PROGRAMME.segments.map((s) => [s.key, s.weight / TOTAL]),
)

/** `--at` = start of the segment in the hour (0..1), `--w` = its share of the hour. */
const at = (key: string) =>
  ({ '--at': String(STARTS[key] ?? 0), '--w': String(WEIGHTS[key] ?? 0) }) as CSSProperties

function Hourglass() {
  return (
    <svg
      className="wbn-hour-glass"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" />
    </svg>
  )
}

export function HourTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { threshold: 0.4 })
  const [phase, setPhase] = useState<Phase>('final')

  // Arm only below the fold: a bar already on screen at load keeps its final state.
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (el.getBoundingClientRect().top > window.innerHeight) setPhase('armed')
  }, [reduced])

  useEffect(() => {
    if (phase === 'armed' && inView) setPhase('playing')
  }, [phase, inView])

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setTimeout(() => setPhase('final'), PLAY_MS + 600)
    return () => window.clearTimeout(timer)
  }, [phase])

  function replay() {
    if (reduced) return
    setPhase('armed')
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setPhase('playing')))
  }

  return (
    <div
      ref={ref}
      className="wbn-hour"
      data-phase={phase}
      style={{ '--play': `${PLAY_MS}ms` } as CSSProperties}
    >
      <div className="wbn-hour-head">
        <Hourglass />
        <span className="wbn-hour-end">{PROGRAMME.start}</span>
        <span className="wbn-hour-rule" aria-hidden="true" />
        <span className="wbn-hour-end">{PROGRAMME.end}</span>
        <button type="button" className="wbn-replay" onClick={replay} disabled={reduced}>
          {PROGRAMME.replay}
        </button>
      </div>

      <div className="wbn-hour-track">
        <ol className="wbn-hour-segs">
          {PROGRAMME.segments.map((segment) => (
            <li
              key={segment.key}
              className="wbn-seg"
              data-demo={segment.key.startsWith('d') ? 'true' : undefined}
              style={{ ...at(segment.key), flexGrow: segment.weight }}
            >
              <span className="wbn-seg-bar" aria-hidden="true" />
              <span className="wbn-seg-label">{segment.label}</span>
            </li>
          ))}
        </ol>
      </div>

      <ol className="wbn-demos">
        {PROGRAMME.demos.map((demo, index) => (
          <li key={demo.key} className="wbn-demo" style={at(demo.key)}>
            <span className="wbn-demo-num">{String(index + 1).padStart(2, '0')}</span>
            <h3>{demo.title}</h3>
            <p>{demo.line}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
