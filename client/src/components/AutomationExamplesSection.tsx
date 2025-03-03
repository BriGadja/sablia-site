import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { 
  Users, 
  FileText, 
  Mail, 
  FileCheck, 
  FolderGit2,
  MessageCircle
} from "lucide-react";

const examples = [
  {
    id: 1,
    title: "🤖 Chatbot FAQ & Support Client Automatisé",
    subtitle: "Assistance instantanée 24/7 pour une expérience client fluide",
    features: [
      "Réponses automatisées aux questions fréquentes grâce à l'IA",
      "Intégration multi-canaux (site web, Messenger, WhatsApp)",
      "Escalade intelligente vers un conseiller pour les cas complexes"
    ],
    quote: "Le compagnon digital qui répond à vos clients, même quand vous dormez.",
    gain: "Réduisez vos coûts de support de 60% en 3 mois",
    icon: MessageCircle
  },
  {
    id: 2,
    title: "🧠 Votre propre assistant personnel",
      subtitle: "Un collaborateur virtuel disponible 24/7",
      features: [
        "Envoi et gestion automatisés de vos emails professionnels",
        "Organisation et planification intelligente de vos réunions",
        "Multitâche avancé pour libérer votre temps et votre esprit"
      ],
      quote: "L'assistant qui ne prend jamais de congés et s'adapte parfaitement à vos besoins.",
      gain: "Récupérez 15h de productivité par semaine dès le premier mois",
    icon: Mail
  },
  {
    id: 3,
    title: "🎯 Onboarding client automatisé",
    subtitle: "Pour freelances/agences qui scalent",
    features: [
      "Dossier Google Drive/Notion généré automatiquement",
      "Checklist tâches (Asana, ClickUp, Trello)",
      "Email de bienvenue avec accès client"
    ],
    quote: "L'organisation d'une entreprise structurée… sans embaucher un assistant.",
    gain: "Diminuez de 80% le temps d'intégration client en 2 semaines",
    icon: FolderGit2
  },
  {
    id: 4,
    title: "⚡ Devis pros en 2 minutes chrono",
    subtitle: "Pour commerciaux qui détestent l'admin",
    features: [
      "Conversion automatique réunion → PDF professionnel",
      "Intégration logo/normes de votre entreprise",
      "Envoi tracker avec signature électronique"
    ],
    quote: "Vos propositions commerciales passent du 'brouillon' à 'signé' en un clic.",
    gain: "Automatisez la phase de rédaction de devis et de contrats et gagnez jusqu'à 2 heures d'admin par client",
    icon: FileCheck
  },
  {
    id: 5,
    title: "📄 Génération de documents templatés",
    subtitle: "Automatisation intelligente de vos documents",
    features: [
      "Création de documents à partir de formulaires ou conversations chatbot",
      "Transformation automatique de CV au format de votre entreprise",
      "Templates personnalisables pour tout type de document professionnel"
    ],
    quote: "Votre usine à documents professionnels qui fonctionne pendant que vous vous concentrez sur l'essentiel.",
    gain: "Économisez 90% du temps de production documentaire en 1 mois",
    icon: FileText
  },
  {
    id: 6,
    title: "🎥 Générateur de contenu 2.0",
    subtitle: "Pour agences marketing et créateurs pressés",
    features: [
      "Scan automatique des tendances YouTube/Instagram",
      "Réécriture sur-mesure (ton, longueur, mots-clés)",
      "Programmation sur tous vos canaux en 1 clic"
    ],
    quote: "Votre usine à contenu personnalisé, même sans rédacteur.",
    gain: "Produisez 5x plus de contenu avec le même budget en 30 jours",
    icon: FileText
  }
];

export const AutomationExamplesSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="section-title">
          Exemples d'Automatisations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <div className="flex items-start gap-4 mb-4">
                    <div className="rounded-full bg-gray-700 p-3 flex-shrink-0">
                      <Icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{example.title}</h3>
                      <p className="text-gray-400 text-sm">{example.subtitle}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {example.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-400 italic border-l-2 border-orange-500 pl-4">
                    {example.quote}
                  </p>
                  {example.gain && <p className="text-gray-400 mt-2">{example.gain}</p>}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};