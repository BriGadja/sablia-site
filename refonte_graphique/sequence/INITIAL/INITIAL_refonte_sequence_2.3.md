# INITIAL - PRP 2.3 - ThreeStepProcess (Timeline)

## FEATURE

Create a visual timeline showing Sablia's 3-step process for automation projects.

**Requirements**:
- 3-step timeline: "Découvrir → Former → Optimiser"
- Visual timeline connector line between steps
- Each step includes: icon, title, description, estimated duration
- Progressive reveal animation on scroll (GSAP ScrollTrigger)
- Responsive: vertical timeline on mobile, horizontal on desktop
- Professional, process-oriented presentation

**Visual Deliverable**: Clean timeline with 3 steps connected by a line, animating progressively as user scrolls, positioned after SolutionSection.

**Technical Requirements**:
- Component path: `client/src/components/v3/ThreeStepProcess.tsx`
- Use GSAP ScrollTrigger for progressive reveal
- lucide-react icons: Search, GraduationCap, Rocket (or similar)
- Connector line animates to "draw" between steps
- Integrate into LandingV3.tsx as sixth section

## EXAMPLES

**ThreeStepProcess Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { Search, GraduationCap, Rocket } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    description: "Audit de vos processus, identification des gains potentiels, et co-construction de la roadmap d'automatisation.",
    duration: "1-2 jours"
  },
  {
    id: 2,
    icon: <GraduationCap size={48} className="text-v2-cyan" />,
    title: "Former",
    description: "Formation de vos équipes sur n8n ou Make.com pour qu'elles deviennent autonomes sur les outils d'automatisation.",
    duration: "1-5 jours"
  },
  {
    id: 3,
    icon: <Rocket size={48} className="text-v2-cyan" />,
    title: "Optimiser",
    description: "Développement des workflows, mise en production, et suivi des performances avec KPI mesurables.",
    duration: "2-8 semaines"
  }
];

export default function ThreeStepProcess() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current || !lineRef.current) return;

    const stepCards = timelineRef.current.querySelectorAll('.step-card');

    // Animate step cards with stagger
    gsap.fromTo(
      stepCards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animate connector line (draw effect)
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-v2-charcoal to-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Notre processus en 3 étapes
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            De l'audit initial à la mise en production, nous vous accompagnons à chaque étape
          </p>
        </ScrollReveal>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-20 left-1/4 right-1/4 h-1">
            <div
              ref={lineRef}
              className="h-full bg-v2-cyan origin-left"
              style={{ transformOrigin: "left" }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="step-card flex flex-col items-center text-center"
              >
                {/* Icon Container */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-v2-navy border-4 border-v2-cyan flex items-center justify-center mb-6">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-v2-white mb-2">
                  {step.title}
                </h3>

                {/* Duration Badge */}
                <div className="inline-block bg-v2-cyan/20 text-v2-cyan px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {step.duration}
                </div>

                {/* Description */}
                <p className="text-v2-off-white/80 leading-relaxed max-w-xs">
                  {step.description}
                </p>

                {/* Step Number */}
                <div className="mt-6 text-6xl font-bold text-v2-cyan/20">
                  0{step.id}
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

**Alternative Timeline Layout** (vertical on mobile):
```typescript
// Vertical line connector for mobile
<div className="lg:hidden absolute left-12 top-0 bottom-0 w-1 bg-v2-cyan/30" />

// Steps with left offset
<div className="relative pl-24 lg:pl-0">
  {/* Step content */}
</div>
```

**Reference Existing Component**: Check `client/src/components/v2/ThreeStepProcess.tsx` for existing patterns (but create new v3 version).

## DOCUMENTATION

**Process Steps** (Sablia's Project Workflow):

1. **Découvrir** (Discover):
   - Icon: Search (lucide-react)
   - Activities: Process audit, opportunity identification, roadmap co-construction
   - Duration: 1-2 jours
   - Output: Clear automation roadmap with prioritized workflows

2. **Former** (Train):
   - Icon: GraduationCap (lucide-react)
   - Activities: Training teams on n8n or Make.com for autonomy
   - Duration: 1-5 jours (depends on team size and complexity)
   - Output: Autonomous team capable of maintaining and building workflows

3. **Optimiser** (Optimize):
   - Icon: Rocket (lucide-react)
   - Activities: Workflow development, production deployment, performance monitoring
   - Duration: 2-8 semaines (depends on complexity)
   - Output: Production workflows with measurable KPIs and ROI

**Timeline Design Patterns**:
- Horizontal on desktop (left to right)
- Vertical on mobile (top to bottom)
- Connector line "draws" to show progression
- Step numbers (01, 02, 03) reinforce sequence

**lucide-react Icons**:
- Search: Discovery/audit phase
- GraduationCap: Training phase
- Rocket: Launch/optimization phase
- Alternative icons: Compass, BookOpen, TrendingUp

**GSAP Timeline Animation**:
```typescript
// Cards animate in with stagger
gsap.fromTo(cards, { opacity: 0, y: 60 }, {
  opacity: 1, y: 0,
  stagger: 0.3,  // 300ms between each card
  scrollTrigger: { trigger, start: "top 70%" }
});

// Line "draws" from left to right
gsap.fromTo(line, { scaleX: 0 }, {
  scaleX: 1,
  duration: 1.5,
  scrollTrigger: { trigger, start: "top 70%" }
});
```

**Icon Container Styling**:
- Circular background: 96px diameter (w-24 h-24)
- Background: Navy (matches page bg)
- Border: 4px cyan (border-4 border-v2-cyan)
- Centered icon with flexbox
- Elevated above connector line (z-10)

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
- Desktop: 3 columns, horizontal connector line
- Mobile: 1 column, vertical connector line (optional)
- Line hidden on mobile (can show vertical variant)
- Gap: 48px mobile → 32px desktop

**Connector Line**:
- Desktop: Horizontal line between icon containers
- Position: `absolute top-20` (aligns with icon centers)
- Width: Spans from left 25% to right 25% (`left-1/4 right-1/4`)
- Animation: ScaleX from 0 to 1 (draw effect)
- Origin: Left (`origin-left`)

**Duration Badge Styling**:
- Background: `bg-v2-cyan/20` (subtle cyan tint)
- Text: `text-v2-cyan` (full cyan)
- Padding: `px-4 py-1` (pill shape)
- Border radius: `rounded-full`
- Font: Small, semibold

**Typography**:
- Section title: 48px (text-5xl), bold, white
- Section subtitle: 20px (text-xl), off-white/80
- Step title: 24px (text-2xl), bold, white
- Duration badge: 14px (text-sm), semibold, cyan
- Step description: 16px (text-base), off-white/80, leading-relaxed
- Step number: 60px (text-6xl), bold, cyan/20 (large watermark)

**Animation Timing**:
- Stagger delay: 0.3s between steps (300ms)
- Total reveal: 3 steps × 0.3s = 0.9s
- Card duration: 0.8s per card
- Line duration: 1.5s (slower for dramatic effect)
- Both animations start simultaneously

**Accessibility**:
- Icons are decorative (text provides context)
- Step numbers reinforce sequence for cognitive accessibility
- Proper heading hierarchy (h2 for section, h3 for steps)
- Sufficient color contrast (white on charcoal/navy)

**Performance**:
- GSAP is GPU-accelerated
- ScaleX animation uses transform (GPU-friendly)
- ScrollTrigger uses Intersection Observer
- No layout thrashing or forced reflows

**Gotchas**:
- Line position (`top-20`) must align with icon center height
- ScaleX requires `transformOrigin: "left"` to draw left-to-right
- Ensure step cards have `.step-card` class for GSAP selector
- Test line width on different screen sizes (may need adjustment)

**Z-Index Layering**:
- Connector line: default (below icons)
- Icon containers: `z-10` (above line)
- Step content: default (in flow)

**Known Issues to Avoid**:
- If line doesn't draw, check `scaleX` animation and `origin-left`
- If line doesn't align with icons, adjust `top-20` value
- If stagger is too fast/slow, adjust `stagger: 0.3` value
- If cards overlap on tablet, increase gap or adjust grid breakpoints

**Alternative Mobile Layout**:
```typescript
// Vertical line on mobile
<div className="lg:hidden absolute left-12 top-0 bottom-0 w-1 bg-v2-cyan/30" />

// Offset steps to align with vertical line
<div className="flex flex-col gap-12 lg:gap-0 pl-24 lg:pl-0">
  {/* Steps */}
</div>
```

**GSAP Cleanup**:
```typescript
useEffect(() => {
  // ... animations ...

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

// Scroll to process section
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.6); }"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot after timeline animation
mcp__playwright__browser_take_screenshot({ filename: "prp-2.3-process-timeline.png" })

// Test mobile layout
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.6); }"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({ filename: "prp-2.3-process-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Section title and subtitle display correctly
- [ ] 3 step cards visible in timeline
- [ ] Desktop: 3 columns with horizontal connector line
- [ ] Mobile: 1 column stack (line hidden or vertical)
- [ ] Cards fade in with staggered timing (0.3s delay)
- [ ] Connector line "draws" from left to right
- [ ] Animation triggers when scrolling into view
- [ ] Icons display correctly (Search, GraduationCap, Rocket)
- [ ] Icons are inside circular cyan-bordered containers
- [ ] Step titles are bold and readable
- [ ] Duration badges visible with cyan background
- [ ] Step descriptions have good line height
- [ ] Large step numbers (01, 02, 03) visible as watermarks
- [ ] Connector line aligns with icon centers
- [ ] No console errors
- [ ] Performance: 60fps during animations

**Success Criteria**:
- ✅ 3-step timeline: Découvrir → Former → Optimiser
- ✅ Visual connector line between steps (horizontal desktop)
- ✅ Each step includes: icon, title, description, duration
- ✅ Progressive reveal animation with GSAP ScrollTrigger
- ✅ Staggered card animations (0.3s delay)
- ✅ Line "draw" animation (scaleX from 0 to 1)
- ✅ lucide-react icons (Search, GraduationCap, Rocket)
- ✅ Circular icon containers with cyan borders
- ✅ Duration badges for each step
- ✅ Large step numbers as watermarks (01, 02, 03)
- ✅ Responsive: horizontal desktop, stack mobile
- ✅ Positioned after SolutionSection
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 2.3 - ThreeStepProcess (Timeline)
- **Prochaine étape**: PRP 3.1 - PricingSection (3 Colonnes)
