import { PROOF_DEMO_URL, PROOF_ITEMS } from '@/content/proof'

/**
 * The proof block of the OF-1 page: what protects the buyer, stated without a single client name.
 *
 * It sits between the objection and the FAQ, deliberately away from the pricing section, which
 * already displays the guarantee. Restating it here inside a "what protects you" frame is the
 * point; showing it twice in the same screenful is not.
 *
 * The demonstration slot renders only when a recording exists. No placeholder, no "coming soon".
 */
/**
 * Display only. "les 1 490 € HT" breaking after the "1" reads as a typo on a page that sells.
 * The content modules keep a plain space as thousands separator on purpose, because the copy
 * guards match on it (see lib/format.ts), so the price is welded at render time instead.
 */
export function keepPricesWhole(text: string): string {
  return text.replace(/(\d)\u0020(\d{3})\u0020(€)/g, '$1\u00a0$2\u00a0$3')
}

export default function ProofStrip() {
  return (
    <section id="preuve" className="border-t border-hairline bg-canvas px-8 py-section">
      <div className="mx-auto max-w-[820px]">
        <div className="eyebrow mb-4 text-primary">Ce qui vous protège</div>
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-on-dark [text-wrap:balance]">
          Vous seriez le premier client de cette offre.
        </h2>
        <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-on-dark-body">
          Alors voici ce sur quoi vous pouvez vous appuyer à la place d'une liste de références :
          une garantie qui porte sur la totalité de la somme, une chaîne que nous branchons sur nos
          propres rendez-vous, et une seule personne en face de vous.
        </p>

        <dl className="mt-10 flex flex-col gap-8">
          {PROOF_ITEMS.map((item) => (
            <div key={item.key} className="border-l-2 border-primary pl-6">
              <dt className="t-caption-uppercase text-primary">{item.label}</dt>
              <dd className="mt-2.5 ml-0 text-[17px] leading-relaxed text-on-dark">
                {keepPricesWhole(item.body)}
              </dd>
            </div>
          ))}
        </dl>

        {PROOF_DEMO_URL !== null && (
          <div className="mt-10 rounded-xl border border-hairline bg-surface-card p-6">
            <div className="t-caption-uppercase text-primary">La chaîne, filmée</div>
            <p className="mt-2.5 text-[17px] leading-relaxed text-on-dark">
              Quarante-cinq secondes : une note vocale dictée depuis un téléphone, et la fiche du
              CRM qui se remplit.
            </p>
            <a
              className="t-button mt-5 inline-flex h-[52px] items-center justify-center rounded-md bg-primary px-7 text-[15px] text-on-dark transition-transform duration-base hover:translate-x-0.5"
              href={PROOF_DEMO_URL}
              rel="noreferrer"
              target="_blank"
            >
              Voir la démonstration
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
