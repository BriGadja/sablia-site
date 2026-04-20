import { Reveal } from '@/components/ui/reveal'

const inventory = [
  'Recopier un devis dans le CRM, puis dans la facturation, puis dans le Drive.',
  'Relancer à la main les paiements en retard, le vendredi soir.',
  "Prendre les appels qui n'aboutissent jamais à un rendez-vous.",
  "Attendre une semaine qu'un dossier client soit compilé.",
  "Confier à l'apprenti la tâche que personne d'autre ne veut faire.",
  'Réexpliquer le même process à chaque nouvelle recrue.',
]

/**
 * N° 02 · Le constat — inventaire 6 items ordonnés.
 * Copy figée docs/copy-v1.md §C3 (friction). Remplace ProblemSection.
 */
export default function FrictionSection() {
  return (
    <section className="relative py-24 md:py-32" aria-labelledby="friction-title">
      <div className="container-editorial">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <p className="folio mb-6">N° 02 · Le constat</p>
              <h2 id="friction-title" className="display-lg text-[color:var(--color-encre)]">
                Ce que votre équipe fait,
                <br />
                et qu'elle ne <em>devrait plus</em> faire.
              </h2>
              <p className="mt-6 max-w-[36ch] text-[color:var(--color-encre-70)]">
                Inventaire non exhaustif des heures qui s'évaporent chaque semaine, dans une PME
                française moyenne.
              </p>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ol className="divide-y divide-[color:var(--color-encre)]/10 border-t border-b border-[color:var(--color-encre)]/15">
              {inventory.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 60}>
                  <div className="group flex items-start gap-5 py-5 md:py-6">
                    <span className="folio w-10 shrink-0 pt-2">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="flex-1 font-display text-[clamp(1.125rem,1.4vw+0.5rem,1.4rem)] leading-snug tracking-[-0.01em] text-[color:var(--color-encre)]">
                      {item}
                    </p>
                    <span
                      aria-hidden
                      className="mt-3 h-2.5 w-2.5 shrink-0 rotate-45 border border-[color:var(--color-encre)]/40 transition-all duration-500 group-hover:border-[color:var(--color-tuile)] group-hover:bg-[color:var(--color-tuile)]"
                    />
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal>
              <p className="mt-10 max-w-[54ch] font-display text-[1.25rem] italic leading-snug tracking-[-0.01em] text-[color:var(--color-encre-90)] md:text-[1.5rem]">
                Ces heures ne reviennent pas. L'automatisation bien posée les rend{' '}
                <span className="text-[color:var(--color-tuile)]">pour toujours.</span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
