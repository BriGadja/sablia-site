import { Reveal } from '@/components/ui/reveal'

const steps = [
  {
    number: '01',
    title: 'Diagnostic',
    duration: '5 jours ouvrés · 490€ HT',
    body: "Intake asynchrone puis deep-dive synchrone de 3 heures. Nous cartographions vos process, identifions les opportunités d'automatisation, et signalons celles à laisser de côté. Vous repartez avec une feuille de route 90 jours, chiffrée.",
    deliverable: 'PDF · 10 à 15 pages',
  },
  {
    number: '02',
    title: 'Implémentation',
    duration: '2 à 6 semaines',
    body: 'Construction de la solution : site, flux, agent. Vous voyez les avancées chaque semaine, par visio courte. Pas de livraison en big bang trois mois plus tard, pas de mystère sur ce qui se passe entre-temps.',
    deliverable: 'Démo fonctionnelle · mi-parcours',
  },
  {
    number: '03',
    title: 'Formation',
    duration: '½ à 1 journée',
    body: 'Votre équipe reprend la main. Vidéos courtes, documentation écrite en français pensée pour un dirigeant, sessions de prise en main. Rien de ce qui est livré ne repose sur notre seule présence.',
    deliverable: 'Manuel · accès · vidéos',
  },
  {
    number: '04',
    title: 'Suivi',
    duration: 'Mensuel, résiliable',
    body: "Un contrat de maintenance léger si vous le souhaitez. Sinon, rien. Jamais d'abonnement imposé, jamais de dépendance artificielle. Vous gardez notre numéro si quelque chose grince.",
    deliverable: 'Optionnel · à votre main',
  },
]

/**
 * N° 05 · La méthode Sablia — 4 étapes, fond encre sombre, grain inversé.
 */
export default function MethodSection() {
  return (
    <section
      id="methode"
      className="relative bg-[color:var(--color-encre)] py-24 text-[color:var(--color-sable)] md:py-32"
      aria-labelledby="method-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.87  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="container-editorial relative">
        <div className="mb-16 grid grid-cols-12 gap-x-6 md:mb-24">
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <p className="folio mb-6 text-[color:var(--color-sable-300)]">
                N° 05 · La méthode Sablia
              </p>
              <h2 id="method-title" className="display-lg text-[color:var(--color-sable)]">
                Quatre étapes. Pas de surprise,
                <br /> pas de <em>vocabulaire</em> d'agence.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[color:var(--color-sable-200)]">
                Une méthode délibérément simple, conçue pour que vous compreniez ce qui se passe à
                chaque instant, et pour que vous puissiez arrêter après chaque étape si vous le
                souhaitez.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[calc(33.333%+0.5rem)] top-6 hidden h-[calc(100%-4rem)] w-px bg-[color:var(--color-sable)]/20 lg:block"
          />

          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={i * 80}
              className="relative grid grid-cols-12 gap-x-6 py-10 md:py-12 lg:py-14"
            >
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-[clamp(4rem,7vw,6rem)] leading-none text-[color:var(--color-tuile)]">
                    {step.number}
                  </span>
                  <div>
                    <p className="folio text-[color:var(--color-sable-300)]">{step.duration}</p>
                    <h3 className="display-md mt-1 text-[color:var(--color-sable)]">
                      {step.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div
                aria-hidden
                className="absolute left-[calc(33.333%+0.5rem)] top-16 hidden h-3 w-3 -translate-x-1/2 rotate-45 bg-[color:var(--color-tuile)] lg:block"
              />

              <div className="col-span-12 mt-6 lg:col-span-7 lg:col-start-6 lg:mt-2">
                <p className="max-w-[56ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-sable-200)]">
                  {step.body}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-[color:var(--color-sable)]/15 pt-4">
                  <span className="eyebrow text-[color:var(--color-sable-300)]">Livrable</span>
                  <span className="font-mono text-[0.8rem] tracking-[-0.01em] text-[color:var(--color-sable)]">
                    {step.deliverable}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
