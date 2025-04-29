import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

// SVG inline du tableau de bord
const DashboardSvg = () => (
  <svg 
    className="w-full h-auto max-w-md drop-shadow-xl" 
    viewBox="0 0 480 320" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fond du dashboard */}
    <rect width="480" height="320" rx="16" fill="#1F2937" />
    
    {/* Header */}
    <rect x="20" y="20" width="440" height="40" rx="8" fill="#374151" />
    <circle cx="40" cy="40" r="8" fill="#10B981" />
    <rect x="60" y="36" width="120" height="8" rx="4" fill="#6B7280" />
    <rect x="360" y="36" width="80" height="8" rx="4" fill="#6B7280" />
    
    {/* Graphique principal */}
    <rect x="20" y="80" width="280" height="160" rx="8" fill="#374151" />
    <polyline points="40,200 80,180 120,190 160,150 200,120 240,100 280,90" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
    <polyline points="40,200 80,160 120,170 160,140 200,130 240,120 280,110" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
    
    {/* Légendes */}
    <rect x="40" y="220" width="40" height="4" rx="2" fill="#8B5CF6" />
    <rect x="90" y="220" width="60" height="4" rx="2" fill="#6B7280" />
    <rect x="160" y="220" width="40" height="4" rx="2" fill="#10B981" />
    <rect x="210" y="220" width="60" height="4" rx="2" fill="#6B7280" />
    
    {/* Statistiques à droite */}
    <rect x="320" y="80" width="140" height="70" rx="8" fill="#374151" />
    <rect x="340" y="100" width="80" height="8" rx="4" fill="#6B7280" />
    <rect x="340" y="120" width="100" height="10" rx="5" fill="#10B981" />
    
    <rect x="320" y="170" width="140" height="70" rx="8" fill="#374151" />
    <rect x="340" y="190" width="80" height="8" rx="4" fill="#6B7280" />
    <rect x="340" y="210" width="100" height="10" rx="5" fill="#EC4899" />
  </svg>
);

// Badge "Nouveau"
const NewBadge = () => (
  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
    Nouveau !
  </div>
);

export default function RoiBanner() {
  return (
    <section id="roi-banner" className="py-16 bg-gradient-to-r from-gray-100 to-gray-200 relative overflow-hidden">
      {/* Overlay léger violet */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Colonne de texte */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
              Calculez votre retour sur investissement en 60 secondes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Découvrez instantanément combien vos automatisations vont vous rapporter chaque mois et à quelle date vous atteignez le seuil de rentabilité.
            </p>
            
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link href="/roi">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 min-h-[44px] rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  aria-label="Calculer votre retour sur investissement"
                >
                  Je calcule mon ROI <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              <p className="text-sm text-gray-500">Aucune donnée sensible requise – résultat immédiat</p>
            </div>
          </div>
          
          {/* Colonne avec tableau de bord */}
          <div className="relative">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <DashboardSvg />
              <NewBadge />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant CTA pour le bas de page
export function RoiCta() {
  return (
    <section className="py-12 bg-gray-800 text-center">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
          Prêt à calculer votre retour sur investissement ?
        </h3>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Utilisez notre calculateur intuitif et découvrez en quelques clics la rentabilité de vos projets d'automatisation.
        </p>
        <Link href="/roi">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 min-h-[44px] rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
            aria-label="Calculer votre retour sur investissement"
          >
            Je calcule mon ROI <ArrowRight className="h-5 w-5" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}