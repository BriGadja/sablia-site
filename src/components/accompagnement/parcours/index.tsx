'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useAccompagnementMode } from '@/components/accompagnement/hero/mode'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { useMeasure } from '@/lib/hooks/useMeasure'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import './parcours.css'
import { TL_FINAL, TL_START, type TlPatch, type TlState, timeline, tlHeight } from './timeline'

const PHONE = '(max-width: 900px)'

function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}
const isPhone = () => typeof window.matchMedia === 'function' && window.matchMedia(PHONE).matches
/** True on phones (panel inline under step 2); false on the server and before hydration. */
const usePhone = () => useSyncExternalStore(subscribePhone, isPhone, () => false)

/** Steps that get a decorative effect once lit (CP4 12). */
const STEP_FX = ['', '', '', 'fx-ping', 'fx-done']

function Runner({
  active,
  phone,
  set,
}: {
  active: boolean
  phone: boolean
  set: (p: TlPatch) => void
}) {
  useTimelineLoop(
    async ({ wait }) => {
      set(TL_START)
      let now = 0
      for (const [ms, patch] of timeline(phone)) {
        await wait(ms - now)
        now = ms
        set(patch)
      }
    },
    { active, loop: false, final: () => set(TL_FINAL) },
  )
  return null
}

export function AccompagnementParcours() {
  const { mode, ver, data } = useAccompagnementMode()
  const [s, setS] = useState<TlState>(TL_FINAL)
  const reduced = useReducedMotion()
  const phone = usePhone()
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  // phones start the sequence once half of the panel under « Semaine 1 » is on screen
  const inView = useInView(phone ? panelRef : sectionRef, { threshold: phone ? 0.5 : 0.2 })

  const set = useCallback((p: TlPatch) => setS((prev) => ({ ...prev, ...p })), [])

  // the server and no-JS render are the finished path; with motion allowed it is blanked after hydration, below the fold
  useEffect(() => {
    setS(reduced ? TL_FINAL : TL_START)
  }, [reduced])

  const geo = useMeasure(boxRef, (box) => {
    const dotY = [...box.querySelectorAll<HTMLElement>('.tl-step')].map((el) => el.offsetTop + 11)
    const top = box.getBoundingClientRect().top
    const railY = isPhone()
      ? [...box.querySelectorAll<HTMLElement>('.tl-inline .task')].map((r) =>
          Math.round(r.getBoundingClientRect().bottom - top),
        )
      : []
    return { dotY, railY }
  })

  const confOf = (i: number) => data.tasks.slice(0, i).filter((t) => t[1]).length
  const kept = data.tasks.filter((t) => !t[1]).length
  const sumTxt = `${data.tasks.length - kept} tâches confiées à Claude · ${kept} ${mode === 0 ? 'que vous gardez' : "que l'équipe garde"}`

  const tasks = (
    <div className="tasks">
      {data.tasks.map(([label, toClaude], i) => {
        const confirmed = toClaude === 1 && s.conf > confOf(i)
        const landed = s.tags > i
        return (
          <div key={label} className={`task${landed ? (toClaude ? ' ai' : ' hu') : ''}`}>
            <span>{label}</span>
            <span
              className={`ttag ${toClaude ? `ai${confirmed ? ' done' : ''}` : 'hu'}${landed ? ' on' : ''}`}
            >
              {toClaude ? (confirmed ? 'Confiée' : 'À confier') : data.human}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <section id="parcours" ref={sectionRef} className="v2-acc-parcours">
      <div className="wrap">
        <IllHead>
          <div>
            <Eyebrow>Le parcours</Eyebrow>
            <h2 className="acc-h2">De l'appel à l'autonomie.</h2>
          </div>
          <SandIllustration src="/illus/realisations-contour-nuit.webp" height={190} />
        </IllHead>
        <div className="tlg">
          <div className="tl" ref={boxRef}>
            <span className="tl-line">
              <i style={{ height: `${tlHeight(s, geo?.dotY ?? [], geo?.railY ?? [])}px` }} />
            </span>
            {data.steps.map(([when, title, what], i) => (
              <div
                key={when}
                className={`tl-step${STEP_FX[i] ? ` ${STEP_FX[i]}` : ''}${s.tl > i ? ' on' : ''}`}
              >
                <span className="tl-dot">
                  {i === 4 && (
                    <svg
                      className="tl-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" pathLength={1} />
                    </svg>
                  )}
                </span>
                <div className="tl-when">{when}</div>
                <h3 className="tl-t">{title}</h3>
                <p className="tl-p">{what}</p>
                {i === 1 && (
                  <div className="tl-inline" ref={panelRef}>
                    {tasks}
                    <p className={`tl-sum${s.sum ? ' on' : ''}`}>{sumTxt}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="tl-side">
            <Eyebrow>Vos tâches, semaine après semaine</Eyebrow>
            {tasks}
            <p className={`tl-sum${s.sum ? ' on' : ''}`}>{sumTxt}</p>
          </div>
        </div>
      </div>
      <Runner key={`${ver}-${phone}`} active={inView} phone={phone} set={set} />
    </section>
  )
}
