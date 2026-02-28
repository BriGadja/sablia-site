import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '@/components/Footer'
import Navigation from '@/components/landing/Navigation'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'

// ============================================
// Person Schema (JSON-LD) for rich snippets
// ============================================

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Brice Gachadoat',
  url: 'https://sablia.io/about',
  image: 'https://sablia.io/brice-gachadoat.jpg',
  jobTitle: 'Expert en Automatisation et Intelligence Artificielle',
  description:
    "Ingénieur informatique avec plus de 10 ans d'expérience dans l'IT, spécialisé en automatisation business avec n8n et Make.com.",
  worksFor: {
    '@type': 'Organization',
    name: 'Sablia',
    url: 'https://sablia.io',
  },
  knowsAbout: [
    'Automatisation business',
    'n8n',
    'Make.com',
    'Intelligence Artificielle',
    'Transformation digitale',
    'Workflows',
    'ChatGPT',
    'Notion',
    'Airtable',
    'Supabase',
  ],
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'MeltOne Advisory',
    },
    {
      '@type': 'Organization',
      name: 'LVMH',
    },
  ],
  sameAs: ['https://linkedin.com/in/brice-gachadoat', 'https://calendly.com/brice-gachadoat'],
}

export default function About() {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/about" />
      {/* Person Schema JSON-LD */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <motion.div
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <Navigation />
          <main className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center mb-10 mt-12">
              <h1 className="text-4xl font-bold text-center text-sablia-text">À propos</h1>
            </div>

            <div className="max-w-3xl mx-auto prose">
              <h2 className="text-3xl font-semibold mb-6 text-sablia-text">
                Simplifier votre quotidien, c'est mon métier.
              </h2>

              <p className="text-sablia-text-secondary mb-6">
                Je suis <strong>Brice Gachadoat</strong>, expert en automatisation et intelligence
                artificielle. Vous êtes probablement ici parce que vous passez trop de temps sur des
                tâches répétitives ou que vous souhaitez tirer parti des dernières avancées en IA
                pour votre activité. Bonne nouvelle, c'est exactement ma spécialité.
              </p>

              <p className="text-sablia-text-secondary mb-6">
                Ingénieur informatique avec plus de 10 ans d'expérience dans l'IT, j'ai toujours
                cherché des moyens innovants de faciliter le quotidien professionnel des personnes
                autour de moi.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-sablia-text">Mon déclic personnel</h3>

              <p className="text-sablia-text-secondary mb-6">
                Tout a changé quand j'ai voulu aider ma femme, nutritionniste, à simplifier la
                gestion chronophage de ses dossiers et rendez-vous clients. Ma frustration de ne pas
                pouvoir l'assister efficacement malgré mes compétences techniques s'est envolée
                lorsque j'ai découvert les plateformes d'automatisation comme Make.com et n8n.
              </p>

              <p className="text-sablia-text-secondary mb-6">
                Lorsque ChatGPT a été mis à disposition du public, j'ai immédiatement compris le
                potentiel immense de cette technologie et commencé à l'intégrer dans mes solutions.{' '}
                <strong>Résultat concret</strong> : ma femme a réduit de 90% le temps consacré à la
                génération de menus et de 70% ses tâches administratives. Elle a pu accueillir 60%
                plus de clientes sans augmentation significative de sa charge de travail.
              </p>

              <p className="text-sablia-text-secondary mb-6">
                Aujourd'hui, je vous propose mon expertise pour simplifier et optimiser vos propres
                processus métier grâce à l'automatisation intelligente et l'IA conversationnelle.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-sablia-text">
                Ce que je peux vous apporter concrètement :
              </h3>

              <ul className="text-sablia-text-secondary mb-6 space-y-3">
                <li className="flex items-start">
                  <span>
                    <strong>Automatisation des tâches chronophages</strong> — Comme la
                    transformation automatique de CV au format de votre entreprise, réduisant un
                    travail de 30 minutes à quelques secondes
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <strong>Automatisations intelligentes de qualification</strong> — Systèmes
                    automatisés capables de qualifier vos prospects et générer des propositions
                    commerciales sur mesure
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <strong>Assistants IA personnalisés</strong> — À l'image de l'assistant que j'ai
                    développé pour gérer mes emails, contacts et planifier mes réunions, libérant
                    plus de 10 heures par semaine
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <strong>Formations sur mesure</strong> — J'accompagne vos équipes dans la
                    maîtrise des solutions mises en place et propose des formations dédiées aux
                    bonnes pratiques de l'IA pour garantir leur autonomie et maximiser votre retour
                    sur investissement
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 text-sablia-text">
                Mon expertise technique
              </h3>

              <p className="text-sablia-text-secondary mb-6">
                Je développe des automatisations principalement sur n8n, avec des compétences
                complémentaires sur Make.com. J'intègre efficacement des outils comme Notion,
                Airtable et Supabase pour créer des écosystèmes connectés et performants.
              </p>

              <p className="text-sablia-text-secondary mb-6">
                J'ai accompagné avec succès des clients dans les secteurs du conseil, du marketing,
                de la formation, de l'organisation d'événements et des ESN, ainsi que de nombreux
                entrepreneurs indépendants.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-sablia-text">
                Pourquoi me faire confiance ?
              </h3>

              <ul className="text-sablia-text-secondary mb-6 space-y-3">
                <li className="flex items-start">
                  <span>
                    <strong>Expérience confirmée</strong> : 10+ ans en gestion de projets IT, Data
                    et automatisation, dont un parcours au sein du prestigieux cabinet{' '}
                    <strong>MeltOne Advisory</strong> et du groupe de luxe mondial{' '}
                    <strong>LVMH</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <strong>Engagement concret</strong> : résultats garantis ou satisfait/remboursé
                  </span>
                </li>
                <li className="flex items-start">
                  <span>
                    <strong>Relation durable</strong> : je vous accompagne au-delà de la mise en
                    place technique, en formant vos équipes
                  </span>
                </li>
              </ul>

              <h3 className="text-2xl font-semibold mb-4 text-sablia-text">Passons à l'action</h3>

              <p className="text-sablia-text-secondary mb-6">
                Vous souhaitez retrouver du temps pour vous concentrer sur l'essentiel de votre
                métier ? <strong>Réservez un appel gratuit de 30 minutes</strong> pour identifier
                ensemble les automatisations qui transformeront votre business. Sans engagement.
              </p>

              <div className="mt-12 text-center">
                <a
                  href="https://calendly.com/brice-gachadoat/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sablia-accent hover:bg-sablia-accent-hover text-white px-8 py-3 rounded-md inline-block shadow-sm hover:shadow-md transition-all duration-300 text-lg font-medium"
                >
                  Réservez un appel découverte gratuit
                </a>
              </div>
            </div>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </motion.div>
    </>
  )
}
