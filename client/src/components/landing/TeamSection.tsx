import { site } from '@/lib/site'

/**
 * One person on the page, decided by Brice on 2026-09-09: he runs the call, the install, the test
 * and the follow-up alone. The four-portrait grid described a team that was not in the cycle.
 */
const FACTS = [
  'Le call de 30 minutes, avec lui',
  'L’installation sur votre CRM, par lui',
  'Les 5 appels de test, avec vous',
  'Joignable directement pendant la mission',
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
          <div className="eyebrow mb-4 text-primary">Votre interlocuteur</div>
          <h2 className="t-display-lg [text-wrap:balance]">
            Une seule personne, de l'appel à la mise en service.
          </h2>
          <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-on-dark-body">
            {site.founder}, ingénieur, a fondé Sablia pour brancher Claude sur les outils que les
            équipes commerciales utilisent déjà. Il n'y a pas de commercial entre vous et la
            personne qui fait le travail : celui qui vous écoute au call est celui qui installe,
            teste et répond ensuite.
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
