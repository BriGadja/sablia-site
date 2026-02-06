import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle, Send, Loader2, Calendar } from "lucide-react";
import { InlineWidget } from "react-calendly";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  entreprise: z.string().min(2, "Le nom d'entreprise doit contenir au moins 2 caractères"),
  telephone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
  rgpdConsent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la politique de confidentialité" }),
  }),
});

type ContactInputs = z.infer<typeof contactSchema>;

const inputClasses = "w-full px-4 py-3 rounded-md bg-white border border-gray-200 text-sablia-text text-base focus:outline-none focus:border-sablia-accent focus:ring-1 focus:ring-sablia-accent transition-colors";

export default function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInputs>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ContactInputs) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://n8n.sablia.io/webhook/sablia-site-formulaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Échec de l'envoi du message");

      setIsSuccess(true);
      reset();
      toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les 24 heures.", variant: "default" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-sablia-text mb-3">
            Contactez-nous
          </h2>
          <p className="text-lg text-sablia-text-secondary text-center mb-16 max-w-2xl mx-auto">
            Prêt à transformer votre entreprise ? Parlons de votre projet d'automatisation
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8">
          {!isSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-lg p-8"
            >
              <div className="flex items-center gap-2.5 mb-1.5">
                <Send size={18} className="text-sablia-accent" />
                <h3 className="text-xl font-semibold text-sablia-text">Envoyer un message</h3>
              </div>
              <p className="text-sm text-sablia-text-secondary mb-6">Réponse sous 24 heures, promis.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sablia-text mb-1.5 text-sm font-medium">
                    Nom <span className="text-sablia-accent">*</span>
                  </label>
                  <input id="nom" type="text" {...register("nom")} className={inputClasses} placeholder="Jean Dupont" />
                  {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sablia-text mb-1.5 text-sm font-medium">
                    Email <span className="text-sablia-accent">*</span>
                  </label>
                  <input id="email" type="email" {...register("email")} className={inputClasses} placeholder="jean.dupont@exemple.fr" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="entreprise" className="block text-sablia-text mb-1.5 text-sm font-medium">
                    Entreprise <span className="text-sablia-accent">*</span>
                  </label>
                  <input id="entreprise" type="text" {...register("entreprise")} className={inputClasses} placeholder="ACME Corp" />
                  {errors.entreprise && <p className="text-red-500 text-sm mt-1">{errors.entreprise.message}</p>}
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sablia-text mb-1.5 text-sm font-medium">
                    Téléphone <span className="text-sablia-text-tertiary">(optionnel)</span>
                  </label>
                  <input id="telephone" type="tel" {...register("telephone")} className={inputClasses} placeholder="+33 6 12 34 56 78" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sablia-text mb-1.5 text-sm font-medium">
                    Message <span className="text-sablia-accent">*</span>
                  </label>
                  <textarea id="message" rows={4} {...register("message")} className={`${inputClasses} resize-none`} placeholder="Décrivez votre projet d'automatisation..." />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" {...register("rgpdConsent")} className="mt-1 w-4 h-4 accent-sablia-accent rounded" />
                    <span className="text-sm text-sablia-text-secondary">
                      J'accepte que mes données soient traitées conformément à la{" "}
                      <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer" className="text-sablia-accent underline hover:text-sablia-accent-hover">
                        politique de confidentialité
                      </a>. <span className="text-sablia-accent">*</span>
                    </span>
                  </label>
                  {errors.rgpdConsent && <p className="text-red-500 text-sm mt-1">{errors.rgpdConsent.message}</p>}
                </div>

                {isSubmitting ? (
                  <button type="button" disabled className="w-full bg-sablia-accent/60 text-white px-6 py-3.5 rounded-md font-medium cursor-not-allowed flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </button>
                ) : (
                  <button type="submit" className="w-full bg-sablia-accent text-white px-6 py-3.5 rounded-md font-medium hover:bg-sablia-accent-hover transition-colors duration-200 flex items-center justify-center gap-2">
                    <Send size={18} />
                    Envoyer le message
                  </button>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-100 rounded-lg p-12 text-center flex flex-col justify-center"
            >
              <CheckCircle size={56} className="text-sablia-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-sablia-text mb-2">Message envoyé !</h3>
              <p className="text-base text-sablia-text-secondary">
                Merci pour votre message. Nous vous répondrons dans les 24 heures.
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-lg p-8"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <Calendar size={18} className="text-sablia-accent" />
              <h3 className="text-xl font-semibold text-sablia-text">Réserver un appel</h3>
            </div>
            <p className="text-sm text-sablia-text-secondary mb-6">30 minutes pour découvrir vos besoins.</p>

            <div className="rounded-md overflow-hidden">
              <InlineWidget
                url="https://calendly.com/brice-gachadoat/30min"
                styles={{ height: "580px", minWidth: "280px" }}
                pageSettings={{
                  primaryColor: "2563eb",
                  backgroundColor: "ffffff",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
