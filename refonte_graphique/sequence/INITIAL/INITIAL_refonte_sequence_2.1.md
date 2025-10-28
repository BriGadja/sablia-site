# INITIAL - PRP 2.1 - ProblemSection

## FEATURE

Create a section highlighting 3 common B2B problems that Sablia solves, presented in a clean 3-column layout with icons.

**Requirements**:
- 3 problem statements with supporting descriptions
- Custom icons or lucide-react icons for each problem
- 3-column layout on desktop, stacked on mobile
- Staggered reveal animation on scroll (GSAP ScrollTrigger)
- Professional, empathetic tone (acknowledge pain points without fear-mongering)
- Each card with subtle glassmorphism styling

**Visual Deliverable**: 3-column grid of problem cards with icons, animating in with staggered timing when scrolled into view, positioned after LogosCloud section.

**Technical Requirements**:
- Component path: `client/src/components/v3/ProblemSection.tsx`
- Use ScrollReveal for section entry
- Use GSAP ScrollTrigger for staggered card animations
- lucide-react icons: Clock, AlertTriangle, TrendingDown (or similar)
- Integrate into LandingV3.tsx as fourth section

## EXAMPLES

**ProblemSection Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { Clock, AlertTriangle, TrendingDown } from "lucide-react";
import { useEffect, useRef } from "react";
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
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
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
            <div
              key={problem.id}
              className="problem-card bg-v2-charcoal/30 backdrop-blur-md rounded-xl p-8 hover:bg-v2-charcoal/50 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-6">{problem.icon}</div>
              <h3 className="text-2xl font-semibold text-v2-white mb-4">
                {problem.title}
              </h3>
              <p className="text-v2-off-white/80 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Reference Existing Component**: Check `client/src/components/v2/ProblemSection.tsx` for existing patterns (but create new v3 version).

**GSAP ScrollTrigger Pattern**:
```typescript
gsap.fromTo(
  elements,
  { opacity: 0, y: 60 },  // Initial state
  {
    opacity: 1, y: 0,      // Final state
    stagger: 0.2,          // Delay between elements
    scrollTrigger: {
      trigger: container,
      start: "top 80%",    // When top of container hits 80% of viewport
      toggleActions: "play none none reverse"
    }
  }
);
```

## DOCUMENTATION

**Problem Statements** (B2B Pain Points for French SMBs):

1. **Temps perdu sur tâches répétitives**:
   - Icon: Clock (lucide-react)
   - Problem: Manual repetitive tasks consuming valuable time
   - Impact: Teams can't focus on high-value work

2. **Erreurs humaines coûteuses**:
   - Icon: AlertTriangle (lucide-react)
   - Problem: Manual processes lead to errors, duplicates, oversights
   - Impact: Damages professionalism and revenue

3. **Croissance limitée par le manque d'outils**:
   - Icon: TrendingDown or BarChart3 (lucide-react)
   - Problem: Can't scale without throwing more people at problems
   - Impact: Growth constrained by budget and headcount

**Alternative Problem Ideas**:
- "Dépendance aux outils étrangers" (dependency on foreign tools)
- "Équipes submergées par les tâches administratives" (teams overwhelmed by admin)
- "Données éparpillées dans plusieurs outils" (data scattered across tools)

**Tone Guidelines**:
- Empathetic, not fear-mongering
- Acknowledge real problems without exaggeration
- Position Sablia as understanding partner, not judging
- B2B professional language

**lucide-react Icons**:
- https://lucide.dev/
- Already installed
- Suggested icons: Clock, AlertTriangle, TrendingDown, BarChart3, Users, Target

**GSAP ScrollTrigger**:
- https://greensock.com/docs/v3/Plugins/ScrollTrigger
- `start: "top 80%"` means animation starts when element top reaches 80% down viewport
- `toggleActions: "play none none reverse"` plays forward on enter, reverses on leave
- Stagger creates waterfall effect (0.2s delay between cards)

**Glassmorphism Card Styling**:
```css
background: rgba(45, 49, 66, 0.3);  /* v2-charcoal with transparency */
backdrop-filter: blur(12px);
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
- Desktop: 3 columns side-by-side
- Tablet: 2 columns (third wraps)
- Mobile: 1 column stacked
- Use `grid-cols-1 md:grid-cols-3`
- Gap: 32px (gap-8)

**Card Hover Effects**:
- Scale: 1.0 → 1.05 (subtle lift)
- Background opacity: 30% → 50% (more opaque)
- Transition: 300ms smooth
- Use `hover:scale-105` and `hover:bg-v2-charcoal/50`

**Icon Styling**:
- Size: 48px (large enough to be prominent)
- Color: `text-v2-cyan` (brand color)
- Margin bottom: 24px (mb-6)

**Typography**:
- Section title: 48px (text-5xl), bold, white
- Section subtitle: 20px (text-xl), off-white/80
- Card title: 24px (text-2xl), semibold, white
- Card description: 16px (text-base), off-white/80, leading-relaxed

**Animation Timing**:
- Stagger delay: 0.2s between cards
- Total reveal: 3 cards × 0.2s = 0.6s
- Duration per card: 0.8s
- Easing: "power3.out" (smooth deceleration)

**Accessibility**:
- Icons are decorative (no alt text needed, have text context)
- Proper heading hierarchy (h2 for section, h3 for cards)
- Sufficient color contrast (white on navy = 13.9:1)
- No reliance on color alone (text conveys meaning)

**Performance**:
- GSAP is GPU-accelerated (transform/opacity only)
- ScrollTrigger uses Intersection Observer (efficient)
- No layout thrashing or forced reflows
- Stagger doesn't block main thread

**Gotchas**:
- Must call `gsap.registerPlugin(ScrollTrigger)` before using
- Ensure cards have `.problem-card` class for GSAP selector
- Cleanup ScrollTrigger instances on unmount (GSAP does this automatically)
- Test on mobile - 3 staggered animations might be slower (acceptable)

**Z-Index**:
- ProblemSection: default flow
- Cards: no special z-index (hover scale doesn't require it)

**Known Issues to Avoid**:
- If stagger doesn't work, check `.problem-card` class is on elements
- If animation doesn't trigger, verify ScrollTrigger is registered
- If cards "jump" on hover, ensure transform-origin is center (default)
- If gradient background looks harsh, adjust opacity or add more color stops

**GSAP Cleanup** (important for React):
```typescript
useEffect(() => {
  // ... animation setup ...

  return () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}, []);
```

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to problem section
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.4); }"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot after stagger animation
mcp__playwright__browser_take_screenshot({ filename: "prp-2.1-problem-section.png" })

// Test mobile
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.4); }"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({ filename: "prp-2.1-problem-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Section title and subtitle display correctly
- [ ] 3 problem cards visible in grid
- [ ] Desktop: 3 columns side-by-side
- [ ] Mobile: 1 column stacked
- [ ] Cards fade in with staggered timing (0.2s delay)
- [ ] Animation triggers when scrolling into view
- [ ] Icons display correctly (Clock, AlertTriangle, TrendingDown)
- [ ] Icons are cyan color
- [ ] Card titles are bold and readable
- [ ] Card descriptions have good line height
- [ ] Hover effect: card scales to 1.05
- [ ] Hover effect: background becomes more opaque
- [ ] Glassmorphism blur effect visible
- [ ] Gradient background (navy to charcoal) looks good
- [ ] No console errors
- [ ] Performance: 60fps during animations

**Success Criteria**:
- ✅ 3 problem statements with icons and descriptions
- ✅ 3-column layout on desktop, stack on mobile
- ✅ Staggered reveal animation on scroll (GSAP ScrollTrigger)
- ✅ Each card with glassmorphism styling
- ✅ Hover effects: scale + opacity change
- ✅ lucide-react icons (Clock, AlertTriangle, TrendingDown)
- ✅ Professional, empathetic tone
- ✅ Positioned after LogosCloud section
- ✅ Gradient background (navy to charcoal)
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 2.1 - ProblemSection
- **Prochaine étape**: PRP 2.2 - SolutionSection
