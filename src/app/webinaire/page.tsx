import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { HourTimeline } from '@/components/webinaire/HourTimeline'
import { MailText } from '@/components/webinaire/MailText'
import { PlanDrawing } from '@/components/webinaire/PlanDrawing'
import { StatFigure } from '@/components/webinaire/StatFigure'
import WebinaireForm from '@/components/webinaire/WebinaireForm'
import {
  CONSTAT,
  HERO,
  INSCRIPTION,
  INTERVENANT,
  PAGE_META,
  PREUVE,
  PROGRAMME,
  SESSION,
} from '@/content/webinaire'
import { pageMetadata } from '@/lib/seo'
import '@/components/shell/cta.css'
import '@/components/webinaire/webinaire.css'

export const metadata = pageMetadata({
  path: '/webinaire',
  title: PAGE_META.title,
  description: PAGE_META.description,
})

/**
 * `/webinaire`: registration to the « Bureaux d'études » session of 03/12 (US-86). Every readable
 * line is in the static HTML (SSR content rule) and comes from `src/content/webinaire.ts`; the
 * motion only stages it (the plan sheet draws itself, the branch figures count up, the hour fills
 * with sand). One action on the page: the form at `#inscription`.
 */
export default function WebinairePage() {
  return (
    <main id="contenu" className="v2-webinaire">
      <section id="top" className="wbn-hero">
        <div className="wrap wbn-hero-grid">
          <div className="wbn-hero-copy">
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
            <h1>{SESSION.title}</h1>
            <p className="wbn-lede">{HERO.lede}</p>
            <div className="wbn-hero-actions">
              <a href="#inscription" className="v2-cta is-dark is-lg">
                {HERO.cta}
              </a>
              <p className="wbn-by">
                {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
                <img src="/brand/badge.svg" alt="" width={28} height={28} />
                <span>
                  {HERO.byline} <strong>{INTERVENANT.name}</strong>, Sablia
                </span>
              </p>
            </div>
          </div>
          <div className="wbn-ticket">
            <PlanDrawing />
            <dl className="wbn-facts">
              {HERO.facts.map((fact) => (
                <div key={fact.key}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="constat" className="wbn-band">
        <Dune back="#C68A8E" front="#161B29" />
        <div className="wrap">
          <Eyebrow onDark>{CONSTAT.eyebrow}</Eyebrow>
          <h2>{CONSTAT.title}</h2>
          <div className="wbn-stats">
            {CONSTAT.stats.map((stat) => (
              <StatFigure key={stat.key} figure={stat.figure} label={stat.label} />
            ))}
          </div>
          <p className="wbn-source">
            {CONSTAT.source}{' '}
            <a href={CONSTAT.sourceHref} target="_blank" rel="noopener noreferrer">
              {CONSTAT.sourceLink}
            </a>
          </p>
        </div>
      </section>

      <section id="programme" className="wbn-programme">
        <Dune back="#C68A8E" front="#F4ECDD" />
        <div className="wrap">
          <Eyebrow>{PROGRAMME.eyebrow}</Eyebrow>
          <h2>{PROGRAMME.title}</h2>
          <HourTimeline />
          <p className="wbn-note">{PROGRAMME.note}</p>
        </div>
      </section>

      <section id="intervenant" className="wbn-rose">
        <Dune back="#C68A8E" front="#F2E3DF" />
        <div className="wrap wbn-who-grid">
          <figure className="wbn-photo">
            {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
            <img
              src={INTERVENANT.photo}
              alt={INTERVENANT.photoAlt}
              width={720}
              height={803}
              loading="lazy"
            />
          </figure>
          <div className="wbn-who">
            <Eyebrow>{INTERVENANT.eyebrow}</Eyebrow>
            <h2>{INTERVENANT.name}</h2>
            <p className="wbn-role">{INTERVENANT.role}</p>
            <p className="wbn-who-line">{INTERVENANT.line}</p>
            <div className="wbn-proof">
              <p className="wbn-proof-eyebrow">{PREUVE.eyebrow}</p>
              <p className="wbn-proof-figure">{PREUVE.figure}</p>
              <p className="wbn-proof-line">{PREUVE.line}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="inscription" className="wbn-band wbn-signup">
        <Dune back="#C68A8E" front="#161B29" />
        <div className="wrap wbn-signup-grid">
          <div className="wbn-signup-copy">
            <Eyebrow onDark>{INSCRIPTION.eyebrow}</Eyebrow>
            <h2>{INSCRIPTION.title}</h2>
            <p className="wbn-signup-when">
              {SESSION.date}, {SESSION.hours}
            </p>
            <ol className="wbn-next">
              {INSCRIPTION.next.map((line, index) => (
                <li key={line}>
                  <span className="wbn-next-num">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <MailText text={line} />
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="wbn-card wbn-form-card">
            <WebinaireForm />
          </div>
        </div>
      </section>
    </main>
  )
}
