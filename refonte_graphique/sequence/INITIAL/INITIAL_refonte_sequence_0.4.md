# INITIAL - PRP 0.4 - Navigation & Footer

## FEATURE

Create a professional sticky navigation bar and integrate the existing footer component.

**Navigation Requirements**:
- Sticky header that remains at top during scroll
- Becomes opaque/solid background when scrolled past hero section
- Sablia logo on left side (text logo or SVG)
- 5-6 navigation menu items horizontally centered
- Primary CTA button "Diagnostic Gratuit" always visible on right
- Responsive hamburger menu for mobile/tablet
- Smooth transitions between states (transparent → opaque)
- z-index above content but below cursor

**Footer Requirements**:
- Reuse existing `<Footer />` component from `client/src/components/Footer.tsx`
- No modifications needed to Footer component
- Should be last element on page

**Visual Deliverable**: Complete navigation with sticky behavior, scroll-triggered opacity change, functional mobile menu, and footer at bottom - all working with particles and custom cursor.

**Technical Requirements**:
- Component path: `client/src/components/v3/Navigation.tsx`
- Use Framer Motion for scroll-triggered animations
- Use Tailwind classes for styling
- Mobile menu with hamburger icon (using lucide-react icons)
- Footer: Direct import from existing component

## EXAMPLES

**Sticky Navigation Pattern with Scroll State**:
```typescript
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
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
          <a href="/landingv3" className="text-2xl font-bold text-v2-white">
            Sablia
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#problem" className="text-v2-white hover:text-v2-cyan transition-colors">
              Problématique
            </a>
            <a href="#solution" className="text-v2-white hover:text-v2-cyan transition-colors">
              Solution
            </a>
            <a href="#pricing" className="text-v2-white hover:text-v2-cyan transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="text-v2-white hover:text-v2-cyan transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="hidden md:block bg-v2-cyan text-v2-navy px-6 py-3 rounded-lg font-semibold hover:bg-v2-electric transition-colors"
          >
            Diagnostic Gratuit
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-v2-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-v2-navy/95 backdrop-blur-md rounded-lg mt-2 p-4"
          >
            {/* Mobile menu items */}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
```

**Footer Integration Pattern**:
```typescript
// In LandingV3.tsx
import Footer from "@/components/Footer"; // Existing component

export default function LandingV3() {
  return (
    <motion.div className="min-h-screen">
      {/* ... particles, cursor, navigation, main content ... */}
      <Footer />
    </motion.div>
  );
}
```

**Reference Existing Navigation**: Check `client/src/components/v2/Navigation.tsx` for inspiration (but create new v3 version).

## DOCUMENTATION

**Framer Motion Scroll Hooks**:
- https://www.framer.com/motion/use-scroll/
- `useScroll()` for scroll position tracking
- `useTransform()` for value interpolation

**Sticky Positioning**:
```css
position: fixed;
top: 0;
left: 0;
right: 0;
z-index: 40; /* Above content (z-10) but below cursor (z-50) */
```

**Backdrop Blur** (for glassmorphism effect when scrolled):
```css
backdrop-blur-md  /* Tailwind class for backdrop-filter: blur(12px) */
bg-v2-navy/95     /* Navy background with 95% opacity */
```

**Menu Items** (5-6 suggested):
1. Problématique (#problem)
2. Solution (#solution)
3. Processus (#process)
4. Tarifs (#pricing)
5. FAQ (#faq)
6. Contact (#contact) - or as CTA button

**Lucide React Icons**:
- https://lucide.dev/
- Already installed in project
- Use `<Menu />` for hamburger, `<X />` for close

**CTA Button Styling**:
- Background: `bg-v2-cyan`
- Text: `text-v2-navy` (high contrast)
- Hover: `hover:bg-v2-electric` (lighter blue)
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`

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

**Z-Index Layering**:
```
z-0   // AnimatedParticles
z-10  // Main content (sections)
z-40  // Navigation (above content, below cursor)
z-50  // CustomCursor
```

**Scroll Behavior**:
- Navigation starts transparent when at top of page
- After scrolling 100px, becomes opaque with backdrop blur
- Transition should be smooth (300ms duration)
- Shadow appears when opaque: `shadow-lg`

**Mobile Menu**:
- Hidden by default on mobile
- Toggles on hamburger icon click
- Animates in with Framer Motion (slide down + fade in)
- Full-width dropdown below nav bar
- Close icon (`<X />`) replaces hamburger when open
- Click outside should close menu (optional enhancement)

**Responsive Breakpoints**:
- Mobile: < 768px (hamburger menu)
- Desktop: >= 768px (horizontal menu)
- Use Tailwind `md:` prefix for desktop-only styles

**CTA Button**:
- "Diagnostic Gratuit" = Free Diagnostic/Assessment
- Links to `#contact` section (anchor link)
- Should have high visual prominence (Cyan background)
- Always visible (not hidden on scroll)
- NEVER add emoji to CTA (professional B2B guideline)

**Performance**:
- Scroll listener should be debounced (use simple boolean check, not complex calculations)
- Backdrop blur is GPU-accelerated
- Transitions use transform/opacity only (GPU-accelerated)

**Accessibility**:
- Navigation should be keyboard accessible (Tab navigation)
- Mobile menu toggle should have aria-label
- Links should have focus states
- Sufficient color contrast (white text on navy = 13.9:1, exceeds WCAG AAA)

**Footer**:
- No modifications needed to existing Footer component
- Just import and place at end of page
- Should work with existing styling

**Gotchas**:
- Don't use `position: sticky` - use `position: fixed` for better control
- Ensure navigation doesn't overlap hero content at page top (hero should have `pt-20` to account for nav height)
- Mobile menu should close when clicking on a link (add onClick handler)
- Test on actual mobile devices - hamburger icon should be easily tappable (48x48px minimum)

**Known Issues to Avoid**:
- If navigation "jumps", check for conflicting z-index values
- If scroll detection is laggy, ensure scroll listener is optimized
- If backdrop blur doesn't work, check browser support (works in modern browsers)
- If mobile menu doesn't close, add state management for link clicks

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Take screenshot at top of page (transparent nav)
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-transparent.png" })

// Scroll down to trigger opaque nav
mcp__playwright__browser_evaluate({
  function: "() => window.scrollTo(0, 300)"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-opaque.png" })

// Resize to mobile to test hamburger menu
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-0.4-nav-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Navigation is sticky (stays at top when scrolling)
- [ ] Starts transparent at page top
- [ ] Becomes opaque after scrolling 100px
- [ ] All menu items link to correct sections
- [ ] CTA button links to contact section
- [ ] Hover states work on desktop
- [ ] Mobile: hamburger icon appears below 768px
- [ ] Mobile: menu opens/closes on icon click
- [ ] Mobile: menu items are tappable
- [ ] Footer appears at bottom of page
- [ ] No console errors
- [ ] Navigation above content, below cursor

**Success Criteria**:
- ✅ Navigation sticky at top with fixed positioning
- ✅ Transparent when at page top, opaque when scrolled
- ✅ Smooth transition between states (300ms)
- ✅ Logo, 5-6 menu items, CTA button visible on desktop
- ✅ Hamburger menu functional on mobile
- ✅ All links navigate to correct sections
- ✅ CTA "Diagnostic Gratuit" always visible
- ✅ Footer integrated at bottom
- ✅ Z-index correct (above content, below cursor)
- ✅ Responsive across devices
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 0.4 - Navigation & Footer
- **Prochaine étape**: PRP 1.1 - HeroSection
