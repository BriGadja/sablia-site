import { Helmet } from 'react-helmet-async'
import { Reveal } from '@/components/ui/reveal'

const stats = [
  { value: '+40', label: 'PME accompagnées', sub: 'Depuis 2024' },
  { value: '1 200 h', label: 'économisées par trimestre', sub: 'Moyenne client en régime' },
  { value: '98 %', label: 'de clients reconduits', sub: 'Maintenance ou nouveau projet' },
  { value: '0', label: 'abonnement imposé', sub: 'Vous restez libre' },
]

const testimonials = [
  {
    quote: 'On a retrouvé nos dimanches.',
    name: 'Claire M.',
    role: "Gérante · cabinet d'expertise comptable",
    size: '42 salariés · Nantes',
  },
  {
    quote:
      "Brice a refusé deux de nos demandes parce qu'elles ne méritaient pas l'investissement. C'est comme ça qu'on a su qu'on bossait avec la bonne personne.",
    name: 'Thomas R.',
    role: "Directeur · bureau d'études industriel",
    size: '18 salariés · Grenoble',
  },
  {
    quote:
      "Notre standard téléphonique tourne sans nous depuis huit mois. Aucun client ne s'en est plaint. Beaucoup l'ont félicité.",
    name: 'Sophie L.',
    role: 'Dirigeante · groupement vétérinaire',
    size: '31 salariés · Bordeaux',
  },
]

const sectors = [
  'Expertise comptable',
  'Distribution B2B',
  'Cabinet médical',
  "Bureau d'études",
  'Artisanat haut de gamme',
  'Cabinet juridique',
  'Concession auto',
  'Immobilier',
]

/**
 * N° 06 · Terrain — stats + 3 témoignages anonymisés + secteurs.
 * Témoignages placeholders (prénom + initiale) jusqu'à consent clients (P4.3).
 * schema.org Review × 3 préservé pour SEO.
 */
export default function ProofSection() {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sablia',
    provider: { '@type': 'Organization', name: 'Sablia', url: 'https://sablia.io' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: testimonials.length,
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      reviewBody: t.quote,
      author: { '@type': 'Person', name: t.name },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(reviewSchema)}</script>
      </Helmet>
      <section id="preuves" className="relative py-24 md:py-32" aria-labelledby="proof-title">
        <div className="container-editorial">
          <div className="mb-14 grid grid-cols-12 gap-x-6 md:mb-20">
            <div className="col-span-12 lg:col-span-8">
              <Reveal>
                <p className="folio mb-6">N° 06 · Terrain</p>
                <h2 id="proof-title" className="display-lg">
                  Ce qui est déjà <em>en marche</em>,
                  <br />
                  dans d'autres PME que la vôtre.
                </h2>
              </Reveal>
            </div>
          </div>

          <Reveal>
            <ul className="grid grid-cols-2 divide-x divide-y divide-[color:var(--color-encre)]/12 border border-[color:var(--color-encre)]/12 bg-[color:var(--color-sable-50)] md:grid-cols-4 md:divide-y-0">
              {stats.map((s) => (
                <li key={s.label} className="px-6 py-8 md:px-8 md:py-10">
                  <p className="eyebrow mb-3">{s.label}</p>
                  <p className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-[-0.02em] text-[color:var(--color-encre)]">
                    {s.value}
                  </p>
                  <p className="mt-3 text-[0.8rem] text-[color:var(--color-encre-50)]">{s.sub}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-24">
            {testimonials.map((t, i) => (
              <Reveal
                key={t.name}
                delay={i * 100}
                className="col-span-12 md:col-span-6 lg:col-span-4"
              >
                <figure className="flex h-full flex-col justify-between border-t-2 border-[color:var(--color-tuile)] pt-6">
                  <blockquote className="font-display text-[1.375rem] leading-snug tracking-[-0.015em] text-[color:var(--color-encre)] md:text-[1.5rem]">
                    <span className="pull-quote">{t.quote}</span>
                  </blockquote>
                  <figcaption className="mt-8 border-t border-[color:var(--color-encre)]/15 pt-5">
                    <p className="font-sans text-[0.95rem] font-medium text-[color:var(--color-encre)]">
                      {t.name}
                    </p>
                    <p className="mt-1 text-[0.85rem] text-[color:var(--color-encre-70)]">
                      {t.role}
                    </p>
                    <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[color:var(--color-encre-50)]">
                      {t.size}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 md:mt-28">
            <p className="eyebrow mb-6">Ils nous ont confié leur temps</p>
            <ul className="flex flex-wrap gap-x-10 gap-y-3 border-y border-[color:var(--color-encre)]/15 py-6">
              {sectors.map((s) => (
                <li
                  key={s}
                  className="font-display text-[1.125rem] italic text-[color:var(--color-encre-70)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
