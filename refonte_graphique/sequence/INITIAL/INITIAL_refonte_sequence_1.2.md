# INITIAL - PRP 1.2 - TestimonialsSection (Carousel infini)

## FEATURE

Create an infinite scrolling testimonials carousel with social media-style cards that scroll continuously and pause on hover.

**Requirements**:
- Infinite horizontal scroll carousel with 5 testimonials
- Cards styled like social media posts (compact, visual, scannable)
- Continuous automatic scrolling (no manual navigation needed)
- **Pause scrolling on hover** over any card or carousel area
- Resume scrolling when mouse leaves
- Use **short versions** of testimonials for social media post effect
- Gradient fade overlays on left/right edges for infinite loop illusion
- Each card includes: avatar (initials), name, role, company, short quote, metric badge, project tag
- Responsive: cards scroll horizontally on all screen sizes

**Visual Deliverable**: Infinite scrolling carousel with 5 client testimonials displayed as social media-style cards, scrolling continuously from right to left, pausing elegantly on hover, with gradient fade edges.

**Technical Requirements**:
- Component path: `client/src/components/v3/TestimonialsSection.tsx`
- Use Framer Motion for continuous animation (`animate` with `x` translation)
- Triple the testimonials array for seamless infinite loop
- Pause animation with `whileHover` on carousel container
- No dots navigation, no arrows (pure infinite scroll UX)
- Integrate into LandingV3.tsx as second section (right after Hero)

## EXAMPLES

**Infinite Scroll Carousel Pattern** (inspired by v2 but adapted for v3 design):

```typescript
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string; // Initials (e.g., "HE" for Hélène)
  quote: string; // Short version
  metric: string; // e.g., "Économie de 90% du temps"
  project: string; // e.g., "Génération de menus"
}

const testimonials: Testimonial[] = [
  {
    name: "Hélène",
    role: "Fondatrice",
    company: "GirlsGang",
    avatar: "HE",
    quote: "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes.",
    metric: "Économie de 90% du temps",
    project: "Génération de menus"
  },
  // ... 4 more testimonials
];

export default function TestimonialsSection() {
  // Triple array for seamless infinite scroll
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Calculate animation distance
  const cardWidth = 400 + 24; // card + gap
  const totalWidth = testimonials.length * cardWidth;

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* The continuous gradient from LandingV3 transparaît naturally */}

      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-v2-cyan uppercase tracking-wider mb-3"
            >
              Ils ont transformé leurs opérations
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-v2-white"
            >
              Des résultats mesurables
            </motion.h2>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Gradient fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-v2-navy to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-v2-navy to-transparent z-10 pointer-events-none" />

            {/* Scrolling cards wrapper with pause on hover */}
            <motion.div
              className="flex gap-6 cursor-pointer"
              animate={{
                x: [`0px`, `-${totalWidth}px`]
              }}
              transition={{
                duration: 40, // Slower = more readable
                ease: "linear",
                repeat: Infinity
              }}
              whileHover={{
                animationPlayState: "paused" // This doesn't work directly, see workaround below
              }}
            >
              {displayTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.name}-${index}`}
                  className="flex-shrink-0 w-[380px]"
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Social Media Post Card */}
                  <div className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-v2-cyan/10 h-full flex flex-col">
                    {/* Header: Avatar + Name */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-v2-cyan to-v2-electric flex items-center justify-center flex-shrink-0">
                        <span className="text-v2-navy font-bold text-sm">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-v2-white text-lg leading-tight">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-v2-off-white/70">{testimonial.role}</p>
                        <p className="text-xs text-v2-off-white/50">{testimonial.company}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <p className="text-v2-off-white/90 leading-relaxed mb-4 flex-grow text-sm">
                      "{testimonial.quote}"
                    </p>

                    {/* Footer: Metric Badge + Project Tag */}
                    <div className="pt-4 border-t border-v2-cyan/20 space-y-2">
                      <div className="inline-flex items-center gap-2 bg-v2-cyan/20 text-v2-cyan px-3 py-1.5 rounded-full">
                        <span className="text-lg">✓</span>
                        <span className="text-xs font-semibold">{testimonial.metric}</span>
                      </div>
                      <p className="text-xs text-v2-off-white/50">
                        Projet : {testimonial.project}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-sm text-v2-off-white/60">
              Projets réels · Résultats vérifiables
            </p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**IMPORTANT - Pause on Hover Implementation**:

Framer Motion's `whileHover` doesn't directly pause CSS animations. Use state-based approach:

```typescript
import { useState } from "react";

export default function TestimonialsSection() {
  const [isPaused, setIsPaused] = useState(false);

  // ... rest of component

  return (
    <motion.div
      className="flex gap-6"
      animate={{
        x: isPaused ? undefined : [`0px`, `-${totalWidth}px`]
      }}
      transition={{
        duration: 40,
        ease: "linear",
        repeat: Infinity
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cards */}
    </motion.div>
  );
}
```

**Reference Existing Carousel**: `client/src/components/v2/TestimonialsCarousel.tsx` - Use similar structure but adapt for v3 dark theme and pause functionality.

## DOCUMENTATION

**Testimonials Data** (SHORT VERSIONS - from `refonte_graphique/Testimonials.md`):

1. **Hélène - GirlsGang**:
   - Quote: "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes."
   - Avatar: "HE"
   - Metric: "Économie de 90% du temps"
   - Project: "Génération de menus"

2. **Directeur - Scale-up française**:
   - Quote: "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive."
   - Avatar: "DI"
   - Metric: "Avantage compétitif décisif"
   - Project: "Veille concurrentielle"

3. **Yassine - Norloc**:
   - Quote: "Notre gestion des prospects est passée au niveau supérieur. L'agent vocal couplé à l'automatisation du CRM nous fait gagner des heures chaque semaine et améliore nos taux de conversion."
   - Avatar: "YN"
   - Metric: "Taux de conversion amélioré"
   - Project: "Agent vocal + CRM"

4. **Valentin - Stefano Design & Exotic Design**:
   - Quote: "Des milliers de contacts dormants transformés en opportunités commerciales concrètes. L'agent vocal nous a permis d'exploiter un gisement de valeur que nous avions sous-estimé."
   - Avatar: "VD"
   - Metric: "Milliers de contacts réactivés"
   - Project: "Réactivation automatisée de BDD"

5. **Amir - Entreprise BTP**:
   - Quote: "De la demande client au suivi de chantier, tout est automatisé. Plus de temps perdu, plus d'erreurs, juste de l'efficacité. Notre organisation a été transformée."
   - Avatar: "AM"
   - Metric: "Organisation transformée"
   - Project: "Gestion des interventions"

**Framer Motion Infinite Animation**:
- https://www.framer.com/motion/animation/
- Use `animate` prop with `x` translation from 0 to negative total width
- `transition.repeat: Infinity` for continuous loop
- `transition.ease: "linear"` for constant speed (no easing)
- Triple the array to ensure seamless loop (when first set exits, third set is entering)

**Pause Animation Technique**:
```typescript
// State-based approach (recommended)
const [isPaused, setIsPaused] = useState(false);

<motion.div
  animate={{
    x: isPaused ? undefined : [`0px`, `-${totalWidth}px`]
  }}
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
```

When `isPaused` is true, `animate.x` becomes `undefined`, freezing the animation at its current state.

**Card Dimensions**:
- Width: 380px (compact for scannable social media feel)
- Height: auto (flex-col with flex-grow on quote for equal height)
- Gap: 24px between cards
- Total width for animation: `testimonials.length × (380 + 24)`

**Glassmorphism for v3 Dark Theme**:
```css
background: rgba(45, 49, 66, 0.3);  /* v2-charcoal with 30% opacity */
backdrop-filter: blur(12px);
border: 1px solid rgba(82, 209, 220, 0.1);  /* v2-cyan with 10% opacity */
```

**Color System (v3)**:
- Background: `bg-v2-navy` (#0A2463)
- Card background: `bg-v2-charcoal/30` with `backdrop-blur-md`
- Card border: `border-v2-cyan/10`
- Text primary: `text-v2-white` (#FFFFFF)
- Text secondary: `text-v2-off-white/90` (#F8F9FA with 90% opacity)
- Text tertiary: `text-v2-off-white/50`
- Avatar gradient: `from-v2-cyan to-v2-electric`
- Metric badge: `bg-v2-cyan/20 text-v2-cyan`
- Section accent: `text-v2-cyan` (eyebrow text)

**Typography**:
- Section eyebrow: 12px uppercase, tracking-wider, cyan
- Section heading: 48px (desktop) / 36px (mobile), bold, white
- Card name: 18px bold, white
- Card role: 14px, off-white 70%
- Card company: 12px, off-white 50%
- Quote: 14px, off-white 90%, leading-relaxed
- Metric: 12px semibold, cyan
- Project tag: 12px, off-white 50%

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

**Animation Speed**:
- Duration: 40 seconds for full loop (slower = more readable)
- Adjust based on total width: longer carousels need more time
- Goal: users should be able to read a card before it exits viewport

**Responsive Design**:
- Desktop (>1024px): Show 3-4 cards in viewport
- Tablet (768-1023px): Show 2-3 cards
- Mobile (<768px): Show 1-2 cards, reduce card width to 320px
- Gradient overlays: 128px on desktop, 64px on mobile

**Card Design (Social Media Post Style)**:
- Compact layout: avatar + name stacked tightly
- Quote as main content (not too long, scannable)
- Visual hierarchy: name > quote > metric > project
- Metric badge stands out with cyan accent
- Border and backdrop-blur for glassmorphism depth

**Infinite Loop Technique**:
```typescript
// Original array: [A, B, C, D, E]
// Tripled array: [A, B, C, D, E, A, B, C, D, E, A, B, C, D, E]
// When animation completes one cycle (5 cards),
// seamlessly continues to second set (identical)
```

Animation distance = length of ONE set (not tripled length). When animation reaches end of first set, second set is already visible, creating seamless loop.

**Hover Behavior**:
- Pause entire carousel animation (all cards freeze)
- Individual card scales up slightly (1.03x) and lifts (-4px Y)
- Both effects combined create engaging hover UX
- Resume scrolling immediately when mouse leaves carousel area

**Performance**:
- Use `will-change: transform` for GPU acceleration
- Avoid re-rendering: memoize tripled testimonials array
- Keep card count reasonable (15 total = 5 unique × 3)
- No heavy computations in animation loop

**Accessibility**:
- Carousel must be pauseable (hover satisfies this)
- Consider adding "Pause/Play" button for keyboard users
- Each card should have proper semantic HTML (`<article>` for testimonial)
- Alt text for avatars (initials are decorative, name is in text)
- Reduced motion: respect `prefers-reduced-motion` media query

**Z-Index Layering**:
- Section background: z-0 (particles inherited from LandingV3)
- Gradient overlays: z-10
- Scrolling cards: default (relative)
- Hovered card: z-20 (via scale lift)

**Gotchas**:
- Animation "jump": Ensure tripled array has correct key prop (`${name}-${index}`)
- Pause not working: Use state-based approach, not `whileHover` on animation prop
- Cards cut off: Ensure container has `overflow-hidden`
- Gradient not visible: Check gradient colors match section background
- Cards different heights: Use `flex-col` with `flex-grow` on quote element

**Known Issues to Avoid**:
- Don't use `animationPlayState` CSS - not controllable via Framer Motion
- Don't calculate width dynamically on resize - causes animation restart
- Don't forget to cleanup: no intervals needed (Framer Motion handles animation)
- Don't use `AnimatePresence` - not needed for continuous scroll

**Integration with LandingV3**:
```typescript
// In LandingV3.tsx
import TestimonialsSection from "@/components/v3/TestimonialsSection";

<main>
  <HeroSection />
  <TestimonialsSection />  {/* Second section */}
  {/* Other sections... */}
</main>
```

Remove placeholder: `<section id="testimonials" className="py-24" />` from hidden div.

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run build   # Production build
npm run dev     # Start dev server
```

**Visual Validation** (Playwright MCP):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to testimonials section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot of carousel scrolling
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.2-testimonials-scrolling.png"
})

// Test pause on hover
mcp__playwright__browser_hover({
  element: "testimonials carousel",
  ref: "[carousel container ref]"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.2-testimonials-paused.png"
})

// Test mobile responsiveness
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-1.2-testimonials-mobile.png"
})
```

**Manual Testing Checklist**:
- [ ] 5 testimonials are displayed (tripled for 15 total cards)
- [ ] Carousel scrolls continuously from right to left
- [ ] Animation is smooth (60fps, linear easing)
- [ ] Gradient overlays create fade effect on edges
- [ ] **Hovering over carousel area pauses scrolling**
- [ ] **Moving mouse away resumes scrolling immediately**
- [ ] Individual cards scale up and lift on hover
- [ ] Cards styled like social media posts (compact, scannable)
- [ ] Quote text uses SHORT versions (not long versions)
- [ ] Avatar shows initials with gradient background
- [ ] Metric badge is visible with cyan accent
- [ ] Project tag displays correctly
- [ ] Section header animates on scroll into view
- [ ] Dark theme styling (navy background, glassmorphism cards)
- [ ] Responsive: cards visible and scrolling on mobile
- [ ] No console errors or warnings
- [ ] Performance: smooth animation, no jank

**Success Criteria**:
- ✅ Infinite horizontal scroll carousel with 5 testimonials
- ✅ Continuous automatic scrolling (no manual controls)
- ✅ **Pause on hover functionality working**
- ✅ Resume scrolling on mouse leave
- ✅ Cards styled as social media posts (compact design)
- ✅ Short versions of testimonials used (readable while scrolling)
- ✅ Gradient fade overlays on left/right edges
- ✅ Each card includes: avatar (initials), name, role, company, quote, metric, project
- ✅ Glassmorphism card design with v3 dark theme
- ✅ Responsive: works on desktop, tablet, mobile
- ✅ ScrollReveal animation on section entry
- ✅ No console errors
- ✅ TypeScript check passes
- ✅ Integrated as second section in LandingV3

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: Suivre le format établi dans les PRPs précédents (0.1, 0.2, 0.3, 0.4, 1.1).

Remplacer dans le template:
- **Numéro**: PRP 1.2 - TestimonialsSection (Carousel infini)
- **Statut**: ✅ Complété
- **Résumé**: Décrire le carousel infini avec pause au survol
- **Prochaine étape**: PRP 1.3 - LogosCloud
