# PRP 5.2: Performance & Accessibility Audit Complet

**Date**: 2025-10-27
**Confidence Score**: 9/10
**Prerequisites**: PRP 5.1 (Mobile Responsiveness Audit) completed

## 1. GOAL

Execute a comprehensive performance and accessibility audit of LandingV3 to achieve:

- **Lighthouse Scores**: >= 90 for Performance, Accessibility, Best Practices, SEO
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **WCAG 2.1 AA Compliance**: 100% coverage
- **Bundle Optimization**: JS < 300KB, CSS < 50KB (gzipped)
- **Real Device Testing**: Validation on actual iOS Safari and Android Chrome

## 2. CONTEXT

### Current State (from research)

**Bundle Sizes (CRITICAL ISSUE)**:
- ❌ JavaScript: 845.93 kB (gzip: 268.66 kB) - **182% over target**
- ❌ CSS: 104.17 kB (gzip: 16.91 kB) - **108% over target**
- ⚠️ Build warning: Chunks larger than 500 kB after minification

**Accessibility - Partial Implementation**:
- ✅ `prefers-reduced-motion` CSS media query exists in `index.css`
- ✅ Navigation component checks `prefers-reduced-motion` (line 38-41)
- ⚠️ Framer Motion claims automatic support (needs verification)
- ❓ No evidence of screen reader testing
- ❓ No evidence of keyboard navigation testing
- ❓ Color contrast ratios not verified

**Images**:
- ✅ All SVGs (optimal for logos/icons)
- ✅ No JPG/PNG requiring WebP conversion

**Animation Libraries (Heavy Dependencies)**:
- Framer Motion: 11.13.1
- GSAP: 3.13.0
- TSParticles: 2.12.2
- Multiple Radix UI components (potential tree-shaking opportunity)

### Why This Matters

1. **Performance = Conversion**: Every 100ms delay costs 1% conversion
2. **Accessibility = Legal Requirement**: WCAG 2.1 AA is legally required in many jurisdictions
3. **SEO Impact**: Lighthouse scores directly affect Google rankings
4. **User Experience**: 53% of mobile users abandon sites taking > 3s to load
5. **Professional Credibility**: Poor performance damages B2B trust

## 3. REQUIREMENTS

### 3.1 Performance Requirements

**Core Web Vitals (MUST PASS)**:
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

**Lighthouse Targets**:
- Performance Score: >= 90
- Best Practices Score: >= 90
- SEO Score: >= 90

**Bundle Size Targets**:
- JavaScript (gzipped): < 300 KB
- CSS (gzipped): < 50 KB
- Individual chunks: < 500 KB (avoid build warnings)

**Loading Performance**:
- Time to Interactive (TTI) < 3.5s
- First Contentful Paint (FCP) < 1.8s
- Speed Index < 3.4s

### 3.2 Accessibility Requirements (WCAG 2.1 AA)

**Visual Requirements**:
- [ ] Color contrast >= 4.5:1 for normal text (< 18pt)
- [ ] Color contrast >= 3:1 for large text (>= 18pt)
- [ ] Color contrast >= 3:1 for UI components and graphical objects
- [ ] Information not conveyed by color alone

**Keyboard Navigation**:
- [ ] All interactive elements accessible via Tab/Shift+Tab
- [ ] Visible focus indicators on all focusable elements
- [ ] Logical tab order following visual flow
- [ ] Skip links for navigation bypass
- [ ] No keyboard traps

**Screen Reader Compatibility**:
- [ ] All images have descriptive `alt` text
- [ ] Semantic HTML structure (header, nav, main, section, footer)
- [ ] ARIA labels for icon-only buttons
- [ ] Form labels properly associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Status updates announced (form submission success/error)

**Motion Preferences**:
- [ ] `prefers-reduced-motion: reduce` respected for ALL animations
- [ ] CSS animations paused/disabled when user prefers reduced motion
- [ ] Framer Motion animations respect preference (verify behavior)
- [ ] GSAP animations respect preference (implement check)
- [ ] TSParticles disabled or simplified when user prefers reduced motion

**Focus Management**:
- [ ] Modal focus trapped when open
- [ ] Focus returned after modal close
- [ ] Focus moved to error messages on validation fail

### 3.3 Best Practices Requirements

**Security**:
- [ ] HTTPS enforced (production)
- [ ] No mixed content warnings
- [ ] CSP headers configured (production)

**SEO**:
- [ ] Meta description on all pages (< 160 chars)
- [ ] Title tags descriptive and unique
- [ ] Open Graph tags for social sharing
- [ ] Canonical URLs set
- [ ] robots.txt configured
- [ ] sitemap.xml available

**Browser Compatibility**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari iOS (latest)
- [ ] Edge (latest)

## 4. STEP-BY-STEP IMPLEMENTATION TASKS

### Phase 1: Audit Current State (Research)

**Task 1: Run Lighthouse Audit (Mobile)**
```bash
# Using Chrome DevTools or CLI
npm run build
npm start
# Then: Open Chrome DevTools > Lighthouse > Mobile > Analyze
```
- Capture baseline scores: Performance, Accessibility, Best Practices, SEO
- Document Core Web Vitals: LCP, FID, CLS
- Identify all failing checks
- Take screenshots of issues

**Task 2: Run Lighthouse Audit (Desktop)**
- Same process, desktop configuration
- Compare scores vs mobile

**Task 3: Analyze Bundle Composition**
```bash
# Install bundle analyzer
npm install --save-dev vite-plugin-visualizer

# Add to vite.config.ts:
# import { visualizer } from 'vite-plugin-visualizer';
# plugins: [visualizer({ open: true, gzipSize: true })]

npm run build
```
- Identify largest dependencies
- Find duplicate dependencies
- Locate unused code

**Task 4: Color Contrast Audit**
- Use browser extension: WAVE, axe DevTools, or Lighthouse
- Check all text against backgrounds
- Check buttons and interactive elements
- Document all violations with locations

**Task 5: Keyboard Navigation Manual Test**
```
Test flow:
1. Unplug mouse
2. Navigate entire LandingV3 with Tab/Shift+Tab only
3. Verify all CTAs reachable
4. Verify focus indicators visible
5. Verify logical tab order
6. Test form completion with keyboard only
7. Test modal/accordion interactions
```
- Document any blocked elements
- Document missing focus indicators
- Document illogical tab order

**Task 6: Screen Reader Test**
```
macOS: VoiceOver (Cmd+F5)
Windows: NVDA (free)
iOS: VoiceOver (Settings > Accessibility)
Android: TalkBack (Settings > Accessibility)
```
- Navigate entire page with screen reader only
- Verify all content announced
- Verify images have alt text
- Verify forms are labeled
- Verify buttons have descriptive labels
- Document all issues

**Task 7: Motion Preference Test**
```
macOS: System Settings > Accessibility > Display > Reduce motion
Windows: Settings > Ease of Access > Display > Show animations
```
- Enable "Reduce motion" preference
- Reload LandingV3
- Verify ALL animations disabled or simplified
- Check Framer Motion, GSAP, TSParticles, CSS animations
- Document any animations still running

### Phase 2: Performance Optimization (Implement)

**Task 8: Code Splitting Strategy**

Current issue: Single 845KB bundle

Solution: Split by route and component
```typescript
// In App.tsx or router setup
import { lazy, Suspense } from 'react';

// Lazy load page components
const LandingV3 = lazy(() => import('./pages/LandingV3'));

// In routes:
<Suspense fallback={<LoadingSpinner />}>
  <LandingV3 />
</Suspense>
```

Actions:
- Split large components (> 50KB) into separate chunks
- Lazy load below-the-fold sections (Pricing, Calculator, Contact, FAQ)
- Implement dynamic imports with `React.lazy()`
- Add loading states for lazy components

**Task 9: Dependency Optimization**

Analyze and reduce:
```bash
# Check which Radix UI components are actually used
grep -r "@radix-ui" client/src --include="*.tsx"

# Verify tree-shaking working
npm run build -- --mode production --minify
```

Actions:
- Remove unused Radix UI imports
- Consider replacing TSParticles with CSS-only alternative
- Evaluate if GSAP can be replaced with Framer Motion for consistency
- Use `import { specific } from 'library'` not `import * as`

**Task 10: Image Optimization**

Current: All SVGs (good)

Additional optimizations:
- Implement `loading="lazy"` for below-the-fold images
- Add `width` and `height` attributes to prevent CLS
- Consider `<link rel="preload">` for hero section logo

**Task 11: Font Loading Optimization**

Check current font loading strategy:
```typescript
// In index.html or layout
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="font" href="/fonts/..." crossorigin>
```

Actions:
- Implement `font-display: swap` or `optional`
- Preload critical fonts only
- Consider self-hosting fonts
- Subset fonts to reduce size

**Task 12: CSS Optimization**

Current: 104KB CSS (exceeds 50KB target)

Actions:
- Verify Tailwind purge working: Check `tailwind.config.ts` content paths
- Remove unused Tailwind utilities
- Consider extracting critical CSS
- Minimize CSS with `cssnano`

### Phase 3: Accessibility Fixes (Implement)

**Task 13: Fix Color Contrast Issues**

Process for each violation:
1. Identify element with contrast < 4.5:1 (or 3:1 for large text)
2. Use contrast checker tool to find compliant color
3. Update color in component
4. Re-test with WAVE or axe DevTools
5. Verify visual design still acceptable

Common fixes:
- Lighten text on dark backgrounds
- Darken backgrounds behind light text
- Increase border thickness/opacity for UI elements

**Task 14: Add Missing alt Text**

Search all images:
```bash
grep -r "<img" client/src --include="*.tsx"
grep -r "Image" client/src --include="*.tsx" # Framer Motion Image
```

Actions:
- Add descriptive `alt=""` for decorative images
- Add meaningful `alt="description"` for informative images
- Add `aria-label` to icon-only buttons
- Verify all logos have alt text in LogosCloud

**Task 15: Implement Keyboard Navigation Fixes**

Common fixes:
- Add `tabIndex={0}` to custom interactive elements
- Add visible focus styles: `focus:ring-2 focus:ring-v2-cyan focus:outline-none`
- Ensure modals trap focus (use `react-focus-lock` or Radix Dialog)
- Add skip link for navigation: `<a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>`
- Fix tab order: Remove negative `tabIndex`, reorder DOM if needed

**Task 16: Enhance prefers-reduced-motion Support**

Current partial implementation in:
- `client/src/index.css` (line 178)
- `client/src/components/v3/Navigation.tsx` (line 38-41)

Expand to all components:

**Step 1: Create utility hook**
```typescript
// client/src/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

**Step 2: Implement in Framer Motion animations**
```typescript
// In each component using motion
import { useReducedMotion } from '@/hooks/useReducedMotion';

const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
>
```

**Step 3: Implement in GSAP animations (ThreeStepProcess.tsx)**
```typescript
// In ThreeStepProcess.tsx useEffect
if (prefersReducedMotion.current) {
  // Set final state immediately, no animation
  gsap.set(cards, { opacity: 1, y: 0 });
  gsap.set(cardBorders, {
    boxShadow: "0 0 30px rgba(82, 209, 220, 0.6)",
    borderColor: "rgba(82, 209, 220, 0.8)"
  });
  return;
}
// ... existing animation code
```

**Step 4: Implement in CSS animations (TestimonialsSection.tsx)**
```css
/* In index.css, extend existing rule */
@media (prefers-reduced-motion: reduce) {
  .animate-scroll-testimonials {
    animation: none !important;
  }
}
```

**Step 5: Conditional TSParticles rendering**
```typescript
// In LandingV3Enhanced.tsx or wherever TSParticles used
const prefersReducedMotion = useReducedMotion();

{!prefersReducedMotion && (
  <Particles ... />
)}
```

**Task 17: Add Screen Reader Announcements**

For dynamic content (form submission, errors):
```typescript
// Create live region component
// client/src/components/LiveRegion.tsx
export function LiveRegion({ message, role = 'status' }: { message: string; role?: 'status' | 'alert' }) {
  return (
    <div role={role} aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}

// Use in forms
const [statusMessage, setStatusMessage] = useState('');

<LiveRegion message={statusMessage} />

// On submit success:
setStatusMessage('Formulaire envoyé avec succès');

// On submit error:
setStatusMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
```

### Phase 4: SEO & Best Practices (Implement)

**Task 18: Add Meta Tags**

In `index.html` or layout:
```html
<head>
  <title>Sablia - Automatisation d'entreprise avec l'IA</title>
  <meta name="description" content="Transformez vos processus métier avec l'automatisation IA. Économisez jusqu'à 70% du temps sur vos tâches répétitives.">

  <!-- Open Graph -->
  <meta property="og:title" content="Sablia - Automatisation d'entreprise avec l'IA">
  <meta property="og:description" content="Transformez vos processus métier avec l'automatisation IA.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://sablia.fr">
  <meta property="og:image" content="https://sablia.fr/og-image.jpg">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Sablia - Automatisation d'entreprise avec l'IA">
  <meta name="twitter:description" content="Transformez vos processus métier avec l'automatisation IA.">

  <!-- Canonical -->
  <link rel="canonical" href="https://sablia.fr">
</head>
```

**Task 19: Structured Data (JSON-LD)**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sablia",
  "url": "https://sablia.fr",
  "description": "Automatisation d'entreprise avec l'IA",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contact@sablia.fr"
  }
}
</script>
```

### Phase 5: Validation & Testing (Verify)

**Task 20: Re-run Lighthouse Audits**
- Run mobile audit
- Run desktop audit
- Verify all scores >= 90
- Verify Core Web Vitals pass
- Take comparison screenshots vs baseline

**Task 21: Real Device Testing**

Minimum devices:
- iPhone (iOS Safari)
- Android phone (Chrome)
- iPad (Safari)

Test checklist per device:
- [ ] Page loads in < 3s on 3G
- [ ] All animations smooth (no jank)
- [ ] Touch targets work
- [ ] Forms submit successfully
- [ ] No horizontal scroll
- [ ] CTA buttons accessible

**Task 22: Automated Accessibility Test**
```bash
# Install axe-core CLI
npm install --save-dev @axe-core/cli

# Run automated test
npx axe http://localhost:5000 --exit
```
- Fix any new violations found

**Task 23: Cross-Browser Testing**

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Verify:
- [ ] Visual consistency
- [ ] Animations work
- [ ] Forms function
- [ ] No console errors

**Task 24: TypeScript & Build Validation**
```bash
npm run check  # TypeScript validation
npm run build  # Production build
```
- Must pass with zero new errors
- Must complete without warnings

## 5. VALIDATION GATES

All validation gates MUST pass before marking PRP complete.

### Level 1: Automated Tests
```bash
npm run check   # MUST: Zero new TypeScript errors
npm run build   # MUST: Build succeeds, no new warnings
```

### Level 2: Lighthouse Scores (Mobile)
- Performance: >= 90
- Accessibility: >= 90
- Best Practices: >= 90
- SEO: >= 90

### Level 3: Core Web Vitals
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Level 4: Bundle Sizes
- JavaScript (gzipped): < 300 KB
- CSS (gzipped): < 50 KB
- No chunks > 500 KB

### Level 5: WCAG 2.1 AA Compliance
- Automated axe test: Zero violations
- Manual keyboard test: All elements accessible
- Manual screen reader test: All content announced
- Color contrast: All text passes 4.5:1 ratio

### Level 6: Motion Preference
- Manual test with "Reduce motion" enabled
- ALL animations disabled or simplified

## 6. COMMON PITFALLS & GOTCHAS

### Performance Pitfalls

1. **Framer Motion Performance**
   - ⚠️ `animate` props re-render on every frame
   - ✅ Use `transform` and `opacity` for 60fps
   - ✅ Avoid animating `width`, `height`, `top`, `left`

2. **Lazy Loading Too Aggressive**
   - ⚠️ Don't lazy load above-the-fold content
   - ✅ Only lazy load below-the-fold sections

3. **Tree-Shaking Not Working**
   - ⚠️ `import * as React from 'react'` prevents tree-shaking
   - ✅ `import { useState, useEffect } from 'react'`

4. **CSS Not Purging**
   - ⚠️ Tailwind not seeing all template files
   - ✅ Verify `content: ['./src/**/*.{ts,tsx}']` in tailwind.config.ts

### Accessibility Pitfalls

1. **Framer Motion prefers-reduced-motion**
   - ⚠️ Claim of "automatic support" is misleading
   - ✅ Must explicitly check and conditionally animate
   - ✅ Use `useReducedMotion` hook for all animations

2. **ARIA Labels Overuse**
   - ⚠️ Don't use `aria-label` when visible label exists
   - ✅ Use semantic HTML first, ARIA only when needed

3. **Color Contrast on Gradients**
   - ⚠️ Gradient backgrounds can fail contrast on some parts
   - ✅ Test contrast at multiple points on gradient
   - ✅ Add semi-transparent overlay if needed

4. **Focus Indicators Removed**
   - ⚠️ `outline: none` without custom focus style
   - ✅ Always replace with visible focus indicator

5. **Screen Reader Text Hidden Incorrectly**
   - ⚠️ `display: none` hides from screen readers too
   - ✅ Use `.sr-only` utility class (position: absolute, clip)

### SEO Pitfalls

1. **Client-Side Routing Issues**
   - ⚠️ SPA with no SSR = poor SEO
   - ✅ Ensure meta tags in static HTML
   - ✅ Consider SSR/SSG for production

2. **Missing Alt Text Accepted**
   - ⚠️ Empty `alt=""` is valid only for decorative images
   - ✅ Be explicit about decorative vs informative

## 7. SUCCESS CRITERIA

**Lighthouse Scores (Mobile & Desktop)**:
- ✅ Performance >= 90
- ✅ Accessibility >= 90
- ✅ Best Practices >= 90
- ✅ SEO >= 90

**Core Web Vitals**:
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1

**Bundle Sizes**:
- ✅ JS < 300 KB (gzipped)
- ✅ CSS < 50 KB (gzipped)

**WCAG 2.1 AA**:
- ✅ Zero axe violations
- ✅ All interactive elements keyboard accessible
- ✅ All content screen reader compatible
- ✅ All text meets contrast requirements

**Motion Preference**:
- ✅ All animations respect `prefers-reduced-motion`

**Cross-Browser**:
- ✅ Works in Chrome, Firefox, Safari, Edge

**Real Device**:
- ✅ Tested on iOS Safari
- ✅ Tested on Android Chrome

## 8. DOCUMENTATION REQUIREMENTS

Create/update the following files:

1. **`PERFORMANCE-AUDIT-RESULTS.md`**
   - Lighthouse scores before/after (with screenshots)
   - Core Web Vitals before/after
   - Bundle size comparison
   - List of optimizations made

2. **`ACCESSIBILITY-AUDIT-RESULTS.md`**
   - WCAG violations found and fixed
   - Color contrast fixes with before/after values
   - Keyboard navigation issues resolved
   - Screen reader testing notes
   - Motion preference implementation details

3. **`PRP-5.2-EXECUTION-SUMMARY.md`**
   - Executive summary
   - All changes made with file paths and line numbers
   - Validation results
   - Key achievements and metrics
   - Screenshots of Lighthouse improvements

## 9. DEPENDENCIES & PREREQUISITES

**Required Tools**:
- Chrome DevTools (Lighthouse)
- Browser extensions: WAVE or axe DevTools
- Screen reader: VoiceOver (macOS/iOS) or NVDA (Windows)
- Bundle analyzer: `vite-plugin-visualizer`

**Required Knowledge**:
- Core Web Vitals concepts
- WCAG 2.1 AA guidelines
- Webpack/Vite bundling
- React performance optimization
- Screen reader usage basics

**Prerequisites**:
- PRP 5.1 (Mobile Responsiveness) completed
- Dev server running on port 5000
- Production build working

## 10. ESTIMATED EFFORT

- **Research Phase**: 2-3 hours (audits, testing, documentation)
- **Performance Optimization**: 3-4 hours (code splitting, dependency optimization)
- **Accessibility Fixes**: 2-3 hours (contrast, keyboard, screen readers, motion)
- **SEO & Best Practices**: 1 hour (meta tags, structured data)
- **Validation & Testing**: 2 hours (re-audits, real device testing)

**Total**: 10-13 hours

**Can be split into sprints**:
- Sprint 1: Audits + Bundle optimization (Performance focus)
- Sprint 2: Accessibility fixes (WCAG compliance)
- Sprint 3: Final validation + documentation

## 11. RISKS & MITIGATION

**Risk 1: Bundle size reduction breaks functionality**
- Mitigation: Test thoroughly after each dependency removal
- Mitigation: Use feature detection for code splitting

**Risk 2: Accessibility fixes change visual design**
- Mitigation: Work closely with design requirements
- Mitigation: Prioritize contrast fixes that maintain brand colors

**Risk 3: Motion reduction makes site feel broken**
- Mitigation: Implement instant transitions (duration: 0) not removal
- Mitigation: Keep layout changes, just skip animations

**Risk 4: Performance regression on older devices**
- Mitigation: Test on mid-range Android phone (not just high-end)
- Mitigation: Use Chrome DevTools CPU throttling

## 12. REFERENCES & RESOURCES

**Performance**:
- Web Vitals: https://web.dev/vitals/
- Lighthouse Docs: https://developer.chrome.com/docs/lighthouse/
- React Performance: https://react.dev/learn/render-and-commit
- Vite Code Splitting: https://vitejs.dev/guide/features#code-splitting

**Accessibility**:
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa
- Inclusive Components: https://inclusive-components.design/
- A11y Project Checklist: https://www.a11yproject.com/checklist/
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- prefers-reduced-motion: https://web.dev/prefers-reduced-motion/

**Tools**:
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/extension/
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci

**Testing**:
- VoiceOver Guide: https://webaim.org/articles/voiceover/
- NVDA Guide: https://webaim.org/articles/nvda/
- Keyboard Testing: https://webaim.org/articles/keyboard/

## 13. NOTES FOR AI EXECUTION

When executing this PRP with `/execute-prp`:

1. **Start with audits** - Establish baseline before changes
2. **Prioritize performance** - Bundle size is the biggest issue (845KB → < 300KB)
3. **Don't skip manual testing** - Accessibility requires human judgment
4. **Use TodoWrite frequently** - 24 tasks require careful tracking
5. **Document as you go** - Take screenshots, note line numbers
6. **Validate incrementally** - Run `npm run build` after major changes
7. **Ask for help** - If bundle optimization unclear, ask user for priorities

**Key Files to Modify** (predicted):
- `vite.config.ts` (code splitting, visualizer plugin)
- `client/src/App.tsx` (lazy loading)
- `client/src/hooks/useReducedMotion.ts` (new file)
- `client/src/components/v3/*.tsx` (motion preferences)
- `client/src/index.css` (accessibility fixes)
- `index.html` (meta tags, structured data)
- `tailwind.config.ts` (purge verification)
- `client/src/components/LiveRegion.tsx` (new file)

**Expected Outcome**:
- Lighthouse scores jump from ~60-70 to >= 90
- Bundle size reduced by ~60% (845KB → ~300KB)
- Zero WCAG violations
- Professional B2B experience maintained

---

**PRP Created**: 2025-10-27
**Confidence Score**: 9/10
**Ready for Execution**: ✅ Yes
