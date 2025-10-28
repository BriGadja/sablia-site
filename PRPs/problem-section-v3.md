# PRP: ProblemSection v3 - Staggered Problem Cards

**Confidence Score: 9/10**

---

## 1. Goal and Why

**What are we building?**
A ProblemSection component for LandingV3 that displays 3 common B2B problems Sablia solves, presented in a clean 3-column grid with lucide-react icons and staggered reveal animations using GSAP ScrollTrigger.

**Why are we building it?**
- Establish customer empathy by acknowledging pain points
- Position Sablia as understanding partner (not fear-mongering)
- Create visual interest with staggered animations
- Build on existing v3 design language (glassmorphism, navy/charcoal)
- Follow progression: Hero → Testimonials → Logos → **Problems** → Solution

---

## 2. What (Requirements)

### User-Visible Behavior
When users scroll to the ProblemSection:
1. Section header fades in immediately (ScrollReveal)
2. Three problem cards animate in sequentially with 0.2s stagger
3. Cards start at `opacity: 0, y: 60` and animate to `opacity: 1, y: 0`
4. Each card shows an icon, title, and description
5. Cards have glassmorphism styling with hover effects (scale 1.05, opacity change)
6. Gradient background from v2-navy to v2-charcoal (with 90% opacity for particles visibility)

### Functional Requirements
- **Component**: `client/src/components/v3/ProblemSection.tsx`
- **3 problem cards** in responsive grid layout
- **Icons**: Clock, AlertTriangle, TrendingDown from lucide-react (size 48, cyan color)
- **Layout**: 3 columns desktop → 1 column mobile
- **Animations**:
  - Section entry: ScrollReveal wrapper
  - Card stagger: GSAP ScrollTrigger with `fromTo` + stagger 0.2s
- **Integration**: Add to `LandingV3.tsx` after LogosCloud section
- **Styling**: Glassmorphism cards with gradient background

### Non-Functional Requirements
- **Performance**: GPU-accelerated animations (transform/opacity only)
- **Accessibility**: Proper heading hierarchy (h2 section, h3 cards), no color-only meaning
- **Responsiveness**: Mobile-first grid (grid-cols-1 md:grid-cols-3)
- **Browser Support**: Modern browsers with GSAP ScrollTrigger support

---

## 3. Success Criteria

The implementation is complete when:
- [x] ProblemSection component created at `client/src/components/v3/ProblemSection.tsx`
- [x] 3 problem cards with icons, titles, descriptions
- [x] Responsive grid: 3 cols desktop → 1 col mobile
- [x] GSAP staggered animation on scroll (0.2s delay between cards)
- [x] ScrollReveal wrapper for section header
- [x] Glassmorphism card styling with hover effects
- [x] Gradient background (v2-navy/90 to v2-charcoal with gradient-to-b)
- [x] Integrated into LandingV3.tsx after LogosCloud
- [x] lucide-react icons: Clock, AlertTriangle, TrendingDown (cyan, size 48)
- [x] TypeScript check passes (`npm run check`)
- [x] Production build succeeds (`npm run build`)
- [x] No console errors during animation
- [x] Professional, empathetic tone (no fear-mongering)

---

## 4. Documentation & References

### Official Documentation
- **GSAP ScrollTrigger**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
  - Specific: `start: "top 80%"` trigger point
  - `toggleActions: "play none none reverse"` for play on enter, reverse on leave
  - `stagger: 0.2` creates waterfall effect (200ms delay between elements)
- **lucide-react**: https://lucide.dev/
  - Icons: Clock, AlertTriangle, TrendingDown
  - Size prop: `size={48}`
  - className for color: `className="text-v2-cyan"`
- **Framer Motion**: https://www.framer.com/motion/
  - `whileHover={{ scale: 1.05 }}` for card lift effect
- **Tailwind CSS**: https://tailwindcss.com/docs
  - Grid: `grid-cols-1 md:grid-cols-3`
  - Glassmorphism: `bg-v2-charcoal/30 backdrop-blur-md`

### Relevant Code Examples
- `client/src/components/v3/LogosCloud.tsx` - ScrollReveal usage pattern, semi-transparent bg
- `client/src/components/v3/TestimonialsSection.tsx` - ScrollReveal usage, semi-transparent bg
- `client/src/components/v2/ProblemSection.tsx` - Problem card structure (but uses Framer Motion stagger)
- `client/src/components/animations/ScrollReveal.tsx` - GSAP + ScrollTrigger setup (already registers plugin)
- `client/src/pages/LandingV3.tsx` - Integration point

### External Resources
- **GSAP Stagger Demo**: https://greensock.com/docs/v3/Staggers
- **Glassmorphism CSS**: https://css.glass/

---

## 5. Codebase Context

### Current Structure (Relevant Files)
```
client/src/
├── components/
│   ├── v2/
│   │   └── ProblemSection.tsx        # Reference for problem data structure
│   ├── v3/
│   │   ├── HeroSection.tsx           # Section 1
│   │   ├── TestimonialsSection.tsx   # Section 2
│   │   ├── LogosCloud.tsx            # Section 3
│   │   └── [CREATE] ProblemSection.tsx  # Section 4 (NEW)
│   └── animations/
│       └── ScrollReveal.tsx          # GSAP ScrollTrigger wrapper
└── pages/
    └── LandingV3.tsx                 # Integration point
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   └── v3/
│       └── ProblemSection.tsx        # ✅ Created with GSAP stagger
└── pages/
    └── LandingV3.tsx                 # ✅ Imports and renders <ProblemSection />
```

### Key Files to Modify
- `client/src/pages/LandingV3.tsx` - Add import and component render after LogosCloud (line ~35)

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks

**GSAP ScrollTrigger:**
- ✅ `ScrollReveal` component already calls `gsap.registerPlugin(ScrollTrigger)` - don't need to call again
- ❌ If you call `gsap.registerPlugin(ScrollTrigger)` twice, no error but redundant
- ✅ Use `gsap.fromTo()` not `gsap.from()` for explicit initial/final states
- ❌ Don't use `.to()` for scroll animations - start state will be current state (wrong)
- ✅ `trigger: cardsRef.current` targets the container div
- ❌ Don't use `trigger: '.problem-card'` - only triggers on first card

**lucide-react:**
- ✅ Import like: `import { Clock, AlertTriangle, TrendingDown } from "lucide-react"`
- ❌ Don't import from `"lucide-react/icons"` - wrong path
- ✅ Size prop is number: `size={48}`
- ❌ Don't use string: `size="48"` - TypeScript error

**React + GSAP:**
- ✅ Must cleanup ScrollTrigger on unmount: `return () => { ScrollTrigger.getAll().forEach(t => t.kill()); }`
- ❌ If you don't cleanup, memory leak + errors on navigation
- ✅ Check `if (!cardsRef.current) return` before GSAP calls
- ❌ If ref is null, GSAP throws error

### Common Mistakes

**Animation Targeting:**
- ❌ `gsap.fromTo('.problem-card', ...)` - won't work, need to query from ref
- ✅ `const cards = cardsRef.current.querySelectorAll('.problem-card')`
- ❌ Forgetting `.problem-card` class on card divs - stagger won't work
- ✅ Add `className="problem-card"` to each card wrapper

**Stagger Configuration:**
- ❌ `stagger: { each: 0.2 }` - object syntax, works but verbose
- ✅ `stagger: 0.2` - number shorthand, cleaner
- ❌ `stagger: 0.02` - too fast (20ms), cards blur together
- ✅ `stagger: 0.2` - 200ms, clear sequential reveal

**ScrollTrigger Timing:**
- ❌ `start: "top top"` - animation starts when card top hits viewport top (too late)
- ✅ `start: "top 80%"` - starts when card top hits 80% down viewport (better UX)
- ❌ `end: "bottom 20%"` - reverse happens too early on scroll up
- ✅ `toggleActions: "play none none reverse"` - handles both directions

### Error Patterns

**Error: "Cannot read property 'querySelectorAll' of null"**
- **Cause**: `cardsRef.current` is null when useEffect runs
- **Fix**: Add null check: `if (!cardsRef.current) return;`

**Error: "gsap.fromTo is not a function"**
- **Cause**: GSAP not imported correctly
- **Fix**: `import gsap from "gsap"` or `import { gsap } from "gsap"`

**Error: "ScrollTrigger is not defined"**
- **Cause**: ScrollTrigger plugin not registered
- **Fix**: Not an issue - ScrollReveal component already registers it globally

**Animation doesn't trigger:**
- **Cause**: `.problem-card` class missing on card elements
- **Fix**: Add `className="problem-card"` to each mapped card div

**Cards jump on hover:**
- **Cause**: transform-origin not set (defaults to center, which is correct)
- **Fix**: No fix needed - default behavior is correct

---

## 7. Data Models & Schemas

### Problem Card Interface
```typescript
interface Problem {
  id: number;
  icon: React.ReactNode;  // lucide-react component
  title: string;          // Problem headline (short, punchy)
  description: string;    // Supporting details (empathetic tone)
}
```

### Problem Data (3 Cards)
```typescript
const problems: Problem[] = [
  {
    id: 1,
    icon: <Clock size={48} className="text-v2-cyan" />,
    title: "Temps perdu sur tâches répétitives",
    description: "Vos équipes passent des heures sur des tâches manuelles qui pourraient être automatisées, au détriment de missions à plus forte valeur ajoutée."
  },
  {
    id: 2,
    icon: <AlertTriangle size={48} className="text-v2-cyan" />,
    title: "Erreurs humaines coûteuses",
    description: "Les processus manuels génèrent des erreurs de saisie, des doublons et des oublis qui impactent votre professionnalisme et votre chiffre d'affaires."
  },
  {
    id: 3,
    icon: <TrendingDown size={48} className="text-v2-cyan" />,
    title: "Croissance limitée par le manque d'outils",
    description: "Sans automatisation, votre capacité à scaler est limitée par les ressources humaines disponibles et les budgets contraints."
  }
];
```

**Tone Guidelines:**
- Empathetic, not fear-mongering
- Acknowledge real problems without exaggeration
- Position Sablia as understanding partner, not judging
- B2B professional French language
- Use "Vos équipes" not "Votre entreprise" (more human)

---

## 8. Implementation Tasks

### Task 1: Create ProblemSection Component File
**Action**: CREATE
**Location**: `client/src/components/v3/ProblemSection.tsx`
**Details**:
```typescript
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface Problem {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const problems: Problem[] = [
  {
    id: 1,
    icon: <Clock size={48} className="text-v2-cyan" />,
    title: "Temps perdu sur tâches répétitives",
    description: "Vos équipes passent des heures sur des tâches manuelles qui pourraient être automatisées, au détriment de missions à plus forte valeur ajoutée."
  },
  {
    id: 2,
    icon: <AlertTriangle size={48} className="text-v2-cyan" />,
    title: "Erreurs humaines coûteuses",
    description: "Les processus manuels génèrent des erreurs de saisie, des doublons et des oublis qui impactent votre professionnalisme et votre chiffre d'affaires."
  },
  {
    id: 3,
    icon: <TrendingDown size={48} className="text-v2-cyan" />,
    title: "Croissance limitée par le manque d'outils",
    description: "Sans automatisation, votre capacité à scaler est limitée par les ressources humaines disponibles et les budgets contraints."
  }
];

export default function ProblemSection() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.problem-card');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Cleanup ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-v2-navy/90 to-v2-charcoal relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-v2-white mb-4"
            >
              Les défis de l'automatisation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-v2-off-white/80 max-w-3xl mx-auto"
            >
              Vous reconnaissez-vous dans l'une de ces situations ?
            </motion.p>
          </div>
        </ScrollReveal>

        {/* Problem Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              className="problem-card bg-v2-charcoal/30 backdrop-blur-md rounded-xl p-8 border border-v2-cyan/10 hover:bg-v2-charcoal/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              {/* Icon */}
              <div className="mb-6">{problem.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-v2-white mb-4">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-v2-off-white/80 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```
**Why**: Core component with all requirements - GSAP stagger, lucide-react icons, glassmorphism, responsive grid.
**Gotchas**:
- Must include `.problem-card` class on each card for GSAP selector
- Must cleanup ScrollTrigger in useEffect return
- Must check `cardsRef.current` for null before GSAP calls
- Semi-transparent background `from-v2-navy/90` for particles visibility

---

### Task 2: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
// Add import at top (around line 8)
import ProblemSection from "@/components/v3/ProblemSection";

// Add component render after LogosCloud (around line 35)
{/* Logos Cloud Section */}
<LogosCloud />

{/* Problem Section */}
<ProblemSection />

// Remove placeholder from hidden div (around line 39)
// DELETE this line: <section id="problem" className="py-24" />
```
**Why**: Integrate new section into page flow after LogosCloud.
**Gotchas**:
- Import path uses `@/` alias (resolved to `client/src/`)
- Remove placeholder div to avoid duplicate IDs
- Position matters: Hero → Testimonials → Logos → **Problems** → Solution

---

### Task 3: Validation - TypeScript Check
**Action**: RUN
**Command**: `npm run check`
**Expected**: No TypeScript errors
**If Fails**: Check imports, interface definitions, ref types

---

### Task 4: Validation - Production Build
**Action**: RUN
**Command**: `npm run build`
**Expected**: Build succeeds with no errors
**If Fails**: Check for syntax errors, missing imports

---

## 9. Testing Strategy

### Manual Testing Checklist

**Visual Validation:**
1. Navigate to `http://localhost:5000/landingv3`
2. Scroll down to Problem Section (after Logos)
3. Verify:
   - Section header fades in
   - 3 cards appear sequentially with stagger (0.2s delay)
   - Cards animate from `opacity: 0, y: 60` to visible
   - Icons are cyan and size 48
   - Desktop: 3 columns side-by-side
   - Hover: card scales to 1.05
   - Hover: background becomes more opaque
   - Glassmorphism blur effect visible
   - Gradient background (navy/90 to charcoal) with particles visible
   - No console errors

**Mobile Testing:**
4. Resize to 375px width
5. Verify:
   - Cards stack vertically (1 column)
   - Stagger animation still works
   - Touch-friendly spacing

**Performance Testing:**
6. Open DevTools Performance tab
7. Record scroll into section
8. Verify: 60fps during animations (no jank)

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check  # TypeScript type checking
```
**Expected**: No errors, compilation successful

### Level 2: Build
```bash
npm run build  # Production build
```
**Expected**: Build completes successfully

### Level 3: Visual Validation (Optional)
```javascript
// Playwright commands for automated visual check
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.4); }"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({ filename: "prp-2.1-problem-section.png" })
```

---

## 11. Integration Points

### Component Registration
- [x] Import ProblemSection in `LandingV3.tsx`
- [x] Render between LogosCloud and Solution sections
- [x] Remove placeholder `<section id="problem" />` from hidden div

### No Configuration Changes Needed
- GSAP already installed (v3.13.0)
- lucide-react already installed (v0.453.0)
- framer-motion already installed (v11.13.1)
- ScrollReveal component already exists

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Use Framer Motion for stagger (v2 pattern) - use GSAP for v3 consistency
- ❌ Call `gsap.registerPlugin(ScrollTrigger)` in ProblemSection - ScrollReveal does it
- ❌ Use `gsap.to()` for scroll animations - start state will be wrong
- ❌ Forget `.problem-card` class - GSAP won't find elements
- ❌ Skip cleanup in useEffect - memory leak
- ❌ Use opaque backgrounds - particles won't be visible

### DO:
- ✅ Use GSAP `fromTo()` with explicit initial/final states
- ✅ Query cards from ref: `cardsRef.current.querySelectorAll()`
- ✅ Cleanup ScrollTrigger on unmount
- ✅ Check ref for null before GSAP calls
- ✅ Use semi-transparent backgrounds (`/90` opacity)
- ✅ Follow existing v3 patterns (glassmorphism, gradient backgrounds)

---

## 13. Progressive Success

### Phase 1: Minimal Implementation (Must Have)
1. Create ProblemSection.tsx with 3 static cards
2. Add to LandingV3.tsx
3. Verify TypeScript compiles

### Phase 2: Core Animations (Must Have)
4. Add GSAP stagger animation
5. Add ScrollReveal wrapper
6. Test animation triggers on scroll

### Phase 3: Styling Polish (Must Have)
7. Add glassmorphism styling
8. Add hover effects (scale, opacity)
9. Add gradient background
10. Verify particles visible through background

### Phase 4: Final Validation (Must Have)
11. Run `npm run check`
12. Run `npm run build`
13. Test on desktop and mobile
14. Verify no console errors

---

## Final Validation Checklist

Before marking complete:
- [x] ProblemSection component created with all features
- [x] GSAP stagger animation working (0.2s delay)
- [x] lucide-react icons rendering (Clock, AlertTriangle, TrendingDown)
- [x] Responsive grid (3 cols → 1 col)
- [x] Glassmorphism styling with hover effects
- [x] Gradient background with 90% opacity
- [x] Integrated into LandingV3.tsx after LogosCloud
- [x] ScrollTrigger cleanup on unmount
- [x] TypeScript check passes
- [x] Production build succeeds
- [x] No console errors
- [x] Professional, empathetic tone in copy
- [x] Particles visible through semi-transparent background

---

## Confidence Assessment

**Score: 9/10**

**What makes this achievable:**
- Clear requirements with exact implementation details
- Comprehensive code example matching all requirements
- All dependencies already installed (GSAP, lucide-react, framer-motion)
- ScrollReveal component already handles GSAP setup
- Pattern established in existing v3 components (LogosCloud, Testimonials)
- Detailed gotchas and anti-patterns documented

**Why not 10/10:**
- First time using GSAP directly in v3 (ScrollReveal uses it internally)
- Potential for ref timing issues if not careful with null checks
- Stagger animation might need timing adjustment based on visual preference

**Risk Mitigation:**
- Explicit null check before GSAP calls
- Cleanup function to prevent memory leaks
- Comprehensive validation gates
- Reference to existing v2 component for problem data structure

---

## Execution Log Template

After implementation, add to `refonte_graphique/sequence/avancement_refonte.md`:

```markdown
## PRP 2.1: ProblemSection - 3 Problem Cards (YYYY-MM-DD)

**Status**: ✅ COMPLETED
**Confidence Score**: 9/10

### Objectif
Créer une section avec 3 cartes de problèmes B2B affichées en grid responsive avec animations staggered GSAP.

### Implémentation Réalisée

**Fonctionnalités**:
- 3 cartes de problèmes avec icônes lucide-react (Clock, AlertTriangle, TrendingDown)
- Grid responsive: 3 colonnes desktop → 1 colonne mobile
- Animation GSAP stagger (0.2s delay entre cartes)
- Glassmorphism styling avec hover effects (scale 1.05)
- Gradient background (v2-navy/90 to v2-charcoal) pour visibilité des particules
- ScrollReveal wrapper pour l'entrée de section

**Fichiers modifiés**:
- `client/src/components/v3/ProblemSection.tsx` - Composant créé
- `client/src/pages/LandingV3.tsx` - Intégration après LogosCloud

**Animations**:
- Section header: ScrollReveal fade-in
- Cards: GSAP fromTo avec stagger 0.2s (opacity 0→1, y 60→0)
- Hover: scale 1.0→1.05, opacity 30%→50%

### Résultats de Validation

**TypeScript Check**: ✅ PASSED
**Production Build**: ✅ PASSED
**Visual Validation**: ✅ PASSED (desktop + mobile)
**Performance**: ✅ 60fps pendant animations

### Métriques
- **Temps d'implémentation**: ~X minutes
- **Lignes de code**: ~150 lignes (composant complet)
- **Taille bundle**: Impact minimal (GSAP déjà utilisé)

### Leçons Apprises
- GSAP stagger fonctionne bien pour cartes sequentielles
- Semi-transparent backgrounds (90%) permettent visibilité particules
- Cleanup ScrollTrigger essentiel pour éviter memory leaks
- Pattern v3 bien établi (facilite implémentation rapide)

### Prochaine Étape
**PRP 2.2 - SolutionSection**: Section présentant les 3 solutions/approches de Sablia
```
