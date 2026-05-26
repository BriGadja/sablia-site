import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Home } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'wouter'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import SEO from '@/components/SEO'

const sourceConfig = {
  contact: {
    title: 'Message envoyé !',
    description: 'Merci pour votre message. Nous vous répondrons dans les 24 heures.',
  },
  diagnostic: {
    title: 'Demande enregistrée !',
    description: 'Merci ! Nous vous recontactons sous 48h pour planifier votre call discovery.',
  },
  default: {
    title: 'Merci !',
    description: 'Votre demande a bien été prise en compte.',
  },
}

export default function ThankYou() {
  const params = new URLSearchParams(window.location.search)
  const source = params.get('source')
  const config = sourceConfig[source as keyof typeof sourceConfig] ?? sourceConfig.default

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/thank-you" />
      <motion.div
        className="min-h-screen bg-canvas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TopNav />
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle size={64} className="mx-auto mb-6 text-primary" />
              <h1 className="t-display-md mb-4 text-on-dark">{config.title}</h1>
              <p className="text-lg text-on-dark-body">{config.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-10 rounded-lg border border-hairline bg-surface-card p-8"
            >
              <div className="mb-3 flex items-center justify-center gap-2.5">
                <Calendar size={20} className="text-primary" />
                <h2 className="t-title-md">Prochaine étape</h2>
              </div>
              <p className="mb-6 text-on-dark-body">
                Réservez un call discovery gratuit de 45 minutes pour cartographier votre CRM et
                identifier les automatisations les plus rentables.
              </p>
              <a
                href="https://calendly.com/brice-gachadoat/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="t-button inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-on-primary transition-shadow hover:shadow-glow-coral"
              >
                <Calendar size={18} />
                Réserver un call
              </a>
            </motion.div>

            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-on-dark-muted transition-colors hover:text-on-dark"
            >
              <Home size={16} />
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <FooterSection />
      </motion.div>
    </>
  )
}
