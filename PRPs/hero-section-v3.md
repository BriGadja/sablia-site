# PRP 1.1: Hero Section with Animated Gradient and Magnetic CTAs

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript type-checking
2. **Build Verification**: Production build must succeed
3. **Visual Validation**: Playwright-based screenshot verification

**Confidence Score: 9/10**

This implementation has high confidence because:
- ✅ All required animation components already exist (MagneticElements, ScrollReveal, AnimatedText)
- ✅ Color variables are defined in Tailwind config
- ✅ Integration point (LandingV3.tsx) has placeholder sections ready
- ✅ Similar patterns exist in LandingV2 components
- ⚠️ Only missing piece: gradient animation CSS (trivial to add)

---

## 1. Goal and Why

**What are we building?**
A premium hero section for LandingV3 with:
- Animated 3-color gradient background (Navy → Electric Blue → Cyan)
- 72px gradient headline with fade-in animation
- 24px subheadline
- Two CTA buttons with magnetic hover effects
- Full viewport height, content centered

**Why are we building it?**
This is the first section of the LandingV3 refonte (PRP 1.1 in the sequence). The hero is the most critical section - it must immediately establish credibility and guide visitors to conversion actions. The animated gradient and magnetic buttons create premium visual engagement while maintaining B2B professionalism.

**Business Impact**:
- First impression sets tone for entire landing page
- Magnetic CTAs increase click-through rates (proven interaction pattern)
- Clear value proposition reduces bounce rate
- Professional gradient animation signals premium service

---

## 2. What (Requirements)

### User-Visible Behavior
1. User lands on page → Hero section appears full-screen with animated gradient background
2. Headline fades in with animated gradient text effect (0.8s duration)
3. Subheadline and CTA buttons appear with content
4. User hovers over CTA buttons → Magnetic effect (buttons follow cursor subtly)
5. User scrolls down → Content exits viewport
6. User scrolls back up → ScrollReveal animation triggers (re-entrance animation)

### Functional Requirements
- **Layout**: Full viewport height (min-h-screen), content centered vertically and horizontally
- **Gradient**: 3-color animated gradient (Navy #0A2463 → Electric #3E92CC → Cyan #52D1DC)
  - Background size: 400% for smooth animation
  - Animation duration: 15s (slow, subtle)
  - Continuous loop
- **Headline**:
  - Text: "Transformez votre PME avec l'automatisation" (or similar B2B value prop)
  - Size: 72px (4xl on mobile → 5xl tablet → 72px desktop)
  - Animation: Fade-in on mount (0.8s duration, 0.2s delay)
  - Effect: Animated gradient text using GradientText component
- **Subheadline**:
  - Text: "Formation-First. Stack Souverain. ROI Mesurable."
  - Size: 24px (18px mobile → 20px tablet → 24px desktop)
  - Color: v2-off-white with 90% opacity
- **CTA Buttons**:
  - Primary: "Diagnostic Gratuit" (Cyan background, Navy text)
  - Secondary: "Calculer mon ROI" (Outline style, Cyan border)
  - Both wrapped in MagneticButton components
  - Links: `#contact` and `#calculator` (scroll to sections)
  - Layout: Row on desktop, stack on mobile
- **Scroll Animation**: ScrollReveal wrapper triggers animation on re-entrance

### Non-Functional Requirements
- **Performance**: 60fps maintained during gradient animation
- **Accessibility**:
  - Headline is semantic `<h1>`
  - Color contrast ratio ≥ 13:1 (white on navy)
  - Keyboard accessible buttons
  - Respects prefers-reduced-motion
- **Responsiveness**: Mobile-first design with breakpoints at sm (640px) and lg (1024px)
- **Browser Compatibility**: Modern browsers with CSS animations and Framer Motion support

---

## 3. Success Criteria

The implementation is complete when:
- ✅ Hero section takes full viewport height (min-h-screen)
- ✅ Animated 3-color gradient background works (Navy → Electric → Cyan, 15s loop)
- ✅ Headline at 72px (responsive) with fade-in animation and gradient text effect
- ✅ Subheadline at 24px (responsive), readable with high contrast
- ✅ Two CTA buttons: "Diagnostic Gratuit" (primary cyan) and "Calculer mon ROI" (secondary outline)
- ✅ Magnetic hover effect works on both buttons (cursor pulls them)
- ✅ ScrollReveal animation functional (triggers when scrolling back to hero)
- ✅ Responsive design works (desktop → tablet → mobile)
- ✅ Content centered vertically and horizontally
- ✅ No emojis in CTAs (B2B professional standard)
- ✅ High color contrast maintained (WCAG AAA)
- ✅ No console errors or warnings
- ✅ TypeScript check passes (`npm run check`)
- ✅ Build succeeds (`npm run build`)
- ✅ Visual validation confirms layout and animations work

---

## 4. Documentation & References

### Official Documentation
- **Framer Motion**: https://www.framer.com/motion/animation/
  - `initial` and `animate` props for mount animations
  - `transition` with duration and delay
- **GSAP ScrollTrigger**: https://greensock.com/docs/v3/Plugins/ScrollTrigger/
  - Used internally by ScrollReveal component
  - Trigger: `start: "top 80%"`
- **Tailwind CSS**: https://tailwindcss.com/docs/
  - Responsive design with breakpoints (sm, lg)
  - Gradient utilities (`bg-gradient-to-br`, `from-`, `via-`, `to-`)

### Relevant Code Examples
- `client/src/components/animations/MagneticElements.tsx` - MagneticButton component with spring physics
- `client/src/components/animations/ScrollReveal.tsx` - GSAP-based scroll animations
- `client/src/components/animations/AnimatedText.tsx` - GradientText for animated headline
- `client/src/components/v2/HeroSection.tsx` - Similar hero pattern from LandingV2 (reference only)
- `client/src/pages/LandingV3.tsx` - Integration point with placeholder sections

### External Resources
- CSS Gradient Animations: https://css-tricks.com/animating-css-gradients/
- Magnetic UI Effects: https://www.framer.com/motion/use-spring/

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── animations/
│   │   ├── MagneticElements.tsx (✅ exists, will use)
│   │   ├── ScrollReveal.tsx (✅ exists, will use)
│   │   └── AnimatedText.tsx (✅ exists, will use GradientText)
│   ├── v2/ (reference only, not modifying)
│   │   └── HeroSection.tsx
│   └── v3/
│       └── Navigation.tsx (✅ exists, already implemented)
├── pages/
│   └── LandingV3.tsx (✅ exists, will integrate hero here)
└── index.css (will add gradient animation CSS)
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   └── v3/
│       ├── Navigation.tsx (✅ existing)
│       └── HeroSection.tsx (🆕 create this)
├── pages/
│   └── LandingV3.tsx (✏️ modify to integrate HeroSection)
└── index.css (✏️ add gradient animation keyframes)
```

### Key Files to Modify
- **CREATE**: `client/src/components/v3/HeroSection.tsx` - New hero component
- **MODIFY**: `client/src/pages/LandingV3.tsx` - Replace placeholder with HeroSection
- **MODIFY**: `client/src/index.css` - Add gradient animation keyframes

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- **Framer Motion**:
  - `initial` and `animate` props only trigger on mount, not on prop changes
  - Use `motion.div` wrapper, not `motion.section` (better for animations)
- **GSAP ScrollTrigger**:
  - Don't nest multiple ScrollReveal components (causes animation conflicts)
  - ScrollReveal should wrap entire content block, not individual elements
- **MagneticButton**:
  - Wrapper must be outside the actual button element
  - Uses `strength` prop (0.1-1, default 0.3) - use 0.5 for high, 0.3 for medium

### Common Mistakes
- ❌ Forgetting to add `relative` class to section (needed for absolute gradient background)
- ❌ Not adding `overflow-hidden` to section (gradient can cause horizontal scroll)
- ❌ Using `<h2>` instead of `<h1>` for headline (SEO and accessibility issue)
- ❌ Hardcoding pixel sizes without responsive breakpoints
- ❌ Placing content directly on gradient (low contrast) - always use z-index layering
- ✅ Use `relative z-10` on content container to ensure it's above gradient background

### Error Patterns
- **Error**: `Cannot find module '@/components/v3/HeroSection'`
  - **Cause**: File not created yet or wrong path
  - **Fix**: Ensure file path is exactly `client/src/components/v3/HeroSection.tsx`

- **Error**: `Property 'strength' does not exist on type MagneticButtonProps`
  - **Cause**: Wrong prop name (it's `strength` not `intensity`)
  - **Fix**: Check MagneticElements.tsx interface - prop is `strength` (number 0-1)

- **Error**: Gradient doesn't animate
  - **Cause**: CSS keyframes not defined or wrong class name
  - **Fix**: Ensure `animate-gradient-xy` class and `@keyframes gradient-xy` are in index.css

- **Error**: Buttons overlap on mobile
  - **Cause**: Flex direction not responsive
  - **Fix**: Use `flex-col sm:flex-row` to stack on mobile, row on desktop

---

## 7. Data Models & Schemas

No database or API schemas required for this component. This is a pure presentation component.

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Add Gradient Animation CSS
**Action**: INJECT
**Location**: `client/src/index.css`
**Details**:
```css
/* Add after existing keyframes (around line 119) */

/* Animated gradient for hero background */
@keyframes gradient-xy {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-xy {
  background-size: 400% 400%;
  animation: gradient-xy 15s ease infinite;
}
```
**Why**: The animated gradient effect requires CSS keyframes. This creates a smooth left-right gradient animation with 15s duration (slow and subtle).

**Gotchas**:
- Place this after line 119 (after rainbow-text keyframes) for consistency
- Don't modify existing animations
- `background-size: 400%` is critical - smaller values make animation too fast

### Task 2: Create HeroSection Component
**Action**: CREATE
**Location**: `client/src/components/v3/HeroSection.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/animations/MagneticElements";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { GradientText } from "@/components/animations/AnimatedText";

/**
 * HeroSection - Premium hero with animated gradient and magnetic CTAs
 *
 * Features:
 * - Animated 3-color gradient background (Navy → Electric → Cyan)
 * - 72px headline with gradient text animation
 * - Two CTA buttons with magnetic hover effects
 * - ScrollReveal animation on re-entrance
 * - Full viewport height, content centered
 */

export default function HeroSection() {
  const handleCTAClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-v2-navy via-v2-electric to-v2-cyan opacity-90 animate-gradient-xy" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal direction="fade" duration={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Headline with gradient animation */}
            <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-bold leading-tight tracking-tight">
              <GradientText
                colors={["#52D1DC", "#3E92CC", "#52D1DC"]}
                className="inline-block"
              >
                Transformez votre PME avec l'automatisation
              </GradientText>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-v2-off-white/90 max-w-3xl mx-auto">
              Formation-First. Stack Souverain. ROI Mesurable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {/* Primary CTA */}
              <MagneticButton strength={0.5}>
                <button
                  onClick={() => handleCTAClick("#contact")}
                  className="bg-v2-cyan text-v2-navy px-8 py-4 rounded-xl text-lg font-semibold hover:bg-v2-electric hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Diagnostic Gratuit
                </button>
              </MagneticButton>

              {/* Secondary CTA */}
              <MagneticButton strength={0.3}>
                <button
                  onClick={() => handleCTAClick("#calculator")}
                  className="border-2 border-v2-cyan text-v2-cyan px-8 py-4 rounded-xl text-lg font-semibold hover:bg-v2-cyan hover:text-v2-navy transition-all duration-300"
                >
                  Calculer mon ROI
                </button>
              </MagneticButton>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```
**Why**: This is the main hero component following the pattern from INITIAL.md. It combines all required animation components.

**Gotchas**:
- `relative z-10` on content container is critical - ensures content appears above gradient
- `overflow-hidden` on section prevents gradient from causing horizontal scroll
- `opacity-90` on gradient provides slight transparency for visual depth
- ScrollReveal wraps the entire content block, not individual elements
- MagneticButton wraps the actual button elements
- `strength={0.5}` for primary CTA (more magnetic), `strength={0.3}` for secondary (less magnetic)

### Task 3: Integrate HeroSection into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
// 1. Add import at top (around line 5)
import HeroSection from "@/components/v3/HeroSection";

// 2. Replace the <main> section (lines 24-43) with:
<main>
  {/* Hero Section */}
  <HeroSection />

  {/* Hidden section placeholders - will be visible in DOM inspector */}
  <div className="hidden">
    <section id="testimonials" className="py-24" />
    <section id="logos" className="py-24" />
    <section id="problem" className="py-24" />
    <section id="solution" className="py-24" />
    <section id="process" className="py-24" />
    <section id="pricing" className="py-24" />
    <section id="calculator" className="py-24" />
    <section id="contact" className="py-24" />
    <section id="faq" className="py-24" />
  </div>
</main>
```
**Why**: Integrates the new HeroSection into LandingV3 page. The hidden placeholders remain for future sections.

**Gotchas**:
- Remove the test heading (`<h1 className="text-[72px]...">LandingV3 - Coming Soon</h1>`)
- Keep the hidden section placeholders - they're needed for anchor links to work
- Don't remove AnimatedParticles, CustomCursor, Navigation, or Footer components

### Task 4: Verify Component Imports
**Action**: VERIFY
**Details**: Ensure all imports are correct:
- `motion` from "framer-motion" ✅ (already in package.json)
- `MagneticButton` from "@/components/animations/MagneticElements" ✅ (component exists)
- `ScrollReveal` from "@/components/animations/ScrollReveal" ✅ (component exists)
- `GradientText` from "@/components/animations/AnimatedText" ✅ (component exists)

**Why**: Verifies all dependencies are available before testing.

**Gotchas**:
- MagneticButton is a named export, not default (use `{ MagneticButton }`)
- GradientText is also a named export (use `{ GradientText }`)
- ScrollReveal is a default export (use `ScrollReveal` without braces)

---

## 9. Testing Strategy

### Manual Testing
Since this is a visual component, manual testing is primary validation method.

**Test Cases**:

1. **Gradient Animation**
   - Navigate to http://localhost:5000/landingv3
   - Observe gradient background - should animate smoothly left-to-right over 15 seconds
   - Check for any stuttering or performance issues (should be 60fps)

2. **Headline Animation**
   - On page load, headline should fade in over 0.8s with 0.2s delay
   - Gradient text should animate continuously (cyan → electric → cyan)
   - Text should be readable with high contrast

3. **Magnetic Buttons**
   - Hover over "Diagnostic Gratuit" button - should follow cursor with stronger pull
   - Hover over "Calculer mon ROI" button - should follow cursor with weaker pull
   - Move cursor away - buttons should return to original position smoothly

4. **Button Clicks**
   - Click "Diagnostic Gratuit" - should smooth scroll to #contact section (when it exists)
   - Click "Calculer mon ROI" - should smooth scroll to #calculator section (when it exists)
   - Note: These sections are placeholders, so scroll will be minimal

5. **ScrollReveal**
   - Scroll down past the hero section
   - Scroll back up - content should re-animate with fade effect
   - Check that animation is smooth and not janky

6. **Responsive Design**
   - Desktop (1920x1080): Headline 72px, buttons in row, full viewport height ✅
   - Tablet (768x1024): Headline 5xl (3rem), buttons in row, responsive padding ✅
   - Mobile (375x812): Headline 4xl (2.25rem), buttons stacked vertically ✅

7. **Performance**
   - Open DevTools Performance tab
   - Record while scrolling and hovering buttons
   - Verify 60fps maintained (green bars, no red spikes)

8. **Console Check**
   - Open DevTools Console
   - Verify no errors or warnings

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: No TypeScript errors. All imports resolve correctly.

### Level 2: Build
```bash
npm run build
```
**Expected**: Build succeeds with no errors. Bundle includes new HeroSection component.

### Level 3: Visual Validation
```bash
# Ensure dev server is running
npm run dev
```

**Playwright Commands**:
```javascript
// Navigate to LandingV3
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Wait for animations to complete
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot of hero section (desktop)
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.1-hero-desktop.png",
  fullPage: false
})

// Test ScrollReveal: scroll down then back up
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, 800)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, 0)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.1-hero-scrollreveal.png"
})

// Test mobile responsiveness
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.1-hero-mobile.png"
})

// Test tablet responsiveness
mcp__playwright__browser_resize({ width: 768, height: 1024 })
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.1-hero-tablet.png"
})

// Return to desktop size
mcp__playwright__browser_resize({ width: 1920, height: 1080 })
```

### Level 4: Manual Checklist
After visual validation, verify:
- [ ] Hero section takes full viewport height
- [ ] Gradient animates smoothly (subtle, 15s loop)
- [ ] Headline fades in on page load
- [ ] Headline uses gradient text animation
- [ ] Subheadline visible and readable
- [ ] Two CTA buttons visible and styled correctly
- [ ] Primary CTA has cyan background, navy text
- [ ] Secondary CTA has outline style
- [ ] Buttons have magnetic hover effect
- [ ] Buttons are clickable (smooth scroll to sections)
- [ ] ScrollReveal triggers when scrolling back to hero
- [ ] Mobile: headline resizes appropriately (4xl)
- [ ] Mobile: buttons stack vertically
- [ ] Tablet: headline resizes appropriately (5xl)
- [ ] No console errors or warnings
- [ ] Performance: 60fps maintained

---

## 11. Integration Points

### Configuration Changes
No environment variables or configuration changes required.

### Route Registration
No new routes required. Hero is integrated into existing `/landingv3` route.

### Database Migrations
No database changes required.

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Add emojis to CTAs (damages B2B credibility)
- ❌ Use `<div>` for headline (use semantic `<h1>`)
- ❌ Nest multiple ScrollReveal components (causes animation conflicts)
- ❌ Place MagneticButton inside button (must wrap button)
- ❌ Use `motion.section` (use `motion.div` for better animation control)
- ❌ Hardcode colors (use Tailwind v2-* color variables)
- ❌ Skip responsive breakpoints (must support mobile)
- ❌ Forget `relative` class on section (gradient won't position correctly)
- ❌ Use fast gradient animation (<10s causes motion sickness)

### DO:
- ✅ Use semantic HTML (`<h1>`, `<section>`, `<button>`)
- ✅ Follow existing animation component APIs
- ✅ Use Tailwind color variables (v2-navy, v2-electric, v2-cyan)
- ✅ Implement responsive design with mobile-first approach
- ✅ Add `relative z-10` to content for proper layering
- ✅ Use 15s gradient animation (slow and subtle)
- ✅ Maintain high color contrast (white on navy = 13.9:1)
- ✅ Wrap buttons with MagneticButton, not wrap MagneticButton with button

---

## 13. Progressive Success

**Phase 1: Basic Structure** (Validate: TypeScript compiles)
1. Create HeroSection.tsx with basic structure (section, div, h1, p, buttons)
2. Add gradient background (static, no animation yet)
3. Add headline and subheadline text
4. Add two button elements

**Phase 2: Animations** (Validate: Animations visible)
1. Add gradient animation CSS to index.css
2. Wrap headline with GradientText component
3. Add Framer Motion fade-in to content
4. Wrap content with ScrollReveal

**Phase 3: Interactions** (Validate: Buttons interactive)
1. Wrap buttons with MagneticButton components
2. Add click handlers for smooth scroll
3. Test magnetic effect on hover
4. Test scroll behavior

**Phase 4: Responsive Design** (Validate: Mobile/tablet work)
1. Add responsive classes for headline (text-4xl sm:text-5xl lg:text-[72px])
2. Add responsive classes for subheadline (text-lg sm:text-xl lg:text-2xl)
3. Add responsive layout for buttons (flex-col sm:flex-row)
4. Test on mobile, tablet, desktop

**Phase 5: Integration** (Validate: Build succeeds)
1. Import HeroSection in LandingV3.tsx
2. Replace placeholder content
3. Run build command
4. Run visual validation

---

## Final Validation Checklist

Before marking complete:
- [ ] All validation gates pass (TypeScript, Build)
- [ ] All success criteria met (see section 3)
- [ ] Code follows project patterns (React, TypeScript, Tailwind)
- [ ] Visual validation confirms layout and animations work
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] No console errors or warnings
- [ ] No TODOs left in code
- [ ] Performance: 60fps maintained during animations
- [ ] Accessibility: High contrast, semantic HTML, keyboard accessible
- [ ] Integration complete: LandingV3.tsx imports and renders HeroSection

---

## Expected Outcome

After implementing this PRP, you will have:
1. A new file `client/src/components/v3/HeroSection.tsx` with fully functional hero section
2. Updated `client/src/pages/LandingV3.tsx` with HeroSection integrated
3. Updated `client/src/index.css` with gradient animation keyframes
4. Visual validation screenshots showing:
   - Desktop hero section with animated gradient
   - Mobile hero section with stacked buttons
   - ScrollReveal animation working

**Next Step**: PRP 1.2 - TestimonialsSection (Carousel)

---

## Log d'Exécution

**IMPORTANT**: After completing this PRP, write an execution log in:
`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Template**:
```markdown
## ✅ PRP 1.1 - HeroSection (Completed: [DATE])

**Composant**: `client/src/components/v3/HeroSection.tsx`

**Résumé**:
- ✅ Gradient animé 3 couleurs (Navy → Electric → Cyan)
- ✅ Headline 72px avec GradientText
- ✅ Deux CTAs avec effet magnétique
- ✅ ScrollReveal fonctionnel
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Performance: 60fps maintenu

**Validation**:
- `npm run check`: ✅ Pass
- `npm run build`: ✅ Pass
- Visual validation: ✅ Screenshots captured

**Fichiers créés**:
- `client/src/components/v3/HeroSection.tsx`

**Fichiers modifiés**:
- `client/src/pages/LandingV3.tsx` (intégration)
- `client/src/index.css` (gradient animation CSS)

**Prochaine étape**: PRP 1.2 - TestimonialsSection (Carousel)
```

---

## Confidence Score: 9/10

**Why High Confidence**:
- All required components exist and are well-tested
- Color variables defined in Tailwind config
- Similar patterns exist in LandingV2 (proven approach)
- Clear integration point with placeholder sections
- Comprehensive validation strategy

**Why Not 10/10**:
- Minor risk: Gradient animation CSS needs to be added (trivial but untested)
- Minor risk: ScrollReveal behavior on hero section hasn't been tested (works on other sections)

**Risk Mitigation**:
- Follow validation gates in order (catches issues early)
- Use visual validation to confirm animations work
- Test responsive design thoroughly

This PRP provides complete context and step-by-step guidance for successful one-pass implementation.
