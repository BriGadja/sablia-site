# INITIAL - PRP 2.2 - SolutionSection

## FEATURE

Create a section presenting Sablia's methodology in 3 key pillars, displayed horizontally with separators.

**Requirements**:
- 3 solution pillars representing Sablia's unique approach:
  1. "Formation-First" - Training comes before automation
  2. "Stack Souverain" - French/European sovereign tools (n8n, Make.com)
  3. "ROI Mesurable" - Measurable return on investment
- Horizontal layout with vertical separators between pillars
- Icons or visual elements for each pillar
- ScrollReveal animation for section entry
- Staggered fade-in for individual pillars
- Professional, confident tone (position as differentiator)

**Visual Deliverable**: Clean horizontal layout with 3 solution pillars separated by vertical lines, animating in with staggered timing, positioned after ProblemSection.

**Technical Requirements**:
- Component path: `client/src/components/v3/SolutionSection.tsx`
- Use ScrollReveal for section entry
- Use Framer Motion for pillar stagger animations
- lucide-react icons: GraduationCap, Shield, TrendingUp (or similar)
- Integrate into LandingV3.tsx as fifth section

## EXAMPLES

**SolutionSection Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { GraduationCap, Shield, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Solution {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const solutions: Solution[] = [
  {
    id: 1,
    icon: <GraduationCap size={56} className="text-v2-cyan" />,
    title: "Formation-First",
    description: "Nous formons vos équipes avant d'automatiser. L'autonomie de vos collaborateurs est notre priorité."
  },
  {
    id: 2,
    icon: <Shield size={56} className="text-v2-cyan" />,
    title: "Stack Souverain",
    description: "N8n, Make.com : des outils européens pour garantir votre souveraineté numérique et vos données."
  },
  {
    id: 3,
    icon: <TrendingUp size={56} className="text-v2-cyan" />,
    title: "ROI Mesurable",
    description: "Chaque automatisation génère un ROI quantifiable. Nous mesurons temps gagné et économies réalisées."
  }
];

export default function SolutionSection() {
  return (
    <section className="py-24 bg-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            La méthode Sablia
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Une approche qui place l'humain au centre de l'automatisation
          </p>
        </ScrollReveal>

        {/* Horizontal layout with separators */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-0">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center flex-1 px-8"
            >
              {/* Icon */}
              <div className="mb-6">{solution.icon}</div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-v2-white mb-4">
                {solution.title}
              </h3>

              {/* Description */}
              <p className="text-v2-off-white/80 leading-relaxed max-w-sm">
                {solution.description}
              </p>

              {/* Separator (except after last item) */}
              {index < solutions.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-48 w-px bg-v2-cyan/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Alternative Layout** (with separator between items):
```typescript
// Parent container with relative positioning
<div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
  {solutions.map((solution, index) => (
    <>
      <motion.div key={solution.id} className="flex-1 px-8 text-center">
        {/* ... content ... */}
      </motion.div>

      {/* Separator between items */}
      {index < solutions.length - 1 && (
        <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
      )}
    </>
  ))}
</div>
```

**Reference Existing Component**: Check `client/src/components/v2/SolutionSection.tsx` for existing patterns (but create new v3 version).

## DOCUMENTATION

**Solution Pillars** (Sablia's Differentiators):

1. **Formation-First**:
   - Icon: GraduationCap (lucide-react)
   - Principle: Training before automation
   - Benefit: Team autonomy and ownership
   - Copy: "Nous formons vos équipes avant d'automatiser. L'autonomie de vos collaborateurs est notre priorité."

2. **Stack Souverain**:
   - Icon: Shield (lucide-react)
   - Principle: European sovereign tools (n8n, Make.com)
   - Benefit: Data sovereignty, RGPD compliance
   - Copy: "N8n, Make.com : des outils européens pour garantir votre souveraineté numérique et vos données."

3. **ROI Mesurable**:
   - Icon: TrendingUp (lucide-react)
   - Principle: Every automation has quantifiable ROI
   - Benefit: Measurable time saved and cost reduction
   - Copy: "Chaque automatisation génère un ROI quantifiable. Nous mesurons temps gagné et économies réalisées."

**Tone Guidelines**:
- Confident but not arrogant
- Position as differentiator (not "we're better than everyone")
- Focus on client benefits, not just features
- Professional B2B language

**lucide-react Icons**:
- GraduationCap: Represents training/education
- Shield: Represents security/sovereignty
- TrendingUp: Represents growth/ROI
- Alternative icons: BookOpen, Lock, BarChart3

**Framer Motion Stagger**:
```typescript
// Each pillar with increasing delay
transition={{ duration: 0.6, delay: index * 0.2 }}
// Pillar 1: 0s, Pillar 2: 0.2s, Pillar 3: 0.4s
```

**Separator Styling**:
- Vertical line between pillars
- Height: 192px (h-48) to match content height
- Width: 1px (w-px)
- Color: cyan with 30% opacity (`bg-v2-cyan/30`)
- Hidden on mobile, visible on desktop (`hidden lg:block`)

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
- Desktop: 3 pillars in horizontal row with separators
- Mobile: 3 pillars stacked vertically, no separators
- Use `flex-col lg:flex-row` for layout switch
- Gap: 48px mobile → 0 desktop (separators provide spacing)

**Layout Options**:
1. **Flexbox with separators**: More flexible, easier to manage
2. **Grid with borders**: Alternative approach using grid + border-right
3. **Absolute positioning**: More control but more complex

Recommended: Flexbox with separator elements (as shown in examples).

**Icon Styling**:
- Size: 56px (larger than ProblemSection to emphasize solutions)
- Color: `text-v2-cyan`
- Margin bottom: 24px

**Typography**:
- Section title: 48px (text-5xl), bold, white
- Section subtitle: 20px (text-xl), off-white/80
- Pillar title: 24px (text-2xl), bold, white
- Pillar description: 16px (text-base), off-white/80, leading-relaxed
- Max width for description: 384px (max-w-sm) to prevent overly wide text

**Animation Timing**:
- Stagger delay: 0.2s between pillars
- Duration per pillar: 0.6s
- Total reveal: 0.6s (longest delay) + 0.6s (duration) = 1.2s
- `once: true` prevents re-animation

**Accessibility**:
- Icons are decorative (text provides context)
- Proper heading hierarchy (h2 for section, h3 for pillars)
- Sufficient color contrast (white on navy = 13.9:1)
- Separators are purely visual (no semantic meaning)

**Performance**:
- Framer Motion uses GPU-accelerated transforms
- whileInView uses Intersection Observer (efficient)
- No heavy computations or layout thrashing

**Gotchas**:
- Separators should be hidden on mobile (stack layout doesn't need them)
- Ensure equal flex-1 on pillars for balanced width
- Test separator height matches content (adjust h-48 if needed)
- Center-align text for better visual balance

**Separator Positioning**:
- Option 1: Separate `<div>` elements between pillars (easier)
- Option 2: Absolute positioning within pillar (more control)
- Option 3: Border on pillar (simpler CSS, less flexible)

Recommended: Option 1 (separate divs) for clarity and flexibility.

**Z-Index**:
- SolutionSection: default flow
- Separators: no z-index needed (in flow with pillars)

**Known Issues to Avoid**:
- If separators don't show, check they have `w-px` and visible color
- If layout breaks on mobile, ensure `flex-col lg:flex-row` is on parent
- If pillars are uneven width, ensure all have `flex-1`
- If separator height doesn't match, adjust `h-48` value

**Alternative Separator Approach** (CSS borders):
```typescript
<div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-v2-cyan/30">
  {/* Pillars */}
</div>
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

// Scroll to solution section
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.5); }"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot after stagger animation
mcp__playwright__browser_take_screenshot({ filename: "prp-2.2-solution-section.png" })

// Test mobile (should stack, no separators)
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.5); }"
})
mcp__playwright__browser_wait_for({ time: 2 })
mcp__playwright__browser_take_screenshot({ filename: "prp-2.2-solution-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Section title and subtitle display correctly
- [ ] 3 solution pillars visible
- [ ] Desktop: horizontal layout with separators
- [ ] Mobile: vertical stack, no separators
- [ ] Pillars fade in with staggered timing (0.2s delay)
- [ ] Animation triggers when scrolling into view
- [ ] Icons display correctly (GraduationCap, Shield, TrendingUp)
- [ ] Icons are cyan color
- [ ] Pillar titles are bold and readable
- [ ] Pillar descriptions have good line height
- [ ] Separators are subtle (cyan 30% opacity)
- [ ] Equal width for all 3 pillars on desktop
- [ ] Text is center-aligned
- [ ] No console errors
- [ ] Performance: 60fps during animations

**Success Criteria**:
- ✅ 3 solution pillars with icons and descriptions
- ✅ Horizontal layout on desktop with vertical separators
- ✅ Stack layout on mobile without separators
- ✅ Staggered fade-in animation (Framer Motion)
- ✅ lucide-react icons (GraduationCap, Shield, TrendingUp)
- ✅ Professional, confident tone
- ✅ Center-aligned text for visual balance
- ✅ Positioned after ProblemSection
- ✅ Cyan separators with 30% opacity
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 2.2 - SolutionSection
- **Prochaine étape**: PRP 2.3 - ThreeStepProcess (Timeline)
