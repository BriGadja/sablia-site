
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Workflow, Bot } from "lucide-react";

// Services
const services = [
  {
    icon: Workflow,
    title: "Automatisation de workflows",
    description: "Libérez votre équipe des tâches répétitives grâce à une automatisation efficace.",
    benefits: [
      "Gain de temps jusqu'à 70%",
      "Zéro erreur humaine",
      "Suivi en temps réel"
    ],
    details: "Transformez les processus manuels en flux automatisés.",
    primary: true
  },
  {
    icon: Bot,
    title: "Chatbots intelligents",
    description: "Un assistant virtuel disponible 24/7 pour améliorer votre service client.",
    benefits: [
      "Réponse instantanée",
      "Qualification des leads",
      "Support client amélioré"
    ],
    details: "Des chatbots qui comprennent vraiment vos clients, assurant un dialogue interactif.",
    primary: false
  }
  // Ajoutez d'autres services ici si nécessaire
];

// Component
export default function ServicesSection() {
  return (
    <section 
      id="services" 
      className="py-16 bg-gray-900 relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.95)), url(/services-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container">
        <h2 className="section-title text-center text-4xl font-bold text-white mb-8">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card 
                className={`h-full border-transparent shadow-lg transition-all duration-200 bg-gray-800/50 hover:bg-gray-800/80 ${
                  service.primary ? 'hover:border-orange-500' : 'hover:border-blue-500'
                } relative group overflow-hidden`}
              >
                <div className={`absolute inset-0 ${
                  service.primary 
                    ? 'bg-gradient-to-r from-orange-500/5 to-orange-600/5' 
                    : 'bg-gradient-to-r from-blue-500/5 to-blue-600/5'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 ${
                    service.primary 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:translate-x-1 transition-transform duration-300">
                    {service.title}
                  </h3>
                  <p className={`text-xl font-semibold mb-2 ${
                    service.primary ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {service.description}
                  </p>
                  <p className="text-gray-300 mb-6">{service.details}</p>
                  <div className="space-y-3 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
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
