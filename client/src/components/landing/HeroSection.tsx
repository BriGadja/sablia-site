import { LogoMark } from '@/components/brand/logo-mark'
import { ButtonLink } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'
import { site } from '@/lib/site'

/**
 * Hero éditorial — N°01 Propos liminaire.
 * Copy figée docs/copy-v1.md §C2. Credential line attribue YouTube 200k+
 * à la chaîne de Yassine Sdiri via IAPreneurs (affilié).
 */
export default function HeroSection() {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault()
    trackEvent('cta_start_diagnostic', { location: 'hero' })
    document.querySelector('#diagnostic-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-28 md:pb-32 md:pt-32 lg:pt-36"
      aria-labelledby="hero-title"
    >
      <div className="container-editorial relative">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 lg:gap-y-0">
          {/* Colonne texte */}
          <div className="col-span-12 lg:col-span-8">
            <p className="folio mb-6">N° 01 · Propos liminaire</p>

            <h1 id="hero-title" className="display-xl text-[color:var(--color-encre)]">
              Cinq jours. Un PDF.
              <br />
              <em>Une décision claire.</em>
            </h1>

            <div className="mt-10 max-w-[52ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre-70)] md:text-[1.125rem]">
              <p>
                Le <span className="text-[color:var(--color-encre)]">Diagnostic Sablia</span>{' '}
                cartographie vos process, identifie les automatisations qui valent vraiment le coup,
                et signale celles à laisser de côté.{' '}
                <span className="text-[color:var(--color-encre)]">490€ HT</span>, déduits de la
                première facture si vous signez ensuite un contrat Développement ou Accompagnement.
              </p>
            </div>

            <p className="mt-8 max-w-[58ch] font-display text-[1rem] italic leading-snug tracking-[-0.005em] text-[color:var(--color-encre-70)] md:text-[1.0625rem]">
              Brice Gachadoat, Responsable Pédagogique et Coach Développement IA chez{' '}
              <a
                href={site.iapreneursUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="not-italic font-sans text-[color:var(--color-encre)] underline decoration-[color:var(--color-tuile)] decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--color-tuile)]"
              >
                IAPreneurs
              </a>{' '}
              (500+ membres).
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ButtonLink
                href={site.diagnosticAnchor}
                variant="primary"
                size="lg"
                onClick={scrollToForm}
              >
                Démarrer mon diagnostic, 490€
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <title>Arrow</title>
                  <path d="M3 10h14M12 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </ButtonLink>

              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_book_call', { location: 'hero' })}
                className="inline-flex items-center gap-2 font-display text-[1.05rem] italic text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                aria-label="Réserver un créneau de discussion avec Brice sur Calendly"
              >
                Préférer en discuter d'abord
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Bandeau de confiance */}
            <ul className="mt-14 grid grid-cols-3 gap-6 border-t border-[color:var(--color-encre)]/15 pt-8 md:max-w-xl">
              {[
                { value: '5 j', label: 'Turnaround diagnostic' },
                { value: '490€', label: 'HT, crédités si signature' },
                { value: '40+', label: 'PME déjà accompagnées' },
              ].map((s) => (
                <li key={s.label}>
                  <p className="eyebrow mb-1">{s.label}</p>
                  <p className="font-display text-[1.75rem] leading-none tracking-[-0.02em] text-[color:var(--color-encre)] md:text-[2rem]">
                    {s.value}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne marque — LogoMark oversized */}
          <aside className="col-span-12 hidden lg:col-span-4 lg:block" aria-hidden>
            <div className="sticky top-28 flex flex-col items-end gap-8">
              <div className="relative">
                <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-[color:var(--color-tuile)]/8 via-transparent to-[color:var(--color-ocre)]/10 blur-2xl" />
                <LogoMark size={260} className="text-[color:var(--color-tuile)]" />
              </div>
              <div className="w-full border-t border-[color:var(--color-encre)]/15 pt-5 text-right">
                <p className="folio">Atelier Sablia</p>
                <p className="mt-2 font-display text-lg italic leading-snug text-[color:var(--color-encre-70)]">
                  « On ne vend pas un outil.
                  <br />
                  On diagnostique le goulot. »
                </p>
                <p className="eyebrow mt-4">Brice Gachadoat, fondateur</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Signature basse mobile */}
        <div className="mt-14 flex items-center gap-5 border-t border-[color:var(--color-encre)]/15 pt-6 lg:hidden">
          <LogoMark size={44} className="text-[color:var(--color-tuile)]" />
          <p className="font-display text-base italic leading-snug text-[color:var(--color-encre-70)]">
            « On ne vend pas un outil. On diagnostique le goulot. »
          </p>
        </div>
      </div>
    </section>
  )
}
