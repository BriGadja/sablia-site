'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { useCountUp } from '@/lib/hooks/useCountUp'
import { useInView } from '@/lib/hooks/useInView'
import './formations.css'
import { FORMATS, formatFigure, QUOTES, STATS, type Stat } from './content'

function Counter({ stat, active }: { stat: Stat; active: boolean }) {
  const n = useCountUp(stat.value, { active })
  return (
    <div className="fo-stat">
      <div className="fo-big">{`${formatFigure(n)}${stat.suffix}`}</div>
      <div className="fo-stat-label">{stat.label}</div>
    </div>
  )
}

export function Formations() {
  const statsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(statsRef, { threshold: 0.6, once: true })
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <section id="formations" className="v2-formations">
      <div className="panel fo-band">
        <div className="wrap">
          <IllHead>
            <div>
              <Eyebrow onDark>Formations</Eyebrow>
              <h2 className="fo-h2">Nous l&apos;enseignons aussi.</h2>
              <p className="fo-lead">
                Membre de l&apos;école Noésia depuis mars 2025, expert depuis juin 2025.{' '}
                <a href="https://noesia.school" className="fo-school">
                  noesia.school
                </a>
              </p>
              <div className="fo-actions">
                <Link href="/formations" className="fo-btn is-light">
                  Voir les formations
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link href="/accompagnement" className="fo-btn is-ghost">
                  L&apos;accompagnement personnalisé
                </Link>
              </div>
            </div>
            <SandIllustration
              src="/illus/formations-contour-nuit.webp"
              height={250}
              bare
              position="50% 58%"
            />
          </IllHead>
          <div ref={statsRef} className="fo-stats">
            {STATS.map((s) => (
              <Counter key={s.key} stat={s} active={inView} />
            ))}
          </div>
        </div>
      </div>

      <div className="wrap fo-below">
        <ul className="fo-three fo-formats" aria-label="Formats">
          {FORMATS.map((f) => (
            <li key={f.key}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#835A0C"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={f.path} />
              </svg>
              {f.label}
            </li>
          ))}
        </ul>
        <div className="fo-three fo-quotes proof-temoignages">
          {QUOTES.map((q) => {
            const isOpen = !!open[q.key]
            return (
              <figure key={q.key} className="fo-quote temoignage">
                <blockquote>« {q.line} »</blockquote>
                <p id={`fo-full-${q.key}`} className="fo-full" hidden={!isOpen}>
                  {q.full}
                </p>
                <button
                  type="button"
                  className="fo-more"
                  aria-expanded={isOpen}
                  aria-controls={`fo-full-${q.key}`}
                  onClick={() => setOpen((o) => ({ ...o, [q.key]: !o[q.key] }))}
                >
                  {isOpen ? 'Réduire' : 'Lire la suite'}
                </button>
                <figcaption>
                  <span className="fo-ini" aria-hidden="true">
                    {q.name.charAt(0)}
                  </span>
                  <span>
                    <b>{q.name}</b>, {q.role}
                  </span>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
