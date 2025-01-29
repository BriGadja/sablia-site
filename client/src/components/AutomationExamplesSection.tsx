import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { 
  Users, 
  FileText, 
  Mail, 
  FileCheck, 
  FolderGit2 
} from "lucide-react";

const examples = [
  {
    id: 1,
    title: "CRM spécifique à une industrie",
    description: "Un CRM préconfiguré pour un secteur donné (agences créatives, dentistes, avocats…). Permet aux entreprises d'être mieux organisées, suivre les leads et structurer leurs ventes.",
    icon: Users
  },
  {
    id: 2,
    title: "Système de production de contenu automatisé",
    description: "Scraping de contenu (YouTube, Twitter…), utilisation d'un LLM pour reformuler et générer du texte. Idéal pour les agences marketing ou les créateurs de contenu.",
    icon: FileText
  },
  {
    id: 3,
    title: "Système d'emailing à froid sans période de chauffe",
    description: "Achat de domaines préchauffés avec Instantly. Scraping et enrichissement des leads avec IA pour générer des emails ultra-personnalisés. Automatisation du suivi et notifications Slack/CRM pour les réponses positives.",
    icon: Mail
  },
  {
    id: 4,
    title: "Automatisation de génération de propositions commerciales",
    description: "Génère automatiquement des devis et propositions en PDF à partir d'un formulaire ou d'un résumé de réunion IA. Évite aux commerciaux de perdre du temps sur l'administratif.",
    icon: FileCheck
  },
  {
    id: 5,
    title: "Automatisation de l'onboarding des nouveaux clients",
    description: "Création automatique d'un dossier Google Drive, briefs, tâches sur un PM (ClickUp, Notion, Asana) dès qu'un paiement est reçu. Idéal pour les agences ou freelances gérant plusieurs projets.",
    icon: FolderGit2
  }
];

export const AutomationExamplesSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Exemples d'Automatisations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <motion.div
                key={example.id}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="p-6 h-full bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full bg-gray-700 p-3 w-12 h-12 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{example.title}</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{example.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};