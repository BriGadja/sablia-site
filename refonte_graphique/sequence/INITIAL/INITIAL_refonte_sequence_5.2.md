# INITIAL - PRP 5.2 - Performance & Accessibility Audit

## FEATURE

Conduct comprehensive performance and accessibility audits to ensure the site meets professional standards.

**Requirements**:
- Lighthouse score >= 90 for all metrics (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals validated: LCP < 2.5s, FID < 100ms, CLS < 0.1
- WCAG 2.1 AA compliance (contrast >= 4.5:1, keyboard nav, ARIA labels)
- `prefers-reduced-motion` tested and working
- Bundle size check: JS < 300KB, CSS < 50KB
- Images optimized: WebP format + lazy loading
- Document all findings and fixes in a report

**Visual Deliverable**: Lighthouse report showing all scores >= 90, list of accessibility fixes applied, performance metrics validated.

**Technical Requirements**:
- Run Lighthouse audits (Chrome DevTools)
- Test with screen reader (NVDA, VoiceOver, or JAWS)
- Validate color contrast with tools
- Check bundle sizes with build output
- Optimize images and assets

## EXAMPLES

**Lighthouse Audit Process**:
```bash
# 1. Build production version
npm run build

# 2. Start production server
npm run start

# 3. Open Chrome DevTools → Lighthouse tab
# 4. Select: Performance, Accessibility, Best Practices, SEO
# 5. Device: Mobile and Desktop
# 6. Run audit
# 7. Review scores and suggestions
```

**Target Lighthouse Scores**:
- Performance: >= 90 (green)
- Accessibility: >= 90 (green)
- Best Practices: >= 90 (green)
- SEO: >= 90 (green)

**Core Web Vitals**:
```typescript
// Largest Contentful Paint (LCP)
// Target: < 2.5 seconds
// Measures: Loading performance

// First Input Delay (FID)
// Target: < 100 milliseconds
// Measures: Interactivity

// Cumulative Layout Shift (CLS)
// Target: < 0.1
// Measures: Visual stability
```

## DOCUMENTATION

**Performance Checklist**:

### **Loading Performance**:
- [ ] Images optimized (WebP, compressed, sized correctly)
- [ ] Images lazy loaded (below fold)
- [ ] Fonts preloaded or system fonts used
- [ ] Critical CSS inlined (if needed)
- [ ] JavaScript code split (Vite handles this)
- [ ] No render-blocking resources
- [ ] Serve static assets with cache headers

### **Runtime Performance**:
- [ ] Animations use GPU (transform, opacity only)
- [ ] No layout thrashing (forced reflows)
- [ ] React components optimized (memo if needed)
- [ ] No memory leaks (cleanup useEffect)
- [ ] Particle count reduced on mobile

### **Bundle Size**:
```bash
# Check after build
npm run build

# Output shows:
# dist/assets/*.js - Should be < 300KB total
# dist/assets/*.css - Should be < 50KB total
```

**Lighthouse Performance Issues (Common)**:
1. Images not optimized
2. Render-blocking resources
3. Unused JavaScript
4. Large DOM size
5. No text compression
6. No caching policy

**Accessibility Checklist**:

### **Color Contrast** (WCAG AA):
- [ ] Body text: >= 4.5:1 contrast ratio
- [ ] Large text (18px+): >= 3:1 contrast ratio
- [ ] UI components: >= 3:1 contrast ratio
- [ ] White on Navy (#FFFFFF on #0A2463): 13.9:1 ✓
- [ ] Cyan on Navy (#52D1DC on #0A2463): 8.2:1 ✓

**Color Contrast Tools**:
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Inspect → Color picker shows contrast ratio
- axe DevTools extension: Automated contrast checking

### **Keyboard Navigation**:
- [ ] All interactive elements focusable with Tab
- [ ] Focus order logical (top to bottom, left to right)
- [ ] Focus indicators visible (outline or custom style)
- [ ] No keyboard traps (can Tab out of all elements)
- [ ] Skip link to main content (optional but recommended)
- [ ] Burger menu accessible with keyboard
- [ ] Accordion questions accessible with Enter/Space

### **ARIA Labels & Semantics**:
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Images have alt text (or aria-label if decorative)
- [ ] Buttons have descriptive labels
- [ ] Form inputs have associated labels
- [ ] Navigation has role="navigation"
- [ ] Main content has role="main"
- [ ] Links have descriptive text (not "click here")

### **Screen Reader Testing**:
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Navigation announced correctly
- [ ] Headings announced with levels
- [ ] Buttons/links announced with role
- [ ] Form labels associated with inputs
- [ ] Error messages announced
- [ ] Dynamic content updates announced (aria-live)

**Lighthouse Accessibility Issues (Common)**:
1. Missing alt text on images
2. Low color contrast
3. Buttons missing accessible name
4. Form inputs not labeled
5. Heading levels skipped
6. Links not descriptive

### **Motion Accessibility**:
```typescript
// Test prefers-reduced-motion
// Chrome DevTools → Rendering → Emulate CSS media feature

// Components that respect prefers-reduced-motion:
// - AnimatedParticles (already implemented)
// - CustomCursor (already implemented)
// - ScrollReveal (should check)
// - Framer Motion animations (add conditionally)

// Example implementation:
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable animations if user prefers
const animationVariants = prefersReducedMotion
  ? { initial: {}, animate: {} }  // No animation
  : { initial: { opacity: 0 }, animate: { opacity: 1 } };
```

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

**Performance Optimization Strategies**:

### **Image Optimization**:
```bash
# Convert to WebP
# Use online tools or CLI: cwebp image.png -o image.webp

# Responsive images
<img
  src="logo.webp"
  srcset="logo-small.webp 400w, logo-large.webp 800w"
  sizes="(max-width: 600px) 400px, 800px"
  alt="Sablia logo"
  loading="lazy"
/>
```

### **Code Splitting** (Vite handles automatically):
```typescript
// Dynamic imports for large components (if needed)
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

### **Font Loading**:
```css
/* Preload critical fonts */
<link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossorigin />

/* Or use font-display: swap */
@font-face {
  font-family: 'Inter';
  font-display: swap; /* Shows fallback until font loads */
}
```

**Accessibility Quick Wins**:
1. Add alt text to all images
2. Ensure focus indicators visible
3. Test keyboard navigation
4. Check color contrast
5. Add ARIA labels where needed
6. Ensure proper heading hierarchy

**SEO Basics** (For 90+ SEO score):
- [ ] Meta title unique and descriptive
- [ ] Meta description compelling (150-160 chars)
- [ ] h1 present and descriptive
- [ ] Images have alt text
- [ ] Links are crawlable (no JavaScript-only navigation)
- [ ] Robots.txt allows indexing
- [ ] Sitemap.xml present (optional)

**Validation Commands**:
```bash
# Build for production
npm run build

# Start production server
npm run start

# Check bundle sizes
ls -lh dist/assets/

# Run Lighthouse (Chrome DevTools)
# Or use CLI:
npx lighthouse http://localhost:5000/landingv3 --view
```

**Automated Accessibility Testing**:
```bash
# Install axe-core CLI (optional)
npm install -g @axe-core/cli

# Run audit
axe http://localhost:5000/landingv3
```

**Performance Budget**:
- Total JS: < 300KB (gzipped)
- Total CSS: < 50KB (gzipped)
- Total Images: < 1MB (with lazy loading)
- First Paint: < 1.5s
- Time to Interactive: < 3.5s

**Gotchas**:
- Lighthouse scores vary between runs (aim for consistent 90+)
- Mobile scores typically lower than desktop (mobile target is primary)
- Accessibility issues often missed by automated tools (manual testing crucial)
- Core Web Vitals measured on real users (Chrome User Experience Report)

**Common Performance Fixes**:
1. Compress images (WebP, AVIF)
2. Remove unused CSS/JS
3. Enable text compression (gzip/brotli) on server
4. Add caching headers
5. Defer non-critical JavaScript
6. Reduce third-party scripts

**Common Accessibility Fixes**:
1. Add missing alt text
2. Improve color contrast (use darker/lighter shades)
3. Add focus indicators (outline or custom)
4. Fix heading hierarchy (no skipped levels)
5. Associate labels with form inputs
6. Add ARIA labels to icon buttons

**Manual Testing Checklist**:

### **Performance**:
- [ ] Lighthouse Performance score >= 90 (mobile)
- [ ] Lighthouse Performance score >= 90 (desktop)
- [ ] LCP < 2.5s (largest content paint)
- [ ] FID < 100ms (first input delay)
- [ ] CLS < 0.1 (cumulative layout shift)
- [ ] JavaScript bundle < 300KB
- [ ] CSS bundle < 50KB
- [ ] Images optimized (WebP, lazy loading)
- [ ] No render-blocking resources
- [ ] 60fps during animations

### **Accessibility**:
- [ ] Lighthouse Accessibility score >= 90
- [ ] Color contrast >= 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces all content correctly
- [ ] ARIA labels present where needed
- [ ] Heading hierarchy correct (h1 → h2 → h3)
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] `prefers-reduced-motion` respected

### **Best Practices**:
- [ ] Lighthouse Best Practices score >= 90
- [ ] No console errors
- [ ] HTTPS enabled (production)
- [ ] No mixed content warnings
- [ ] Proper error handling

### **SEO**:
- [ ] Lighthouse SEO score >= 90
- [ ] Meta title and description present
- [ ] h1 present and descriptive
- [ ] Images have alt text
- [ ] Links crawlable

**Success Criteria**:
- ✅ Lighthouse scores >= 90 for all metrics (Performance, Accessibility, Best Practices, SEO)
- ✅ Core Web Vitals validated: LCP < 2.5s, FID < 100ms, CLS < 0.1
- ✅ WCAG 2.1 AA compliance: contrast >= 4.5:1, keyboard nav, ARIA labels
- ✅ Color contrast checked for all text/UI elements
- ✅ Keyboard navigation tested and functional
- ✅ Screen reader tested (NVDA or VoiceOver)
- ✅ `prefers-reduced-motion` tested and working
- ✅ Bundle size optimized: JS < 300KB, CSS < 50KB
- ✅ Images optimized: WebP format + lazy loading
- ✅ Report documenting all findings and fixes
- ✅ No console errors in production build
- ✅ 60fps maintained during animations

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 5.2 - Performance & Accessibility Audit
- **Prochaine étape**: Refonte LandingV3 terminée !
