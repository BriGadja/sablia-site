# PRP 2.3 - ThreeStepProcess Timeline Component

**Generated from**: `INITIAL_refonte_sequence_2.3.md`
**Confidence Score**: 9/10
**Estimated Implementation Time**: 45-60 minutes

---

## 1. GOAL AND WHY

### What We're Building
Create a visual timeline component showcasing Sablia's 3-step methodology for automation projects: **Découvrir → Former → Optimiser**. This timeline serves as a critical trust-building element that demystifies the automation process for B2B clients.

### Why This Matters
- **Process Transparency**: French SMBs are cautious about automation - showing clear steps reduces friction
- **Journey Visualization**: Timeline format naturally leads prospects from discovery to optimization
- **Professional Credibility**: Structured methodology signals expertise vs. ad-hoc consulting
- **Conversion Driver**: Clear process → lower perceived risk → higher consultation bookings

### User Experience Goal
Visitors scroll to this section and immediately understand:
1. The project starts with a short audit (1-2 days)
2. Teams get trained before implementation (1-5 days)
3. Optimization happens iteratively (2-8 weeks)

**Visual Impact**: Progressive reveal animation draws attention to each step sequentially, with connecting line "drawing" between steps to reinforce the linear progression.

---

## 2. REQUIREMENTS

### 2.1 User-Visible Requirements

**Timeline Structure**:
- **3 steps displayed horizontally** (desktop) with connecting line
- Each step shows:
  - Large icon (Search, GraduationCap, Rocket from lucide-react)
  - Step number (1, 2, 3) as large watermark
  - Step title ("Découvrir", "Former", "Optimiser")
  - 2-3 sentence description
  - Duration badge (e.g., "1-2 jours")
- Connecting line between steps with progressive "drawing" animation

**Animations**:
- **Staggered reveal**: Cards fade in + slide up sequentially (0.3s delay between each)
- **Line drawing**: Horizontal connector line "draws" from left to right using scaleX transform
- **Scroll-triggered**: Animations trigger when section enters 80% of viewport (GSAP ScrollTrigger)

**Responsive Behavior**:
- **Desktop (lg+)**: Horizontal layout, 3 cards in row, horizontal connector line
- **Mobile (<lg)**: Vertical stack, vertical connector line (or hidden)

### 2.2 Functional Requirements

**Component Interface**:
```typescript
interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
}

export default function ThreeStepProcess(): JSX.Element;
```

**Data Structure**:
```typescript
const steps: Step[] = [
  {
    id: 1,
    icon: <Search size={48} className="text-v2-cyan" />,
    title: "Découvrir",
    description: "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.",
    duration: "1-2 jours"
  },
  {
    id: 2,
    icon: <GraduationCap size={48} className="text-v2-cyan" />,
    title: "Former",
    description: "Formation de vos équipes sur les outils d'automatisation (n8n, Make.com) pour garantir l'autonomie et la pérennité des solutions.",
    duration: "1-5 jours"
  },
  {
    id: 3,
    icon: <Rocket size={48} className="text-v2-cyan" />,
    title: "Optimiser",
    description: "Développement des workflows, tests, mise en production et optimisation continue avec support post-livraison inclus.",
    duration: "2-8 semaines"
  }
];
```

**Animation Requirements**:
- GSAP ScrollTrigger for cards reveal
- CSS transform scaleX for line drawing (transform-origin: left)
- Stagger delay: 0.3s between cards
- Animation duration: 0.8s per card
- Trigger point: "top 80%" (section enters bottom 20% of viewport)

### 2.3 Non-Functional Requirements

**Performance**:
- GSAP animation must be GPU-accelerated (transform, not width)
- Cleanup ScrollTrigger instances on component unmount
- No layout shift during animation (reserve space)

**Accessibility**:
- Semantic HTML: `<section>`, `<h2>`, `<h3>`
- ARIA labels for icons (screen reader friendly)
- Keyboard navigable (if interactive elements added later)
- Color contrast: White text on dark gradient backgrounds (WCAG AA)

**Gradient System Compliance**:
- ❌ **NO** solid backgrounds on `<section>` element
- ✅ **YES** to transparent sections revealing main gradient
- ✅ **YES** to glassmorphism cards: `bg-v2-charcoal/20 backdrop-blur-md`
- Section appears in gradient zone: #2D3142 → #3d2f1f (charcoal → brown transition)

**Browser Compatibility**:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- GSAP works in all modern browsers
- CSS backdrop-blur may need fallback (acceptable degradation)

---

## 3. SUCCESS CRITERIA

### Must Have (P0)
- ✅ 3 steps displayed with correct icons, titles, descriptions, durations
- ✅ Horizontal layout on desktop (lg:flex-row), vertical on mobile
- ✅ Connector line between steps (horizontal desktop, vertical/hidden mobile)
- ✅ Line drawing animation with scaleX (left to right progression)
- ✅ Staggered card reveal with GSAP ScrollTrigger (0.3s delay)
- ✅ Step numbers as watermarks (80-120px size, opacity 10%)
- ✅ Duration badges styled consistently (bg-v2-cyan/20, text-v2-cyan)
- ✅ Gradient system compliance (no solid section backgrounds)
- ✅ Component integrated into LandingV3.tsx after SolutionSection
- ✅ TypeScript check passes (npm run check)
- ✅ Production build succeeds (npm run build)

### Should Have (P1)
- ✅ Smooth animation easing (ease-out for reveal, easeInOut for line)
- ✅ Proper GSAP cleanup (ScrollTrigger.getAll().forEach(trigger => trigger.kill()))
- ✅ Glassmorphism cards with backdrop-blur
- ✅ Circular icon containers with cyan borders
- ✅ Mobile responsive (cards stack, readable text)

### Nice to Have (P2)
- 🔲 Hover effects on cards (scale: 1.02 or glow)
- 🔲 Arrow icons on connector line
- 🔲 Step number animation (fade in with card)
- 🔲 prefers-reduced-motion support (disable animations)

### Anti-Patterns to Avoid
- ❌ Using `bg-v2-navy` or `bg-v2-electric` on section (breaks gradient)
- ❌ Animating width or height (causes layout shift, not GPU accelerated)
- ❌ Forgetting ScrollTrigger cleanup (memory leaks)
- ❌ Hardcoding connector line position (use relative positioning)
- ❌ Multiple ScrollTriggers without cleanup (performance issues)

---

## 4. DOCUMENTATION & REFERENCES

### GSAP ScrollTrigger
- **Official Docs**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Key Concepts**:
  - `trigger`: Element that triggers animation when scrolled into view
  - `start`: "top 80%" = trigger when element top reaches 80% from viewport top
  - `toggleActions`: "play none none reverse" = play on enter, reverse on exit
  - `stagger`: Delay between animating multiple elements

**Example Pattern** (from ProblemSection.tsx):
```typescript
useEffect(() => {
  if (!cardsRef.current) return;

  const cards = cardsRef.current.querySelectorAll('.step-card');

  gsap.fromTo(cards,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    }
  );

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

### Framer Motion (Alternative for Line Drawing)
- **Docs**: https://www.framer.com/motion/
- **Pattern**: Use `motion.div` with `initial={{ scaleX: 0 }}` and `animate={{ scaleX: 1 }}`
- **Note**: GSAP preferred for ScrollTrigger integration

### lucide-react Icons
- **Icons Needed**: `Search`, `GraduationCap`, `Rocket`
- **Import**: `import { Search, GraduationCap, Rocket } from "lucide-react";`
- **Sizing**: `size={48}` for large icon display
- **Color**: `className="text-v2-cyan"` for brand consistency

### Tailwind CSS Classes
- **Glassmorphism**: `bg-v2-charcoal/20 backdrop-blur-md`
- **Transform Origin**: `origin-left` (for scaleX animation from left)
- **Grid/Flex**: `flex flex-col lg:flex-row` (vertical mobile, horizontal desktop)
- **Gap**: `gap-12` (48px spacing between cards)

### Gradient Reference
- **Full Docs**: `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md`
- **Section Zone**: This component appears around 65-80% gradient (charcoal → brown transition)
- **Rule**: Keep `<section>` transparent, use glassmorphism for cards

---

## 5. CODEBASE CONTEXT

### 5.1 Existing v2 Implementation

**File**: `client/src/components/v2/ThreeStepProcess.tsx`

**Key Patterns to Adapt**:
- Vertical timeline with connector lines (change to horizontal)
- Framer Motion staggerChildren animation
- Step data structure with id, title, description
- Expandable cards (NOT needed for v3 - simpler display)

**What to Keep**:
- Data structure (Step interface)
- Staggered animation concept

**What to Change**:
- Use GSAP instead of Framer Motion for scroll trigger
- Horizontal layout instead of vertical
- Simpler non-expandable cards
- Line drawing animation

### 5.2 v3 Component Patterns

**Reference 1: ProblemSection.tsx** (GSAP ScrollTrigger Pattern)
```typescript
useEffect(() => {
  if (!cardsRef.current) return;

  const cards = cardsRef.current.querySelectorAll('.problem-card');

  gsap.fromTo(cards, { opacity: 0, y: 60 }, {
    opacity: 1, y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: cardsRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

**Reference 2: SolutionSection.tsx** (Horizontal Layout with Separators)
```typescript
<div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-0">
  {solutions.map((solution, index) => (
    <React.Fragment key={solution.id}>
      <div className="flex-1 flex flex-col items-center text-center px-8">
        {/* Card content */}
      </div>

      {/* Separator between items */}
      {index < solutions.length - 1 && (
        <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
      )}
    </React.Fragment>
  ))}
</div>
```

**Adaptation for ThreeStepProcess**:
- Use horizontal separator (w-full h-px) instead of vertical
- Position separator between cards using absolute positioning
- Animate separator with scaleX transform

### 5.3 LandingV3.tsx Integration

**Current Structure**:
```typescript
<main>
  <HeroSection />
  <TestimonialsSection />
  <LogosCloud />
  <ProblemSection />
  <SolutionSection />
  {/* INSERT ThreeStepProcess HERE */}
</main>
```

**Integration Point**: After SolutionSection, before future sections

### 5.4 Import Paths
```typescript
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, GraduationCap, Rocket } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
```

**Note**: Register GSAP plugin:
```typescript
gsap.registerPlugin(ScrollTrigger);
```

---

## 6. KNOWN GOTCHAS & PITFALLS

### 6.1 GSAP ScrollTrigger

**Gotcha 1: Missing Cleanup**
```typescript
// ❌ BAD: Memory leak
useEffect(() => {
  gsap.to(".card", { opacity: 1 });
}, []);

// ✅ GOOD: Cleanup on unmount
useEffect(() => {
  gsap.to(".card", { opacity: 1 });

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

**Gotcha 2: Trigger Element Not Found**
```typescript
// ❌ BAD: cardsRef.current might be null
gsap.fromTo(".step-card", ...);

// ✅ GOOD: Guard clause
useEffect(() => {
  if (!cardsRef.current) return;

  const cards = cardsRef.current.querySelectorAll('.step-card');
  gsap.fromTo(cards, ...);
}, []);
```

**Gotcha 3: Duplicate ScrollTriggers**
- If component re-renders, multiple ScrollTriggers are created
- Solution: Always cleanup in useEffect return
- Alternative: Use dependency array carefully

### 6.2 Line Drawing Animation

**Gotcha 1: Transform Origin**
```css
/* ❌ BAD: Line scales from center */
.connector-line {
  transform: scaleX(0);
}

/* ✅ GOOD: Line scales from left */
.connector-line {
  transform: scaleX(0);
  transform-origin: left;
}
```

**Gotcha 2: Width Animation (Don't Do This)**
```typescript
// ❌ BAD: Animating width causes layout shift
gsap.fromTo(".line", { width: 0 }, { width: "100%" });

// ✅ GOOD: Use scaleX (GPU accelerated)
gsap.fromTo(".line", { scaleX: 0 }, { scaleX: 1 });
```

**Gotcha 3: Line Positioning**
- Connector line must be positioned absolutely or relatively
- Desktop: horizontal line between cards
- Mobile: vertical line or hidden (flex-col stacks cards)

### 6.3 Responsive Layout

**Gotcha 1: Connector Line on Mobile**
- Horizontal line doesn't make sense when cards stack vertically
- Solution: Hide line on mobile (`hidden lg:block`) or create vertical variant

**Gotcha 2: Card Width on Desktop**
- If cards are too wide, layout breaks
- Solution: Use `flex-1` for equal width distribution
- Or: Set max-width on card container

### 6.4 Gradient System

**Gotcha 1: Solid Section Background**
```typescript
// ❌ BAD: Blocks gradient
<section className="py-24 bg-v2-navy">

// ✅ GOOD: Transparent section
<section className="py-24">
```

**Gotcha 2: Local Gradients**
```typescript
// ❌ BAD: Conflicts with main gradient
<section className="py-24 bg-gradient-to-b from-v2-navy to-v2-charcoal">

// ✅ GOOD: Use glassmorphism on cards, not section
<section className="py-24">
  <div className="bg-v2-charcoal/20 backdrop-blur-md">
```

### 6.5 TypeScript

**Gotcha 1: ReactNode vs JSX.Element**
```typescript
// ✅ GOOD: ReactNode accepts any renderable content
interface Step {
  icon: React.ReactNode;
}

// ❌ TOO RESTRICTIVE: JSX.Element doesn't accept strings
interface Step {
  icon: JSX.Element;
}
```

---

## 7. DATA MODELS & SCHEMAS

### Step Interface
```typescript
interface Step {
  id: number;              // Unique identifier (1, 2, 3)
  icon: React.ReactNode;   // lucide-react icon component
  title: string;           // Step name ("Découvrir", "Former", "Optimiser")
  description: string;     // 2-3 sentence description
  duration: string;        // Time estimate ("1-2 jours", "2-8 semaines")
}
```

### Steps Data
```typescript
const steps: Step[] = [
  {
    id: 1,
    icon: <Search size={48} className="text-v2-cyan" />,
    title: "Découvrir",
    description: "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.",
    duration: "1-2 jours"
  },
  {
    id: 2,
    icon: <GraduationCap size={48} className="text-v2-cyan" />,
    title: "Former",
    description: "Formation de vos équipes sur les outils d'automatisation (n8n, Make.com) pour garantir l'autonomie et la pérennité des solutions.",
    duration: "1-5 jours"
  },
  {
    id: 3,
    icon: <Rocket size={48} className="text-v2-cyan" />,
    title: "Optimiser",
    description: "Développement des workflows, tests, mise en production et optimisation continue avec support post-livraison inclus.",
    duration: "2-8 semaines"
  }
];
```

**No database schema needed** - this is static content.

---

## 8. IMPLEMENTATION TASKS

### Task 1: CREATE Component File
**Action**: Create `client/src/components/v3/ThreeStepProcess.tsx`

**Full Implementation**:
```typescript
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, GraduationCap, Rocket } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: <Search size={48} className="text-v2-cyan" />,
    title: "Découvrir",
    description: "Audit de vos processus actuels pour identifier les gains rapides et bâtir une roadmap d'automatisation adaptée à votre contexte.",
    duration: "1-2 jours"
  },
  {
    id: 2,
    icon: <GraduationCap size={48} className="text-v2-cyan" />,
    title: "Former",
    description: "Formation de vos équipes sur les outils d'automatisation (n8n, Make.com) pour garantir l'autonomie et la pérennité des solutions.",
    duration: "1-5 jours"
  },
  {
    id: 3,
    icon: <Rocket size={48} className="text-v2-cyan" />,
    title: "Optimiser",
    description: "Développement des workflows, tests, mise en production et optimisation continue avec support post-livraison inclus.",
    duration: "2-8 semaines"
  }
];

export default function ThreeStepProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.step-card');
    const line = lineRef.current;

    // Staggered card reveal
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Line drawing animation
    if (line) {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Notre processus en 3 étapes
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-20 max-w-3xl mx-auto">
            De l'audit initial à l'optimisation continue, nous accompagnons votre transformation digitale avec une méthodologie éprouvée
          </p>
        </ScrollReveal>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:flex items-start justify-between gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.id} className="step-card flex-1 relative">
                {/* Step Card */}
                <div className="bg-v2-charcoal/20 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/20 hover:border-v2-cyan/40 transition-colors relative">
                  {/* Step Number Watermark */}
                  <div className="absolute top-4 right-4 text-[80px] font-bold text-v2-white/10 leading-none">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className="w-24 h-24 rounded-full border-2 border-v2-cyan/50 flex items-center justify-center bg-v2-navy/50">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-v2-white mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-v2-off-white/80 mb-4 leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div className="inline-block px-4 py-2 rounded-full bg-v2-cyan/20 text-v2-cyan text-sm font-semibold relative z-10">
                    {step.duration}
                  </div>
                </div>

                {/* Connector Line (between cards) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 -right-8 w-16 h-0.5 bg-v2-cyan/30 z-0" />
                )}
              </div>
            ))}

            {/* Animated Horizontal Line (behind cards) */}
            <div
              ref={lineRef}
              className="absolute top-12 left-[12%] right-[12%] h-0.5 bg-v2-cyan/50 origin-left"
              style={{ zIndex: 0 }}
            />
          </div>

          {/* Mobile: Vertical Stack */}
          <div className="flex lg:hidden flex-col gap-8">
            {steps.map((step) => (
              <div key={step.id} className="step-card">
                <div className="bg-v2-charcoal/20 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/20 relative">
                  {/* Step Number Watermark */}
                  <div className="absolute top-4 right-4 text-[60px] font-bold text-v2-white/10 leading-none">
                    {step.id}
                  </div>

                  {/* Icon Container */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 rounded-full border-2 border-v2-cyan/50 flex items-center justify-center bg-v2-navy/50">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-v2-white mb-3 relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-v2-off-white/80 mb-4 leading-relaxed relative z-10">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div className="inline-block px-4 py-2 rounded-full bg-v2-cyan/20 text-v2-cyan text-sm font-semibold relative z-10">
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Validation**: Run `npm run check` to verify TypeScript compilation.

### Task 2: MODIFY LandingV3.tsx to Integrate Component

**File**: `client/src/pages/LandingV3.tsx`

**Action**: Add import and render ThreeStepProcess after SolutionSection

**FIND**:
```typescript
import SolutionSection from "@/components/v3/SolutionSection";
```

**INJECT AFTER**:
```typescript
import ThreeStepProcess from "@/components/v3/ThreeStepProcess";
```

**FIND**:
```typescript
<SolutionSection />
```

**INJECT AFTER**:
```typescript
<ThreeStepProcess />
```

**Full Context**:
```typescript
<main>
  <HeroSection />
  <TestimonialsSection />
  <LogosCloud />
  <ProblemSection />
  <SolutionSection />
  <ThreeStepProcess />
</main>
```

**Validation**: Run `npm run build` to verify production build succeeds.

### Task 3: Visual Validation with Playwright

**Action**: Start dev server and capture screenshots

**Commands**:
```bash
npm run dev
```

**Playwright Validation**:
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to ThreeStepProcess section
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, 3500); }"  // Approximate scroll position
})

mcp__playwright__browser_wait_for({ time: 3 })  // Wait for animations

// Desktop screenshot
mcp__playwright__browser_take_screenshot({
  filename: "prp-2.3-threestep-desktop.png"
})

// Mobile screenshot
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, 3500); }"
})
mcp__playwright__browser_wait_for({ time: 3 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-2.3-threestep-mobile.png"
})
```

**Manual Checks**:
- [ ] 3 cards visible with icons, titles, descriptions, durations
- [ ] Desktop: horizontal layout with connecting line
- [ ] Mobile: vertical stack
- [ ] Line drawing animation triggers on scroll
- [ ] Cards stagger in (0.3s delay)
- [ ] Step numbers visible as watermarks
- [ ] Duration badges styled correctly
- [ ] Glassmorphism effect on cards
- [ ] No solid section background (gradient visible)

---

## 9. TESTING STRATEGY

### 9.1 Unit Testing (Optional)
- Not required for this PRP (visual component)
- If added later: Test Step interface, render logic

### 9.2 Integration Testing
**Manual Test**: Verify component renders in LandingV3
- Navigate to http://localhost:5000/landingv3
- Scroll to section (after SolutionSection)
- Verify 3 steps displayed correctly

### 9.3 Visual Testing (Critical)
**Desktop**:
- [ ] 3 cards in horizontal row
- [ ] Equal width distribution (flex-1)
- [ ] Connector line between cards (visible)
- [ ] Animated line draws from left to right
- [ ] Cards reveal with stagger (visible delay)
- [ ] Step numbers large and visible (opacity 10%)
- [ ] Icons centered in circular containers
- [ ] Duration badges styled consistently

**Mobile**:
- [ ] Cards stack vertically
- [ ] No horizontal connector line (or vertical variant)
- [ ] Text readable (not too small)
- [ ] Cards full width with padding
- [ ] Animations still trigger on scroll

**Animation Testing**:
- [ ] Scroll section into view → cards fade in + slide up
- [ ] Line drawing starts after cards (or simultaneous)
- [ ] Stagger delay noticeable (0.3s between cards)
- [ ] Smooth easing (power3.out for cards, power2.inOut for line)
- [ ] No janky animations (60fps)

### 9.4 Accessibility Testing
**Screen Reader**:
- [ ] Section title announced ("Notre processus en 3 étapes")
- [ ] Step titles announced (h3 elements)
- [ ] Descriptions readable
- [ ] Icons have accessible names (lucide-react default)

**Keyboard Navigation**:
- [ ] No interactive elements (no keyboard requirements)
- [ ] If hover effects added, ensure keyboard accessible

**Color Contrast**:
- [ ] White text on dark gradient (WCAG AA compliant)
- [ ] Cyan text on dark backgrounds (sufficient contrast)

### 9.5 Performance Testing
**Bundle Size**:
- [ ] GSAP library already included (no new dependency)
- [ ] Component adds ~5KB to bundle (acceptable)

**Animation Performance**:
- [ ] GSAP uses GPU acceleration (transform, opacity)
- [ ] No layout thrashing (forced reflows)
- [ ] ScrollTrigger cleanup prevents memory leaks

---

## 10. VALIDATION GATES

### Level 1: Syntax & Type Checking
```bash
npm run check
```
**Expected**: ✅ No TypeScript errors

**Common Issues**:
- Missing imports (gsap, ScrollTrigger, icons)
- Type mismatch in Step interface
- ReactNode vs JSX.Element confusion

### Level 2: Build
```bash
npm run build
```
**Expected**: ✅ Production build succeeds

**Common Issues**:
- Import path errors (@/ alias)
- Missing dependencies
- Unused imports (warnings)

### Level 3: Visual Validation
```bash
npm run dev
# Navigate to http://localhost:5000/landingv3
# Scroll to ThreeStepProcess section
```

**Expected**: ✅ Component renders with animations

**Common Issues**:
- GSAP not triggering (missing gsap.registerPlugin)
- Line not drawing (missing transform-origin: left)
- Cards not staggering (incorrect selector)
- Gradient blocked by solid section background

### Level 4: Responsive Validation
```bash
# Test on multiple devices
# Chrome DevTools → Toggle Device Toolbar (Cmd+Shift+M)
# Test: iPhone SE (375px), iPad (768px), Desktop (1280px+)
```

**Expected**: ✅ Layout adapts correctly

**Common Issues**:
- Horizontal line visible on mobile (should hide)
- Cards too wide on desktop
- Text too small on mobile
- Connector line positioning off

---

## 11. INTEGRATION POINTS

### 11.1 LandingV3.tsx
**Integration**: Import and render ThreeStepProcess after SolutionSection

**Dependencies**:
- Navigation (no conflict)
- Footer (no conflict)
- AnimatedParticles (background, no conflict)
- CustomCursor (no conflict)

### 11.2 Gradient System
**Zone**: Component appears in gradient transition zone (65-80%)
- Background color: #2D3142 (charcoal) → #3d2f1f (brown)
- Text color: White (good contrast)

**Rules**:
- No solid section background
- Glassmorphism cards OK
- White text throughout

### 11.3 Animation System
**Existing Animations**:
- AnimatedParticles (background)
- CustomCursor (cursor effect)
- ScrollReveal (section headers)
- GSAP in ProblemSection

**New Animations**:
- GSAP ScrollTrigger for cards reveal
- GSAP for line drawing

**Conflicts**: None (GSAP cleanup prevents memory leaks)

### 11.4 Dependencies
**Required**:
- gsap (already installed)
- lucide-react (already installed)
- framer-motion (already installed, used for ScrollReveal)

**No new dependencies needed**.

---

## 12. CRITICAL ANTI-PATTERNS

### ❌ Anti-Pattern 1: Solid Section Background
```typescript
// ❌ BAD
<section className="py-24 bg-v2-navy">
```

**Why Bad**: Blocks the main gradient, creates visual break

**Fix**: Remove solid background
```typescript
// ✅ GOOD
<section className="py-24">
```

### ❌ Anti-Pattern 2: Animating Width Instead of ScaleX
```typescript
// ❌ BAD
gsap.fromTo(".line", { width: 0 }, { width: "100%" });
```

**Why Bad**: Causes layout shift, not GPU accelerated

**Fix**: Use scaleX transform
```typescript
// ✅ GOOD
gsap.fromTo(".line", { scaleX: 0 }, { scaleX: 1 });
```

### ❌ Anti-Pattern 3: Missing ScrollTrigger Cleanup
```typescript
// ❌ BAD
useEffect(() => {
  gsap.to(".card", { opacity: 1 });
}, []);
```

**Why Bad**: Memory leak when component unmounts

**Fix**: Add cleanup in useEffect return
```typescript
// ✅ GOOD
useEffect(() => {
  gsap.to(".card", { opacity: 1 });

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

### ❌ Anti-Pattern 4: Hardcoding Line Position
```typescript
// ❌ BAD
<div className="absolute top-12 left-0 w-full h-0.5 bg-v2-cyan/50" />
```

**Why Bad**: Doesn't align with card positions if layout changes

**Fix**: Use percentage-based positioning
```typescript
// ✅ GOOD
<div className="absolute top-12 left-[12%] right-[12%] h-0.5 bg-v2-cyan/50" />
```

### ❌ Anti-Pattern 5: Forgetting Transform Origin
```typescript
// ❌ BAD: Line scales from center
<div className="line" style={{ transform: 'scaleX(0)' }} />
```

**Why Bad**: Line grows from center, not left-to-right

**Fix**: Set transform-origin to left
```typescript
// ✅ GOOD
<div className="line origin-left" style={{ transform: 'scaleX(0)' }} />
```

---

## 13. PROGRESSIVE SUCCESS

### Phase 1: Basic Structure (15 min)
**Goal**: Render 3 static cards without animations

**Tasks**:
1. Create ThreeStepProcess.tsx file
2. Define Step interface and data
3. Render cards in horizontal layout (desktop)
4. Add vertical layout for mobile
5. Integrate into LandingV3.tsx

**Validation**: `npm run check && npm run build`

**Success**: Page renders with 3 steps visible

---

### Phase 2: GSAP Animations (15 min)
**Goal**: Add staggered card reveal and line drawing

**Tasks**:
1. Import gsap and ScrollTrigger
2. Register ScrollTrigger plugin
3. Create refs (containerRef, lineRef)
4. Add useEffect with GSAP animations
5. Add cleanup function

**Validation**: Visual check - animations trigger on scroll

**Success**: Cards stagger in, line draws from left to right

---

### Phase 3: Polish & Styling (15 min)
**Goal**: Add glassmorphism, step numbers, duration badges

**Tasks**:
1. Add backdrop-blur to cards
2. Add step number watermarks (absolute positioning)
3. Style duration badges (bg-v2-cyan/20)
4. Add icon circular containers
5. Fine-tune spacing and typography

**Validation**: Visual check - matches design requirements

**Success**: Component looks professional with all styling details

---

### Phase 4: Final Validation (10 min)
**Goal**: Test across devices and verify gradient compliance

**Tasks**:
1. Test desktop layout (lg breakpoint)
2. Test mobile layout (< lg breakpoint)
3. Verify gradient not blocked (no solid section background)
4. Take Playwright screenshots
5. Check accessibility (screen reader, contrast)

**Validation**: All manual checks pass

**Success**: Component ready for production

---

## 14. FINAL VALIDATION CHECKLIST

### Functionality
- [ ] 3 steps render with correct data (titles, descriptions, durations)
- [ ] Icons display correctly (Search, GraduationCap, Rocket)
- [ ] Step numbers visible as watermarks (80-120px, opacity 10%)
- [ ] Duration badges styled consistently
- [ ] Connector line visible between cards (desktop)

### Layout & Responsive
- [ ] Desktop: Horizontal layout (3 cards in row)
- [ ] Mobile: Vertical stack (cards full width)
- [ ] Cards have equal width on desktop (flex-1)
- [ ] Connector line hidden on mobile (or vertical variant)
- [ ] No horizontal scroll on mobile

### Animations
- [ ] Cards reveal with stagger (0.3s delay)
- [ ] Cards animate from opacity 0 → 1, y 60 → 0
- [ ] Line draws from left to right (scaleX 0 → 1)
- [ ] Animations trigger at "top 80%" scroll position
- [ ] Animations smooth (60fps, no jank)
- [ ] GSAP cleanup implemented (no memory leaks)

### Gradient System
- [ ] Section has no solid background (transparent)
- [ ] Main gradient visible through section
- [ ] Cards use glassmorphism (bg-v2-charcoal/20 backdrop-blur-md)
- [ ] White text throughout (text-v2-white, text-v2-off-white)
- [ ] Cyan accents consistent (text-v2-cyan, bg-v2-cyan/20)

### Typography & Styling
- [ ] Section title: 48px, bold, white
- [ ] Section subtitle: 20px, off-white/80
- [ ] Step titles: 24px, bold, white
- [ ] Descriptions: 16px, off-white/80, leading-relaxed
- [ ] Duration badges: 14px, semibold, cyan on cyan/20 background

### Accessibility
- [ ] Semantic HTML (section, h2, h3)
- [ ] Color contrast WCAG AA (white on dark gradient)
- [ ] Icons have accessible names (lucide-react default)
- [ ] No keyboard traps (no interactive elements)

### Integration
- [ ] Component imported in LandingV3.tsx
- [ ] Rendered after SolutionSection
- [ ] No console errors
- [ ] TypeScript check passes (npm run check)
- [ ] Production build succeeds (npm run build)

### Performance
- [ ] Bundle size acceptable (~5KB addition)
- [ ] GSAP animations GPU-accelerated (transform, opacity)
- [ ] ScrollTrigger cleanup implemented
- [ ] No forced reflows (layout thrashing)

### Visual Validation
- [ ] Desktop screenshot captured (Playwright)
- [ ] Mobile screenshot captured (Playwright)
- [ ] Animations captured on video (optional)
- [ ] Component matches design intent

---

## CONFIDENCE SCORE: 9/10

### Why High Confidence
- **Clear Requirements**: INITIAL file provides complete specification
- **Existing Patterns**: v3 components show GSAP ScrollTrigger usage
- **Simple Data**: Static content, no API calls
- **Proven Animations**: GSAP is battle-tested, reliable
- **Gradient Reference**: Clear documentation prevents mistakes

### Potential Risks (Why Not 10/10)
- **Line Positioning**: Connector line alignment might need fine-tuning
- **Mobile Layout**: Vertical connector line (or hiding it) needs testing
- **Animation Timing**: Stagger delay (0.3s) might feel too slow/fast

**Mitigation**: Both risks are easy to fix with visual validation and minor CSS adjustments.

---

## APPENDIX: QUICK REFERENCE

### Component File Path
```
client/src/components/v3/ThreeStepProcess.tsx
```

### Integration Point
```typescript
// client/src/pages/LandingV3.tsx
<SolutionSection />
<ThreeStepProcess />  // <- Add here
```

### Key Imports
```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, GraduationCap, Rocket } from "lucide-react";
```

### Critical CSS Classes
```typescript
// Section: No background
className="py-24 relative overflow-hidden"

// Cards: Glassmorphism
className="bg-v2-charcoal/20 backdrop-blur-md"

// Line: Transform origin
className="origin-left"

// Layout: Horizontal desktop, vertical mobile
className="flex flex-col lg:flex-row"
```

### GSAP Cleanup Pattern
```typescript
useEffect(() => {
  // ... GSAP animations

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

---

**END OF PRP**

Ready for execution with `/execute-prp PRPs/ThreeStepProcess-Timeline.md`
