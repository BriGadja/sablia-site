import { Clock, Wrench, CheckCircle, Rocket } from "lucide-react";

const steps = [
  {
    icon: Clock,
    title: "Appel découverte gratuit",
    description: "Comprendre vos besoins et objectifs"
  },
  {
    icon: Wrench,
    title: "Développement sur mesure",
    description: "Solutions adaptées à votre workflow"
  },
  {
    icon: CheckCircle,
    title: "Tests et ajustements",
    description: "Validation et optimisation"
  },
  {
    icon: Rocket,
    title: "Intégration finale",
    description: "Mise en production et formation"
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-16">
      <div className="container">
        <h2 className="section-title">Notre Processus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="section-divider" />
    </section>
  );
}
