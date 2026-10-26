'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { OF1_ROUTE } from '@/content/of1'
import { useInView } from '@/lib/hooks/useInView'
import { usePausable } from '@/lib/hooks/usePausable'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import {
  CALLS,
  CALL_LINES,
  type CallState,
  type ChipState,
  EYEBROW,
  ICON_CLOCK,
  OFFER,
  SR_INTRO,
  TITLE,
  TOOLS,
  TOOLS_LABEL,
  WAVE,
  callFinal,
  callReset,
  derive,
  offerFigures,
} from './content'
import './scene.css'

type Patch = Partial<CallState> | ((s: CallState) => Partial<CallState>)

const Icon = ({ d, size = 16, w = 1.9 }: { d: string; size?: number; w?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
)

const Check = ({ size, stroke, w }: { size: number; stroke: string; w: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
)

const MARKS: Record<number, Partial<CallState>> = {
  6: { pq: 1 },
  11: { hl: 1 },
  18: { pq: 2 },
  23: { hl: 2 },
  30: { pq: 3 },
  35: { hl: 3 },
}

interface Deps {
  set: (p: Patch) => void
  chip: (i: number, p: Partial<ChipState>) => void
  wordAt: (el: HTMLElement | null | undefined) => { px: number; py: number } | null
  kEls: { current: (HTMLElement | null)[] }
  k2El: { current: HTMLElement | null }
  cur: { current: number }
  setCase: (i: number) => void
}

/** The loop lives in its own component so a tab pick restarts it from the top by changing its key. */
function Runner({ active, d, final }: { active: boolean; d: Deps; final: () => void }) {
  const first = useRef(true)
  // every (re)start plays the case on screen as it is; only the loop's own next laps advance the case
  useEffect(() => {
    first.current = true
  }, [active])
  useTimelineLoop(
    async ({ wait, alive }) => {
      const { set, chip, wordAt, kEls, k2El, cur, setCase } = d
      const at = (ms: number, fn: () => void) =>
        setTimeout(() => {
          if (alive()) fn()
        }, ms)
      if (!first.current) cur.current = (cur.current + 1) % CALLS.length
      first.current = false
      setCase(cur.current)
      set(callReset())
      await wait(500)
      for (let k = 1; k <= 42; k++) {
        set({ p: k / 42, ...MARKS[k] })
        await wait(100)
      }
      set({ hung: true, step: 1, st: 'read' })
      if (CALLS[cur.current]?.clock) {
        for (let t = 1; t <= 40; t++) at(250 * t, () => set((s) => ({ clk: Math.max(s.clk, t) })))
      }
      await wait(1000)
      for (let i = 0; i < 3; i++) {
        chip(i, { x: 1, vis: true, tr: false, look: 'raw', px: null, py: null, ...wordAt(kEls.current[i]) })
        await wait(40)
        chip(i, { x: 2, tr: true, px: null, py: null })
        set({ t1: i + 1, lift: i + 1 })
        at(720, () => {
          chip(i, { vis: false, tr: false })
          set({ mv1: i + 1 })
        })
        await wait(160)
      }
      await wait(700)
      set({ step: 2, st: 'write' })
      for (let i = 0; i < 3; i++) {
        await wait(i === 0 ? 300 : 650)
        set({ cl: i + 1 })
      }
      await wait(700)
      set({ st: 'plan', k2: true })
      await wait(600)
      chip(3, { x: 1, vis: true, tr: false, look: 'raw', px: null, py: null, ...wordAt(k2El.current) })
      await wait(40)
      chip(3, { x: 2, tr: true, px: null, py: null })
      await wait(740)
      chip(3, { vis: false, tr: false })
      set({ rel: true })
      await wait(1000)
      set({ st: 'send' })
      for (let i = 0; i < 3; i++) {
        chip(i, { x: 2, vis: true, tr: false, look: 'clean' })
        set({ mv2: i + 1 })
        await wait(40)
        chip(i, { x: 3, tr: true })
        set({ t2: i + 1 })
        at(720, () => {
          chip(i, { vis: false, tr: false })
          set({ land: i + 1 })
        })
        await wait(160)
      }
      await wait(800)
      set({ step: 3, upd: true })
      await wait(700)
      chip(3, { x: 2, vis: true, tr: false, look: 'task' })
      set({ mv2: 4 })
      await wait(40)
      chip(3, { x: 3, tr: true })
      set({ t2: 4 })
      await wait(720)
      chip(3, { vis: false, tr: false })
      set({ land: 4, step: 4, st: 'done', clk: 40 })
      await wait(900)
      set({ step: 5 })
      await wait(4000)
      set({ fade: true })
      await wait(600)
    },
    { active, final },
  )
  return null
}

export function Scene() {
  const [s, setS] = useState<CallState>(callFinal)
  const [caseIdx, setCaseIdx] = useState(0)
  const [runKey, setRunKey] = useState(0)
  const reduced = useReducedMotion()
  const pipeRef = useRef<HTMLDivElement>(null)
  const kEls = useRef<(HTMLElement | null)[]>([])
  const k2El = useRef<HTMLElement | null>(null)
  const cur = useRef(0)
  const inView = useInView(pipeRef, { threshold: 0.35 })
  const { paused, userPaused, toggle } = usePausable({ hover: false })
  const active = inView && !paused

  // The server HTML keeps the finished call (readable text); the first client paint is the start frame
  // when motion is allowed. Reduced motion is read live here: it is false during hydration.
  useLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setS(callReset())
  }, [])
  useEffect(() => {
    if (reduced) setS(callFinal())
  }, [reduced])

  const set = useCallback((p: Patch) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })), [])
  const chip = useCallback(
    (i: number, p: Partial<ChipState>) =>
      setS((prev) => {
        const chips = prev.chips.slice()
        const old = chips[i]
        if (old) chips[i] = { ...old, ...p }
        return { ...prev, chips }
      }),
    [],
  )
  // Measured on the live DOM: where a highlighted phrase sits inside the pipeline box.
  const wordAt = useCallback((el: HTMLElement | null | undefined) => {
    const pipe = pipeRef.current
    if (!el || !pipe || !el.getClientRects().length) return null
    const p = pipe.getBoundingClientRect()
    const r = el.getClientRects()[0]
    if (!r) return null
    return { px: Math.round(r.left - p.left - 12), py: Math.round(r.top - p.top + r.height / 2 - 17) }
  }, [])
  const deps = useRef<Deps>({ set, chip, wordAt, kEls, k2El, cur, setCase: setCaseIdx })
  deps.current = { set, chip, wordAt, kEls, k2El, cur, setCase: setCaseIdx }

  // Pausing parks the section on its finished picture; resuming restarts the lap (Runner's active flips).
  useEffect(() => {
    if (userPaused) setS(callFinal())
  }, [userPaused])

  const pick = (i: number) => {
    cur.current = i
    setCaseIdx(i)
    setS(reduced || userPaused ? callFinal() : callReset())
    setRunKey((k) => k + 1)
  }

  const v = derive(caseIdx, s)
  const C = v.C
  const line = CALL_LINES[caseIdx] ?? CALL_LINES[0]
  const offer = offerFigures()
  const isSheet = C.crm === 'sheets'

  return (
    <section id="scene" className="v2-scene">
      <Runner active={active} d={deps.current} final={() => setS(callFinal())} key={runKey} />
      <div className="wrap">
        <div className="sc-head">
          <div className="sc-title">
            <Eyebrow onDark>{EYEBROW}</Eyebrow>
            <h2 className="sc-h2">{TITLE}</h2>
          </div>
          <div className="sc-ctl">
            <div role="group" aria-label="Choisir un exemple" className="sc-tabs">
              {CALLS.map((c, i) => (
                <button
                  key={c.tab}
                  type="button"
                  className="ctab"
                  aria-pressed={i === caseIdx}
                  onClick={() => pick(i)}
                >
                  <Icon d={c.icon} />
                  {c.tab}
                </button>
              ))}
            </div>
            {!reduced && (
              <button type="button" className="ctab" onClick={toggle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {userPaused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h3v14H7zM14 5h3v14h-3z" />}
                </svg>
                {userPaused ? 'Reprendre' : 'Pause'}
              </button>
            )}
          </div>
        </div>

        <p className="sr-only">{SR_INTRO}</p>
        <div ref={pipeRef} className={`pp${s.fade ? ' fade' : ''}`} aria-hidden="true">
          <div className={`pc is-dark${v.onCall ? ' is-live' : ''}`}>
            <div className="pc-head">
              <div className={`pc-tag${s.p > 0 ? ' is-lit' : ''}`}>
                <span>01</span>
                <span>{C.title}</span>
              </div>
              <div className="pc-who">
                <span className="pc-av is-ink">
                  {C.kind === 'call' ? (
                    C.av
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3" />
                    </svg>
                  )}
                </span>
                <div className="pc-id">
                  <div className="pc-name">{C.who}</div>
                  <div className="pc-sub">{C.sub}</div>
                </div>
              </div>
            </div>
            <div className="pc-lanes">
              {v.quotes.map((q, i) => (
                <div className="pc-lane" key={q.k}>
                  {q.show && (
                    <p className={`pp-q rise${q.ghost ? ' ghost' : ''}`}>
                      {q.a}
                      <span
                        className={`hl${q.hl ? ' on' : ''}`}
                        ref={(el) => {
                          kEls.current[i] = el
                        }}
                      >
                        {q.k}
                      </span>
                      {q.b}
                      <span
                        className={`hl2${q.hl2 ? ' on' : ''}`}
                        ref={(el) => {
                          if (i === 2) k2El.current = el
                        }}
                      >
                        {q.k2 ?? ''}
                      </span>
                      {q.c ?? ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="pc-foot">
              <div className="pp-wave">
                {WAVE.map((h, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative bars
                    key={i}
                    className={v.onCall ? 'bar' : ''}
                    style={{
                      height: Math.max(4, Math.round(h * 0.62)),
                      animationDelay: `${i * 45}ms`,
                      background: v.onCall ? '#F1F2F5' : '#4A5068',
                    }}
                  />
                ))}
              </div>
              <div className="pp-prog">
                <i style={{ width: `${v.pct}%` }} />
              </div>
              <div className="pp-time">
                <span>{v.time}</span>
                <span className={v.stateDone ? 'is-done' : ''}>{v.state}</span>
              </div>
            </div>
          </div>

          <div className="pk">
            <div />
            <div className="pc-lanes">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`pp-rail${s.t1 > i ? ' on' : ''}`}>
                  <i />
                </span>
              ))}
            </div>
            <div />
          </div>

          <div className={`pc is-dark${v.working ? ' is-live' : ''}`}>
            <div className="pc-head">
              <div className={`pc-tag${s.hung ? ' is-lit' : ''}`}>
                <span>02</span>
                <span>Le compte rendu</span>
              </div>
              <div className="pc-who">
                <span className="pc-badge">
                  <svg
                    className={v.working ? 'spin' : ''}
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#131620"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />
                  </svg>
                </span>
                <div className="pc-id">
                  <div className="pc-name">Claude</div>
                  <div className={`pc-sub${s.st === 'done' ? ' is-done' : ''}`}>{v.claudeStatus}</div>
                </div>
              </div>
            </div>
            <div className="pc-lanes">
              {v.mids.map((m) => (
                <div className="pc-lane" key={m.v}>
                  {m.empty && <span className="pp-slot" />}
                  {m.isRaw && <span className="pp-chip raw">{m.raw}</span>}
                  {m.isClean && (
                    <>
                      <span className="pp-chip clean pop">
                        <span className="typed">{m.v}</span>
                      </span>
                      <span className="pp-ok pop">
                        <Check size={11} stroke="#FFFFFF" w={3} />
                      </span>
                    </>
                  )}
                  {m.isSent && (
                    <>
                      <span className="pp-chip clean sent">{m.v}</span>
                      <span className="pp-ok">
                        <Check size={11} stroke="#FFFFFF" w={3} />
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="pc-lane foot">
              {v.relEmpty && <span className="pp-slot" />}
              {v.relOn && (
                <span className="pp-chip task pop">
                  <span className="typed">{C.rel}</span>
                </span>
              )}
              {v.relSent && <span className="pp-chip task sent">{C.rel}</span>}
            </div>
          </div>

          <div className="pk">
            <div />
            <div className="pc-lanes">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`pp-rail${s.t2 > i ? ' on' : ''}`}>
                  <i />
                </span>
              ))}
            </div>
            <span className={`pp-rail foot${s.t2 > 3 ? ' on' : ''}`}>
              <i />
            </span>
          </div>

          <div className={`pc is-light${s.st === 'send' ? ' is-live' : ''}`}>
            <div className="pc-head">
              <div className="pc-top">
                <div className={`pc-tag${s.t2 > 0 ? ' is-lit' : ''}`}>
                  <span>03</span>
                  <span>Votre CRM</span>
                </div>
                {!isSheet && (
                  // biome-ignore lint/performance/noImgElement: tiny static svg, decorative
                  <img src="/logos/crm/hubspot.svg" alt="" className="pc-logo" />
                )}
                {isSheet && (
                  <span className="pp-src">
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
                      <path d="M3 4h18v16H3zM3 10h18M3 16h18M9 4v16" />
                    </svg>
                    Google Sheets
                  </span>
                )}
              </div>
              <div className="pc-who">
                <span className="pc-av is-crm">{C.crmAv}</span>
                <div className="pc-id">
                  <div className="pc-name">{C.crmTitle}</div>
                  <div className={`pc-sub${s.upd ? ' is-upd' : ' is-idle'}`}>{v.updText}</div>
                </div>
                {v.clkOn && (
                  <span className={`pp-clk${v.clkDone ? ' done' : ''}`}>
                    <Icon d={ICON_CLOCK} size={12} w={2.2} />
                    {v.clkText}
                  </span>
                )}
              </div>
            </div>
            <dl className="pc-lanes is-dl">
              {v.fields.map((fd) => (
                <div className={`pf${isSheet ? ' sheet' : ''}`} key={fd.k}>
                  <dt>
                    {isSheet && <span className="pf-n">{fd.n}</span>}
                    {fd.k}
                  </dt>
                  <dd>{fd.on ? <span className="flash1">{fd.v}</span> : <span className="pf-ph" />}</dd>
                </div>
              ))}
            </dl>
            <div className="pc-lane foot">
              {v.taskOn ? (
                <div className="pf-task pop">
                  <span className="pf-box" />
                  <div className="pf-task-t">{C.task}</div>
                  <span className="pf-when">{C.when}</span>
                </div>
              ) : (
                <div className="pf-task-off">Relance à créer</div>
              )}
            </div>
          </div>

          <div className="pp-ov">
            {v.chips.map((c, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: four fixed flying chips
                key={i}
                className={`pp-chip ${c.look}${c.vis ? ' vis' : ''}`}
                style={{
                  left: c.left,
                  top: c.top,
                  transition: c.tr
                    ? 'left .72s cubic-bezier(.65,0,.35,1), top .72s cubic-bezier(.65,0,.35,1), opacity .2s'
                    : 'none',
                }}
              >
                {c.text}
              </span>
            ))}
          </div>
        </div>

        <ol className="st4grid" aria-label="Les quatre étapes">
          {v.steps.map((st) => (
            <li key={st.n} className={`st4${st.cls ? ` ${st.cls}` : ''}`}>
              <span className="st4-line">
                {st.on && <i className="st4-fill" style={{ animationDuration: `${st.dur}ms` }} />}
                {st.done && <i />}
              </span>
              <span className="st4-row">
                <span className="st4-n">{st.n}</span>
                <span className="st4-t">{st.t}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="sc-line">
          {line.figure && <span className="sc-fig">{line.figure}</span>}
          {line.text}
        </p>
        <ul aria-label={TOOLS_LABEL} className="sc-tools">
          {TOOLS.map((t) => (
            <li key={t.name} className={t.logo ? undefined : 'is-text'}>
              {t.logo ? (
                // biome-ignore lint/performance/noImgElement: tiny static svg
                <img src={t.logo} alt={t.name} style={{ height: t.h }} />
              ) : (
                t.name
              )}
            </li>
          ))}
        </ul>

        <div id="offre" className="sc-offre">
          <IllHead>
            <div>
              <Eyebrow onDark>{OFFER.eyebrow}</Eyebrow>
              <h2 className="sc-h2">{OFFER.title}</h2>
            </div>
            <SandIllustration src="/illus/offre-contour-nuit.webp" height={220} bare position="50% 52%" />
          </IllHead>
          <div className="offer-grid">
            <div className="offer-card">
              <div className="big">{offer.price}</div>
              <div className="offer-sub">{OFFER.once}</div>
            </div>
            <div className="offer-card">
              <div className="big">{offer.days}</div>
              <div className="offer-sub">{OFFER.inPlace}</div>
            </div>
            <div className="offer-card">
              <div className="big is-flex">
                {OFFER.refunded}
                <Check size={28} stroke="#8FCB9B" w={2.4} />
              </div>
              <div className="offer-sub">{OFFER.refundedSub}</div>
            </div>
          </div>
          <Link href={OF1_ROUTE} className="offer-link">
            {OFFER.link}
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
          </Link>
        </div>
      </div>
    </section>
  )
}
