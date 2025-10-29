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
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff8a4c' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  },
  {
    icon: Bot,
    title: "Agents IA personnalisés",
    description: "Des assistants intelligents qui automatisent vos tâches et améliorent votre productivité.",
    benefits: [
      "Disponible 24/7",
      "Traitement automatique",
      "Gain de productivité"
    ],
    details: "Des agents IA qui comprennent vos besoins et s'adaptent à vos processus métier.",
    primary: false,
    pattern: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  }
];

export default function ServicesSection() {
  return (
    <section 
      id="services" 
      className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
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
                className={`h-full border-0 shadow-2xl transition-all duration-300 bg-gray-900 ${
                  service.primary ? 'hover:shadow-orange-500/20' : 'hover:shadow-blue-500/20'
                } relative group overflow-hidden rounded-xl`}
                style={{
                  backgroundImage: service.pattern,
                  backgroundSize: '200%',
                  backgroundPosition: 'center',
                  boxShadow: service.primary 
                    ? '0 0 40px -10px rgba(255, 138, 76, 0.2)' 
                    : '0 0 40px -10px rgba(66, 153, 225, 0.2)'
                }}
              >
                <motion.div 
                  className={`absolute inset-0 ${
                    service.primary 
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20' 
                      : 'bg-gradient-to-r from-blue-500/20 to-blue-600/20'
                  } opacity-0 group-hover:opacity-100 transition-all duration-500`}
                  whileHover={{ scale: 1.1 }}
                />
                <CardContent className="p-8 relative z-10">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      service.primary 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    } shadow-lg ring-2 ring-offset-2 ring-offset-gray-900 ${
                      service.primary ? 'ring-orange-500/50' : 'ring-blue-500/50'
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