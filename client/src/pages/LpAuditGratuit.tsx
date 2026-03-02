import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock, MessageSquare, Shield } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'wouter'

const valueCards = [
  {
    icon: MessageSquare,
    title: 'Personnalise',
    description:
      "Recommandations d'automatisations adaptees a votre secteur, vos outils et vos processus.",
  },
  {
    icon: Clock,
    title: 'Reponse sous 24h',
    description: 'Recevez un rapport detaille avec des pistes concretes dans votre boite mail.',
  },
  {
    icon: Shield,
    title: 'Sans engagement',
    description: 'Gratuit, sans carte bancaire, sans appel obligatoire. Vous decidez de la suite.',
  },
]

const benefits = [
  'Identifiez vos 3 processus les plus chronophages',
  'Estimez vos economies potentielles en temps et en argent',
  'Recevez des recommandations actionnables',
  'Aucune competence technique requise',
]

export default function LpAuditGratuit() {
  return (
    <>
      <Helmet>
        <title>Audit Automatisation Gratuit | Sablia</title>
        <meta
          name="description"
          content="Decouvrez vos opportunites d'automatisation en 2 minutes. Recommandations personnalisees, reponse sous 24h, sans engagement."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <motion.div
        className="min-h-screen bg-sablia-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Minimal nav — logo only */}
        <nav className="sticky top-0 z-40 bg-sablia-bg/95 backdrop-blur-sm border-b border-sablia-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/">
              <img src="/logo.svg" alt="Sablia" className="h-8 w-auto" />
            </Link>
            <Link
              href="/gap"
              className="text-sm font-medium bg-sablia-sienna text-white px-5 py-2.5 rounded-md hover:bg-sablia-sienna/90 transition-colors"
            >
              Commencer l'audit
            </Link>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="relative py-20 lg:py-28">
            <div className="absolute inset-0 bg-gradient-to-b from-sablia-bg via-sablia-bg to-sablia-surface" />
            <div className="relative container mx-auto px-6 lg:px-8 max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-sablia-sienna/10 text-sablia-sienna text-sm font-medium px-4 py-1.5 rounded-full mb-6"
              >
                <CheckCircle size={14} />
                100% gratuit
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-sablia-text leading-tight mb-6"
              >
                Decouvrez vos opportunites d'
                <span className="text-sablia-sienna">automatisation</span> en 2 minutes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-sablia-text-secondary max-w-2xl mx-auto mb-8"
              >
                Remplissez notre formulaire d'analyse rapide. Recevez des recommandations
                personnalisees pour automatiser votre entreprise, sans engagement.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link
                  href="/gap"
                  className="inline-flex items-center gap-2 bg-sablia-sienna text-white px-8 py-4 rounded-md font-medium text-lg hover:bg-sablia-sienna/90 transition-colors"
                >
                  Lancer mon audit gratuit
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Value cards */}
          <section className="bg-sablia-surface py-16 border-y border-sablia-border">
            <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {valueCards.map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-sablia-bg border border-sablia-border rounded p-6 text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sablia-sienna/10 text-sablia-sienna mb-4">
                      <card.icon size={22} />
                    </div>
                    <h3 className="text-lg font-semibold text-sablia-text mb-2">{card.title}</h3>
                    <p className="text-sm text-sablia-text-secondary">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits + CTA */}
          <section className="py-20 lg:py-24">
            <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-3xl font-display font-semibold text-sablia-text mb-6">
                    Ce que vous obtiendrez
                  </h2>
                  <ul className="space-y-4">
                    {benefits.map((benefit, i) => (
                      <motion.li
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-sablia-sienna shrink-0 mt-0.5" />
                        <span className="text-sablia-text-secondary">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-sablia-surface border border-sablia-border rounded-lg p-8 text-center"
                >
                  <p className="text-5xl font-display font-semibold text-sablia-sienna mb-2">
                    2 min
                  </p>
                  <p className="text-sablia-text-secondary mb-6">
                    C'est tout ce qu'il faut pour demarrer
                  </p>
                  <Link
                    href="/gap"
                    className="inline-flex items-center gap-2 bg-sablia-sienna text-white px-6 py-3.5 rounded-md font-medium hover:bg-sablia-sienna/90 transition-colors w-full justify-center"
                  >
                    Commencer maintenant
                    <ArrowRight size={18} />
                  </Link>
                  <p className="text-xs text-sablia-text-tertiary mt-3">
                    Gratuit et sans engagement
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonial + stat */}
          <section className="bg-sablia-surface py-16 border-y border-sablia-border">
            <div className="container mx-auto px-6 lg:px-8 max-w-3xl">
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="text-lg text-sablia-text italic mb-6">
                  &laquo; Le diagnostic de Sablia nous a revele 5 automatisations qu'on n'avait
                  jamais envisagees. On a commence par la plus simple et on gagne deja 8h par
                  semaine. &raquo;
                </p>
                <footer className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sablia-accent/10 flex items-center justify-center text-sablia-accent text-sm font-semibold">
                    TB
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-sablia-text">Thomas B.</p>
                    <p className="text-xs text-sablia-text-secondary">
                      Gerant, agence marketing digitale
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20">
            <div className="container mx-auto px-6 lg:px-8 max-w-2xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-display font-semibold text-sablia-text mb-4">
                  Pret a decouvrir votre potentiel ?
                </h2>
                <p className="text-sablia-text-secondary mb-8">
                  Rejoignez les dizaines de PME qui ont identifie leurs opportunites
                  d'automatisation avec Sablia.
                </p>
                <Link
                  href="/gap"
                  className="inline-flex items-center gap-2 bg-sablia-accent text-white px-8 py-4 rounded-md font-medium text-lg hover:bg-sablia-accent-hover transition-colors"
                >
                  Lancer mon audit gratuit
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        {/* Minimal footer */}
        <footer className="border-t border-sablia-border bg-sablia-surface py-6">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sablia-text-secondary">
            <p>&copy; {new Date().getFullYear()} Sablia</p>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-sablia-text transition-colors">
                Mentions legales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-sablia-text transition-colors"
              >
                Confidentialite
              </Link>
              <Link href="/cgv" className="hover:text-sablia-text transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  )
}
