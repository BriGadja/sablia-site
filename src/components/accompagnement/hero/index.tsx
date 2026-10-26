'use client'

import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { MODE_LABELS } from './data'
import './hero.css'
import { useAccompagnementMode } from './mode'

/** Rows land 300 ms apart; each check pops 500 ms after its own row, so the three checks arrive one after the other. */
const ROW_STEP_MS = 300
const ROW_FIRST_MS = 150
const CHECK_LAG_MS = 500

export function AccompagnementHero() {
  const { mode, ver, data, setMode } = useAccompagnementMode()

  return (
    <section id="top" className="v2-acc-hero">
      <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
      <div className="wrap hero-grid">
        <div>
          <Eyebrow>Accompagnement personnalisé</Eyebrow>
          <h1 className="hero-h1">Un accompagnement à votre rythme.</h1>
          <p className="hero-lede">
            Pour un dirigeant qui veut s'y mettre sérieusement, ou une équipe qui doit l'adopter
            dans la durée.
          </p>
          {/* biome-ignore lint/a11y/useSemanticElements: a fieldset would bring its own box; the mockup uses a role=group div */}
          <div className="seg" role="group" aria-label="Pour qui">
            <span
              className="seg-pill"
              style={{ transform: `translateX(${mode === 0 ? '0%' : '100%'})` }}
            />
            {MODE_LABELS.map((label, m) => (
              <button
                key={label}
                type="button"
                className={`seg-btn${mode === m ? ' on' : ''}`}
                aria-pressed={mode === m}
                onClick={() => setMode(m as 0 | 1)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="hero-cta">
            <Cta size="lg" arrow />
            <span className="hero-free">Gratuit, sans engagement.</span>
          </div>
        </div>
        <div className="week" aria-live="polite">
          <div className="week-head">
            <span className="week-title">Une semaine d'accompagnement</span>
            <span className="week-who">{data.who}</span>
          </div>
          <div key={ver}>
            {data.week.map(([day, text], i) => {
              const rowDelay = ROW_FIRST_MS + i * ROW_STEP_MS
              return (
                <div key={day} className="wk-row" style={{ animationDelay: `${rowDelay}ms` }}>
                  <span className="wk-day">{day}</span>
                  <span>{text}</span>
                  <span
                    className="wk-ok"
                    style={{ animationDelay: `${rowDelay + CHECK_LAG_MS}ms` }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
