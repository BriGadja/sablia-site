import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

function scrollToDiagnosticForm() {
  const el = document.querySelector('#diagnostic-form')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function FooterCTABand() {
  return (
    <section className="py-24 bg-sablia-text text-sablia-bg">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-semibold mb-4">
            Prêt à voir ce qui est automatisable ?
          </h2>
          <p className="text-base lg:text-lg text-sablia-bg/80 mb-8">
            Cinq jours, un PDF, une recommandation claire. Si le diagnostic conclut que l'IA n'a pas
            sa place chez vous, c'est dit aussi.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={scrollToDiagnosticForm}
              className="inline-flex items-center gap-2 bg-sablia-accent text-white px-8 py-3.5 rounded-md font-medium hover:bg-sablia-accent-hover transition-colors duration-200"
            >
              <Send size={18} />
              Démarrer mon diagnostic, 490€
            </button>
            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Réserver un créneau de discussion avec Brice sur Calendly"
              className="text-sm text-sablia-bg/80 underline underline-offset-4 hover:text-sablia-bg transition-colors"
            >
              Préférer en discuter d'abord →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
