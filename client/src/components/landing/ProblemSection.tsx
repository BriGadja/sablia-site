import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Problem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const problems: Problem[] = [
  {
    id: 1,
    icon: <Clock size={48} className="text-v2-cyan" />,
    title: "Temps perdu sur tâches répétitives",
    description:
      "Vos équipes passent des heures sur des tâches manuelles qui pourraient être automatisées, au détriment de missions à plus forte valeur ajoutée.",
  },
  {
    id: 2,
    icon: <AlertTriangle size={48} className="text-v2-cyan" />,
    title: "Erreurs humaines coûteuses",
    description:
      "Les processus manuels génèrent des erreurs de saisie, des doublons et des oublis qui impactent votre professionnalisme et votre chiffre d'affaires.",
  },
  {
    id: 3,
    icon: <TrendingDown size={48} className="text-v2-cyan" />,
    title: "Croissance limitée par le manque d'outils",
    description:
      "Sans automatisation, votre capacité à scaler est limitée par les ressources humaines disponibles et les budgets contraints.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            Les défis de l'automatisation
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Vous reconnaissez-vous dans l'une de ces situations ?
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-v2-charcoal/30 backdrop-blur-md rounded-xl p-8 hover:bg-v2-charcoal/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-6">{problem.icon}</div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-v2-white mb-4">
                {problem.title}
              </h3>
              <p className="text-base sm:text-lg text-v2-off-white/80 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
