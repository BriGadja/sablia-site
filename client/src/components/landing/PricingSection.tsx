import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";

/**
 * PricingSection - 3-column pricing grid with equal presentation
 *
 * Features:
 * - 3 columns: Audit & Consulting (3 offers), Formations (3 offers), Solutions d'automatisation (3 offers)
 * - Glassmorphism cards with hover effects (border glow on hover)
 * - Staggered reveal animation (0.1s delay between columns)
 * - Magnetic CTAs with smooth scrolling to #contact
 * - Responsive: stack vertically on mobile
 * - All columns have equal visual weight (no highlight)
 */

// ============================================
// TypeScript Interfaces
// ============================================

interface PricingOffer {
  name: string;
  price: string;
  duration?: string;
  description: string;
  features: string[];
  roi?: string; // Optional ROI callout for high-value offers
}

interface PricingColumn {
  id: string;
  title: string;
  subtitle: string;
  offers: PricingOffer[];
  highlight?: boolean; // true for Formations column
  ctaPrimary: {
    text: string;
    url: string;
  };
}

// ============================================
// Pricing Data (Official Tariff Grid)
// ============================================

const pricingColumns: PricingColumn[] = [
  {
    id: "audit",
    title: "Audit & Consulting",
    subtitle: "Comprendre et qualifier vos besoins",
    offers: [
      {
        name: "Appel Découverte",
        price: "GRATUIT",
        duration: "30 min",
        description: "Visio de qualification pour comprendre vos besoins",
        features: ["Échange personnalisé", "Sans engagement", "Premiers conseils"],
      },
      {
        name: "Audit Express",
        price: "350€",
        duration: "1h30",
        description: "Session stratégique avec recommandations actionnables",
        features: [
          "30 min cadrage + 1h stratégie",
          "Livrable 5-10 pages",
          "Regard expert immédiat",
        ],
      },
      {
        name: "Audit Complet",
        price: "2 000-5 000€",
        duration: "1-2 semaines",
        description:
          "Audit approfondi adapté à la taille de votre entreprise et au nombre de départements",
        features: [
          "Analyse approfondie multi-départements",
          "Roadmap détaillée avec priorités",
          "Workshop avec stakeholders",
        ],
      },
    ],
    ctaPrimary: { text: "Réserver un appel", url: "#contact" },
  },
  {
    id: "formations",
    title: "Formations",
    subtitle: "Devenez autonomes sur vos automatisations",
    offers: [
      {
        name: "Formation Demi-Journée",
        price: "700€",
        duration: "3h30",
        description: "IA générative, automatisation basics, découverte n8n",
        features: ["Intra-entreprise", "Jusqu'à 10 participants"],
      },
      {
        name: "Formation 1 Jour",
        price: "1 200€",
        duration: "7h",
        description: "IA/automatisation standard, n8n débutant",
        features: ["Cas pratiques inclus", "Support 1 mois post-formation"],
      },
      {
        name: "Formation 2-3 Jours",
        price: "2 200-3 300€",
        duration: "14-21h",
        description: "n8n avancé + certification équipe complète",
        features: ["Formation intensive", "Certification", "Documentation complète"],
      },
    ],
    ctaPrimary: { text: "Voir les formations", url: "#contact" },
  },
  {
    id: "solutions",
    title: "Solutions d'automatisation",
    subtitle: "Développement et déploiement de workflows",
    offers: [
      {
        name: "Workflow Simple",
        price: "2 500-5 000€",
        duration: "3-7 jours",
        description: "1-2 processus automatisés",
        features: ["Conception + développement", "Documentation", "2 semaines support"],
      },
      {
        name: "Système Standard",
        price: "8 000-18 000€",
        duration: "2-4 semaines",
        description: "3-5 processus interconnectés",
        features: ["Architecture complète", "Formation 1 jour", "1 mois support"],
      },
      {
        name: "Transformation Complète",
        price: "25 000-60 000€",
        duration: "6-12 semaines",
        description: "5+ processus multi-départements",
        features: ["Audit préalable inclus", "Formation 2-3 jours", "3 mois support"],
        roi: "ROI année 1 : 50 000-150 000€",
      },
    ],
    ctaPrimary: { text: "Démarrer un projet", url: "#contact" },
  },
];

// ============================================
// OfferItem Sub-Component
// ============================================

function OfferItem({ offer }: { offer: PricingOffer }) {
  return (
    <div className="border-t border-v2-cyan/20 pt-4">
      {/* Name + Price */}
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-semibold text-v2-white text-lg">{offer.name}</h4>
        <span className="text-v2-cyan font-bold text-xl">{offer.price}</span>
      </div>

      {/* Duration */}
      {offer.duration && <p className="text-v2-off-white/50 text-sm mb-2">{offer.duration}</p>}

      {/* Description */}
      <p className="text-v2-off-white/80 text-sm mb-3">{offer.description}</p>

      {/* Features List */}
      <ul className="space-y-2">
        {offer.features.map((feature, fIdx) => (
          <li key={fIdx} className="flex items-start gap-2 text-v2-off-white/80 text-sm">
            <Check size={16} className="text-v2-cyan mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Optional ROI Callout */}
      {offer.roi && <p className="text-v2-cyan text-sm font-semibold mt-3">{offer.roi}</p>}
    </div>
  );
}

// ============================================
// PricingCard Sub-Component
// ============================================

function PricingCard({ column, index }: { column: PricingColumn; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="
        relative flex flex-col
        bg-v2-charcoal/30 backdrop-blur-md
        rounded-2xl p-8
        border border-v2-cyan/30
        hover:scale-[1.02] hover:border-v2-cyan/50 transition-all duration-300
      "
    >
      {/* Column Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-2">{column.title}</h3>
        <p className="text-v2-off-white/70 text-base sm:text-lg">{column.subtitle}</p>
      </div>

      {/* Offers List */}
      <div className="space-y-6 mb-8 flex-1">
        {column.offers.map((offer, idx) => (
          <OfferItem key={idx} offer={offer} />
        ))}
      </div>

      {/* CTA Button */}
      <MagneticButton
        strength={0.2}
        className="
          w-full py-4 rounded-lg font-semibold
          transition-colors duration-300
          bg-v2-charcoal/50 text-v2-white border border-v2-cyan
          hover:bg-v2-cyan hover:text-v2-navy
        "
        onClick={() => {
          const target = document.querySelector(column.ctaPrimary.url);
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {column.ctaPrimary.text}
      </MagneticButton>
    </motion.div>
  );
}

// ============================================
// Service Schema (JSON-LD) for rich snippets
// ============================================

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": {
    "@type": "Organization",
    "name": "Sablia",
    "url": "https://sablia.io",
  },
  "serviceType": "Business Automation Consulting",
  "areaServed": {
    "@type": "Country",
    "name": "France",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Services d'automatisation Sablia",
    "itemListElement": [
      {
        "@type": "OfferCatalog",
        "name": "Audit & Consulting",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Appel Découverte",
              "description": "Visio de qualification pour comprendre vos besoins (30 min)",
            },
            "price": "0",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Audit Express",
              "description": "Session stratégique avec recommandations actionnables (1h30)",
            },
            "price": "350",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Audit Complet",
              "description": "Audit approfondi adapté à la taille de votre entreprise (1-2 semaines)",
            },
            "priceRange": "2000-5000",
            "priceCurrency": "EUR",
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        "name": "Formations",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Formation Demi-Journée",
              "description": "IA générative, automatisation basics, découverte n8n (3h30)",
            },
            "price": "700",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Formation 1 Jour",
              "description": "IA/automatisation standard, n8n débutant (7h)",
            },
            "price": "1200",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Formation 2-3 Jours",
              "description": "n8n avancé + certification équipe complète (14-21h)",
            },
            "priceRange": "2200-3300",
            "priceCurrency": "EUR",
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        "name": "Solutions d'automatisation",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Workflow Simple",
              "description": "1-2 processus automatisés (3-7 jours)",
            },
            "priceRange": "2500-5000",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Système Standard",
              "description": "3-5 processus interconnectés (2-4 semaines)",
            },
            "priceRange": "8000-18000",
            "priceCurrency": "EUR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Transformation Complète",
              "description": "5+ processus multi-départements (6-12 semaines)",
            },
            "priceRange": "25000-60000",
            "priceCurrency": "EUR",
          },
        ],
      },
    ],
  },
};

// ============================================
// Main PricingSection Component
// ============================================

export default function PricingSection() {
  return (
    <>
      {/* Service Schema JSON-LD */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            Nos offres
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Des solutions adaptées à chaque étape de votre transformation
          </p>
        </ScrollReveal>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingColumns.map((column, colIndex) => (
            <PricingCard key={column.id} column={column} index={colIndex} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
