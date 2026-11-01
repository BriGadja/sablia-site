import { Eyebrow } from '@/components/shell/Eyebrow'
import { EYEBROW, QUESTIONS, TITLE } from './content'
import './questions.css'

/** `#questions`: the seven questions asked before a call, all answers in the static HTML. */
export function Questions() {
  return (
    <section id="questions" className="v2-fm-questions">
      <div className="wrap qu-grid">
        <div className="qu-head">
          <Eyebrow>{EYEBROW}</Eyebrow>
          <h2>{TITLE}</h2>
        </div>
        <dl className="qu-list">
          {QUESTIONS.map((x) => (
            <div key={x.q} className="qu-item">
              <dt>{x.q}</dt>
              <dd>{x.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
