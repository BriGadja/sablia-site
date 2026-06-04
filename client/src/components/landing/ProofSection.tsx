const PLACEHOLDERS = ['qwertys', 'Norloc', 'Nesten']

export default function ProofSection() {
  return (
    <section id="proof" className="on-light px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[640px] text-center">
          <div className="eyebrow mb-4 text-primary">Témoignages</div>
          <h2 className="font-display text-[clamp(1.9rem,3vw,2.5rem)] font-medium leading-tight tracking-tight text-ink">
            Ils ont franchi le pas.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Carte réelle — Valentin / VB Mobilier. Citation confirmée par le brief (OK à publier).
              Logo/photo VB Mobilier = autorisation à recueillir → avatar initiales en attendant. */}
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

          {/* TODO: citation qwertys à recueillir */}
          {/* TODO: citation Norloc à recueillir */}
          {/* TODO: citation Nesten à recueillir */}
          {PLACEHOLDERS.map((client) => (
            <div
              key={client}
              className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline-light bg-surface-light-card p-8 text-center"
            >
              <span className="font-display text-lg font-medium text-ink/70">{client}</span>
              <span className="text-[13px] text-muted-text">Témoignage à venir</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
