const KPIS = [
  { value: '15 h', label: 'par semaine, par commercial' },
  { value: '3 sem.', label: 'du diagnostic à la mise en production' },
  { value: '100%', label: 'sur-mesure, toujours' },
]

export default function ProofSection() {
  return (
    <section id="proof" className="on-light px-8 py-section">
      <div className="mx-auto max-w-[920px]">
        <div className="eyebrow mb-6 text-center text-primary">Ils ont sauté le pas</div>
        <blockquote className="m-0 text-center font-display text-[clamp(1.75rem,3vw,2.25rem)] font-medium italic leading-[1.25] tracking-tight text-ink [text-wrap:pretty]">
          «&nbsp;Sablia a divisé par trois le temps que mes commerciaux passent dans Salesforce. On
          a récupéré une journée entière par semaine et par personne.&nbsp;»
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-3.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2e4e] to-[#c45a2c] font-display text-xl font-medium tracking-tight text-white">
            CM
          </div>
          <div className="text-sm">
            <div className="font-medium text-ink">Camille Marchand</div>
            <div className="mt-0.5 text-muted-text">Directrice commerciale · Atelier Garnier</div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 border-t border-hairline-light pt-10 md:grid-cols-3">
          {KPIS.map((k) => (
            <div key={k.label} className="text-center">
              <div className="font-display text-5xl font-medium leading-none tracking-tight text-ink">
                {k.value}
              </div>
              <div className="mt-2 text-[13px] text-muted-text">{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
