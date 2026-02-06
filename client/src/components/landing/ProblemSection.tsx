import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown } from "lucide-react";

interface Problem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const problems: Problem[] = [
  {
    id: 1,
    icon: <Clock size={32} className="text-sablia-accent" />,
    title: "Temps perdu sur tâches répétitives",
    description:
      "Vos équipes passent des heures sur des tâches manuelles qui pourraient être automatisées, au détriment de missions à plus forte valeur ajoutée.",
  },
  {
    id: 2,
    icon: <AlertTriangle size={32} className="text-sablia-accent" />,
    title: "Erreurs humaines coûteuses",
    description:
      "Les processus manuels génèrent des erreurs de saisie, des doublons et des oublis qui impactent votre professionnalisme et votre chiffre d'affaires.",
  },
  {
    id: 3,
    icon: <TrendingDown size={32} className="text-sablia-accent" />,
    title: "Croissance limitée par le manque d'outils",
    description:
      "Sans automatisation, votre capacité à scaler est limitée par les ressources humaines disponibles et les budgets contraints.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-sablia-text mb-3">
            Les défis de l'automatisation
          </h2>
          <p className="text-lg text-sablia-text-secondary text-center mb-16 max-w-2xl mx-auto">
            Vous reconnaissez-vous dans l'une de ces situations ?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white border border-gray-100 rounded-lg p-8 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
            >
              <div className="mb-5">{problem.icon}</div>
              <h3 className="text-xl font-semibold text-sablia-text mb-3">
                {problem.title}
              </h3>
              <p className="text-base text-sablia-text-secondary leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
