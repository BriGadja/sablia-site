import { Eyebrow } from '@/components/shell/Eyebrow'
import { EYEBROW, QUESTIONS, TITLE } from './content'
import './questions.css'

export function Questions() {
  return (
    <section id="questions" className="v2-questions">
      <div className="wrap">
        <Eyebrow>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <div className="qu-faq">
          {QUESTIONS.map((x) => (
            <div key={x.q} className="qu-item">
              <h3>{x.q}</h3>
              <p>{x.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
