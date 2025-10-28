# PRP 3.1 - PricingSection (3 Colonnes)

**Generated from**: `refonte_graphique/sequence/INITIAL/INITIAL_refonte_sequence_3.1.md`
**Component Path**: `client/src/components/v3/PricingSection.tsx`
**Integration Point**: `client/src/pages/LandingV3.tsx` (7th section, after ThreeStepProcess)

---

## 📋 FEATURE OVERVIEW

Create a simplified 3-column pricing section that groups Sablia's service offerings into three clear categories, with the middle column highlighted to guide users toward the most popular choice (Formations).

**Visual Goal**: Clean, professional pricing grid with glassmorphism cards, highlighted middle column with cyan glow, and specific CTAs that guide users to the right entry point.

**User Journey**: After seeing the 3-step process (Discover → Implement → Optimize), users arrive at pricing to understand specific offerings and costs. The highlighted Formations column signals the recommended path for most SMEs.

---

## 🎯 REQUIREMENTS

### Layout & Structure
- **3 columns** representing service categories:
  1. **Audit & Consulting** (left) - Discovery services
  2. **Formations** (middle) - Training offerings **⭐ HIGHLIGHTED**
  3. **Solutions d'automatisation** (right) - Development services

- **Middle column highlighting**:
  - Cyan border (2px solid #52D1DC)
  - Glow shadow effect (`shadow-lg shadow-v2-cyan/50`)
  - Badge positioned above: "⭐ RECOMMANDÉ"
  - Different CTA styling (solid cyan background vs outline)

- **Each column contains**:
  - Column title + subtitle
  - Multiple offers (2-4 per column)
  - Each offer: name, price, duration, description, features list
  - Optional ROI callout for high-value offers
  - Column-specific CTA button

### Responsive Behavior
- **Desktop (≥1024px)**: 3 columns side-by-side
- **Mobile (<1024px)**: Stack vertically with **Formations column first** (using CSS `order-first` or conditional rendering)

### Styling
- **Glassmorphism cards**: `bg-v2-charcoal/30 backdrop-blur-md`
- **Hover effects**: Scale to 1.02, smooth transition 300ms
- **Typography**: White text on transparent dark cards
- **Feature lists**: Cyan checkmarks (lucide-react `<Check />` icon)

### Animations
- **Section entry**: ScrollReveal for header
- **Cards**: Staggered reveal (whileInView), 0.1s delay between columns
- **CTA buttons**: Magnetic effect (from MagneticButton component)

### CTAs
- **Audit & Consulting**: "Réserver un appel" → #contact
- **Formations**: "Voir les formations" → #contact
- **Solutions**: "Démarrer un projet" → #contact

---

## 💾 PRICING DATA

**Source**: Official tariff grid from INITIAL file

### Column 1: Audit & Consulting

```typescript
{
  id: "audit",
  title: "Audit & Consulting",
  subtitle: "Comprendre et qualifier vos besoins",
  offers: [
    {
      name: "Appel Découverte",
      price: "GRATUIT",
      duration: "30 min",
      description: "Visio de qualification pour comprendre vos besoins",
      features: [
        "Échange personnalisé",
        "Sans engagement",
        "Premiers conseils"
      ]
    },
    {
      name: "Audit Express",
      price: "350€",
      duration: "1h30",
      description: "Session stratégique avec recommandations actionnables",
      features: [
        "30 min cadrage + 1h stratégie",
        "Livrable 5-10 pages",
        "Regard expert immédiat"
      ]
    }
  ],
  ctaPrimary: { text: "Réserver un appel", url: "#contact" }
}
```

### Column 2: Formations (⭐ HIGHLIGHTED)

```typescript
{
  id: "formations",
  title: "Formations",
  subtitle: "Devenez autonomes sur vos automatisations",
  highlight: true,
  offers: [
    {
      name: "Formation Demi-Journée",
      price: "700€",
      duration: "3h30",
      description: "IA générative, automatisation basics, découverte n8n",
      features: [
        "Intra-entreprise",
        "Jusqu'à 10 participants"
      ]
    },
    {
      name: "Formation 1 Jour",
      price: "1 200€",
      duration: "7h",
      description: "IA/automatisation standard, n8n débutant",
      features: [
        "Cas pratiques inclus",
        "Support 1 mois post-formation"
      ]
    },
    {
      name: "Formation 2-3 Jours",
      price: "2 200-3 300€",
      duration: "14-21h",
      description: "n8n avancé + certification équipe complète",
      features: [
        "Formation intensive",
        "Certification",
        "Documentation complète"
      ]
    }
  ],
  ctaPrimary: { text: "Voir les formations", url: "#contact" }
}
```

### Column 3: Solutions d'automatisation

```typescript
{
  id: "solutions",
  title: "Solutions d'automatisation",
  subtitle: "Développement et déploiement de workflows",
  offers: [
    {
      name: "Workflow Simple",
      price: "2 500-5 000€",
      duration: "3-7 jours",
      description: "1-2 processus automatisés",
      features: [
        "Conception + développement",
        "Documentation",
        "2 semaines support"
      ]
    },
    {
      name: "Système Standard",
      price: "8 000-18 000€",
      duration: "2-4 semaines",
      description: "3-5 processus interconnectés",
      features: [
        "Architecture complète",
        "Formation 1 jour",
        "1 mois support"
      ]
    },
    {
      name: "Transformation Complète",
      price: "25 000-60 000€",
      duration: "6-12 semaines",
      description: "5+ processus multi-départements",
      features: [
        "Audit préalable inclus",
        "Formation 2-3 jours",
        "3 mois support"
      ],
      roi: "ROI année 1 : 50 000-150 000€"
    }
  ],
  ctaPrimary: { text: "Démarrer un projet", url: "#contact" }
}
```

---

## 🏗️ IMPLEMENTATION BLUEPRINT

### Step 1: Create Component File

**File**: `client/src/components/v3/PricingSection.tsx`

**Imports needed**:
```typescript
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";
```

### Step 2: Define TypeScript Interfaces

```typescript
interface PricingOffer {
  name: string;
  price: string;
  duration?: string;
  description: string;
  features: string[];
  roi?: string; // Optional ROI callout for high-value offers
}

interface PricingColumn {
  id: string;
  title: string;
  subtitle: string;
  offers: PricingOffer[];
  highlight?: boolean; // true for Formations column
  ctaPrimary: {
    text: string;
    url: string;
  };
}
```

### Step 3: Define Data Array

Create `pricingColumns` array with all three columns using the data from the PRICING DATA section above.

### Step 4: Component Structure

```typescript
export default function PricingSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Nos offres
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Des solutions adaptées à chaque étape de votre transformation
          </p>
        </ScrollReveal>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingColumns.map((column, colIndex) => (
            <PricingCard
              key={column.id}
              column={column}
              index={colIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 5: PricingCard Sub-Component

Create inline or extract as separate component:

```typescript
function PricingCard({ column, index }: { column: PricingColumn; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`
        relative
        bg-v2-charcoal/30 backdrop-blur-md
        rounded-2xl p-8
        hover:scale-[1.02] transition-transform duration-300
        ${column.highlight
          ? "border-2 border-v2-cyan shadow-lg shadow-v2-cyan/50 order-first lg:order-none"
          : "border border-v2-charcoal"
        }
      `}
    >
      {/* Highlight Badge */}
      {column.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-v2-cyan text-v2-navy px-6 py-2 rounded-full text-sm font-bold">
          ⭐ RECOMMANDÉ
        </div>
      )}

      {/* Column Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-v2-white mb-2">
          {column.title}
        </h3>
        <p className="text-v2-off-white/70 text-sm">
          {column.subtitle}
        </p>
      </div>

      {/* Offers List */}
      <div className="space-y-6 mb-8">
        {column.offers.map((offer, idx) => (
          <OfferItem key={idx} offer={offer} />
        ))}
      </div>

      {/* CTA Button */}
      <MagneticButton
        strength={0.2}
        className={`
          w-full py-4 rounded-lg font-semibold
          transition-colors duration-300
          ${column.highlight
            ? "bg-v2-cyan text-v2-navy hover:bg-v2-electric"
            : "bg-v2-charcoal/50 text-v2-white border border-v2-cyan hover:bg-v2-cyan hover:text-v2-navy"
          }
        `}
        onClick={() => {
          document.querySelector(column.ctaPrimary.url)?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        {column.ctaPrimary.text}
      </MagneticButton>
    </motion.div>
  );
}
```

### Step 6: OfferItem Sub-Component

```typescript
function OfferItem({ offer }: { offer: PricingOffer }) {
  return (
    <div className="border-t border-v2-cyan/20 pt-4">
      {/* Name + Price */}
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-semibold text-v2-white text-lg">
          {offer.name}
        </h4>
        <span className="text-v2-cyan font-bold text-xl">
          {offer.price}
        </span>
      </div>

      {/* Duration */}
      {offer.duration && (
        <p className="text-v2-off-white/50 text-sm mb-2">
          {offer.duration}
        </p>
      )}

      {/* Description */}
      <p className="text-v2-off-white/80 text-sm mb-3">
        {offer.description}
      </p>

      {/* Features List */}
      <ul className="space-y-2">
        {offer.features.map((feature, fIdx) => (
          <li key={fIdx} className="flex items-start gap-2 text-v2-off-white/80 text-sm">
            <Check size={16} className="text-v2-cyan mt-0.5 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Optional ROI Callout */}
      {offer.roi && (
        <p className="text-v2-cyan text-sm font-semibold mt-3">
          {offer.roi}
        </p>
      )}
    </div>
  );
}
```

### Step 7: Integrate into LandingV3

**File**: `client/src/pages/LandingV3.tsx`

```typescript
import PricingSection from "@/components/v3/PricingSection";

// ... inside main
<ThreeStepProcess />

{/* Add after ThreeStepProcess */}
<PricingSection />

{/* Hidden section placeholders */}
```

---

## 🎨 STYLING GUIDELINES

### Section Background
⚠️ **CRITICAL**: Do NOT add background classes to `<section>` element. The main gradient from LandingV3 wrapper must be visible.

```typescript
// ✅ Correct
<section className="py-24 relative overflow-hidden">

// ❌ Wrong
<section className="py-24 bg-v2-navy">
<section className="py-24 bg-gradient-to-b from-v2-navy to-v2-charcoal">
```

### Card Glassmorphism

```css
background: rgba(45, 49, 66, 0.3);          /* bg-v2-charcoal/30 */
backdrop-filter: blur(12px);                 /* backdrop-blur-md */
border: 1px solid rgba(45, 49, 66, 1);      /* border-v2-charcoal */

/* Highlighted column */
border: 2px solid #52D1DC;                   /* border-v2-cyan */
box-shadow: 0 0 30px rgba(82, 209, 220, 0.5); /* shadow-v2-cyan/50 */
```

### Typography Scale

| Element | Size | Weight | Color | Tailwind |
|---------|------|--------|-------|----------|
| Section title | 48px | Bold | White | `text-5xl font-bold text-v2-white` |
| Section subtitle | 20px | Normal | Off-white/80 | `text-xl text-v2-off-white/80` |
| Column title | 24px | Bold | White | `text-2xl font-bold text-v2-white` |
| Column subtitle | 14px | Normal | Off-white/70 | `text-sm text-v2-off-white/70` |
| Offer name | 18px | Semibold | White | `text-lg font-semibold text-v2-white` |
| Offer price | 20px | Bold | Cyan | `text-xl font-bold text-v2-cyan` |
| Offer duration | 14px | Normal | Off-white/50 | `text-sm text-v2-off-white/50` |
| Offer description | 14px | Normal | Off-white/80 | `text-sm text-v2-off-white/80` |
| Features | 14px | Normal | Off-white/80 | `text-sm text-v2-off-white/80` |

### Color Palette (from `tailwind.config.ts`)

```javascript
colors: {
  'v2-navy': '#0A2463',
  'v2-electric': '#3E92CC',
  'v2-cyan': '#52D1DC',
  'v2-white': '#FFFAFF',
  'v2-off-white': '#D8E1E8',
  'v2-charcoal': '#2D3142',
}
```

---

## 🎬 ANIMATION SPECIFICATIONS

### Section Entry
- **ScrollReveal** for header (h2 + p)
- Direction: `fade` (default)
- Duration: 0.8s

### Card Stagger
- **Framer Motion** `whileInView`
- Initial: `opacity: 0, y: 30`
- Animate: `opacity: 1, y: 0`
- Duration: 0.6s
- Delay: `index * 0.1` (0s, 0.1s, 0.2s)
- Viewport: `{ once: true }`

### Hover Effects
- **Scale**: 1.02 (subtle lift)
- **Transition**: 300ms ease
- Applied via `hover:scale-[1.02] transition-transform duration-300`

### Magnetic CTA Buttons
- **Component**: `MagneticButton` from `@/components/animations/MagneticElements`
- **Strength**: 0.2 (subtle magnetic effect)
- **Spring physics**: stiffness 150, damping 15 (built into component)
- **Hover glow**: Radial gradient cyan/20 (built into component)

---

## 📚 CODE EXAMPLES FROM RESEARCH

### Pattern 1: Section Structure (from SolutionSection.tsx)

```typescript
<section className="py-24">
  <div className="container mx-auto px-6 lg:px-8">
    <ScrollReveal>
      <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
        {/* Title */}
      </h2>
      <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
        {/* Subtitle */}
      </p>
    </ScrollReveal>

    {/* Content grid */}
  </div>
</section>
```

**Key Takeaways**:
- No background class on `<section>`
- Container with responsive padding
- ScrollReveal wraps header only
- Max-width on subtitle for readability

### Pattern 2: Staggered Grid Animation (from SolutionSection.tsx)

```typescript
{solutions.map((solution, index) => (
  <motion.div
    key={solution.id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
    {/* Content */}
  </motion.div>
))}
```

**Key Takeaways**:
- Use `map` index for stagger delay
- `viewport={{ once: true }}` prevents re-trigger on scroll back up
- Start from y: 30 for subtle entrance

### Pattern 3: Magnetic Button (from MagneticElements.tsx)

```typescript
import { MagneticButton } from "@/components/animations/MagneticElements";

<MagneticButton
  strength={0.2}
  className="w-full py-4 rounded-lg bg-v2-cyan text-v2-navy"
  onClick={() => {
    // Handle click
  }}
>
  Button Text
</MagneticButton>
```

**Key Takeaways**:
- Strength 0.1-1.0 (0.2-0.3 recommended for buttons)
- Spring physics already built-in
- Hover glow effect built-in

### Pattern 4: Mobile-First Responsive (from PricingPathways.tsx)

```typescript
<div className="grid md:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

**For our use case (reorder on mobile)**:
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  {pricingColumns.map((column) => (
    <div
      key={column.id}
      className={column.highlight ? "order-first lg:order-none" : ""}
    >
      {/* Card content */}
    </div>
  ))}
</div>
```

**Key Takeaways**:
- Use `order-first lg:order-none` to prioritize highlighted column on mobile
- Grid collapses to single column below `lg:` breakpoint (1024px)
- Gap remains consistent across breakpoints

---

## ⚠️ GRADIENT SYSTEM (CRITICAL)

LandingV3 uses a **continuous vertical gradient** from the main wrapper that must NOT be interrupted by section backgrounds.

**Applied On**: `client/src/pages/LandingV3.tsx` main wrapper
```typescript
<motion.div
  style={{
    background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
  }}
>
```

### Rules for PricingSection

❌ **DO NOT**:
- Use solid backgrounds: `bg-v2-navy`, `bg-v2-electric`, `bg-v2-charcoal`
- Use local gradients: `bg-gradient-to-b from-v2-navy to-v2-charcoal`
- Block the main gradient in any way

✅ **DO**:
- Keep section transparent (no background class)
- Use glassmorphism on cards: `bg-v2-charcoal/20 backdrop-blur-md`
- Use white text: `text-v2-white`, `text-v2-off-white`

**Reference**: See `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md` for complete specifications.

---

## 🧪 VALIDATION GATES

### Level 1: Syntax & Type Checking
```bash
npm run check
```
**Expected**: No TypeScript errors. All interfaces defined, all imports resolved.

### Level 2: Build
```bash
npm run build
```
**Expected**: Clean build with no errors. Check bundle size (should add <50KB).

### Level 3: Visual Validation (Playwright)

```bash
# Start dev server
npm run dev
```

```javascript
// Navigate to LandingV3
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to pricing section
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, document.body.scrollHeight * 0.7)"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Desktop screenshot
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.1-pricing-desktop.png"
})

// Mobile screenshot (check Formations first)
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, document.body.scrollHeight * 0.7)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.1-pricing-mobile.png"
})
```

**Verify**:
- Desktop: 3 columns visible, middle highlighted with cyan glow
- Mobile: Formations column appears first (order-first working)
- Badge "⭐ RECOMMANDÉ" above Formations column
- Cards have glassmorphism effect
- Text readable on all cards

---

## 🚨 COMMON PITFALLS & GOTCHAS

### Pitfall 1: Section Background Blocks Gradient
**Problem**: Adding `bg-v2-navy` or `bg-gradient-to-b` to section element blocks main gradient.
**Solution**: Keep section transparent. Only use glassmorphism on cards (`bg-v2-charcoal/30 backdrop-blur-md`).

### Pitfall 2: Mobile Doesn't Prioritize Formations
**Problem**: On mobile, Audit column appears first instead of Formations.
**Solution**: Add `order-first lg:order-none` to highlighted column div, OR use CSS Grid with `grid-auto-flow: dense`.

### Pitfall 3: Highlight Border Doesn't Glow
**Problem**: Cyan border is visible but no glow effect.
**Solution**: Ensure `shadow-lg shadow-v2-cyan/50` is applied. Check Tailwind config has cyan color defined.

### Pitfall 4: Cards Have Different Heights
**Status**: **This is OK**. Content-driven heights are acceptable.
**If desired to match**: Use `h-full` on card wrapper and `flex flex-col justify-between` for internal spacing.

### Pitfall 5: MagneticButton Not Working
**Problem**: Button doesn't follow cursor.
**Solution**:
- Verify `MagneticElements.tsx` exports `MagneticButton` (not default export)
- Import as named import: `import { MagneticButton } from "@/components/animations/MagneticElements"`
- Check browser console for errors

### Pitfall 6: Hover Scale Causes Layout Shift
**Problem**: Card scaling pushes adjacent cards.
**Solution**: Use `transform` property (already done with `hover:scale-[1.02]`), which doesn't affect layout. Do NOT use width/height changes.

### Pitfall 7: Too Many Offers per Column
**Problem**: Columns become too long and unbalanced.
**Solution**: Limit to 3-4 offers per column. For Solutions column, only show 3 tiers (omit Enterprise tier or make it optional).

### Pitfall 8: Features List Overflows
**Problem**: Too many features make cards unreadable.
**Solution**: Limit to 3-4 key features per offer. Use concise bullet points.

### Pitfall 9: CTA Links Don't Work
**Problem**: Clicking CTA doesn't scroll to #contact.
**Solution**:
```typescript
onClick={() => {
  const target = document.querySelector(column.ctaPrimary.url);
  target?.scrollIntoView({ behavior: 'smooth' });
}}
```

### Pitfall 10: TypeScript Errors on Optional Properties
**Problem**: `offer.roi` or `offer.duration` cause TypeScript errors.
**Solution**: Mark as optional in interface (`roi?: string`) and check existence before rendering (`{offer.roi && <p>{offer.roi}</p>}`).

---

## ✅ SUCCESS CRITERIA

Implementation is complete when ALL of the following are verified:

### Visual Requirements
- [ ] 3 columns visible on desktop (Audit / Formations / Solutions)
- [ ] Middle column (Formations) highlighted with 2px cyan border
- [ ] Cyan glow shadow visible on highlighted column (`shadow-lg shadow-v2-cyan/50`)
- [ ] Badge "⭐ RECOMMANDÉ" positioned above Formations column
- [ ] Each column has title + subtitle clearly visible
- [ ] All offers display: name, price, duration, description, features
- [ ] Feature lists have cyan checkmarks (lucide-react `<Check />`)
- [ ] ROI callout visible on "Transformation Complète" offer
- [ ] CTA buttons specific to each column with correct text
- [ ] Glassmorphism blur effect visible on all cards

### Responsive Requirements
- [ ] Desktop: 3 columns side-by-side
- [ ] Mobile (≤375px): All columns stack vertically
- [ ] Mobile: **Formations column appears FIRST** (order-first working)
- [ ] Mobile: Cards are full width with readable text
- [ ] No horizontal scroll on mobile
- [ ] Gap spacing consistent across breakpoints

### Animation Requirements
- [ ] Section header animates with ScrollReveal (fade in)
- [ ] Cards animate with staggered entrance (0.1s delay between)
- [ ] Cards start from `opacity: 0, y: 30` and animate to `opacity: 1, y: 0`
- [ ] Hover: cards scale to 1.02 smoothly (300ms transition)
- [ ] CTA buttons have magnetic hover effect (cursor following)
- [ ] Animations trigger once when scrolling into view (`viewport: { once: true }`)

### Functionality Requirements
- [ ] CTA buttons clickable and scroll to #contact section
- [ ] Magnetic effect works on CTA buttons (cursor following with spring physics)
- [ ] Hover effects don't cause layout shift (using transform)
- [ ] No console errors in browser DevTools
- [ ] All TypeScript types correctly defined and no `any` types

### Code Quality Requirements
- [ ] Component follows v3 patterns (no v2 imports like `Section`, `Card`)
- [ ] TypeScript interfaces defined for `PricingOffer` and `PricingColumn`
- [ ] Data array `pricingColumns` contains accurate pricing from official tariff
- [ ] Component exported as default export
- [ ] Imports organized: React → external libs → internal components
- [ ] Code formatted and readable (sub-components extracted if helpful)

### Integration Requirements
- [ ] Component integrated into `LandingV3.tsx` as 7th section
- [ ] Positioned after `<ThreeStepProcess />` and before hidden placeholders
- [ ] No z-index conflicts with other sections
- [ ] Section flows naturally in page gradient (no background interruption)

### Performance Requirements
- [ ] No frame drops during animations (60fps maintained)
- [ ] Build succeeds with no errors: `npm run build`
- [ ] TypeScript check passes: `npm run check`
- [ ] Bundle size increase reasonable (<50KB)

### Validation Evidence
- [ ] Desktop screenshot taken showing 3 columns with highlight
- [ ] Mobile screenshot taken showing Formations column first
- [ ] Console log clean (no errors or warnings)
- [ ] Lighthouse Performance score not degraded (if baseline exists)

---

## 📝 EXECUTION LOG REQUIREMENT

**IMPORTANT**: After completing this PRP implementation, write an execution log in:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Template**:
```markdown
### PRP 3.1 - PricingSection (3 Colonnes) ✅

**Date**: [YYYY-MM-DD]
**Durée**: [X minutes/heures]

**Réalisations**:
- Création du composant PricingSection avec 3 colonnes
- Intégration des données tarifaires officielles
- Implémentation du système de highlight pour colonne Formations
- Animations staggered et effets magnétiques sur CTAs
- Responsive mobile avec Formations en premier
- Screenshots de validation (desktop + mobile)

**Fichiers modifiés**:
- `client/src/components/v3/PricingSection.tsx` (nouveau)
- `client/src/pages/LandingV3.tsx` (ajout section)

**Validation**:
- ✅ TypeScript check passed
- ✅ Build production successful
- ✅ Visual validation desktop
- ✅ Visual validation mobile (Formations first)
- ✅ Animations 60fps

**Prochaine étape**: PRP 3.2 - CalculatorROI (Interactif)
```

---

## 🎓 KNOWLEDGE TRANSFER

### Key Learnings for Future PRPs

1. **Gradient System is Sacred**: Never block the main gradient with section backgrounds. Always keep sections transparent and use glassmorphism on cards.

2. **Mobile-First CSS Order**: Use `order-first lg:order-none` to reorder grid items on mobile without JavaScript. This is cleaner than conditional rendering.

3. **MagneticButton Import**: It's a named export, not default. Always: `import { MagneticButton } from "@/components/animations/MagneticElements"`.

4. **Stagger Pattern**: `delay: index * 0.1` in `map` is the standard pattern for sequential reveals. Keep delay subtle (0.1-0.2s max).

5. **Highlight Treatment**: Border + shadow + badge is the full treatment. Don't skip any part or effect looks incomplete.

6. **Pricing Data Accuracy**: Always use official tariff data. Don't round numbers or simplify pricing ranges.

7. **Feature List Brevity**: 3-4 features per offer max. Use concise bullets. More = harder to read.

8. **Optional Properties**: Use TypeScript optional (`?:`) for fields like `roi`, `duration` that don't apply to all offers. Always check existence before rendering.

9. **ScrollReveal vs whileInView**: Use ScrollReveal for section headers (consistent with other sections), Framer Motion whileInView for grid items (more granular control).

10. **Test Mobile Order First**: The most common mistake is forgetting to verify mobile stack order. Always test `order-first` is working.

---

## 📖 REFERENCES

- **INITIAL Spec**: `refonte_graphique/sequence/INITIAL/INITIAL_refonte_sequence_3.1.md`
- **Gradient Reference**: `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md`
- **v2 Pricing**: `client/src/components/v2/PricingPathways.tsx` (reference, don't copy)
- **v3 Section Pattern**: `client/src/components/v3/SolutionSection.tsx`
- **v3 Process Pattern**: `client/src/components/v3/ThreeStepProcess.tsx`
- **Magnetic Components**: `client/src/components/animations/MagneticElements.tsx`
- **ScrollReveal**: `client/src/components/animations/ScrollReveal.tsx`
- **Tailwind Config**: `tailwind.config.ts` (color definitions)
- **LandingV3 Integration**: `client/src/pages/LandingV3.tsx`

---

**End of PRP 3.1**

This PRP should provide sufficient context and guidance for one-pass implementation of the PricingSection component. All patterns are based on existing codebase conventions, all data is sourced from official specifications, and all validation gates ensure quality output.
