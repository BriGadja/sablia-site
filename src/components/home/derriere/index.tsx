import { FOUNDER_LINE } from '@/content/proof'
import './derriere.css'
import { CAREER, HEADING, PARALLEL, PHOTO_ALT } from './content'

export function Derriere() {
  return (
    <section id="derriere" className="v2-derriere">
      <div className="wrap dr-grid">
        {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
        <img
          className="dr-photo"
          loading="lazy"
          src="/photos/accueil-meetup-public-900.webp"
          alt={PHOTO_ALT}
        />
        <div className="dr-copy">
          <div className="dr-eyebrow">Qui est derrière</div>
          <p className="dr-heading">{HEADING}</p>
          <p className="dr-founder proof-fondateur">{FOUNDER_LINE}</p>
          <ul className="dr-tl" aria-label="Parcours">
            {CAREER.map((c) => (
              <li key={c.key} className="dr-step">
                <div className="dr-period">{c.period}</div>
                <div className="dr-employer">{c.employer}</div>
                <div className="dr-role">{c.role}</div>
              </li>
            ))}
            <li className="dr-parallel">
              <div className="dr-parallel-head">
                <span>2025 · aujourd&apos;hui</span>
                <span className="dr-both">les deux en parallèle</span>
              </div>
              {PARALLEL.map((p) => (
                <div key={p.key} className={`dr-pill${p.dark ? ' is-dark' : ''}`}>
                  <span className="dr-dot" />
                  <span className="dr-pill-name">{p.name}</span>
                  <span className="dr-pill-role">{p.role}</span>
                  <span className="dr-pill-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
