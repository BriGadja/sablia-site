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
    primary: true,
    bgImage: "/workflow-automation-bg.jpg"
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
    primary: false,
    bgImage: "/chatbot-ai-bg.jpg"
  }
];

// Component
export default function ServicesSection() {
  return (
    <section 
      id="services" 
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 relative"
    >
      <div className="container">
        <h2 className="section-title text-center text-4xl font-bold text-white mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nos Services
          </motion.span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                z: 50
              }}
              className="h-full perspective-1000"
            >
              <Card 
                className={`h-full border-2 shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm ${
                  service.primary ? 'hover:border-orange-500' : 'hover:border-blue-500'
                } relative group overflow-hidden rounded-xl`}
                style={{
                  backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.95)), url(${service.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <motion.div 
                  className={`absolute inset-0 ${
                    service.primary 
                      ? 'bg-gradient-to-r from-orange-500/10 to-orange-600/10' 
                      : 'bg-gradient-to-r from-blue-500/10 to-blue-600/10'
                  } opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  whileHover={{ scale: 1.1 }}
                />
                <CardContent className="p-8 relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      service.primary 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold mb-3 text-white"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {service.title}
                  </motion.h3>
                  <p className={`text-xl font-semibold mb-4 ${
                    service.primary ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {service.description}
                  </p>
                  <p className="text-gray-300 mb-6">{service.details}</p>
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {service.benefits.map((benefit, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-3 text-gray-200"
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 10 }}
                      >
                        <CheckCircle2 className={`h-5 w-5 ${
                          service.primary ? 'text-orange-500' : 'text-blue-500'
                        }`} />
                        <span className="text-lg">{benefit}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}