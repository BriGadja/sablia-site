import { Eyebrow } from '@/components/shell/Eyebrow'
import { PROOF_DEMO_URL, PROOF_ITEMS } from '@/content/proof'

/**
 * The proof block of the OF-1 page: what protects the buyer, stated without a single client name.
 * Its name and its id (`preuve`) are what `check-preuve.py` and the content gates look for.
 *
 * The demonstration slot renders only when a recording exists. No placeholder, no "coming soon".
 */

/**
 * Display only. a price breaking after its first digit reads as a typo on a page that sells.
 * The content modules keep a plain space as thousands separator on purpose, because the copy
 * guards match on it (see lib/format.ts), so the price is welded at render time instead.
 */
export function keepPricesWhole(text: string): string {
  return text.replace(/(\d) (\d{3}) (€)/g, '$1 $2 $3')
}

export default function ProofStrip() {
  return (
    <section id="preuve" className="sec is-card">
      <div className="wrap column">
        <Eyebrow>Ce qui vous protège</Eyebrow>
        <h2 className="h2">Vous seriez le premier client de cette offre.</h2>
        <p className="sub">
          À la place d'une liste de références : trois points sur lesquels vous appuyer.
        </p>
        <dl className="proof-list">
          {PROOF_ITEMS.map((item) => (
            <div key={item.key}>
              <dt>{item.label}</dt>
              <dd>{keepPricesWhole(item.body)}</dd>
            </div>
          ))}
        </dl>
        {PROOF_DEMO_URL !== null && (
          <div className="proof-demo">
            <Eyebrow>La chaîne, filmée</Eyebrow>
            <p className="sub">
              Quarante-cinq secondes : une note vocale dictée depuis un téléphone, et la fiche du
              CRM qui se remplit.
            </p>
            <a className="quiet-link" href={PROOF_DEMO_URL} rel="noreferrer" target="_blank">
              Voir la démonstration
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
