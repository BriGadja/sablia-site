'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import './configurator.css'
import {
  CFG_TITLE,
  CLAIM,
  choose,
  derive,
  EX_LABEL,
  EYEBROW,
  FIRST_CHANGE_MS,
  FREE,
  H1,
  HOLD_MS,
  initialCfg,
  LEVELS,
  PG_TITLE,
  PROFILES,
  SECTORS,
  STEP_MS,
  TAGS,
  USES,
} from './content'

type Key = 's' | 'u' | 'l'

function Chips({
  label,
  name,
  options,
  cur,
  onPick,
}: {
  label: string
  name: string
  options: readonly { t: string }[]
  cur: number
  onPick: (i: number) => void
}) {
  return (
    <div className="cfg-row">
      <span className="cfg-lab">{label}</span>
      {/* biome-ignore lint/a11y/useSemanticElements: a chip row, not a form fieldset; a fieldset would bring its default border and legend box */}
      <div role="group" aria-label={name} className="chipline">
        {options.map((o, i) => (
          <button
            key={o.t}
            type="button"
            className={`opt${i === cur ? ' on' : ''}`}
            aria-pressed={i === cur}
            onClick={() => onPick(i)}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Current text rolls up and out, the new text rolls in: `.pg-old` is the outgoing line, aria-hidden. */
function Rolling({ t, old }: { t: string; old: string }) {
  return (
    <span className="pg-t">
      <span className="pg-old" aria-hidden="true">
        {old}
      </span>
      <span className="pg-new">{t}</span>
    </span>
  )
}

export function Configurator() {
  const [cfg, setCfg] = useState(() => initialCfg())
  const [auto, setAuto] = useState(true)
  const reduced = useReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const inView = useInView(boxRef, { threshold: 0.3 })
  // hover and focus on the chips and the programme pause the demo; the header button is outside that region
  const { paused, bind } = usePausable({ hover: true })
  const active = auto && inView && !paused
  const profile = useRef(0)
  const first = useRef(true)

  useEffect(() => {
    first.current = true
  }, [active])

  const pick = useCallback((key: Key, i: number) => {
    setAuto(false)
    setCfg((c) => choose(c, key, i))
  }, [])

  // The mockup's cycle: first change 1.5 s after entering view, then a 7 s hold between profiles.
  useTimelineLoop(
    async ({ wait }) => {
      await wait(first.current ? FIRST_CHANGE_MS : HOLD_MS)
      first.current = false
      const P = PROFILES[profile.current % PROFILES.length]
      profile.current++
      setCfg((c) => choose(c, 's', P.s))
      await wait(STEP_MS)
      setCfg((c) => choose(c, 'u', P.u))
      await wait(STEP_MS)
      setCfg((c) => choose(c, 'l', P.l))
    },
    { active },
  )

  const d = derive(cfg)

  return (
    <section id="top" className="v2-formations-top">
      <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
      <div className="wrap hero-grid">
        <div className="copy">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h1 className="h1">{H1}</h1>
          <p className="claim">{CLAIM}</p>
          <div className="cta-row">
            <Cta size="lg" arrow />
            <span className="free">{FREE}</span>
          </div>
          <div className="chipline tags">
            {TAGS.map((t) => (
              <span key={t} className="tagchip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="cfg" ref={boxRef}>
          <div className="cfg-head">
            <span className="cfg-title">{CFG_TITLE}</span>
            {!reduced && (
              <button type="button" className="pausebtn" onClick={() => setAuto((a) => !a)}>
                {auto ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                {auto ? 'Pause' : 'Démonstration'}
              </button>
            )}
          </div>
          <div {...bind}>
            <Chips
              label="Secteur"
              name="Secteur"
              options={SECTORS}
              cur={cfg.s}
              onPick={(i) => pick('s', i)}
            />
            <Chips
              label="À confier"
              name="À confier"
              options={USES}
              cur={cfg.u}
              onPick={(i) => pick('u', i)}
            />
            <Chips
              label="Aisance"
              name="Aisance"
              options={LEVELS}
              cur={cfg.l}
              onPick={(i) => pick('l', i)}
            />
            <div className="pg" aria-live={auto ? 'off' : 'polite'}>
              <div className="pg-head">
                <span className="pg-title">{PG_TITLE}</span>
                <span className="pg-sum">{d.summary}</span>
              </div>
              <div className={`pg-ex${d.exFlip ? ` ${d.exFlip}` : ''}`}>
                <span className="pg-exl">{EX_LABEL}</span>{' '}
                <Rolling t={`${d.ex}.`} old={`${d.exOld}.`} />
              </div>
              <div>
                {d.rows.map((r) => (
                  <div
                    key={r.n}
                    className={`pg-row${r.flip ? ` ${r.flip}` : ''}${r.late ? ' pg-late' : ''}`}
                  >
                    <span className="pg-n">{r.n}</span>
                    <Rolling t={r.t} old={r.old} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
