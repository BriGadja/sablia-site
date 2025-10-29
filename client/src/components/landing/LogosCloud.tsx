import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

/**
 * LogosCloud - Responsive grid of 12 integration logos with interactive HoverCards
 *
 * Features:
 * - 12 integration logos (automation, AI, productivity, communication, development)
 * - Interactive HoverCards with tool descriptions and use cases
 * - Responsive grid: 4 columns desktop → 3 tablet → 2 mobile
 * - White logos with opacity hover effect (60% → 100%)
 * - Staggered fade-in animation (0.08s delay per logo)
 * - ScrollReveal wrapper for section entry animation
 * - Scale effect on hover (1.05x)
 */

interface Integration {
  id: number;
  name: string;
  imageUrl: string;
  category: "automation" | "ai" | "productivity" | "communication" | "development";
  categoryLabel: string;
  description: string;
  useCase: string;
}

const integrations: Integration[] = [
  // Automation platforms (2)
  {
    id: 1,
    name: "n8n",
    imageUrl: "/logos/integrations/n8n.svg",
    category: "automation",
    categoryLabel: "Automatisation",
    description: "Plateforme d'automatisation no-code open-source avec +400 intégrations natives",
    useCase: "Synchronisation CRM → Sheets → Slack en temps réel",
  },
  {
    id: 2,
    name: "Make",
    imageUrl: "/logos/integrations/make.svg",
    category: "automation",
    categoryLabel: "Automatisation",
    description: "Automatisation visuelle pour connecter vos applications business sans coder",
    useCase: "Workflows complexes multi-étapes pour gestion de leads",
  },

  // AI platforms (4)
  {
    id: 3,
    name: "OpenAI",
    imageUrl: "/logos/integrations/openai.svg",
    category: "ai",
    categoryLabel: "Intelligence Artificielle",
    description: "IA générative pour automatiser création de contenu et analyses avancées",
    useCase: "Génération automatique de rapports et documentation",
  },
  {
    id: 4,
    name: "Anthropic",
    imageUrl: "/logos/integrations/anthropic.svg",
    category: "ai",
    categoryLabel: "Intelligence Artificielle",
    description: "Claude AI pour assistance intelligente et traitement de documents complexes",
    useCase: "Extraction de données depuis factures et contrats",
  },
  {
    id: 5,
    name: "Gemini",
    imageUrl: "/logos/integrations/googlegemini.svg",
    category: "ai",
    categoryLabel: "Intelligence Artificielle",
    description: "IA multimodale Google pour analyse de données et génération de contenu",
    useCase: "Analyse prédictive et insights business automatisés",
  },
  {
    id: 6,
    name: "Perplexity",
    imageUrl: "/logos/integrations/perplexity.svg",
    category: "ai",
    categoryLabel: "Intelligence Artificielle",
    description: "Recherche augmentée par IA pour veille concurrentielle et benchmarking",
    useCase: "Monitoring automatisé des tendances sectorielles",
  },

  // Productivity & Google ecosystem (3)
  {
    id: 7,
    name: "Google Sheets",
    imageUrl: "/logos/integrations/googlesheets.svg",
    category: "productivity",
    categoryLabel: "Productivité",
    description: "Tableurs collaboratifs pour centraliser et automatiser vos données business",
    useCase: "Dashboards KPI mis à jour en temps réel via API",
  },
  {
    id: 8,
    name: "Google Drive",
    imageUrl: "/logos/integrations/googledrive.svg",
    category: "productivity",
    categoryLabel: "Productivité",
    description: "Stockage cloud pour centraliser documents et automatiser partage/archivage",
    useCase: "Archivage automatique de devis et factures par projet",
  },
  {
    id: 9,
    name: "Notion",
    imageUrl: "/logos/integrations/notion.svg",
    category: "productivity",
    categoryLabel: "Productivité",
    description: "Base de connaissances collaborative pour documenter workflows et procédures",
    useCase: "Documentation automatique de processus et formations",
  },

  // Communication (1)
  {
    id: 10,
    name: "Slack",
    imageUrl: "/logos/integrations/slack.svg",
    category: "communication",
    categoryLabel: "Communication",
    description: "Hub de communication d'équipe avec notifications automatisées intelligentes",
    useCase: "Alertes temps réel sur nouveaux leads et deadlines",
  },

  // Development & Deployment (2)
  {
    id: 11,
    name: "GitHub",
    imageUrl: "/logos/integrations/github.svg",
    category: "development",
    categoryLabel: "Développement",
    description: "Gestion de versions et CI/CD pour déploiement automatisé de solutions",
    useCase: "Déploiement continu d'automatisations personnalisées",
  },
  {
    id: 12,
    name: "Vercel",
    imageUrl: "/logos/integrations/vercel.svg",
    category: "development",
    categoryLabel: "Développement",
    description: "Plateforme de déploiement serverless pour applications et outils web",
    useCase: "Hébergement de dashboards clients et interfaces sur-mesure",
  },
];

export default function LogosCloud() {
  return (
    <section id="logos" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl font-semibold text-v2-cyan uppercase tracking-wider mb-4"
            >
              Les outils que nous maîtrisons
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-v2-white"
            >
              Intégrations & Outils
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl text-v2-off-white/70 mt-4"
            >
              Automatisez vos workflows avec les outils que vous utilisez déjà
            </motion.p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex items-center justify-center"
              >
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer flex items-center justify-center"
                    >
                      <img
                        src={integration.imageUrl}
                        alt={`${integration.name} integration`}
                        title={integration.name}
                        className="h-12 lg:h-14 w-auto object-contain transition-all duration-300 opacity-60 hover:opacity-100"
                      />
                    </motion.div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-v2-navy/95 border border-v2-gray-700 backdrop-blur-sm p-4">
                    <div className="space-y-3">
                      {/* Category Badge */}
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-v2-cyan/10 text-v2-cyan border border-v2-cyan/20">
                        {integration.categoryLabel}
                      </div>

                      {/* Tool Name */}
                      <h3 className="text-lg font-semibold text-v2-white">
                        {integration.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-v2-gray-300 leading-relaxed">
                        {integration.description}
                      </p>

                      {/* Use Case */}
                      <div className="pt-2 border-t border-v2-gray-700/50">
                        <p className="text-xs text-v2-cyan/90 italic">
                          <span className="font-semibold not-italic">Exemple :</span>{" "}
                          {integration.useCase}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            ))}
          </div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-base sm:text-lg text-v2-off-white/50"
          >
            Et bien d'autres intégrations possibles
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
