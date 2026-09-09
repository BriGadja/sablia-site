/**
 * One testimonial in the client's words (VB Mobilier, cleared to publish), then three deliveries
 * described in ours with figures read from our own logs. No quote is invented: a client who has
 * not written one gets a case card, never a sentence between quotation marks.
 */
interface CaseCard {
  client: string
  kind: string
  what: string
  figure: string
  since: string
}

export const CASES: readonly CaseCard[] = [
  {
    client: 'Nestenn Chalon',
    kind: 'Agence immobilière',
    what: "Un assistant vocal décroche quand les lignes sont occupées ou l'agence fermée : il oriente l'appelant vers le bon conseiller, prend le rappel ou répond directement.",
    figure: '287 appels rattrapés en 3 mois, 82 % avec un résultat concret',
    since: 'Mars à juin 2026',
  },
  {
    client: 'Norloc',
    kind: 'Investissement locatif',
    what: 'Un assistant vocal qualifie les investisseurs entrants, pose les rendez-vous des conseillers dans Pipedrive et relance par SMS ceux qui ne répondent pas.',
    figure: "44 rendez-vous posés dans Pipedrive d'avril à août 2026",
    since: 'En production depuis avril 2026',
  },
  {
    client: 'Qwertys',
    kind: 'Cashback et bons plans',
    what: "Une application de veille concurrentielle alimentée chaque jour par des automatisations n8n, livrée puis remise à l'équipe : le code est chez eux, ils sont autonomes.",
    figure: 'Remise en autonomie complète, code hébergé chez le client',
    since: 'En production depuis août 2026',
  },
]

export default function ProofSection() {
  return (
    <section id="proof" className="on-light px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[640px] text-center">
          <div className="eyebrow mb-4 text-primary">Témoignages et cas clients</div>
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-ink [text-wrap:balance]">
            Ils ont franchi le pas.
          </h2>
          <p className="mt-4 text-[15px] text-body">
            Un témoignage dans les mots du client, trois chantiers décrits dans les nôtres. Les
            chiffres sont relevés dans nos propres journaux d'exécution.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <figure className="m-0 flex flex-col gap-5 rounded-xl border border-hairline-light bg-surface-light p-8">
            <blockquote className="m-0 text-[15px] leading-relaxed text-body">
              «&nbsp;Nous avons intégré un agent vocal dans notre CRM. Il traite automatiquement et
              fait le setting des leads entrants issus de nos campagnes Meta. Nos commerciaux se
              concentrent uniquement sur ce qu'ils savent faire : closer les prospects chauds et
              envoyer les devis qui valent vraiment le coup.&nbsp;»
            </blockquote>
            <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 font-mono text-[13px] font-medium text-primary">
              +30 % de CA sur prospects entrants
            </div>
            <figcaption className="mt-auto flex items-center gap-3 pt-2">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-base font-medium text-white">
                VB
              </div>
              <div className="text-sm">
                <div className="font-medium text-ink">Valentin</div>
                <div className="mt-0.5 text-muted-text">VB Mobilier</div>
              </div>
            </figcaption>
          </figure>

          {CASES.map((c) => (
            <article
              key={c.client}
              className="flex flex-col gap-4 rounded-xl border border-hairline-light bg-surface-light-card p-8"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium text-ink">{c.client}</h3>
                <span className="t-caption-uppercase text-muted-text">{c.kind}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-body">{c.what}</p>
              <div className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 font-mono text-[13px] font-medium text-primary">
                {c.figure}
              </div>
              <div className="mt-auto pt-2 text-[13px] text-muted-text">{c.since}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
