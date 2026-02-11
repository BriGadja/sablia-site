# PRD - Sablia.io Website Refactor

**Version**: 1.0
**Date**: 2026-02-06
**Status**: Draft - Awaiting Approval
**Author**: Brice Gachadoat + Claude Code

---

## 1. Purpose & Goals

### What is Sablia.io?
French B2B consulting website for AI automation services (n8n, Make, voice AI) targeting SMEs with 10-250 employees. One-person consultancy by Brice Gachadoat.

### Why Refactor?
The current site is functional but carries significant tech debt and missed conversion opportunities:

- **~1,000 lines of dead code** (duplicate components, unused pages, legacy deps)
- **~650KB of unnecessary bundle weight** (passport, react-icons, GSAP for 3 files, unused shadcn/ui)
- **Missing legal compliance** (no RGPD consent checkbox on contact form)
- **No error boundaries** (white screen on any component crash)
- **Conversion gaps** (no case studies page, no exit intent, limited social proof placement)
- **Performance debt** (3 animation libraries where 1 suffices, no robots.txt)

### Success Metrics

| Metric | Current (estimated) | Target |
|--------|-------------------|--------|
| Bundle size (gzipped) | ~700KB+ | <400KB |
| LCP | Unknown | <2.0s |
| CLS | Unknown | <0.05 |
| INP | Unknown | <200ms |
| Lighthouse Performance | Unknown | >90 |
| Form conversion rate | ~2% | >4% |
| Bounce rate | Unknown | <55% |

---

## 2. Target Audience

| Segment | Description | Priority |
|---------|-------------|----------|
| **PME Décideurs** | CEOs/COOs of 10-50 person French SMEs, non-technical, looking for efficiency gains | Primary |
| **ETI Managers** | Ops/IT managers in 50-250 person companies, somewhat technical, need justification for leadership | Secondary |
| **Solopreneurs** | Entrepreneurs wanting to automate to scale without hiring | Tertiary |

### User Journey
```
Google/LinkedIn → Landing page → Scan hero (3s decision) → Social proof →
Problem recognition → Solution understanding → Pricing scan →
ROI calculation → Contact/Calendly booking
```

---

## 3. Information Architecture

### Current Structure (Keep)
```
/                         Landing (homepage) — all sections
/about                    About Brice + Sablia
/gap                      GAP analysis lead gen form
/tarifs                   Dedicated pricing page
/roi                      ROI calculator
/mentions-legales         Legal notice
/politique-confidentialite Privacy policy (RGPD)
/cgv                      Terms of service
```

### Proposed Additions
```
/cas-clients              Case studies index (NEW — Phase D)
/faq                      Full FAQ page with 30+ questions (NEW — Phase C)
```

### Proposed Removals
```
/home                     Legacy alternative homepage → DELETE
TestStackValue.tsx        Unrouted test page → DELETE
```

### Landing Page Section Flow (Refined)

Current flow is mostly correct per B2B best practices. Adjustments:

| # | Section | Status | Notes |
|---|---------|--------|-------|
| 1 | Navigation | Keep | Add sticky behavior if not already |
| 2 | Hero | **Refine** | Add concrete metric to subheadline (e.g., "15h/semaine économisées en moyenne") |
| 3 | Social Proof / Logos | **Move up** | Client logos immediately after hero (before testimonials) |
| 4 | Testimonials | Keep | Already strong with 5 stories |
| 5 | Problem | Keep | Consider adding micro-stats |
| 6 | Solution | Keep | |
| 7 | Process | Keep | |
| 8 | Pricing | Keep | |
| 9 | ROI Calculator | Keep | |
| 10 | Contact + Calendly | **Fix** | Add RGPD checkbox |
| 11 | FAQ | Keep | Add "Voir toutes les questions" link to /faq |
| 12 | Footer | Keep | Add robots.txt |

---

## 4. Content Inventory

### What Stays (As-Is)
- All service offerings and pricing tiers
- 5 testimonials
- 12 integration logos with hover cards
- ROI calculator logic
- FAQ 8 core questions on landing
- About page content
- GAP analysis form
- Legal pages (mentions, RGPD, CGV)

### What Changes
| Element | Change | Reason |
|---------|--------|--------|
| Hero subheadline | Add concrete metric | Conversion optimization — specific numbers > vague promises |
| Contact form | Add RGPD consent checkbox | Legal compliance (CRITICAL) |
| FAQ section footer | Add link to /faq | Surface full 30+ FAQ for SEO + completeness |
| Lazy loading | Extend to AnimatedParticles | Performance — heavy component loads eagerly |
| Suspense fallbacks | Replace blank divs with skeletons | Better perceived performance |

### What's New
| Element | Description | Phase |
|---------|-------------|-------|
| Error boundaries | Root + section-level crash protection | A |
| robots.txt | Search engine crawl directives | A |
| /faq page | Full 30+ question FAQ from docs/FAQ.md | C |
| /cas-clients page | Case studies with before/after metrics | D |
| Missing OG images | og-image-tarifs, gap, roi, about | C |

### What's Removed
| Element | Reason |
|---------|--------|
| `/home` route + Home.tsx | Legacy, unused |
| TestStackValue.tsx | Test artifact |
| components/Navbar.tsx | Replaced by landing/Navigation.tsx |
| components/HeroSection.tsx | Replaced by landing/HeroSection.tsx |
| components/FaqSection.tsx | Duplicate of landing/FaqSection.tsx |
| components/ProcessSection.tsx | Replaced by ThreeStepProcess.tsx |
| components/ServicesSection.tsx | Replaced by SolutionSection.tsx |
| components/RoiBanner.tsx | Unused |
| components/RainbowText.tsx | Unused |
| passport + session deps | Never implemented auth |
| react-icons dep | lucide-react used instead |

---

## 5. Design Direction & Brand Guidelines

### Current Brand (Preserve)
- **Colors**: Navy (#0A2463), Electric (#3E92CC), Cyan (#52D1DC), Orange accent (#FFA559)
- **Tone**: Professional, approachable, expert but not intimidating
- **Language**: French (client-facing), formal but warm

### Design Principles for Refactor
1. **Strategic minimalism** — Cut clutter, guide users through frictionless journey
2. **Performance as design** — Faster = more professional. Trim animation weight.
3. **Trust-first** — Credentials, metrics, and testimonials near every CTA
4. **Mobile-first responsive** — 60%+ traffic is mobile in 2026

### Animation Strategy (Simplified)
- **Keep**: Framer Motion (dominant, 30 files, excellent DX)
- **Migrate**: GSAP usages (3 files) → Framer Motion equivalents
- **Evaluate**: AnimatedParticles — keep if performant, lazy-load regardless
- **Remove**: GSAP dependency entirely after migration

---

## 6. Technical Requirements & Constraints

### Stack (No Changes)
- React 18 + TypeScript + Vite + Wouter
- Express.js backend (port 5000)
- Tailwind CSS + shadcn/ui + Radix UI
- Drizzle ORM + PostgreSQL (Supabase)
- Deployed on Vercel

### Performance Budget
| Resource | Budget |
|----------|--------|
| Initial JS bundle (gzipped) | <250KB |
| Total page weight | <1MB |
| LCP | <2.0s |
| INP | <200ms |
| CLS | <0.05 |
| Fonts | System stack or 1 web font max |

### Bundle Optimization Targets
| Dependency | Action | Savings (est.) |
|------------|--------|---------------|
| passport, passport-local, express-session, memorystore | Remove | ~100KB |
| react-icons | Remove | ~50KB |
| gsap | Remove (after migration) | ~150KB |
| recharts | Remove if ui/chart.tsx unused | ~200KB |
| Unused shadcn/ui components | Remove ~15-20 components | ~100-150KB |
| **Total estimated savings** | | **~600-650KB** |

### Compatibility
- Browsers: Last 2 versions of Chrome, Firefox, Safari, Edge
- Mobile: iOS 15+, Android 10+
- Screen sizes: 320px to 2560px

### Constraints
- No breaking changes to n8n webhook integrations
- Preserve all SEO structured data (6 schemas)
- Keep Calendly inline widget integration
- Forms must continue submitting to n8n webhooks
- Database schema untouched (site_users table)

---

## 7. Out of Scope (This Refactor)

- Blog / content marketing system
- Authentication / user accounts
- CMS integration
- Multi-language (EN) support
- A/B testing infrastructure
- Analytics integration (GA4, Hotjar)
- Industry-specific landing pages (/solutions/immobilier, etc.)
- Dark mode toggle
- Live chat widget

These are valid future enhancements but not part of this refactor.

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GSAP → Framer Motion migration breaks animations | Medium | Test each component individually, keep GSAP as fallback until verified |
| Removing unused shadcn/ui breaks something | Low | Grep every component before removal, build check after each deletion |
| SEO ranking dip during refactor | Low | Don't change URLs, keep all structured data, update sitemap |
| Bundle analysis reveals hidden dependencies | Low | Use rollup-plugin-visualizer (already installed) before and after |

---

## 9. Definition of Done

- [ ] All dead code removed (duplicates, unused deps, legacy pages)
- [ ] Bundle size reduced by >500KB (measured before/after)
- [ ] RGPD consent checkbox on contact form
- [ ] Error boundaries at root + lazy-loaded sections
- [ ] robots.txt created and serving correctly
- [ ] GSAP migrated to Framer Motion (3 components)
- [ ] Lighthouse Performance score >90
- [ ] All existing tests pass
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` passes TypeScript checks
- [ ] Visual validation with Playwright MCP on key sections
- [ ] Documentation updated (SITE_CONTENT.md, content-index.json)
