import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePersistentToast } from "@/hooks/use-persistent-toast";
import { Link } from "wouter";
import { RainbowText } from "@/components/RainbowText";
import { motion } from "framer-motion";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";

const formSchema = z.object({
  // Contact (obligatoires)
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),

  // Contexte (optionnels mais recommandés)
  sector: z.string().optional(),
  challenge: z.string().optional(),
  availability: z.string().optional(),
});

export default function GapForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { setPendingToast } = usePersistentToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      sector: "",
      challenge: "",
      availability: "",
    },
  });

  const isFormValid = () => {
    const values = form.getValues();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Vérifier que les champs obligatoires sont remplis et que l'email est valide
    return (
      !!values.firstName &&
      !!values.lastName &&
      !!values.email &&
      emailRegex.test(values.email) &&
      !!values.companyName
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL ||
                        window.location.origin + '/api/webhook-test';

      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi du formulaire: ${response.status}`);
      }

      // Stocker le toast pour qu'il soit affiché après redirection
      setPendingToast({
        title: "Formulaire envoyé avec succès !",
        description: "Nous vous contacterons rapidement avec des solutions personnalisées.",
      });

      // Redirection vers la page d'accueil
      window.location.href = '/';

    } catch (error) {
      console.error('Erreur:', error);
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire.",
      });
    }
  };


  const sectorOptions = [
    "E-commerce",
    "Marketing & Communication",
    "Services B2B",
    "Industrie & Manufacturing",
    "Tech & Software",
    "Santé & Bien-être",
    "Finance & Assurance",
    "Autre"
  ];

  const availabilityOptions = [
    "Cette semaine",
    "Semaine prochaine",
    "Dans 2 semaines",
    "Flexible"
  ];

  return (
    <motion.div
      className="min-h-screen relative"
      style={{
        background: "linear-gradient(to bottom, #2B9AB8 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated particles background */}
      <AnimatedParticles />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back link */}
        <div className="container mx-auto px-4 pt-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>

        {/* Main content */}
        <div className="flex-grow flex flex-col justify-center py-6 px-4">
          <div className="container mx-auto max-w-5xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Générateur d'<RainbowText>Automatisations</RainbowText> Personnalisées
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                En 2 minutes, obtenez des recommandations d'automatisations sur mesure pour votre entreprise
              </p>
            </motion.div>

            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-5 sm:p-6 shadow-2xl"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Grid 2 colonnes sur desktop, empilé sur mobile */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                    {/* Section 1: Contact - Gauche */}
                    <div className="space-y-4">
                      <div className="border-b border-white/20 pb-3">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold">1</span>
                          Vos coordonnées
                        </h2>
                        <p className="text-white/60 text-xs mt-1">Requis pour recevoir vos automatisations</p>
                      </div>

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Prénom <span className="text-orange-400">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Jean"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-orange-400"
                              />
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Nom <span className="text-orange-400">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Dupont"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-orange-400"
                              />
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Email professionnel <span className="text-orange-400">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="jean.dupont@entreprise.fr"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-orange-400"
                              />
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Entreprise <span className="text-orange-400">*</span></FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nom de votre entreprise"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-orange-400"
                              />
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Section 2: Contexte - Droite */}
                    <div className="space-y-4">
                      <div className="border-b border-white/20 pb-3">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-bold">2</span>
                          Votre contexte
                        </h2>
                        <p className="text-white/60 text-xs mt-1">
                          Optionnel - Améliore la qualité de nos recommandations
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Secteur d'activité</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Sélectionnez votre secteur" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/20">
                                  {sectorOptions.map((option) => (
                                    <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="challenge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">
                              Principal défi business
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Ex: Trop de temps perdu sur la gestion des emails clients..."
                                rows={3}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-blue-400 resize-none"
                              />
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white text-sm">Disponibilité pour un échange</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Quand seriez-vous disponible ?" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/20">
                                  {availabilityOptions.map((option) => (
                                    <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-orange-300" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      disabled={!isFormValid() || isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base py-5 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3 justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        '🚀 Recevoir mes automatisations'
                      )}
                    </Button>
                    <p className="text-center text-white/50 text-xs mt-2">
                      Vous recevrez vos recommandations par email sous 24h
                    </p>
                  </div>
                </form>
              </Form>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-4 text-white/60 text-xs"
            >
              <p>✓ Gratuit et sans engagement • ✓ Réponse sous 24h • ✓ 100% personnalisé</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom cursor */}
      <CustomCursor />
    </motion.div>
  );
}