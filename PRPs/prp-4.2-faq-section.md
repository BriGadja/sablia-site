# PRP 4.2: FAQ Section with Accordion Animation

## Philosophy: Context is King

This PRP implements a professional FAQ section with custom Framer Motion accordion animations, following LandingV3's gradient background system and v3 component patterns.

**Validation Loop:**
1. TypeScript type-checking
2. Production build
3. Visual validation with Playwright MCP

---

## 1. Goal and Why

**What are we building?**
A FAQ section with 8-10 questions displayed in an accordion layout. Questions collapse/expand with smooth animations, showing one answer at a time. The section uses custom Framer Motion animations (not shadcn/ui Accordion) and follows the v3 glassmorphism design pattern.

**Why are we building it?**
- Addresses common objections and questions before contact
- Reduces friction in the decision-making process
- Demonstrates expertise and transparency
- Improves SEO with structured FAQ content
- Positioned strategically after ContactFormSection (penultimate section before Footer)

---

## 2. What (Requirements)

### User-Visible Behavior

**Desktop Experience (≥1024px):**
- 8-10 FAQ items displayed in 2-column grid
- Questions appear as clickable cards with glassmorphism styling
- Clicking a question smoothly slides down the answer with height animation (300ms)
- Icon changes from Plus (+) to Minus (−) with 45° rotation
- Clicking another question closes the previous one (exclusive accordion)
- Clicking the same question again closes it
- Hover effect on question cards (background color change)

**Mobile Experience (<1024px):**
- Single column stack
- Same interaction behavior as desktop
- Question text wraps appropriately

**Scroll Entry Animation:**
- Section title and subtitle fade in with ScrollReveal
- FAQ cards appear with staggered fade-in (each card delays by index × 0.1s)

### Functional Requirements

**Core Functionality:**
- Exclusive accordion: Only 1 question open at a time
- Toggle behavior: Click open question to close it
- Smooth height animation for answer reveal/hide
- Icon animation synchronized with content animation
- State management for active question ID

**Content Requirements:**
- 8 FAQ questions (provided in INITIAL.md)
- Questions reflect B2B automation services for French SMBs
- Professional, clear, jargon-free French language
- Answers provide specific details (tools, timelines, pricing references)

**Technical Requirements:**
- Component path: `client/src/components/v3/FaqSection.tsx`
- Use Framer Motion for all animations (NOT shadcn/ui Accordion)
- lucide-react icons: Plus, Minus
- State management with React useState
- Integration into LandingV3.tsx as tenth section (after ContactFormSection, before Footer)

### Non-Functional Requirements

**Performance:**
- Animations run at 60fps (GPU-accelerated via Framer Motion)
- No layout shift during accordion animation
- Minimal re-renders (only when activeId changes)

**Accessibility:**
- Clickable buttons with keyboard navigation support
- Visible focus states
- Sufficient color contrast (white text on dark gradient)
- Semantic HTML structure

**Design Consistency:**
- Follows LandingV3 gradient system (transparent section background)
- Glassmorphism cards: `bg-v2-charcoal/30 backdrop-blur-md`
- Typography matches v3 patterns
- Consistent spacing with other v3 sections

---

## 3. Success Criteria

The implementation is complete when:
- [x] FaqSection component created at `client/src/components/v3/FaqSection.tsx`
- [x] 8 FAQ items display correctly in 2-column grid (desktop) and 1-column (mobile)
- [x] Accordion opens/closes smoothly with 300ms animation
- [x] Only 1 question open at a time (exclusive accordion behavior)
- [x] Plus/Minus icon swap with rotation animation
- [x] Hover effect on question buttons works
- [x] Staggered card reveal animation on scroll entry
- [x] Section respects gradient background (no solid bg)
- [x] Component integrated into LandingV3.tsx after ContactFormSection
- [x] TypeScript check passes with zero errors
- [x] Production build succeeds
- [x] Visual validation confirms all animations work correctly

---

## 4. Documentation & References

### Framer Motion Documentation

**AnimatePresence (Critical for accordion):**
- https://www.framer.com/motion/animate-presence/
- Used for smooth enter/exit animations when answer shows/hides
- Requires unique `key` prop on animated elements
- Must wrap conditionally rendered elements

**Motion Components:**
- https://www.framer.com/motion/component/
- `motion.div` for animated containers
- `initial`, `animate`, `exit` props for state transitions
- `transition` for timing and easing

**Animation Best Practices:**
- https://www.framer.com/motion/animation/
- Use `ease: "easeInOut"` for accordion smooth transitions
- `height: "auto"` works but can cause minor layout shift (acceptable)
- `overflow: hidden` required on AnimatePresence parent

### Lucide React Icons

- https://lucide.dev/icons/
- Plus icon: Question closed state
- Minus icon: Question open state
- Icons are tree-shakeable (only import what you use)

### Relevant Code Examples

**`client/src/components/v3/PricingSection.tsx`** - Demonstrates:
- ScrollReveal usage for section headers
- Staggered card reveal with `whileInView` and delay
- Glassmorphism card styling pattern
- 3-column responsive grid (similar to 2-column FAQ)

**`client/src/components/v3/ThreeStepProcess.tsx`** - Demonstrates:
- Staggered animations with delays
- Card reveal patterns on scroll
- GSAP integration (NOT needed for FAQ, use Framer Motion only)

**`client/src/components/v3/ContactFormSection.tsx`** - Demonstrates:
- Conditional rendering with state
- AnimatePresence for smooth state transitions
- Success animation pattern (useful reference for accordion)

**`client/src/components/v2/FaqSection.tsx`** - Reference ONLY for content structure:
- Shows existing FAQ questions (OUTDATED content)
- Uses shadcn/ui Accordion (DO NOT copy this approach)
- We need custom Framer Motion accordion for v3

### External Resources

**Accordion Animation Tutorial:**
- https://blog.olivierlarose.com/tutorials/accordion-framer-motion
- Demonstrates height: "auto" technique with AnimatePresence
- Shows how to handle overflow for smooth animations

**React Hook Patterns:**
- https://react.dev/reference/react/useState
- State management for activeId

---

## 5. Codebase Context

### Current LandingV3 Structure

```typescript
// client/src/pages/LandingV3.tsx (relevant excerpt)
export default function LandingV3() {
  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
      }}
      // ... other props
    >
      <AnimatedParticles />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />           {/* Section 1 */}
          <TestimonialsSection />   {/* Section 2 */}
          <LogosCloud />            {/* Section 3 */}
          <ProblemSection />        {/* Section 4 */}
          <SolutionSection />       {/* Section 5 */}
          <ThreeStepProcess />      {/* Section 6 */}
          <PricingSection />        {/* Section 7 */}
          <CalculatorROI />         {/* Section 8 */}
          <ContactFormSection />    {/* Section 9 */}
          {/* INSERT FaqSection HERE as Section 10 */}
        </main>
        <Footer />
      </div>
      <CustomCursor />
    </motion.div>
  );
}
```

### Desired Structure (After Implementation)

```
client/src/components/v3/
├── Navigation.tsx
├── HeroSection.tsx
├── TestimonialsSection.tsx
├── LogosCloud.tsx
├── ProblemSection.tsx
├── SolutionSection.tsx
├── ThreeStepProcess.tsx
├── PricingSection.tsx
├── CalculatorROI.tsx
├── ContactFormSection.tsx
└── FaqSection.tsx          ← NEW FILE
```

### Key Files to Modify

**CREATE:**
- `client/src/components/v3/FaqSection.tsx` - New FAQ component with custom accordion

**MODIFY:**
- `client/src/pages/LandingV3.tsx` - Import FaqSection and add as tenth section

---

## 6. Known Gotchas & Pitfalls

### Framer Motion Specific

**AnimatePresence Requirements:**
- ❌ **Mistake**: Forgetting `key` prop on conditionally rendered elements
  ```typescript
  // WRONG - AnimatePresence won't work
  {activeId === faq.id && <motion.div>Answer</motion.div>}
  ```
- ✅ **Correct**: Always add unique key when using exit animations
  ```typescript
  // CORRECT
  <AnimatePresence>
    {activeId === faq.id && (
      <motion.div key={faq.id}>Answer</motion.div>
    )}
  </AnimatePresence>
  ```

**Height Animation Issues:**
- ❌ **Mistake**: Using fixed height values (causes cut-off text)
- ✅ **Correct**: Use `height: "auto"` for flexible content
- ⚠️ **Note**: Minor layout shift is acceptable for accordion UX

**Overflow Hidden:**
- ❌ **Mistake**: Forgetting `overflow-hidden` on animated container
  ```typescript
  // WRONG - content spills during animation
  <motion.div animate={{ height: "auto" }}>
  ```
- ✅ **Correct**: Always add overflow-hidden
  ```typescript
  // CORRECT
  <motion.div className="overflow-hidden" animate={{ height: "auto" }}>
  ```

### State Management

**Exclusive Accordion Logic:**
```typescript
// Correct toggle logic for exclusive accordion
const toggleQuestion = (id: number) => {
  setActiveId(activeId === id ? null : id);
};

// WRONG - allows multiple questions open
const toggleQuestion = (id: number) => {
  setActiveId(id); // Always sets, never closes
};
```

**TypeScript Type for activeId:**
```typescript
// Correct - nullable number
const [activeId, setActiveId] = useState<number | null>(null);

// WRONG - non-nullable (can't represent "all closed" state)
const [activeId, setActiveId] = useState<number>(1);
```

### Gradient System Critical Rules

**DO NOT use solid backgrounds:**
```typescript
// ❌ WRONG - hides gradient
<section className="py-24 bg-v2-navy">

// ❌ WRONG - conflicts with main gradient
<section className="py-24 bg-gradient-to-b from-v2-navy to-v2-charcoal">

// ✅ CORRECT - transparent, reveals gradient
<section className="py-24 relative overflow-hidden">

// ✅ CORRECT - light glassmorphism for cards
<div className="bg-v2-charcoal/30 backdrop-blur-md">
```

**Always use white text:**
- Section headings: `text-v2-white`
- Body text: `text-v2-off-white/80`
- Icons: `text-v2-cyan` (accent color)

### Icon Animation Synchronization

**Ensure icon animation matches content timing:**
```typescript
// Icon rotation
<motion.div animate={{ rotate: activeId === faq.id ? 45 : 0 }} transition={{ duration: 0.3 }}>

// Answer reveal
<motion.div
  animate={{ height: "auto", opacity: 1 }}
  transition={{ duration: 0.3, ease: "easeInOut" }} // Must match icon timing
>
```

### Common React/TypeScript Errors

**Interface Definition:**
```typescript
// Correct - id is number for exclusive accordion logic
interface FaqItem {
  id: number;  // Not string - used for activeId comparison
  question: string;
  answer: string;
}
```

---

## 7. Data Models & Schemas

### FaqItem Interface

```typescript
interface FaqItem {
  id: number;        // Unique identifier (1, 2, 3...)
  question: string;  // The question text
  answer: string;    // The detailed answer
}
```

### FAQ Data (Copy exactly as provided)

```typescript
const faqs: FaqItem[] = [
  {
    id: 1,
    question: "Quels sont les outils d'automatisation que vous utilisez ?",
    answer: "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation."
  },
  {
    id: 2,
    question: "Combien de temps faut-il pour automatiser un processus ?",
    answer: "Un workflow simple peut être développé en 3-7 jours. Pour un système complet avec plusieurs processus interconnectés, comptez 2-4 semaines. Chaque projet inclut une phase d'audit pour vous donner un calendrier précis."
  },
  {
    id: 3,
    question: "Mes équipes doivent-elles avoir des compétences techniques ?",
    answer: "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Les formations sont adaptées au niveau de chacun et incluent des cas pratiques métier."
  },
  {
    id: 4,
    question: "Quel est le ROI typique d'un projet d'automatisation ?",
    answer: "En moyenne, nos clients économisent entre 50 000€ et 150 000€ par an pour une transformation complète. Le ROI se mesure en heures de travail économisées, réduction d'erreurs, et capacité à scaler sans recruter."
  },
  {
    id: 5,
    question: "Proposez-vous un support après la mise en production ?",
    answer: "Oui. Chaque projet inclut une période de support post-livraison (2 semaines à 3 mois selon l'offre). Nous proposons également des accompagnements continus via nos formules de retainer."
  },
  {
    id: 6,
    question: "Peut-on commencer petit avant de transformer toute l'entreprise ?",
    answer: "Absolument. Nous recommandons de démarrer par l'Audit Express (350€) ou un Workflow Simple (2 500-5 000€) pour valider l'approche. Vous pouvez ensuite scaler progressivement selon vos besoins."
  },
  {
    id: 7,
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Nous accompagnons principalement des PME et ETI (10-250 personnes). Notre expertise est particulièrement adaptée aux structures qui souhaitent gagner en efficacité sans déployer des solutions enterprise complexes."
  },
  {
    id: 8,
    question: "Quelle est la différence entre n8n et Make.com ?",
    answer: "N8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com (ex-Integromat) est un SaaS européen plus accessible pour débuter. Nous vous guidons vers l'outil le mieux adapté à votre contexte."
  }
];
```

**Note on Content:**
- 8 questions total (meets 8-10 requirement)
- Questions reflect real B2B automation concerns
- Answers provide specific details (prices, timelines, tools)
- French language, professional B2B tone
- No emojis (maintaining B2B credibility)

---

## 8. Implementation Tasks

### Task 1: Create FaqSection Component File

**Action**: CREATE
**Location**: `client/src/components/v3/FaqSection.tsx`

**Details**:
Create new file with complete implementation:

```typescript
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * FaqSection - Accordion FAQ with Framer Motion animations
 *
 * Features:
 * - 8 FAQ items with accordion behavior
 * - Exclusive accordion: only 1 open at a time
 * - Smooth height animation (300ms)
 * - Plus/Minus icon swap with rotation
 * - 2-column desktop, 1-column mobile
 * - Glassmorphism styling
 * - Staggered reveal on scroll
 */

// ============================================
// TypeScript Interface
// ============================================

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// ============================================
// FAQ Data
// ============================================

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "Quels sont les outils d'automatisation que vous utilisez ?",
    answer: "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation."
  },
  {
    id: 2,
    question: "Combien de temps faut-il pour automatiser un processus ?",
    answer: "Un workflow simple peut être développé en 3-7 jours. Pour un système complet avec plusieurs processus interconnectés, comptez 2-4 semaines. Chaque projet inclut une phase d'audit pour vous donner un calendrier précis."
  },
  {
    id: 3,
    question: "Mes équipes doivent-elles avoir des compétences techniques ?",
    answer: "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Les formations sont adaptées au niveau de chacun et incluent des cas pratiques métier."
  },
  {
    id: 4,
    question: "Quel est le ROI typique d'un projet d'automatisation ?",
    answer: "En moyenne, nos clients économisent entre 50 000€ et 150 000€ par an pour une transformation complète. Le ROI se mesure en heures de travail économisées, réduction d'erreurs, et capacité à scaler sans recruter."
  },
  {
    id: 5,
    question: "Proposez-vous un support après la mise en production ?",
    answer: "Oui. Chaque projet inclut une période de support post-livraison (2 semaines à 3 mois selon l'offre). Nous proposons également des accompagnements continus via nos formules de retainer."
  },
  {
    id: 6,
    question: "Peut-on commencer petit avant de transformer toute l'entreprise ?",
    answer: "Absolument. Nous recommandons de démarrer par l'Audit Express (350€) ou un Workflow Simple (2 500-5 000€) pour valider l'approche. Vous pouvez ensuite scaler progressivement selon vos besoins."
  },
  {
    id: 7,
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Nous accompagnons principalement des PME et ETI (10-250 personnes). Notre expertise est particulièrement adaptée aux structures qui souhaitent gagner en efficacité sans déployer des solutions enterprise complexes."
  },
  {
    id: 8,
    question: "Quelle est la différence entre n8n et Make.com ?",
    answer: "N8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com (ex-Integromat) est un SaaS européen plus accessible pour débuter. Nous vous guidons vers l'outil le mieux adapté à votre contexte."
  }
];

// ============================================
// Main Component
// ============================================

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur nos services d'automatisation
          </p>
        </ScrollReveal>

        {/* FAQ Grid - 2 columns desktop, 1 column mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-v2-charcoal/30 backdrop-blur-md rounded-xl overflow-hidden border border-v2-cyan/20"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-v2-charcoal/50 transition-colors"
                aria-expanded={activeId === faq.id}
              >
                <h3 className="text-lg font-semibold text-v2-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeId === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {activeId === faq.id ? (
                    <Minus size={24} className="text-v2-cyan" />
                  ) : (
                    <Plus size={24} className="text-v2-cyan" />
                  )}
                </motion.div>
              </button>

              {/* Answer (Animated with AnimatePresence) */}
              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div
                    key={`answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-v2-off-white/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Why**: Creates complete FAQ component with all required functionality

**Gotchas**:
- Must use `AnimatePresence` for smooth exit animations
- Key prop `answer-${faq.id}` required for AnimatePresence
- `overflow-hidden` on motion.div prevents content spill during animation
- State type `number | null` allows "all closed" state

---

### Task 2: Import FaqSection into LandingV3

**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`

**Details**:

**Step 2.1 - Add import at top of file:**
```typescript
// FIND this import block (around line 14):
import ContactFormSection from "@/components/v3/ContactFormSection";

// ADD immediately after:
import FaqSection from "@/components/v3/FaqSection";
```

**Step 2.2 - Add component to main section:**
```typescript
// FIND this line (around line 62):
<ContactFormSection />

// ADD immediately after:
{/* FAQ Section */}
<FaqSection />
```

**Why**: Integrates FAQ as tenth section, positioned after ContactFormSection and before Footer

**Gotchas**:
- Must come after ContactFormSection (not before)
- Must be inside the `<main>` tag
- Must be above the hidden section placeholders div

---

### Task 3: Verify TypeScript Compilation

**Action**: VERIFY
**Command**: `npm run check`

**Expected Output**:
```
> check
> tsc --noEmit

# Should complete with no errors in FaqSection.tsx or LandingV3.tsx
```

**If Errors Occur:**
- Check all imports are correct (motion, AnimatePresence, useState, Plus, Minus, ScrollReveal)
- Verify FaqItem interface matches data structure
- Ensure activeId type is `number | null`

**Why**: Catches type errors before runtime

---

### Task 4: Build for Production

**Action**: VERIFY
**Command**: `npm run build`

**Expected Output**:
```
> build
> ...
vite v5.x.x building for production...
✓ built in XXXXms
```

**If Build Fails:**
- Check for syntax errors
- Verify all dependencies are installed
- Ensure no circular imports

**Why**: Confirms production-ready code

---

### Task 5: Visual Validation with Playwright

**Action**: VERIFY
**Commands**: See Visual Validation section below

**Expected Behavior:**
- Section appears after ContactFormSection
- 8 FAQ cards in 2-column grid (desktop)
- Questions are clickable
- Clicking opens answer smoothly (300ms slide down)
- Icon changes from Plus to Minus with rotation
- Clicking another question closes previous one
- Hover effect visible on question buttons

**Why**: Confirms all animations work correctly

---

## 9. Testing Strategy

### Manual Testing with Playwright MCP

**Step 1: Start Dev Server**
```bash
npm run dev
```

**Step 2: Navigate to Page**
```javascript
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
```

**Step 3: Scroll to FAQ Section**
```javascript
// Scroll near bottom (FAQ is penultimate section)
mcp__playwright__browser_evaluate({
  function: "() => { const faq = document.querySelector('#faq'); faq?.scrollIntoView({ behavior: 'smooth' }); }"
})

mcp__playwright__browser_wait_for({ time: 2 })
```

**Step 4: Capture Screenshots**

**Desktop - All Closed:**
```javascript
mcp__playwright__browser_take_screenshot({
  filename: "prp-4.2-faq-desktop-closed.png"
})
```

**Desktop - One Open (Manual Test):**
- Click first question button
- Verify smooth slide-down animation
- Verify Plus → Minus icon change
- Verify icon rotation
- Take screenshot manually

**Mobile Layout:**
```javascript
mcp__playwright__browser_resize({ width: 375, height: 812 })

mcp__playwright__browser_evaluate({
  function: "() => { const faq = document.querySelector('#faq'); faq?.scrollIntoView({ behavior: 'smooth' }); }"
})

mcp__playwright__browser_wait_for({ time: 1 })

mcp__playwright__browser_take_screenshot({
  filename: "prp-4.2-faq-mobile.png"
})
```

### Manual Testing Checklist

Run through these tests manually in browser:

**Layout & Appearance:**
- [ ] 8 FAQ items visible
- [ ] Desktop: 2-column grid layout
- [ ] Mobile (<1024px): 1-column stack
- [ ] Cards have glassmorphism styling (semi-transparent)
- [ ] Section background is transparent (gradient shows through)
- [ ] Text is white and readable
- [ ] Icons are cyan color

**Interaction:**
- [ ] Questions are clickable (cursor: pointer on hover)
- [ ] Clicking question opens answer smoothly
- [ ] Answer slides down with 300ms animation
- [ ] Icon changes from Plus to Minus
- [ ] Icon rotates 45° smoothly
- [ ] Clicking same question again closes it
- [ ] Clicking different question closes previous one (exclusive)
- [ ] Hover effect changes background color

**Animation Quality:**
- [ ] Staggered reveal on scroll entry (each card delays)
- [ ] No jank or stuttering (60fps)
- [ ] Height animation is smooth (no abrupt jumps)
- [ ] Icon rotation syncs with answer animation

**Accessibility:**
- [ ] Button has `aria-expanded` attribute
- [ ] Keyboard navigation works (Tab key)
- [ ] Focus state visible on questions
- [ ] Color contrast sufficient for readability

**Performance:**
- [ ] No console errors
- [ ] Animations feel smooth
- [ ] No excessive re-renders (check React DevTools if available)

---

## 10. Validation Gates

### Level 1: TypeScript Type-Checking
```bash
npm run check
```

**Must Pass**: Zero TypeScript errors in FaqSection.tsx and LandingV3.tsx

**Common Errors & Fixes:**
- `Cannot find module '@/components/animations/ScrollReveal'`
  - Fix: Check path alias is correct (should work with @/ prefix)
- `Property 'id' does not exist on type 'FaqItem'`
  - Fix: Verify FaqItem interface matches data structure
- `Type 'number' is not assignable to type 'number | null'`
  - Fix: Ensure activeId state is typed as `useState<number | null>(null)`

### Level 2: Production Build
```bash
npm run build
```

**Must Pass**: Build completes successfully with no errors

**If Build Fails:**
- Check for unused imports (may cause tree-shaking warnings)
- Verify all components export default
- Ensure no circular dependencies

### Level 3: Visual Validation

**Process:**
1. Start dev server: `npm run dev`
2. Use Playwright MCP to navigate and screenshot (see Testing Strategy)
3. Manually test accordion interactions in browser
4. Verify all items in Manual Testing Checklist pass

**Must Pass**: All checklist items verified ✓

---

## 11. Integration Points

### LandingV3.tsx Integration

**Import Statement (line ~15):**
```typescript
import FaqSection from "@/components/v3/FaqSection";
```

**Component Render (line ~63):**
```typescript
<ContactFormSection />

{/* FAQ Section */}
<FaqSection />

{/* Hidden section placeholders */}
<div className="hidden">
  {/* ... */}
</div>
```

### Section Order Confirmation

After integration, LandingV3 section order should be:
1. HeroSection
2. TestimonialsSection
3. LogosCloud
4. ProblemSection
5. SolutionSection
6. ThreeStepProcess
7. PricingSection
8. CalculatorROI
9. ContactFormSection
10. **FaqSection** ← NEW
11. Footer

### ID Anchor for Navigation

The FAQ section includes `id="faq"` for scroll navigation:
```typescript
<section id="faq" className="py-24 relative overflow-hidden">
```

This allows linking to FAQ: `#faq` or smooth scroll from other sections.

---

## 12. Critical Anti-Patterns

### DO NOT:

❌ **Use shadcn/ui Accordion component**
```typescript
// WRONG - v2 pattern, not v3
import { Accordion, AccordionItem } from "@/components/ui/accordion";
```
✅ **Use custom Framer Motion accordion** (as shown in Task 1)

---

❌ **Use solid section background**
```typescript
// WRONG - hides gradient
<section className="py-24 bg-v2-navy">
```
✅ **Keep section transparent**
```typescript
// CORRECT - gradient shows through
<section className="py-24 relative overflow-hidden">
```

---

❌ **Forget AnimatePresence for exit animations**
```typescript
// WRONG - answer disappears instantly (no exit animation)
{activeId === faq.id && (
  <motion.div animate={{ height: "auto" }}>
    <p>{faq.answer}</p>
  </motion.div>
)}
```
✅ **Wrap with AnimatePresence**
```typescript
// CORRECT - smooth exit animation
<AnimatePresence>
  {activeId === faq.id && (
    <motion.div
      key={`answer-${faq.id}`}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <p>{faq.answer}</p>
    </motion.div>
  )}
</AnimatePresence>
```

---

❌ **Allow multiple questions open (non-exclusive)**
```typescript
// WRONG - non-exclusive accordion
const toggleQuestion = (id: number) => {
  setActiveId(id); // Always sets, never toggles
};
```
✅ **Implement exclusive accordion**
```typescript
// CORRECT - only 1 open at a time
const toggleQuestion = (id: number) => {
  setActiveId(activeId === id ? null : id);
};
```

---

❌ **Forget overflow-hidden on animated container**
```typescript
// WRONG - content visible during height animation
<motion.div animate={{ height: "auto" }}>
```
✅ **Add overflow-hidden**
```typescript
// CORRECT - content hidden during animation
<motion.div className="overflow-hidden" animate={{ height: "auto" }}>
```

---

❌ **Mismatch animation timings**
```typescript
// WRONG - icon rotates slower than answer
<motion.div animate={{ rotate: 45 }} transition={{ duration: 0.5 }}>

<motion.div animate={{ height: "auto" }} transition={{ duration: 0.3 }}>
```
✅ **Synchronize all animations**
```typescript
// CORRECT - both use 0.3s duration
<motion.div animate={{ rotate: 45 }} transition={{ duration: 0.3 }}>

<motion.div animate={{ height: "auto" }} transition={{ duration: 0.3 }}>
```

### DO:

✅ **Follow v3 component patterns**
- Use ScrollReveal for section headers
- Use motion.div with whileInView for cards
- Use glassmorphism styling (bg-v2-charcoal/30 backdrop-blur-md)
- Use white text throughout

✅ **Use staggered animations**
```typescript
// Delay each card by index × 0.1s
transition={{ duration: 0.5, delay: index * 0.1 }}
```

✅ **Add ARIA attributes for accessibility**
```typescript
<button aria-expanded={activeId === faq.id}>
```

✅ **Test on both desktop and mobile**
- Desktop: 2-column grid (grid-cols-2)
- Mobile: 1-column stack (grid-cols-1)

---

## 13. Progressive Success

### Minimal Viable Implementation (Complete All Tasks 1-2):
1. FaqSection component created with 8 questions
2. Component integrated into LandingV3
3. Basic accordion functionality working (click to open/close)

### Add Quality (Task 3-4):
4. TypeScript check passes
5. Production build succeeds

### Validate Visually (Task 5):
6. Playwright screenshots confirm layout
7. Manual testing confirms all animations work
8. Checklist items verified

**Total Time Estimate**: 45-60 minutes for experienced developer

---

## Final Validation Checklist

Before marking PRP complete:

**Code Quality:**
- [ ] TypeScript check passes (npm run check)
- [ ] Production build succeeds (npm run build)
- [ ] No console errors in browser
- [ ] Code follows v3 patterns (glassmorphism, ScrollReveal, etc.)

**Functionality:**
- [ ] 8 FAQ items display correctly
- [ ] Accordion opens/closes smoothly
- [ ] Only 1 question open at a time (exclusive)
- [ ] Click same question to close it
- [ ] Icon changes Plus ↔ Minus with rotation
- [ ] Hover effect on questions works

**Design:**
- [ ] 2-column grid on desktop (≥1024px)
- [ ] 1-column stack on mobile (<1024px)
- [ ] Section respects gradient background (no solid bg)
- [ ] Glassmorphism cards with semi-transparent bg
- [ ] White text readable on gradient
- [ ] Cyan icons visible

**Animation:**
- [ ] Staggered card reveal on scroll entry
- [ ] Answer slides down smoothly (300ms)
- [ ] Answer slides up smoothly when closed
- [ ] Icon rotation synchronized with content
- [ ] Animations run at 60fps (no jank)

**Integration:**
- [ ] FaqSection imported in LandingV3.tsx
- [ ] Component rendered after ContactFormSection
- [ ] Component rendered before Footer
- [ ] Section has id="faq" for navigation

**Testing:**
- [ ] Visual validation screenshots captured
- [ ] Manual testing checklist completed
- [ ] Tested on both desktop and mobile viewports
- [ ] All accessibility checks pass

---

## Confidence Score: 9/10

**Why 9/10:**
- ✅ Complete code implementation provided
- ✅ All Framer Motion patterns documented with examples
- ✅ Gradient system rules clearly defined
- ✅ Common pitfalls identified with fixes
- ✅ Validation gates and testing strategy defined
- ✅ Integration points clearly specified
- ✅ Visual validation procedure with Playwright commands

**Minor uncertainty (-1):**
- Manual interaction testing required (opening/closing questions) - Playwright automation for clicks could be added but manual testing is often more reliable for UX validation

**Agent Success Probability**: 90% - An AI agent should be able to implement this feature successfully in one pass with the provided context.

---

## Appendix: Post-Execution Log

After completing this PRP, write an execution log to:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Log Format:**
```markdown
### PRP 4.2 - FaqSection (Accordéon) ✅

**Date**: [YYYY-MM-DD]

**Objectif**: Créer une section FAQ avec accordéon animé (Framer Motion)

**Réalisations**:
- [x] Composant FaqSection créé avec 8 questions
- [x] Accordéon exclusif (1 seule question ouverte)
- [x] Animations Framer Motion (300ms)
- [x] Icons Plus/Minus avec rotation
- [x] Layout 2 colonnes desktop, 1 colonne mobile
- [x] Glassmorphism styling
- [x] Intégration LandingV3 (section 10)

**Validations**:
- TypeScript check: ✅
- Build production: ✅
- Visual validation: ✅

**Fichiers modifiés**:
- `client/src/components/v3/FaqSection.tsx` (CRÉÉ)
- `client/src/pages/LandingV3.tsx` (MODIFIÉ)

**Prochaine étape**: PRP 5.1 - Responsive Mobile Complet
```
