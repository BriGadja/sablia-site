import { site } from '@/lib/site'

/**
 * One person on the page, decided by Brice on 2026-09-09; amended on 2026-09-18 (D10): the voice
 * is « nous » so the visitor never reads the team's size, and the founder is named, not counted.
 */
const FACTS = [
  'Le call de 30 minutes, avec nous',
  'L’installation sur votre CRM, par nous',
  'Les 5 appels de test, avec vous',
  'Un interlocuteur unique, joignable directement pendant la mission',
]

export default function TeamSection() {
  return (
    <section id="equipe" className="bg-canvas px-8 py-section">
      <div className="mx-auto grid max-w-editorial items-center gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
        <img
          src="/team/brice.webp"
          alt={`${site.founder}, fondateur de Sablia`}
          width={800}
          height={800}
          loading="lazy"
          className="w-full max-w-[320px] rounded-xl border border-hairline"
        />
        <div>
          <div className="eyebrow mb-4 text-primary">Notre fondateur</div>
          <h2 className="t-display-lg [text-wrap:balance]">
            Un interlocuteur unique, de l'appel à la mise en service.
          </h2>
          <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-on-dark-body">
            Sablia a été fondée par {site.founder}, ingénieur, pour brancher Claude sur les outils
            que les équipes commerciales utilisent déjà. Pas d'intermédiaire entre vous et la
            personne qui fait le travail : nous écoutons au call, nous installons, nous testons avec
            vous et nous répondons ensuite.
          </p>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="rounded-md border border-hairline bg-surface-card px-4 py-3 text-[14px] text-on-dark"
              >
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
