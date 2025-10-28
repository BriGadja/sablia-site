# PRP: LandingV3 AnimatedParticles Integration

## Philosophy: Plug-and-Play Existing Component

This PRP integrates an already-working, performance-optimized AnimatedParticles component into LandingV3. The component requires **ZERO modifications** - it's already configured with fixed positioning, GPU-accelerated Canvas rendering, mouse interaction, responsive behavior, and accessibility features.

**Validation approach:**
1. Import existing component without modification
2. Place as background layer with proper z-indexing
3. Verify 60fps performance with Chrome DevTools
4. Test accessibility (prefers-reduced-motion)
5. Visual validation with Playwright screenshots

---

## 1. Goal and Why

**What are we building?**
Integrating the existing `AnimatedParticles.tsx` component as a fullscreen animated background layer for LandingV3, creating an organic, premium visual effect with:
- Cyan (#52D1DC) and Electric Blue (#3E92CC) particles moving smoothly
- Dynamic connections between nearby particles (lines fade based on distance)
- Particle attraction to cursor within 150px radius
- Smooth 60fps animation using Canvas API + requestAnimationFrame

**Why are we building it?**
- **Premium Visual Identity**: Animated particles create a modern, tech-forward aesthetic
- **Performance Baseline**: Establishes that complex animations can run smoothly (60fps) before adding more features
- **Brand Consistency**: Uses the v2 color palette (Cyan/Electric Blue) to reinforce Sablia's tech automation identity
- **Foundation for PRP 0.3**: Sets up proper z-index layering for CustomCursor component (next PRP)

---

## 2. What (Requirements)

### User-Visible Behavior
User navigates to `http://localhost:5000/landingv3` and sees:
- Navy gradient background with animated particles floating smoothly
- Cyan and Electric Blue colored particles (~50-80 on desktop, ~20-30 on mobile)
- Particles connect with fading lines when within 100px of each other
- Particles subtly attracted to cursor when within 150px radius
- Test heading "LandingV3 - Coming Soon" remains visible and centered on top
- Smooth 60fps animation with no stuttering or frame drops
- On mobile: Fewer particles for performance optimization
- When user enables `prefers-reduced-motion`: Particles reduce movement or stop entirely

### Functional Requirements
- **Component Integration**: Import `AnimatedParticles` from `@/components/animations/AnimatedParticles`
- **Z-Index Layering**: Particles at z-0 (background), content at z-10 (foreground)
- **No Pointer Interference**: `pointer-events-none` ensures clicks pass through particles to content
- **Performance**: Maintain 60fps during scroll, hover, and interaction
- **Responsive**: Automatic particle count adjustment based on screen size
- **Accessibility**: Respect `prefers-reduced-motion` media query (already implemented)
- **Zero Modifications**: Use AnimatedParticles component as-is without any changes

### Non-Functional Requirements
- **Performance**: 60fps sustained (validated with Chrome DevTools Performance tab)
- **GPU Acceleration**: Canvas rendering with requestAnimationFrame (already implemented)
- **Memory Efficiency**: No memory leaks from animation loop (cleanup in useEffect)
- **Browser Compatibility**: Works on Chrome, Firefox, Safari (Canvas API widely supported)
- **Mobile Performance**: Reduced particle count prevents lag on mobile devices

---

## 3. Success Criteria

The implementation is complete when:
- [ ] AnimatedParticles component imported into LandingV3.tsx
- [ ] Particles render as fullscreen background layer (z-0)
- [ ] Content (test heading, Footer) remains visible on top (z-10)
- [ ] Particles animate smoothly at 60fps (validated with Chrome DevTools)
- [ ] Particles connect with lines when within 100px of each other
- [ ] Particles attract to cursor within 150px radius
- [ ] Clicks pass through particles to content (no pointer interference)
- [ ] Responsive behavior: more particles on desktop, fewer on mobile
- [ ] `prefers-reduced-motion` respected (particles reduce/stop when enabled)
- [ ] No console errors or warnings
- [ ] TypeScript compilation passes
- [ ] Production build succeeds
- [ ] Playwright screenshots validate visual output
- [ ] No modifications made to AnimatedParticles.tsx

---

## 4. Documentation & References

### Official Documentation
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
  - Section: Basic animations with requestAnimationFrame
  - Section: Drawing shapes (circles, lines)
- **requestAnimationFrame**: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  - 60fps animation loop (optimal browser rendering)
- **prefers-reduced-motion**: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
  - Accessibility media query for motion sensitivity

### Relevant Code Examples
- `client/src/components/animations/AnimatedParticles.tsx` - **REFERENCE ONLY, DO NOT MODIFY**
  - Lines 16-23: Particle interface (x, y, vx, vy, radius, color)
  - Lines 44-58: Particle initialization with random positions and velocities
  - Lines 71-126: Animation loop with Canvas drawing
  - Lines 85-94: Mouse interaction logic (attraction within 150px)
  - Lines 106-122: Connection lines between nearby particles
  - Line 138: Fixed positioning with pointer-events-none already applied
- `client/src/pages/LandingV3.tsx` - Current implementation to modify
  - Current structure: motion.div wrapper with gradient, main content, Footer
  - Integration point: Add AnimatedParticles as first child

### Key Code Snippets from Codebase

**AnimatedParticles Component** (READ-ONLY REFERENCE):
```typescript
// client/src/components/animations/AnimatedParticles.tsx (lines 25-142)
export default function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Canvas setup
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Particle count calculation (responsive)
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    // Desktop: ~50-80 particles, Mobile: ~20-30 particles

    // Animation loop (60fps)
    const animate = () => {
      // Draw particles
      // Draw connection lines
      // Mouse interaction
      requestAnimationFrame(animate);
    };

    return () => {
      // Cleanup listeners
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
```

**Current LandingV3 Structure** (lines 4-37):
```typescript
export default function LandingV3() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-v2-navy via-v2-navy to-v2-electric"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <main className="flex items-center justify-center min-h-screen">
        <h1 className="text-[72px] font-bold leading-tight tracking-tight text-white">
          LandingV3 - Coming Soon
        </h1>
        {/* Hidden section placeholders */}
      </main>
      <Footer />
    </motion.div>
  );
}
```

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   └── animations/
│       └── AnimatedParticles.tsx  # Existing, DO NOT MODIFY
├── pages/
│   └── LandingV3.tsx              # MODIFY: Add AnimatedParticles import and placement
```

### Desired Structure (After Implementation)
```
client/src/pages/LandingV3.tsx
├── AnimatedParticles (z-0, fixed background)
└── Content wrapper (z-10, relative)
    ├── main (test heading + hidden sections)
    └── Footer
```

### Key Files to Modify
- `client/src/pages/LandingV3.tsx` - Add import and integrate AnimatedParticles component

### Files to Reference (NO MODIFICATIONS)
- `client/src/components/animations/AnimatedParticles.tsx` - Read-only reference

---

## 6. Known Gotchas & Pitfalls

### Component-Specific Quirks
- **AnimatedParticles Already Has Positioning**: The component already includes `className="fixed inset-0 pointer-events-none z-0"` (line 138), so you don't need to wrap it in a positioned div. Just import and render it directly.
- **Canvas Must Be First Child**: Place AnimatedParticles before content to ensure proper layering (even though z-index handles it, DOM order helps with paint performance)
- **Framer Motion Parent**: AnimatedParticles is a static canvas; parent motion.div animations don't affect it (by design)

### Common Mistakes
- ❌ **Wrapping AnimatedParticles in a positioned div** - Component already has fixed positioning
  - Wrong: `<div className="fixed inset-0"><AnimatedParticles /></div>`
  - Correct: `<AnimatedParticles />` (renders directly)

- ❌ **Modifying AnimatedParticles component** - Component is already optimized and tested
  - Don't change particle count, colors, physics, or any logic

- ❌ **Adding overflow: hidden to parent** - Breaks fullscreen canvas
  - Parent motion.div must allow overflow for canvas to fill viewport

- ❌ **Setting z-index on content without relative positioning** - z-index requires position: relative/absolute/fixed
  - Correct: Add `className="relative z-10"` to content wrapper

### Error Patterns
- Error: `Particles appear above content (clicking heading doesn't work)`
  - Cause: Content doesn't have z-10 or relative positioning
  - Fix: Wrap content in `<div className="relative z-10">...</div>`

- Error: `Particles don't animate smoothly (stuttering)`
  - Cause: Browser is doing too much work (check Chrome DevTools > Performance)
  - Fix: Component is already optimized; check for other heavy processes

- Error: `Particles don't appear at all`
  - Cause: Canvas might not have dimensions (rare, but check)
  - Fix: Component already handles resize; check console for errors

### Performance Gotchas
- **Chrome DevTools Performance Tab**: Record 6 seconds of interaction
  - FPS meter (top right) should stay at ~60fps
  - No long tasks > 50ms
  - No forced reflows or layout thrashing
- **Mobile Performance**: Particle count auto-reduces (component handles this)
  - Desktop: ~50-80 particles (1920x1080: 15,000 px²/particle)
  - Mobile: ~20-30 particles (375x667: 15,000 px²/particle)

---

## 7. Data Models & Schemas

No database or API schemas required. This is pure frontend visual component integration.

### Component Props
AnimatedParticles accepts NO PROPS (self-contained with internal state).

### Internal State (Read-Only Reference)
```typescript
// client/src/components/animations/AnimatedParticles.tsx
interface Particle {
  x: number;        // Position X
  y: number;        // Position Y
  vx: number;       // Velocity X (speed and direction)
  vy: number;       // Velocity Y
  radius: number;   // Particle size (1-3px)
  color: string;    // "#52D1DC" (cyan) or "#3E92CC" (electric blue)
}
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Import AnimatedParticles component
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:

Add import at top of file (after existing imports):
```typescript
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import AnimatedParticles from "@/components/animations/AnimatedParticles"; // ADD THIS LINE
```

**Why**: Makes AnimatedParticles available for use in LandingV3 component
**Gotchas**:
- Use exact path `@/components/animations/AnimatedParticles` (alias configured in project)
- Don't add curly braces `{}` around import (default export, not named export)

---

### Task 2: Integrate AnimatedParticles as background layer
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:

Replace the return statement with the following structure:

```typescript
export default function LandingV3() {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-v2-navy via-v2-navy to-v2-electric"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated particles background - renders first for proper layering */}
      <AnimatedParticles />

      {/* Content layer - must have relative z-10 to appear above particles */}
      <div className="relative z-10">
        <main className="flex items-center justify-center min-h-screen">
          {/* Test heading to validate typography */}
          <h1 className="text-[72px] font-bold leading-tight tracking-tight text-white">
            LandingV3 - Coming Soon
          </h1>

          {/* Hidden section placeholders - will be visible in DOM inspector */}
          <div className="hidden">
            <section id="hero" className="min-h-screen" />
            <section id="testimonials" className="py-24" />
            <section id="logos" className="py-24" />
            <section id="problem" className="py-24" />
            <section id="solution" className="py-24" />
            <section id="process" className="py-24" />
            <section id="pricing" className="py-24" />
            <section id="calculator" className="py-24" />
            <section id="contact" className="py-24" />
            <section id="faq" className="py-24" />
          </div>
        </main>

        <Footer />
      </div>
    </motion.div>
  );
}
```

**Why**:
- AnimatedParticles renders as fixed fullscreen canvas (z-0) behind everything
- Content wrapper with `relative z-10` ensures content appears above particles
- DOM order (particles first) helps with paint performance
- No wrapper div needed around AnimatedParticles (component already has fixed positioning)

**Gotchas**:
- AnimatedParticles must be direct child of motion.div (no wrapper needed)
- Content MUST have `relative z-10` or it won't appear above particles
- Don't add `pointer-events-none` to content wrapper (only AnimatedParticles has it)
- Keep all existing section placeholders and Footer inside the content wrapper

---

## 9. Testing Strategy

### Visual Testing (No Unit Tests Needed)
This is a visual component integration with no business logic to unit test. Testing is purely visual and performance validation.

**Test Cases**:
1. **Particles Visible**: Navigate to /landingv3, verify particles are visible and animating
2. **Content Layering**: Verify test heading and Footer visible on top of particles
3. **Particle Connections**: Verify lines appear between nearby particles (<100px apart)
4. **Mouse Interaction**: Move cursor, verify particles subtly attract to it within ~150px radius
5. **Click Pass-Through**: Click on heading, verify it's clickable (particles don't block)
6. **Performance**: Open Chrome DevTools > Performance, record 6 seconds, verify 60fps sustained
7. **Responsive**: Resize browser window, verify particle count adjusts (more on desktop, fewer on mobile)
8. **Accessibility**: Enable `prefers-reduced-motion`, verify particles reduce/stop movement

### Manual Performance Testing
**Chrome DevTools > Performance Tab**:
1. Open http://localhost:5000/landingv3
2. Open DevTools (F12) → Performance tab
3. Click "Record" button (circle icon)
4. Scroll page, move mouse, hover over elements (6 seconds)
5. Click "Stop" button
6. Check FPS meter (top right of timeline) - should show ~60fps
7. Check for warnings about layout shifts or forced reflows (should be none)
8. Check for long tasks > 50ms (should be none or very few)

**Expected Results**:
- FPS: 58-60fps sustained (no drops below 55fps)
- Main thread activity: Mostly rendering and rAF callbacks
- No layout thrashing warnings
- No memory leaks (heap size stable over time)

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected output**: No TypeScript errors (pre-existing v2 errors unrelated to LandingV3 are acceptable)

### Level 2: Build
```bash
npm run build
```
**Expected output**:
- Client build succeeds
- Server build succeeds
- Bundle size similar to PRP 0.1 (~800KB JS, ~100KB CSS)

### Level 3: Dev Server
```bash
npm run dev
```
**Expected output**:
- Server starts on port 5000
- Navigate to http://localhost:5000/landingv3
- Page renders with animated particles in background

### Level 4: Visual Validation (Playwright)
```javascript
// Navigate to page
await mcp__playwright__browser_navigate({
  url: "http://localhost:5000/landingv3"
});

// Wait for initial load
await mcp__playwright__browser_wait_for({ time: 1 });

// Take screenshot of initial state
await mcp__playwright__browser_take_screenshot({
  filename: "prp-0.2-particles-initial.png"
});

// Wait for animation to be visible
await mcp__playwright__browser_wait_for({ time: 3 });

// Take screenshot after animation
await mcp__playwright__browser_take_screenshot({
  filename: "prp-0.2-particles-animated.png"
});

// Check console for errors
const messages = await mcp__playwright__browser_console_messages({
  onlyErrors: true
});
// Expected: No error messages
```

### Level 5: Performance Validation (Manual)
1. Open http://localhost:5000/landingv3 in Chrome
2. Open DevTools (F12) > Performance tab
3. Click Record, interact for 6 seconds, Stop
4. Verify FPS meter shows ~60fps
5. Verify no long tasks or layout warnings

### Level 6: Accessibility Test (Manual)
1. Open http://localhost:5000/landingv3
2. Open DevTools > Rendering tab (Command Menu: "Show Rendering")
3. Enable "Emulate CSS media feature prefers-reduced-motion: reduce"
4. Verify particles reduce movement or stop (component handles this automatically)

---

## 11. Integration Points

### No Configuration Changes
- No environment variables needed
- No database migrations needed
- No API routes needed
- No new dependencies (AnimatedParticles already exists)

### Component Dependencies
- [x] AnimatedParticles imported from `@/components/animations/AnimatedParticles`
- [x] Footer still imported and rendered
- [x] Framer Motion still used for page transition

### Route Registration
- No changes needed (route already registered in PRP 0.1)

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ **Modify AnimatedParticles.tsx** - Component is already optimized and tested
- ❌ **Wrap AnimatedParticles in a positioned div** - Component already has fixed positioning
- ❌ **Add inline styles to AnimatedParticles** - Component already has all necessary styles
- ❌ **Change particle colors, count, or physics** - Already configured for optimal UX
- ❌ **Remove pointer-events-none** - Would block clicks on content
- ❌ **Forget z-10 on content** - Content would render below particles (invisible/unclickable)
- ❌ **Add overflow: hidden to parent** - Would clip the fullscreen canvas

### DO:
- ✅ **Import and render AnimatedParticles as-is** - Zero modifications needed
- ✅ **Place AnimatedParticles as first child** - DOM order helps paint performance
- ✅ **Wrap content in relative z-10 div** - Ensures content appears above particles
- ✅ **Test performance with Chrome DevTools** - Verify 60fps before moving to next PRP
- ✅ **Test on mobile devices** - Verify particle count reduces automatically
- ✅ **Keep motion.div wrapper** - Page transition animation still works correctly

---

## 13. Progressive Success

**Minimal Viable Implementation** (Start here):
1. Import AnimatedParticles
2. Add component to LandingV3
3. Wrap content in z-10 div
4. Verify page renders without errors

**Then Validate**:
5. Run `npm run check` - ensure TypeScript passes
6. Run `npm run build` - ensure build succeeds
7. Visual check - particles animating, content visible on top

**Then Verify Performance**:
8. Chrome DevTools Performance tab - verify 60fps
9. Test mouse interaction - particles attract to cursor
10. Test responsiveness - resize window, particle count adjusts

**Then Verify Accessibility**:
11. Enable prefers-reduced-motion - particles reduce/stop
12. Click test heading - verify clickable (no pointer interference)

**No Enhancement Needed**: Component is already fully featured.

---

## Final Validation Checklist

Before marking complete:
- [ ] AnimatedParticles imported from correct path
- [ ] AnimatedParticles renders as first child in motion.div
- [ ] Content wrapped in `relative z-10` div
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build passes (`npm run build`)
- [ ] Page accessible at http://localhost:5000/landingv3
- [ ] Particles visible and animating smoothly
- [ ] Particles connect with lines when close
- [ ] Particles attract to cursor within ~150px
- [ ] Test heading visible and clickable on top of particles
- [ ] Footer visible at bottom
- [ ] 60fps performance validated with Chrome DevTools
- [ ] No console errors or warnings
- [ ] Responsive behavior tested (desktop vs mobile)
- [ ] Accessibility tested (prefers-reduced-motion)
- [ ] Playwright screenshots captured
- [ ] AnimatedParticles.tsx NOT MODIFIED
- [ ] Execution log written to avancement_refonte.md

---

## Confidence Score: 9.5/10

**Why high confidence?**
- AnimatedParticles component already exists and is fully functional
- Component already has all required features (positioning, performance, accessibility)
- Integration is extremely simple (import + render + z-index layering)
- Clear visual validation criteria (60fps, particles visible, connections working)
- No complex logic or state management needed
- Well-documented component with clear integration pattern

**Why not 10/10?**
- Visual validation is subjective (need to verify particles look good with Navy gradient)
- Performance can vary by user's machine (though 60fps is achievable on modern hardware)

**Missing context that would raise to 10/10:**
- Actual performance metrics from real-world testing (can verify during implementation)
