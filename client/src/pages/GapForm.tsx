import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation } from 'wouter'
import * as z from 'zod'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { trackEvent } from '@/lib/analytics'
import { inputClasses, WEBHOOK_GAP } from '@/lib/form-constants'
import { getUTMParams } from '@/lib/utm'

const formSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').min(1, "L'email est requis"),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  sector: z.string().optional(),
  challenge: z.string().optional(),
  availability: z.string().optional(),
  rgpdConsent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter la politique de confidentialité' }),
  }),
})

export default function GapForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      companyName: '',
      sector: '',
      challenge: '',
      availability: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isSubmitting) return

    // Honeypot: if filled, fake success without sending
    if (honeypot) {
      setLocation('/thank-you?source=gap')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(WEBHOOK_GAP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...getUTMParams() }),
      })
      if (!response.ok) throw new Error(`Erreur lors de l'envoi du formulaire: ${response.status}`)

      trackEvent('form_submit', { form_name: 'gap' })
      setLocation('/thank-you?source=gap')
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi du formulaire.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sectorOptions = [
    'E-commerce',
    'Marketing & Communication',
    'Services B2B',
    'Industrie & Manufacturing',
    'Tech & Software',
    'Santé & Bien-être',
    'Finance & Assurance',
    'Autre',
  ]
  const availabilityOptions = ['Cette semaine', 'Semaine prochaine', 'Dans 2 semaines', 'Flexible']

  const gapInputClasses = `${inputClasses} placeholder:text-sablia-text-tertiary`

  return (
    <>
      <SEO page="/gap" />
      <motion.div
        className="min-h-screen bg-sablia-surface"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="min-h-screen flex flex-col">
          <div className="container mx-auto px-4 pt-8">
            <Link
              href="/"
              className="inline-flex items-center text-sablia-text-secondary hover:text-sablia-text transition-colors text-sm"
            >
              ← Retour à l'accueil
            </Link>
          </div>

          <div className="flex-grow flex flex-col justify-center py-6 px-4">
            <div className="container mx-auto max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-sablia-text mb-3">
                  Générateur d'<span className="text-sablia-accent">Automatisations</span>{' '}
                  Personnalisées
                </h1>
                <p className="text-base text-sablia-text-secondary max-w-2xl mx-auto">
                  En 2 minutes, obtenez des recommandations d'automatisations sur mesure pour votre
                  entreprise
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-100 p-5 sm:p-6"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Honeypot field — hidden from real users */}
                    <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="gap-website">Website</label>
                      <input
                        id="gap-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                          <h2 className="text-lg font-semibold text-sablia-text flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sablia-accent text-white text-xs font-bold">
                              1
                            </span>
                            Vos coordonnées
                          </h2>
                          <p className="text-sablia-text-tertiary text-xs mt-1">
                            Requis pour recevoir vos automatisations
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Prénom <span className="text-sablia-accent">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Jean" className={gapInputClasses} />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Nom <span className="text-sablia-accent">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Dupont"
                                  className={gapInputClasses}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Email professionnel <span className="text-sablia-accent">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="jean.dupont@entreprise.fr"
                                  className={gapInputClasses}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Entreprise <span className="text-sablia-accent">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Nom de votre entreprise"
                                  className={gapInputClasses}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="border-b border-gray-100 pb-3">
                          <h2 className="text-lg font-semibold text-sablia-text flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sablia-accent/20 text-sablia-accent text-xs font-bold">
                              2
                            </span>
                            Votre contexte
                          </h2>
                          <p className="text-sablia-text-tertiary text-xs mt-1">
                            Optionnel - Améliore la qualité de nos recommandations
                          </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="sector"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Secteur d'activité
                              </FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className={gapInputClasses}>
                                    <SelectValue placeholder="Sélectionnez votre secteur" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-gray-200">
                                    {sectorOptions.map((option) => (
                                      <SelectItem
                                        key={option}
                                        value={option}
                                        className="text-sablia-text hover:bg-gray-50"
                                      >
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="challenge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Principal défi business
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Ex: Trop de temps perdu sur la gestion des emails clients..."
                                  rows={3}
                                  className={`${gapInputClasses} resize-none`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sablia-text text-sm">
                                Disponibilité pour un échange
                              </FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className={gapInputClasses}>
                                    <SelectValue placeholder="Quand seriez-vous disponible ?" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-gray-200">
                                    {availabilityOptions.map((option) => (
                                      <SelectItem
                                        key={option}
                                        value={option}
                                        className="text-sablia-text hover:bg-gray-50"
                                      >
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="rgpdConsent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value === true}
                                onChange={(e) =>
                                  field.onChange(e.target.checked ? true : undefined)
                                }
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
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-sablia-accent hover:bg-sablia-accent-hover text-white font-medium text-base py-5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3 justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Envoi en cours...
                          </div>
                        ) : (
                          'Recevoir mes automatisations'
                        )}
                      </Button>
                      <p className="text-center text-sablia-text-tertiary text-xs mt-2">
                        Vous recevrez vos recommandations par email sous 24h
                      </p>
                    </div>
                  </form>
                </Form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4 text-sablia-text-tertiary text-xs"
              >
                <p>Gratuit et sans engagement · Réponse sous 24h · 100% personnalisé</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
