import { VoicePlayer } from '@/components/brand/voice-player'
import { Reveal } from '@/components/ui/reveal'
import { site } from '@/lib/site'

/**
 * N° 03 · Le diagnostic — une seule offre, le Diagnostic Sablia 490€ HT.
 * Spec docs/wireframe-v1.md §1.4, copy verbatim docs/copy-v1.md §C3 §4.
 * Triptyque vertical gauche (sites/flux/voix) illustre le périmètre, pas des offres.
 */
export default function OffersSection() {
  return (
    <section
      id="offres"
      className="relative border-t border-[color:var(--color-encre)]/10 py-24 md:py-32"
      aria-labelledby="offers-title"
    >
      <div className="container-editorial">
        <div className="mb-16 grid grid-cols-12 gap-x-6 md:mb-20">
          <div className="col-span-12 lg:col-span-8">
            <Reveal>
              <p className="folio mb-6">N° 03 · Le diagnostic</p>
              <h2 id="offers-title" className="display-lg">
                Cinq jours pour <em>y voir clair</em>.
              </h2>
            </Reveal>
          </div>
        </div>

        <article className="grid grid-cols-12 items-start gap-x-6 gap-y-10">
          <Reveal className="col-span-12 lg:col-span-5">
            <div className="sticky top-28">
              <TriptychIllustration />
              <p className="mt-5 max-w-[36ch] font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[color:var(--color-encre-50)]">
                Sites, flux, voix · ce que le diagnostic examine
              </p>
            </div>
          </Reveal>

          <Reveal className="col-span-12 lg:col-span-6 lg:col-start-7" delay={120}>
            <div className="flex items-baseline gap-5">
              <span className="font-display text-[clamp(3rem,6vw,4.5rem)] leading-none text-[color:var(--color-tuile)]">
                01
              </span>
              <span className="eyebrow">Diagnostic Sablia</span>
            </div>

            <h3 className="mt-4 display-md text-[color:var(--color-encre)]">
              Un état des lieux chiffré, pas un audit commercial.
            </h3>

            <div className="mt-8 max-w-[58ch] space-y-5 text-[1.0625rem] leading-relaxed text-[color:var(--color-encre-70)] md:text-[1.125rem]">
              <p>
                Le Diagnostic Sablia structure votre état des lieux. Vous recevez un{' '}
                <span className="text-[color:var(--color-encre)]">PDF de 10 à 15 pages</span>{' '}
                : cartographie de vos process, opportunités d'implémentation IA classées par ROI,
                feuille de route 90 jours, et estimation chiffrée de la phase suivante.
              </p>
              <p>
                Tout ça en{' '}
                <span className="text-[color:var(--color-encre)]">5 jours ouvrés</span>, pour{' '}
                <span className="text-[color:var(--color-encre)]">490€ HT</span>. Si le diagnostic
                débouche sur un contrat Développement ou Accompagnement signé dans les 90 jours, ces
                490€ sont intégralement déduits de votre première facture. Payable par Stripe ou
                virement. Annulation avec remboursement intégral jusqu'à 72 h avant l'intake.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[color:var(--color-encre)]/15 pt-8">
              {[
                { k: 'Prix', v: '490€ HT' },
                { k: 'Délai', v: '5 jours ouvrés' },
                { k: 'Livrable', v: 'PDF · 10 à 15 pages' },
                { k: 'Crédit', v: 'Déduit à 100 % sur contrat Dév. ou Accomp. dans 90 j' },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="eyebrow mb-2">{row.k}</dt>
                  <dd className="font-display text-[1.125rem] leading-snug tracking-[-0.01em] text-[color:var(--color-encre)]">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <a
                href={site.diagnosticAnchor}
                className="inline-flex items-center gap-2 border-b border-[color:var(--color-tuile)] pb-1 font-display text-[1.1rem] italic text-[color:var(--color-encre)] transition-colors hover:text-[color:var(--color-tuile)]"
              >
                Démarrer le diagnostic
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path d="M3 10h14M12 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </Reveal>
        </article>
      </div>
    </section>
  )
}

function TriptychIllustration() {
  return (
    <div className="relative overflow-hidden bg-[color:var(--color-sable-50)] hairline-t hairline-b">
      <figure className="relative border-b border-[color:var(--color-encre)]/10 px-5 py-6">
        <figcaption className="eyebrow mb-3">Sites qui convertissent</figcaption>
        <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden>
          <defs>
            <linearGradient id="triptychSiteGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B84A1E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#953A14" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="40" y="20" width="320" height="180" fill="#FBF8F2" stroke="#1A1613" strokeOpacity="0.15" />
          <rect x="40" y="20" width="320" height="22" fill="#F4EEDF" stroke="#1A1613" strokeOpacity="0.15" />
          <circle cx="55" cy="31" r="2.5" fill="#B84A1E" />
          <circle cx="66" cy="31" r="2.5" fill="#C9A461" />
          <circle cx="77" cy="31" r="2.5" fill="#3B4A3A" />
          <rect x="64" y="65" width="180" height="12" fill="#1A1613" />
          <rect x="64" y="85" width="240" height="6" fill="#1A1613" opacity="0.4" />
          <rect x="64" y="97" width="210" height="6" fill="#1A1613" opacity="0.4" />
          <rect x="64" y="120" width="110" height="24" fill="url(#triptychSiteGrad)" />
          <rect x="64" y="160" width="272" height="30" fill="#E9E0CB" />
        </svg>
      </figure>

      <figure className="relative border-b border-[color:var(--color-encre)]/10 px-5 py-6">
        <figcaption className="eyebrow mb-3">Flux internes reliés</figcaption>
        <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden>
          <defs>
            <pattern id="triptychDot" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#1A1613" opacity="0.18" />
            </pattern>
          </defs>
          <rect width="400" height="220" fill="url(#triptychDot)" />
          {[
            { x: 50, y: 30, l: 'CRM' },
            { x: 280, y: 30, l: 'Email' },
            { x: 50, y: 150, l: 'Factu.' },
            { x: 280, y: 150, l: 'Drive' },
          ].map((n) => (
            <g key={n.l} transform={`translate(${n.x}, ${n.y})`}>
              <rect width="70" height="40" fill="#FBF8F2" stroke="#1A1613" strokeOpacity="0.35" />
              <text
                x="35"
                y="24"
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                fill="#1A1613"
                textAnchor="middle"
              >
                {n.l}
              </text>
            </g>
          ))}
          <g stroke="#B84A1E" strokeWidth="1.25" fill="none" strokeDasharray="3 4">
            <path d="M85 70 L200 110" />
            <path d="M315 70 L200 110" />
            <path d="M85 150 L200 110" />
            <path d="M315 150 L200 110" />
          </g>
          <g transform="translate(200, 110)">
            <circle r="28" fill="#B84A1E" />
            <g stroke="#FBF8F2" strokeWidth="1.5" strokeLinecap="round" fill="none">
              <line x1="0" y1="-14" x2="0" y2="-7" />
              <line x1="0" y1="7" x2="0" y2="14" />
              <line x1="-14" y1="0" x2="-7" y2="0" />
              <line x1="7" y1="0" x2="14" y2="0" />
            </g>
            <circle r="3" fill="#FBF8F2" />
          </g>
        </svg>
      </figure>

      <figure className="relative px-5 py-6">
        <figcaption className="eyebrow mb-3">Voix qui prend vos appels</figcaption>
        <div className="relative">
          <svg viewBox="0 0 400 220" className="h-auto w-full" aria-hidden>
            <g stroke="#1A1613" strokeOpacity="0.08">
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={20 + i * 30} x2="400" y2={20 + i * 30} />
              ))}
            </g>
            <g stroke="#B84A1E" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" fill="none">
              {Array.from({ length: 44 }).map((_, i) => {
                const x = 30 + i * 8
                const h = 10 + Math.abs(Math.sin(i * 0.55) * 40) + Math.abs(Math.cos(i * 0.3) * 22)
                return <line key={`b-${i}`} x1={x} y1={110 - h / 2} x2={x} y2={110 + h / 2} />
              })}
            </g>
            <g transform="translate(30, 165)">
              <rect width="340" height="1" fill="#1A1613" opacity="0.2" />
              <text y="22" fontFamily="Fraunces" fontSize="13" fill="#1A1613">
                Charlie · voix française
              </text>
              <g transform="translate(0, 42)">
                <circle cx="4" cy="4" r="4" fill="#3B4A3A" />
                <text
                  x="14"
                  y="8"
                  fontFamily="JetBrains Mono"
                  fontSize="9"
                  letterSpacing="1"
                  fill="#1A1613"
                >
                  EN LIGNE
                </text>
              </g>
            </g>
          </svg>
          <div className="absolute inset-x-0 top-[22%] bottom-[38%]">
            <VoicePlayer src="/audio/charlie-demo.mp3" label="Écouter Charlie" />
          </div>
        </div>
      </figure>
    </div>
  )
}
