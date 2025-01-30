
import { Card, CardContent } from "./ui/card";
import { Bot, Workflow, Phone, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Workflow,
    title: "Automatisation de workflows",
    description: "Libérez votre équipe des tâches répétitives, concentrez-vous sur l'essentiel !",
    benefits: [
      "Gain de temps (jusqu'à 70% sur les tâches répétitives)",
      "Réduction des erreurs humaines",
      "Suivi en temps réel de chaque processus"
    ],
    details: "Notre solution transforme vos processus métier en flux automatisés et intelligents. Imaginez : plus de saisies manuelles interminables, de transferts de fichiers perdus ou d'étapes oubliées.",
    primary: true,
    fullWidth: true
  },
  {
    icon: Bot,
    title: "Chatbots intelligents",
    description: "Un assistant virtuel disponible 24h/24, même pour les questions complexes !",
    benefits: [
      "Réponse instantanée à 80% des demandes courantes",
      "Qualification automatique des leads",
      "Disponibilité jour et nuit, même les weekends"
    ],
    details: "Nos chatbots ne se contentent pas de réponses préenregistrées : ils comprennent le contexte, analysent les demandes et guident vos clients comme un humain le ferait."
  },
  {
    icon: Phone,
    title: "Assistants vocaux",
    description: "Une voix humaine et réactive pour gérer vos appels sans stress",
    benefits: [
      "Réduction de 50% du temps d'attente téléphonique",
      "Tri automatique des appels",
      "Transcription et analyse des conversations en temps réel"
    ],
    details: "Finis les standards téléphoniques figés ! Nos assistants vocaux utilisent l'IA pour écouter, comprendre et répondre de façon naturelle à vos appelants."
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-900">
      <div className="container">
        <h2 className="section-title">Nos Services</h2>
        <div className="grid grid-cols-1 gap-8">
          {/* First row - Full width automation */}
          <Card 
            className="border-primary/20 shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/80"
          >
            <CardContent className="p-8">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Workflow className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white">
                {services[0].title}
              </h3>
              <p className="text-xl text-orange-400 font-semibold mb-4">
                {services[0].description}
              </p>
              <p className="text-gray-300 mb-6 text-lg">
                {services[0].details}
              </p>
              <div className="space-y-3">
                {services[0].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-200">
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Second row - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.slice(1).map((service, index) => (
              <Card 
                key={index}
                className="border-gray-700/50 hover:border-orange-500/50 shadow-lg transform hover:-translate-y-1 transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/80"
              >
                <CardContent className="p-6">
                  <div className="bg-gray-700 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                    <service.icon className="h-7 w-7 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {service.title}
                  </h3>
                  <p className="text-orange-400 font-medium mb-3">
                    {service.description}
                  </p>
                  <p className="text-gray-300 mb-4 text-sm">
                    {service.details}
                  </p>
                  <div className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-200 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
