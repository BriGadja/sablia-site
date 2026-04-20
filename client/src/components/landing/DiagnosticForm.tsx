import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'
import { inputClasses, WEBHOOK_DIAGNOSTIC } from '@/lib/form-constants'
import { getUTMParams } from '@/lib/utm'

export const diagnosticSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  entreprise: z.string().min(2, "Le nom d'entreprise doit contenir au moins 2 caractères"),
  processus_couteux: z.string().max(500, 'Maximum 500 caractères').optional(),
  rgpdConsent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
})

export type DiagnosticInputs = z.infer<typeof diagnosticSchema>

export default function DiagnosticForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DiagnosticInputs>({
    resolver: zodResolver(diagnosticSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: DiagnosticInputs) => {
    if (honeypot) {
      reset()
      setLocation('/thank-you?source=diagnostic')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(WEBHOOK_DIAGNOSTIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...getUTMParams() }),
      })
      if (!response.ok) throw new Error("Échec de l'envoi du formulaire")

      trackEvent('form_submit', { form_name: 'diagnostic' })
      reset()
      setLocation('/thank-you?source=diagnostic')
    } catch (error) {
      console.error('Diagnostic form error:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-sablia-bg border border-sablia-border rounded-lg p-6 sm:p-8 max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <Send size={18} className="text-sablia-accent" />
        <h3 className="text-xl font-semibold text-sablia-text">Démarrer mon diagnostic</h3>
      </div>
      <p className="text-sm text-sablia-text-secondary mb-6">
        4 champs, 30 secondes. Premier échange sous 48h.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="diagnostic-website">Website</label>
          <input
            id="diagnostic-website"
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
            htmlFor="diagnostic-nom"
            className="block text-sablia-text mb-1.5 text-sm font-medium"
          >
            Nom <span className="text-sablia-accent">*</span>
          </label>
          <input
            id="diagnostic-nom"
            type="text"
            {...register('nom')}
            className={inputClasses}
            placeholder="Jean Dupont"
            aria-invalid={errors.nom ? 'true' : 'false'}
          />
          {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
        </div>

        <div>
          <label
            htmlFor="diagnostic-email"
            className="block text-sablia-text mb-1.5 text-sm font-medium"
          >
            Email professionnel <span className="text-sablia-accent">*</span>
          </label>
          <input
            id="diagnostic-email"
            type="email"
            {...register('email')}
            className={inputClasses}
            placeholder="jean.dupont@entreprise.fr"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label
            htmlFor="diagnostic-entreprise"
            className="block text-sablia-text mb-1.5 text-sm font-medium"
          >
            Entreprise <span className="text-sablia-accent">*</span>
          </label>
          <input
            id="diagnostic-entreprise"
            type="text"
            {...register('entreprise')}
            className={inputClasses}
            placeholder="ACME Corp"
            aria-invalid={errors.entreprise ? 'true' : 'false'}
          />
          {errors.entreprise && (
            <p className="text-red-500 text-sm mt-1">{errors.entreprise.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="diagnostic-processus"
            className="block text-sablia-text mb-1.5 text-sm font-medium"
          >
            Quel process vous coûte le plus de temps ?{' '}
            <span className="text-sablia-text-tertiary">(optionnel)</span>
          </label>
          <textarea
            id="diagnostic-processus"
            rows={3}
            {...register('processus_couteux')}
            className={`${inputClasses} resize-none`}
            placeholder="Ex : gestion des emails clients, relances factures, reporting hebdo…"
          />
          {errors.processus_couteux && (
            <p className="text-red-500 text-sm mt-1">{errors.processus_couteux.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('rgpdConsent')}
              className="mt-1 w-4 h-4 accent-sablia-accent rounded"
            />
            <span className="text-sm text-sablia-text-secondary">
              J'accepte que mes données soient traitées conformément à la{' '}
              <a
                href="/politique-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sablia-accent underline hover:text-sablia-accent-hover"
              >
                politique de confidentialité
              </a>
              . <span className="text-sablia-accent">*</span>
            </span>
          </label>
          {errors.rgpdConsent && (
            <p className="text-red-500 text-sm mt-1">{errors.rgpdConsent.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sablia-accent text-white px-6 py-3.5 rounded-md font-medium hover:bg-sablia-accent-hover disabled:bg-sablia-accent/60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send size={18} />
              Démarrer mon diagnostic, 490€
            </>
          )}
        </button>

        <p className="text-center text-sablia-text-tertiary text-xs">
          490€ HT · déduits de la première facture si signature Développement ou Accompagnement dans
          les 90 jours.
        </p>
      </form>
    </motion.div>
  )
}
