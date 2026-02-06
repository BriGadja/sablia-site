import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900" style={{ backgroundColor: "#0f172a" }}>
      <div className="container py-12 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Sablia</h3>
            <p className="text-gray-300">
              Solutions d'automatisation intelligentes pour votre entreprise
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Ressources</h3>
            <Link href="/faq" className="text-gray-300 hover:text-white block mb-2">
              FAQ
            </Link>
            <Link href="/cas-clients" className="text-gray-300 hover:text-white block mb-2">
              Cas clients
            </Link>
            <Link href="/roi" className="text-gray-300 hover:text-white block">
              Calculateur ROI
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Contact</h3>
            <a href="mailto:brice@sablia.io" className="text-gray-300 hover:text-white block">
              brice@sablia.io
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Légal</h3>
            <Link href="/mentions-legales" className="text-gray-300 hover:text-white block mb-2">
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="text-gray-300 hover:text-white block mb-2"
            >
              Politique de confidentialité
            </Link>
            <Link href="/cgv" className="text-gray-300 hover:text-white block">
              CGV
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Sablia. Tous droits réservés.</p>
          <a
            href="https://github.com/BriGadja/sablia-site/blob/main/docs/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-400 inline-block mt-2"
          >
            📄 Documentation pour IA
          </a>
        </div>
      </div>
    </footer>
  );
}
