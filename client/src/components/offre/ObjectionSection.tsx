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
    <section id="objection" className="bg-canvas px-8 py-section">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium italic leading-tight tracking-tight text-on-dark">
          « {of1.objectionN8n.q} »
        </h2>

        <div className="mt-8 flex flex-col gap-5 border-l-2 border-primary pl-6">
          {of1.objectionN8n.answer.map((paragraph) => (
            <p key={paragraph} className="text-[17px] leading-relaxed text-on-dark-body">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mt-8 text-[17px] leading-relaxed text-on-dark">{CLOSING_LINE}</p>
      </div>
    </section>
  )
}
