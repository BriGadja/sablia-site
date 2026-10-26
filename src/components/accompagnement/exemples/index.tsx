import { Eyebrow } from '@/components/shell/Eyebrow'
import './exemples.css'

const CASES = [
  {
    tag: 'Équipe · pour un cabinet partenaire',
    title: "L'équipe IT d'un grand groupe",
    what: 'Un cycle de séances hebdomadaires sur Claude Code, avec des réponses entre les séances, des bases du prompt aux tests automatisés.',
  },
  {
    tag: 'Individuel · en ateliers',
    title: "Les élèves de l'école Noésia",
    what: 'Des ateliers en direct et des permanences pour passer du premier prompt à leurs premiers agents.',
  },
] as const

export function AccompagnementExemples() {
  return (
    <section id="exemples" className="v2-acc-exemples">
      <div className="wrap">
        <Eyebrow>Déjà accompagnés</Eyebrow>
        <h2 className="acc-h2">D'une équipe IT aux élèves d'une école.</h2>
        <div className="cases">
          {CASES.map((c) => (
            <article key={c.title} className="case">
              <span className="case-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.what}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
