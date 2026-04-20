import { motion } from 'framer-motion'

export default function ProblemSection() {
  return (
    <section className="py-24 bg-sablia-bg">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text mb-6">
            Vos équipes perdent du temps sur du manuel.
          </h2>
          <p className="text-lg text-sablia-text-secondary leading-relaxed">
            Extraction de données, relances clients, reporting, saisie multi-outils. Vos équipes
            savent que ces tâches devraient être automatisées, mais chaque nouveau projet pose deux
            questions concrètes&nbsp;: est-ce que ça en vaut le coup&nbsp;? Et par où
            commencer&nbsp;? Les bonnes réponses ne sont jamais les mêmes d'une PME à l'autre.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
