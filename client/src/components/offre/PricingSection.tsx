import { of1 } from '@/content/of1'
import { euros } from './format'

interface PriceCardProps {
  label: string
  amount: string
  unit: string
  badge?: string
  intro?: string
  bullets: readonly string[]
  fine?: readonly string[]
}

function PriceCard({ label, amount, unit, badge, intro, bullets, fine }: PriceCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-hairline-light bg-surface-light-card p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="t-caption-uppercase text-muted-text">{label}</span>
        {badge ? (
          <span className="t-caption-uppercase shrink-0 rounded-pill bg-accent-teal px-3 py-1 text-canvas">
            {badge}
          </span>
        ) : null}
      </div>

      <p className="mt-5 flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-display text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-tight text-ink">
          {amount}
        </span>
        <span className="t-title-sm text-muted-text">{unit}</span>
      </p>

      {intro ? <p className="mt-4 text-[15px] leading-relaxed text-body">{intro}</p> : null}

      <ul className="mt-6 flex flex-col gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-[15px] leading-relaxed text-body">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
            {bullet}
          </li>
        ))}
      </ul>

      {fine ? (
        <div className="mt-6 flex flex-col gap-2 border-t border-hairline-light pt-5">
          {fine.map((line) => (
            <p key={line} className="text-[13px] leading-relaxed text-muted-text">
              {line}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  )
}

export default function PricingSection() {
  const { price, delay, recurring, guarantee } = of1

  return (
    <section id="prix" className="on-light px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="eyebrow mb-4 text-muted-text">Prix</div>
        <h2 className="t-display-lg max-w-[720px] [text-wrap:balance]">
          Le prix est affiché. Vous savez ce que vous payez avant de nous parler.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
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

        <div className="mt-8 rounded-lg border border-hairline-light border-l-4 border-l-primary bg-surface-light-card p-8">
          <div className="t-caption-uppercase mb-3 text-muted-text">Notre garantie</div>
          <p className="max-w-[900px] font-display text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-snug tracking-tight text-ink">
            {guarantee}
          </p>
        </div>
      </div>
    </section>
  )
}
