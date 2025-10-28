# INITIAL - PRP 1.1 - HeroSection

## FEATURE

Create a premium hero section with animated gradient background, compelling headline, subheadline, and two CTA buttons with magnetic hover effects.

**Requirements**:
- Animated 3-color gradient background (Navy → Electric Blue → Cyan)
- Headline: 72px, bold, percutant, with fade-in animation
- Subheadline: 24px, supporting text
- Two CTA buttons:
  - Primary: "Diagnostic Gratuit" (Cyan background)
  - Secondary: "Calculer mon ROI" (Outline style)
- Magnetic button effects using existing MagneticElements component
- ScrollReveal animation on scroll (using existing component)
- Full viewport height (min-h-screen)
- Content centered vertically and horizontally

**Visual Deliverable**: Complete hero section with animated gradient, compelling copy, and interactive magnetic buttons, working with particles and custom cursor.

**Technical Requirements**:
- Component path: `client/src/components/v3/HeroSection.tsx`
- Use existing animation components: MagneticElements, ScrollReveal, AnimatedText
- Integrate into LandingV3.tsx as first section
- Framer Motion for initial fade-in
- GSAP for scroll-triggered animations

## EXAMPLES

**Hero Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import MagneticElements from "@/components/animations/MagneticElements";
import ScrollReveal from "@/components/animations/ScrollReveal";
import AnimatedText from "@/components/animations/AnimatedText";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* The continuous gradient from LandingV3 transparaît naturally - no local background needed */}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Headline with AnimatedText */}
            <AnimatedText
              text="Transformez votre PME avec l'automatisation"
              variant="gradient"
              className="text-[72px] font-bold leading-tight tracking-tight mb-6"
            />

            {/* Subheadline */}
            <p className="text-2xl text-v2-off-white/90 mb-12 max-w-3xl mx-auto">
              Formation-First. Stack Souverain. ROI Mesurable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticElements intensity="high">
                <a
                  href="#contact"
                  className="bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg text-lg font-semibold hover:bg-v2-electric transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Diagnostic Gratuit
                </a>
              </MagneticElements>

              <MagneticElements intensity="medium">
                <a
                  href="#calculator"
                  className="border-2 border-v2-cyan text-v2-cyan px-8 py-4 rounded-lg text-lg font-semibold hover:bg-v2-cyan hover:text-v2-navy transition-all duration-300"
                >
                  Calculer mon ROI
                </a>
              </MagneticElements>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Animated Gradient CSS** (add to `client/src/index.css`):
```css
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

**Reference Existing Components**:
- `client/src/components/animations/MagneticElements.tsx` - Magnetic hover effect
- `client/src/components/animations/ScrollReveal.tsx` - Scroll-triggered animations
- `client/src/components/animations/AnimatedText.tsx` - Text animations

## DOCUMENTATION

**Copy Guidelines** (B2B Professional):
- Headline: Clear value proposition, no jargon
- Subheadline: 3 key differentiators
- CTAs: Action-oriented, no emojis
- Tone: Professional but approachable

**Suggested Headlines** (pick one or create better):
1. "Transformez votre PME avec l'automatisation"
2. "Automatisez intelligemment. Formez vos équipes. Mesurez les résultats."
3. "De la stratégie à l'exécution : votre partenaire automation"

**Suggested Subheadlines**:
1. "Formation-First. Stack Souverain. ROI Mesurable."
2. "Formations terrain, solutions sur mesure, souveraineté garantie."
3. "Expert n8n & Make.com pour PME françaises depuis 2023."

**Gradient Animation**:
- 3-color gradient (Navy → Electric Blue → Cyan)
- Background-size: 400% for smooth animation
- Animation duration: 15s (slow, subtle)
- Ease timing function for natural movement

**MagneticElements Props**:
```typescript
interface MagneticElementsProps {
  intensity?: "low" | "medium" | "high"; // Distance cursor affects element
  children: React.ReactNode;
}
```

**ScrollReveal Props**:
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // Animation delay in seconds
  threshold?: number; // Intersection observer threshold (0-1)
}
```

**AnimatedText Variants**:
- `gradient` - Animated gradient text (cyan to electric)
- `typewriter` - Typewriter effect
- `fade` - Simple fade-in

**Framer Motion Docs**:
- https://www.framer.com/motion/animation/
- Initial/Animate pattern for mount animations
- Transition with duration and delay

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
- Headline: 72px desktop → 48px tablet → 36px mobile
- Subheadline: 24px desktop → 20px tablet → 18px mobile
- Button layout: Row on desktop, stack on mobile
- Container padding: `px-6 lg:px-8`

**Headline Responsive Classes**:
```typescript
className="text-4xl sm:text-5xl lg:text-[72px] font-bold leading-tight"
```

**CTA Button Guidelines**:
- Primary (Diagnostic Gratuit): High contrast, most prominent
- Secondary (Calculer mon ROI): Outline style, less prominent
- Both should be magnetic (use MagneticElements wrapper)
- No emojis in CTAs (B2B professional standard)
- Links: `#contact` and `#calculator` (anchor links to sections)

**Animation Timing**:
- Page load: Hero content fades in immediately (0.8s duration, 0.2s delay)
- Scroll: ScrollReveal triggers when hero exits viewport (for return animations)
- Gradient: Continuous 15s loop
- Magnetic: Instant response to cursor position

**Performance**:
- Gradient animation uses GPU-accelerated transforms
- Magnetic effect uses transform only (no layout thrashing)
- ScrollReveal uses Intersection Observer (efficient)
- No heavy JS computations on scroll

**Accessibility**:
- Headline should be `<h1>` semantic element
- Sufficient color contrast (white text on navy = 13.9:1)
- Buttons should be keyboard accessible
- Skip link for screen readers (optional enhancement)

**Gotchas**:
- Don't nest multiple ScrollReveal components (can cause jank)
- Ensure gradient animation doesn't cause motion sickness (15s is slow enough)
- Test magnetic buttons with custom cursor (both should work together)
- Hero should account for navigation height (`pt-20` for sticky nav)

**Z-Index Layering in Hero**:
```
z-0   // Gradient background
z-10  // Content (headline, buttons)
```

**Known Issues to Avoid**:
- If gradient doesn't animate, check CSS animation is properly defined
- If magnetic effect doesn't work, ensure MagneticElements wrapper is outside button
- If text is hard to read, increase gradient overlay opacity
- If buttons overlap on mobile, ensure flex-direction is column

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Take screenshot of hero
mcp__playwright__browser_take_screenshot({ filename: "prp-1.1-hero.png" })

// Scroll down and back up to test ScrollReveal
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, 800)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, 0)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "prp-1.1-hero-scrollreveal.png" })

// Test mobile responsiveness
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-1.1-hero-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Hero takes full viewport height
- [ ] Gradient animates smoothly (subtle, 15s loop)
- [ ] Headline fades in on page load
- [ ] Headline uses AnimatedText gradient variant
- [ ] Subheadline visible and readable
- [ ] Two CTA buttons visible and styled correctly
- [ ] Buttons have magnetic hover effect (cursor pulls them)
- [ ] Primary CTA has cyan background
- [ ] Secondary CTA has outline style
- [ ] Buttons are clickable and link to correct sections
- [ ] ScrollReveal triggers animation when scrolling back to hero
- [ ] Mobile: headline resizes appropriately
- [ ] Mobile: buttons stack vertically
- [ ] No console errors
- [ ] Performance: 60fps maintained

**Success Criteria**:
- ✅ Hero section with min-h-screen height
- ✅ Animated 3-color gradient background (Navy → Electric Blue → Cyan)
- ✅ Headline 72px with fade-in animation and gradient text effect
- ✅ Subheadline 24px, readable
- ✅ Two CTA buttons: "Diagnostic Gratuit" (primary) and "Calculer mon ROI" (secondary)
- ✅ Magnetic hover effect on buttons
- ✅ ScrollReveal animation functional
- ✅ Responsive design (desktop → mobile)
- ✅ Content centered vertically and horizontally
- ✅ No emojis in CTAs
- ✅ High color contrast (WCAG AAA)
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 1.1 - HeroSection
- **Prochaine étape**: PRP 1.2 - TestimonialsSection (Carousel)
