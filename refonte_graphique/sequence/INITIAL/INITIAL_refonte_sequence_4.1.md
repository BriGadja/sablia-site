# INITIAL - PRP 4.1 - ContactFormSection

## FEATURE

Create a professional contact form with full validation and state management.

**Requirements**:
- React Hook Form + Zod validation
- Fields: Nom, Email, Entreprise, Message, Téléphone (optional)
- Real-time validation with error messages
- Form states: idle, submitting, success, error
- Reassuring microcopy ("Pas de spam", "Réponse sous 24h")
- Backend integration (or mock for testing)
- Professional styling with glassmorphism
- Success message animation on submission

**Visual Deliverable**: Complete contact form with validation, state management, and success feedback, positioned after CalculatorROI section.

**Technical Requirements**:
- Component path: `client/src/components/v3/ContactFormSection.tsx`
- Use React Hook Form for form management
- Use Zod for validation schema
- Use React Query for submission (if backend available)
- Toast notification on success/error
- Integrate into LandingV3.tsx as ninth section

## EXAMPLES

**ContactFormSection Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import MagneticElements from "@/components/animations/MagneticElements";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  entreprise: z.string().min(2, "Le nom d'entreprise doit contenir au moins 2 caractères"),
  telephone: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères")
});

type ContactInputs = z.infer<typeof contactSchema>;

export default function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactInputs>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactInputs) => {
    setIsSubmitting(true);

    try {
      // Backend API call (or mock)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Échec de l'envoi");

      setIsSuccess(true);
      reset();
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les 24 heures.",
        variant: "default"
      });

      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-v2-charcoal to-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Discutons de votre projet
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Remplissez ce formulaire et nous vous répondrons sous 24 heures
          </p>
        </ScrollReveal>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 lg:p-12"
        >
          {isSuccess ? (
            // Success State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle size={64} className="text-v2-cyan mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-v2-white mb-4">
                Message envoyé avec succès !
              </h3>
              <p className="text-v2-off-white/80 mb-8">
                Nous avons bien reçu votre demande. Notre équipe vous répondra dans les 24 heures.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="text-v2-cyan hover:text-v2-electric transition-colors"
              >
                Envoyer un autre message
              </button>
            </motion.div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Nom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("nom")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Votre nom complet"
                />
                {errors.nom && (
                  <p className="text-red-400 text-sm mt-1">{errors.nom.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Entreprise <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("entreprise")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Nom de votre entreprise"
                />
                {errors.entreprise && (
                  <p className="text-red-400 text-sm mt-1">{errors.entreprise.message}</p>
                )}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Téléphone <span className="text-v2-off-white/50 text-sm">(optionnel)</span>
                </label>
                <input
                  type="tel"
                  {...register("telephone")}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={6}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors resize-none"
                  placeholder="Décrivez votre projet d'automatisation..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Microcopy */}
              <div className="flex items-start gap-3 text-sm text-v2-off-white/70">
                <Mail size={20} className="text-v2-cyan mt-0.5 flex-shrink-0" />
                <p>
                  Pas de spam, promis. Nous vous répondrons sous 24 heures en vous apportant des premières recommandations.
                </p>
              </div>

              {/* Submit Button */}
              <MagneticElements intensity="high">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-electric transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Envoyer ma demande
                    </>
                  )}
                </button>
              </MagneticElements>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
```

**Reference Existing Forms**: Check existing form patterns in project (GapForm, etc.) for backend integration.

## DOCUMENTATION

**React Hook Form**:
- https://react-hook-form.com/
- `register()` for field registration
- `handleSubmit()` for form submission
- `formState.errors` for validation errors
- `reset()` to clear form after success

**Zod Validation**:
- https://zod.dev/
- String validation: `z.string().min(2)`
- Email validation: `z.string().email()`
- Optional fields: `.optional()`

**Form Fields**:
1. **Nom** (required): Min 2 characters
2. **Email** (required): Valid email format
3. **Entreprise** (required): Min 2 characters
4. **Téléphone** (optional): No validation (accept any format)
5. **Message** (required): Min 10 characters

**Form States**:
- **Idle**: Default state, form ready
- **Submitting**: Button disabled, spinner visible
- **Success**: Show success message, hide form
- **Error**: Show error toast, keep form visible

**Microcopy** (Reassuring Messages):
- "Pas de spam, promis."
- "Réponse sous 24 heures"
- "Premières recommandations incluses"
- Fields marked with * (required indicator)
- "(optionnel)" for optional fields

**Backend Integration**:
```typescript
// POST to /api/contact
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});
```

If backend doesn't exist yet, use mock:
```typescript
// Mock submission for testing
await new Promise(resolve => setTimeout(resolve, 2000));
console.log("Form data:", data);
```

## GRADIENT SYSTEM

⚠️ **CRITICAL**: LandingV3 uses a continuous vertical gradient that progresses from sky blue (top) → night (middle) → dawn/sunrise (bottom). This gradient creates a visual metaphor for the customer journey and MUST NOT be interrupted by solid backgrounds on sections.

**📖 Full Reference**: See `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md` for complete specifications.

**Key Rules**:
- ❌ **DO NOT** use solid backgrounds (`bg-v2-navy`, `bg-v2-electric`, `bg-v2-charcoal`) on `<section>` elements
- ❌ **DO NOT** use local gradients (`bg-gradient-to-b`, etc.) that would conflict with the main gradient
- ✅ **DO** keep sections transparent (no background class) to reveal the main gradient
- ✅ **DO** use light glassmorphism for cards/containers if needed (`bg-v2-charcoal/20 backdrop-blur-md`)
- ✅ **DO** use white text throughout (`text-v2-white`, `text-v2-off-white`)

**Gradient Applied On**: The main wrapper `<motion.div>` in `LandingV3.tsx` via inline style:
```typescript
style={{
  background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
}}
```

## OTHER CONSIDERATIONS

**Responsive Design**:
- Single column layout (already narrow max-w-2xl)
- Mobile: Full width with padding
- Textarea: 6 rows desktop, same on mobile

**Input Styling**:
- Background: Navy 50% opacity
- Border: Cyan 30% opacity
- Focus: Solid cyan border
- Text: White color
- Padding: `px-4 py-3`
- Placeholder: Gray/white with opacity

**Button States**:
- Normal: Cyan background, navy text
- Hover: Electric blue background
- Disabled: 50% opacity, no pointer events
- Submitting: Spinner animation

**Success Animation**:
- Fade in scale effect
- Large checkmark icon (CheckCircle)
- Success message
- Option to send another message

**Error Handling**:
- Validation errors: Show below each field in red
- Submission errors: Show toast notification
- Network errors: Catch and display user-friendly message

**Accessibility**:
- All inputs have labels
- Required fields marked with * and aria-required
- Error messages associated with inputs (aria-describedby)
- Focus states visible
- Keyboard navigation works
- Submit button disabled during submission

**Performance**:
- Form validation runs on blur (React Hook Form default)
- No unnecessary re-renders
- Simple form, no performance concerns

**Security** (Backend):
- Rate limiting (server-side)
- CSRF protection (if using sessions)
- Input sanitization (server-side)
- Captcha (optional, for spam prevention)

Frontend doesn't need security measures beyond validation.

**Gotchas**:
- Must reset form after success: `reset()`
- Ensure backend API endpoint exists or mock works
- Toast hook must be available (already in project)
- Test all validation scenarios (empty, invalid email, short message)

**Known Issues to Avoid**:
- If form doesn't submit, check backend endpoint
- If validation doesn't work, check Zod schema
- If success state doesn't show, check isSuccess state management
- If toast doesn't appear, check useToast hook import

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to contact form
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot of empty form
mcp__playwright__browser_take_screenshot({ filename: "prp-4.1-contact-form.png" })

// Fill form and test validation
// (Manual testing recommended for interactive form)

// Test mobile
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-4.1-contact-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Form displays all 5 fields (Nom, Email, Entreprise, Téléphone, Message)
- [ ] Required fields marked with red *
- [ ] Optional field marked with "(optionnel)"
- [ ] Placeholders visible in inputs
- [ ] Focus states work (cyan border on focus)
- [ ] Validation errors appear on blur for invalid inputs
- [ ] Error messages are red and below fields
- [ ] Submit button shows correct text "Envoyer ma demande"
- [ ] Submit button disabled during submission
- [ ] Spinner shows during submission
- [ ] Success message displays after submission
- [ ] Success message has large checkmark icon
- [ ] Form resets after success
- [ ] Toast notification appears on success
- [ ] Toast notification appears on error
- [ ] Microcopy visible ("Pas de spam, Réponse sous 24h")
- [ ] Magnetic hover effect on submit button
- [ ] Glassmorphism card styling
- [ ] Mobile: Form stacks vertically
- [ ] No console errors

**Success Criteria**:
- ✅ React Hook Form + Zod validation
- ✅ 5 fields: Nom, Email, Entreprise, Message, Téléphone (optional)
- ✅ Real-time validation with error messages
- ✅ Form states: idle, submitting, success, error
- ✅ Success message animation (fade in scale)
- ✅ Reassuring microcopy ("Pas de spam", "Réponse sous 24h")
- ✅ Backend integration (or mock for testing)
- ✅ Toast notifications for success/error
- ✅ Button disabled during submission
- ✅ Spinner animation while submitting
- ✅ Form resets after successful submission
- ✅ Glassmorphism card styling
- ✅ Positioned after CalculatorROI section
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 4.1 - ContactFormSection
- **Prochaine étape**: PRP 4.2 - FaqSection (Accordéon)
