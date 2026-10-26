import { Eyebrow } from '@/components/shell/Eyebrow'
import { of1 } from '@/content/of1'

/**
 * @off-source Not a clause of OF-1: do not look for it there.
 * Paraphrase of IDEATION §9 T3, whose literal words are « la majorité des acheteurs ne sait pas
 * installer, même gratuit ; la peur et l'inconnu sont le frein, pas le prix du template ».
 * Brice kept this line as it stands on 2026-09-07. No figure, no implied study.
 */
const CLOSING_LINE =
  "Ce n'est pas le prix du modèle qui bloque : c'est la peur de l'installer, et l'inconnu qui va avec."

export default function ObjectionSection() {
  return (
    <section id="objection" className="sec">
      <div className="wrap column">
        <Eyebrow>Une objection</Eyebrow>
        <h2 className="objection">« {of1.objectionN8n.q} »</h2>
        <div className="answer">
          {of1.objectionN8n.answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="closing">{CLOSING_LINE}</p>
      </div>
    </section>
  )
}
