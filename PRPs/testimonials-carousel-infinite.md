# PRP: Testimonials Carousel Infini (v3)

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript checking
2. **Build**: Production build validation
3. **Visual Testing**: Playwright browser validation

**Confidence Score**: 9/10 - Complete implementation context with working reference pattern from v2.

---

## 1. Goal and Why

**What are we building?**
An infinite scrolling testimonials carousel with social media-style cards that continuously scroll horizontally and pause on hover.

**Why are we building it?**
- Create engaging social proof section for landing page v3
- Modern UX pattern (infinite scroll vs traditional carousel)
- Scannable testimonial cards (Twitter/LinkedIn post style)
- Automatic scrolling keeps visitors engaged without manual interaction
- Pause on hover allows reading without disrupting flow

**Visual Effect**: Like a "ticker tape" of client success stories that smoothly scrolls forever.

---

## 2. What (Requirements)

### User-Visible Behavior
1. User sees 5 client testimonials displayed as compact cards
2. Cards scroll continuously from right to left (infinite loop)
3. When user hovers over any part of the carousel, scrolling pauses
4. When user moves mouse away, scrolling resumes immediately
5. Individual cards lift slightly when hovered (visual feedback)
6. Section has gradient fade on left/right edges for infinite illusion
7. Dark navy background with glassmorphism cards (v3 theme)

### Functional Requirements
- Infinite horizontal scroll using Framer Motion
- Pause mechanism using React state + mouse events
- Triple testimonials array for seamless loop
- 5 testimonials with short-form quotes (social media length)
- Each card displays: avatar (initials), name, role, company, quote, metric badge, project tag
- Responsive design: cards visible on all screen sizes
- ScrollReveal animation on section entry
- Integration as second section in LandingV3 (after Hero)

### Non-Functional Requirements
- **Performance**: 60fps animation with GPU acceleration
- **Animation Speed**: 40 seconds for full loop (readable while scrolling)
- **Accessibility**: Carousel must be pauseable (hover satisfies WCAG 2.2.2)
- **Responsive**: Card width adjusts for mobile (380px desktop, 320px mobile)
- **Browser Support**: Modern browsers with Framer Motion support

---

## 3. Success Criteria

The implementation is complete when:
- [ ] Carousel displays 5 testimonials as tripled array (15 cards total)
- [ ] Continuous scrolling animation works smoothly (linear, 40s duration)
- [ ] **Hovering over carousel area pauses scrolling**
- [ ] **Mouse leave resumes scrolling immediately**
- [ ] Individual cards scale up (1.03x) and lift (-4px Y) on hover
- [ ] Gradient overlays create fade effect on left/right edges
- [ ] Cards use SHORT versions of testimonials (from Testimonials.md)
- [ ] Each card includes all 7 elements: avatar, name, role, company, quote, metric, project
- [ ] Dark theme styling with glassmorphism cards (v2-navy background, charcoal/30 cards)
- [ ] Section header animates on scroll into view
- [ ] Responsive: cards visible and scrolling on mobile
- [ ] TypeScript check passes (no new errors)
- [ ] Production build succeeds
- [ ] Visual validation confirms scrolling and pause behavior

---

## 4. Documentation & References

### Official Documentation
- **Framer Motion**: https://www.framer.com/motion/animation/
  - Infinite animations: Use `animate` with `x` translation + `transition.repeat: Infinity`
  - Linear easing: `transition.ease: "linear"` for constant speed
- **Framer Motion - State-based animation control**: https://www.framer.com/motion/animation/#dynamic-variants
  - Setting `animate.x` to `undefined` freezes animation at current state
- **React - useState**: https://react.dev/reference/react/useState
  - For `isPaused` state management

### Relevant Code Examples
- `client/src/components/v2/TestimonialsCarousel.tsx` - **PRIMARY REFERENCE**
  - Demonstrates infinite scroll pattern with tripled array
  - Shows card styling (social media post design)
  - Has metric badge and project tag structure
  - Uses 30s duration for full loop
  - **ADAPT**: Change to 40s, add pause on hover, adjust for dark theme
- `client/src/components/v3/HeroSection.tsx` - v3 component structure
  - Shows ScrollReveal usage pattern
  - Demonstrates v3 dark theme colors
  - Shows glassmorphism card styling approach
- `client/src/components/animations/ScrollReveal.tsx` - Animation wrapper
  - Use for section entry animation
- `refonte_graphique/Testimonials.md` - **SOURCE OF TRUTH for testimonial data**
  - Lines 10-13: Hélène short version
  - Lines 22-25: Directeur short version
  - Lines 34-37: Yassine short version
  - Lines 46-49: Valentin short version
  - Lines 58-61: Amir short version

### External Resources
- **Infinite Scroll Carousel Pattern**: https://www.framer.com/motion/examples/#page-scroll-indicators
  - Example of continuous animation with React
- **Pause animation technique**: Use conditional `animate` prop based on state

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── v2/
│   │   └── TestimonialsCarousel.tsx  ← Reference pattern
│   ├── v3/
│   │   ├── HeroSection.tsx  ← Existing v3 section
│   │   └── Navigation.tsx
│   └── animations/
│       └── ScrollReveal.tsx
├── pages/
│   └── LandingV3.tsx  ← Integration point
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   ├── v3/
│   │   ├── HeroSection.tsx
│   │   ├── TestimonialsSection.tsx  ← NEW FILE
│   │   └── Navigation.tsx
├── pages/
│   └── LandingV3.tsx  ← MODIFIED (add import + component)
```

### Key Files to Modify
- `client/src/pages/LandingV3.tsx` - Add TestimonialsSection after HeroSection, remove placeholder

---

## 6. Known Gotchas & Pitfalls

### Framer Motion Quirks
- **Quirk**: `whileHover` doesn't pause CSS-based animations or Framer Motion `animate` loops
  - **Solution**: Use state-based approach with `isPaused` + `onMouseEnter/Leave`
- **Quirk**: If `animate.x` is set to `undefined`, animation freezes at current position
  - **This is the correct technique** for pause functionality
- **Quirk**: Animation "jumps" if key prop isn't unique when using tripled array
  - **Solution**: Use `key={testimonial.name}-${index}` not just `key={index}`

### Common Mistakes
- ❌ **Anti-pattern**: Calculating animation distance as tripled array length
  - ✅ **Correct**: Calculate distance for ONE set only (`testimonials.length × cardWidth`)
  - **Why**: When first set exits, second identical set is already visible (seamless loop)

- ❌ **Anti-pattern**: Using `animationPlayState: "paused"` CSS property
  - ✅ **Correct**: Use `isPaused` state with conditional `animate` prop
  - **Why**: CSS animation-play-state isn't controllable via Framer Motion

- ❌ **Anti-pattern**: Forgetting `overflow-hidden` on carousel container
  - ✅ **Correct**: Add `overflow-hidden` to parent container
  - **Why**: Cards will be visible outside viewport without it

- ❌ **Anti-pattern**: Using `AnimatePresence` for infinite scroll
  - ✅ **Correct**: Use simple `motion.div` with `animate` prop
  - **Why**: AnimatePresence is for enter/exit animations, not continuous scroll

### Error Patterns
- **Error**: Cards have different heights
  - **Cause**: Quote text length varies, no flex-grow on quote element
  - **Fix**: Use `flex-col` with `flex-grow` class on quote paragraph

- **Error**: Animation doesn't resume after hover
  - **Cause**: `isPaused` state not properly toggled in `onMouseLeave`
  - **Fix**: Ensure `setIsPaused(false)` is called in `onMouseLeave`

- **Error**: Gradient overlays not visible
  - **Cause**: Gradient colors don't match section background
  - **Fix**: Use `from-v2-navy` to match `bg-v2-navy` section background

---

## 7. Data Models & Schemas

### Testimonial Interface
```typescript
interface Testimonial {
  name: string;           // e.g., "Hélène"
  role: string;           // e.g., "Fondatrice"
  company: string;        // e.g., "GirlsGang"
  avatar: string;         // Initials, e.g., "HE"
  quote: string;          // SHORT version (social media length)
  metric: string;         // e.g., "Économie de 90% du temps"
  project: string;        // e.g., "Génération de menus"
}
```

### Testimonials Data (SHORT VERSIONS)
```typescript
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
  {
    name: "Directeur",
    role: "Direction",
    company: "Scale-up française",
    avatar: "DI",
    quote: "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive.",
    metric: "Avantage compétitif décisif",
    project: "Veille concurrentielle"
  },
  {
    name: "Yassine",
    role: "Fondateur",
    company: "Norloc",
    avatar: "YN",
    quote: "Notre gestion des prospects est passée au niveau supérieur. L'agent vocal couplé à l'automatisation du CRM nous fait gagner des heures chaque semaine et améliore nos taux de conversion.",
    metric: "Taux de conversion amélioré",
    project: "Agent vocal + CRM"
  },
  {
    name: "Valentin",
    role: "Fondateur",
    company: "Stefano Design & Exotic Design",
    avatar: "VD",
    quote: "Des milliers de contacts dormants transformés en opportunités commerciales concrètes. L'agent vocal nous a permis d'exploiter un gisement de valeur que nous avions sous-estimé.",
    metric: "Milliers de contacts réactivés",
    project: "Réactivation automatisée de BDD"
  },
  {
    name: "Amir",
    role: "Fondateur",
    company: "Entreprise BTP",
    avatar: "AM",
    quote: "De la demande client au suivi de chantier, tout est automatisé. Plus de temps perdu, plus d'erreurs, juste de l'efficacité. Notre organisation a été transformée.",
    metric: "Organisation transformée",
    project: "Gestion des interventions"
  }
];
```

**Source**: `refonte_graphique/Testimonials.md` (short versions)

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create TestimonialsSection Component
**Action**: CREATE
**Location**: `client/src/components/v3/TestimonialsSection.tsx`

**Details**:
```typescript
import { motion } from "framer-motion";
import { useState } from "react";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric: string;
  project: string;
}

const testimonials: Testimonial[] = [
  // ... paste 5 testimonials from Data Models section above
];

export default function TestimonialsSection() {
  // State for pause functionality
  const [isPaused, setIsPaused] = useState(false);

  // Triple array for seamless infinite loop
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

  // Calculate animation distance (one set only, not tripled)
  const cardWidth = 380 + 24; // card width + gap
  const totalWidth = testimonials.length * cardWidth;

  return (
    <section
      id="testimonials"
      className="py-24 bg-v2-navy relative overflow-hidden"
    >
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
          <div className="relative overflow-hidden">
            {/* Gradient fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-v2-navy to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-v2-navy to-transparent z-10 pointer-events-none" />

            {/* Scrolling cards wrapper with pause on hover */}
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
                        <p className="text-sm text-v2-off-white/70">
                          {testimonial.role}
                        </p>
                        <p className="text-xs text-v2-off-white/50">
                          {testimonial.company}
                        </p>
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
                        <span className="text-xs font-semibold">
                          {testimonial.metric}
                        </span>
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

**Why**: This component implements the infinite scroll carousel with all required features: pause on hover, social media style cards, short testimonials, dark theme styling.

**Gotchas**:
- **CRITICAL**: `animate.x` must be `undefined` (not `null` or empty array) when `isPaused` is true to freeze animation
- **CRITICAL**: Key must be `${testimonial.name}-${index}` not just `index` to ensure uniqueness in tripled array
- **CRITICAL**: Calculate `totalWidth` using original array length (5), not tripled length (15)
- Don't forget `overflow-hidden` on carousel container (line 80)
- Gradient overlays must use `from-v2-navy` to match section background
- Use `flex-grow` on quote paragraph (line 105) for equal card heights

### Task 2: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`

**Step 2a: Add Import**
```typescript
// After existing imports (around line 6)
import TestimonialsSection from "@/components/v3/TestimonialsSection";
```

**Step 2b: Add Component After Hero**
Find the `<main>` section (around line 25) and add TestimonialsSection:

```typescript
<main>
  {/* Hero Section */}
  <HeroSection />

  {/* Testimonials Section - NEW */}
  <TestimonialsSection />

  {/* Hidden section placeholders - will be visible in DOM inspector */}
  <div className="hidden">
    {/* Remove testimonials placeholder: */}
    {/* <section id="testimonials" className="py-24" /> */}

    <section id="logos" className="py-24" />
    <section id="problem" className="py-24" />
    {/* ... other placeholders ... */}
  </div>
</main>
```

**Why**: Integrates carousel as second section in landing page, right after hero as specified in requirements.

**Gotchas**:
- Don't forget to remove the `<section id="testimonials">` placeholder from hidden div
- Import path must use `@/` alias (not relative path)

---

## 9. Testing Strategy

### Manual Visual Testing (Playwright MCP)

**Test 1: Scrolling Animation**
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
  filename: "testimonials-scrolling.png"
})

// Verify: Should see cards moving from right to left continuously
```

**Test 2: Pause on Hover**
```javascript
// Hover over carousel (use snapshot to get ref)
mcp__playwright__browser_snapshot()
// Identify carousel container ref from snapshot

mcp__playwright__browser_hover({
  element: "testimonials carousel",
  ref: "[get ref from snapshot]"
})

mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot while hovered (cards should be frozen)
mcp__playwright__browser_take_screenshot({
  filename: "testimonials-paused.png"
})

// Verify: Cards should not move while hovered
```

**Test 3: Individual Card Hover**
```javascript
// Hover over specific card
mcp__playwright__browser_hover({
  element: "testimonial card",
  ref: "[card ref from snapshot]"
})

mcp__playwright__browser_take_screenshot({
  filename: "testimonials-card-hover.png"
})

// Verify: Hovered card should be slightly larger and lifted
```

**Test 4: Mobile Responsiveness**
```javascript
// Resize to mobile
mcp__playwright__browser_resize({ width: 375, height: 812 })

mcp__playwright__browser_take_screenshot({
  filename: "testimonials-mobile.png"
})

// Verify: Cards visible, scrolling works, gradient overlays visible
```

### Integration Tests
Not applicable - this is a presentational component with no API calls or database interactions.

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: No new TypeScript errors. Pre-existing v2 component errors are acceptable.

### Level 2: Build
```bash
npm run build
```
**Expected**: Build succeeds with output like:
```
✓ built in XXXms
dist/public/index.html          X.XX kB
dist/public/assets/index-XXX.js XXX.XX kB
dist/public/assets/index-XXX.css XX.XX kB
```

### Level 3: Visual Testing
```bash
npm run dev
# Then use Playwright MCP tests from Testing Strategy section
```

**Expected behaviors**:
1. ✅ Carousel scrolls continuously right-to-left
2. ✅ Hover over carousel freezes scrolling
3. ✅ Mouse leave resumes scrolling
4. ✅ Individual cards lift and scale on hover
5. ✅ Gradient overlays visible on edges
6. ✅ All 5 testimonials visible (tripled to 15)
7. ✅ Dark theme styling (navy bg, glassmorphism cards)
8. ✅ Responsive on mobile (cards still scrolling)

---

## 11. Integration Points

### Route Registration
Not applicable - no new API routes.

### Configuration Changes
Not applicable - no environment variables needed.

### Database Migrations
Not applicable - data is hardcoded in component.

### Component Registration
- [x] Import TestimonialsSection in LandingV3.tsx
- [x] Add component to render tree (after HeroSection)
- [x] Remove placeholder from hidden div

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Use `whileHover` to control animation pause (doesn't work for animate prop)
- ❌ Calculate animation distance using tripled array length (causes jump)
- ❌ Use `AnimatePresence` (not needed for continuous scroll)
- ❌ Set `animate.x` to `null` or `[]` when paused (use `undefined`)
- ❌ Use long testimonial versions (defeats social media post style)
- ❌ Forget `overflow-hidden` on container (cards will overflow viewport)
- ❌ Use single array without tripling (will see "jump" when loop restarts)

### DO:
- ✅ Use state-based approach with `isPaused` + mouse events
- ✅ Calculate distance for ONE set only (5 cards, not 15)
- ✅ Use simple `motion.div` with `animate` prop
- ✅ Set `animate.x` to `undefined` when paused
- ✅ Use SHORT testimonial versions from Testimonials.md
- ✅ Add `overflow-hidden` to carousel container
- ✅ Triple the array: `[...testimonials, ...testimonials, ...testimonials]`
- ✅ Use unique keys: `key={${testimonial.name}-${index}}`
- ✅ Match gradient colors to section background (`from-v2-navy`)

---

## 13. Progressive Success

### Phase 1: Basic Carousel (Minimal Viable)
1. Create TestimonialsSection.tsx with hardcoded testimonials
2. Implement continuous scroll animation (without pause)
3. Verify scrolling works smoothly

**Validation**: Carousel scrolls continuously, no errors

### Phase 2: Add Pause Functionality
1. Add `isPaused` state
2. Add `onMouseEnter/Leave` handlers
3. Conditionally set `animate.x` based on `isPaused`

**Validation**: Scrolling pauses on hover, resumes on leave

### Phase 3: Polish & Integration
1. Add card hover effects (scale + lift)
2. Add gradient overlays
3. Add section header with ScrollReveal
4. Integrate into LandingV3.tsx

**Validation**: All features working, visual polish complete

### Phase 4: Responsive & Final Validation
1. Test on mobile viewport
2. Run all validation gates
3. Visual testing with Playwright

**Validation**: All tests pass, ready for production

---

## Final Validation Checklist

Before marking complete:
- [ ] All validation gates pass (check, build, visual)
- [ ] All success criteria met (see section 3)
- [ ] Code follows v3 component patterns (dark theme, glassmorphism)
- [ ] Pause on hover functionality working perfectly
- [ ] Short testimonial versions used (not long versions)
- [ ] Responsive design works on mobile
- [ ] No console errors or warnings
- [ ] Gradient overlays match section background
- [ ] Card heights are equal (flex-grow on quote)
- [ ] Unique keys on tripled array items
- [ ] Animation distance calculated correctly (one set, not tripled)
- [ ] Visual tests captured with Playwright screenshots

---

## Confidence Score: 9/10

**Why 9/10**:
- ✅ Complete working reference in v2 (same infinite scroll pattern)
- ✅ All testimonial data provided with short versions
- ✅ Clear pause technique documented (state-based approach)
- ✅ Detailed gotchas and anti-patterns section
- ✅ Step-by-step implementation tasks with pseudocode
- ✅ Validation commands specified
- ✅ Visual testing approach with Playwright

**Missing 1 point**:
- Pause on hover technique requires manual testing to verify smooth freeze/resume
- No automated test can verify animation smoothness (requires human observation)

**Mitigation**: Extensive visual testing checklist provided with Playwright commands for manual verification.
