import { Link } from 'wouter'

export default function Footer() {
  return (
    <footer className="border-t border-sablia-border bg-sablia-surface">
      <div className="container py-12 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Sablia" className="h-6 w-auto" />
              <h3 className="text-base font-semibold text-sablia-text">Sablia</h3>
            </div>
            <p className="text-sm text-sablia-text-secondary leading-relaxed">
              Solutions d'automatisation intelligentes pour votre entreprise
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-sablia-text">Ressources</h3>
            <Link
              href="/faq"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block mb-2 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/cas-clients"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block mb-2 transition-colors"
            >
              Cas clients
            </Link>
            <Link
              href="/roi"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block transition-colors"
            >
              Calculateur ROI
            </Link>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-sablia-text">Contact</h3>
            <a
              href="mailto:brice@sablia.io"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block transition-colors"
            >
              brice@sablia.io
            </a>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 text-sablia-text">Légal</h3>
            <Link
              href="/mentions-legales"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block mb-2 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block mb-2 transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              href="/cgv"
              className="text-sm text-sablia-text-secondary hover:text-sablia-text block transition-colors"
            >
              CGV
            </Link>
          </div>
        </div>
        <div className="border-t border-sablia-border mt-8 pt-8 text-center">
          <p className="text-sm text-sablia-text-tertiary">
            &copy; {new Date().getFullYear()} Sablia. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
