# Sablia Site Refactor - Implementation Plan

**Created**: 2026-02-06
**PRD**: `/PRD.md`
**Confidence**: 8/10 (well-scoped, mostly deletions and migrations, no new complex features)

---

## Executive Summary

Refactor sablia.io to reduce tech debt (~1,000 lines dead code, ~650KB unnecessary bundle), fix legal compliance (RGPD), add resilience (error boundaries), and prepare for future content pages. Four phases, ordered by priority and dependency.

---

## Phase Status

| Phase | Name | Tasks | Risk | Est. Effort |
|-------|------|-------|------|-------------|
| A | Critical Fixes & Compliance | 5 | Low | 1-2h |
| B | Dead Code & Dependency Cleanup | 8 | Low | 2-3h |
| C | Animation Migration & Performance | 6 | Medium | 3-4h |
| D | Content Pages & SEO Polish | 5 | Low | 2-3h |

**Total estimated**: 8-12h across sessions

---

## Phase A: Critical Fixes & Compliance

**Goal**: Fix legal compliance, crash protection, and crawlability. Zero risk of breaking anything.

### Tasks

- [x] **A1. Add RGPD consent checkbox to contact form**
  - File: `client/src/components/landing/ContactFormSection.tsx`
  - Add Zod field `rgpdConsent: z.literal(true)` to contactSchema
  - Add checkbox + label before submit button
  - Link to `/politique-confidentialite`
  - Validation: form cannot submit without checkbox checked

- [x] **A2. Create robots.txt**
  - File: `client/public/robots.txt`
  - Content: `User-agent: * / Allow: / / Sitemap: https://sablia.io/sitemap.xml`
  - Validation: `npm run build && ls dist/public/robots.txt`

- [x] **A3. Add error boundaries**
  - Create: `client/src/components/ErrorBoundary.tsx` (react-error-boundary or manual)
  - Wrap root `<App />` in `App.tsx` with top-level boundary
  - Wrap each `<Suspense>` fallback in Landing.tsx with section-level boundary
  - Fallback UI: "Une erreur est survenue. Veuillez rafraîchir la page."

- [x] **A4. Upgrade Suspense fallbacks to skeleton loaders**
  - File: `client/src/pages/Landing.tsx`
  - Replace `<div className="min-h-[400px]" />` with proper skeleton components
  - Use existing shadcn/ui Skeleton component from `ui/skeleton.tsx`

- [x] **A5. Update sitemap.xml lastmod dates**
  - File: `client/public/sitemap.xml`
  - Update all `<lastmod>` to `2026-02-06`
  - Validation: XML well-formed check

### Validation Gate
```bash
npm run build && npm run check
# Manual: verify robots.txt in dist/public/
# Manual: verify contact form requires checkbox
```

---

## Phase B: Dead Code & Dependency Cleanup

**Goal**: Remove all unused code and dependencies. ~1,000 lines removed, ~500KB+ saved.

### Tasks

- [x] **B1. Delete unused legacy components**
  - Delete: `client/src/components/Navbar.tsx`
  - Delete: `client/src/components/HeroSection.tsx`
  - Delete: `client/src/components/FaqSection.tsx`
  - Delete: `client/src/components/ProcessSection.tsx`
  - Delete: `client/src/components/ServicesSection.tsx`
  - Delete: `client/src/components/RoiBanner.tsx`
  - Delete: `client/src/components/RainbowText.tsx`
  - Delete: `client/src/components/AutomationExamplesSection.tsx`
  - **Before deleting**: Grep each filename to confirm zero imports outside Home.tsx
  - Validation: `npm run build` succeeds

- [x] **B2. Delete unused pages**
  - Delete: `client/src/pages/Home.tsx`
  - Delete: `client/src/pages/TestStackValue.tsx`
  - Remove `/home` route from `client/src/App.tsx`
  - Validation: `npm run build` succeeds

- [x] **B3. Remove unused authentication dependencies**
  - Run: `npm uninstall passport passport-local express-session memorystore @types/passport @types/passport-local @types/express-session`
  - Grep for any imports of these packages, clean up if found in server code
  - Validation: `npm run build` succeeds

- [x] **B4. Remove react-icons**
  - Run: `npm uninstall react-icons`
  - Grep for `react-icons` imports — replace any stragglers with lucide-react
  - Validation: `npm run build` succeeds

- [x] **B5. Audit and remove unused shadcn/ui components**
  - For each component in `client/src/components/ui/`:
    - Grep import across codebase
    - If zero imports outside ui/ itself → mark for deletion
  - Expected removals: chart, carousel, command, input-otp, calendar, drawer, resizable, menubar, context-menu, breadcrumb, sidebar (verify each)
  - Validation: `npm run build` succeeds after each batch deletion

- [x] **B6. Remove recharts if unused**
  - Check: Is `ui/chart.tsx` imported anywhere?
  - If not: `npm uninstall recharts` + delete `ui/chart.tsx`
  - Validation: `npm run build` succeeds

- [x] **B7. Remove embla-carousel if unused**
  - Check: Is `ui/carousel.tsx` imported anywhere?
  - If not: `npm uninstall embla-carousel-react` + delete `ui/carousel.tsx`
  - Validation: `npm run build` succeeds

- [x] **B8. Remove hidden section placeholders from Landing.tsx**
  - File: `client/src/pages/Landing.tsx`
  - Remove the `<div className="hidden">` block with empty anchor sections
  - Verify anchor navigation still works (sections have proper IDs)
  - Validation: `npm run build` succeeds

### Validation Gate
```bash
npm run build && npm run check
# Compare bundle size: before vs after (use rollup-plugin-visualizer)
# Target: >500KB reduction in node_modules
```

---

## Phase C: Animation Migration & Performance

**Goal**: Consolidate from 3 animation libraries to 1 (Framer Motion), improve load performance.

### Tasks

- [x] **C1. Migrate ThreeStepProcess.tsx from GSAP to Framer Motion**
  - File: `client/src/components/landing/ThreeStepProcess.tsx`
  - Replace GSAP ScrollTrigger timeline with Framer Motion `useInView` + `motion.div` variants
  - Preserve the visual behavior: elements animate in on scroll with staggered timing
  - Test: Visual comparison before/after with Playwright MCP

- [x] **C2. Migrate ProblemSection.tsx from GSAP to Framer Motion**
  - File: `client/src/components/landing/ProblemSection.tsx`
  - Replace GSAP scroll-triggered animations with Framer Motion `whileInView`
  - Test: Visual comparison before/after

- [x] **C3. Migrate ScrollReveal.tsx from GSAP to Framer Motion**
  - File: `client/src/components/animations/ScrollReveal.tsx`
  - Replace GSAP implementation with Framer Motion wrapper
  - Check all consumers of ScrollReveal still animate correctly
  - Test: Full landing page scroll-through with Playwright MCP

- [x] **C4. Remove GSAP dependency**
  - Only after C1-C3 are complete and verified
  - Run: `npm uninstall gsap`
  - Grep for any remaining gsap imports
  - Validation: `npm run build` succeeds

- [x] **C5. Lazy-load AnimatedParticles**
  - File: `client/src/pages/Landing.tsx` (or wherever AnimatedParticles is imported)
  - Wrap in `React.lazy()` + `<Suspense>`
  - Fallback: gradient background matching current design
  - Test: Page loads without particles briefly, then particles appear

- [x] **C6. Bundle analysis and performance audit**
  - Run Vite build with `rollup-plugin-visualizer` output
  - Run Lighthouse on dev server (`npm run dev`)
  - Document before/after metrics
  - Target: Initial JS <250KB gzipped, LCP <2.0s

### Validation Gate
```bash
npm run build && npm run check
# Visual: Playwright MCP screenshots of all animated sections
# Performance: Lighthouse score comparison (before Phase C vs after)
# Target: Lighthouse Performance >90
```

---

## Phase D: Content Pages & SEO Polish

**Goal**: Add /faq full page, prepare case studies structure, generate missing OG images, update docs.

### Tasks

- [x] **D1. Create /faq page**
  - Create: `client/src/pages/Faq.tsx`
  - Content: All 30+ questions from `docs/FAQ.md` organized by 8 categories
  - Use shadcn/ui Accordion component (already available)
  - Add route in `App.tsx`: `<Route path="/faq" component={Faq} />`
  - Add SEO metadata for /faq
  - Update landing FAQ section: add "Voir toutes les questions" link to /faq

- [x] **D2. Create /cas-clients placeholder page**
  - Create: `client/src/pages/CaseStudies.tsx`
  - Structure: Header + 2-3 placeholder case study cards
  - Each card: Client name, sector, challenge, results (before/after)
  - Populate with anonymized versions of existing testimonials
  - Add route in `App.tsx`
  - Add to navigation footer under "Ressources"

- [x] **D3. Generate missing OG images**
  - Create 1200x630px images for: tarifs, gap, roi, about, faq, cas-clients
  - Use consistent brand design (navy + cyan gradient, Sablia logo, page title)
  - Place in `client/public/`
  - Update `docs/meta-tags.json` references

- [x] **D4. Update documentation**
  - Update `docs/SITE_CONTENT.md` with new /faq and /cas-clients pages
  - Update `docs/content-index.json` with new routes
  - Update `client/public/sitemap.xml` with new pages
  - Update `docs/meta-tags.json` with new page metadata
  - Update all "last updated" dates

- [x] **D5. Final verification and cleanup**
  - Run full `npm run build && npm run check`
  - Visual validation of all pages via Playwright MCP
  - Verify all structured data with Google Rich Results Test
  - Delete any tmp/ artifacts
  - Update CLAUDE.md if architecture changed significantly

### Validation Gate
```bash
npm run build && npm run check
# Visual: All pages screenshotted via Playwright MCP
# SEO: Verify structured data schemas still valid
# Docs: All documentation files updated
# Performance: Final Lighthouse audit
```

---

## Verification Checklist (Final)

- [x] `npm run build` passes
- [x] `npm run check` passes (TypeScript)
- [x] All legacy components deleted (Navbar, old Hero, old FAQ, etc.)
- [x] All unused dependencies removed (passport, react-icons, gsap, etc.)
- [x] RGPD consent checkbox works on contact form
- [x] Error boundaries catch crashes gracefully
- [x] robots.txt accessible at /robots.txt
- [x] Bundle size reduced by >500KB
- [x] Lighthouse Performance >90
- [x] All 6+ structured data schemas still valid
- [x] /faq page renders all 30+ questions
- [x] /cas-clients page exists with placeholder content
- [x] OG images exist for all pages
- [x] Documentation (SITE_CONTENT.md, content-index.json, sitemap.xml) updated
- [x] Visual validation passed for all landing sections
- [x] No regressions in form submissions (n8n webhooks work)

---

## Execution

Run: `/execute sablia-site-refactor`
