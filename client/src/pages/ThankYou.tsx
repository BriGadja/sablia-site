import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Home } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { trackConversion } from '@/lib/analytics'

function useSearchParams() {
  const params = new URLSearchParams(window.location.search)
  return params
}

const sourceConfig = {
  contact: {
    title: 'Message envoye !',
    description: 'Merci pour votre message. Nous vous repondrons dans les 24 heures.',
    conversionType: 'contact_form' as const,
  },
  gap: {
    title: 'Formulaire envoye !',
    description:
      "Merci ! Vous recevrez vos recommandations d'automatisations personnalisees par email sous 24h.",
    conversionType: 'gap_form' as const,
  },
  diagnostic: {
    title: 'Demande de diagnostic enregistree !',
    description:
      "Merci ! Vous allez recevoir un email avec le lien de paiement (490\u20ac HT) et le questionnaire d'intake. Premier echange sous 48h.",
    conversionType: 'diagnostic_form' as const,
  },
  default: {
    title: 'Merci !',
    description: 'Votre demande a bien ete prise en compte.',
    conversionType: 'contact_form' as const,
  },
}

export default function ThankYou() {
  const params = useSearchParams()
  const source = params.get('source')
  const config = sourceConfig[source as keyof typeof sourceConfig] ?? sourceConfig.default
  const hasFired = useRef(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!hasFired.current) {
      hasFired.current = true
      trackConversion(config.conversionType)
    }
  }, [config.conversionType])

  return (
    <>
      <SEO page="/thank-you" />
      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Navigation />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CheckCircle size={64} className="text-tuile mx-auto mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-encre mb-4">{config.title}</h1>
              <p className="text-lg text-encre-70 mb-10">{config.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-sable border border-encre/10 rounded-lg p-8 mb-8"
            >
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <Calendar size={20} className="text-tuile" />
                <h2 className="text-xl font-semibold text-encre">Prochaine etape</h2>
              </div>
              <p className="text-encre-70 mb-6">
                Reservez un appel decouverte gratuit de 30 minutes pour discuter de vos besoins
                d'automatisation.
              </p>
              <a
                href="https://calendly.com/brice-gachadoat/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-tuile text-white px-6 py-3 rounded-md font-medium hover:bg-tuile-dark transition-colors"
              >
                <Calendar size={18} />
                Reserver un appel
              </a>
            </motion.div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-encre-70 hover:text-encre transition-colors"
            >
              <Home size={16} />
              Retour a l'accueil
            </Link>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </motion.div>
    </>
  )
}
