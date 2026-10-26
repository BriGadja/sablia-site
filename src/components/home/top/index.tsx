'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'
import { usePausable } from '@/lib/hooks/usePausable'
import { useTimelineLoop } from '@/lib/hooks/useTimelineLoop'
import {
  CLAIM_LINES,
  FIGURE_LABEL,
  FINAL_FRAME,
  type Frame,
  H1_LINES,
  PILL,
  ROWS,
  START_FRAME,
  derive,
  proofLine,
} from './content'
import './top.css'

const WIDE = '(min-width: 901px)'
const subscribeWide = (cb: () => void) => {
  const mq = window.matchMedia(WIDE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
/** The recede is a desktop effect (the mockup turns it off at 900 px and below). */
function useWide() {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  )
}

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

export function Top() {
  const [frame, setFrame] = useState<Frame>(START_FRAME)
  const reduced = useReducedMotion()
  const wide = useWide()
  const pause = usePausable({ hover: false })
  const heroRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    sceneRef.current = document.getElementById('scene')
  }, [])
  const p = useScrollProgress({ target: sceneRef, reference: heroRef, enabled: wide })

  const set = useCallback((patch: Partial<Frame>) => setFrame((f) => ({ ...f, ...patch })), [])

  // The mockup's heroLoop: one lap per run, the fade-out closes it, the hook repeats it.
  useTimelineLoop(
    async ({ wait }) => {
      setFrame({ ...START_FRAME })
      await wait(500)
      set({ s: 1 })
      for (let sec = 358; sec <= 372; sec++) {
        set({ sec })
        await wait(140)
      }
      set({ s: 2 })
      await wait(380)
      set({ s: 3 })
      await wait(550)
      set({ s: 4 })
      await wait(450)
      for (let r = 1; r <= 4; r++) {
        set({ r })
        await wait(r === 1 ? 900 : 380)
      }
      set({ s: 5 })
      await wait(800)
      set({ s: 6 })
      await wait(4000)
      set({ fade: true })
      await wait(450)
      setFrame({ ...START_FRAME, fade: true })
      await wait(600)
    },
    { active: !pause.paused && p < 0.95, final: () => setFrame(FINAL_FRAME) },
  )

  // Paused by the button: park on the finished scene. Reduced motion: always the finished scene.
  const shown = reduced || pause.userPaused ? FINAL_FRAME : frame
  const d = derive(shown)
  const proof = proofLine()

  return (
    <section id="top" ref={heroRef} className="v2-top">
      <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
      <div className="wrap">
        <div
          className="hero-grid"
          style={{
            transform: `translate3d(0, ${Math.round(-36 * p)}px, 0) scale(${(1 - 0.08 * p).toFixed(3)})`,
            opacity: Number((1 - 0.7 * p).toFixed(2)),
          }}
        >
          <div className="copy">
            <div className="pill">
              <span className="pill-dot" />
              {PILL}
            </div>
            <h1 className="h1">
              <span className={`hx-u${d.u1 ? ' on' : ''}`}>{H1_LINES[0]}</span>{' '}
              <span className={`hx-u${d.u2 ? ' on' : ''}`}>{H1_LINES[1]}</span>
            </h1>
            <p className="claim">{CLAIM_LINES[0]}</p>
            <div className="cta-row">
              <Cta size="lg" arrow />
              <span className="free">{CLAIM_LINES[1]}</span>
            </div>
            <p className="hx-proof">
              {proof.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
          </div>

          <figure className="hs" aria-label={FIGURE_LABEL}>
            <div className={`hs-stage${d.fade ? ' fade' : ''}`} aria-hidden="true">
              <div className="hs-laptop">
                <div className="hs-bar">
                  <span className="hs-dot" />
                  <span className="hs-dot" />
                  <span className="hs-dot" />
                  {/* biome-ignore lint/performance/noImgElement: tiny static svg, decorative */}
                  <img className="hs-logo" src="/logos/crm/hubspot.svg" alt="" />
                  <span className="hs-tag">Fiche contact</span>
                </div>
                <div className="hs-who">
                  <span className="hs-av">PL</span>
                  <div>
                    <b>Paul Lemoine</b>
                    <small>Garage Lemoine</small>
                  </div>
                  <span className={`hs-upd${d.updOn ? ' on' : ''}`}>{d.updText}</span>
                </div>
                <div className="hs-body">
                  <div className="hs-note">
                    <span className="hx-k">Compte rendu d&apos;appel</span>
                    <span className={`hs-nt${d.noteFill ? ' fill' : ''}`}>
                      Veut prendre ses <span className={`hs-w${d.lit[0] ? ' lit' : ''}`}>rendez-vous en ligne</span>,
                    </span>
                    <span className={`hs-nt${d.noteFill ? ' fill' : ''}`} style={{ animationDelay: '380ms' }}>
                      <span className={`hs-w${d.lit[1] ? ' lit' : ''}`}>budget env. 3 000 €</span>,{' '}
                      <span className={`hs-w${d.lit[2] ? ' lit' : ''}`}>décide seul</span>.{' '}
                      <span className={`hs-w${d.lit[3] ? ' lit' : ''}`}>Rappel jeudi matin</span>.
                    </span>
                  </div>
                  {ROWS.map(([k, v], i) => (
                    <div className="hs-row" key={k}>
                      <span className="hx-k">{k}</span>
                      {d.rowsOn[i] ? (
                        <>
                          <span className="hx-v fill">{v}</span>
                          <span className="hx-ok pop">
                            <Check size={10} stroke="#FFFFFF" w={3} />
                          </span>
                        </>
                      ) : (
                        <span className="hx-ph" />
                      )}
                    </div>
                  ))}
                  {d.relance && (
                    <div className="hx-rel pop">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" />
                      </svg>
                      Relance · Jeu. 09:00
                    </div>
                  )}
                </div>
              </div>

              <div className={`hs-phone${d.phoneIn ? ' in' : ''}${d.phoneDown ? ' down' : ''}`}>
                {d.onCall && (
                  <>
                    <div className="hs-ps">
                      <span className={`hx-live${d.live ? ' on' : ''}`} />
                      Appel en cours
                    </div>
                    <span className="hs-pav">PL</span>
                    <b>Paul Lemoine</b>
                    <small>Garage Lemoine</small>
                    <span className="hs-time">{d.time}</span>
                    <span className="hx-wave">
                      {d.bars.map((b) => (
                        <span
                          key={b.d}
                          className={b.on ? 'bar' : ''}
                          style={{ height: b.h, animationDelay: `${b.d}ms` }}
                        />
                      ))}
                    </span>
                    <span className={`hs-hang${d.hangPress ? ' press' : ''}`}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 15c5-5 13-5 18 0l-2.5 2.5-3.5-1.5v-2.5a10 10 0 0 0-6 0V16l-3.5 1.5z" />
                      </svg>
                    </span>
                  </>
                )}
                {d.ended && (
                  <>
                    <div className="hs-ps hs-ps-end">
                      <span>Appel terminé</span>
                      <span>06:12</span>
                    </div>
                    <div className="hs-end">
                      <span className="hs-endok">
                        <Check size={20} stroke="#FFFFFF" w={3} />
                      </span>
                      <b>Rien à saisir.</b>
                      <small>Claude s&apos;occupe de la fiche.</small>
                    </div>
                    {d.next && (
                      <div className="hs-next">
                        <div>
                          <small>Appel suivant</small>
                          <span className="hs-nm">Catherine Durand</span>
                        </div>
                        <span className="hs-call">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className={`hs-claude${d.claudeIn ? ' in' : ''}${d.claudeDone ? ' done' : ''}`}>
                {d.working && (
                  <>
                    <svg
                      className="spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D9A441"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.2-8.6" />
                    </svg>
                    Claude écrit le compte rendu…
                  </>
                )}
                {d.claudeDone && (
                  <>
                    <Check size={12} stroke="currentColor" w={3} />
                    Compte rendu écrit, relance créée
                  </>
                )}
              </div>
            </div>
            {!reduced && (
              <button
                type="button"
                className="hs-pause"
                onClick={pause.toggle}
                aria-label={pause.userPaused ? "Reprendre l'animation" : "Mettre l'animation en pause"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {pause.userPaused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h3v14H7zM14 5h3v14h-3z" />}
                </svg>
              </button>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
