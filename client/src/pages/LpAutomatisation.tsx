import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Loader2, Send, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'wouter'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'
import { inputClasses, WEBHOOK_CONTACT } from '@/lib/form-constants'
import { getUTMParams } from '@/lib/utm'

const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Adresse email invalide'),
  entreprise: z.string().min(2, "Le nom d'entreprise doit contenir au moins 2 caracteres"),
  telephone: z.string().optional(),
  message: z.string().optional(),
  rgpdConsent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialite' }),
  }),
})

type ContactInputs = z.infer<typeof contactSchema>

const stats = [
  { value: '20h', label: 'economisees par semaine en moyenne', icon: Clock },
  { value: '4-8 mois', label: 'pour un ROI positif', icon: TrendingUp },
  { value: '100%', label: 'autonomie apres formation', icon: Zap },
]

const painPoints = [
  {
    problem: 'Saisie manuelle repetitive',
    solution: 'Synchronisation automatique entre vos outils (CRM, facturation, email)',
  },
  {
    problem: 'Erreurs humaines couteuses',
    solution: 'Workflows valides et testes, execution fiable 24h/24',
  },
  {
    problem: 'Equipes surchargees de taches sans valeur',
    solution: 'Vos collaborateurs se concentrent sur le coeur de metier',
  },
]

export default function LpAutomatisation() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInputs>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: ContactInputs) => {
    if (honeypot) {
      reset()
      setLocation('/thank-you?source=contact')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(WEBHOOK_CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...getUTMParams(), source_page: 'lp-automatisation-pme' }),
      })
      if (!response.ok) throw new Error("Echec de l'envoi du message")

      trackEvent('form_submit', { form_name: 'contact', source_page: 'lp-automatisation-pme' })
      reset()
      setLocation('/thank-you?source=contact')
    } catch (error) {
      console.error('Contact form error:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi. Veuillez reessayer.",
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Automatisez vos processus repetitifs | Sablia</title>
        <meta
          name="description"
          content="Gagnez 20h par semaine en automatisant vos taches repetitives. Formation + developpement n8n/Make.com. ROI en 4-8 mois."
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
            <a
              href="#formulaire"
              className="text-sm font-medium bg-sablia-accent text-white px-5 py-2.5 rounded-md hover:bg-sablia-accent-hover transition-colors"
            >
              Contactez-nous
            </a>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="relative py-20 lg:py-28">
            <div className="absolute inset-0 bg-gradient-to-b from-sablia-bg via-sablia-bg to-sablia-surface" />
            <div className="relative container mx-auto px-6 lg:px-8 max-w-4xl text-center">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm uppercase tracking-[0.15em] text-sablia-sienna mb-4"
              >
                Automatisation pour PME
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-sablia-text leading-tight mb-6"
              >
                Automatisez vos processus <span className="text-sablia-sienna">repetitifs</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-sablia-text-secondary max-w-2xl mx-auto mb-8"
              >
                Liberez vos equipes des taches manuelles. Formation de vos collaborateurs +
                developpement de workflows sur mesure. Gardez le controle, economisez du temps et de
                l'argent.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a
                  href="#formulaire"
                  className="inline-flex items-center gap-2 bg-sablia-accent text-white px-8 py-4 rounded-md font-medium text-lg hover:bg-sablia-accent-hover transition-colors"
                >
                  Demander un devis gratuit
                  <ArrowRight size={20} />
                </a>
              </motion.div>
            </div>
          </section>

          {/* Stats strip */}
          <section className="bg-sablia-surface py-12 border-y border-sablia-border">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <stat.icon className="w-6 h-6 text-sablia-sienna mx-auto mb-3" />
                    <p className="text-3xl font-display font-semibold text-sablia-text mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-sablia-text-secondary">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Problem / Solution */}
          <section className="py-20 lg:py-24">
            <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text text-center mb-14"
              >
                Le probleme, la solution
              </motion.h2>
              <div className="space-y-6">
                {painPoints.map((item, i) => (
                  <motion.div
                    key={item.problem}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="grid md:grid-cols-2 gap-4 bg-sablia-surface border border-sablia-border rounded p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold mt-0.5">
                        ✕
                      </span>
                      <p className="text-sablia-text">{item.problem}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <p className="text-sablia-text">{item.solution}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
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
                  &laquo; En 3 semaines, Sablia a automatise notre pipeline de prospection. On
                  economise 15h par semaine et nos equipes peuvent enfin se concentrer sur la vente.
                  &raquo;
                </p>
                <footer className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sablia-accent/10 flex items-center justify-center text-sablia-accent text-sm font-semibold">
                    ML
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-sablia-text">Marie L.</p>
                    <p className="text-xs text-sablia-text-secondary">
                      Directrice commerciale, PME B2B
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            </div>
          </section>

          {/* Contact form */}
          <section id="formulaire" className="py-20 lg:py-24">
            <div className="container mx-auto px-6 lg:px-8 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-center mb-10"
              >
                <h2 className="text-3xl font-display font-semibold text-sablia-text mb-3">
                  Parlons de votre projet
                </h2>
                <p className="text-sablia-text-secondary">
                  Devis gratuit sous 24h. Sans engagement.
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 bg-white border border-sablia-border rounded-lg p-8"
              >
                {/* Honeypot */}
                <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="lp-website">Website</label>
                  <input
                    id="lp-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lp-nom"
                    className="block text-sablia-text mb-1.5 text-sm font-medium"
                  >
                    Nom <span className="text-sablia-accent">*</span>
                  </label>
                  <input
                    id="lp-nom"
                    type="text"
                    {...register('nom')}
                    className={inputClasses}
                    placeholder="Jean Dupont"
                  />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
                </div>

                <div>
                  <label
                    htmlFor="lp-email"
                    className="block text-sablia-text mb-1.5 text-sm font-medium"
                  >
                    Email <span className="text-sablia-accent">*</span>
                  </label>
                  <input
                    id="lp-email"
                    type="email"
                    {...register('email')}
                    className={inputClasses}
                    placeholder="jean.dupont@exemple.fr"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lp-entreprise"
                    className="block text-sablia-text mb-1.5 text-sm font-medium"
                  >
                    Entreprise <span className="text-sablia-accent">*</span>
                  </label>
                  <input
                    id="lp-entreprise"
                    type="text"
                    {...register('entreprise')}
                    className={inputClasses}
                    placeholder="ACME Corp"
                  />
                  {errors.entreprise && (
                    <p className="text-red-500 text-sm mt-1">{errors.entreprise.message}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lp-telephone"
                    className="block text-sablia-text mb-1.5 text-sm font-medium"
                  >
                    Telephone <span className="text-sablia-text-tertiary">(optionnel)</span>
                  </label>
                  <input
                    id="lp-telephone"
                    type="tel"
                    {...register('telephone')}
                    className={inputClasses}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lp-message"
                    className="block text-sablia-text mb-1.5 text-sm font-medium"
                  >
                    Votre besoin <span className="text-sablia-text-tertiary">(optionnel)</span>
                  </label>
                  <textarea
                    id="lp-message"
                    rows={3}
                    {...register('message')}
                    className={`${inputClasses} resize-none`}
                    placeholder="Decrivez brievement ce que vous souhaitez automatiser..."
                  />
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('rgpdConsent')}
                      className="mt-1 w-4 h-4 accent-sablia-accent rounded"
                    />
                    <span className="text-sm text-sablia-text-secondary">
                      J'accepte que mes donnees soient traitees conformement a la{' '}
                      <a
                        href="/politique-confidentialite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sablia-accent underline hover:text-sablia-accent-hover"
                      >
                        politique de confidentialite
                      </a>
                      . <span className="text-sablia-accent">*</span>
                    </span>
                  </label>
                  {errors.rgpdConsent && (
                    <p className="text-red-500 text-sm mt-1">{errors.rgpdConsent.message}</p>
                  )}
                </div>

                {isSubmitting ? (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-sablia-accent/60 text-white px-6 py-3.5 rounded-md font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-sablia-accent text-white px-6 py-3.5 rounded-md font-medium hover:bg-sablia-accent-hover transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Envoyer ma demande
                  </button>
                )}
              </motion.form>
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
