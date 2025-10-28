# INITIAL - PRP 5.1 - Responsive Mobile Complet

## FEATURE

Conduct a comprehensive mobile responsiveness audit and fix any issues across all sections.

**Requirements**:
- Test on multiple device sizes: iPhone SE (375px), iPhone 14 (390px), iPad (768px), Android (360px)
- Ensure touch targets >= 48x48px (Apple HIG, Google Material)
- Typography scales correctly at all breakpoints
- Navigation burger menu functional on mobile
- All animations adapted for mobile (simplified if needed)
- Test on real devices (not just browser DevTools)
- Validate horizontal scroll doesn't occur
- Check image loading and lazy loading

**Visual Deliverable**: Site that works flawlessly on all mobile devices with proper touch interactions, readable text, and smooth performance.

**Technical Requirements**:
- No new components, only fixes to existing components
- Use browser DevTools + real device testing
- Document all issues found and fixed
- Take screenshots on each device for validation

## EXAMPLES

**Responsive Testing Checklist**:

### **iPhone SE (375px width)**
- [ ] Hero section: headline readable, CTAs stack vertically
- [ ] Navigation: hamburger menu visible, logo sized correctly
- [ ] Testimonials: carousel controls accessible
- [ ] Logos: 2-column grid
- [ ] Problem/Solution: cards stack vertically
- [ ] Timeline: vertical layout, connector line hidden or vertical
- [ ] Pricing: columns stack (Formations first)
- [ ] Calculator: form and results stack vertically
- [ ] Contact form: all inputs full width, textarea adequate height
- [ ] FAQ: single column, questions expand properly

### **iPad (768px width)**
- [ ] Most sections should use 2-column layouts
- [ ] Navigation: full menu visible (no burger)
- [ ] Logos: 3-column grid
- [ ] Pricing: 3 columns or 2-1 layout
- [ ] Touch targets still 48x48px minimum

### **Common Mobile Issues to Fix**:

**Typography**:
```typescript
// Desktop → Tablet → Mobile
text-[72px] lg:text-5xl md:text-4xl text-3xl  // Hero headline
text-5xl lg:text-4xl md:text-3xl text-2xl     // Section titles
text-xl lg:text-lg md:text-base               // Body text
```

**Touch Targets** (minimum 48x48px):
```typescript
// Button sizing
className="px-6 py-4"  // Adequate padding for touch

// Navigation items
className="p-4"  // Mobile menu items

// Accordion questions
className="p-6"  // FAQ questions
```

**Horizontal Scroll Check**:
```typescript
// Ensure no element exceeds viewport
className="max-w-full overflow-x-hidden"

// Container padding
className="px-6"  // Prevents content touching edges
```

**Mobile-Specific Adjustments**:
```typescript
// Hide on mobile
className="hidden md:block"

// Show only on mobile
className="block md:hidden"

// Stack on mobile
className="flex flex-col md:flex-row"

// Reduce gap on mobile
className="gap-4 md:gap-8"
```

## DOCUMENTATION

**Responsive Breakpoints** (Tailwind):
- `sm:` 640px (mobile landscape)
- `md:` 768px (tablet portrait)
- `lg:` 1024px (tablet landscape / small desktop)
- `xl:` 1280px (desktop)
- `2xl:` 1536px (large desktop)

**Touch Target Sizes**:
- Apple HIG: 44x44pt minimum (48x48px)
- Google Material: 48x48dp minimum
- WCAG 2.1: 44x44px minimum

**Mobile Testing Tools**:
- Chrome DevTools: Device toolbar (Cmd+Shift+M)
- Firefox: Responsive Design Mode
- Safari: Develop → Enter Responsive Design Mode
- Real devices: iPhone, iPad, Android phone

**Playwright Mobile Testing**:
```javascript
// iPhone SE
mcp__playwright__browser_resize({ width: 375, height: 667 })

// iPhone 14
mcp__playwright__browser_resize({ width: 390, height: 844 })

// iPad
mcp__playwright__browser_resize({ width: 768, height: 1024 })

// Android
mcp__playwright__browser_resize({ width: 360, height: 640 })
```

**Common Mobile Issues**:
1. Text too small to read
2. Buttons too small to tap
3. Horizontal scroll appears
4. Images don't scale
5. Forms difficult to fill
6. Navigation menu doesn't work
7. Animations cause jank on mobile
8. Content overlaps or clips

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

**Mobile-First Approach**:
- Write styles for mobile first, then add desktop overrides
- Example: `text-3xl lg:text-5xl` (mobile 3xl, desktop 5xl)
- Easier to progressively enhance than to strip down

**Performance on Mobile**:
- Reduce particle count (already handled in AnimatedParticles)
- Simplify animations on mobile (use `prefers-reduced-motion`)
- Lazy load images below fold
- Avoid large background images

**Burger Menu**:
- Must be functional (toggle state)
- Smooth animation (slide in/fade in)
- Close on link click
- Close on outside click (optional)
- Accessible with keyboard

**Forms on Mobile**:
- Input type="email" triggers email keyboard
- Input type="tel" triggers phone keyboard
- Input type="number" triggers number keyboard
- Adequate spacing between fields (easier tapping)

**Keyboard Behavior**:
- Mobile keyboards can obscure form fields
- Ensure viewport doesn't zoom on input focus (font-size >= 16px)
- Scroll to active input if needed

**Testing Process**:
1. **DevTools First**: Test all breakpoints in browser
2. **Real Device**: Test on at least 2 physical devices
3. **Network**: Test on slower connections (3G simulation)
4. **Screenshots**: Take screenshots for documentation
5. **Fix Issues**: Iterate until all issues resolved

**Gotchas**:
- iOS Safari has different behavior than Chrome mobile
- Touch events !== mouse events (test hover states)
- Fixed positioning can be tricky on mobile (especially with keyboard)
- Viewport units (vh, vw) can behave unexpectedly

**Known Mobile Issues to Avoid**:
- 100vh on iOS includes address bar (use min-h-screen instead)
- Hover states don't work on touch (use :active or onClick)
- Fixed backgrounds don't work on iOS (use scroll)
- Fonts < 16px cause zoom on iOS input focus

**Validation Commands**:
```bash
npm run dev  # Test with DevTools mobile emulation
```

**Visual Validation** (Playwright for all devices):
```javascript
// Test on multiple devices
const devices = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPad", width: 768, height: 1024 },
  { name: "Android", width: 360, height: 640 }
];

for (const device of devices) {
  await mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" });
  await mcp__playwright__browser_resize({ width: device.width, height: device.height });

  // Scroll through entire page
  await mcp__playwright__browser_evaluate({
    function: "() => window.scrollTo(0, document.body.scrollHeight)"
  });
  await mcp__playwright__browser_wait_for({ time: 2 });

  // Take screenshot
  await mcp__playwright__browser_take_screenshot({
    filename: `prp-5.1-${device.name.toLowerCase()}.png`
  });
}
```

**Manual Testing Checklist** (Per Device):
- [ ] No horizontal scroll at any point
- [ ] All text is readable (minimum 14px)
- [ ] All buttons/links are tappable (48x48px minimum)
- [ ] Navigation menu works (burger → open → close)
- [ ] All sections render correctly
- [ ] Images load and scale properly
- [ ] Forms are easy to fill (appropriate keyboards)
- [ ] Animations are smooth (or simplified)
- [ ] No content clipping or overlap
- [ ] Footer is accessible and readable

**Section-Specific Mobile Checks**:

**Hero**:
- Headline 36-48px mobile (readable)
- CTAs stack vertically with gap
- Full viewport height works

**Testimonials**:
- Carousel controls accessible (arrows not too close to edges)
- Dots large enough to tap
- Quote text readable

**Logos**:
- 2 columns on mobile (not 4)
- Logos sized appropriately (not too small)

**Problem/Solution**:
- Cards stack vertically
- Icon + text readable
- No horizontal overflow

**Process Timeline**:
- Vertical layout on mobile
- Steps stack with adequate spacing

**Pricing**:
- Columns stack vertically
- Formations column first (order-first)
- All pricing readable

**Calculator**:
- Form and results stack
- Inputs full width
- Results numbers large enough

**Contact Form**:
- All inputs full width
- Textarea adequate height (6 rows)
- Submit button full width

**FAQ**:
- Single column
- Questions expand properly
- Answer text readable

**Success Criteria**:
- ✅ Tested on iPhone SE, iPhone 14, iPad, Android
- ✅ No horizontal scroll on any device
- ✅ Touch targets >= 48x48px throughout
- ✅ Typography scales correctly at all breakpoints
- ✅ Navigation burger menu functional
- ✅ All animations adapted for mobile (smooth or simplified)
- ✅ Tested on real devices (not just DevTools)
- ✅ Forms easy to fill with mobile keyboards
- ✅ All sections render correctly on mobile
- ✅ Images load and scale properly
- ✅ No performance issues (60fps maintained)
- ✅ Screenshots taken for documentation
- ✅ All mobile issues documented and fixed

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 5.1 - Responsive Mobile Complet
- **Prochaine étape**: PRP 5.2 - Performance & Accessibility Audit
