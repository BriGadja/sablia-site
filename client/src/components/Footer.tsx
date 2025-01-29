
export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="container py-12">
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
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-md inline-block mb-2 transition-all duration-300"
            >
              Prendre rendez-vous
            </a>
            <a
              href="mailto:sablia.expertise@gmail.com"
              className="text-gray-300 hover:text-white block"
            >
              sablia.expertise@gmail.com
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
