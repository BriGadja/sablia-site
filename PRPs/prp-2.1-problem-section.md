# PRP 2.1: ProblemSection - Staggered Problem Cards with GSAP

**Confidence Score: 9/10**

---

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript type-checking
2. **Build Validation**: Production build success
3. **Visual Validation**: Playwright browser testing
4. **Manual Testing**: Desktop + mobile verification

---

## 1. Goal and Why

**What are we building?**
A ProblemSection component displaying 3 common B2B problems that Sablia solves, presented in a clean 3-column responsive grid with lucide-react icons and staggered reveal animations using GSAP ScrollTrigger.

**Why are we building it?**
- **Customer empathy**: Acknowledge pain points without fear-mongering
- **Positioning**: Establish Sablia as understanding partner, not judge
- **Visual interest**: Create engaging staggered animations on scroll
- **Design consistency**: Follow v3 glassmorphism and gradient background pattern
- **User journey**: Continue narrative flow (Hero → Testimonials → Logos → **Problems** → Solution)

---

## 2. What (Requirements)

### User-Visible Behavior
When users scroll to the ProblemSection:
1. Section header (title + subtitle) fades in using ScrollReveal
2. Three problem cards animate in sequentially with 0.2s stagger delay
3. Cards start at `opacity: 0, y: 60` and animate to `opacity: 1, y: 0` (rising effect)
4. Each card displays:
   - Large cyan icon (48px) at top
   - Bold title (24px, white)
   - Description text (16px, off-white/80, relaxed line height)
5. Cards have glassmorphism styling (semi-transparent background with blur)
6. Hover effects: card scales to 1.05 and background becomes more opaque
7. Gradient background from v2-navy to v2-charcoal with 90% opacity (particles visible)

### Functional Requirements
- **Component path**: `client/src/components/v3/ProblemSection.tsx`
- **3 problem cards** in responsive grid layout
- **Icons**: Clock, AlertTriangle, TrendingDown from lucide-react (size 48, cyan color)
- **Layout**:
  - Desktop: 3 columns side-by-side (`grid-cols-1 md:grid-cols-3`)
  - Mobile: 1 column stacked
- **Animations**:
  - Section header: ScrollReveal wrapper for entry animation
  - Cards: GSAP ScrollTrigger with `fromTo()` + stagger 0.2s
- **Integration**: Add to `LandingV3.tsx` as fourth section (after LogosCloud)
- **Styling**: Glassmorphism cards (`bg-v2-charcoal/30 backdrop-blur-md`) with gradient background

### Non-Functional Requirements
- **Performance**: GPU-accelerated animations using only transform and opacity (60fps target)
- **Accessibility**:
  - Proper heading hierarchy (h2 for section, h3 for cards)
  - Sufficient color contrast (white on navy = 13.9:1)
  - No reliance on color alone for meaning
  - Icons are decorative (text provides context)
- **Responsiveness**: Mobile-first grid with Tailwind breakpoints
- **Browser Support**: Modern browsers with GSAP ScrollTrigger support (ES6+)
- **Tone**: Professional, empathetic B2B French language (no emojis, no fear-mongering)

---

## 3. Success Criteria

The implementation is complete when:
- [x] ProblemSection.tsx created at `client/src/components/v3/ProblemSection.tsx`
- [x] 3 problem cards with Clock, AlertTriangle, TrendingDown icons (cyan, 48px)
- [x] Responsive grid: 3 columns desktop → 1 column mobile
- [x] GSAP staggered animation on scroll (0.2s delay between cards, 0.8s duration each)
- [x] ScrollReveal wrapper for section header (fade animation)
- [x] Glassmorphism card styling with hover effects (scale 1.05, opacity change)
- [x] Gradient background `bg-gradient-to-b from-v2-navy/90 to-v2-charcoal`
- [x] Integrated into LandingV3.tsx after LogosCloud section
- [x] Problem data in empathetic, professional tone (French, B2B)
- [x] TypeScript check passes (`npm run check`)
- [x] Production build succeeds (`npm run build`)
- [x] No console errors during animation
- [x] Visual validation with Playwright (desktop + mobile screenshots)

---

## 4. Documentation & References

### Official Documentation
- **GSAP ScrollTrigger**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
  - `start: "top 80%"` - Animation starts when element top reaches 80% down viewport
  - `toggleActions: "play none none reverse"` - Plays forward on enter, reverses on scroll back up
  - `stagger: 0.2` - Creates waterfall effect with 200ms delay between elements
  - `ease: "power3.out"` - Smooth deceleration curve
- **lucide-react**: https://lucide.dev/
  - Icons: Clock, AlertTriangle, TrendingDown
  - Size prop: `size={48}` (number, not string)
  - Styling: `className="text-v2-cyan"` for color
- **Framer Motion**: https://www.framer.com/motion/ (for hover effects)
  - `whileHover={{ scale: 1.05 }}` for card lift effect
- **Tailwind CSS**: https://tailwindcss.com/docs
  - Grid: `grid grid-cols-1 md:grid-cols-3 gap-8`
  - Glassmorphism: `bg-v2-charcoal/30 backdrop-blur-md`
  - Gradient: `bg-gradient-to-b from-v2-navy/90 to-v2-charcoal`

### Relevant Code Examples
- `client/src/components/v3/HeroSection.tsx` - ScrollReveal usage, gradient background pattern
- `client/src/components/v3/LogosCloud.tsx` - ScrollReveal wrapper, semi-transparent bg
- `client/src/components/v3/TestimonialsSection.tsx` - Section structure, gradient background
- `client/src/components/v2/ProblemSection.tsx` - Problem card structure reference (uses Framer Motion)
- `client/src/components/animations/ScrollReveal.tsx` - GSAP + ScrollTrigger setup (already registers plugin)
- `client/src/pages/LandingV3.tsx` - Integration point after LogosCloud

### External Resources
- **GSAP Stagger Demo**: https://greensock.com/docs/v3/Staggers
- **Glassmorphism CSS**: https://css.glass/
- **B2B Copywriting Best Practices**: Empathetic tone, acknowledge problems without exaggeration

---

## 5. Codebase Context

### Current Structure (Relevant Files)
```
client/src/
├── components/
│   ├── v2/
│   │   └── ProblemSection.tsx        # Reference for problem data structure
│   ├── v3/
│   │   ├── HeroSection.tsx           # Section 1 (completed)
│   │   ├── TestimonialsSection.tsx   # Section 2 (completed)
│   │   ├── LogosCloud.tsx            # Section 3 (completed)
│   │   ├── Navigation.tsx            # Nav component
│   │   └── [CREATE] ProblemSection.tsx  # Section 4 (NEW - THIS PRP)
│   └── animations/
│       └── ScrollReveal.tsx          # GSAP ScrollTrigger wrapper
└── pages/
    └── LandingV3.tsx                 # Integration point (line ~35)
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
- **CREATE**: `client/src/components/v3/ProblemSection.tsx` - New component
- **MODIFY**: `client/src/pages/LandingV3.tsx` - Add import and render after LogosCloud (around line 35)

### Dependencies Already Installed
```json
{
  "gsap": "^3.13.0",              // ✅ Already installed
  "lucide-react": "^0.453.0",     // ✅ Already installed
  "framer-motion": "^11.13.1"     // ✅ Already installed
}
```

### Tailwind Color Variables (Already Defined)
```typescript
// tailwind.config.ts - colors section
"v2-navy": "#0A2463",        // Dark blue background
"v2-electric": "#3E92CC",    // Medium blue accent
"v2-cyan": "#52D1DC",        // Light cyan accent (icons)
"v2-white": "#FFFFFF",       // White text
"v2-off-white": "#F8F9FA",   // Slightly off-white text
"v2-charcoal": "#2D3142"     // Dark gray/charcoal
```

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks

**GSAP ScrollTrigger:**
- ✅ `ScrollReveal` component already calls `gsap.registerPlugin(ScrollTrigger)` globally
- ❌ Don't call `gsap.registerPlugin(ScrollTrigger)` again in ProblemSection - redundant (but harmless)
- ✅ Use `gsap.fromTo()` for explicit initial/final states (not `gsap.from()` or `gsap.to()`)
- ❌ If you use `gsap.to()`, initial state will be whatever is in CSS (unpredictable)
- ✅ Target container ref as trigger: `trigger: cardsRef.current`
- ❌ Don't use `trigger: '.problem-card'` - only triggers on first card
- ✅ `start: "top 80%"` means "start animation when top of element hits 80% down viewport"
- ✅ `toggleActions: "play none none reverse"` handles both scroll directions

**lucide-react:**
- ✅ Import named exports: `import { Clock, AlertTriangle, TrendingDown } from "lucide-react"`
- ❌ Don't import from `"lucide-react/icons"` - incorrect path
- ✅ Size prop is number: `size={48}` (TypeScript type)
- ❌ Don't use string: `size="48"` - TypeScript error

**React + GSAP Integration:**
- ✅ **CRITICAL**: Must cleanup ScrollTrigger on unmount to prevent memory leaks
  ```typescript
  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
  ```
- ❌ If you forget cleanup, you get memory leaks and errors on navigation
- ✅ Check `if (!cardsRef.current) return` before GSAP calls (ref might be null)
- ❌ If ref is null when GSAP runs, you get "Cannot read property 'querySelectorAll' of null"

### Common Mistakes

**Animation Targeting:**
- ❌ `gsap.fromTo('.problem-card', ...)` - Won't work, can't query from document
- ✅ `const cards = cardsRef.current.querySelectorAll('.problem-card')` - Query from ref
- ❌ Forgetting `.problem-card` class on card divs - stagger won't work (empty NodeList)
- ✅ Add `className="problem-card"` to each card wrapper in `.map()`

**Stagger Configuration:**
- ❌ `stagger: { each: 0.2 }` - Object syntax, works but verbose
- ✅ `stagger: 0.2` - Number shorthand (200ms), cleaner and more common
- ❌ `stagger: 0.02` - Too fast (20ms), cards blur together, not noticeable
- ✅ `stagger: 0.2` - 200ms, clear sequential reveal, pleasant rhythm

**ScrollTrigger Timing:**
- ❌ `start: "top top"` - Animation starts when card top hits viewport top (too late, off-screen)
- ✅ `start: "top 80%"` - Starts when card top hits 80% down viewport (better UX, visible)
- ❌ `end: "bottom 20%"` without reverse - Animation gets stuck
- ✅ `toggleActions: "play none none reverse"` - Handles both scroll directions cleanly

**Background Opacity:**
- ❌ `from-v2-navy to-v2-charcoal` (opaque) - Hides particles background
- ✅ `from-v2-navy/90 to-v2-charcoal` (90% opacity) - Particles visible through background
- ❌ `from-v2-navy/50` - Too transparent, text contrast suffers
- ✅ `from-v2-navy/90` - Good balance between particles visibility and text contrast

### Error Patterns

**Error: "Cannot read property 'querySelectorAll' of null"**
- **Cause**: `cardsRef.current` is null when `useEffect` runs (component not mounted yet)
- **Fix**: Add null check: `if (!cardsRef.current) return;`

**Error: "gsap.fromTo is not a function"**
- **Cause**: GSAP not imported correctly
- **Fix**: `import gsap from "gsap"` (default import, not named)

**Error: "ScrollTrigger is not defined"**
- **Cause**: ScrollTrigger plugin not registered
- **Fix**: Not an issue in this project - `ScrollReveal` component already registers it globally

**Animation doesn't trigger on scroll:**
- **Cause**: `.problem-card` class missing on card elements
- **Fix**: Ensure `className="problem-card"` is on each card div in `.map()`

**Cards jump or jitter on hover:**
- **Cause**: `transform-origin` not centered (default is center, so this shouldn't happen)
- **Fix**: No fix needed - default behavior is correct. If it happens, add `origin-center` class.

**Stagger animation plays immediately, not on scroll:**
- **Cause**: Missing `scrollTrigger` config in GSAP animation
- **Fix**: Ensure `scrollTrigger: { trigger: cardsRef.current, ... }` is present

---

## 7. Data Models & Schemas

### Problem Card Interface
```typescript
interface Problem {
  id: number;              // Unique identifier for React key
  icon: React.ReactNode;   // lucide-react component instance
  title: string;           // Problem headline (short, punchy, 3-8 words)
  description: string;     // Supporting details (empathetic tone, 1-2 sentences)
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
- ✅ Empathetic, not fear-mongering (acknowledge real problems without exaggeration)
- ✅ Position Sablia as understanding partner, not judging consultant
- ✅ B2B professional French language (formal "vous", not casual "tu")
- ✅ Use "Vos équipes" not "Votre entreprise" (more human, team-focused)
- ❌ No emojis (B2B professional standard, 74% of professionals 45+ find them unprofessional)
- ❌ No dramatic language ("catastrophe", "désastre", "crise") - too alarmist
- ✅ Focus on opportunity cost and growth limitations (positive framing)

**Alternative Problem Ideas** (if needed for variation):
- "Dépendance aux outils étrangers" (dependency on foreign SaaS tools)
- "Équipes submergées par les tâches administratives" (teams overwhelmed by admin)
- "Données éparpillées dans plusieurs outils" (data scattered across multiple tools)

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create ProblemSection Component
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
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Les défis de l'automatisation
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Vous reconnaissez-vous dans l'une de ces situations ?
          </p>
        </ScrollReveal>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              className="problem-card bg-v2-charcoal/30 backdrop-blur-md rounded-xl p-8 hover:bg-v2-charcoal/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-6">{problem.icon}</div>
              <h3 className="text-2xl font-semibold text-v2-white mb-4">
                {problem.title}
              </h3>
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
**Why**:
- Core component with all requirements met
- GSAP stagger animation for sequential reveal (0.2s delay, 0.8s duration)
- lucide-react icons (Clock, AlertTriangle, TrendingDown) in cyan
- Glassmorphism styling (`bg-v2-charcoal/30 backdrop-blur-md`)
- Responsive grid (3 cols desktop, 1 col mobile)
- ScrollReveal wrapper for section header
- Semi-transparent background (90% opacity) for particles visibility
- Hover effects with Framer Motion (`whileHover`)
- Proper cleanup in useEffect return

**Gotchas**:
- ✅ Must include `.problem-card` class on each card for GSAP selector
- ✅ Must cleanup ScrollTrigger in useEffect return (prevents memory leaks)
- ✅ Must check `cardsRef.current` for null before GSAP calls
- ✅ Semi-transparent background `from-v2-navy/90` allows particles to show through
- ✅ `gsap.registerPlugin(ScrollTrigger)` is redundant but harmless (already called in ScrollReveal)

---

### Task 2: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:

**Step 2.1**: Add import at top (around line 8)
```typescript
import ProblemSection from "@/components/v3/ProblemSection";
```

**Step 2.2**: Add component render after LogosCloud (around line 35)
```typescript
{/* Logos Cloud Section */}
<LogosCloud />

{/* Problem Section */}
<ProblemSection />
```

**Step 2.3**: Remove placeholder from hidden div (around line 39)
```typescript
// DELETE this line:
<section id="problem" className="py-24" />
```

**Why**:
- Integrate new section into page flow at correct position (after LogosCloud, before Solution)
- Import path uses `@/` alias (resolves to `client/src/`)
- Remove placeholder div to avoid duplicate section IDs and confusion

**Gotchas**:
- ✅ Position matters: Hero → Testimonials → Logos → **Problems** → Solution (user journey flow)
- ✅ Remove placeholder to avoid duplicate IDs in DOM
- ✅ Use `@/` path alias (already configured in vite.config.ts)

---

### Task 3: Validation - TypeScript Check
**Action**: RUN
**Command**:
```bash
npm run check
```
**Expected**: No TypeScript errors (pre-existing errors in v2 components are acceptable)
**If Fails**:
- Check imports (lucide-react, gsap, framer-motion)
- Check interface definitions (Problem interface)
- Check ref types (useRef<HTMLDivElement>(null))
- Check icon size prop (must be number, not string)

---

### Task 4: Validation - Production Build
**Action**: RUN
**Command**:
```bash
npm run build
```
**Expected**: Build succeeds with no errors, bundle size increases minimally (~3-5 KB)
**If Fails**:
- Check for syntax errors in ProblemSection.tsx
- Check for missing imports
- Check for type mismatches

---

## 9. Testing Strategy

### Manual Testing Checklist

**Desktop Testing (http://localhost:5000/landingv3):**
1. Navigate to page and scroll to Problem Section
2. Verify section title "Les défis de l'automatisation" fades in
3. Verify subtitle "Vous reconnaissez-vous..." fades in
4. Verify 3 cards appear sequentially with stagger (0.2s delay visible)
5. Verify cards animate from `opacity: 0, y: 60` to visible (rising effect)
6. Verify icons are cyan (#52D1DC) and size 48px
7. Verify 3 columns side-by-side on desktop (>768px)
8. Verify hover: card scales to 1.05 (subtle lift)
9. Verify hover: background becomes more opaque (30% → 50%)
10. Verify glassmorphism blur effect is visible on cards
11. Verify gradient background (navy/90 to charcoal) with particles visible
12. Verify no console errors (open DevTools)

**Mobile Testing (resize to 375px width):**
13. Resize browser to 375px width (or use responsive mode)
14. Verify cards stack vertically (1 column)
15. Verify stagger animation still works (cards appear sequentially)
16. Verify touch-friendly spacing (gap-8 = 32px between cards)
17. Verify text is readable (no overflow, proper line breaks)
18. Verify icons don't break layout

**Performance Testing:**
19. Open DevTools Performance tab
20. Start recording
21. Scroll into Problem Section
22. Stop recording
23. Verify: 60fps during animations (no frame drops, no jank)
24. Verify: No long tasks (>50ms) during animation

**Accessibility Testing:**
25. Verify heading hierarchy (h2 for section, h3 for cards)
26. Verify color contrast (use DevTools contrast checker)
   - White text on navy: 13.9:1 (WCAG AAA)
   - Off-white/80 on navy: ~11:1 (WCAG AAA)
27. Verify keyboard navigation works (can tab through cards)
28. Verify icons are decorative (no alt text needed, text provides context)

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check  # TypeScript type checking
```
**Expected**: No new TypeScript errors (compilation successful)
**Pre-existing errors**: Acceptable if they're in v2 components, not related to ProblemSection

### Level 2: Build
```bash
npm run build  # Production build
```
**Expected**: Build completes successfully, bundle size increases by ~3-5 KB
**Bundle Impact**:
- GSAP: Already loaded (0 KB added)
- lucide-react: Already loaded (0 KB added)
- ProblemSection component: ~3-5 KB (minimal impact)

### Level 3: Visual Validation (Playwright)
```bash
npm run dev  # Start dev server
```

Then run in Playwright MCP:
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to problem section (40% down page)
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.4); }"
})

// Wait for stagger animation to complete (3 cards × 0.2s + 0.8s = ~1.4s, use 2s for safety)
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot after animation
mcp__playwright__browser_take_screenshot({ filename: "prp-2.1-problem-section.png" })

// Test mobile responsive
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.4); }"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({ filename: "prp-2.1-problem-mobile.png" })

// Check console for errors
mcp__playwright__browser_console_messages()
```

**Expected**:
- Desktop screenshot shows 3 cards in row, icons visible, gradient background
- Mobile screenshot shows cards stacked vertically
- No console errors related to ProblemSection

---

## 11. Integration Points

### Component Registration
- [x] Import ProblemSection in `LandingV3.tsx`
- [x] Render ProblemSection between LogosCloud and hidden placeholders
- [x] Remove placeholder `<section id="problem" />` from hidden div

### No Configuration Changes Needed
All dependencies already installed:
- ✅ GSAP already installed (v3.13.0) - used in ScrollReveal
- ✅ lucide-react already installed (v0.453.0) - used in Navigation
- ✅ framer-motion already installed (v11.13.1) - used throughout v3
- ✅ ScrollReveal component already exists - GSAP setup done
- ✅ Tailwind colors already defined (v2-navy, v2-cyan, v2-charcoal, etc.)

### Route Configuration
- ✅ Route `/landingv3` already configured in `client/src/App.tsx`
- ✅ No new routes needed

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Use Framer Motion for stagger (v2 pattern) - Use GSAP for v3 consistency
- ❌ Call `gsap.registerPlugin(ScrollTrigger)` in ProblemSection if worried about redundancy (it's harmless though)
- ❌ Use `gsap.to()` for scroll animations - Initial state will be CSS default (unpredictable)
- ❌ Forget `.problem-card` class on card divs - GSAP selector won't find elements
- ❌ Skip cleanup in useEffect - Causes memory leaks and errors on navigation
- ❌ Use opaque backgrounds (`from-v2-navy to-v2-charcoal`) - Hides particles
- ❌ Use string for icon size (`size="48"`) - TypeScript error
- ❌ Import from wrong path (`"lucide-react/icons"`) - Module not found
- ❌ Use fear-mongering language in copy - Damages trust with B2B audience
- ❌ Add emojis to titles or descriptions - Unprofessional for B2B

### DO:
- ✅ Use GSAP `fromTo()` with explicit initial and final states
- ✅ Query cards from ref: `cardsRef.current.querySelectorAll('.problem-card')`
- ✅ Cleanup ScrollTrigger on unmount: `ScrollTrigger.getAll().forEach(t => t.kill())`
- ✅ Check ref for null before GSAP calls: `if (!cardsRef.current) return`
- ✅ Use semi-transparent backgrounds (`from-v2-navy/90`) for particles visibility
- ✅ Follow existing v3 patterns (glassmorphism, gradient backgrounds, ScrollReveal)
- ✅ Use empathetic, professional tone in problem statements
- ✅ Focus on opportunity cost, not disaster scenarios
- ✅ Test on both desktop and mobile viewports

---

## 13. Progressive Success

### Phase 1: Minimal Implementation (Must Have)
1. ✅ Create ProblemSection.tsx with 3 static cards
2. ✅ Add basic structure (section, container, grid, cards)
3. ✅ Add to LandingV3.tsx
4. ✅ Verify TypeScript compiles (`npm run check`)

### Phase 2: Core Animations (Must Have)
5. ✅ Add GSAP stagger animation with ScrollTrigger
6. ✅ Add ScrollReveal wrapper for section header
7. ✅ Test animation triggers on scroll
8. ✅ Verify no console errors

### Phase 3: Styling Polish (Must Have)
9. ✅ Add glassmorphism styling (`backdrop-blur-md`)
10. ✅ Add hover effects (scale, opacity change)
11. ✅ Add gradient background with 90% opacity
12. ✅ Verify particles visible through background
13. ✅ Test responsive grid (3 cols → 1 col)

### Phase 4: Final Validation (Must Have)
14. ✅ Run `npm run check` (TypeScript)
15. ✅ Run `npm run build` (production build)
16. ✅ Test on desktop (3 columns, animations)
17. ✅ Test on mobile (1 column, animations)
18. ✅ Visual validation with Playwright screenshots
19. ✅ Verify no console errors during animation
20. ✅ Verify professional, empathetic tone in copy

---

## Final Validation Checklist

Before marking complete, verify ALL of the following:
- [ ] ProblemSection component created with all features implemented
- [ ] GSAP stagger animation working (0.2s delay between cards, 0.8s duration)
- [ ] lucide-react icons rendering correctly (Clock, AlertTriangle, TrendingDown in cyan)
- [ ] Responsive grid working (3 columns desktop, 1 column mobile)
- [ ] Glassmorphism styling visible on cards (semi-transparent bg, blur effect)
- [ ] Gradient background with 90% opacity (particles visible through)
- [ ] Integrated into LandingV3.tsx after LogosCloud section
- [ ] ScrollTrigger cleanup implemented in useEffect return
- [ ] ScrollReveal wrapper on section header
- [ ] Hover effects working (scale 1.05, opacity change)
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors during development or animation
- [ ] Professional, empathetic tone in problem copy (French, B2B)
- [ ] No emojis in content (B2B professional standard)
- [ ] Particles visible through semi-transparent background
- [ ] Desktop visual validation screenshot captured
- [ ] Mobile visual validation screenshot captured
- [ ] Performance: 60fps during animations (no jank)

---

## Confidence Assessment

**Score: 9/10**

### What makes this achievable:
- ✅ **Clear requirements**: Exact implementation details provided with full code example
- ✅ **All dependencies installed**: GSAP, lucide-react, framer-motion already in package.json
- ✅ **Existing patterns**: ScrollReveal component already handles GSAP setup
- ✅ **Similar components**: v3 components (LogosCloud, Testimonials) follow same patterns
- ✅ **Comprehensive gotchas**: All common mistakes documented with fixes
- ✅ **Validation commands**: TypeScript check, build, Playwright visual validation
- ✅ **Complete code example**: Full component provided in INITIAL file
- ✅ **Integration point clear**: Exactly where to add in LandingV3.tsx

### Why not 10/10:
- ⚠️ **First direct GSAP usage in v3**: While ScrollReveal uses GSAP internally, this is the first component using GSAP directly in v3 components (slight risk of ref timing issues)
- ⚠️ **Stagger timing preference**: 0.2s stagger might need visual adjustment based on actual feel (could be 0.15s or 0.25s)
- ⚠️ **Cleanup complexity**: ScrollTrigger cleanup requires careful implementation (memory leak risk if forgotten)

### Risk Mitigation:
- ✅ **Null check before GSAP calls**: Explicit `if (!cardsRef.current) return` check
- ✅ **Cleanup function provided**: Complete useEffect return with ScrollTrigger.kill() all
- ✅ **Comprehensive validation**: TypeScript, build, visual validation, console check
- ✅ **Reference to existing component**: v2 ProblemSection provides data structure reference
- ✅ **Detailed error patterns**: All common errors documented with causes and fixes

### Implementation Time Estimate:
- Component creation: 10 minutes (code provided, copy-paste with understanding)
- Integration into LandingV3: 2 minutes
- TypeScript check and fixes: 2 minutes (should pass first time)
- Build validation: 3 minutes
- Visual validation (Playwright): 5 minutes
- Manual testing (desktop + mobile): 5 minutes
- **Total**: ~25-30 minutes

---

## Execution Log Template

**IMPORTANT**: After successful implementation, add log to:
`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Template**:
```markdown
## 2025-10-27 - PRP 2.1 - ProblemSection

**Status**: ✅ Complété

**Résumé**:
- Créé `client/src/components/v3/ProblemSection.tsx` avec 3 cartes de problèmes B2B
- Animation GSAP stagger (0.2s delay entre cartes, 0.8s duration par carte)
- Icônes lucide-react (Clock, AlertTriangle, TrendingDown) en cyan 48px
- Grid responsive: 3 colonnes desktop → 1 colonne mobile
- Glassmorphism styling avec hover effects (scale 1.05, opacity 30%→50%)
- Gradient background (v2-navy/90 to v2-charcoal) pour visibilité particules
- ScrollReveal wrapper pour l'entrée de section header
- Intégré dans LandingV3.tsx après LogosCloud (ligne ~36)

**Validation**:
- [x] TypeScript check: Pass (aucune nouvelle erreur)
- [x] Production build: Pass (bundle size: +3.2 KB)
- [x] Dev server: Pass (http://localhost:5000/landingv3)
- [x] Console errors: Aucune erreur liée à ProblemSection
- [x] Visual validation (Playwright): 2 screenshots
  - `prp-2.1-problem-section.png`: Desktop 3 colonnes, animations stagger visible
  - `prp-2.1-problem-mobile.png`: Mobile 1 colonne stack, responsive validé
- [x] Performance: 60fps pendant animations (DevTools Performance)

**Fonctionnalités**:
- 3 problèmes avec ton empathique, professionnel (pas de fear-mongering)
- Animation stagger séquentielle (0.2s delay, rising effect de y:60 à y:0)
- Hover effects subtils (scale 1.05, opacity change)
- Glassmorphism cards (backdrop-blur-md, semi-transparent bg)
- Gradient background avec opacity 90% (particules visibles)
- Responsive grid avec Tailwind breakpoints (md:grid-cols-3)

**Fichiers créés/modifiés**:
- `client/src/components/v3/ProblemSection.tsx` (créé): ~100 lignes
  - Interface Problem avec icon, title, description
  - Data: 3 problèmes (temps perdu, erreurs humaines, croissance limitée)
  - useEffect avec GSAP fromTo + stagger + ScrollTrigger
  - Cleanup ScrollTrigger on unmount
  - ScrollReveal wrapper pour section header
  - Grid responsive avec map() sur problems array
- `client/src/pages/LandingV3.tsx` (modifié):
  - Ligne 8: Ajout `import ProblemSection from "@/components/v3/ProblemSection"`
  - Ligne ~36: Ajout `<ProblemSection />` après `<LogosCloud />`
  - Ligne ~40: Suppression placeholder `<section id="problem" />`

**Issues rencontrées**:
- Aucune issue - implémentation fluide grâce au PRP détaillé
- Pre-existing TypeScript errors (v2 components) - non liés à PRP 2.1

**Métriques**:
- **Temps d'implémentation**: ~25 minutes
- **Lignes de code**: ~100 lignes (component complet)
- **Bundle size impact**: +3.2 KB JS (GSAP/lucide-react déjà chargés)
- **Performance**: 60fps pendant animations (GPU-accelerated)

**Leçons Apprises**:
- GSAP stagger très efficace pour animations séquentielles (plus performant que Framer Motion pour ce cas)
- Semi-transparent backgrounds (90% opacity) critiques pour visibilité particules
- Cleanup ScrollTrigger essentiel pour éviter memory leaks sur navigation
- Pattern v3 bien établi (glassmorphism + gradient) facilite implémentation rapide
- Ton empathique sans fear-mongering renforce confiance B2B

**Prochaine Étape**: PRP 2.2 - SolutionSection (3 solutions/approches Sablia)
```

**Note**: Update checkmarks in avancement_refonte.md Phase 2 section from ✅ (planned) to ✅ (completed with date).

---

**End of PRP 2.1**
