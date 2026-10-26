'use client'

import { useEffect, useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useInView } from '@/lib/hooks/useInView'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'
import { ask, CHAT_NAME, EYEBROW, FAQS, TITLE } from './content'
import './faq.css'

/**
 * `#faq`: nine question buttons feed a chat stack that keeps the last three. All nine answers are in
 * the server HTML (the unasked pairs are `hidden`); the stack is `aria-live`, so a click is announced.
 * The typing dots run three beats (2.7 s) after a click, never as a loop: nothing to pause.
 */
export function Faq() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const inView = useInView(sectionRef, { threshold: 0.3, once: true })

  const [history, setHistory] = useState<number[]>([0])
  // Bumped on every ask: a new key replays the rise / typing-dots animation of the newest pair.
  const [n, setN] = useState(0)
  const [animate, setAnimate] = useState(false)
  const asked = useRef(false)

  // The mockup types the first answer as the section arrives; the server HTML carries it finished.
  useEffect(() => {
    if (!inView || reduced || asked.current) return
    asked.current = true
    setAnimate(true)
    setN((v) => v + 1)
  }, [inView, reduced])

  const onAsk = (i: number) => {
    asked.current = true
    setHistory((h) => ask(h, i))
    setAnimate(!reduced)
    setN((v) => v + 1)
  }

  const last = history[history.length - 1]

  return (
    <section id="faq" ref={sectionRef} className="v2-faq">
      <div className="wrap">
        <IllHead>
          <div>
            <Eyebrow>{EYEBROW}</Eyebrow>
            <h2 className="fq-h2">{TITLE}</h2>
          </div>
          <SandIllustration src="/illus/faq-contour-nuit.webp" height={212} />
        </IllHead>
        <div className="faq-grid">
          <ul className="fq-list">
            {FAQS.map((f, i) => (
              <li key={f.q}>
                <button
                  type="button"
                  className="qbtn"
                  aria-pressed={i === last}
                  onClick={() => onAsk(i)}
                >
                  {f.q}
                </button>
              </li>
            ))}
          </ul>
          <div className="fq-chat">
            <div className="fq-head">
              <svg width="18" height="18" viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M43 21L54 10H10L54 54H10L21 43"
                  fill="none"
                  stroke="#D9A441"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {CHAT_NAME}
            </div>
            <div className="fq-stack" aria-live="polite">
              {FAQS.map((f, i) => {
                const pos = history.indexOf(i)
                if (pos < 0) {
                  return (
                    <div key={f.q} className="fq-pair" hidden>
                      <div className="fq-q">{f.q}</div>
                      <div className="fq-a">{f.a}</div>
                    </div>
                  )
                }
                const live = animate && i === last
                return (
                  <div
                    // A new key on the newest pair replays its animation; older pairs stay static.
                    key={live ? `${f.q}#${n}` : f.q}
                    className="fq-pair"
                    style={{ order: pos }}
                  >
                    <div className={`fq-q${live ? ' rise' : ''}`}>{f.q}</div>
                    {live && (
                      <div className="fq-dots gone" aria-hidden="true">
                        <span className="dot" />
                        <span className="dot" style={{ animationDelay: '150ms' }} />
                        <span className="dot" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                    <div
                      className={`fq-a${live ? ' rise' : ''}`}
                      style={live ? { animationDelay: '800ms' } : undefined}
                    >
                      {f.a}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
