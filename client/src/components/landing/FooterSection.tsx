import { Link } from 'wouter'

export default function FooterSection() {
  return (
    <footer className="border-t border-hairline bg-canvas px-8 pb-10 pt-16">
      <div className="mx-auto grid max-w-editorial gap-8 md:grid-cols-3 md:items-start">
        <div className="flex flex-col gap-3">
          <img src="/wordmark-dark.svg" alt="Sablia" className="h-7" />
          <p className="max-w-[280px] text-[13px] leading-relaxed text-on-dark-muted">
            Agence d'intégration AI. On connecte Claude à votre CRM, depuis Paris.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <span className="t-caption-uppercase text-on-dark-muted">Contact</span>
          <a href="mailto:contact@sablia.io" className="text-sm text-on-dark">
            contact@sablia.io
          </a>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Link
            href="/mentions-legales"
            className="text-[13px] text-on-dark-body no-underline hover:text-on-dark"
          >
            Mentions légales
          </Link>
          <Link
            href="/politique-confidentialite"
            className="text-[13px] text-on-dark-body no-underline hover:text-on-dark"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/cgv"
            className="text-[13px] text-on-dark-body no-underline hover:text-on-dark"
          >
            CGV
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-editorial items-center justify-between border-t border-hairline pt-6">
        <span className="text-xs text-on-dark-soft">© 2026 Sablia · Tous droits réservés</span>
      </div>
    </footer>
  )
}
