import { Reveal } from '@/components/ui/reveal'
import { site } from '@/lib/site'

/**
 * Intermède · Autorité — deux casquettes (IAPreneurs / Sablia).
 * Spec docs/product-v1.md §6 : audiences distinctes, YouTube 200k+ attribué
 * à Yassine Sdiri (pas à la communauté IAPreneurs), vouvoiement, sans em dash.
 */
export default function AuthoritySection() {
  return (
    <section
      id="autorite"
      className="relative border-t border-[color:var(--color-encre)]/10 bg-[color:var(--color-sable-50)] py-24 md:py-32"
      aria-labelledby="authority-title"
    >
      <div className="container-editorial">
        <div className="mb-14 grid grid-cols-12 gap-x-6 md:mb-20">
          <div className="col-span-12 lg:col-span-9">
            <Reveal>
              <p className="folio mb-6">Intermède · Autorité</p>
              <h2 id="authority-title" className="display-lg">
                Deux casquettes.
                <br />
                Un seul <em>terrain d'observation</em>.
              </h2>
              <p className="mt-8 max-w-[60ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre-70)] md:text-[1.125rem]">
                Sablia n'est pas une démarche solo. C'est le volet implémentation d'un double rôle
                que j'exerce depuis 2024.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-x-6 gap-y-10 md:gap-y-12">
          <Reveal className="col-span-12 lg:col-span-6">
            <article className="flex h-full flex-col border-t-2 border-[color:var(--color-tuile)] pt-7">
              <p className="eyebrow mb-3">Casquette formation</p>
              <h3 className="display-md text-[color:var(--color-encre)]">
                Responsable Pédagogique et Coach Développement IA
              </h3>
              <p className="mt-4 text-[0.95rem] text-[color:var(--color-encre-70)]">
                <a
                  href={site.iapreneursUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-encre)] underline decoration-[color:var(--color-tuile)] decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  IAPreneurs
                </a>
                , la communauté francophone de formation IA fondée par Yassine Sdiri. Plus de 500
                membres actifs. Chaîne YouTube de Yassine Sdiri, 200 000+ abonnés.
              </p>
              <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre)]">
                J'y coache au quotidien des entrepreneurs qui construisent leur agence
                d'automatisation IA. Je vois passer des dizaines de projets par mois, les
                réussites, les impasses, les erreurs de scope. Cette masse de cas alimente chaque
                Diagnostic Sablia.
              </p>
            </article>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-6" delay={120}>
            <article className="flex h-full flex-col border-t-2 border-[color:var(--color-encre)] pt-7">
              <p className="eyebrow mb-3">Casquette implémentation</p>
              <h3 className="display-md text-[color:var(--color-encre)]">Fondateur, Sablia</h3>
              <p className="mt-4 text-[0.95rem] text-[color:var(--color-encre-70)]">
                Implémentation IA dans les opérations de PME françaises, depuis 2024. Dirigeants de
                structures de 10 à 250 salariés.
              </p>
              <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre)]">
                Côté Sablia, j'accompagne directement des dirigeants qui veulent intégrer l'IA
                dans leurs opérations existantes, pas en vendre. Le diagnostic applique ce que je
                vois tous les jours côté formation : ce qui vaut le coup, et ce qui ne vaut pas.
              </p>
            </article>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <blockquote className="mx-auto mt-20 max-w-[64ch] border-t border-[color:var(--color-encre)]/15 pt-10 text-center font-display text-[1.375rem] italic leading-snug tracking-[-0.01em] text-[color:var(--color-encre-90)] md:mt-24 md:text-[1.625rem]">
            <span className="pull-quote">
              Former des entrepreneurs à vendre l'IA, et implémenter l'IA pour des dirigeants :
              deux métiers, un même terrain d'observation.
            </span>
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
