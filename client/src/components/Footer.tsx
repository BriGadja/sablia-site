import { Link } from 'wouter'
import { LogoMark } from '@/components/brand/logo-mark'
import { site } from '@/lib/site'

/**
 * Editorial footer — grid col-4/2/3/3 desktop.
 * Preserves sablia-site test assertions : mailto brice@sablia.io, Mentions
 * légales, Politique de confidentialité, CGV, FAQ, Cas clients, Calculateur
 * ROI. Privacy URL canonique = /politique-confidentialite (route sablia-site).
 */
export default function Footer() {
  return (
    <footer className="relative border-t border-[color:var(--color-encre)]/15 bg-[color:var(--color-sable)] py-12 md:py-16">
      <div className="container-editorial">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3">
              <LogoMark size={36} className="text-[color:var(--color-tuile)]" />
              <span className="font-display text-[1.6rem] tracking-[-0.02em] text-[color:var(--color-encre)]">
                Sablia
              </span>
            </div>
            <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-[color:var(--color-encre-70)]">
              Cabinet d'automatisation pour PME françaises. Diagnostic, implémentation et
              formation, livrés en France.
            </p>
          </div>

          <nav
            className="col-span-6 md:col-span-2"
            aria-label="Ressources"
          >
            <p className="eyebrow mb-4">Ressources</p>
            <ul className="flex flex-col gap-2 text-[0.95rem]">
              <li>
                <Link
                  href="/faq"
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/cas-clients"
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  Cas clients
                </Link>
              </li>
              <li>
                <Link
                  href="/roi"
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  Calculateur ROI
                </Link>
              </li>
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-3">
            <p className="eyebrow mb-4">Contact</p>
            <ul className="flex flex-col gap-2 text-[0.95rem]">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[color:var(--color-encre)] underline decoration-[color:var(--color-tuile)] decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  {site.email}
                </a>
              </li>
              <li className="text-[color:var(--color-encre-70)]">France</li>
              <li>
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  Réserver un appel →
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="eyebrow mb-4">Mentions</p>
            <ul className="flex flex-col gap-2 text-[0.95rem]">
              <li>
                <Link
                  href={site.legalUrl}
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href={site.privacyUrl}
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href={site.cgvUrl}
                  className="text-[color:var(--color-encre-70)] transition-colors hover:text-[color:var(--color-tuile)]"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-encre)]/15 pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[0.75rem] tracking-[-0.01em] text-[color:var(--color-encre-50)]">
            © {site.year} Sablia · {site.domain} · Tous droits réservés.
          </p>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[color:var(--color-encre-50)]">
            Fait à la main, à la machine.
          </p>
        </div>
      </div>
    </footer>
  )
}
