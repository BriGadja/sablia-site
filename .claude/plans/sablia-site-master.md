# Master Plan — Sablia Site Documentation & Refactoring

**PRD**: `PRD.md`
**Created**: 2026-03-02
**Status**: COMPLETED — all 3 units done

---

## Overview

| Unit | Name | Scope | Est. Tasks | Dependencies |
|------|------|-------|-----------|-------------|
| 1 | Documentation Overhaul | Create/update all docs, make CLAUDE.md the index | 15-18 | None |
| 2 | Dead Code Cleanup | Delete dead files, remove unused packages, clean server | 12-15 | Unit 1 (docs reference current state) |
| 3 | Pattern Refactoring | Standardize forms, animations, SEO, fix bugs | 15-20 | Unit 2 (clean codebase to refactor) |

---

## Unit 1: Documentation Overhaul

**Goal**: Every doc file is accurate, up-to-date, and cross-referenced. CLAUDE.md is the single entry point.

### Entry Criteria
- PRD approved
- Research agent output available (in this session's context)

### Tasks

1. **Create `docs/ARCHITECTURE.md`**
   - Component tree (root → landing → ui → animations)
   - Route map (route → component → file → load strategy)
   - Page inventory (route, key components, data deps)
   - Server architecture (middleware, endpoints)
   - Build config (Vite, TypeScript, Tailwind design tokens)
   - Entry flow diagram (main.tsx → App.tsx → Router → pages)
   - Hooks and lib reference table
   - Source: research agent output (architecture + integration)

2. **Create `docs/INTEGRATIONS.md`**
   - For each service (n8n, Calendly, Supabase, GA4, Google Ads, Vercel):
     - Connection method, endpoint URLs, files involved
     - Env vars needed, credential references
     - Current status (working/partial/unused)
   - Anti-spam implementation (honeypot)
   - UTM tracking flow
   - Analytics consent flow diagram
   - Source: research agent output (integration mapper)

3. **Create `docs/SEO.md`** (merge SEO-MANUAL-TASKS.md)
   - Meta-tags coverage table (route → title, OG, Twitter, structured data)
   - Structured data inventory (page → schema type → source)
   - Sitemap status and contents
   - robots.txt summary
   - Known issues (canonical slash, www redirect, duplicate JSON-LD)
   - Manual tasks with completion status checkboxes
   - Delete `docs/SEO-MANUAL-TASKS.md` after merge

4. **Create `docs/GOOGLE_ADS.md`** (rename GOOGLE_ADS_STRATEGY.md)
   - All IDs: GA4 property, measurement ID, Ads account, conversion ID
   - Conversion tracking: labels, trigger points, implementation files
   - Landing pages: purpose, content summary, conversion flow
   - Campaign strategy (from existing doc)
   - Pre-launch checklist with current status
   - Budget and promo details
   - Rename/replace `docs/GOOGLE_ADS_STRATEGY.md`

5. **Update `docs/SITE_CONTENT.md`**
   - Add missing routes: /faq, /cas-clients, /lp/*, /thank-you
   - Fix analytics section ("A definir" → actual GA4/Ads config)
   - Fix contact section title ("Diagnostic Gratuit" → "Contactez-nous")
   - Add telephone + RGPD consent to form field descriptions
   - Fix GAP post-submit description (→ /thank-you, not homepage)

6. **Update `docs/OFFRES.md`**
   - Resolve retainer Standard price (1200 vs 1800 — ask Brice if unclear)
   - Cross-reference with `docs/SITE_CONTENT.md` pricing section

7. **Update `docs/FAQ.md`**
   - Fix question count (24, not 30+)
   - Resolve n8n integration count (400 native vs 800+ total)
   - Cross-reference with Faq.tsx content

8. **Update `docs/content-index.json`**
   - Add /faq, /cas-clients, /lp/automatisation-pme, /lp/audit-gratuit, /thank-you
   - Verify all existing entries match current code

9. **Update `docs/ROADMAP.md`**
   - Mark CaseStudies as complete
   - Add tech debt items from PRD sections 3.3-3.5 as backlog
   - Add Google Ads campaign creation as pending

10. **Update `docs/README.md`**
    - Update sync date
    - Add new docs (ARCHITECTURE, INTEGRATIONS, SEO, GOOGLE_ADS) to index
    - Update file list and descriptions

11. **Handle `LLM_INSTRUCTIONS.md`**
    - Review content; merge any unique guidance into `docs/README.md`
    - Delete `LLM_INSTRUCTIONS.md`

12. **Handle `PROGRESS.md`**
    - Review content vs STATUS.md
    - If superseded, delete; if unique info, merge into STATUS.md

13. **Update `CLAUDE.md`**
    - Add /thank-you route to routes table
    - Add "Documentation" section with cross-references to all docs/
    - Note webhook URL asymmetry (env var vs hardcoded)
    - Note DB is connected but unused
    - Update any stale information

14. **Cross-reference validation**
    - Verify every doc references related docs correctly
    - Verify CLAUDE.md links to all docs
    - Verify no broken internal references

### Exit Criteria
- All docs accurate and cross-referenced
- CLAUDE.md is the complete entry point
- Zero stale dates or incorrect information in any doc
- `git diff --stat` shows only doc file changes

### Sync Check
- `/validate` on docs (spot-check 3 random facts against code)

### Invoke
```
/plan sablia-site-docs
```

---

## Unit 2: Dead Code Cleanup

**Goal**: Remove all dead files, exports, packages, CSS, and server routes. Codebase is lean.

### Entry Criteria
- Unit 1 complete (docs reference current state before cleanup)
- Docs capture everything that will be removed

### Tasks

1. **Delete dead component files**
   - `client/src/components/LiveRegion.tsx`
   - `client/src/components/ui/skeleton.tsx`
   - Verify no imports break with `npm run check`

2. **Delete dead hook files**
   - `client/src/hooks/use-mobile.tsx`
   - `client/src/hooks/use-persistent-toast.ts`
   - Verify no imports break

3. **Delete dead lib files**
   - `client/src/lib/animations.ts` (all 6 exports dead)
   - Verify no imports break

4. **Prune dead exports from ScrollReveal.tsx**
   - Remove `ParallaxSection`, `ColorChangeText`, `ScaleOnScroll`
   - Keep `ScrollReveal` (default export, used by Faq + CaseStudies)

5. **Remove dead CSS from index.css**
   - Delete `.page-transition-enter`, `.page-transition-exit` classes

6. **Remove dead server routes**
   - Delete or gate behind `NODE_ENV !== 'production'`:
     - `GET /api/webhook-test`
     - `GET /api/env-check`
   - Delete `POST /api/contact` (dead stub)

7. **Remove unused runtime packages** (batch 1 — Radix UI)
   - `npm uninstall` all 16 unused @radix-ui packages
   - `npm run build` to verify

8. **Remove unused runtime packages** (batch 2 — other)
   - `npm uninstall @replit/vite-plugin-runtime-error-modal @replit/vite-plugin-shadcn-theme-json @jridgewell/trace-mapping cmdk input-otp react-day-picker react-resizable-panels vaul`
   - `npm run build` to verify

9. **Remove unused dev packages**
   - `npm uninstall eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh typescript-eslint prettier sharp`
   - Delete `eslint.config.js`, `.prettierrc`, `.prettierignore`
   - `npm run build` to verify

10. **Evaluate and remove React Query**
    - Confirm zero `useQuery`/`useMutation` usage
    - Remove `@tanstack/react-query` from deps
    - Remove `<QueryClientProvider>` from App.tsx
    - Delete `client/src/lib/queryClient.ts`
    - `npm run build` to verify

11. **Evaluate accordion component**
    - If keeping: document why in ARCHITECTURE.md
    - If removing: `npm uninstall @radix-ui/react-accordion`, delete `ui/accordion.tsx`
    - Update `vite.config.ts` manualChunks (remove accordion from `ui` chunk)

12. **Update vite.config.ts manualChunks**
    - Review chunk config after all package removals
    - Remove references to deleted packages
    - `npm run build` to verify no chunk errors

13. **Add nanoid to package.json**
    - Currently used in `server/vite.ts` but only as transitive dep
    - `npm install nanoid` to make it explicit

14. **Full verification**
    - `npm run build`
    - `npm run check`
    - `npm test`
    - `npm run lint`

### Exit Criteria
- Zero dead files, exports, or packages
- All 4 verification commands pass
- Bundle size reduced (measure before/after with `npm run analyze`)
- `docs/ARCHITECTURE.md` updated to reflect removals

### Sync Check
- Did removals reveal anything the PRD missed?
- Does Unit 3 scope need adjustment?

### Invoke
```
/plan sablia-site-cleanup
```

---

## Unit 3: Pattern Refactoring

**Goal**: One consistent pattern per concern. All known bugs fixed. SEO issues resolved.

### Entry Criteria
- Unit 2 complete (clean codebase to refactor)
- No dead code remaining

### Tasks

#### Forms (5 tasks)
1. **Centralize webhook URL**
   - Create shared constant or use env var for contact form webhook URL
   - Update `ContactFormSection.tsx` and `LpAutomatisation.tsx` (currently hardcoded)
   - `GapForm.tsx` already uses env var — align approach

2. **Add RGPD consent to GapForm**
   - Add consent checkbox matching ContactFormSection/LpAutomatisation pattern
   - Wire into Zod schema validation

3. **Remove redundant isFormValid() from GapForm**
   - Let RHF + Zod handle all validation
   - Remove manual validation function

4. **Fix GapForm finally block**
   - Move `setIsSubmitting(false)` to `finally` (not just catch)
   - Match pattern from ContactFormSection/LpAutomatisation

5. **Extract shared inputClasses**
   - Create single shared constant for input styling
   - Replace 3 separate declarations in GapForm, ContactFormSection, LpAutomatisation

#### Animations (2 tasks)
6. **Apply useReducedMotion broadly**
   - Audit all components with `motion.div` + `whileInView`
   - Either wrap with `ScrollReveal` (which handles it) or add `useReducedMotion` hook
   - Target: every scroll-triggered animation respects `prefers-reduced-motion`

7. **Remove dead CSS animation classes**
   - Verify `.page-transition-*` removed in Unit 2
   - Check for any other unused animation CSS

#### SEO (5 tasks)
8. **Fix canonical URL consistency**
   - Normalize to `https://sablia.io/` (with trailing slash) everywhere
   - Update `index.html` canonical link

9. **Deduplicate homepage JSON-LD**
   - Remove Organization schema from `meta-tags.json` for homepage
   - Keep ProfessionalService in index.html (more specific)
   - OR: consolidate both into SEO.tsx

10. **Add structured data to /cas-clients**
    - Add ItemList schema via meta-tags.json

11. **Regenerate sitemap.xml**
    - Update all `lastmod` dates
    - Verify all public routes present

12. **Enhance SEO.tsx to handle inline JSON-LD**
    - Move structured data from About.tsx and Faq.tsx inline Helmet into meta-tags.json
    - Single source of truth for all SEO data

#### Code Quality (4 tasks)
13. **Fix RoiCalculator debounce bug**
    - Move debounce function outside component body (or use useMemo/useCallback)
    - Currently recreated every render, breaking timeout tracking

14. **Remove React.FC from RoiCalculator**
    - Change to plain function signature
    - Match pattern of all other components

15. **Standardize cn() usage**
    - Adopt `cn()` for conditional class composition in non-ui components
    - Priority: components that currently use string concatenation for conditionals

16. **Fix SEO.tsx deep relative import**
    - `'../../../docs/meta-tags.json'` → move to `client/src/data/meta-tags.json` or add path alias

#### Documentation Update (2 tasks)
17. **Update docs to reflect refactoring**
    - `docs/ARCHITECTURE.md` — update component patterns, form approach
    - `docs/INTEGRATIONS.md` — update webhook URL approach
    - `CLAUDE.md` — note standardized patterns

18. **Final cross-reference validation**
    - Every doc accurate after all changes
    - No stale references

### Exit Criteria
- One consistent pattern per concern
- All 3 forms: shadcn wrappers, RGPD consent, env var webhook, finally cleanup
- All scroll animations respect reduced-motion
- All SEO issues from PRD 3.7 resolved
- `npm run build` + `npm run check` + `npm test` + `npm run lint` all pass
- Docs updated to reflect new patterns

### Invoke
```
/plan sablia-site-refactor
```

---

## Documentation Sources & Targets

### Sources (read during research)
| Path | Category |
|------|----------|
| `client/src/App.tsx` | Architecture |
| `client/src/pages/*.tsx` (14 files) | Routes, components |
| `client/src/components/**/*.tsx` (33 files) | Component inventory |
| `client/src/hooks/*.ts` (5 files) | Hooks |
| `client/src/lib/*.ts` (5 files) | Utilities |
| `client/src/utils/roi.ts` | Business logic |
| `server/*.ts` (3 files) | Server architecture |
| `db/*.ts` (2 files) | Database |
| `vite.config.ts`, `tsconfig.json`, `package.json` | Build config |
| `tailwind.config.ts`, `biome.json` | Design system, quality |
| `vercel.json`, `.github/workflows/claude.yml` | Deploy, CI |
| `client/public/sitemap.xml`, `robots.txt`, `index.html` | SEO |
| `docs/*` (9 files) | Content documentation |
| `CLAUDE.md`, `STATUS.md`, `LLM_INSTRUCTIONS.md`, `PROGRESS.md` | Project docs |
| `.env.example` | Environment config |

### Targets (updated during execution)
| Path | Unit | Changes |
|------|------|---------|
| `CLAUDE.md` | 1, 3 | Cross-references, /thank-you route, patterns |
| `docs/ARCHITECTURE.md` | 1, 2, 3 | New file; updated after cleanup and refactoring |
| `docs/INTEGRATIONS.md` | 1, 3 | New file; webhook URL update |
| `docs/SEO.md` | 1, 3 | New file; updated after SEO fixes |
| `docs/GOOGLE_ADS.md` | 1 | Rename + rewrite |
| `docs/SITE_CONTENT.md` | 1 | Fix drift |
| `docs/OFFRES.md` | 1 | Fix pricing |
| `docs/FAQ.md` | 1 | Fix counts |
| `docs/content-index.json` | 1 | Add pages |
| `docs/ROADMAP.md` | 1 | Update status |
| `docs/README.md` | 1 | Update index |
| `package.json` | 2 | Remove 26+ packages |
| 7 dead files | 2 | Delete |
| `eslint.config.js`, `.prettierrc`, `.prettierignore` | 2 | Delete |
| `server/routes.ts` | 2 | Remove dead routes |
| `client/src/index.css` | 2 | Remove dead CSS |
| `ScrollReveal.tsx` | 2 | Prune exports |
| `vite.config.ts` | 2 | Update chunks |
| Form components (3) | 3 | Standardize |
| 20+ animated components | 3 | useReducedMotion |
| `docs/meta-tags.json` | 3 | Fix canonical, schemas |
| `client/public/sitemap.xml` | 3 | Regenerate |
| `client/index.html` | 3 | Fix canonical |
| `SEO.tsx` | 3 | Handle all structured data |

---

## Execution Loop

```
Unit 1: /plan sablia-site-docs     → /execute → /validate → sync check
Unit 2: /plan sablia-site-cleanup   → /execute → /validate → sync check
Unit 3: /plan sablia-site-refactor  → /execute → /validate → sync check
Final:  /close
```
