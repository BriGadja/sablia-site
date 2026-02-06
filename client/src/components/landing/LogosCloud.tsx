import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  { id: 1, name: "n8n", imageUrl: "/logos/integrations/n8n.svg", category: "automation", categoryLabel: "Automatisation", description: "Notre plateforme de référence pour 90% de nos projets. Open-source, +400 intégrations natives, personnalisation illimitée et hébergement souverain possible.", useCase: "Workflows complexes multi-branches : CRM → IA → Sheets → Slack avec logique conditionnelle avancée" },
  { id: 2, name: "Make", imageUrl: "/logos/integrations/make.svg", category: "automation", categoryLabel: "Automatisation", description: "Automatisation visuelle pour connecter vos applications business sans coder", useCase: "Workflows complexes multi-étapes pour gestion de leads" },
  { id: 3, name: "OpenAI", imageUrl: "/logos/integrations/openai.svg", category: "ai", categoryLabel: "Intelligence Artificielle", description: "IA générative pour automatiser création de contenu et analyses avancées", useCase: "Génération automatique de rapports et documentation" },
  { id: 4, name: "Anthropic", imageUrl: "/logos/integrations/anthropic.svg", category: "ai", categoryLabel: "Intelligence Artificielle", description: "Claude AI pour assistance intelligente et traitement de documents complexes", useCase: "Extraction de données depuis factures et contrats" },
  { id: 5, name: "Gemini", imageUrl: "/logos/integrations/googlegemini.svg", category: "ai", categoryLabel: "Intelligence Artificielle", description: "IA multimodale Google pour analyse de données et génération de contenu", useCase: "Analyse prédictive et insights business automatisés" },
  { id: 6, name: "Perplexity", imageUrl: "/logos/integrations/perplexity.svg", category: "ai", categoryLabel: "Intelligence Artificielle", description: "Recherche augmentée par IA pour veille concurrentielle et benchmarking", useCase: "Monitoring automatisé des tendances sectorielles" },
  { id: 7, name: "Google Sheets", imageUrl: "/logos/integrations/googlesheets.svg", category: "productivity", categoryLabel: "Productivité", description: "Tableurs collaboratifs pour centraliser et automatiser vos données business", useCase: "Dashboards KPI mis à jour en temps réel via API" },
  { id: 8, name: "Google Drive", imageUrl: "/logos/integrations/googledrive.svg", category: "productivity", categoryLabel: "Productivité", description: "Stockage cloud pour centraliser documents et automatiser partage/archivage", useCase: "Archivage automatique de devis et factures par projet" },
  { id: 9, name: "Notion", imageUrl: "/logos/integrations/notion.svg", category: "productivity", categoryLabel: "Productivité", description: "Base de connaissances collaborative pour documenter workflows et procédures", useCase: "Documentation automatique de processus et formations" },
  { id: 10, name: "Slack", imageUrl: "/logos/integrations/slack.svg", category: "communication", categoryLabel: "Communication", description: "Hub de communication d'équipe avec notifications automatisées intelligentes", useCase: "Alertes temps réel sur nouveaux leads et deadlines" },
  { id: 11, name: "GitHub", imageUrl: "/logos/integrations/github.svg", category: "development", categoryLabel: "Développement", description: "Gestion de versions et CI/CD pour déploiement automatisé de solutions", useCase: "Déploiement continu d'automatisations personnalisées" },
  { id: 12, name: "Vercel", imageUrl: "/logos/integrations/vercel.svg", category: "development", categoryLabel: "Développement", description: "Plateforme de déploiement serverless pour applications et outils web", useCase: "Hébergement de dashboards clients et interfaces sur-mesure" },
];

export default function LogosCloud() {
  return (
    <section id="logos" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-sablia-accent uppercase tracking-wider mb-3"
          >
            Les outils que nous maîtrisons
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-3xl lg:text-4xl font-bold text-sablia-text"
          >
            Intégrations & Outils
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-lg text-sablia-text-secondary mt-3"
          >
            Automatisez vos workflows avec les outils que vous utilisez déjà
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {integrations.map((integration, index) => {
            const isN8n = integration.name === "n8n";

            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex flex-col items-center justify-center gap-2"
              >
                {isN8n && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-sablia-accent bg-sablia-accent/5 border border-sablia-accent/10">
                    Notre coeur de métier
                  </span>
                )}

                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div className="cursor-pointer flex items-center justify-center">
                      <img
                        src={integration.imageUrl}
                        alt={`${integration.name} integration`}
                        title={integration.name}
                        width={isN8n ? 80 : 56}
                        height={isN8n ? 80 : 56}
                        loading="lazy"
                        className={`${
                          isN8n ? "h-16 lg:h-20" : "h-12 lg:h-14"
                        } w-auto object-contain transition-opacity duration-200 opacity-50 hover:opacity-100`}
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side={index >= 8 ? "top" : "bottom"}
                    align="center"
                    className="w-80 bg-white border border-gray-200 p-4 shadow-lg"
                  >
                    <div className="space-y-2.5">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium uppercase tracking-wide text-sablia-accent bg-sablia-accent/5">
                        {integration.categoryLabel}
                      </div>
                      <h3 className="text-base font-semibold text-sablia-text">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-sablia-text-secondary leading-relaxed">
                        {integration.description}
                      </p>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-sablia-text-secondary">
                          <span className="font-semibold">Exemple :</span>{" "}
                          {integration.useCase}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-sm text-sablia-text-tertiary"
        >
          Et bien d'autres intégrations possibles
        </motion.p>
      </div>
    </section>
  );
}
