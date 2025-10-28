# INITIAL - PRP 0.3 - Curseur Custom Lumineux

## FEATURE

Integrate the existing CustomCursor component to add a luminous cursor with fluid trail effect that follows the mouse.

**Requirements**:
- Use the EXISTING `client/src/components/animations/CustomCursor.tsx` component WITHOUT modification
- Cursor should display on desktop/tablet only (hidden on mobile/touch devices)
- Luminous cyan glow effect that follows mouse movement smoothly
- Spring physics for fluid trailing motion (already implemented with Framer Motion)
- Component should render at highest z-index to always be visible
- Must not interfere with clickable elements or hover states

**Visual Deliverable**: Custom cursor with cyan glow visible on desktop, following mouse movements with smooth spring physics trailing effect, layered above particles and content.

**Technical Requirements**:
- Import existing component: `import CustomCursor from "@/components/animations/CustomCursor"`
- Place as direct child in the page component (outside main content flow)
- Highest z-index (`z-50` or `z-[9999]`) to stay above all content
- Automatically hidden on mobile (already implemented in component)
- No pointer-events interference

## EXAMPLES

**Integration Pattern**:
```typescript
// Reference: How to layer cursor at top
import CustomCursor from "@/components/animations/CustomCursor";
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

      {/* Content layer - must have relative z-10 to appear above particles */}
      <div className="relative z-10">
        <Navigation />
        <main>
          {/* Sections */}
        </main>
        <Footer />
      </div>

      {/* Custom cursor layer - renders last for highest z-index in paint order */}
      <CustomCursor />
    </motion.div>
  );
}
```

**Z-Index Hierarchy**:
```typescript
z-0    // AnimatedParticles
z-10   // Main content
z-50   // CustomCursor (top layer, always visible)
```

## DOCUMENTATION

**Existing Component**: `client/src/components/animations/CustomCursor.tsx`
- Already implements spring physics via Framer Motion
- Already has cyan luminous glow effect
- Already hidden on mobile/touch devices
- Already uses `pointer-events-none` to avoid blocking clicks
- Already GPU-accelerated (transform-only animations)

**Framer Motion Spring Physics**:
- https://www.framer.com/motion/animation/#spring-animations
- Component already configured with optimal spring settings
- Smooth trailing effect without lag

**Cursor Styling**:
- Cyan glow color (already matches `v2-cyan` #52D1DC)
- Blur effect for luminous appearance
- Small circular shape with trailing animation

**Desktop-Only Display**:
- Component already checks for touch device: `'ontouchstart' in window`
- Automatically hidden on mobile/tablet
- CSS media queries also hide on small screens

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

**DO NOT MODIFY** the CustomCursor component:
- Component is already working and tested
- Has correct spring physics tuning
- Has correct device detection
- Any modification risks breaking smooth animation

**Z-Index Strategy**:
- CustomCursor must have highest z-index to always be visible
- Use `z-50` or `z-[9999]` to ensure it's above modals, dropdowns, etc.
- Component already has `pointer-events-none` to not block clicks

**Performance**:
- Cursor animation uses GPU-accelerated transforms only
- Spring physics optimized to not cause jank
- No performance impact on 60fps target

**Mobile Behavior**:
- Component automatically hidden on touch devices
- No need for manual media queries
- Falls back to native cursor on mobile

**Gotchas**:
- Cursor should not interfere with native hover states (already handled with `pointer-events-none`)
- Ensure z-index is higher than all other elements
- Test that clicks pass through cursor to underlying elements
- Native system cursor should remain visible (component adds effect on top)

**Known Browser Quirks**:
- Safari: Spring animations may be slightly less smooth (acceptable trade-off)
- Firefox: No known issues
- Chrome: Best performance

**Accessibility**:
- Custom cursor is purely decorative
- Does not interfere with keyboard navigation
- Respects `prefers-reduced-motion` (component already handles this)
- Native cursor remains functional

**Validation Commands**:
```bash
npm run dev  # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Take screenshot (cursor won't show in screenshot, but component should not cause errors)
mcp__playwright__browser_take_screenshot({ filename: "prp-0.3-cursor-integrated.png" })

// Check console for errors
mcp__playwright__browser_console_messages({ onlyErrors: true })
```

**Manual Testing** (required for cursor):
1. Open http://localhost:5000/landingv3 in Chrome/Firefox/Safari
2. Move mouse around - should see cyan glowing cursor trail
3. Hover over clickable elements - native hover states should still work
4. Click buttons - clicks should register normally
5. Open DevTools > Elements - verify CustomCursor is in DOM
6. Resize window to mobile size - cursor should disappear
7. Check DevTools > Performance - cursor should not cause FPS drops

**Mobile Testing**:
1. Open http://localhost:5000/landingv3 on mobile device or DevTools mobile emulator
2. Verify CustomCursor component is not visible
3. Native touch interactions should work normally

**Success Criteria**:
- ✅ CustomCursor component integrated
- ✅ Cursor visible on desktop/laptop with mouse
- ✅ Cyan luminous trail follows mouse smoothly
- ✅ Spring physics creates fluid motion (no lag)
- ✅ Hidden automatically on mobile/touch devices
- ✅ Clicks pass through to underlying elements
- ✅ Native hover states still function
- ✅ No performance impact (60fps maintained)
- ✅ No console errors
- ✅ Component at highest z-index (visible above all content)

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 0.3 - Curseur Custom Lumineux
- **Prochaine étape**: PRP 0.4 - Navigation & Footer
