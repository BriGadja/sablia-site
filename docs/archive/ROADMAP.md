# Sablia Site - Roadmap

**Last Updated**: 2026-03-02

This document tracks future initiatives for sablia.io.

---

## Completed

### SEO Audit & Optimization (2026-01-26)
- Technical SEO implementation (Phases A-C)
- Meta-tags, structured data, sitemap, Core Web Vitals

### Case Studies Section (2026-02-06)
- `/cas-clients` page with 3 anonymized case studies
- `/faq` page with 24 questions across 8 categories

### Landing Page Refinements (2026-02-07)
- Hero rework ("Retournez le sablier"), testimonials elevation, service cards, TransformationSection, ROI calculator simplification

### Calendly Integration (2026-02-02)
- 2-column ContactFormSection (form + Calendly InlineWidget)

### Google Ads Setup (2026-02-11)
- Conversion actions, landing pages, GA4 <> Ads linking

### Documentation Overhaul (2026-03-02)
- Created ARCHITECTURE.md, INTEGRATIONS.md, SEO.md, GOOGLE_ADS.md
- Updated all content docs, cleaned legacy files

---

## Planned Initiatives

### 1. Google Ads Campaign Launch

**Priority**: High
**Effort**: 1-2 hours (Brice manual task)

- [ ] Create campaign in Google Ads UI
- [ ] Configure budget (15 EUR/day)
- [ ] Apply negative keywords
- [ ] Set up ad extensions (sitelinks, callouts, structured snippets)
- [ ] Verify with Tag Assistant

See [GOOGLE_ADS.md](./GOOGLE_ADS.md) for full strategy.

### 2. Sablia Blog / Content Hub

**Priority**: Medium
**Effort**: 2-4 weeks
**Type**: Feature development

**Scope** (from SEO audit Phase D):
- [ ] Plan blog/resource section architecture
- [ ] Research French SEO keywords for n8n/automation niche
- [ ] Create 3-5 use-case pages (by industry or process)
- [ ] Implement internal linking strategy

**Technical Decisions Needed**:
- Content format: MDX files vs headless CMS (Strapi, Sanity)?
- Blog routes: `/blog/*` or `/ressources/*`?
- Category structure: by industry, by tool, by process type?

---

## Tech Debt Backlog

From PRD audit (sections 3.3-3.5), scoped for Units 2-3:

### Unit 2 — Dead Code Cleanup
- [ ] Remove dead hooks (useIsMobile, usePersistentToast)
- [ ] Audit unused Radix dependencies still in package.json
- [ ] Remove orphaned files (services-bg.jpg if present)

### Unit 3 — Pattern Standardization
- [ ] Standardize webhook URL handling (GAP uses env var, contact form hardcoded)
- [ ] Standardize form inputClasses pattern
- [ ] Add RGPD consent to all forms consistently
- [ ] Evaluate React Query usage (currently configured but minimal use)

### SEO Fixes
- [ ] Fix canonical trailing slash inconsistency
- [ ] Resolve duplicate JSON-LD on homepage
- [ ] Add structured data to `/cas-clients`
- [ ] Fix www vs non-www redirect (Vercel DNS)

---

## Ideas / Backlog

- **Multi-language support** (English version for international reach)
- **Interactive automation demos** (embedded n8n workflow previews)
- **Client portal** (for existing customers to access resources)
- **Pricing calculator** (more detailed than current ROI calculator)

---

## How to Use This Document

1. **When ready to start an initiative**: Move to a plan file, run `/plan {name}`
2. **To add new ideas**: Add to "Ideas / Backlog" section
3. **Keep updated**: Move completed items to "Completed" section
