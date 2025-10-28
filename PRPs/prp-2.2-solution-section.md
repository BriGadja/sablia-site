# PRP 2.2: SolutionSection - Horizontal 3-Pillar Layout

**Confidence Score: 9/10**

This PRP provides comprehensive implementation details for creating a SolutionSection component with horizontal layout, vertical separators, and staggered animations. The score reflects high confidence due to clear patterns from existing v3 components and detailed examples in the INITIAL file.

---

## 1. Goal and Why

**What are we building?**
A section presenting Sablia's methodology through 3 horizontal solution pillars with vertical separators between them. Each pillar represents a key differentiator: Formation-First, Stack Souverain (European tools), and ROI Mesurable.

**Why are we building it?**
- Establish Sablia's unique value proposition after presenting client problems
- Position the methodology as a differentiated approach (not just "we're better")
- Create visual hierarchy transitioning from problems → solutions → process
- Maintain v3 landing page premium aesthetic with clean, confident design

**Context in Flow:**
```
Hero → Testimonials → Logos → [ProblemSection] → **SolutionSection** → Process → Pricing
```

The section answers "How does Sablia solve these problems differently?" immediately after establishing the pain points.

---

## 2. What (Requirements)

### User-Visible Behavior

**Desktop View (≥1024px):**
- Section title: "La méthode Sablia"
- Subtitle: "Une approche qui place l'humain au centre de l'automatisation"
- 3 pillars displayed horizontally with equal width
- Vertical cyan separators (1px, 30% opacity) between pillars
- Each pillar shows:
  - Large cyan icon (56px) - GraduationCap, Shield, TrendingUp
  - Bold title - "Formation-First", "Stack Souverain", "ROI Mesurable"
  - Description paragraph explaining the pillar
- Pillars fade in with staggered timing (0s, 0.2s, 0.4s delay)
- Center-aligned text for visual balance

**Mobile View (<1024px):**
- Same title and subtitle
- 3 pillars stacked vertically
- No separators (vertical stack doesn't need them)
- Same stagger animation but vertical layout
- Full width cards with consistent spacing

### Functional Requirements

1. **Component Structure:**
   - Path: `client/src/components/v3/SolutionSection.tsx`
   - Export default function component
   - TypeScript with proper interface for Solution data type
   - Self-contained (no external data dependencies)

2. **Animation Requirements:**
   - ScrollReveal wrapper for section header (h2 + subtitle)
   - Framer Motion `whileInView` for pillar stagger (NOT GSAP)
   - Stagger delay: `index * 0.2` seconds
   - Animation duration: 0.6s per pillar
   - `viewport={{ once: true }}` to prevent re-animation on scroll
   - Initial state: `{ opacity: 0, y: 30 }`
   - Final state: `{ opacity: 1, y: 0 }`

3. **Layout Requirements:**
   - Container: `max-w-7xl mx-auto px-6 lg:px-8`
   - Flexbox layout: `flex flex-col lg:flex-row`
   - Equal width pillars: `flex-1` on each pillar container
   - Gap: `gap-12 lg:gap-0` (48px mobile, separators handle spacing desktop)
   - Separator positioning: Between pillar elements (not absolute positioning)
   - Center alignment: `text-center` on pillars

4. **Styling Requirements:**
   - Section background: `bg-v2-navy` (solid navy, no gradient)
   - Padding: `py-24` (96px vertical)
   - Icons: 56px lucide-react, `text-v2-cyan`
   - Separators: `h-48 w-px bg-v2-cyan/30 hidden lg:block`
   - Typography:
     - Section h2: `text-5xl font-bold text-center text-v2-white`
     - Section subtitle: `text-xl text-v2-off-white/80 text-center max-w-3xl mx-auto`
     - Pillar h3: `text-2xl font-bold text-v2-white`
     - Pillar description: `text-v2-off-white/80 leading-relaxed max-w-sm mx-auto`

### Non-Functional Requirements

- **Performance:**
  - Framer Motion GPU-accelerated transforms
  - No layout thrashing or expensive reflows
  - Intersection Observer for whileInView (efficient)

- **Accessibility:**
  - Proper heading hierarchy (h2 for section, h3 for pillars)
  - Icons are decorative (aria-hidden implicit, text provides context)
  - Color contrast: White on Navy = 13.9:1 (WCAG AAA)
  - Keyboard navigation: No interactive elements (static content)

- **Responsive:**
  - Breakpoint: `lg:` (1024px) for desktop horizontal layout
  - Mobile-first approach (flex-col base, lg:flex-row)
  - Separators hidden on mobile (`hidden lg:block`)

---

## 3. Success Criteria

The implementation is complete when:
- [x] SolutionSection.tsx created with TypeScript interfaces
- [x] 3 solution pillars with correct icons and copy
- [x] Horizontal layout on desktop with vertical separators visible
- [x] Vertical stack layout on mobile without separators
- [x] Stagger animation working (0.2s delay between pillars)
- [x] ScrollReveal wrapper on section header
- [x] Component integrated into LandingV3.tsx after ProblemSection
- [x] Hidden placeholder `<section id="solution">` removed
- [x] TypeScript check passes (no new errors)
- [x] Production build succeeds
- [x] Visual validation: Desktop and mobile screenshots
- [x] No console errors
- [x] Execution log added to `refonte_graphique/sequence/avancement_refonte.md`

---

## 4. Documentation & References

### Official Documentation

- **Framer Motion - Viewport Animations:**
  - URL: https://www.framer.com/motion/gestures/#viewport
  - Key API: `whileInView`, `viewport={{ once: true }}`
  - Stagger: Use `transition={{ delay: index * 0.2 }}`

- **lucide-react Icons:**
  - URL: https://lucide.dev/icons/
  - Icons needed: `GraduationCap`, `Shield`, `TrendingUp`
  - Usage: `<GraduationCap size={56} className="text-v2-cyan" />`

- **Tailwind CSS Flexbox:**
  - URL: https://tailwindcss.com/docs/flex
  - Key classes: `flex`, `flex-col`, `lg:flex-row`, `flex-1`, `gap-12`

- **Tailwind CSS Display (Hidden):**
  - URL: https://tailwindcss.com/docs/display#hidden
  - Key classes: `hidden lg:block` for responsive visibility

### Relevant Code Examples

- **`client/src/components/v3/ProblemSection.tsx`** - v3 component pattern
  - Shows: ScrollReveal usage, TypeScript interface for data, component structure
  - Line 6: `import ScrollReveal from "@/components/animations/ScrollReveal"`
  - Lines 73-80: ScrollReveal wrapper example
  - Lines 10-15: Interface pattern for data type

- **`client/src/components/v2/SolutionSection.tsx`** - Existing solution approach (v2)
  - Shows: Stagger animation with Framer Motion, card-based layout
  - Lines 52-66: Stagger variants approach (alternative to inline delay)
  - **Note:** v2 uses grid layout and Card components. v3 should NOT use Card components, use plain divs with custom styling.

- **`client/src/components/v3/HeroSection.tsx`** - v3 animation patterns
  - Shows: Framer Motion initial/animate pattern
  - Lines 36-41: motion.div with initial/animate props

- **`client/src/components/animations/ScrollReveal.tsx`** - ScrollReveal API
  - Shows: Available props and usage patterns
  - Lines 16-23: ScrollRevealProps interface (direction, duration, delay, stagger)
  - Default: `direction="fade"`, `duration={1}`

### External Resources

- **CSS Tricks - Flexbox Guide:**
  - URL: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
  - Section: "flex" property for equal-width children

- **Framer Motion - Scroll Animations:**
  - URL: https://www.framer.com/motion/scroll-animations/
  - Key: `whileInView` fires animation when element enters viewport

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── v2/
│   │   └── SolutionSection.tsx (old version, for reference only)
│   ├── v3/
│   │   ├── Navigation.tsx
│   │   ├── HeroSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── LogosCloud.tsx
│   │   └── ProblemSection.tsx ← Just completed
│   └── animations/
│       └── ScrollReveal.tsx (import from here)
├── pages/
│   └── LandingV3.tsx (integration point)
└── index.css (no CSS changes needed)
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   └── v3/
│       ├── ProblemSection.tsx
│       └── SolutionSection.tsx ← NEW FILE
└── pages/
    └── LandingV3.tsx (add import + component render)
```

### Key Files to Modify

1. **`client/src/components/v3/SolutionSection.tsx`** (CREATE)
   - New component file (~110 lines)
   - Self-contained with TypeScript interface and data

2. **`client/src/pages/LandingV3.tsx`** (MODIFY)
   - Line 9: Add import: `import SolutionSection from "@/components/v3/SolutionSection"`
   - After line 39 (ProblemSection): Add `<SolutionSection />`
   - Remove placeholder from hidden div: Delete `<section id="solution" className="py-24" />` (line 43)

---

## 6. Known Gotchas & Pitfalls

### Framer Motion Specific

**❌ Common Mistake:**
```typescript
// DON'T: Using GSAP for this - ProblemSection used GSAP, but this one should use Framer Motion
import gsap from "gsap";
```

**✅ Correct Approach:**
```typescript
// DO: Use Framer Motion whileInView for scroll-triggered animations
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.2 }}
>
```

**Why:** ProblemSection uses GSAP with ScrollTrigger for more complex card grid animations. SolutionSection is simpler (3 items, no complex targeting) and Framer Motion's `whileInView` is cleaner for this use case.

### Layout & Separator Gotchas

**❌ Separator Won't Show:**
```typescript
// DON'T: Forgetting width or using wrong color
<div className="h-48 bg-gray-300" /> // Missing w-px
```

**✅ Correct Separator:**
```typescript
// DO: Include all required classes
<div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
```

**Why:**
- `w-px` is essential (creates 1px width)
- `hidden lg:block` prevents showing on mobile
- `bg-v2-cyan/30` gives 30% opacity cyan (#52D1DC with alpha)

**❌ Separator Positioning with Absolute:**
```typescript
// DON'T: Use absolute positioning (complex and brittle)
<div className="absolute right-0 top-1/2 -translate-y-1/2 h-48 w-px bg-v2-cyan/30" />
```

**✅ Separator as Flex Child:**
```typescript
// DO: Insert separator as a flex child between pillars
{index < solutions.length - 1 && (
  <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
)}
```

**Why:** Flexbox naturally handles spacing and alignment. No need for absolute positioning complexity.

### Responsive Layout

**❌ Separators Showing on Mobile:**
```typescript
// DON'T: Forget to hide separators on mobile
<div className="h-48 w-px bg-v2-cyan/30" /> // Always visible
```

**✅ Hide on Mobile:**
```typescript
// DO: Add responsive display classes
<div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
```

**❌ Unequal Pillar Width:**
```typescript
// DON'T: Forget flex-1 on pillar containers
<motion.div className="px-8 text-center">
```

**✅ Equal Width Pillars:**
```typescript
// DO: Add flex-1 for equal width distribution
<motion.div className="flex-1 px-8 text-center">
```

### Typography & Text Overflow

**❌ Wide Text Lines:**
```typescript
// DON'T: Forget max-width on descriptions
<p className="text-v2-off-white/80 leading-relaxed">
```

**✅ Constrained Width:**
```typescript
// DO: Add max-width for readability
<p className="text-v2-off-white/80 leading-relaxed max-w-sm mx-auto">
```

**Why:** Text lines longer than ~75 characters reduce readability. `max-w-sm` (384px) keeps lines comfortable.

### Error Patterns

**Error:** `Property 'icon' does not exist on type 'Solution'`
- **Cause:** Icon is JSX.Element, needs ReactNode type
- **Fix:** Interface should be `icon: React.ReactNode` (not JSX.Element)

**Error:** `'whileInView' expects object, got undefined`
- **Cause:** Forgot to import motion from framer-motion
- **Fix:** Ensure `import { motion } from "framer-motion"` at top

**Error:** Separators not rendering
- **Cause 1:** Missing `w-px` class (width defaults to auto = 0)
- **Cause 2:** Conditional logic error (check `index < solutions.length - 1`)
- **Fix:** Verify all separator classes and conditional rendering

---

## 7. Data Models & Schemas

### TypeScript Interface

```typescript
interface Solution {
  id: number;
  icon: React.ReactNode; // NOT JSX.Element - ReactNode is more flexible
  title: string;
  description: string;
}
```

**Why ReactNode over JSX.Element:**
- ReactNode includes JSX.Element, strings, numbers, fragments, null
- More flexible for future iterations (could add emoji or text icons)
- Standard pattern in React typing

### Solutions Data Array

```typescript
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
```

**Copy Guidelines (Tone):**
- ✅ Confident but not arrogant ("notre priorité" not "la meilleure priorité")
- ✅ Benefit-focused ("vos équipes", "votre souveraineté", "économies réalisées")
- ✅ Concrete and specific (names tools: "N8n, Make.com")
- ✅ Measurable outcomes ("temps gagné et économies réalisées")
- ❌ Avoid: "Le meilleur", "Numéro 1", "Inégalé" (arrogant)
- ❌ Avoid: Emojis (B2B professional context)

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create SolutionSection Component File

**Action:** CREATE
**Location:** `client/src/components/v3/SolutionSection.tsx`
**Details:**

```typescript
import { motion } from "framer-motion";
import { GraduationCap, Shield, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * SolutionSection - 3-pillar horizontal layout with separators
 *
 * Features:
 * - Horizontal layout desktop (flex-row) with vertical separators
 * - Vertical stack mobile (flex-col) without separators
 * - Staggered fade-in animation (Framer Motion whileInView)
 * - Icons: GraduationCap (56px), Shield (56px), TrendingUp (56px)
 * - Copy: Formation-First, Stack Souverain, ROI Mesurable
 */

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
    <section id="solution" className="py-24 bg-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal direction="fade" duration={0.8}>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            La méthode Sablia
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Une approche qui place l'humain au centre de l'automatisation
          </p>
        </ScrollReveal>

        {/* Pillars Layout with Separators */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-0">
          {solutions.map((solution, index) => (
            <React.Fragment key={solution.id}>
              {/* Pillar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex-1 flex flex-col items-center text-center px-8"
              >
                {/* Icon */}
                <div className="mb-6">{solution.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-v2-white mb-4">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-v2-off-white/80 leading-relaxed max-w-sm mx-auto">
                  {solution.description}
                </p>
              </motion.div>

              {/* Separator (except after last pillar) */}
              {index < solutions.length - 1 && (
                <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Why:**
- `React.Fragment` wraps pillar + separator to keep flat DOM structure
- Separator is conditional: `index < solutions.length - 1` (no separator after 3rd pillar)
- `hidden lg:block` hides separators on mobile (vertical stack doesn't need them)
- `flex-1` on pillars ensures equal width distribution
- `px-8` on each pillar provides horizontal padding (16px = 2rem)
- `gap-12 lg:gap-0`: 48px gap mobile (separators replace gap on desktop)
- `items-center` centers icons/text horizontally
- `lg:items-start` aligns pillars to top on desktop (important if heights vary)

**Gotchas:**
- Must import `React` for `React.Fragment` (or use `<>...</>` shorthand)
- Separator height `h-48` (192px) should roughly match content height - adjust if needed
- Ensure `w-px` is present (creates 1px width)
- Test mobile view - separators should NOT appear

### Task 2: Integrate into LandingV3.tsx

**Action:** MODIFY
**Location:** `client/src/pages/LandingV3.tsx`

**Step 2a - Add Import:**
**Line:** After line 9 (after ProblemSection import)
```typescript
import SolutionSection from "@/components/v3/SolutionSection";
```

**Step 2b - Add Component Render:**
**Line:** After line 39 (after `<ProblemSection />`)
```typescript
{/* Solution Section */}
<SolutionSection />
```

**Step 2c - Remove Placeholder:**
**Line:** ~43 in hidden div
```typescript
// DELETE this line:
<section id="solution" className="py-24" />
```

**Complete Section After Changes:**
```typescript
{/* Problem Section */}
<ProblemSection />

{/* Solution Section */}
<SolutionSection />

{/* Hidden section placeholders */}
<div className="hidden">
  {/* id="solution" removed - now in SolutionSection component */}
  <section id="process" className="py-24" />
  <section id="pricing" className="py-24" />
  {/* ... rest of placeholders ... */}
</div>
```

**Why:**
- Placement after ProblemSection follows logical flow: Problems → Solutions
- Removing placeholder prevents duplicate `id="solution"` (causes accessibility issues)
- Import comes after v3 components (maintains alphabetical order)

**Gotchas:**
- Ensure import path is correct: `@/components/v3/SolutionSection` (not v2)
- Don't forget to remove the hidden placeholder section
- Verify the component renders between ProblemSection and the hidden div

---

## 9. Testing Strategy

### Visual Validation with Playwright

After implementation, run dev server and capture screenshots:

```bash
# Start dev server
npm run dev
```

**Desktop Screenshots:**
```javascript
// 1. Navigate to page
await mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" });

// 2. Scroll to solution section (approximately 50% down page)
await mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.5); }"
});

// 3. Wait for stagger animation to complete (0.6s + 0.4s delay + buffer = 2s)
await mcp__playwright__browser_wait_for({ time: 2 });

// 4. Take desktop screenshot
await mcp__playwright__browser_take_screenshot({
  filename: "prp-2.2-solution-section-desktop.png"
});
```

**Mobile Screenshots:**
```javascript
// 5. Resize to mobile (iPhone 13)
await mcp__playwright__browser_resize({ width: 390, height: 844 });

// 6. Scroll to solution section
await mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.5); }"
});

// 7. Wait for animation
await mcp__playwright__browser_wait_for({ time: 2 });

// 8. Take mobile screenshot
await mcp__playwright__browser_take_screenshot({
  filename: "prp-2.2-solution-section-mobile.png"
});
```

**Tablet Screenshots (Optional):**
```javascript
// 9. Resize to tablet (iPad)
await mcp__playwright__browser_resize({ width: 768, height: 1024 });

// 10. Scroll and capture
await mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight * 0.5); }"
});
await mcp__playwright__browser_wait_for({ time: 2 });
await mcp__playwright__browser_take_screenshot({
  filename: "prp-2.2-solution-section-tablet.png"
});
```

**Console Error Check:**
```javascript
// Check for errors
await mcp__playwright__browser_console_messages({ onlyErrors: true });
```

### Manual Testing Checklist

Before marking complete, verify:

**Desktop View (≥1024px):**
- [ ] Section title "La méthode Sablia" displays in 5xl white bold
- [ ] Subtitle displays in xl off-white centered with max-width
- [ ] 3 pillars display horizontally in a row
- [ ] Pillars have equal width (flex-1 working)
- [ ] 2 vertical separators visible between pillars (cyan 30% opacity)
- [ ] Separators are 1px wide and ~192px tall (h-48)
- [ ] Icons display at 56px size in cyan color
- [ ] Icons: GraduationCap (1st), Shield (2nd), TrendingUp (3rd)
- [ ] Pillar titles bold, 2xl, white, readable
- [ ] Pillar descriptions off-white/80, leading-relaxed, max-w-sm
- [ ] Stagger animation: pillars fade in one by one (0.2s delay)
- [ ] Animation triggers when scrolling section into view
- [ ] Text is center-aligned in each pillar
- [ ] Equal padding between pillars and separators

**Mobile View (<1024px):**
- [ ] Same title and subtitle (responsive sizing)
- [ ] 3 pillars stack vertically (one above another)
- [ ] NO separators visible (hidden on mobile)
- [ ] Pillars have full width with consistent gap (gap-12 = 48px)
- [ ] Same stagger animation (vertical sequence)
- [ ] Icons still 56px and cyan
- [ ] Text remains center-aligned
- [ ] Readable line lengths (max-w-sm constrains text)

**Animation & Performance:**
- [ ] Pillars animate only once (viewport.once: true working)
- [ ] No jank or layout shifts during animation
- [ ] Smooth 60fps animation observed
- [ ] No console errors or warnings
- [ ] Section header animates with ScrollReveal (fade)

**Accessibility:**
- [ ] Heading hierarchy: h2 (section) → h3 (pillars)
- [ ] Sufficient color contrast (white on navy = 13.9:1)
- [ ] Icons are decorative (text provides context)
- [ ] Tab order makes sense (no interactive elements, so N/A)

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check   # TypeScript compilation check
```

**Expected Output:**
- ✅ No new TypeScript errors in SolutionSection.tsx
- ✅ No new TypeScript errors in LandingV3.tsx
- ⚠️ Pre-existing errors in v2 components OK (not related to this PRP)

**If errors:**
- Check all imports are correct (`motion`, lucide-react icons, `ScrollReveal`)
- Verify `Solution` interface matches data structure
- Ensure `React.Fragment` or `<>` is used correctly

### Level 2: Build
```bash
npm run build
```

**Expected Output:**
- ✅ Build succeeds
- ✅ Bundle size increases ~5-10 KB (lucide-react icons + component code)
- Previous build: ~815 KB JS
- Expected: ~820-825 KB JS

**If build fails:**
- Check for syntax errors in SolutionSection.tsx
- Verify all imports resolve correctly
- Ensure no circular dependencies

### Level 3: Dev Server & Visual Validation
```bash
npm run dev
```

**Steps:**
1. Navigate to http://localhost:5000/landingv3
2. Scroll to solution section (below problem cards)
3. Observe stagger animation (pillars fade in sequentially)
4. Verify separators visible desktop, hidden mobile
5. Check console for errors (should be none)
6. Use Playwright to capture screenshots (see section 9)

**Expected Visual:**
- Desktop: 3 horizontal pillars with 2 vertical cyan separators
- Mobile: 3 vertical stacked pillars without separators
- Smooth staggered fade-in animation (0.2s delay between items)

### Level 4: Execution Log

After all validation passes, document completion in:
`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format:** (See avancement_refonte.md for template)
- Section: `## 2025-10-27 - PRP 2.2 - SolutionSection`
- Include: Status, Résumé, Validation, Issues, Fichiers, Livrable visuel
- Next step: PRP 2.3 - ThreeStepProcess (Timeline)

---

## 11. Integration Points

### No Configuration Changes Required

This PRP requires:
- ❌ No environment variables
- ❌ No database changes
- ❌ No API routes
- ❌ No CSS file modifications (all Tailwind classes)
- ❌ No package.json changes (all dependencies already installed)

### Route Already Exists

- Route `/landingv3` already registered in App.tsx
- No routing changes needed

### Section Anchor

The component includes `id="solution"` on the `<section>` tag for:
- Navigation menu smooth scroll links (Navigation.tsx already has `#solution` link)
- Deep linking capability
- Replacing the hidden placeholder that was removed

---

## 12. Critical Anti-Patterns

### DO NOT:

❌ **Mix GSAP and Framer Motion for same animation:**
```typescript
// DON'T: Use GSAP when Framer Motion is sufficient
useEffect(() => {
  gsap.to(ref.current, { ... });
}, []);
```
**Why:** ProblemSection needed GSAP for complex targeting. SolutionSection is simpler - Framer Motion is cleaner.

❌ **Use absolute positioning for separators:**
```typescript
// DON'T: Overcomplicate with absolute positioning
<div className="relative">
  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-48 w-px" />
</div>
```
**Why:** Flexbox handles layout naturally. Absolute positioning is brittle and hard to maintain.

❌ **Forget to hide separators on mobile:**
```typescript
// DON'T: Show separators on vertical stack
<div className="h-48 w-px bg-v2-cyan/30" /> // Always visible
```
**Why:** Separators make sense horizontally, not vertically. Use `hidden lg:block`.

❌ **Use Card components from shadcn/ui:**
```typescript
// DON'T: Import Card components (this is v2 pattern)
import { Card, CardHeader, CardContent } from "@/components/Card";
```
**Why:** v3 uses custom styling without Card wrappers. Keep it clean and minimal.

❌ **Hardcode animation values without considering total time:**
```typescript
// DON'T: Set wait time that's too short
await browser_wait_for({ time: 0.5 }); // Too short for 3-item stagger
```
**Why:** Stagger math: (2 items × 0.2s delay) + 0.6s duration = 1.0s minimum. Add 1s buffer = 2s total.

### DO:

✅ **Use Framer Motion whileInView for scroll animations:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.2 }}
>
```

✅ **Use flexbox for layout with separators as children:**
```typescript
<div className="flex flex-col lg:flex-row gap-12 lg:gap-0">
  <motion.div className="flex-1 px-8">...</motion.div>
  {index < solutions.length - 1 && (
    <div className="hidden lg:block h-48 w-px bg-v2-cyan/30" />
  )}
</div>
```

✅ **Center-align text for visual balance:**
```typescript
<motion.div className="flex flex-col items-center text-center">
```

✅ **Constrain text width for readability:**
```typescript
<p className="text-v2-off-white/80 leading-relaxed max-w-sm mx-auto">
```

✅ **Use React.Fragment to group pillar + separator:**
```typescript
<React.Fragment key={solution.id}>
  <motion.div>...</motion.div>
  {index < solutions.length - 1 && <div className="separator" />}
</React.Fragment>
```

---

## 13. Progressive Success

### Minimal Viable Implementation (10 minutes):

1. ✅ Create SolutionSection.tsx with basic structure
2. ✅ Add 3 solutions data with icons and copy
3. ✅ Render in LandingV3.tsx
4. ✅ Basic flexbox layout (no animations yet)
5. ✅ TypeScript check passes

**Validation:** Section visible, 3 pillars display, no errors.

### Add Core Features (10 minutes):

6. ✅ Add Framer Motion stagger animation
7. ✅ Add ScrollReveal wrapper for header
8. ✅ Add vertical separators between pillars
9. ✅ Hide separators on mobile (`hidden lg:block`)
10. ✅ Build succeeds

**Validation:** Animations work, separators visible desktop only.

### Polish & Validate (15 minutes):

11. ✅ Adjust spacing and typography
12. ✅ Verify responsive behavior (resize browser)
13. ✅ Run Playwright visual validation (screenshots)
14. ✅ Check console for errors
15. ✅ Add execution log to avancement_refonte.md

**Validation:** All screenshots pass, no console errors, documentation complete.

### Total Time Estimate: ~35 minutes

---

## Final Validation Checklist

Before marking PRP 2.2 complete:

**Code Quality:**
- [ ] TypeScript check passes (npm run check)
- [ ] Production build succeeds (npm run build)
- [ ] No console errors in browser
- [ ] Code follows v3 component patterns
- [ ] Comments explain why, not what

**Functionality:**
- [ ] 3 solution pillars render correctly
- [ ] Correct icons: GraduationCap, Shield, TrendingUp
- [ ] Correct copy for each pillar (Formation-First, Stack Souverain, ROI Mesurable)
- [ ] Stagger animation works (0.2s delay between pillars)
- [ ] ScrollReveal on section header works
- [ ] Animation triggers on scroll into view
- [ ] Animation plays only once (viewport.once: true)

**Responsive Design:**
- [ ] Desktop: Horizontal layout with separators
- [ ] Mobile: Vertical stack without separators
- [ ] Pillars have equal width on desktop (flex-1)
- [ ] Text is center-aligned
- [ ] Max-width constraint on descriptions (max-w-sm)

**Integration:**
- [ ] Component imported in LandingV3.tsx
- [ ] Renders after ProblemSection
- [ ] Hidden placeholder removed (no duplicate id="solution")
- [ ] Section anchor id="solution" present for navigation

**Visual Validation:**
- [ ] Desktop screenshot captured
- [ ] Mobile screenshot captured
- [ ] Separators visible desktop, hidden mobile
- [ ] Icons are 56px and cyan color
- [ ] Typography hierarchy correct (h2 → h3)

**Documentation:**
- [ ] Execution log added to avancement_refonte.md
- [ ] Status: ✅ Complété
- [ ] Résumé describes what was implemented
- [ ] Validation section documents checks performed
- [ ] Fichiers créés/modifiés lists changes
- [ ] Livrable visuel describes final result
- [ ] Prochaine étape: PRP 2.3 - ThreeStepProcess (Timeline)

---

## Confidence Score Justification: 9/10

**Why 9/10 (Very High Confidence):**

✅ **Strong Patterns:**
- Clear reference in ProblemSection v3 for component structure
- Detailed examples in INITIAL file with complete code
- Framer Motion whileInView is straightforward API

✅ **Simple Scope:**
- Only 2 files to modify (create + integrate)
- No complex state management
- No API calls or data fetching
- No CSS file changes needed

✅ **Clear Requirements:**
- Exact copy provided in INITIAL
- Specific icons identified
- Layout approach detailed with multiple examples
- Animation timing specified (0.2s stagger, 0.6s duration)

✅ **Proven Technologies:**
- Framer Motion already used in HeroSection, TestimonialsSection
- ScrollReveal already used in ProblemSection, HeroSection
- lucide-react already used in ProblemSection
- Tailwind classes all standard and tested

✅ **Comprehensive Gotchas:**
- Documented common separator mistakes
- Layout pitfalls identified
- Responsive visibility patterns explained
- Framer Motion vs GSAP choice clarified

**Why Not 10/10:**

⚠️ **Minor Uncertainty:**
- Separator height (`h-48` = 192px) may need adjustment based on actual content height
- Pillar content length could vary in future, affecting layout balance
- Mobile gap (`gap-12` = 48px) is an estimate, may need tuning
- First time combining React.Fragment with Framer Motion + conditionals (low risk but not 100% certain)

**Mitigation:**
- Visual validation will catch height mismatches
- TypeScript will catch any syntax errors with Fragment pattern
- Mobile gap is easy to adjust in one place
- All patterns are based on proven approaches (very low failure risk)

**Overall:** This PRP provides sufficient context, examples, and guardrails for successful one-pass implementation. The 9/10 score reflects very high confidence with minor layout tuning risk.

---

**END OF PRP 2.2: SolutionSection**

Generated: 2025-10-27
Estimated Implementation Time: 35 minutes
Next PRP: 2.3 - ThreeStepProcess (Timeline)
