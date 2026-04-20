import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import * as z from 'zod'
import { Reveal } from '@/components/ui/reveal'
import { useToast } from '@/hooks/use-toast'
import { trackConversion, trackEvent } from '@/lib/analytics'
import { WEBHOOK_DIAGNOSTIC } from '@/lib/form-constants'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'
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

const fieldClasses = cn(
  'w-full border border-[color:var(--color-encre)]/20 bg-[color:var(--color-sable)]',
  'px-4 py-3 font-sans text-[0.95rem] text-[color:var(--color-encre)]',
  'transition-[border-color,background] duration-200',
  'focus:border-[color:var(--color-tuile)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-tuile)]/25',
  'placeholder:text-[color:var(--color-encre-30)]',
)

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
    trackEvent('diagnostic_form_submit', { location: 'diagnostic-form' })
    try {
      const response = await fetch(WEBHOOK_DIAGNOSTIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...getUTMParams() }),
      })
      if (!response.ok) throw new Error("Échec de l'envoi du formulaire")

      trackEvent('form_submit', { form_name: 'diagnostic' })
      trackConversion('diagnostic_form')
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
    <div className="grid grid-cols-12 gap-x-6 gap-y-12">
      {/* Intention + rappel prix */}
      <div className="col-span-12 lg:col-span-5">
        <Reveal>
          <p className="folio mb-6">N° 07 · Démarrer</p>
          <h2 className="display-lg">
            Quatre champs.
            <br />
            <em>Cinq jours plus tard</em>,
            <br />
            vous savez.
          </h2>
          <p className="mt-6 max-w-[36ch] text-[color:var(--color-encre-70)]">
            Vous recevez dans l'heure le formulaire d'intake détaillé et un lien de paiement
            Stripe. L'appel d'intake de 15 minutes est ensuite calé avec vous.
          </p>

          <dl className="mt-10 divide-y divide-[color:var(--color-encre)]/12 border-t border-b border-[color:var(--color-encre)]/15">
            {[
              { k: 'Prix', v: '490€ HT' },
              { k: 'Délai', v: '5 jours ouvrés' },
              { k: 'Livrable', v: 'PDF · 10 à 15 pages' },
              { k: 'Paiement', v: 'Stripe ou virement' },
              { k: 'Crédit', v: '490€ déduits sur contrat Dév. ou Accomp. dans 90 j' },
            ].map((row) => (
              <div key={row.k} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="eyebrow">{row.k}</dt>
                <dd className="text-right text-[0.95rem] text-[color:var(--color-encre)]">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Formulaire */}
      <Reveal delay={120} className="col-span-12 lg:col-span-6 lg:col-start-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-[color:var(--color-encre)]/12 bg-[color:var(--color-sable-50)] p-8 md:p-10"
          noValidate
        >
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

          <div className="mb-6">
            <label htmlFor="diagnostic-nom" className="eyebrow mb-2 block">
              Nom <span className="ml-1 text-[color:var(--color-tuile)]">·</span>
            </label>
            <input
              id="diagnostic-nom"
              type="text"
              autoComplete="name"
              {...register('nom')}
              className={fieldClasses}
              placeholder="Jean Dupont"
              aria-invalid={errors.nom ? 'true' : 'false'}
            />
            {errors.nom && (
              <p className="mt-2 text-[0.85rem] text-[color:var(--color-tuile)]">
                {errors.nom.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="diagnostic-email" className="eyebrow mb-2 block">
              Email professionnel <span className="ml-1 text-[color:var(--color-tuile)]">·</span>
            </label>
            <input
              id="diagnostic-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={fieldClasses}
              placeholder="jean.dupont@entreprise.fr"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="mt-2 text-[0.85rem] text-[color:var(--color-tuile)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="diagnostic-entreprise" className="eyebrow mb-2 block">
              Entreprise <span className="ml-1 text-[color:var(--color-tuile)]">·</span>
            </label>
            <input
              id="diagnostic-entreprise"
              type="text"
              autoComplete="organization"
              {...register('entreprise')}
              className={fieldClasses}
              placeholder="ACME Corp"
              aria-invalid={errors.entreprise ? 'true' : 'false'}
            />
            {errors.entreprise && (
              <p className="mt-2 text-[0.85rem] text-[color:var(--color-tuile)]">
                {errors.entreprise.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="diagnostic-processus" className="eyebrow mb-2 block">
              Quel process vous coûte le plus de temps ?
            </label>
            <textarea
              id="diagnostic-processus"
              rows={4}
              {...register('processus_couteux')}
              className={cn(fieldClasses, 'resize-y')}
              placeholder="Ex : gestion des emails clients, relances factures, reporting hebdo…"
            />
            <p className="mt-1.5 text-[0.8rem] italic text-[color:var(--color-encre-50)]">
              Optionnel. Deux lignes suffisent — Brice creuse en appel d'intake.
            </p>
            {errors.processus_couteux && (
              <p className="mt-2 text-[0.85rem] text-[color:var(--color-tuile)]">
                {errors.processus_couteux.message}
              </p>
            )}
          </div>

          <fieldset className="mt-6">
            <label className="flex items-start gap-3 text-[0.9rem] leading-relaxed text-[color:var(--color-encre-70)]">
              <input
                type="checkbox"
                {...register('rgpdConsent')}
                className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-tuile)]"
              />
              <span>
                J'accepte que mes données soient traitées conformément à la{' '}
                <a
                  href={site.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-[color:var(--color-tuile)] underline-offset-4 hover:text-[color:var(--color-tuile)]"
                >
                  politique de confidentialité
                </a>
                . <span className="text-[color:var(--color-tuile)]">·</span>
              </span>
            </label>
            {errors.rgpdConsent && (
              <p className="mt-2 text-[0.85rem] text-[color:var(--color-tuile)]">
                {errors.rgpdConsent.message}
              </p>
            )}
          </fieldset>

          <div className="mt-8 flex flex-col items-start gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 px-8 py-3 font-medium transition-colors sm:w-auto',
                'bg-[color:var(--color-encre)] text-[color:var(--color-sable-50)]',
                'hover:bg-[color:var(--color-tuile)] active:translate-y-[1px]',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Démarrer mon diagnostic, 490€
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path
                      d="M3 10h14M12 5l5 5-5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            <p className="text-[0.8rem] text-[color:var(--color-encre-50)]">
              Préférez en discuter d'abord ?{' '}
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('cta_book_call', { location: 'diagnostic-form' })}
                className="underline decoration-[color:var(--color-tuile)] decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--color-tuile)]"
                aria-label="Réserver un créneau de discussion avec Brice sur Calendly"
              >
                Réserver 15 minutes avec Brice →
              </a>
            </p>
          </div>
        </form>
      </Reveal>
    </div>
  )
}
