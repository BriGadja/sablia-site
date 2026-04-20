import { Reveal } from '@/components/ui/reveal'

/**
 * N° 04 · Ce que révèle votre diagnostic — 3 paths post-audit.
 * Spec docs/wireframe-v1.md §1.5, copy verbatim docs/copy-v1.md §C4.
 * Règles : 3 cartes ordre Formation → Accompagnement → Développement.
 * Price floor UNIQUEMENT sur Card 1 (Formation, 1 500€ HT).
 */

type Path = {
  number: string
  title: string
  intro: string
  bullets: [string, string, string]
  priceFloor?: string
}

const paths: Path[] = [
  {
    number: '01',
    title: "Formation d'équipes internes",
    intro:
      "Vos équipes doivent maîtriser un outil ou un workflow spécifique. On construit le curriculum sur mesure et on forme en présentiel ou à distance.",
    bullets: [
      'Utiliser n8n ou Make pour automatiser leurs process internes sans support technique',
      'Prompter correctement un LLM pour la relecture de contrats, la synthèse de réunion, le reporting',
      "Auditer un nouveau process automatisable sans dépendre d'un prestataire externe",
    ],
    priceFloor: 'À partir de 1 500€ HT',
  },
  {
    number: '02',
    title: 'Accompagnement',
    intro:
      "Un sponsor interne porte le projet IA dans votre entreprise. On le coache chaque semaine pour qu'il délivre sans dérailler, sans over-engineering.",
    bullets: [
      "Structurer la roadmap d'implémentation IA et la défendre en interne",
      'Piloter les prestataires techniques avec les bons critères et les bons livrables',
      'Décider quelles automatisations lancer, arbitrer les priorités, arrêter celles qui ne livrent pas',
    ],
  },
  {
    number: '03',
    title: 'Développement',
    intro:
      "Vous voulez que les automatisations soient construites directement par Sablia. On livre clé en main avec documentation de handoff.",
    bullets: [
      'Exploiter des workflows n8n sur mesure (finance, ops, commercial, support)',
      'Déployer des agents vocaux Dipler pour standards, relances clients, prises de rendez-vous',
      'Utiliser des applications web internes (dashboards, formulaires, espaces clients)',
    ],
  },
]

export default function WhatRevealsSection() {
  return (
    <section
      id="paths"
      className="relative border-t border-[color:var(--color-encre)]/10 py-24 md:py-32"
      aria-labelledby="paths-title"
    >
      <div className="container-editorial">
        <div className="mb-14 grid grid-cols-12 gap-x-6 md:mb-20">
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <p className="folio mb-6">N° 04 · Ce que révèle votre diagnostic</p>
              <h2 id="paths-title" className="display-lg">
                Trois suites possibles.
                <br />
                <em>Une seule</em> recommandée, selon ce qu'on trouve.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[color:var(--color-encre-70)]">
                Le livrable PDF oriente vers un et un seul de ces paths. Vous êtes libre de
                décliner, de combiner, ou de partir avec la roadmap sans prestation supplémentaire.
              </p>
            </Reveal>
          </div>
        </div>

        <ul className="grid grid-cols-12 gap-x-6 gap-y-8">
          {paths.map((path, i) => (
            <Reveal
              as="li"
              key={path.number}
              delay={i * 100}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <PathCard path={path} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={300}>
          <p className="mx-auto mt-16 max-w-[58ch] text-center font-display text-[1.125rem] italic leading-relaxed text-[color:var(--color-encre-70)] md:mt-20 md:text-[1.25rem]">
            Les chiffres d'Accompagnement et de Développement se discutent en restitution du
            diagnostic. La fourchette ne dit rien, la recommandation oui.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function PathCard({ path }: { path: Path }) {
  return (
    <article className="group relative flex h-full flex-col border border-[color:var(--color-encre)]/12 bg-[color:var(--color-sable-50)] p-8 transition-colors duration-500 hover:border-[color:var(--color-encre)]/30 md:p-9">
      <header className="flex items-baseline gap-4 border-b border-[color:var(--color-encre)]/15 pb-5">
        <span className="font-display text-[2.75rem] leading-none text-[color:var(--color-tuile)]">
          {path.number}
        </span>
        <h3 className="display-md text-[color:var(--color-encre)]">{path.title}</h3>
      </header>

      <p className="mt-6 text-[0.95rem] leading-relaxed text-[color:var(--color-encre-70)]">
        {path.intro}
      </p>

      <div className="mt-8">
        <p className="eyebrow mb-4">Ce que votre équipe peut faire après</p>
        <ul className="flex flex-col gap-3">
          {path.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[color:var(--color-encre-90)]"
            >
              <span
                aria-hidden
                className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-[color:var(--color-tuile)]"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-8">
        <div className="border-t border-[color:var(--color-encre)]/15 pt-5">
          {path.priceFloor ? (
            <>
              <p className="eyebrow mb-2">Ticket d'entrée</p>
              <p className="font-display text-[1.25rem] tracking-[-0.01em] text-[color:var(--color-encre)]">
                {path.priceFloor}
              </p>
            </>
          ) : (
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[color:var(--color-encre-50)]">
              Chiffré en restitution de diagnostic
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
