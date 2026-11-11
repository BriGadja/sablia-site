import { Eyebrow } from '@/components/shell/Eyebrow'
import { QUESTIONS } from '../content'
import { typo } from '../text'
import './questions.css'

/** `#questions`: what managers ask before a call, every answer in the static HTML (no FAQPage data). */
export function Questions() {
  return (
    <section id="questions" className="v2-tp-questions">
      <div className="wrap tpf-grid">
        <div className="tpf-head">
          <Eyebrow>{QUESTIONS.eyebrow}</Eyebrow>
          <h2>{QUESTIONS.title}</h2>
        </div>
        <dl className="tpf-list">
          {QUESTIONS.items.map((x) => (
            <div key={x.q} className="tpf-item">
              <dt>{typo(x.q)}</dt>
              <dd>{typo(x.a)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
