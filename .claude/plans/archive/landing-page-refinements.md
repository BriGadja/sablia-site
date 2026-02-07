# Sablia.io Landing Page Refinements — Plan

**Date**: 2026-02-07
**Confidence**: 8/10 (well-scoped, all within existing tech stack)
**Research**: 15+ US/EU competitors analyzed, Langdock.com design reference, IAPreneurs credential verified

---

## Executive Summary

Five targeted improvements to the landing page, informed by competitor research across LeftClick, Axe Automation, Flowmondo, n8nlab, Makeitfuture, and others. The changes strengthen the brand narrative (Sablia = sablier = time reclaimed), improve credibility signals, simplify the ROI pitch, and remove a broken section.

---

## Honest Opinions & Brainstorming

### 1. Hero Copy — Sablia/Hourglass Wordplay

**Current**: "L'IA au service de votre croissance" — generic, every automation agency says this.
**Opportunity**: NO competitor in the entire n8n/Make consulting space uses time/hourglass imagery. The brand name "Sablia" → "sablier" (hourglass) is an unused asset. The logo IS an hourglass. This alignment should be front and center.

**Headline options (ranked)**:

| # | Headline | Sub-headline | Rationale |
|---|----------|-------------|-----------|
| **A** | **Retournez le sablier** | Sablia automatise vos processus répétitifs. Vous récupérez vos heures. | Brand wordplay + action verb + concrete outcome. "Retourner le sablier" = turning the hourglass = reversing wasted time. |
| **B** | **Chaque grain de temps compte** | L'automatisation intelligente qui vous rend les heures que vous pensiez perdues. | Poetic, plays on sable/sand. More evocative, less direct. |
| **C** | **Votre temps file. On le rattrape.** | Automatisation & IA sur mesure pour PME — récupérez vos heures, on s'occupe du reste. | Direct, punchy, confident. No brand wordplay but strong time framing. |
| **D** | **Récupérez 10h par semaine** | L'IA et l'automatisation au service de votre productivité. Sans complexité. | Hyper-specific metric (like HerTech's "Reclaim 10+ hours"). Converts well but less memorable as a brand statement. |

**Recommendation**: Option A ("Retournez le sablier") — it's the most distinctive, ties directly to the brand name and logo, and creates a visual metaphor no competitor can copy. Keep the existing sub-line rhythm: "On forme vos équipes. On installe les systèmes. Vous gardez le contrôle." — it's strong.

**Authority tag below CTAs**: Add a small credential line:
> Brice Gachadoat — Responsable Pédagogique & Expert IA, communauté IAPreneurs (160k+)

---

### 2. Testimonials — Elevation Ideas

**Current state**: Honestly good. 5 cards, 3+2 grid, schema markup for SEO. This is stronger than 80% of competitors (most show only logos or nothing).

**What's missing** (from Flowmondo's "Wall of Love" and Axe Automation's case cards):

1. **Aggregate credibility header** — No competitor-validated metrics above testimonials. Add: "15+ projets livrés · 4.9/5 satisfaction · 5 secteurs d'activité"
2. **Numerical metrics are buried** — Hélène's "90% du temps" is inside the quote text. The metric badges ("Économie de 90% du temps") are good but could be more prominent — larger font, bolder contrast.
3. **Missing before/after frame** — Axe Automation shows the transformation, not just the outcome. Consider adding a small "Avant:" line above each quote.

**Design improvement**: Make the metric badge the visual anchor of each card (move it to the top, make it larger with a warm background). The quote becomes supporting evidence, not the lead.

---

### 3. Logos/Tools Section — Radical Rethink

**Current state**: Broken. White SVGs on warm beige = invisible. But even if fixed, the section is wrong for the audience.

**Honest opinion**: This section should be **replaced entirely**. Here's why:
- Your audience is non-technical PME directors. They don't know what n8n, Vercel, or Anthropic are.
- GitHub and Vercel are developer tools — showing them damages the "simple for business" message.
- LeftClick (your closest US competitor) shows ZERO tools and focuses purely on outcomes.
- Axe Automation organizes by business function (CRM, ERP, AI), not tech stack.

**Replacement concept — Langdock-style service cards**:

Instead of tool logos, show **what Sablia actually does** in a horizontal card layout inspired by Langdock:

| Card | Title | Description | Visual |
|------|-------|-------------|--------|
| Audit | Diagnostic Express | Identifiez vos gains rapides en 1h30 | Checklist/report icon |
| Formation | Vos équipes autonomes | De débutant à expert en 1-3 jours | Training icon |
| Automatisation | Workflows sur mesure | Vos processus, automatisés et fiables | Workflow diagram |
| Agents IA | L'IA qui travaille pour vous | Agents vocaux, traitement de documents, veille | AI agent icon |

Each card links to the relevant section (#pricing or #contact). This replaces a broken, irrelevant tech section with a compelling service overview that speaks the language of PME directors.

**Alternative (lighter touch)**: If we want to keep SOME tool presence, reduce to 6 tools PMEs actually recognize (Google Sheets, Slack, Gmail, HubSpot, Notion, Excel) with the header "Vos outils, connectés automatiquement" — framing it as enhancing THEIR existing stack.

---

### 4. Problem + Solution Storytelling

**Current state**: Two separate sections with different backgrounds. The cognitive gap between "Les défis" and "La méthode Sablia" breaks the narrative flow.

**Best competitor reference**: n8nlab coins "Random Acts of Automation" as a named problem — memorable and specific. Axe Automation uses side-by-side before/after columns.

**Proposed merge — "La Transformation" section**:

A single section with a visual journey from left (problem) to right (solution):

```
Before (warm surface bg)          →          After (lighter bg)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 "2h par jour à copier           ⚡ "Zéro saisie manuelle.
    des données entre Excel             Vos outils se parlent
    et votre CRM"                       automatiquement"

⚠️ "Des erreurs de saisie          ✅ "Zéro erreur. Chaque
    qui coûtent des clients"            donnée vérifiée par l'IA"

📉 "Impossible de scaler           📈 "Scalez sans recruter.
    sans recruter"                      L'automatisation absorbe
                                        la charge"
```

The problems become **specific and visceral** (not generic "temps perdu") and each one has its mirror solution. This creates the storytelling arc the user asked for.

**Name the problem**: Coin a phrase like "Le Syndrome du Copier-Coller" or "L'Automatisation Aveugle" — something prospects identify with.

---

### 5. ROI Calculator Simplification

**Current state**: 4 number inputs, technical feel. The "10 employees" default is wrong for a PME audience of 2-15 people.

**Key insight from research**: Most competitors have NO calculator. This is a differentiator to keep but simplify radically.

**Proposed redesign — "Calculez vos économies en 30 secondes"**:

**Inputs (2 only, sliders)**:
1. "Combien d'heures par semaine passez-vous sur des tâches répétitives ?" — Slider: 2h → 40h (default: 8h)
2. "Quel est le coût horaire moyen dans votre entreprise ?" — Slider: 20€ → 80€ (default: 35€)

**Output (vivid, animated)**:
A single results card with warm colors showing:
- **Heures récupérées par an**: X h (large, sienna color, count-up animation)
- **Économies annuelles**: X € (large, navy, count-up)
- **Pour un investissement de ~1 500€** — ROI: +X% dès la première année

**Contextual comparison** (below results):
> "C'est l'équivalent de **X jours de travail** récupérés, soit le temps de [relance metaphor]"

**Micro-testimonial anchor**:
> "Hélène a économisé 90% de son temps de conception de menus — GirlsGang"

---

## Phase Status

| Phase | Name | Tasks | Effort |
|-------|------|-------|--------|
| A | Hero rework (copy + credential) | 3 | 30min |
| B | Testimonials elevation | 3 | 30min |
| C | Replace Logos → Service cards (Langdock-style) | 4 | 1-2h |
| D | Problem + Solution merge | 4 | 1-2h |
| E | ROI Calculator simplification | 4 | 1-2h |
| — | Playwright validation + commit | 2 | 20min |

**Total**: ~4-6h

---

## Phase A: Hero Rework

### Tasks
- [x] A1. Update hero headline to "Retournez le sablier" with time-framing sub-headline
- [x] A2. Add credential badge below CTAs: "Brice Gachadoat — Resp. Pédagogique & Expert IA, IAPreneurs (160k+)"
- [x] A3. Refine the decorative line + spacing for new copy length

### Technical Details
- File: `client/src/components/landing/HeroSection.tsx`
- Keep existing animation structure (motion.div + stagger)
- Credential badge: small text, `text-sablia-text-tertiary` with link to iapreneurs.com
- Consider adding `font-display` (Cormorant Garamond) for the main headline for maximum impact

---

## Phase B: Testimonials Elevation

### Tasks
- [x] B1. Add aggregate credibility header above testimonials: "15+ projets livrés · 4.9/5 satisfaction · 5 secteurs"
- [x] B2. Redesign metric badge — move to card top, larger font, warm background accent
- [x] B3. Add "Avant:" context line per testimonial for before/after framing

### Technical Details
- File: `client/src/components/landing/TestimonialsSection.tsx`
- Aggregate header: centered, uses `text-sablia-sienna` for numbers, `text-sablia-text-secondary` for labels
- Metric badge redesign: `bg-sablia-sienna/10 text-sablia-sienna text-lg font-bold` at top of card

---

## Phase C: Replace Logos → Service Cards (Langdock-style)

### Tasks
- [x] C1. Remove current LogosCloud component content
- [x] C2. Build new "Nos expertises" horizontal card layout (4 cards: Audit, Formation, Automatisation, Agents IA)
- [x] C3. Style cards with Langdock-inspired pattern: warm tinted backgrounds, icon + title + short description + arrow CTA
- [x] C4. Add horizontal scroll on mobile, static grid on desktop

### Technical Details
- File: `client/src/components/landing/LogosCloud.tsx` → rename/rewrite as `ExpertiseCards.tsx` or reuse the file
- Desktop: 4-column grid with equal card heights
- Mobile: horizontal scroll with `overflow-x: auto` + `snap-x` for native scroll snapping
- Each card: `bg-sablia-surface` with a colored left border (sienna for Audit, navy for Formation, etc.)
- On click: smooth scroll to `#pricing` or `#contact`
- Remove HoverCard import (no longer needed)

---

## Phase D: Problem + Solution Merge

### Tasks
- [x] D1. Create new unified "Transformation" component replacing both ProblemSection and SolutionSection
- [x] D2. Design before/after layout: 3 rows, each with problem (left) → solution (right)
- [x] D3. Add a named problem phrase as section header ("Le Syndrome du Copier-Coller")
- [x] D4. Update Landing.tsx to use new component instead of separate Problem + Solution

### Technical Details
- New file or merge into existing: `client/src/components/landing/TransformationSection.tsx`
- Desktop: 2-column grid per row (problem left, solution right) with a visual divider/arrow
- Mobile: stacked with clear visual transition (problem card → arrow → solution card)
- Background: single section with `bg-sablia-surface`
- Keep framer-motion `whileInView` for stagger animations
- Remove or repurpose `ProblemSection.tsx` and `SolutionSection.tsx`

---

## Phase E: ROI Calculator Simplification

### Tasks
- [x] E1. Reduce inputs from 4 to 2 (hours/week slider + hourly cost slider)
- [x] E2. Replace number inputs with range sliders styled in sablia palette
- [x] E3. Redesign results panel: large animated numbers, contextual comparison, fixed 1,500€ investment frame
- [x] E4. Add micro-testimonial anchor below results

### Technical Details
- File: `client/src/components/landing/CalculatorROI.tsx`
- Slider: native `<input type="range">` with custom Tailwind styling (thumb + track colors)
- Calculation: `hoursSaved = hoursPerWeek * 0.7 * 48` (70% efficiency, 48 work weeks)
- `annualSavings = hoursSaved * hourlyCost`
- `roi = ((annualSavings - 1500) / 1500) * 100`
- Count-up animation: use `useEffect` + `requestAnimationFrame` for smooth counting
- Results card: `bg-sablia-accent/[0.04]` with large `text-sablia-sienna` for the main number
- Comparison: compute equivalent work days (`hoursSaved / 7`)

---

## Verification Checklist

- [x] `npm run build` passes with no errors
- [x] `npm run check` passes TypeScript (pre-existing errors only)
- [x] Playwright visual validation: hero, testimonials, service cards, transformation, calculator
- [x] Mobile validation (390px viewport)
- [x] All CTAs scroll to correct sections
- [x] IAPreneurs link works (target="_blank" rel="noopener")
- [x] Schema.org markup preserved on testimonials
- [x] No broken SVG or missing images

---

## Next Step

```
/execute landing-page-refinements
```
