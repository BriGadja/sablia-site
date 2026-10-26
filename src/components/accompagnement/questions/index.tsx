import { Eyebrow } from '@/components/shell/Eyebrow'
import './questions.css'

const FAQ = [
  {
    q: 'Combien de temps dure un accompagnement ?',
    a: "Le temps qu'il faut pour que vous soyez autonome. On le fixe ensemble à l'appel.",
  },
  { q: 'Je ne suis pas technique.', a: 'Aucun prérequis : on part de vos tâches, pas des outils.' },
  {
    q: 'Mon équipe est déjà avancée.',
    a: 'Alors on va plus loin : Claude Code, agents, automatisations sur vos outils.',
  },
  { q: 'À distance ?', a: 'Oui, en visio, avec un échange par message entre les séances.' },
] as const

export function AccompagnementQuestions() {
  return (
    <section id="questions" className="v2-acc-questions">
      <div className="wrap">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="acc-h2">Ce qu'on me demande avant.</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <div key={f.q} className="faq-item">
              <h3 className="faq-q">{f.q}</h3>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
