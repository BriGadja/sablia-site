const STEPS = [
  {
    n: '01',
    title: 'Call audit',
    desc: "Partage d'écran. Nous étudions votre CRM, vos processus, vos points de friction.",
    dur: '30 min',
  },
  {
    n: '02',
    title: 'Diagnostic',
    desc: 'Roadmap claire : quels workflows, dans quel ordre, avec quel ROI estimé.',
    dur: '5 jours',
  },
  {
    n: '03',
    title: 'Implémentation',
    desc: 'Nous concevons, testons et déployons. Vous validez chaque étape.',
    dur: '2–4 semaines',
  },
  {
    n: '04',
    title: 'Suivi & formation',
    desc: 'Optimisation continue, formation de vos équipes, reporting mensuel.',
    dur: '1–3 mois',
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="border-y border-hairline bg-canvas-soft px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mb-12 grid items-end gap-14 lg:grid-cols-[auto_1fr]">
          <div>
            <div className="eyebrow mb-4 text-primary">Méthode</div>
            <h2 className="t-display-lg">Comment nous vous accompagnons.</h2>
          </div>
          <p className="max-w-[460px] pb-2 text-on-dark-body">
            Utiliser l'IA, tout le monde le fait. L'intégrer au cœur de vos processus, c'est notre
            métier. Nous bâtissons avec vous, nous déployons, nous formons vos équipes — afin que
            l'IA tourne chez vous, sans dépendance à notre intervention.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex min-h-[200px] flex-col gap-2 rounded-lg border border-hairline bg-surface-card p-7"
            >
              <div className="t-display-md mb-2 text-primary">{s.n}</div>
              <div className="t-title-md">{s.title}</div>
              <div className="t-body-sm text-on-dark-body">{s.desc}</div>
              <div className="mt-auto border-t border-hairline pt-3 font-mono text-[11px] text-on-dark-muted">
                {s.dur}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[15px] text-on-dark-muted">
          Vous validez à chaque étape. Aucun engagement avant la signature de la mission.
        </p>
      </div>
    </section>
  )
}
