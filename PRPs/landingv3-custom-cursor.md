# PRP: LandingV3 - Custom Cursor Integration (PRP 0.3)

## Philosophy: Context is King

This PRP integrates the **existing, fully-functional** CustomCursor component into LandingV3. NO MODIFICATIONS to the component are needed - it's a simple import and render operation.

---

## 1. Goal and Why

**What are we building?**
Integrating the existing CustomCursor component to add a luminous cyan cursor with fluid spring physics trail that follows mouse movement on desktop devices.

**Why are we building it?**
- Enhance premium tech aesthetic established by animated particles
- Create interactive, engaging UX that mirrors high-end Awwwards-style sites
- Add subtle but impactful visual polish that differentiates from competitors
- Complete PRP 0.3 of the LandingV3 refonte sequence

---

## 2. What (Requirements)

### User-Visible Behavior
**Desktop/Laptop Users**:
- Custom cursor with 3 visual layers:
  1. Small cyan dot (12px) at exact cursor position with mix-blend-mode difference effect
  2. Animated halo ring (32px) pulsing around the dot
  3. Large diffuse glow (128px) creating luminous trail effect
- Spring physics creates smooth, fluid trailing motion (damping: 25, stiffness: 150, mass: 0.5)
- Cursor follows mouse with slight delay creating organic feel
- Always visible above all content (z-index 9999)
- Native system cursor remains functional, custom cursor enhances it

**Mobile/Touch Users**:
- Component automatically hidden (no custom cursor on touch devices)
- Native touch interactions unaffected

### Functional Requirements
- ✅ Import existing `CustomCursor` from `@/components/animations/CustomCursor`
- ✅ Render as direct child of root motion.div
- ✅ Component placed AFTER content div to ensure highest z-index in paint order
- ✅ No modifications to CustomCursor component code
- ✅ Component automatically handles:
  - Desktop/mobile detection
  - Mouse position tracking
  - Spring physics animation
  - Visibility states
  - Performance optimization

### Non-Functional Requirements
- **Performance**: GPU-accelerated transforms only, no layout thrashing
- **Accessibility**: Purely decorative, doesn't interfere with native cursor or keyboard nav
- **Responsive**: Hidden on mobile (<1024px and touch devices)
- **Compatibility**: Works in Chrome, Firefox, Safari (slight spring smoothness variance acceptable)

---

## 3. Success Criteria

The implementation is complete when:
- ✅ CustomCursor component imported into LandingV3.tsx
- ✅ Cursor visible on desktop when moving mouse (cyan glow with trailing effect)
- ✅ Spring physics creates smooth, fluid motion without lag
- ✅ Cursor hidden automatically on mobile/touch devices
- ✅ Clicks pass through cursor to underlying elements (pointer-events-none verified)
- ✅ Native hover states still function normally
- ✅ Component visible above particles and content (z-index hierarchy correct)
- ✅ No console errors
- ✅ TypeScript compilation passes
- ✅ Build succeeds with no warnings
- ✅ 60fps maintained (no performance degradation)

---

## 4. Documentation & References

### Official Documentation
- **Framer Motion Spring Animations**: https://www.framer.com/motion/animation/#spring-animations
  - `useSpring` hook: Creates smooth animated values with spring physics
  - `useMotionValue`: Performance-optimized values that don't trigger re-renders
  - Version in project: 11.13.1
- **Framer Motion useMotionValue**: https://www.framer.com/motion/use-motion-value/
  - Low-level primitive for tracking values without React re-renders
  - Perfect for cursor tracking (updates 60fps without React overhead)

### Relevant Code Examples
- `client/src/components/animations/CustomCursor.tsx` - **THE COMPLETE COMPONENT** (lines 1-97)
  - 3-layer visual design (point, halo, glow)
  - Spring physics configuration (lines 24-26)
  - Mouse tracking with useEffect (lines 28-44)
  - GPU-accelerated positioning (transform only)
  - Automatic mobile hiding via conditional render (line 46)
- `client/src/components/animations/AnimatedParticles.tsx` - Reference for z-0 background layer pattern
- `client/src/pages/LandingV3.tsx` - Current integration point (lines 1-45)

### Awwwards Inspiration
- https://chatflowai.co - Reference site mentioned in CustomCursor comments
- Cyan glow cursor with spring trail effect
- mix-blend-mode: difference for contrast inversion effect

---

## 5. Codebase Context

### Current Structure
```
client/src/pages/LandingV3.tsx (current state):
├── motion.div (root wrapper with page transition)
│   ├── AnimatedParticles (z-0 background layer)
│   └── div.relative.z-10 (content layer)
│       ├── main (centered test heading)
│       └── Footer
```

### Desired Structure (After Implementation)
```
client/src/pages/LandingV3.tsx (after PRP 0.3):
├── motion.div (root wrapper)
│   ├── AnimatedParticles (z-0 background)
│   ├── div.relative.z-10 (content layer)
│   │   ├── main
│   │   └── Footer
│   └── CustomCursor (z-[9999] top layer) ← NEW
```

### Z-Index Hierarchy
```
Layer 0:  AnimatedParticles (z-0 in component, fixed inset-0)
Layer 10: Content (relative z-10)
Layer 50+: CustomCursor (z-[9999], z-[9998], z-[9997] in component)
```

### Key Files to Modify
- `client/src/pages/LandingV3.tsx` (lines 1-45)
  - Line 3: Add import for CustomCursor
  - After line 41 (after content div closes, before motion.div closes): Add `<CustomCursor />`

---

## 6. Known Gotchas & Pitfalls

### Component-Specific Quirks
- **CustomCursor component**:
  - Already has `pointer-events-none` on all 3 layers - no click blocking
  - Already uses `z-[9999]`, `z-[9998]`, `z-[9997]` - always visible
  - Already hidden on mobile via conditional render (`if (!isVisible) return null`)
  - **DO NOT MODIFY** the component - it's tuned and working

### Common Mistakes
- ❌ **Placing CustomCursor inside content div** - would be constrained by z-10
- ✅ **Placing CustomCursor as sibling to content div** - allows z-9999 to work
- ❌ **Adding wrapper div around CustomCursor** - unnecessary, adds DOM node
- ✅ **Rendering CustomCursor directly as child** - clean, minimal
- ❌ **Trying to "test" cursor in Playwright screenshots** - cursor won't appear in screenshots (it's rendered by browser, not captured)
- ✅ **Manual testing in actual browser** - only way to verify cursor behavior

### Browser Quirks
- **Safari**: Spring animations may be ~10% less smooth (acceptable trade-off)
- **Firefox**: No known issues, performs well
- **Chrome**: Best performance, smoothest spring physics
- **mix-blend-mode: difference**: Works in all modern browsers, creates inversion effect on the center dot

### Performance Notes
- Cursor uses GPU-accelerated `transform` only (no layout/paint triggers)
- `useMotionValue` + `useSpring` prevent React re-renders (60fps stable)
- Three separate motion.div elements (one per layer) is intentional for independent animations
- No performance impact - verified in LandingV2 and other pages using CustomCursor

---

## 7. Data Models & Schemas

**N/A** - This is a pure UI component integration with no data models.

---

## 8. Implementation Tasks

### Task 1: Add CustomCursor Import
**Action**: INJECT
**Location**: `client/src/pages/LandingV3.tsx` (line 3, after AnimatedParticles import)
**Details**:
```typescript
import CustomCursor from "@/components/animations/CustomCursor";
```
**Why**: Need to import the existing component before rendering it
**Gotchas**:
- Use exact path `@/components/animations/CustomCursor` (no .tsx extension)
- Import should be grouped with other animation component imports

### Task 2: Render CustomCursor Component
**Action**: INJECT
**Location**: `client/src/pages/LandingV3.tsx` (after line 41, before closing motion.div tag)
**Details**:
```typescript
      {/* Custom cursor layer - renders last for highest z-index in paint order */}
      <CustomCursor />
    </motion.div>
```
**Why**:
- Component needs to be direct child of root motion.div
- Rendering AFTER content div ensures z-index 9999 is above z-10 content
- Comment explains layering strategy for future maintainers

**Gotchas**:
- Must be OUTSIDE the `<div className="relative z-10">` wrapper
- Must be AFTER that div (DOM paint order matters)
- Self-closing tag `<CustomCursor />` is sufficient (no children)

---

## 9. Testing Strategy

### Unit Tests
**N/A** - CustomCursor component is already tested. This PRP only integrates it.

### Integration Tests
**Manual testing required** (cursor cannot be validated via Playwright screenshots):

1. **Desktop Testing**:
   - Open http://localhost:5000/landingv3 in Chrome
   - Move mouse around page
   - Expected: Cyan glowing cursor with 3 layers (dot, ring, glow) follows mouse smoothly
   - Verify spring physics creates trailing effect (not instant snap to position)
   - Hover over "LandingV3 - Coming Soon" heading
   - Click heading
   - Expected: Native hover states work, clicks register normally

2. **Mobile Testing**:
   - Open http://localhost:5000/landingv3 on mobile device OR DevTools mobile emulator
   - Expected: No custom cursor visible, native touch works normally

3. **Performance Testing**:
   - Open DevTools > Performance tab
   - Record while moving mouse in circles for 5 seconds
   - Expected: 60fps maintained, no janks or frame drops

4. **Console Testing**:
   - Open DevTools > Console
   - Move mouse around page
   - Expected: No errors or warnings related to CustomCursor

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: TypeScript compilation passes (pre-existing errors in v2 components are acceptable, no NEW errors)

### Level 2: Build
```bash
npm run build
```
**Expected**: Production build succeeds, bundle size increase minimal (<5KB for CustomCursor)

### Level 3: Dev Server
```bash
npm run dev
```
Navigate to http://localhost:5000/landingv3

### Level 4: Visual Validation (Playwright)
**Note**: Custom cursor will NOT appear in screenshots (browser-rendered, not captured). Use Playwright to verify page loads without errors:

```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Check console for errors (should be none)
mcp__playwright__browser_console_messages({ onlyErrors: true })

// Take screenshot (cursor won't show, but page should render correctly)
mcp__playwright__browser_take_screenshot({ filename: "prp-0.3-cursor-integrated.png" })

// Verify CustomCursor is in DOM (won't be visible in snapshot, but should exist)
mcp__playwright__browser_snapshot()
// Look for motion.div elements with z-[9999] class in YAML output
```

### Level 5: Manual Testing (REQUIRED)
**This is the primary validation method for cursor functionality.**

Open http://localhost:5000/landingv3 in **real browser** (not headless):

**Checklist**:
- [ ] Cyan custom cursor visible when moving mouse
- [ ] Three layers visible (center dot, pulsing ring, diffuse glow)
- [ ] Spring physics creates smooth trailing effect (not instant follow)
- [ ] Cursor positioned correctly at mouse location
- [ ] Clicks on heading register normally
- [ ] Hover states on clickable elements still work
- [ ] Cursor disappears when mouse leaves window
- [ ] Cursor reappears when mouse re-enters window
- [ ] Open mobile view (DevTools) - cursor should disappear
- [ ] Resize from desktop to mobile - cursor should hide smoothly
- [ ] No console errors during mouse movement
- [ ] 60fps maintained (check DevTools > Performance tab)

---

## 11. Integration Points

### Configuration Changes
**N/A** - No environment variables or config changes needed

### Route Registration
**N/A** - No API routes for this feature

### Database Migrations
**N/A** - No database changes

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ **Modify CustomCursor component code** - it's tuned and working perfectly
- ❌ **Wrap CustomCursor in a div** - adds unnecessary DOM node, complicates layering
- ❌ **Place CustomCursor inside content div** - would be constrained by z-10
- ❌ **Add CustomCursor inside AnimatedParticles** - wrong layer
- ❌ **Change spring physics settings** - already optimally tuned (damping: 25, stiffness: 150, mass: 0.5)
- ❌ **Add mobile-specific code** - component already handles mobile detection
- ❌ **Try to hide system cursor** - intentional that both are visible
- ❌ **Add `pointer-events-auto`** - would block clicks to underlying content
- ❌ **Rely on Playwright screenshots for cursor validation** - cursor won't show in automated screenshots

### DO:
- ✅ **Import existing CustomCursor component unchanged**
- ✅ **Place as direct child of root motion.div**
- ✅ **Render AFTER content div** for proper paint order
- ✅ **Test manually in real browser** (automated testing insufficient)
- ✅ **Verify clicks pass through to content**
- ✅ **Check mobile behavior** (should auto-hide)
- ✅ **Keep implementation minimal** - just import + render
- ✅ **Trust the component** - it's already production-ready

---

## 13. Progressive Success

### Minimal Viable Implementation (Step 1)
1. Add import statement
2. Add `<CustomCursor />` component after content div
3. Save file (Vite hot reload)
4. Verify no console errors

**Validation**: `npm run check` passes, `npm run build` succeeds

### Enhanced Implementation (Step 2)
5. Test manually in Chrome/Firefox/Safari
6. Test on mobile device or emulator
7. Verify clicks and hover states work
8. Check performance (60fps)

**Validation**: All manual testing checklist items pass

### Final Implementation (Step 3)
9. Update execution log in `avancement_refonte.md`
10. Document visual deliverable achieved
11. Confirm all success criteria met

**Validation**: PRP 0.3 marked complete in tracking document

---

## Final Validation Checklist

Before marking PRP 0.3 complete:
- [ ] CustomCursor import added to LandingV3.tsx
- [ ] CustomCursor rendered as child of root motion.div (outside content wrapper)
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Page loads at http://localhost:5000/landingv3 without console errors
- [ ] Manual testing in browser shows cyan cursor with spring trail
- [ ] Clicks pass through cursor to underlying content
- [ ] Cursor hidden on mobile/touch devices
- [ ] 60fps performance maintained
- [ ] Execution log written to `avancement_refonte.md`

---

## Confidence Score: 9.5/10

**Why 9.5?**
- ✅ CustomCursor component is complete, tested, and production-ready
- ✅ Integration is trivial (2 lines of code: import + render)
- ✅ Clear documentation of z-index layering strategy
- ✅ No modifications to existing component needed
- ✅ Manual testing steps clearly defined
- ✅ All gotchas and anti-patterns documented

**Why not 10/10?**
- Manual testing in real browser is required (cannot be fully automated)
- Slight browser variance in spring smoothness (acceptable trade-off)

**Mitigation**:
- Comprehensive manual testing checklist provided
- Browser quirks documented with expected behavior
- Clear validation that Playwright screenshots won't show cursor

This PRP provides complete context for successful one-pass implementation.
