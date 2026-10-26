# PRD — Sablia Site Documentation & Refactoring

**Project**: sablia-site
**Type**: Internal — documentation overhaul + tech debt cleanup
**Date**: 2026-03-02
**Status**: Draft — pending approval

---

## 1. Objective

Transform the sablia-site codebase into a well-documented, consistent, lean codebase where every file, pattern, and integration is accurately documented and cross-referenced. Then use that documentation as a map to systematically eliminate accumulated tech debt.

**Success criteria:**
- Every doc file is accurate, up-to-date, and cross-references related docs
- Zero dead code (files, exports, packages, CSS)
- One consistent pattern per concern (styling, forms, animations, data fetching)
- Google Ads/SEO work is fully documented (current state + roadmap)
- CLAUDE.md is the single entry point to find any information about the project

---

## 2. Scope

### In Scope
1. Documentation audit and rewrite (CLAUDE.md, docs/*, content docs)
2. Dead code removal (files, exports, packages, CSS, API routes)
3. Pattern standardization (forms, styling, animations, error handling)
4. SEO fixes (meta-tags, structured data, sitemap)
5. Google Ads documentation (current state + unfinished roadmap)
6. Dependency cleanup (unused packages, redundant tooling)
7. Bug fixes discovered during audit (GapForm finally, debounce, RGPD consent)

### Out of Scope
- New features or pages
- Google Ads campaign creation (document roadmap only)
- Database redesign (document current state only)
- Performance optimization beyond dead code removal
- Full visual redesign of RoiCalculator (document as tech debt for future)

---

## 3. Current State Assessment

### 3.1 Architecture Overview

| Layer | Tech | Status |
|-------|------|--------|
| Client | React 18 + Vite + TypeScript + Wouter + Tailwind | Working |
| UI | shadcn/ui (14 components) + Framer Motion | Working, some unused |
| Forms | React Hook Form + Zod (3 forms) | Working, inconsistent patterns |
| Server | Express (port 5000) | Barely used — 3 stub/debug routes |
| DB | Drizzle ORM + Supabase/Neon | Connected but unused at runtime |
| Deploy | Vercel auto-deploy from GitHub main | Working |
| Analytics | GA4 (consent-gated) + Google Ads conversion tracking | Working, campaign pending |
| Integrations | n8n webhooks, Calendly embed | Working |

### 3.2 File Inventory

| Category | Count | Dead/Unused |
|----------|-------|-------------|
| Pages | 14 | 0 |
| Root components | 8 | 1 (LiveRegion) |
| Landing components | 10 | 0 |
| UI components (shadcn) | 14 | 2 (accordion, skeleton) |
| Animation components | 1 | 3 dead exports |
| Hooks | 5 | 2 (use-mobile, use-persistent-toast) |
| Lib utilities | 5 | 1 (animations.ts — all exports dead) |
| Docs files | 9 | 0 (but 6 outdated) |
| Server routes | 3 | 2 debug + 1 dead stub |

### 3.3 Dead Code Inventory

#### Files to delete
| File | Reason |
|------|--------|
| `client/src/components/LiveRegion.tsx` | Zero imports across codebase |
| `client/src/components/ui/skeleton.tsx` | Zero imports across codebase |
| `client/src/hooks/use-mobile.tsx` | Zero imports (Navigation uses local state) |
| `client/src/hooks/use-persistent-toast.ts` | Zero imports |
| `client/src/lib/animations.ts` | All 6 exports dead (GSAP migration remnant) |
| `eslint.config.js` | Biome replaces ESLint entirely |
| `.prettierrc` / `.prettierignore` | Biome replaces Prettier |

#### Dead exports to prune
| File | Dead Exports |
|------|-------------|
| `ScrollReveal.tsx` | `ParallaxSection`, `ColorChangeText`, `ScaleOnScroll` |

#### Dead CSS to remove
| File | Dead CSS |
|------|---------|
| `index.css` | `.page-transition-enter`, `.page-transition-exit` classes |

#### Dead server code
| Route | Reason |
|-------|--------|
| `GET /api/webhook-test` | Debug endpoint, leaks request details |
| `GET /api/env-check` | Debug endpoint, leaks env var names |
| `POST /api/contact` | Stub — never called (forms go to n8n directly) |

### 3.4 Unused Packages (26+ to remove)

**Runtime:**
`@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-scroll-area`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-shadcn-theme-json`, `@jridgewell/trace-mapping`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `vaul`

**Dev:**
`eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `typescript-eslint`, `prettier`, `sharp`

**Consider removing:**
- `@tanstack/react-query` — QueryClientProvider wraps app but zero useQuery/useMutation calls
- `@radix-ui/react-accordion` — component file exists but never imported by any page

### 3.5 Pattern Inconsistencies

| Concern | Current State | Target Standard |
|---------|--------------|-----------------|
| **Styling** | RoiCalculator uses dark theme (gray-900, cyan, purple); others use sablia-* tokens | `sablia-*` tokens everywhere (RoiCalculator deferred) |
| **cn() usage** | Only Navigation uses cn() outside ui/; others use string concatenation | `cn()` for all conditional classes |
| **inputClasses** | Defined 3x (GapForm, ContactForm, LpAutomatisation) with different values | Single shared constant |
| **Form rendering** | GapForm: shadcn Form wrappers; ContactForm + LpAutomatisation: raw HTML inputs | shadcn `<Form>` wrappers everywhere |
| **Form validation** | GapForm has redundant `isFormValid()` alongside Zod | Zod via RHF only |
| **RGPD consent** | ContactForm + LpAutomatisation have it; GapForm doesn't | All forms include RGPD consent |
| **Webhook URL** | GapForm: env var; ContactForm + LpAutomatisation: hardcoded | Env var or single config constant |
| **Error handling** | GapForm: `catch` only; others: `finally` | Always `finally` for cleanup |
| **useReducedMotion** | 2 of 20+ animated components respect it | All animated components |
| **Component typing** | RoiCalculator: `React.FC`; others: plain function | Plain `export default function` |
| **SEO approach** | Most: `<SEO>` component; About+Faq: `<SEO>` + inline `<Helmet>` | Single `<SEO>` handles all structured data |

### 3.6 Content Documentation Drift

| Doc | Issue |
|-----|-------|
| `SITE_CONTENT.md` | Missing routes (/faq, /cas-clients, /lp/*, /thank-you); analytics "A definir" but GA4+Ads live; contact title wrong |
| `OFFRES.md` | Retainer Standard price: 1200 vs FAQ.md: 1800 |
| `FAQ.md` | Says 30+ questions; Faq.tsx has 24; n8n integration count inconsistency |
| `content-index.json` | Missing /faq, /cas-clients, /lp/*, /thank-you pages |
| `ROADMAP.md` | CaseStudies listed as "Planned" — already exists |
| `SEO-MANUAL-TASKS.md` | GA4 setup marked pending but done; no completion tracking |
| `README.md` (docs/) | Sync date stale (2025-10-29) |
| `CLAUDE.md` | Missing /thank-you route; no doc cross-references |

### 3.7 SEO Issues

| Issue | Severity |
|-------|----------|
| Canonical URL trailing slash inconsistency (index.html vs meta-tags.json) | Low |
| Sitemap lastmod dates stale (2026-02-11) | Low |
| Homepage has 2 JSON-LD blocks (ProfessionalService + Organization) | Low |
| `/cas-clients` missing structured data | Medium |
| `/gap` missing structured data | Low |
| www vs non-www redirect (Vercel DNS) | Medium |

### 3.8 Google Ads Status

| Item | Status |
|------|--------|
| GA4 Measurement ID configured | Done |
| Google Ads Conversion ID + labels | Done |
| Landing pages deployed | Done |
| GA4 <> Google Ads linked | Done |
| Conversion tracking code deployed | Done (needs Tag Assistant verification) |
| Campaign creation | NOT done |
| Budget/bidding/extensions | NOT done |
| Promo: spend 400 get 400 | Expires May 1, 2026 |

---

## 4. Documentation Architecture (Target State)

CLAUDE.md is the index. Every question about the project can be answered by following cross-references.

### 4.1 Doc Map

```
CLAUDE.md                            # Index — quick reference + links to everything
  |-- docs/ARCHITECTURE.md           # Component tree, route map, data flow, build config
  |-- docs/SITE_CONTENT.md           # All page text, CTAs, form fields
  |-- docs/OFFRES.md                 # Service offerings and pricing
  |-- docs/FAQ.md                    # FAQ questions and answers
  |-- docs/meta-tags.json            # SEO configuration (structured data, OG tags)
  |-- docs/GOOGLE_ADS.md             # Ads IDs, conversion tracking, campaign roadmap
  |-- docs/SEO.md                    # SEO status, structured data inventory, manual tasks
  |-- docs/INTEGRATIONS.md           # n8n, Calendly, Supabase, Vercel, GA4 config
  |-- docs/ROADMAP.md                # Future work backlog
  |-- docs/content-index.json        # Machine-readable content index
```

### 4.2 New docs to create

| Doc | Purpose |
|-----|---------|
| `docs/ARCHITECTURE.md` | Component tree, route map, data flow, build config — technical reference |
| `docs/INTEGRATIONS.md` | Every external service: connection method, files, env vars, status |
| `docs/SEO.md` | Merge SEO-MANUAL-TASKS.md + structured data inventory + current status |
| `docs/GOOGLE_ADS.md` | Rename + update GOOGLE_ADS_STRATEGY.md with current status + roadmap |

### 4.3 Docs to update

| Doc | Changes |
|-----|---------|
| `CLAUDE.md` | Add /thank-you route; add doc cross-references section; fix integrations |
| `docs/SITE_CONTENT.md` | Add missing routes; fix analytics section; correct form fields |
| `docs/OFFRES.md` | Resolve retainer price inconsistency |
| `docs/FAQ.md` | Fix question count; resolve n8n integration count |
| `docs/content-index.json` | Add all missing pages |
| `docs/ROADMAP.md` | Mark CaseStudies complete; add tech debt backlog |
| `docs/README.md` | Update sync date; add new docs to index |

### 4.4 Docs to delete/merge

| Doc | Action |
|-----|--------|
| `docs/SEO-MANUAL-TASKS.md` | Merge into new `docs/SEO.md`, delete |
| `docs/GOOGLE_ADS_STRATEGY.md` | Rename to `docs/GOOGLE_ADS.md`, update |
| `LLM_INSTRUCTIONS.md` | Merge useful bits into `docs/README.md`, delete |
| `PROGRESS.md` | Review; delete if superseded by STATUS.md |

---

## 5. Tech Deliverables

### Documentation
- Updated `CLAUDE.md` with cross-references to all docs
- New `docs/ARCHITECTURE.md` — technical reference
- New `docs/INTEGRATIONS.md` — service integration guide
- New `docs/SEO.md` — SEO status and config
- New `docs/GOOGLE_ADS.md` — Ads status and roadmap
- Updated `docs/SITE_CONTENT.md`, `OFFRES.md`, `FAQ.md`, `content-index.json`, `ROADMAP.md`

### Cleanup
- 26+ unused packages removed from `package.json`
- 7 dead files deleted
- Dead CSS removed from `index.css`
- Dead server routes removed/gated
- Dead exports pruned from ScrollReveal.tsx
- `vite.config.ts` manualChunks updated after package removal
- Redundant ESLint + Prettier config removed

### Refactoring
- Forms standardized to RHF + Zod + shadcn pattern
- Webhook URL centralized (env var or config constant)
- `useReducedMotion` applied to all animated components
- SEO.tsx enhanced to handle all structured data (remove inline Helmet)
- Sitemap regenerated with current dates
- Canonical URL normalized

### Bug Fixes
- GapForm: add `finally` for isSubmitting reset
- GapForm: add RGPD consent checkbox
- RoiCalculator: fix debounce (move outside component)

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Removing packages breaks something | Medium | `npm run build` + `npm run check` after each batch |
| Content doc changes don't match actual site | Low | Cross-reference with live components during doc writes |
| SEO changes cause ranking dip | Low | Don't change URLs; keep all structured data |
| Form refactoring breaks submissions | High | Test each form end-to-end after changes |

---

## 7. Definition of Done

- [ ] All doc files accurate, cross-referenced, no drift from code
- [ ] CLAUDE.md serves as complete project index
- [ ] Zero dead files, exports, or packages in codebase
- [ ] One consistent pattern per concern (forms, animations, styling, error handling)
- [ ] Google Ads/SEO fully documented with current status + roadmap
- [ ] All forms have RGPD consent, consistent webhook URL, `finally` cleanup
- [ ] `npm run build` succeeds
- [ ] `npm run check` passes
- [ ] `npm test` passes
- [ ] All Biome lint checks pass

## 8. Home 2026-09-28 (grill decisions)

Source: the /grill-me of 2026-09-28 (14 questions, autopilot run `2026-09-28-refonte-accueil-sablia`,
hub `state/autopilot/runs/2026-09-28-refonte-accueil-sablia/00-run.md`). Stories: `specs/REGISTRY.md`
US-1, US-2, US-3, US-9 to US-13.

1. The home sells the CRM offer and the trainings; websites stay off the site.
2. First screen: the real photo of Brice pointing at the screen (QR and slide text blurred), the CRM record
   that fills itself over it (the only animated moment, mockup 2's animation), `of1.title` as the headline,
   one « Réserver 30 min » button. Light background.
3. Five sections, in order: first screen · scrolling compatible-CRM strip · offer (OF-1 card 1 490 € HT with
   its guarantee, the YouTube demo `d5fo00AFqVM` beside it as a click-to-play facade on
   `youtube-nocookie.com`, the proof line, since 2026-09-29 « Plus de 20 clients accompagnés depuis 2025. »
   on Brice's written word, which replaced the call figures 289/326 and 68 rendez-vous) · Formations
   (vertical photo, the accroche validated on 2026-09-18, the Denis quote plus two training quotes of
   2026-09-29, the existing `#contact` form) · final call. Nav, site-wide:
   Offre · Formations · Ressources + « Réserver 30 min ».
4. Left the home: Problems, Process, Team, Proof (long case cards), Catalogue (with the « Bientôt : la
   relance » card) and the FAQ, whose five questions moved to the offer page after the OF-1 ones.
5. The delivery delay: first « never shown », REVERSED by Brice the same day. The offer card shows
   « Livré en 7 jours », rendered from `of1.delay.days`, never as a literal.
6. Words: reused validated copy (`of1.ts`, the Formations accroche of 2026-09-18). Two new sentences only,
   shown to Brice on the preview: the proof line and the final-call title. On 2026-09-29 Brice kept the
   title, rejected the proof line (« ne parle pas d'appels ») and gave its replacement, plus two
   testimonials written by their authors (first names only); all three are rows P-15 to P-17 of the hub's
   proof dossier, and `landing.copy.test.ts` pins each to its row.
7. Logo: designed from scratch in Claude Design, chosen by Brice among ≥ 3 tracks, colour #D97757 (the
   previous mark was derived from a client's brand). Favicon live before 2026-10-22; the site ships before
   2026-10-09 even if the logo lags.
8. Go-live criterion: the site is presentable enough for the school partner to redirect its traffic to it.

## 9. v2 — the Sablier rebuild (2026-10-26)

Source: hub plan `plans/sablia-io-v2.md` (autopilot run `2026-10-26-sablia-io-v2`, branch `autopilot/2026-10-26-sablia-io-v2`). Stories: `specs/REGISTRY.md` US-69 to US-80, all JAMAIS-PASSÉE until the production gate.

**Objective.** Replace the Vite site by the v2 mockup (home, Formations, Accompagnement) in the Sablier charte, plus the new offer, CRM, resource, legal and 404 pages, without losing a URL, a measurement event or a deploy guarantee of lot 0.

**What changed technically.** Next.js 16.4.3 static export (`output: 'export'`, `trailingSlash: false`) served by the unchanged lot-0 Express server; React 19.3.1; Tailwind 4.3.3 CSS-first without preflight; TypeScript 5.9.3; Biome 2.4.13; Vitest 4.0.4. Metadata through `pageMetadata()`, JSON-LD components, `routes.mjs` as the single route manifest. Details: `docs/ARCHITECTURE.md`, `docs/SEO.md`, `DESIGN.md`, `CLAUDE.md`.

**Decisions taken during the run (obvious after the research, listed to Brice at the first validation point).**
1. `trailingSlash: false`: every URL, canonical and measurement `path` stays identical (emits `route.html`, `ressources/<slug>.html`, `404.html`); costs two test-first edits (`server/static.ts` resolver, deploy `assert_prerendered`).
2. Fonts self-hosted through `next/font/local` (Familjen Grotesk, Fragment Mono; woff2 from fontsource 5.3.0) instead of a Google Fonts link: a third-party request before consent is what the lot-0 reading of the CNIL guidance forbids.
3. Versions: TypeScript 5.9.3 (not 7), Biome 2.4.13 (not 2.6), Vitest 4.0.4 (not 5), Next 16.4.3 (above the 16.3.0 workspace floor). Express 4.21.2, zod 3.25.76 and puppeteer-core 24.42.0 stay (their code is untouched); `@types/node` moves to 22.15.0 to match the host's Node 22.
4. `client/` stays in place, read for reference, until the cleanup unit deletes it.
5. `/roi` → `/offres/compte-rendu-appel` and `/about` → `/#derriere` (301): the two old pages Google lists as soft 404s had no target; reversible in one line of `server/static.ts`.
6. Gates run against the preview slot `127.0.0.1:5001`, not `https://preview.sablia.io` (through Caddy every parity row differs on `X-Robots-Tag` and `robots.txt`, and Lighthouse's crawlability audit fails by construction); the strict public form runs on production at the switch.
7. CSS: per-scope `@layer components` files, Tailwind without preflight, fonts only through CSS variables (the mockup is reset-less and its three boards share class names with different bodies).
8. No contact form UI in v2 (the mockup has none; booking only): `POST /api/contact` and its parity row stay.
9. « Voir l'offre » opens `/offres/compte-rendu-appel`; header « Compte rendu d'appel » → `/#offre`, « Réalisations » → `/#construit`; footer and legal links → real routes.
10. URLs `/formations` and `/accompagnement`; spreadsheet pages at `/offres/compte-rendu-appel/google-sheets` and `/excel-365`.
11. A video tile links to our page only when a `contenu_ressources` row exists for its `youtube_id`; the demo video keeps its YouTube link otherwise.
12. The newsletter button is not rendered (only once issue 1 is out); the Formations line « Agents vocaux » is reworded « sur demande ».
13. `/ressources` and `/ressources/<slug>` are built from Supabase at build time; video posters are fetched at build.
14. The CGV page ships the v2 draft with visible « [À CONFIRMER] » marks on the preview; a production build refuses to deploy while one remains. If the text is not validated, the old text ships.
15. `lastmod` is stamped honestly after the rewrite, so the first IndexNow ping covers every changed URL.
16. Parity keeps statuses, headers and static files and releases page bodies (the content changed on purpose); the two former soft-404 rows and the two redirects are declared as allowed rows.

**Acceptance (deterministic where possible).** Build chain and guards (`npm run build`); real 404 and `<route>.html` serving (`server/static.test.ts`); the 34 recorded URL behaviours (`scripts/site-parity.py`, `scripts/qa/routes-check.py`); measurement events (`src/lib/event-map.test.ts`, `scripts/analytics-e2e.mjs`); content gates and their bench (`scripts/qa/content-gates.sh`); home at most 2 `score.py` defects, Formations 0, Accompagnement 0; motion, accessibility and origin gates on every route; Lighthouse mobile a11y ≥ 95, SEO ≥ 95, best practices ≥ 90, performance ≥ 75, CLS ≤ 0.1, LCP ≤ 3 s, TBT ≤ 300 ms (or the old-production baseline where the old site missed one); CSS discipline (`scripts/qa/css-collisions.py`); no draft marker in a production build.

**Out of scope.** Retiring Vercel, the newsletter, a contact form UI, a card for a client on the home wall, TypeScript 7 / Vitest 5 / Biome 2.6 / Express 5 migrations.
