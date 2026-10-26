import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'

export default function VariantsSection() {
  return (
    <section id="variantes" className="sec is-card">
      <div className="wrap">
        <Eyebrow>Deux variantes</Eyebrow>
        <h2 className="h2">Deux façons de téléphoner.</h2>
        <div className="variants">
          {of1.variants.map((variant) => (
            <article key={variant.key} className="variant">
              <span className="tag">{variant.label}</span>
              <h3>{variant.title}</h3>
              <p>{variant.body}</p>
            </article>
          ))}
        </div>
        <p className="note">
          <strong>Jamais d'enregistrement à votre place. </strong>
          {of1.noRecording}
        </p>
      </div>
    </section>
  )
}
