import { Card, CardContent } from "./ui/card";
import { Bot, Workflow, Phone } from "lucide-react";

const services = [
  {
    icon: Workflow,
    title: "Automatisation de workflows",
    description: "Optimisez vos processus métier et gagnez un temps précieux",
    primary: true
  },
  {
    icon: Bot,
    title: "Chatbots intelligents",
    description: "Service client 24/7 et qualification de leads automatisée"
  },
  {
    icon: Phone,
    title: "Assistants vocaux",
    description: "Communication naturelle et traitement automatisé des appels"
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16">
      <div className="container">
        <h2 className="section-title">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className={`${
                service.primary 
                  ? 'border-primary shadow-lg transform hover:-translate-y-1'
                  : 'hover:shadow-md'
              } transition-all duration-300 bg-gray-800 border-gray-700`}
            >
              <CardContent className="p-6">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mb-4
                  ${service.primary ? 'bg-primary text-white' : 'bg-gray-700'}
                `}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  service.primary ? 'text-primary' : 'text-gray-100'
                }`}>
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}