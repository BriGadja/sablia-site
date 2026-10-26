import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'
import { FlowDiagram } from './FlowDiagram'
import { euros } from './format'

export default function OffreHero() {
  const pills = [
    `${euros(of1.price.oneShotHt)} € HT`,
    `${of1.price.monthlyHt} €/mois de supervision, premier mois offert`,
    `Livré en ${of1.delay.days} jours`,
  ]

  return (
    <section id="top" className="hero">
      <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
      <div className="wrap hero-grid">
        <div>
          <Eyebrow>Notre offre</Eyebrow>
          <h1 className="h1">{of1.title}</h1>
          <p className="lede">{of1.promise}</p>
          <ul className="chipline">
            {pills.map((pill) => (
              <li key={pill} className="tagchip">
                {pill}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Cta size="lg" arrow />
            <a className="quiet-link" href="#variantes">
              Voir les deux variantes
            </a>
          </div>
        </div>
        <FlowDiagram />
      </div>
    </section>
  )
}
