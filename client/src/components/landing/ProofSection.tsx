/**
 * Two neighbouring deliveries, described in our words, with figures read from our own execution
 * logs. No client is named and no sentence is put between quotation marks.
 *
 * Why nothing is named (decision A4 then the 2026-09-17 ruling): consent to be named was never
 * traced for any of the four clients this section used to list, and the one quote it carried was
 * cleared only by a code comment. A name goes back up here when its owner has validated, in
 * writing, the sentence written about them. The figures are frozen queries, one per card:
 * see projects/sablia/offre/preuve/dossier-de-preuve.md (P-7, P-8) in the hub.
 */
interface CaseCard {
  sector: string
  kind: string
  what: string
  figure: string
  since: string
}

export const CASES: readonly CaseCard[] = [
  {
    sector: 'Agence immobilière',
    kind: 'Saône-et-Loire',
    what: "Un assistant vocal décroche quand les lignes sont occupées ou l'agence fermée : il oriente l'appelant vers le bon conseiller, prend le rappel ou répond directement. Une suite concrète, c'est un transfert abouti, un rappel demandé ou une information donnée.",
    figure: '289 appels sur 326 décrochés ont eu une suite concrète, soit 89 %',
    since: 'Mars à juin 2026',
  },
  {
    sector: 'Investissement locatif clé en main',
    kind: 'France entière',
    what: "Un assistant vocal qualifie les investisseurs entrants, pose les rendez-vous des conseillers dans le CRM et relance par SMS ceux qui ne répondent pas. Un rendez-vous compté, c'est un rendez-vous réellement posé dans un agenda.",
    figure: '68 rendez-vous posés sans un seul appel manuel',
    since: 'Avril à août 2026',
  },
]

export default function ProofSection() {
  return (
    <section id="proof" className="on-light px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[640px] text-center">
          <div className="eyebrow mb-4 text-primary">Ce qui tourne déjà</div>
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-ink [text-wrap:balance]">
            Deux chantiers, et les chiffres qui vont avec.
          </h2>
          <p className="mt-4 text-[15px] text-body">
            Décrits dans nos mots, chiffrés dans nos propres journaux d'exécution, avec la
            définition de ce que compte chaque nombre. Nous ne nommons aucun client tant qu'il n'a
            pas validé lui-même ce qui est écrit sur lui.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {CASES.map((c) => (
            <article
              key={c.sector}
              className="flex flex-col gap-4 rounded-xl border border-hairline-light bg-surface-light-card p-8"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl font-medium text-ink">{c.sector}</h3>
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
