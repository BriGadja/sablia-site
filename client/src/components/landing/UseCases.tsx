import { LineChart, Mail, PhoneCall } from '@/components/icons/lucide-crm'

const CASES = [
  {
    icon: <LineChart size={22} />,
    title: 'Dashboards intelligents',
    desc: 'Claude lit votre pipeline et produit chaque lundi un brief commercial des opportunités à risque, des leads chauds, et des actions prioritaires.',
    tags: ['Salesforce', 'HubSpot'],
  },
  {
    icon: <Mail size={22} />,
    title: 'Nurturing automatisé',
    desc: "Séquences d'emails personnalisées, déclenchées par les signaux du pipeline. Le ton est calibré sur votre marque, pas sur un template.",
    tags: ['HubSpot', 'Pipedrive'],
  },
  {
    icon: <PhoneCall size={22} />,
    title: 'Analyse de calls',
    desc: 'Claude transcrit, résume et enrichit chaque appel commercial dans votre CRM — objections clés, prochaines étapes, scoring.',
    tags: ['Salesforce', 'Pipedrive'],
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="bg-canvas px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <div className="eyebrow mb-4 text-primary">Cas d'usage</div>
          <h2 className="t-display-lg">Trois automatisations conçues sur mesure.</h2>
          <p className="mt-4 text-on-dark-body">
            Pas de template, pas de solution générique. Chaque déploiement est calibré sur votre
            outil, vos processus, vos équipes.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-3.5 rounded-lg border border-hairline bg-surface-card p-8 transition-colors duration-base hover:bg-surface-card-elevated"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                {c.icon}
              </div>
              <h3 className="t-display-sm mt-1">{c.title}</h3>
              <p className="text-[15px] leading-relaxed text-on-dark-body">{c.desc}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="t-caption-uppercase rounded-full bg-surface-card-elevated px-2.5 py-1 text-on-dark-body"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
