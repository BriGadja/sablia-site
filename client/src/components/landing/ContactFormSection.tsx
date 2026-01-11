import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";
import { useToast } from "@/hooks/use-toast";

/**
 * ContactFormSection - Professional contact form with success animation
 *
 * Features:
 * - 5 fields: Nom*, Email*, Entreprise*, Téléphone (optional), Message*
 * - React Hook Form + Zod validation
 * - Form states: idle, submitting, success, error
 * - Toast notifications for feedback
 * - Success animation with CheckCircle icon
 * - Auto-reset after 5 seconds
 * - Backend POST to /api/contact
 * - Glassmorphism styling
 */

// ============================================
// Zod Validation Schema
// ============================================

const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  entreprise: z.string().min(2, "Le nom d'entreprise doit contenir au moins 2 caractères"),
  telephone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactInputs = z.infer<typeof contactSchema>;

// ============================================
// Main Component
// ============================================

export default function ContactFormSection() {
  // Form state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Toast notification hook
  const { toast } = useToast();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInputs>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  // Form submission handler
  const onSubmit = async (data: ContactInputs) => {
    setIsSubmitting(true);

    try {
      // n8n webhook call
      const response = await fetch("https://n8n.sablia.io/webhook/sablia-site-formulaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi du message");
      }

      // Success: Show animation + toast
      setIsSuccess(true);
      reset(); // Clear form fields
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 24 heures.",
        variant: "default",
      });

      // Auto-reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-v2-white mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl sm:text-2xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Prêt à transformer votre entreprise ? Parlons de votre projet d'automatisation
          </p>
        </ScrollReveal>

        {/* Conditional Render: Form OR Success Animation */}
        {!isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/30 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-2 text-center">
              Discutons de votre projet
            </h3>
            <p className="text-base sm:text-lg text-v2-off-white/70 text-center mb-8">
              Pas de spam, promis. Réponse sous 24 heures.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Field 1: Nom (required) */}
              <div>
                <label htmlFor="nom" className="block text-v2-white mb-2 font-medium">
                  Nom <span className="text-v2-cyan">*</span>
                </label>
                <input
                  id="nom"
                  type="text"
                  {...register("nom")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Jean Dupont"
                />
                {errors.nom && <p className="text-red-400 text-sm mt-1">{errors.nom.message}</p>}
              </div>

              {/* Field 2: Email (required) */}
              <div>
                <label htmlFor="email" className="block text-v2-white mb-2 font-medium">
                  Email <span className="text-v2-cyan">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="jean.dupont@exemple.fr"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Field 3: Entreprise (required) */}
              <div>
                <label htmlFor="entreprise" className="block text-v2-white mb-2 font-medium">
                  Entreprise <span className="text-v2-cyan">*</span>
                </label>
                <input
                  id="entreprise"
                  type="text"
                  {...register("entreprise")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="ACME Corp"
                />
                {errors.entreprise && (
                  <p className="text-red-400 text-sm mt-1">{errors.entreprise.message}</p>
                )}
              </div>

              {/* Field 4: Téléphone (optional) */}
              <div>
                <label htmlFor="telephone" className="block text-v2-white mb-2 font-medium">
                  Téléphone <span className="text-v2-off-white/50">(optionnel)</span>
                </label>
                <input
                  id="telephone"
                  type="tel"
                  {...register("telephone")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Field 5: Message (required, textarea) */}
              <div>
                <label htmlFor="message" className="block text-v2-white mb-2 font-medium">
                  Message <span className="text-v2-cyan">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors resize-none"
                  placeholder="Décrivez votre projet d'automatisation..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              {isSubmitting ? (
                <button
                  type="button"
                  disabled
                  className="w-full bg-v2-cyan/50 text-v2-navy px-8 py-4 rounded-lg font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Loader2 size={20} className="animate-spin" />
                  <span>Envoi en cours...</span>
                </button>
              ) : (
                <MagneticButton
                  strength={0.2}
                  className="w-full bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-cyan/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  <span>Envoyer le message</span>
                </MagneticButton>
              )}
            </form>
          </motion.div>
        ) : (
          // Success Animation
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-12 border border-v2-cyan/50 max-w-2xl mx-auto text-center"
          >
            {/* CheckCircle Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <CheckCircle size={80} className="text-v2-cyan" />
            </motion.div>

            {/* Success Message */}
            <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-3">Message envoyé !</h3>
            <p className="text-base sm:text-lg text-v2-off-white/80">
              Merci pour votre message. Nous vous répondrons dans les 24 heures.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
