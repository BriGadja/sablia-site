import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'
import { euros } from './format'

interface PriceCardProps {
  label: string
  amount: string
  unit: string
  badge?: string
  intro?: string
  bullets: readonly string[]
  fine?: readonly ReactNode[]
}

function PriceCard({ label, amount, unit, badge, intro, bullets, fine }: PriceCardProps) {
  return (
    <article className="price">
      <div className="kicker">
        <Eyebrow>{label}</Eyebrow>
        {badge ? <span className="badge">{badge}</span> : null}
      </div>
      <p className="amount">
        <strong>{amount}</strong>
        <span>{unit}</span>
      </p>
      {intro ? <p className="intro">{intro}</p> : null}
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {fine ? (
        <div className="fine">
          {fine.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list of two or three lines
            <p key={i}>{line}</p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default function PricingSection() {
  const { price, delay, recurring, guarantee } = of1

  return (
    <section id="prix" className="sec is-rose">
      <div className="wrap">
        <Eyebrow>Prix</Eyebrow>
        <h2 className="h2">Le prix est affiché.</h2>
        <p className="sub">Vous savez ce que vous payez avant de nous parler.</p>
        <div className="prices">
          <PriceCard
            label="Installation"
            amount={euros(price.oneShotHt)}
            unit="€ HT"
            bullets={[
              price.terms,
              `Livré sous ${delay.days} jours calendaires à compter de la réception de vos accès.`,
            ]}
            fine={['TVA non applicable, art. 293 B du CGI.']}
          />
          <PriceCard
            label="Supervision et maintenance"
            amount={`${price.monthlyHt}`}
            unit="€/mois"
            badge="Premier mois offert"
            intro="Optionnel : l'offre se vend et fonctionne sans lui."
            bullets={recurring.covers}
            fine={[recurring.terms, recurring.exit]}
          />
        </div>
        <div className="guarantee">
          <Eyebrow onDark>Notre garantie</Eyebrow>
          <p>{guarantee}</p>
        </div>
      </div>
    </section>
  )
}
