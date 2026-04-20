import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export default function HeroSection() {
  const scrollToDiagnosticForm = () => {
    const element = document.querySelector('#diagnostic-form')
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-sablia-bg via-sablia-bg to-sablia-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_40%,_rgba(196,90,44,0.03),_transparent_70%)]" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-7"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-sablia-text-secondary"
          >
            Diagnostic Sablia · 490€ HT · 5 jours
          </motion.p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold leading-[1.1] tracking-tight text-sablia-text">
            Cinq jours. Un PDF. <span className="text-sablia-sienna">Une décision claire.</span>
          </h1>

          <p className="text-lg sm:text-xl text-sablia-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
            Le Diagnostic Sablia cartographie vos process, identifie les automatisations qui valent
            vraiment le coup, et signale celles à laisser de côté. 490€ HT, déduits de la première
            facture si vous signez ensuite un contrat Développement ou Accompagnement.
          </p>

          <div className="w-16 h-px bg-sablia-accent/20 mx-auto" />

          <div className="flex flex-col items-center gap-3 pt-1">
            <button
              type="button"
              onClick={scrollToDiagnosticForm}
              className="inline-flex items-center gap-2 bg-sablia-accent text-white px-8 py-3.5 rounded-md text-base font-medium hover:bg-sablia-accent-hover transition-colors duration-200 tracking-wide"
            >
              <Send size={18} />
              Démarrer mon diagnostic, 490€
            </button>

            <a
              href="https://calendly.com/brice-gachadoat/30min"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Réserver un créneau de discussion avec Brice sur Calendly"
              className="text-sm text-sablia-text-secondary underline underline-offset-4 hover:text-sablia-text transition-colors"
            >
              Préférer en discuter d'abord →
            </a>
          </div>

          <p className="text-sm text-sablia-text-tertiary pt-2 max-w-2xl mx-auto leading-relaxed">
            Brice Gachadoat — Responsable Pédagogique et Coach Développement IA chez{' '}
            <a
              href="https://www.iapreneurs.com/?affiliate_code=8b6eda"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-sablia-text-secondary transition-colors"
            >
              IAPreneurs
            </a>{' '}
            (500+ membres, 200k+ abonnés YouTube)
          </p>
        </motion.div>
      </div>
    </section>
  )
}
