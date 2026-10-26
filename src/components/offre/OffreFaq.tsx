import { Eyebrow } from '@/components/shell/Eyebrow'
import { FAQ_CARRIED } from '@/content/faq-carried'
import { of1 } from '@/content/of1'
import './faq.css'

/** Questions and answers as native disclosure: collapsed to the eye, complete in the HTML. */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="v2-faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  )
}

/**
 * The OF-1 questions, then the five that lived on the home until 2026-09-28 (grill decision 4).
 * Appended AFTER `of1.faq`: `of1.parity.test.ts` anchors indices 0/1/2/4 of the OF-1 list.
 */
export const OFFER_FAQ = [...of1.faq, ...FAQ_CARRIED]

export default function OffreFaq() {
  return (
    <section id="faq" className="sec">
      <div className="wrap column">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="h2">Les questions que vous vous posez.</h2>
        <FaqList items={OFFER_FAQ} />
      </div>
    </section>
  )
}
