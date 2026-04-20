import { LogoMark } from '@/components/brand/logo-mark'
import { ButtonLink } from '@/components/ui/button'
import { Reveal } from '@/components/ui/reveal'
import { trackEvent } from '@/lib/analytics'
import { site } from '@/lib/site'

/**
 * N° 09 · Passons à l'acte — CTA final + photo Brice.
 */
export default function FinalCtaSection() {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault()
    trackEvent('cta_start_diagnostic', { location: 'final-cta' })
    document.querySelector(site.diagnosticAnchor)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative overflow-hidden bg-[color:var(--color-sable-50)] py-24 md:py-32"
      aria-labelledby="final-cta-title"
    >
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 opacity-[0.07]">
        <LogoMark size={480} className="text-[color:var(--color-encre)]" />
      </div>

      <div className="container-editorial relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="folio mb-6">N° 09 · Passons à l'acte</p>
          <h2 id="final-cta-title" className="display-xl text-[color:var(--color-encre)]">
            Prêt à voir ce qui est <em>automatisable</em> ?
          </h2>
          <p className="mx-auto mt-8 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[color:var(--color-encre-70)] md:text-[1.125rem]">
            Cinq jours, un PDF, une recommandation claire. Si le diagnostic conclut que l'IA n'a pas
            sa place chez vous, c'est dit aussi.
          </p>
        </Reveal>

        <Reveal
          delay={120}
          className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-5 sm:flex-row sm:justify-center"
        >
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
            onClick={() => trackEvent('cta_book_call', { location: 'final-cta' })}
            className="inline-flex items-center gap-2 font-display text-[1.05rem] italic text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
            aria-label="Réserver un créneau de discussion avec Brice sur Calendly"
          >
            Préférer en discuter d'abord
            <span aria-hidden>→</span>
          </a>
        </Reveal>

        <Reveal
          delay={200}
          className="mx-auto mt-20 flex max-w-xl flex-col items-center gap-5 border-t border-[color:var(--color-encre)]/15 pt-10 text-center"
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-[color:var(--color-sable-50)] ring-1 ring-[color:var(--color-encre)]/15">
              <img
                src="/brice.png"
                alt="Brice Gachadoat"
                width={160}
                height={160}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="eyebrow">Brice Gachadoat, fondateur de Sablia</p>
            </div>
          </div>
          <p className="max-w-[42ch] text-[0.9rem] italic leading-relaxed text-[color:var(--color-encre-70)]">
            Je réponds moi-même. Il n'y a personne d'autre à la manœuvre.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
