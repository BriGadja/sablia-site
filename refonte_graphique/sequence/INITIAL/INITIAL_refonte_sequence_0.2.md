# INITIAL - PRP 0.2 - Système Particules Animées

## FEATURE

Integrate the existing AnimatedParticles component as a fullscreen background layer for the LandingV3 page.

**Requirements**:
- Use the EXISTING `client/src/components/animations/AnimatedParticles.tsx` component WITHOUT modification
- Component must render as a fixed fullscreen background layer (z-index below content)
- Particles should connect to each other with lines when close (Canvas API)
- Performance must maintain 60fps (validated with Chrome DevTools or Lighthouse)
- Responsive behavior: dense particle count on desktop, simplified on mobile
- Respect `prefers-reduced-motion` accessibility setting (already implemented in component)

**Visual Deliverable**: Continuous vertical gradient background (sky → night → dawn) with animated particles moving smoothly, connecting with lines, with the test heading visible on top.

**Technical Requirements**:
- Import existing component: `import AnimatedParticles from "@/components/animations/AnimatedParticles"`
- Place as first child in the page component (before Navigation, before content)
- Apply fixed positioning with proper z-indexing
- No modifications to the AnimatedParticles component itself
- Validate 60fps performance with Chrome DevTools Performance tab

## EXAMPLES

**Integration Pattern**:
```typescript
// Reference: How to layer animated background
import AnimatedParticles from "@/components/animations/AnimatedParticles";

export default function LandingV3() {
  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
      }}
    >
      {/* Animated particles background - renders first for proper layering */}
      <AnimatedParticles />

      {/* Content layer with higher z-index */}
      <div className="relative z-10">
        <Navigation />
        <main>
          {/* Sections */}
        </main>
        <Footer />
      </div>
    </motion.div>
  );
}
```

**Z-Index Strategy**:
```typescript
// Layer structure
z-0   // AnimatedParticles (background)
z-10  // Main content (navigation, sections, footer)
z-20  // CustomCursor (will be added in PRP 0.3)
z-50  // Modals, overlays (if needed)
```

## DOCUMENTATION

**Existing Component**: `client/src/components/animations/AnimatedParticles.tsx`
- Already implements Canvas API for particle rendering
- Already has particle connection logic with lines
- Already responsive (adjusts particle count based on screen size)
- Already respects `prefers-reduced-motion`
- Already GPU-accelerated (requestAnimationFrame loop)

**Canvas API**:
- MDN Canvas Tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- Performance optimizations already implemented in component

**Performance Target**:
- 60fps sustained performance (check with Chrome DevTools > Performance)
- No frame drops during scroll or hover interactions
- Particle count: ~50-80 on desktop, ~20-30 on mobile (already configured)

**Accessibility**:
- Component already respects `prefers-reduced-motion`
- Particles are decorative only, no semantic meaning
- `pointer-events-none` prevents interference with click targets

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

**DO NOT MODIFY** the AnimatedParticles component:
- Component is already working and tested
- Has correct performance optimizations
- Has correct accessibility features
- Any modification risks breaking these features

**Performance Validation**:
1. Open Chrome DevTools > Performance tab
2. Record 6 seconds of scrolling and hovering
3. Check FPS meter - should stay at or near 60fps
4. Check for layout thrashing or forced reflows (should be none)

**Responsive Behavior** (already implemented):
```typescript
// Desktop: More particles, more connections
// Mobile: Fewer particles, fewer connections
// Component automatically adjusts based on window.innerWidth
```

**Z-Index Layering**:
- AnimatedParticles: `z-0` (bottom layer)
- All content: `z-10` (middle layer)
- CustomCursor (next PRP): `z-20` (top layer)
- Use `pointer-events-none` on particle layer so clicks pass through

**Gotchas**:
- Don't set `overflow: hidden` on parent - particles need full viewport
- Ensure particle canvas doesn't block pointer events: `pointer-events-none`
- Test on mobile devices - particle count should auto-reduce
- Particle color should match theme (already configured in component)

**Known Issues to Avoid**:
- If particles appear "jumpy", check for conflicting CSS animations
- If particles lag, check Chrome DevTools for long tasks (should be < 50ms)
- If particles don't connect, ensure Canvas context is properly initialized (already done)

**Validation Commands**:
```bash
npm run dev  # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate and take screenshot
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.2-particles.png" })

// Wait 3 seconds to see animation
mcp__playwright__browser_wait_for({ time: 3 })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.2-particles-animated.png" })
```

**Performance Validation** (Chrome DevTools):
1. Open http://localhost:5000/landingv3
2. Open DevTools > Performance
3. Click "Record" and interact for 6 seconds
4. Stop recording
5. Check FPS meter (top right) - should show ~60fps
6. Check for warnings about layout shifts or forced reflows

**Lighthouse Validation**:
```bash
# Run Lighthouse on the page
# Performance score should be >= 90
```

**Success Criteria**:
- ✅ AnimatedParticles component integrated as fullscreen background
- ✅ Particles animate smoothly at 60fps
- ✅ Particles connect with lines when close
- ✅ Performance validated with Chrome DevTools (60fps sustained)
- ✅ Responsive: dense on desktop, simplified on mobile
- ✅ Content (test heading) remains visible and clickable
- ✅ No pointer-event interference (clicks pass through particles to content)
- ✅ `prefers-reduced-motion` respected (particles reduce/stop when enabled)

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 0.2 - Système Particules Animées
- **Prochaine étape**: PRP 0.3 - Curseur Custom Lumineux
