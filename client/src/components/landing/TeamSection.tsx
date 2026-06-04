const TEAM = [
  {
    slug: 'brice',
    name: 'Brice',
    role: 'Tech / Delivery',
    bio: 'Ingénieur. Il plonge dans votre CRM, conçoit les automatisations, déploie et forme vos équipes. Joignable directement durant la mission.',
  },
  {
    slug: 'raphael',
    name: 'Raphaël',
    role: 'Commercial',
    bio: "Il qualifie, cadre et oriente. Apporte une vision business et CRM tout au long de l'accompagnement.",
  },
  {
    slug: 'pablo',
    name: 'Pablo',
    role: 'Commercial',
    bio: "Il assure le suivi, l'orchestration commerciale et l'accompagnement de proximité. Vision CRM côté pipeline.",
  },
  {
    slug: 'remi',
    name: 'Rémi',
    role: 'Acquisition / Stratégie',
    bio: 'Cinq ans de Meta Ads et de génération de leads B2B. Si vous souhaitez également que nous générions vos propres opportunités.',
  },
]

export default function TeamSection() {
  return (
    <section id="equipe" className="bg-canvas px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[640px] text-center">
          <div className="eyebrow mb-4 text-primary">Équipe</div>
          <h2 className="t-display-lg">Une équipe à taille humaine pour vous accompagner.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.slug} className="flex flex-col">
              <img
                src={`/team/${m.slug}.webp`}
                alt={`${m.name}, ${m.role}`}
                width={800}
                height={800}
                loading="lazy"
                className="mb-4 w-full rounded-xl border border-hairline"
              />
              <h3 className="t-title-md text-on-dark-strong">{m.name}</h3>
              <div className="eyebrow mb-2 text-primary">{m.role}</div>
              <p className="text-[14px] leading-relaxed text-on-dark-body">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
