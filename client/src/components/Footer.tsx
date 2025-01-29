export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AutomatePro</h3>
            <p className="text-gray-600">
              Solutions d'automatisation intelligentes pour votre entreprise
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 block mb-2"
            >
              Prendre rendez-vous
            </a>
            <a
              href="mailto:contact@automatepro.com"
              className="text-gray-600 hover:text-gray-900 block"
            >
              contact@automatepro.com
            </a>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <a href="#" className="text-gray-600 hover:text-gray-900 block mb-2">
              Mentions légales
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 block mb-2">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 block">
              CGV
            </a>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AutomatePro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
