# PRP: LandingV3 Setup & Layout Base

## Philosophy: Foundation First

This PRP establishes the foundational structure for the new LandingV3 page. We're creating the skeleton with proper routing, color system, typography, and section placeholders. This is Phase 0.1 of the landing page refonte (redesign).

**Validation approach:**
1. TypeScript compilation must pass
2. Production build must succeed
3. Visual validation with Navy gradient and test heading

---

## 1. Goal and Why

**What are we building?**
A new empty page component at route `/landingv3` with:
- Proper routing setup via Wouter
- Navy → Electric Blue gradient background
- 11 section placeholders with semantic IDs
- Test heading to validate typography system
- Page transition animations via Framer Motion

**Why are we building it?**
This is the first step in a complete landing page redesign. We need a clean foundation that:
- Validates the visual system (colors, typography, spacing)
- Establishes section structure for future components
- Ensures build tooling works before adding complexity
- Provides a baseline for Playwright visual testing

---

## 2. What (Requirements)

### User-Visible Behavior
User navigates to `http://localhost:5000/landingv3` and sees:
- Navy blue background with subtle gradient to Electric Blue
- Centered white test heading in Inter 72px font: "LandingV3 - Coming Soon"
- Smooth fade-in page transition (400ms)
- Footer at bottom of page

### Functional Requirements
- Route `/landingv3` registered in App.tsx
- New component `client/src/pages/LandingV3.tsx` created
- 11 section placeholders with semantic IDs
- Gradient background using Tailwind v2 colors
- Inter font typography system validated
- Footer component reused from existing codebase
- Framer Motion page transition

### Non-Functional Requirements
- TypeScript compilation with zero errors
- Production build succeeds
- No console errors in browser
- Page loads in < 2 seconds
- Responsive design foundation (mobile-first)

---

## 3. Success Criteria

The implementation is complete when:
- [ ] Route `/landingv3` accessible via browser
- [ ] Component renders without errors
- [ ] Navy → Electric Blue gradient background visible
- [ ] Test heading displays in Inter 72px, white color, centered
- [ ] All 11 section placeholders present with correct IDs
- [ ] Footer displays at bottom
- [ ] Page transition (fade-in) works smoothly
- [ ] `npm run check` passes (TypeScript)
- [ ] `npm run build` passes (Production build)
- [ ] No console errors or warnings
- [ ] Playwright screenshot validates visual output

---

## 4. Documentation & References

### Official Documentation
- **Framer Motion**: https://www.framer.com/motion/animation/
  - `initial`, `animate`, `exit` props for page transitions
  - Version 11.13.1 installed in project
- **Wouter Routing**: https://github.com/molefrog/wouter
  - `<Route path="/path" component={Component} />` syntax
  - Version 3.3.5 installed
- **Tailwind CSS Gradients**: https://tailwindcss.com/docs/gradient-color-stops
  - `bg-gradient-to-br from-{color} via-{color} to-{color}`
- **Inter Font**: https://fonts.google.com/specimen/Inter
  - Already imported in project (verify in index.css or HTML)

### Relevant Code Examples
- `client/src/pages/LandingV2.tsx` - Exact pattern to follow for page structure
- `client/src/App.tsx` - Route registration pattern (lines 20-24)
- `client/src/components/Footer.tsx` - Footer component to reuse
- `tailwind.config.ts` - v2 color palette already defined (lines 64-70)

### Key Code Snippets from Codebase

**LandingV2 Pattern** (lines 13-36):
```typescript
export default function LandingV2() {
  return (
    <motion.div
      className="min-h-screen bg-v2-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navigation />
      <main>
        <Hero />
        {/* Other sections */}
      </main>
      <Footer />
    </motion.div>
  );
}
```

**Route Registration Pattern** (App.tsx line 24):
```typescript
<Route path="/landingv3" component={LandingV3Enhanced} />
```

**Tailwind v2 Colors** (tailwind.config.ts lines 64-70):
```typescript
"v2-navy": "#0A2463",
"v2-electric": "#3E92CC",
"v2-cyan": "#52D1DC",
"v2-white": "#FFFFFF",
"v2-off-white": "#F8F9FA",
"v2-charcoal": "#2D3142",
```

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── App.tsx                    # Routes defined here
├── pages/
│   ├── Home.tsx
│   ├── LandingV2.tsx          # Reference pattern
│   ├── LandingV3Enhanced.tsx  # Currently on / route
│   └── ...
├── components/
│   └── Footer.tsx             # Reuse this
└── index.css                  # Global styles
```

### Desired Structure (After Implementation)
```
client/src/
├── App.tsx                    # Add /landingv3 route
├── pages/
│   ├── ...
│   └── LandingV3.tsx          # NEW: Empty page component
```

### Key Files to Modify
- `client/src/App.tsx` - Add route for `/landingv3`
- `client/src/pages/LandingV3.tsx` - CREATE new page component

### Files to Read (for reference)
- `client/src/pages/LandingV2.tsx` - Structure pattern
- `tailwind.config.ts` - Color verification
- `client/src/components/Footer.tsx` - Footer import

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- **Framer Motion AnimatePresence**: Already setup in App.tsx (line 18), no need to add again
- **Wouter Routes**: Must be inside `<Switch>` component (already done in App.tsx)
- **Tailwind Arbitrary Values**: Use `text-[72px]` for exact pixel sizes (not in predefined scale)

### Common Mistakes
- ❌ Importing Navigation from `@/components/v3/Navigation` - Component doesn't exist yet
- ✅ Use placeholder or skip Navigation for now, only import Footer
- ❌ Modifying the `/` route - Leave it as `LandingV3Enhanced`
- ✅ Only create `/landingv3` route (different from current `/`)
- ❌ Using `<section>` without `id` attributes
- ✅ Every section must have semantic `id` for anchor navigation

### Error Patterns
- Error: `Cannot find module '@/components/v3/Navigation'`
  - Cause: Trying to import component that doesn't exist yet
  - Fix: Skip Navigation import for now or create placeholder

- Error: `Property 'component' does not exist on type 'RouteProps'`
  - Cause: Wrong import or Wouter version mismatch
  - Fix: Use exact pattern from existing routes in App.tsx

- Error: `Hydration failed because the initial UI does not match`
  - Cause: Server/client render mismatch with Framer Motion
  - Fix: Ensure AnimatePresence mode="wait" in App.tsx (already set)

### Visual System Gotchas
- Inter font must be loaded (check index.css or index.html for Google Fonts import)
- Gradient should be subtle: use `via-v2-navy` to keep mostly Navy with blue edges
- Test heading needs explicit white color (`text-v2-white` or `text-white`)

---

## 7. Data Models & Schemas

No database or API schemas required for this task. This is pure frontend component creation.

### Section IDs (for reference)
```typescript
const SECTION_IDS = [
  'hero',          // Hero Section
  'testimonials',  // Testimonials Carousel
  'logos',         // Logos Cloud
  'problem',       // Problem Section
  'solution',      // Solution Section
  'process',       // Three Step Process
  'pricing',       // Pricing Section
  'calculator',    // ROI Calculator
  'contact',       // Contact Form
  'faq'            // FAQ Section
  // Footer (not a section, separate component)
] as const;
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create LandingV3.tsx component
**Action**: CREATE
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

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
    </motion.div>
  );
}
```

**Why**:
- Establishes base structure following LandingV2 pattern
- Gradient background validates color system
- Test heading validates typography
- Section placeholders establish structure without rendering yet
- Footer import validates component reusability

**Gotchas**:
- Don't import Navigation yet (doesn't exist)
- Use `hidden` class for section placeholders so they don't render visually yet
- Ensure `from-v2-navy via-v2-navy to-v2-electric` for subtle gradient

---

### Task 2: Register route in App.tsx
**Action**: INJECT
**Location**: `client/src/App.tsx`
**Details**:

First, add import at top of file (after other page imports):
```typescript
import LandingV3 from "@/pages/LandingV3";
```

Then, inject route inside `<Switch>` component (around line 24, after `/landingv2` route):
```typescript
<Route path="/landingv2" component={LandingV2} />
<Route path="/landingv3" component={LandingV3} />
```

**Why**:
- Registers new route in Wouter routing system
- Follows existing pattern from other routes
- Placed after LandingV2 for logical ordering

**Gotchas**:
- Must be inside `<Switch>` component (lines 19-29)
- Don't modify the `/` route (line 20) - keep it as `LandingV3Enhanced`
- Import path must use `@/pages/` alias (already configured)

---

### Task 3: Verify color palette in tailwind.config.ts
**Action**: VERIFY (read-only)
**Location**: `tailwind.config.ts`
**Details**:

Confirm these colors exist (lines 64-70):
```typescript
"v2-navy": "#0A2463",
"v2-electric": "#3E92CC",
"v2-cyan": "#52D1DC",
"v2-white": "#FFFFFF",
"v2-off-white": "#F8F9FA",
"v2-charcoal": "#2D3142",
```

**Why**: Validation that color system is already configured (no changes needed)
**Gotchas**: If colors are missing, DO NOT modify tailwind.config.ts - report error instead

---

### Task 4: Test Inter font loading
**Action**: VERIFY
**Location**: `client/index.html` or `client/src/index.css`
**Details**:

Check for Inter font import (likely in index.html `<head>` or index.css `@import`).

If missing, add to `client/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

And ensure Tailwind config has `fontFamily` (likely already configured):
```typescript
fontFamily: {
  inter: ['Inter', 'sans-serif'],
}
```

**Why**: Validates typography system is ready
**Gotchas**: Inter might already be loaded; check first before adding

---

## 9. Testing Strategy

### Manual Visual Testing
No unit tests required for this static component. Testing is visual validation.

**Test Cases**:
1. **Route accessible**: Navigate to `http://localhost:5000/landingv3`
   - Expected: Page loads without 404

2. **Background gradient**: Inspect page background
   - Expected: Navy blue with subtle darker blue on right edge

3. **Typography**: Inspect heading
   - Expected: Large text (72px), white color, Inter font family

4. **Page transition**: Navigate from another page to /landingv3
   - Expected: Smooth fade-in animation (400ms)

5. **Footer present**: Scroll to bottom
   - Expected: Footer with gray background, contact info visible

6. **Section IDs**: Inspect DOM with DevTools
   - Expected: 10 section elements with correct IDs (hidden from view)

### Playwright Visual Validation
```typescript
// Navigate to new page
await mcp__playwright__browser_navigate({
  url: "http://localhost:5000/landingv3"
});

// Wait for page load
await mcp__playwright__browser_wait_for({ time: 1 });

// Take screenshot
await mcp__playwright__browser_take_screenshot({
  filename: "landingv3-setup-baseline.png"
});

// Check console for errors
const messages = await mcp__playwright__browser_console_messages({
  onlyErrors: true
});
// Expected: No error messages
```

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected output**: No TypeScript errors

### Level 2: Build
```bash
npm run build
```
**Expected output**:
- Client build succeeds
- Server build succeeds
- No errors in output

### Level 3: Dev Server
```bash
npm run dev
```
**Expected output**:
- Server starts on port 5000
- Navigate to http://localhost:5000/landingv3
- Page renders without errors

### Level 4: Visual Validation
1. Open http://localhost:5000/landingv3 in browser
2. Verify Navy gradient background visible
3. Verify test heading centered, large font, white text
4. Open DevTools Console - verify no errors
5. Open DevTools Elements - verify section IDs present
6. Scroll to bottom - verify Footer visible
7. Navigate from another page - verify smooth fade-in transition

### Level 5: Playwright Screenshot
Use Playwright MCP to capture visual baseline:
```bash
# After running npm run dev
# Use Playwright commands to take screenshot
```

---

## 11. Integration Points

### Route Registration
- [x] Route added to `client/src/App.tsx` in `<Switch>` block
- [x] Import statement added at top of App.tsx

### Component Dependencies
- [x] Footer component imported from `@/components/Footer`
- [x] Framer Motion imported from `framer-motion`

### No Configuration Changes
- No environment variables needed
- No database migrations needed
- No API routes needed

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Modify the `/` route - keep it as `LandingV3Enhanced`
- ❌ Import `Navigation` from `@/components/v3/Navigation` (doesn't exist yet)
- ❌ Add actual section content - only placeholders
- ❌ Skip section `id` attributes - they're required for anchor links
- ❌ Use complex animations or heavy components at this stage
- ❌ Add custom CSS files - use Tailwind utility classes only

### DO:
- ✅ Follow LandingV2.tsx pattern exactly
- ✅ Use Tailwind v2 color classes (`bg-v2-navy`, etc.)
- ✅ Keep component simple and focused on structure
- ✅ Ensure all sections have semantic `id` attributes
- ✅ Run validation gates after implementation
- ✅ Use Playwright for visual verification

---

## 13. Progressive Success

**Minimal Viable Implementation** (Start here):
1. Create empty LandingV3.tsx with test heading
2. Register route in App.tsx
3. Verify page loads without errors

**Then Validate**:
4. Run `npm run check` - ensure TypeScript passes
5. Run `npm run build` - ensure build succeeds
6. Visual check - gradient background + heading visible

**Then Verify Structure**:
7. Inspect DOM - all section IDs present
8. Footer appears at bottom
9. Page transition works when navigating to/from page

**No Enhancement Needed**: This is the base, keep it simple.

---

## Final Validation Checklist

Before marking complete:
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build passes (`npm run build`)
- [ ] Route `/landingv3` accessible in browser
- [ ] Page renders without console errors
- [ ] Navy → Electric Blue gradient background visible
- [ ] Test heading displays: Inter 72px, white, centered
- [ ] All 11 section placeholders in DOM with correct IDs
- [ ] Footer displays at bottom of page
- [ ] Page transition (fade-in) works smoothly
- [ ] Playwright screenshot captured for baseline
- [ ] Code follows existing patterns (LandingV2)
- [ ] No Navigation import (component doesn't exist yet)

---

## Confidence Score: 9.5/10

**Why high confidence?**
- Clear, simple task with well-defined scope
- Exact patterns available in LandingV2.tsx
- No complex logic or state management
- All dependencies already installed
- Color system already configured
- Validation gates are straightforward

**Why not 10/10?**
- Inter font import might need verification/addition (small uncertainty)
- First micro-task in sequence - setting precedent for others

**Missing context that would raise to 10/10:**
- Explicit confirmation Inter font is loaded (can verify during implementation)
