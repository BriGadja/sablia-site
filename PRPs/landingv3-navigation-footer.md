# PRP: LandingV3 - Navigation & Footer (PRP 0.4)

## Philosophy: Context is King

This PRP creates a professional sticky navigation component with scroll-triggered state changes and integrates it with the existing Footer component in LandingV3.

---

## 1. Goal and Why

**What are we building?**
A sticky navigation bar that changes appearance on scroll, features responsive mobile menu, and includes the existing footer component.

**Why are we building it?**
- Complete the foundation layer (Phase 0) of LandingV3
- Provide navigation to future sections (hero, testimonials, pricing, etc.)
- Establish consistent page structure with header and footer
- Enable smooth anchor navigation once sections are implemented
- Complete PRP 0.4 of the LandingV3 refonte sequence

---

## 2. What (Requirements)

### User-Visible Behavior

**Desktop Navigation** (≥768px):
- Fixed sticky header at top of viewport
- **Transparent state** (at page top):
  - Fully transparent background
  - White text for logo and menu items
  - Subtle presence, doesn't obstruct hero content
- **Opaque state** (after scrolling 100px):
  - Navy background with 95% opacity (`bg-v2-navy/95`)
  - Backdrop blur for glassmorphism effect
  - Shadow appears for depth
  - Smooth 300ms transition between states
- **Content**:
  - Logo "Sablia" on left (text-based, bold, clickable)
  - 5 menu items horizontally centered:
    1. Problématique (#problem)
    2. Solution (#solution)
    3. Processus (#process)
    4. Tarifs (#pricing)
    5. FAQ (#faq)
  - CTA button on right: "Diagnostic Gratuit" (cyan background)
- **Interactions**:
  - Menu items: white text, hover → cyan color
  - Logo: clickable, navigates to `/landingv3`
  - CTA button: cyan background, hover → electric blue
  - Smooth color transitions (200ms)

**Mobile Navigation** (<768px):
- **Bar**:
  - Same sticky behavior as desktop
  - Logo on left
  - Hamburger icon on right (Menu from lucide-react)
  - CTA button hidden on mobile (space constraint)
- **Mobile Menu**:
  - Dropdown panel below nav bar
  - Triggered by hamburger icon click
  - Animates in with Framer Motion (fade + slide down)
  - Navy background with backdrop blur
  - Stacked menu items vertically
  - CTA button included at bottom of mobile menu
  - Close icon (X from lucide-react) replaces hamburger when open
  - Clicking any menu item closes the menu

**Footer**:
- Already integrated at bottom of page (no changes needed)
- 3-column layout: Company info, Contact, Legal links
- Dark background (#0f172a)
- Copyright year dynamically generated

### Functional Requirements

**Navigation Component**:
- ✅ Create new component: `client/src/components/v3/Navigation.tsx`
- ✅ Use Framer Motion for scroll detection and animations
- ✅ Use lucide-react icons (Menu, X)
- ✅ Responsive: desktop (horizontal) + mobile (hamburger)
- ✅ Scroll threshold: 100px (matches INITIAL spec)
- ✅ z-index: 40 (above content z-10, below cursor z-50)

**LandingV3 Integration**:
- ✅ Import and render Navigation inside content div (z-10 layer)
- ✅ Navigation placed BEFORE main content
- ✅ Footer already integrated (no changes needed)
- ✅ Main content should have `pt-20` to account for nav height

### Non-Functional Requirements

- **Performance**: Optimized scroll listener, GPU-accelerated transitions
- **Accessibility**: Keyboard navigation, aria-labels, focus states
- **Responsive**: Mobile-first approach, tested on 375px to 1920px
- **Professional**: No emojis, B2B-appropriate styling

---

## 3. Success Criteria

The implementation is complete when:
- ✅ Navigation component created at `client/src/components/v3/Navigation.tsx`
- ✅ Sticky positioning works (fixed at top during scroll)
- ✅ Transparent when at page top, opaque after 100px scroll
- ✅ Smooth transition between states (300ms duration)
- ✅ Logo, 5 menu items, CTA button visible on desktop (≥768px)
- ✅ Hamburger menu works on mobile (<768px)
- ✅ Mobile menu opens/closes with animation
- ✅ Mobile menu closes when clicking menu items
- ✅ All anchor links functional (even though sections are placeholders)
- ✅ Navigation integrated into LandingV3.tsx
- ✅ Z-index correct: above content (z-10), below cursor (z-50)
- ✅ TypeScript compilation passes
- ✅ Build succeeds
- ✅ No console errors

---

## 4. Documentation & References

### Official Documentation

- **Framer Motion useScroll**: https://www.framer.com/motion/use-scroll/
  - Track scroll position and direction
  - Version: 11.13.1 (already in project)

- **Lucide React Icons**: https://lucide.dev/
  - Open source icon library
  - Version: 0.453.0 (already installed)
  - Icons needed: `Menu` (hamburger), `X` (close)

- **Tailwind CSS Backdrop Filter**: https://tailwindcss.com/docs/backdrop-blur
  - `backdrop-blur-md` = blur(12px)
  - Creates glassmorphism effect

### Relevant Code Examples

- **`client/src/components/v2/Navigation.tsx`** (lines 1-97) - **REFERENCE PATTERN**:
  - Scroll detection pattern (lines 9-15)
  - Fixed positioning with scroll-based background (lines 18-23)
  - cn utility for className composition (line 4)
  - Desktop/mobile responsive structure
  - **Differences for v3**:
    - v2 uses z-50 (v3 should use z-40)
    - v2 uses Wouter Link (v3 uses anchor links for sections)
    - v2 has inline SVG hamburger (v3 uses lucide-react)
    - v2 scrolled threshold 50px (v3 uses 100px)
    - v2 has white background when scrolled (v3 has navy)

- **`client/src/components/Footer.tsx`** (lines 1-42) - **ALREADY INTEGRATED**:
  - Simple standalone component
  - No modifications needed
  - Already imported in LandingV3.tsx

- **INITIAL example** (lines 34-112) - **IMPLEMENTATION TEMPLATE**:
  - Complete navigation structure
  - Framer Motion mobile menu animation
  - State management for scroll + mobile menu

### Z-Index Hierarchy (Updated)

```
z-0:   AnimatedParticles (background fullscreen)
z-10:  Content layer (main, sections, footer)
z-40:  Navigation (NEW - above content, below cursor)
z-50:  CustomCursor (top layer, always visible)
```

---

## 5. Codebase Context

### Current Structure

```
client/src/pages/LandingV3.tsx (current):
├── motion.div (root)
│   ├── AnimatedParticles (z-0)
│   ├── div.relative.z-10 (content layer)
│   │   ├── main (test heading)
│   │   └── Footer ← ALREADY HERE
│   └── CustomCursor (z-50)
```

### Desired Structure (After PRP 0.4)

```
client/src/pages/LandingV3.tsx (after):
├── motion.div (root)
│   ├── AnimatedParticles (z-0)
│   ├── div.relative.z-10 (content layer)
│   │   ├── Navigation ← NEW (z-40 via fixed positioning)
│   │   ├── main.pt-20 (accounts for nav height)
│   │   └── Footer
│   └── CustomCursor (z-50)

NEW FILE:
client/src/components/v3/Navigation.tsx
```

### Key Files to Create/Modify

**CREATE**:
- `client/src/components/v3/Navigation.tsx` (new file, ~150 lines)

**MODIFY**:
- `client/src/pages/LandingV3.tsx` (add 2 imports, 1 component render, add pt-20 to main)

---

## 6. Known Gotchas & Pitfalls

### Navigation Z-Index

- ❌ **Using z-50** - would conflict with CustomCursor
- ✅ **Using z-40** - sits between content (z-10) and cursor (z-50)
- Navigation uses `fixed` positioning, so z-index must be specified in className

### Scroll Detection

- ❌ **Checking scrollY on every pixel change** - performance issue
- ✅ **Simple boolean check (scrollY > 100)** - efficient
- Use `useState` + `useEffect` pattern from v2 Navigation
- Remember to cleanup event listener in useEffect return

### Mobile Menu State

- ❌ **Forgetting to close menu when clicking links** - poor UX
- ✅ **Add onClick handler to close menu** - menu closes after navigation
- ❌ **Menu state persists when resizing to desktop** - menu can get stuck open
- ✅ **Consider adding window resize listener** - optional enhancement

### Backdrop Blur Browser Support

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback: Navy background still visible even if blur doesn't work
- No need for prefixes with Tailwind

### Link Behavior

- Section anchors (#problem, #solution) work even if sections don't exist yet
- Browser will try to scroll to element with that ID
- Currently sections are hidden placeholders, so scrolling won't be visible
- This is fine - navigation is prepared for future sections

### Main Content Padding

- Navigation is 80px tall (h-20 = 5rem = 80px)
- Main content needs `pt-20` to not be hidden behind fixed nav
- Without this, hero content would be partially obscured

---

## 7. Data Models & Schemas

**N/A** - Pure UI component with no data models

---

## 8. Implementation Tasks

### Task 1: Create v3/Navigation.tsx Component File

**Action**: CREATE
**Location**: `client/src/components/v3/Navigation.tsx`
**Details**:

```typescript
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Problématique", href: "#problem" },
    { label: "Solution", href: "#solution" },
    { label: "Processus", href: "#process" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-v2-navy/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/landingv3" className="text-2xl font-bold text-v2-white hover:text-v2-cyan transition-colors">
            Sablia
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-v2-white hover:text-v2-cyan transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button (desktop only) */}
          <a
            href="#contact"
            className="hidden md:block bg-v2-cyan text-v2-navy px-6 py-3 rounded-lg font-semibold hover:bg-v2-electric transition-colors duration-200"
          >
            Diagnostic Gratuit
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-v2-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-v2-navy/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="block text-v2-white hover:text-v2-cyan transition-colors duration-200 py-2"
              >
                {item.label}
              </a>
            ))}
            {/* Mobile CTA */}
            <a
              href="#contact"
              onClick={closeMobileMenu}
              className="block bg-v2-cyan text-v2-navy px-6 py-3 rounded-lg font-semibold hover:bg-v2-electric transition-colors duration-200 text-center"
            >
              Diagnostic Gratuit
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
```

**Why**: Creates the complete navigation component with all required functionality
**Gotchas**:
- Must use `motion.nav` for Framer Motion (even though no animation used yet)
- z-40 in className (not z-50)
- Scroll threshold 100px (not 50px like v2)
- `closeMobileMenu` function ensures menu closes on link clicks
- Menu icon size 24px (easily tappable on mobile)

### Task 2: Create v3 Directory (if needed)

**Action**: CREATE (if not exists)
**Location**: `client/src/components/v3/` (directory)
**Details**: Create directory to house v3 components
**Why**: Organizational structure for LandingV3 components
**Gotchas**: Check if directory exists first

### Task 3: Import Navigation in LandingV3

**Action**: INJECT
**Location**: `client/src/pages/LandingV3.tsx` (line 4, after CustomCursor import)
**Details**:
```typescript
import Navigation from "@/components/v3/Navigation";
```
**Why**: Make Navigation component available in LandingV3
**Gotchas**: Use path alias `@/components` not relative path

### Task 4: Render Navigation in Content Layer

**Action**: INJECT
**Location**: `client/src/pages/LandingV3.tsx` (after line 19, before main tag)
**Details**:
```typescript
      {/* Content layer - must have relative z-10 to appear above particles */}
      <div className="relative z-10">
        {/* Navigation - fixed positioning with z-40 */}
        <Navigation />

        <main className="flex items-center justify-center min-h-screen pt-20">
```
**Why**:
- Navigation renders inside content layer but uses fixed positioning
- pt-20 on main accounts for 80px nav height
**Gotchas**:
- Navigation must be BEFORE main, not inside it
- Don't forget pt-20 on main (prevents content being hidden)

---

## 9. Testing Strategy

### Manual Testing

**Desktop Testing** (Chrome, ≥1024px):
1. Navigate to http://localhost:5000/landingv3
2. **At page top**:
   - Navigation should be transparent
   - White text for logo and menu items
   - CTA button visible with cyan background
3. **Scroll down 150px**:
   - Navigation should become opaque (navy background)
   - Backdrop blur visible
   - Shadow appears
   - Transition is smooth (300ms)
4. **Hover interactions**:
   - Menu items: white → cyan on hover
   - Logo: white → cyan on hover
   - CTA button: cyan → electric blue on hover
5. **Click logo**: Should navigate to /landingv3
6. **Click menu items**: No visible effect (sections are hidden placeholders)

**Mobile Testing** (DevTools, 375px width):
1. Resize to mobile (< 768px)
2. **Initial state**:
   - Logo visible on left
   - Hamburger menu icon (☰) visible on right
   - CTA button hidden
   - Menu items hidden
3. **Click hamburger**:
   - Menu opens with animation (fade + slide down)
   - Hamburger icon changes to X
   - All 5 menu items visible
   - CTA button visible at bottom
4. **Click menu item**:
   - Menu closes
   - Icon changes back to hamburger
5. **Click CTA in mobile menu**:
   - Menu closes
6. **Scroll behavior**:
   - Same transparent → opaque transition as desktop

### Visual Validation (Playwright)

See validation gates section for automated screenshot tests.

---

## 10. Validation Gates

### Level 1: Syntax & Style

```bash
npm run check
```
**Expected**: TypeScript compilation passes (pre-existing errors acceptable, no NEW errors)

### Level 2: Build

```bash
npm run build
```
**Expected**: Production build succeeds, bundle size increase minimal (~10-15KB for Navigation)

### Level 3: Dev Server

```bash
npm run dev
```
Navigate to http://localhost:5000/landingv3

### Level 4: Visual Validation (Playwright)

```javascript
// Start at top of page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Take screenshot - transparent nav
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-transparent.png" })

// Scroll down to trigger opaque state
mcp__playwright__browser_evaluate({ function: "() => window.scrollTo(0, 300)" })
mcp__playwright__browser_wait_for({ time: 1 })

// Take screenshot - opaque nav
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-opaque.png" })

// Resize to mobile
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-mobile.png" })

// Open mobile menu (click hamburger)
mcp__playwright__browser_snapshot()  // Get ref for hamburger button
mcp__playwright__browser_click({ element: "Toggle menu button", ref: "[ref from snapshot]" })
mcp__playwright__browser_wait_for({ time: 0.5 })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-mobile-open.png" })

// Check console for errors
mcp__playwright__browser_console_messages({ onlyErrors: true })
```

### Level 5: Manual Testing Checklist

- [ ] Navigation is sticky (stays at top when scrolling)
- [ ] Starts transparent at page top
- [ ] Becomes opaque after scrolling 100px
- [ ] Smooth transition between states (no jank)
- [ ] Logo clickable, navigates to /landingv3
- [ ] All menu items have hover effect (white → cyan)
- [ ] CTA button has hover effect (cyan → electric blue)
- [ ] Desktop: all items visible (logo, 5 menu, CTA)
- [ ] Mobile: hamburger menu appears below 768px
- [ ] Mobile: menu opens/closes with animation
- [ ] Mobile: X icon replaces hamburger when open
- [ ] Mobile: clicking menu item closes menu
- [ ] Footer still visible at bottom
- [ ] No console errors
- [ ] Test heading still visible (not hidden by nav)
- [ ] Navigation above particles, below cursor (z-index correct)

---

## 11. Integration Points

### Configuration Changes

**N/A** - No environment variables needed

### Route Registration

**N/A** - No API routes

### Component Dependencies

- `lucide-react`: Menu, X icons (already installed v0.453.0)
- `framer-motion`: motion.nav, motion.div (already installed v11.13.1)
- Tailwind classes: v2 color palette, backdrop-blur

---

## 12. Critical Anti-Patterns

### DO NOT:

- ❌ **Use position: sticky** - use `position: fixed` for better control
- ❌ **Use z-50 or higher** - would overlap CustomCursor (z-50)
- ❌ **Hardcode menu items in JSX** - use array.map() for maintainability
- ❌ **Forget to cleanup scroll listener** - memory leak
- ❌ **Use inline SVG for icons** - lucide-react provides better icons
- ❌ **Add emojis to navigation or CTA** - unprofessional for B2B
- ❌ **Make navigation opaque immediately** - breaks visual hierarchy
- ❌ **Forget pt-20 on main** - content will be hidden behind nav
- ❌ **Place Navigation outside content div (z-10)** - z-index won't work correctly

### DO:

- ✅ **Use fixed positioning with z-40**
- ✅ **Clean up event listeners in useEffect**
- ✅ **Use menuItems array with .map()**
- ✅ **Close mobile menu on link clicks**
- ✅ **Test on actual mobile devices**
- ✅ **Keep CTA text professional** ("Diagnostic Gratuit", no emoji)
- ✅ **Use 100px scroll threshold** (matches spec)
- ✅ **Add pt-20 to main** (accounts for nav height)
- ✅ **Place Navigation inside content div** (z-10 layer context)

---

## 13. Progressive Success

### Minimal Viable Implementation (Step 1)

1. Create `client/src/components/v3/Navigation.tsx`
2. Implement basic structure (no animations yet)
3. Import and render in LandingV3.tsx
4. Add pt-20 to main

**Validation**: Component renders, no console errors

### Enhanced Implementation (Step 2)

5. Add scroll detection state
6. Add transparent → opaque transition
7. Add mobile menu state + toggle
8. Add Framer Motion animation to mobile menu

**Validation**: All states work, transitions smooth

### Final Implementation (Step 3)

9. Test responsive behavior
10. Test all hover states
11. Verify z-index hierarchy
12. Take Playwright screenshots
13. Write execution log

**Validation**: All success criteria met, PRP 0.4 complete

---

## Final Validation Checklist

Before marking PRP 0.4 complete:

- [ ] Navigation component created at `client/src/components/v3/Navigation.tsx`
- [ ] Navigation imported and rendered in LandingV3.tsx
- [ ] Main content has `pt-20` padding
- [ ] Sticky behavior works (fixed positioning)
- [ ] Transparent → opaque transition on scroll
- [ ] Desktop: logo + 5 menu items + CTA visible
- [ ] Mobile: hamburger menu functional
- [ ] Mobile menu animates in/out
- [ ] Mobile menu closes on link clicks
- [ ] Hover states work on desktop
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors
- [ ] Z-index correct (above content, below cursor)
- [ ] Footer still integrated and visible
- [ ] Playwright screenshots captured
- [ ] Execution log written to avancement_refonte.md

---

## Confidence Score: 9/10

**Why 9/10?**
- ✅ Clear specification with complete code example in INITIAL
- ✅ Reference component (v2/Navigation) provides proven pattern
- ✅ Lucide-react and Framer Motion already installed
- ✅ Footer already integrated (no work needed)
- ✅ Z-index hierarchy well-documented
- ✅ Mobile menu pattern is standard React
- ✅ Comprehensive testing strategy

**Why not 10/10?**
- Mobile menu UX requires manual testing (can't be fully automated)
- Scroll transition smoothness varies by browser/device
- Need to verify z-index doesn't conflict with future components

**Mitigation**:
- Detailed manual testing checklist provided
- Playwright validation for visual states
- Z-index hierarchy documented for future reference

This PRP provides complete context for successful one-pass implementation of Navigation & Footer.
