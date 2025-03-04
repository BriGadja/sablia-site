import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Workflow, Bot, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Workflow,
    title: "Automatisation de workflows",
    description: "Libérez votre équipe des tâches répétitives !",
    benefits: [
      "Gain de temps jusqu'à 70%",
      "Zéro erreur humaine",
      "Suivi en temps réel"
    ],
    details: "Transformez vos processus manuels en flux automatisés et intelligents. Fini les saisies interminables et les étapes oubliées !",
    primary: true
  },
  {
    icon: Bot,
    title: "Chatbots intelligents",
    description: "Un assistant virtuel disponible 24/7",
    benefits: [
      "Réponse instantanée",
      "Qualification des leads",
      "Support client continu"
    ],
    details: "Des chatbots qui comprennent vraiment vos clients. Pas de réponses robotiques, mais un vrai dialogue intelligent.",
    primary: false
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-900">
      <div className="container">
        <h2 className="section-title">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              className="h-full"
            >
              <Card 
                className={`h-full border-primary/20 shadow-lg transform transition-all duration-300 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/80 ${
                  service.primary ? 'hover:border-orange-500/50' : 'hover:border-blue-500/50'
                }`}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    service.primary 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-3 text-white">
                    {service.title}
                  </h3>
                  <p className={`text-xl font-semibold mb-4 ${
                    service.primary ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {service.description}
                  </p>
                  <p className="text-gray-300 mb-6">
                    {service.details}
                  </p>
                  <div className="space-y-3">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-200">
                        <CheckCircle2 className={`h-5 w-5 ${
                          service.primary ? 'text-orange-500' : 'text-blue-500'
                        }`} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}