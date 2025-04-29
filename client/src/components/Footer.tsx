
export default function Footer() {
  return (
    <footer className="bg-gray-800" style={{ backgroundColor: '#1a202c' }}>
      <div className="container py-12 mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Sablia</h3>
            <p className="text-gray-300">
              Solutions d'automatisation intelligentes pour votre entreprise
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Contact</h3>
            <a
              href="mailto:brice@sablia.io"
              className="text-gray-300 hover:text-white block"
            >
              brice@sablia.io
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">Légal</h3>
            <a href="#" className="text-gray-300 hover:text-white block mb-2">
              Mentions légales
            </a>
            <a href="#" className="text-gray-300 hover:text-white block mb-2">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-300 hover:text-white block">
              CGV
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Sablia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
