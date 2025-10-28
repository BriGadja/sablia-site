# INITIAL - PRP 0.1 - Setup & Layout Base

## FEATURE

Create the foundational structure for the LandingV3 page with:
- New route `/landingv3` that renders a clean, empty component
- Base component structure with all section placeholders
- Color palette implementation (Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC)
- Typography system with Inter font family configured for all heading levels (H1-H4) and body text
- Spacing system based on 8px base unit (Tailwind spacing scale)
- Ensure TypeScript compilation and build passes

**Visual Deliverable**: A blank page with the continuous vertical gradient (sky → night → dawn) and a test heading in Inter 72px to validate the visual system.

**Technical Requirements**:
- Component path: `client/src/pages/LandingV3.tsx`
- Route registration in `client/src/App.tsx`
- No actual content yet - just structure with section containers
- All sections should be placeholder `<section>` elements with semantic IDs
- Background: Continuous vertical gradient applied via inline style (see GRADIENT SYSTEM section below)

## EXAMPLES

**Component Structure Pattern**:
```typescript
// Reference: client/src/pages/LandingV2.tsx
import { motion } from "framer-motion";
import Navigation from "@/components/v3/Navigation";
import Footer from "@/components/Footer";

export default function LandingV3() {
  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <main>
        {/* Section placeholders */}
        <section id="hero" className="min-h-screen" />
        <section id="testimonials" className="py-24" />
        {/* ... other sections */}
      </main>
      <Footer />
    </motion.div>
  );
}
```

**Route Registration Pattern**:
```typescript
// Reference: client/src/App.tsx lines 20-24
<Route path="/landingv3" component={LandingV3} />
```

**Typography Pattern**:
```typescript
// Heading styles to validate
<h1 className="font-inter text-[72px] font-bold leading-tight tracking-tight">
  Test Heading
</h1>
```

## DOCUMENTATION

**Color Palette** (already configured in `tailwind.config.ts`):
- `bg-v2-navy`: #0A2463
- `bg-v2-electric`: #3E92CC
- `bg-v2-cyan`: #52D1DC
- `bg-v2-white`: #FFFFFF
- `bg-v2-off-white`: #F8F9FA
- `text-v2-charcoal`: #2D3142

**Typography System**:
- Font: Inter (already imported via Google Fonts in existing layout)
- H1: 72px (text-[72px]), font-bold, leading-tight, tracking-tight
- H2: 48px (text-5xl), font-bold, leading-tight
- H3: 32px (text-3xl), font-semibold
- H4: 24px (text-2xl), font-medium
- Body: 16px (text-base), font-normal, leading-relaxed

**Spacing System**:
- Use Tailwind's default spacing scale (based on 0.25rem = 4px)
- Sections: `py-24` (96px) or `py-32` (128px) for major sections
- Container: `container mx-auto px-6 lg:px-8`

**Framer Motion**:
- https://www.framer.com/motion/introduction/
- Page transitions with AnimatePresence (already setup in App.tsx)

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

**Visual Progression**:
- **0-15%**: Sky blue (Hero section) - clear day sky
- **15-35%**: Electric blue → Navy (Testimonials) - deepening
- **35-65%**: Navy → Charcoal (Logos, Problem) - night, challenges
- **65-100%**: Brown tones (Solution, Footer) - dawn, new beginning

**Validation**: Always use Playwright MCP to verify the gradient flows continuously without breaks:
```bash
npm run dev
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_take_screenshot({ filename: "gradient-check.png" })
```

## OTHER CONSIDERATIONS

**Performance**:
- Ensure no heavy computations or animations at this stage
- TypeScript must compile with zero errors: `npm run check`
- Build must succeed: `npm run build`

**Accessibility**:
- Use semantic HTML5 elements (`<main>`, `<section>`, `<nav>`)
- Each section should have a descriptive `id` attribute for anchor links

**Section Structure** (11 sections total):
1. `#hero` - Hero Section
2. `#testimonials` - Testimonials Carousel
3. `#logos` - Logos Cloud
4. `#problem` - Problem Section
5. `#solution` - Solution Section
6. `#process` - Three Step Process
7. `#pricing` - Pricing Section
8. `#calculator` - ROI Calculator
9. `#contact` - Contact Form
10. `#faq` - FAQ Section
11. Footer (reuse existing `<Footer />` component)

**Gotchas**:
- Don't modify the `/` route yet - keep it as `LandingV3Enhanced`
- Only create `/landingv3` route
- Don't import any v3 section components yet (they don't exist)
- Keep Navigation and Footer as placeholders for now (will be built in PRP 0.4)

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run build   # Production build
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to http://localhost:5000/landingv3
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.1-setup-layout.png" })
```

**Expected Visual Output**:
- Continuous vertical gradient from sky blue (top) to dark brown (bottom)
- Gradient creates smooth color transition without breaks
- Test heading in Inter 72px, white color, centered
- No console errors
- Smooth page transition (fade-in)

**Success Criteria**:
- ✅ Route `/landingv3` accessible
- ✅ Component renders without errors
- ✅ Continuous vertical gradient visible (sky → night → dawn)
- ✅ Test heading displays in Inter 72px with white text
- ✅ TypeScript check passes
- ✅ Build completes successfully

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**:
```markdown
## [Date] - PRP 0.1 - Setup & Layout Base

**Status**: ✅ Complété / ⚠️ Partiellement complété / ❌ Échec

**Résumé**:
- [Liste des tâches accomplies]
- [Composants créés/modifiés]
- [Fichiers modifiés]

**Validation**:
- [ ] TypeScript check: [Pass/Fail]
- [ ] Build production: [Pass/Fail]
- [ ] Tests manuels: [Pass/Fail]
- [ ] Visual validation (Playwright): [Pass/Fail si applicable]

**Issues rencontrées**:
- [Liste des problèmes et leurs résolutions]

**Prochaine étape**: PRP 0.2 - Système Particules Animées
```

**Exemple concret**:
```markdown
## 2025-01-26 - PRP 0.1 - Setup & Layout Base

**Status**: ✅ Complété

**Résumé**:
- Créé client/src/pages/LandingV3.tsx avec route /landingv3
- Enregistré route dans client/src/App.tsx
- Vérifié palette de couleurs v2 dans tailwind.config.ts
- Testé font Inter (déjà configurée)
- 11 sections placeholders avec IDs sémantiques

**Validation**:
- [x] TypeScript check: Pass
- [x] Build production: Pass
- [x] Tests manuels: Pass (gradient visible, heading Inter 72px)
- [x] Visual validation (Playwright): Screenshot prp-0.1-setup-layout.png

**Issues rencontrées**:
- Aucune

**Prochaine étape**: PRP 0.2 - Système Particules Animées
```
