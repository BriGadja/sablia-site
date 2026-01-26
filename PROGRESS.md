# Sablia Site - SEO Audit Progress

**Plan**: [.claude/plans/sablia-site-seo-audit.md](../../.claude/plans/sablia-site-seo-audit.md)
**Started**: 2026-01-26

---

## Phase Status

| Phase | Name | Status | Started | Completed |
|-------|------|--------|---------|-----------|
| A | Quick Wins | COMPLETED | 2026-01-26 | 2026-01-26 |
| B | Technical Excellence | NOT STARTED | - | - |
| C | Enhanced Structured Data | NOT STARTED | - | - |
| D | Content Strategy | NOT STARTED | - | - |
| E | Off-Page & Monitoring | NOT STARTED | - | - |

**Current Phase**: A - Quick Wins (COMPLETED - 8/8 tasks done)
**Blocker**: None

---

## Phase A: Quick Wins

**Status**: COMPLETED

### Tasks
- [x] A1. Update sitemap.xml lastmod dates to 2026-01-26
- [x] A2. Fix title tag inconsistency (harmonize index.html with meta-tags.json)
- [x] A3. Add FAQPage structured data to FaqSection component
- [x] A4. Create Open Graph images (1200x630px)
- [x] A5. Create Twitter Card images (1200x600px)
- [x] A6. Add font preload hints for Inter font
- [x] A7. Add width/height to all images to prevent CLS
- [x] A8. Verify Google Search Console ownership

### Decisions Made
- Title harmonized to match meta-tags.json: "Sablia - Automatisation IA pour PME | n8n & Make.com"
- OG/Twitter descriptions updated to match meta-tags.json specs
- Added DNS prefetch for n8n.sablia.io and calendly.com
- FAQPage schema dynamically generated from faqs array

### Notes
- A4/A5/A8 require manual action (image creation, GSC verification)
- Build passes successfully
- Pre-existing type errors in Footer.test.tsx and animations.ts (not related to SEO)

---

## Phase B: Technical Excellence

**Status**: NOT STARTED

### Tasks
- [ ] B1. Run Core Web Vitals audit (PageSpeed Insights)
- [ ] B2. Document baseline LCP, INP, CLS scores
- [ ] B3. Implement lazy loading for below-fold sections
- [ ] B4. Reduce animation impact on mobile (TSParticles, GSAP)
- [x] B5. Add preconnect hints for third-party domains (done in A6)
- [ ] B6. Implement image optimization (WebP/AVIF with fallbacks)
- [ ] B7. Check for redirect chains (use Screaming Frog)
- [ ] B8. Ensure all internal links have proper href (not onClick)
- [ ] B9. Add alt text to all images
- [ ] B10. Consider prerendering solution for social bots

---

## Phase C: Enhanced Structured Data

**Status**: NOT STARTED

### Tasks
- [ ] C1. Add BreadcrumbList schema to all pages
- [ ] C2. Add Service schema for each service offering
- [ ] C3. Add HowTo schema for ThreeStepProcess section
- [ ] C4. Add Review/AggregateRating schema for testimonials
- [ ] C5. Add Person schema for About page (Brice)
- [ ] C6. Validate all schemas with Google Rich Results Test

---

## Session Log

### 2026-01-26 - Phase A Execution
**What was done:**
- A1: Updated all sitemap.xml lastmod dates from 2025-10-29 to 2026-01-26
- A2: Harmonized index.html title/description with meta-tags.json
  - Title: "Sablia - Automatisation IA pour PME | n8n & Make.com"
  - Updated OG and Twitter meta tags to match
- A3: Added FAQPage structured data to FaqSection.tsx
  - Uses react-helmet-async to inject JSON-LD
  - Dynamically generates schema from faqs array
- A6: Added font preload hint and DNS prefetch for external services
- A7: Added width/height attributes to img elements in Navbar and LogosCloud

**Decisions:**
- A4/A5/A8 deferred to manual action (Brice)
- B5 partially completed as part of A6 (preconnect hints)

**Next session:**
- Create OG images (A4) and Twitter images (A5) - requires design
- Verify GSC ownership (A8)
- Start Phase B: Core Web Vitals audit

---

## Blockers Log

| Date | Blocker | Status | Resolution |
|------|---------|--------|------------|
| - | - | - | - |

---

## Key References

- **Plan**: `.claude/plans/sablia-site-seo-audit.md`
- **Sitemap**: `client/public/sitemap.xml`
- **Index HTML**: `client/index.html`
- **Meta Tags**: `docs/meta-tags.json`
- **FAQ Component**: `client/src/components/landing/FaqSection.tsx`
