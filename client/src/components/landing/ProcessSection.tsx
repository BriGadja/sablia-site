import { of1 } from '@/content/of1'

interface Step {
  n: string
  title: string
  desc: string
  dur: string
}

// Durations and the recurring fee come from the OF-1 module: on 2026-09-09 the home still promised
// a multi-week implementation and team training, while the offer delivers in 7 days and excludes
// training beyond a 10-minute ritual.
export const STEPS: readonly Step[] = [
  {
    n: '01',
    title: 'Call de 30 minutes',
    desc: "Partage d'écran. Nous regardons votre CRM et votre téléphonie, et nous vous disons ce qui rentre dans une offre cadrée.",
    dur: '30 min',
  },
  {
    n: '02',
    title: 'Prix',
    desc: 'Offre cadrée : le prix est affiché, avant tout paiement. Besoin spécifique : chiffrage par brique, confirmé sous 24 heures.',
    dur: '24 h',
  },
  {
    n: '03',
    title: 'Implémentation',
    desc: 'Nous installons sur votre CRM, nous testons sur 5 appels réels avec vous, puis nous mettons en service.',
    dur: `${of1.delay.days} jours`,
  },
  {
    n: '04',
    title: 'Supervision',
    desc: "Surveillance des exécutions, reprise des échecs, adaptation aux changements d'API de vos outils. Sans engagement.",
    dur: `${of1.price.monthlyHt} €/mois, premier mois offert`,
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
            métier. Nous installons, nous testons avec vous, nous mettons en service, et la chaîne
            tourne chez vous, sur vos comptes, sans dépendance à notre intervention.
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
