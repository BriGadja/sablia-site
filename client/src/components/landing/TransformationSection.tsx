import { motion } from 'framer-motion'
import { AlertTriangle, Clock, ShieldCheck, TrendingDown, TrendingUp, Zap } from 'lucide-react'

interface TransformRow {
  problem: { icon: React.ReactNode; text: string }
  solution: { icon: React.ReactNode; text: string }
}

const rows: TransformRow[] = [
  {
    problem: {
      icon: <Clock size={20} className="text-sablia-sienna flex-shrink-0" />,
      text: '2h par jour à copier des données entre Excel et votre CRM',
    },
    solution: {
      icon: <Zap size={20} className="text-sablia-accent flex-shrink-0" />,
      text: 'Zéro saisie manuelle. Vos outils se parlent automatiquement.',
    },
  },
  {
    problem: {
      icon: <AlertTriangle size={20} className="text-sablia-sienna flex-shrink-0" />,
      text: "Des erreurs de saisie qui coûtent des clients et du chiffre d'affaires",
    },
    solution: {
      icon: <ShieldCheck size={20} className="text-sablia-accent flex-shrink-0" />,
      text: "Zéro erreur. Chaque donnée vérifiée et traitée par l'IA.",
    },
  },
  {
    problem: {
      icon: <TrendingDown size={20} className="text-sablia-sienna flex-shrink-0" />,
      text: 'Impossible de scaler sans recruter — la charge explose',
    },
    solution: {
      icon: <TrendingUp size={20} className="text-sablia-accent flex-shrink-0" />,
      text: "Scalez sans recruter. L'automatisation absorbe la charge.",
    },
  },
]

export default function TransformationSection() {
  return (
    <section id="transformation" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-sablia-sienna mb-3">
            Le Syndrome du Copier-Coller
          </p>
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text mb-3">
            La transformation
          </h2>
          <p className="text-lg text-sablia-text-secondary max-w-2xl mx-auto">
            Vos problèmes d'aujourd'hui, nos solutions d'aujourd'hui
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-6">
          {rows.map((row, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center"
            >
              {/* Problem */}
              <div className="bg-sablia-surface border border-sablia-border rounded p-5 flex items-start gap-3">
                {row.problem.icon}
                <p className="text-sm text-sablia-text-secondary leading-relaxed">
                  {row.problem.text}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-sablia-sienna">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="md:hidden flex justify-center text-sablia-sienna">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>

              {/* Solution */}
              <div className="bg-sablia-bg border border-sablia-accent/15 rounded p-5 flex items-start gap-3">
                {row.solution.icon}
                <p className="text-sm text-sablia-text leading-relaxed font-medium">
                  {row.solution.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-sablia-accent text-sablia-bg px-8 py-3.5 rounded text-base font-medium hover:bg-sablia-accent-hover transition-colors duration-200"
          >
            Diagnostiquer mes processus
          </button>
        </motion.div>
      </div>
    </section>
  )
}
