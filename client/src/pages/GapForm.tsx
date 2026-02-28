import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'wouter'
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
import { usePersistentToast } from '@/hooks/use-persistent-toast'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').min(1, "L'email est requis"),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  sector: z.string().optional(),
  challenge: z.string().optional(),
  availability: z.string().optional(),
})

export default function GapForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { setPendingToast } = usePersistentToast()

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

  const isFormValid = () => {
    const values = form.getValues()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return (
      !!values.firstName &&
      !!values.lastName &&
      !!values.email &&
      emailRegex.test(values.email) &&
      !!values.companyName
    )
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const params = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      const webhookUrl =
        import.meta.env.VITE_N8N_WEBHOOK_URL || window.location.origin + '/api/webhook-test'
      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
      })
      if (!response.ok) throw new Error(`Erreur lors de l'envoi du formulaire: ${response.status}`)

      setPendingToast({
        title: 'Formulaire envoyé avec succès !',
        description: 'Nous vous contacterons rapidement avec des solutions personnalisées.',
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Erreur:', error)
      setIsSubmitting(false)
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'envoi du formulaire.",
      })
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

  const inputClasses =
    'bg-white border-gray-200 text-sablia-text placeholder:text-sablia-text-tertiary focus:border-sablia-accent focus:ring-sablia-accent'

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
                                <Input {...field} placeholder="Jean" className={inputClasses} />
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
                                <Input {...field} placeholder="Dupont" className={inputClasses} />
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
                                  className={inputClasses}
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
                                  className={inputClasses}
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
                                  <SelectTrigger className={inputClasses}>
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
                                  className={`${inputClasses} resize-none`}
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
                                  <SelectTrigger className={inputClasses}>
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

                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
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
