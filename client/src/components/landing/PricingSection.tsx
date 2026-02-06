import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface PricingOffer {
  name: string;
  price: string;
  duration?: string;
  description: string;
  features: string[];
  roi?: string;
}

interface PricingColumn {
  id: string;
  title: string;
  subtitle: string;
  offers: PricingOffer[];
  ctaPrimary: { text: string; url: string };
}

const pricingColumns: PricingColumn[] = [
  {
    id: "audit",
    title: "Audit & Consulting",
    subtitle: "Comprendre et qualifier vos besoins",
    offers: [
      { name: "Appel Découverte", price: "GRATUIT", duration: "30 min", description: "Visio de qualification pour comprendre vos besoins", features: ["Échange personnalisé", "Sans engagement", "Premiers conseils"] },
      { name: "Audit Express", price: "350€", duration: "1h30", description: "Session stratégique avec recommandations actionnables", features: ["30 min cadrage + 1h stratégie", "Livrable 5-10 pages", "Regard expert immédiat"] },
      { name: "Audit Complet", price: "2 000-5 000€", duration: "1-2 semaines", description: "Audit approfondi adapté à la taille de votre entreprise et au nombre de départements", features: ["Analyse approfondie multi-départements", "Roadmap détaillée avec priorités", "Workshop avec stakeholders"] },
    ],
    ctaPrimary: { text: "Réserver un appel", url: "#contact" },
  },
  {
    id: "formations",
    title: "Formations",
    subtitle: "Devenez autonomes sur vos automatisations",
    offers: [
      { name: "Formation Demi-Journée", price: "700€", duration: "3h30", description: "IA générative, automatisation basics, découverte n8n", features: ["Intra-entreprise", "Jusqu'à 10 participants"] },
      { name: "Formation 1 Jour", price: "1 200€", duration: "7h", description: "IA/automatisation standard, n8n débutant", features: ["Cas pratiques inclus", "Support 1 mois post-formation"] },
      { name: "Formation 2-3 Jours", price: "2 200-3 300€", duration: "14-21h", description: "n8n avancé + certification équipe complète", features: ["Formation intensive", "Certification", "Documentation complète"] },
    ],
    ctaPrimary: { text: "Voir les formations", url: "#contact" },
  },
  {
    id: "solutions",
    title: "Solutions d'automatisation",
    subtitle: "Développement et déploiement de workflows",
    offers: [
      { name: "Workflow Simple", price: "2 500-5 000€", duration: "3-7 jours", description: "1-2 processus automatisés", features: ["Conception + développement", "Documentation", "2 semaines support"] },
      { name: "Système Standard", price: "8 000-18 000€", duration: "2-4 semaines", description: "3-5 processus interconnectés", features: ["Architecture complète", "Formation 1 jour", "1 mois support"] },
      { name: "Transformation Complète", price: "25 000-60 000€", duration: "6-12 semaines", description: "5+ processus multi-départements", features: ["Audit préalable inclus", "Formation 2-3 jours", "3 mois support"], roi: "ROI année 1 : 50 000-150 000€" },
    ],
    ctaPrimary: { text: "Démarrer un projet", url: "#contact" },
  },
];

function OfferItem({ offer }: { offer: PricingOffer }) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-semibold text-sablia-text text-base">{offer.name}</h4>
        <span className="text-sablia-accent font-bold text-lg">{offer.price}</span>
      </div>
      {offer.duration && <p className="text-sablia-text-tertiary text-sm mb-2">{offer.duration}</p>}
      <p className="text-sablia-text-secondary text-sm mb-3">{offer.description}</p>
      <ul className="space-y-1.5">
        {offer.features.map((feature, fIdx) => (
          <li key={fIdx} className="flex items-start gap-2 text-sablia-text-secondary text-sm">
            <Check size={14} className="text-sablia-accent mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {offer.roi && <p className="text-sablia-accent text-sm font-medium mt-3">{offer.roi}</p>}
    </div>
  );
}

function PricingCard({ column, index }: { column: PricingColumn; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex flex-col bg-white border border-gray-100 rounded-lg p-8 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-sablia-text mb-1">{column.title}</h3>
        <p className="text-sablia-text-secondary text-base">{column.subtitle}</p>
      </div>

      <div className="space-y-6 mb-8 flex-1">
        {column.offers.map((offer, idx) => (
          <OfferItem key={idx} offer={offer} />
        ))}
      </div>

      <button
        className="w-full py-3.5 rounded-md font-medium transition-colors duration-200 border border-gray-200 text-sablia-text hover:bg-gray-50"
        onClick={() => {
          const target = document.querySelector(column.ctaPrimary.url);
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {column.ctaPrimary.text}
      </button>
    </motion.div>
  );
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": {
    "@type": "Organization",
    "name": "Sablia",
    "url": "https://sablia.io",
    "address": { "@type": "PostalAddress", "streetAddress": "60 rue François 1er", "postalCode": "75008", "addressLocality": "Paris", "addressCountry": "FR" },
  },
  "serviceType": "Business Automation Consulting",
  "areaServed": { "@type": "Country", "name": "France" },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services d'automatisation Sablia",
    "itemListElement": [
      { "@type": "OfferCatalog", "name": "Audit & Consulting", "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appel Découverte", "description": "Visio de qualification pour comprendre vos besoins (30 min)" }, "price": "0", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Audit Express", "description": "Session stratégique avec recommandations actionnables (1h30)" }, "price": "350", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Audit Complet", "description": "Audit approfondi adapté à la taille de votre entreprise (1-2 semaines)" }, "priceRange": "2000-5000", "priceCurrency": "EUR" },
      ]},
      { "@type": "OfferCatalog", "name": "Formations", "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation Demi-Journée", "description": "IA générative, automatisation basics, découverte n8n (3h30)" }, "price": "700", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation 1 Jour", "description": "IA/automatisation standard, n8n débutant (7h)" }, "price": "1200", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Formation 2-3 Jours", "description": "n8n avancé + certification équipe complète (14-21h)" }, "priceRange": "2200-3300", "priceCurrency": "EUR" },
      ]},
      { "@type": "OfferCatalog", "name": "Solutions d'automatisation", "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Workflow Simple", "description": "1-2 processus automatisés (3-7 jours)" }, "priceRange": "2500-5000", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Système Standard", "description": "3-5 processus interconnectés (2-4 semaines)" }, "priceRange": "8000-18000", "priceCurrency": "EUR" },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Transformation Complète", "description": "5+ processus multi-départements (6-12 semaines)" }, "priceRange": "25000-60000", "priceCurrency": "EUR" },
      ]},
    ],
  },
};

export default function PricingSection() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      <section id="pricing" className="py-32 bg-sablia-surface">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-center text-sablia-text mb-3">
              Nos offres
            </h2>
            <p className="text-lg text-sablia-text-secondary text-center mb-16 max-w-2xl mx-auto">
              Des solutions adaptées à chaque étape de votre transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {pricingColumns.map((column, colIndex) => (
              <PricingCard key={column.id} column={column} index={colIndex} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
