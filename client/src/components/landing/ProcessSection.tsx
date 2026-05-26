const STEPS = [
  {
    n: '01',
    title: 'Call discovery',
    desc: '45 min pour comprendre votre pipeline et identifier les automatisations à plus fort impact.',
    dur: '45 min',
  },
  {
    n: '02',
    title: 'Diagnostic CRM',
    desc: 'Audit technique de votre stack. Cartographie des workflows à automatiser.',
    dur: '5 jours',
  },
  {
    n: '03',
    title: 'Implémentation',
    desc: 'Intégration sur-mesure de Claude dans votre CRM. Pas de plugin, pas de migration.',
    dur: '2–4 semaines',
  },
  {
    n: '04',
    title: 'Suivi',
    desc: 'Itérations mensuelles. On mesure le temps gagné. On ajuste.',
    dur: 'En continu',
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="border-y border-hairline bg-canvas-soft px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mb-12 grid items-end gap-14 lg:grid-cols-[auto_1fr]">
          <div>
            <div className="eyebrow mb-4 text-primary">Comment ça marche</div>
            <h2 className="t-display-lg">
              Quatre étapes,
              <br />
              zéro friction sur votre stack.
            </h2>
          </div>
          <p className="max-w-[460px] pb-2 text-on-dark-body">
            Notre approche n'impose ni nouveau CRM, ni nouveau workflow. Nous connectons Claude à
            vos outils existants, là où il a le plus d'impact mesurable.
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
      </div>
    </section>
  )
}
