'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import './automatisations.css'
import { JOBS, SCENE_TEXT, SR_INTRO, SWAP_MS } from './content'
import { FlowScene } from './FlowScene'
import { PathIcon } from './icons'
import { InterventionScene } from './InterventionScene'
import { LeadScene } from './LeadScene'
import { playJob, type ScriptDeps } from './script'
import { SeanceScene } from './SeanceScene'
import { type FlowState, finalState, pickedState } from './state'
import { VeilleScene } from './VeilleScene'

type Patch = Parameters<ScriptDeps['set']>[0]

/** The loop lives in its own component so a chip pick can restart it from the top by changing its key. */
function Runner({
  active,
  cur,
  set,
  envTarget,
}: {
  active: boolean
  cur: { current: number }
  set: ScriptDeps['set']
  envTarget: ScriptDeps['envTarget']
}) {
  const first = useRef(true)
  // every (re)start plays the current job as it is, no swap; only the loop's own next rounds swap
  useEffect(() => {
    first.current = true
  }, [active])
  useTimelineLoop(
    async ({ wait }) => {
      if (!first.current) {
        set({ aPh: 'swap' })
        await wait(SWAP_MS)
        cur.current = (cur.current + 1) % JOBS.length
      }
      first.current = false
      await playJob(cur.current, { set, wait, envTarget })
    },
    { active, final: () => set(finalState(cur.current)) },
  )
  return null
}

export function Automatisations() {
  const [s, setS] = useState<FlowState>(() => finalState(0))
  const [runKey, setRunKey] = useState(0)
  const cur = useRef(0)
  const flowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(flowRef, { threshold: 0.25 })
  const { paused, userPaused, toggle } = usePausable({ hover: false })
  const reduced = useReducedMotion()
  const active = inView && !paused

  const set = useCallback<ScriptDeps['set']>((patch: Patch) => {
    setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }, [])

  const envTarget = useCallback((member: number) => {
    const root = flowRef.current
    const env = root?.querySelector<HTMLElement>('.ld-env')
    const parent = env?.offsetParent as HTMLElement | null | undefined
    const who = root?.querySelectorAll('.ld-person')[member]
    if (!parent || !who) return null
    const av = who.querySelector<HTMLElement>('.ld-av') ?? (who as HTMLElement)
    return Math.round(
      av.getBoundingClientRect().left + av.offsetWidth / 2 - 20 - parent.getBoundingClientRect().left - parent.clientLeft,
    )
  }, [])

  // pausing shows the finished picture of the current job; resuming restarts it (Runner's active flips)
  useEffect(() => {
    if (userPaused) set(finalState(cur.current))
  }, [userPaused, set])

  const pick = (i: number) => {
    cur.current = i
    setS(reduced || userPaused || !active ? finalState(i) : pickedState(i))
    setRunKey((k) => k + 1)
  }

  return (
    <section id="automatisations" className="v2-automatisations">
      <div className="wrap">
        <IllHead>
          <div>
            <Eyebrow>Automatisations</Eyebrow>
            <h2 className="auto-h2">Le même principe, partout où ça se répète.</h2>
          </div>
          <SandIllustration src="/illus/automatisations-contour-nuit.webp" height={212} position="50% 42%" />
        </IllHead>
        <div className="auto-bar">
          <div role="group" aria-label="Choisir un cas" className="auto-chips">
            {JOBS.map((j, i) => (
              <button
                key={j.label}
                type="button"
                className={`chip${i === s.job ? ' is-on' : ''}`}
                aria-pressed={i === s.job}
                onClick={() => pick(i)}
              >
                <PathIcon d={j.icon} size={18} />
                {j.label}
              </button>
            ))}
          </div>
          <button type="button" className="pausebtn" onClick={toggle}>
            {userPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
              </svg>
            )}
            {userPaused ? 'Reprendre' : 'Pause'}
          </button>
        </div>
        <div className="auto-sr">
          <p>{SR_INTRO}</p>
          <ul>
            {JOBS.map((j, i) => (
              <li key={j.label}>
                {j.label} : {j.request} Claude utilise {j.context.join(', ')}.{' '}
                {j.outputs.map((o) => `${o.title} (${o.sub}).`).join(' ')} {SCENE_TEXT[i].join(' ')}
              </li>
            ))}
          </ul>
        </div>
        <div ref={flowRef} aria-hidden="true" className="auto-stage">
          {s.job === 0 && <FlowScene s={s} />}
          {s.job === 1 && <LeadScene s={s} />}
          {s.job === 2 && <VeilleScene s={s} />}
          {s.job === 3 && <InterventionScene s={s} />}
          {s.job === 4 && <SeanceScene s={s} />}
        </div>
        <Runner key={runKey} active={active} cur={cur} set={set} envTarget={envTarget} />
      </div>
    </section>
  )
}
