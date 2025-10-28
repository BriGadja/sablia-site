# PRP 4.1: Contact Form Section with Success Animation

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript type-checking
2. **Build Verification**: Production build success
3. **Visual Validation**: Playwright MCP screenshots
4. **Form Submission Testing**: Success/error states

**Confidence Score: 9/10** - This PRP contains comprehensive context including exact code patterns, validation steps, toast integration, and visual testing procedures.

---

## 1. Goal and Why

**What are we building?**
A professional contact form section allowing prospects to reach Sablia. The form includes 5 fields (Nom, Email, Entreprise, Téléphone optional, Message), real-time validation, form state management (idle, submitting, success, error), toast notifications, and a success animation with CheckCircle icon.

**Why are we building it?**
- **Business Value**: Converts landing page visitors into qualified leads
- **User Experience**: Clear, reassuring form with immediate feedback (toasts + success animation)
- **Trust Building**: Microcopy reassures users ("Pas de spam, promis", "Réponse sous 24 heures")
- **Professional Polish**: Success animation provides positive reinforcement and closure
- **Lead Quality**: Required fields (Nom, Email, Entreprise, Message) ensure actionable leads

---

## 2. What (Requirements)

### User-Visible Behavior
1. User sees contact form section after CalculatorROI on LandingV3
2. Form displays 5 fields: Nom*, Email*, Entreprise*, Téléphone (optional), Message*
3. Validation errors appear below fields as user types (real-time)
4. Submit button disabled during submission, shows spinner
5. On success:
   - Form fields hidden/replaced with success animation
   - CheckCircle icon fades in with scale animation
   - Success message: "Message envoyé !"
   - Toast notification: "Nous vous répondrons dans les 24 heures"
   - Form auto-resets after 5 seconds
6. On error:
   - Toast notification with error message (red/destructive variant)
   - Form remains visible for retry
7. Mobile: Single column, stacked fields
8. Desktop: Single column (max-width 2xl), centered

### Functional Requirements
- ✅ 5 input fields: nom (min 2 chars), email (valid email), entreprise (min 2 chars), telephone (optional), message (textarea, min 10 chars)
- ✅ React Hook Form + Zod validation with error messages
- ✅ Form states: idle, submitting, success, error (managed with useState)
- ✅ Backend POST to `/api/contact` with JSON payload (CREATE endpoint if doesn't exist)
- ✅ Alternative: Mock submission with 2-second timeout for testing
- ✅ Toast notifications using `useToast` hook
- ✅ Success animation: CheckCircle icon with fade-in scale effect (Framer Motion)
- ✅ Form reset after successful submission
- ✅ MagneticButton submit with disabled state during submission
- ✅ Reassuring microcopy: "Pas de spam, promis" + "Réponse sous 24 heures"
- ✅ `id="contact"` on section for navigation from other CTAs

### Non-Functional Requirements
- **Performance**: Form submission timeout (10s max), toast clears after 5s
- **Responsiveness**: Works on mobile (375px) to desktop (1920px+)
- **Accessibility**: Labels, error messages, keyboard navigation, focus states, aria-labels
- **Visual Consistency**: Follows v3 glassmorphism patterns, respects gradient background
- **Code Quality**: TypeScript strict mode, follows existing patterns

---

## 3. Success Criteria

The implementation is complete when:
- [ ] Component file created at `client/src/components/v3/ContactFormSection.tsx`
- [ ] 5 input fields with React Hook Form registration and Zod validation
- [ ] Required fields (*) validated: nom, email, entreprise, message
- [ ] Optional field: telephone (no validation errors if empty)
- [ ] Validation errors appear below fields in real-time
- [ ] Submit button shows spinner and disables during submission
- [ ] Success state replaces form with CheckCircle animation + message
- [ ] Success toast notification appears on successful submission
- [ ] Error toast notification appears on failed submission
- [ ] Form resets after 5 seconds in success state
- [ ] Backend endpoint `/api/contact` created in `server/routes.ts` (or mock used)
- [ ] Glassmorphism styling (semi-transparent card with backdrop blur)
- [ ] Single column layout (max-w-2xl) centered on page
- [ ] Section integrated into `LandingV3.tsx` after `CalculatorROI`
- [ ] No console errors
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Visual validation screenshots captured and reviewed

---

## 4. Documentation & References

### Official Documentation
- **React Hook Form**: https://react-hook-form.com/
  - `register()` for field registration
  - `handleSubmit()` for form submission
  - `formState.errors` for validation error display
  - `reset()` to clear form after success
  - `zodResolver` for Zod schema integration

- **Zod Schema Validation**: https://zod.dev/
  - `.string()` for text fields
  - `.email()` for email validation
  - `.min()` for minimum length
  - `.optional()` for non-required fields

- **Framer Motion**: https://www.framer.com/motion/
  - `motion.div` with `initial`, `animate`, `exit` props
  - Scale and fade animations for success state

- **Toast System**: Internal `@/hooks/use-toast`
  - `toast()` function with title, description, variant params
  - Variants: "default" (success), "destructive" (error)

### Relevant Code Examples
- `client/src/pages/GapForm.tsx` - React Hook Form + Zod integration pattern
- `client/src/components/v3/CalculatorROI.tsx` - v3 glassmorphism card styling
- `client/src/components/animations/MagneticElements.tsx` - MagneticButton component
- `client/src/hooks/use-toast.ts` - Toast system hook
- `refonte_graphique/sequence/INITIAL/INITIAL_refonte_sequence_4.1.md` - Complete requirements

### External Resources
- **Form UX Best Practices**: Real-time validation, clear error messages, disabled submit during processing
- **Microcopy**: Reassuring language reduces form abandonment by 20-40%

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── v3/
│   │   ├── CalculatorROI.tsx  ← Section before contact form
│   │   └── (other v3 components)
│   └── animations/
│       └── MagneticElements.tsx  ← Import MagneticButton from here
├── hooks/
│   └── use-toast.ts  ← Import useToast from here
├── pages/
│   └── LandingV3.tsx  ← Add ContactFormSection import and render
server/
└── routes.ts  ← Add POST /api/contact endpoint
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   ├── v3/
│   │   ├── CalculatorROI.tsx
│   │   ├── ContactFormSection.tsx  ← NEW FILE
│   │   └── (other v3 components)
├── pages/
│   └── LandingV3.tsx  ← MODIFIED (add import and render)
server/
└── routes.ts  ← MODIFIED (add POST /api/contact endpoint)
```

### Key Files to Modify
- **CREATE**: `client/src/components/v3/ContactFormSection.tsx` - Main contact form component
- **MODIFY**: `client/src/pages/LandingV3.tsx` - Add import and render after CalculatorROI
- **CREATE/MODIFY**: `server/routes.ts` - Add POST /api/contact endpoint (or use mock for testing)

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- **React Hook Form**: Email validation requires both `.string()` and `.email()` in Zod
- **React Hook Form**: Textarea needs `{...register("message")}` just like inputs
- **React Hook Form**: `reset()` must be called AFTER successful submission, not before
- **Zod**: `.optional()` must come after `.string()` → `.string().optional()` ✅
- **Toast**: `useToast()` hook must be called at component level, not inside handlers
- **Framer Motion**: Success animation needs `AnimatePresence` for exit animations (or use conditional render without exit)

### Common Mistakes
- ❌ **Anti-pattern**: Forgetting to check `telephone.optional()` → required field by mistake
- ✅ **Correct**: `telephone: z.string().optional()`

- ❌ **Anti-pattern**: Using solid background on section (`bg-v2-navy`)
- ✅ **Correct**: Transparent section, glassmorphism on card (`bg-v2-charcoal/30 backdrop-blur-md`)

- ❌ **Anti-pattern**: Not disabling submit button during submission → double submissions
- ✅ **Correct**: `disabled={isSubmitting}` on submit button

- ❌ **Anti-pattern**: Showing success animation without hiding form → confusing UX
- ✅ **Correct**: Conditional render - show form OR success animation, not both

- ❌ **Anti-pattern**: Not resetting form after success → user sees old data
- ✅ **Correct**: Call `reset()` and `setIsSuccess(false)` after timeout

### Error Patterns
- **Error**: "Cannot read property 'message' of undefined"
  - **Cause**: Checking `errors.fieldName.message` without optional chaining
  - **Fix**: Use `errors.fieldName?.message`

- **Error**: "toast is not a function"
  - **Cause**: Forgot to call `useToast()` at component level
  - **Fix**: Add `const { toast } = useToast();` near top of component

- **Error**: Form submits but doesn't reset
  - **Cause**: `reset()` called before async operation completes
  - **Fix**: Call `reset()` inside `try` block AFTER successful response

- **Error**: "Network request failed" in console
  - **Cause**: `/api/contact` endpoint doesn't exist on backend
  - **Fix**: Create endpoint in `server/routes.ts` or use mock with timeout

---

## 7. Data Models & Schemas

### Zod Validation Schema
```typescript
import { z } from "zod";

const contactSchema = z.object({
  nom: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string()
    .email("Adresse email invalide"),
  entreprise: z.string()
    .min(2, "Le nom d'entreprise doit contenir au moins 2 caractères"),
  telephone: z.string()
    .optional(),
  message: z.string()
    .min(10, "Le message doit contenir au moins 10 caractères")
});

type ContactInputs = z.infer<typeof contactSchema>;
```

### Backend Request/Response
```typescript
// POST /api/contact
// Request body:
{
  "nom": "Jean Dupont",
  "email": "jean.dupont@example.com",
  "entreprise": "ACME Corp",
  "telephone": "+33 6 12 34 56 78",  // optional
  "message": "Je souhaite automatiser nos processus RH..."
}

// Success response (201):
{
  "success": true,
  "message": "Message envoyé avec succès"
}

// Error response (500):
{
  "success": false,
  "error": "Erreur lors de l'envoi du message"
}
```

### Form State Management
```typescript
// Local state for form lifecycle
const [isSubmitting, setIsSubmitting] = useState(false);  // true during POST request
const [isSuccess, setIsSuccess] = useState(false);        // true after successful submission
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create ContactFormSection Component File
**Action**: CREATE
**Location**: `client/src/components/v3/ContactFormSection.tsx`
**Details**:
```typescript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle, Send, Loader2 } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";
import { useToast } from "@/hooks/use-toast";

// 1. Define Zod schema (see section 7)
// 2. Define TypeScript types
// 3. Create component with useState for form states
// 4. Create useForm hook with Zod resolver
// 5. Create useToast hook instance
// 6. Define onSubmit handler (async)
// 7. Implement form layout with conditional rendering (form OR success)
```
**Why**: Creates the main contact form component with all necessary imports and structure
**Gotchas**:
- Import MagneticButton with `{ MagneticButton }` (named export)
- Import useToast and call it at component level (not inside handler)
- Keep section background transparent (NO `bg-v2-navy`)

### Task 2: Implement Form Section (Input Fields)
**Action**: INJECT
**Location**: Inside conditional render when `!isSuccess`
**Details**:
```typescript
{!isSuccess ? (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/30 max-w-2xl mx-auto"
  >
    <h3 className="text-3xl font-bold text-v2-white mb-2 text-center">
      Discutons de votre projet
    </h3>
    <p className="text-v2-off-white/70 text-center mb-8">
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
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
          placeholder="Jean Dupont"
        />
        {errors.nom && (
          <p className="text-red-400 text-sm mt-1">{errors.nom.message}</p>
        )}
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
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
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
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
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
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
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
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors resize-none"
          placeholder="Décrivez votre projet d'automatisation..."
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <MagneticButton
        strength={0.2}
        className="w-full bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        onClick={() => {}} // handleSubmit will call onSubmit
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send size={20} />
            <span>Envoyer le message</span>
          </>
        )}
      </MagneticButton>
    </form>
  </motion.div>
) : (
  // Success animation will go here (Task 3)
  null
)}
```
**Why**: Creates complete form with 5 fields, validation, and submit button
**Gotchas**:
- **CRITICAL**: Add asterisk (*) to required field labels for clarity
- Textarea needs `rows` attribute and `resize-none` class for UX
- Submit button must be `type="submit"` inside form OR wrapped by `handleSubmit()`
- MagneticButton should be inside form to trigger submit on click
- Disabled state must check `isSubmitting` to prevent double submissions

### Task 3: Implement Success Animation
**Action**: INJECT
**Location**: Inside conditional render when `isSuccess`
**Details**:
```typescript
{isSuccess && (
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
    <h3 className="text-3xl font-bold text-v2-white mb-3">
      Message envoyé !
    </h3>
    <p className="text-v2-off-white/80 text-lg">
      Merci pour votre message. Nous vous répondrons dans les 24 heures.
    </p>
  </motion.div>
)}
```
**Why**: Provides positive feedback with professional animation
**Gotchas**:
- CheckCircle icon comes from `lucide-react`
- Scale animation should use spring physics for bounce effect
- Success state should auto-clear after 5 seconds (implemented in onSubmit)

### Task 4: Implement Form Submission Handler
**Action**: INJECT
**Location**: Inside component function, before return statement
**Details**:
```typescript
const onSubmit = async (data: ContactInputs) => {
  setIsSubmitting(true);

  try {
    // Option 1: Real backend call
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Échec de l'envoi du message");
    }

    // Option 2: Mock for testing (use this if backend not ready)
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // Success: Show animation + toast
    setIsSuccess(true);
    reset(); // Clear form fields
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les 24 heures.",
      variant: "default"
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
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};
```
**Why**: Handles form submission with proper state management and error handling
**Gotchas**:
- **CRITICAL**: Set `isSubmitting = true` at start, `false` in `finally` block
- Call `reset()` AFTER successful response, not before
- Toast variant "destructive" for errors, "default" for success
- Auto-reset timeout should be 5000ms (5 seconds)
- Use try/catch/finally for proper cleanup

### Task 5: Create Backend Endpoint (or Mock)
**Action**: MODIFY
**Location**: `server/routes.ts`
**Details**:
```typescript
// Add this endpoint inside registerRoutes function, before httpServer creation

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { nom, email, entreprise, telephone, message } = req.body;

    // Validate required fields
    if (!nom || !email || !entreprise || !message) {
      return res.status(400).json({
        success: false,
        error: "Champs requis manquants"
      });
    }

    // TODO: Send email notification or save to database
    console.log('Contact form submission:', {
      nom,
      email,
      entreprise,
      telephone: telephone || 'N/A',
      message
    });

    // For now, just return success
    // Later: integrate with email service (SendGrid, Mailgun, etc.)
    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès"
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
});
```
**Why**: Provides backend endpoint for form submission
**Gotchas**:
- Validate required fields on backend (don't trust client validation alone)
- Log submissions for debugging (remove sensitive data in production)
- Return 201 (Created) for successful submission, not 200
- Return proper error codes: 400 (bad request), 500 (server error)
- TODO comment for future email integration

**Alternative (Mock)**: If backend not ready, use mock in frontend:
```typescript
// In onSubmit handler, replace fetch with:
await new Promise((resolve) => setTimeout(resolve, 2000));
```

### Task 6: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
// 1. Add import at top
import ContactFormSection from "@/components/v3/ContactFormSection";

// 2. Add render after CalculatorROI, before hidden placeholders
<main>
  {/* ...existing sections... */}
  <CalculatorROI />

  {/* Contact Form Section - NEW */}
  <ContactFormSection />

  {/* Hidden section placeholders */}
  <div className="hidden">
    {/* ...existing placeholders... */}
  </div>
</main>
```
**Why**: Makes the contact form visible on the landing page
**Gotchas**:
- Import must use default export: `import ContactFormSection from ...`
- Position is critical: AFTER CalculatorROI, BEFORE hidden placeholders
- No wrapper div needed (component includes its own `<section id="contact">`)

---

## 9. Testing Strategy

### Manual Testing Checklist
After implementation, verify:
- [ ] 5 input fields visible with correct labels
- [ ] Required fields show asterisk (*), optional field shows "(optionnel)"
- [ ] Microcopy visible: "Pas de spam, promis. Réponse sous 24 heures."
- [ ] Typing in nom triggers validation (min 2 chars)
- [ ] Typing invalid email shows "Adresse email invalide"
- [ ] Typing short entreprise shows validation error
- [ ] Telephone field allows empty value (no error)
- [ ] Typing short message (< 10 chars) shows validation error
- [ ] Submit button disabled when form has validation errors
- [ ] Clicking submit shows spinner + "Envoi en cours..."
- [ ] Submit button disabled during submission (can't double-submit)
- [ ] On success: Form replaced with CheckCircle animation
- [ ] On success: Success message "Message envoyé !" appears
- [ ] On success: Toast notification appears
- [ ] On success: Form auto-resets after 5 seconds (returns to idle state)
- [ ] On error: Toast notification with red variant appears
- [ ] On error: Form remains visible for retry
- [ ] Form works on mobile (375px width)
- [ ] Form centered on desktop with max-w-2xl
- [ ] Glassmorphism visible on form card
- [ ] Background gradient visible through section
- [ ] No console errors
- [ ] Backend endpoint logs submission (check server console)

### Test Scenarios

**Scenario 1: Successful Submission**
1. Fill all required fields with valid data
2. Fill optional telephone field
3. Click submit
4. Verify spinner appears
5. Verify success animation after 2s
6. Verify toast notification
7. Wait 5s, verify form returns to idle

**Scenario 2: Validation Errors**
1. Leave nom empty, click submit → Error "minimum 2 caractères"
2. Type invalid email "test@" → Error "Adresse email invalide"
3. Type short message "hello" → Error "minimum 10 caractères"
4. Submit button should be disabled until all valid

**Scenario 3: Backend Error**
1. Kill dev server
2. Fill form and submit
3. Verify error toast appears
4. Verify form remains visible (not replaced with success)
5. Restart server and retry → Success

**Scenario 4: Optional Field**
1. Fill only required fields (leave telephone empty)
2. Submit
3. Verify no validation error for telephone
4. Verify submission succeeds

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: No TypeScript errors

### Level 2: Build
```bash
npm run build
```
**Expected**: Build succeeds, no errors

### Level 3: Visual Validation (Playwright MCP)
```javascript
// 1. Start dev server (if not running)
npm run dev

// 2. Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// 3. Scroll to contact section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })"
})

// 4. Wait for scroll animation
mcp__playwright__browser_wait_for({ time: 2 })

// 5. Screenshot: Empty form (initial state)
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.1-contact-form-empty.png"
})

// 6. Fill form fields
mcp__playwright__browser_type({
  element: "nom input",
  ref: "input[name='nom']",
  text: "Jean Dupont"
})
mcp__playwright__browser_type({
  element: "email input",
  ref: "input[name='email']",
  text: "jean.dupont@example.com"
})
mcp__playwright__browser_type({
  element: "entreprise input",
  ref: "input[name='entreprise']",
  text: "ACME Corp"
})
mcp__playwright__browser_type({
  element: "message textarea",
  ref: "textarea[name='message']",
  text: "Je souhaite automatiser nos processus RH et comptabilité."
})

// 7. Screenshot: Filled form
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.1-contact-form-filled.png"
})

// 8. Submit form
mcp__playwright__browser_click({
  element: "submit button",
  ref: "button[type='submit']"
})

// 9. Wait for success animation
mcp__playwright__browser_wait_for({ time: 3 })

// 10. Screenshot: Success state with CheckCircle
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.1-contact-form-success.png"
})

// 11. Test validation error (clear email and type invalid)
mcp__playwright__browser_wait_for({ time: 6 }) // Wait for auto-reset
mcp__playwright__browser_click({
  element: "email input",
  ref: "input[name='email']"
})
mcp__playwright__browser_evaluate({
  function: "() => { const input = document.querySelector('input[name=\"email\"]'); if (input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); } }"
})
mcp__playwright__browser_type({
  element: "email input",
  ref: "input[name='email']",
  text: "invalid-email"
})
mcp__playwright__browser_wait_for({ time: 1 })

// 12. Screenshot: Validation error
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.1-contact-form-validation-error.png"
})

// 13. Test mobile responsive
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.1-contact-form-mobile.png"
})
```

**Expected Visual Results**:
1. Empty form screenshot shows 5 fields, microcopy, submit button
2. Filled form screenshot shows typed values in all fields
3. Success screenshot shows CheckCircle icon + success message (no form)
4. Validation error screenshot shows red error message below email field
5. Mobile screenshot shows single column layout, fields stacked
6. Gradient background visible through section
7. Glassmorphism blur effect visible on cards

---

## 11. Integration Points

### Component Integration
- **Import**: `import ContactFormSection from "@/components/v3/ContactFormSection";`
- **Render**: Place in `LandingV3.tsx` after `<CalculatorROI />`
- **Dependencies**: Uses existing `MagneticButton`, `ScrollReveal`, `useToast` components

### Backend Integration
- **Endpoint**: `POST /api/contact`
- **Request**: JSON body with 5 fields (nom, email, entreprise, telephone?, message)
- **Response**: JSON with success flag and message
- **Future Enhancement**: Integrate with email service (SendGrid, Mailgun) or CRM

### Toast System Integration
- **Hook**: `useToast()` from `@/hooks/use-toast`
- **Success**: `toast({ title, description, variant: "default" })`
- **Error**: `toast({ title, description, variant: "destructive" })`

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Use solid background on section (`bg-v2-navy`) - breaks gradient system
- ❌ Forget `.optional()` on telephone field - makes it required by mistake
- ❌ Call `reset()` before successful response - user loses data on error
- ❌ Skip `isSubmitting` check on submit button - allows double submissions
- ❌ Show both form AND success animation - confusing UX
- ❌ Forget timeout for auto-reset - success animation stays forever
- ❌ Use `errors.fieldName.message` without `?.` - crashes on undefined

### DO:
- ✅ Keep section transparent - let gradient show through
- ✅ Use `.string().optional()` for telephone field
- ✅ Call `reset()` AFTER successful submission in try block
- ✅ Disable submit button with `disabled={isSubmitting}`
- ✅ Conditional render: show form OR success, never both
- ✅ Set 5-second timeout to auto-reset success state
- ✅ Use optional chaining: `errors.fieldName?.message`

---

## 13. Progressive Success

### Phase 1: Basic Form (MVP)
1. Create component file
2. Set up form with React Hook Form + Zod
3. Add 5 input fields (4 text inputs + 1 textarea)
4. Implement basic validation
5. Add submit button
6. Integrate into LandingV3

**Validation**: TypeScript check passes, form renders

### Phase 2: Submission & States
7. Add `isSubmitting` and `isSuccess` state
8. Implement onSubmit handler with fetch/mock
9. Add spinner to submit button
10. Disable submit during submission
11. Add useToast integration
12. Create backend endpoint (or use mock)

**Validation**: Form submits, toasts appear

### Phase 3: Success Animation & Polish
13. Implement success animation with CheckCircle
14. Add conditional render (form OR success)
15. Add auto-reset timeout (5 seconds)
16. Add glassmorphism styling
17. Add icons (Send, CheckCircle, Loader2)
18. Add microcopy ("Pas de spam, promis")
19. Test all scenarios (success, error, validation)
20. Take Playwright screenshots

**Validation**: All gates pass, screenshots reviewed

---

## Final Validation Checklist

Before marking complete:
- [ ] Component created at correct path
- [ ] All 5 fields present (4 required + 1 optional)
- [ ] Validation working (required fields, email format, min lengths)
- [ ] Submit button disabled during submission
- [ ] Spinner shown during submission
- [ ] Success animation with CheckCircle appears
- [ ] Toast notifications working (success + error variants)
- [ ] Form resets after successful submission
- [ ] Auto-reset after 5 seconds in success state
- [ ] Backend endpoint created (or mock used)
- [ ] Backend logs submission to console
- [ ] Glassmorphism styling applied
- [ ] Gradient background visible (not blocked)
- [ ] Single column layout (max-w-2xl) centered
- [ ] Microcopy present ("Pas de spam, promis", "Réponse sous 24 heures")
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Visual validation screenshots captured
- [ ] No console errors
- [ ] All manual test scenarios pass
- [ ] Form works on mobile and desktop

---

## Confidence Score: 9/10

**Why this score?**
- ✅ Complete code patterns provided
- ✅ Exact file paths specified
- ✅ Validation commands included
- ✅ Visual testing procedure detailed
- ✅ All gotchas documented
- ✅ Toast integration clearly explained
- ✅ Success animation pattern provided
- ✅ Backend endpoint template included
- ✅ Existing patterns referenced (GapForm.tsx)

**What could improve it to 10?**
- E2E tests with Playwright would increase confidence (not required for this feature)
- Email service integration guide (deferred to future enhancement)

This PRP provides sufficient context for an AI agent to implement the feature successfully in one pass.
