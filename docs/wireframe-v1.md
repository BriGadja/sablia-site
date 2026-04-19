---
name: wireframe-v1
description: Frozen section-by-section homepage structure for sablia.io acquisition machine v1. No visual design, no copy text, structural contract for Phase C (copy) and eventual claude.ai/design handoff.
version: 2
status: frozen
frozen_at: 2026-04-19
frozen_by: brice@sablia.io
source_product: docs/product-v1.md
source_brief: research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md
source_plan: plans/sablia-site-acquisition-predesign.md
---

# Homepage Wireframe v1, sablia.io

Section-by-section structure for the new homepage. Single primary CTA: `#diagnostic-form`. Secondary fallback: Calendly text link. All pricing moves off the homepage except for one entry-path price floor (1 500€ HT on the Formation card). The 2 500€/mois et 5 000€ paths restent discutés en 1-to-1 (French B2B expectation).

## Audit, Current state (baseline, 2026-04-18)

| Axis | Before | Target |
|------|--------|--------|
| Sections on `Landing.tsx` | 10 + 1 lazy Calendly | 7-9 |
| User-facing CTAs | 9 (Hero ×2, LogosCloud ×4, TransformationSection ×1, PricingSection ×1, CalculatorROI ×1) | 2 max (1 primary + 1 secondary) |
| Testimonials | 5 (Hélène, Directeur, Yassine, Valentin, Amir) | 3 (selection rule below) |
| Pricing grid on homepage | 9-offer grid in PricingSection | Removed (stays on `/tarifs` only) |
| Calendly embed on homepage | Inline in ContactFormSection | Removed (text link in hero + footer band) |

Net effect: **7+ CTAs removed**, 2 sections deleted, 1 section reduced, 1 widget removed, 2 new sections created.

## 1. Section stack (new homepage)

Exactly **9 sections** from top to bottom. Each section has a **purpose**, **content slots**, and **behavioral rules**. Copy text is in `docs/copy-v1.md`, not here.

### 1. Hero

- **Purpose**: position in < 5 seconds, trigger scroll to `#diagnostic-form`
- **Content slots**:
  - H1 (outcome, ≤10 words)
  - Sub (outcome + deliverable + timeframe, ≤25 words)
  - Credential line (Phase A A5 title + IAPreneurs credit, verbatim from `product-v1.md §5`)
  - Primary CTA button: verb + outcome + 490€
  - Secondary text link → Calendly (tone: "préférer en discuter d'abord")
- **Behavioral rules**:
  - Primary CTA scrolls to `#diagnostic-form` via smooth-scroll (NOT external link, NOT Calendly direct)
  - Above-fold single-CTA rule: on mobile (390px viewport), only the primary CTA must be visible without scroll
  - Credential `<a>` keeps existing `target="_blank"` + `rel="noopener noreferrer"`
  - IAPreneurs affiliate link preserved verbatim : `https://www.iapreneurs.com/?affiliate_code=8b6eda`

### 2. Social proof strip

- **Purpose**: visual reassurance, not conversion
- **Content slots**:
  - 3-5 client logos (logos TBD, candidates: Nestenn, Qwertys, Stefano, Norloc, GirlsGang, CER)
  - 1 key metric line below logos (optional, e.g. "X clients accompagnés · Y% gagnés sur les process audités")
- **Behavioral rules**:
  - **No links, no buttons, no CTAs**, pure visual strip
  - `ClientLogosStrip.tsx` new component (see §5 file map), old `LogosCloud.tsx` is deleted
  - Logos greyed out at rest, light hover reveal for polish (design phase decides exact treatment)

### 3. Le problème

- **Purpose**: name the PME pain in 2-3 lines; set up the diagnostic as the solution
- **Content slots**:
  - H2 (≤8 words, pain-named)
  - Body (2-3 lines, ≤80 words, outcome-tied)
- **Behavioral rules**:
  - NEW section, no reused component, fresh markup (no CTAs, no links)
  - Visual role: contrast background from Hero, sets emotional tension before "Le diagnostic"

### 4. Le diagnostic

- **Purpose**: explain the Diagnostic Sablia concretely, what it is, what you get
- **Content slots**:
  - H2 (≤8 words)
  - 2-3 short paragraphs (≤80 words each)
  - Inline reference to deliverable: "PDF de 10-15 pages"
  - Inline reference to timeline: "en 5 jours ouvrés"
  - Price mention: "490€ HT"
  - Credit mention (close to price, 1 phrase): "déduits de la première facture si vous signez un contrat Développement ou Accompagnement dans les 90 jours"
- **Behavioral rules**:
  - References `product-v1.md §2` verbatim for price/format/deliverable
  - No CTA in-section (CTA is the floating hero + footer band)

### 5. Ce que révèle votre diagnostic

- **Purpose**: surface the 3 post-audit paths as outcome-oriented cards, NO direct CTA
- **Content slots**: 3 cards, each:
  - Title (1 of the 3 paths, verbatim from `product-v1.md §3`)
  - 2-line intro (what this path does)
  - 2-3 bullets "ce que votre équipe peut faire après"
  - Price floor **uniquement sur Card 1** (1 500€ HT, entry path). Card 2 et Card 3 : pas de prix sur homepage, discuté en 1-to-1.
- **Card 1**: Formation d'équipes internes, *"À partir de 1 500€ HT"*
- **Card 2**: Accompagnement (pas de prix affiché)
- **Card 3**: Développement (pas de prix affiché)
- **Behavioral rules**:
  - NEW component `WhatRevealsSection.tsx` (see §5 file map)
  - **NO CTA on any card**, **NO links**, **NO `/tarifs` link in this release** (per plan C7: `/tarifs` still has old grid, would contradict homepage positioning)
  - Price floors embedded in-card replace the `/tarifs` teaser

### 6. Témoignages

- **Purpose**: credibility via ROI-quantified voices
- **Content slots**: exactly **3 testimonials** (down from current 5)
- **Selection rule**: ≥2 of the 3 MUST include quantified ROI evidence (time saved, revenue delta, cost cut)
- **Candidates (rank by ROI evidence)**: Yassine (Norloc), Valentin (Stefano/Exotic Design), Amir (BTP), Hélène (GirlsGang), Directeur (anonyme)
- **Behavioral rules**:
  - MODIFY `TestimonialsSection.tsx`, trim testimonials array from 5 → 3
  - Update schema.org `reviewCount: '5'` → `reviewCount: '3'` accordingly
  - No in-card CTA

### 7. ROI calculator

- **Purpose**: interactive proof that automation ROI can be measured
- **Content slots**: existing `CalculatorROI.tsx` sliders/outputs
- **Behavioral rules**:
  - MODIFY `CalculatorROI.tsx`: change default investment constant from 1500€ to **490€** (matches the diagnostic entry point)
  - Efficiency default stays at 70%
  - Keep existing interactive visuals

### 8. FAQ

- **Purpose**: remove friction on the 4-6 most common objections
- **Content slots**: 4-6 diagnostic-focused Q&As + 1 "Sablia vs IAPreneurs" Q
- **Required questions**:
  - Prix & justification (490€ HT + mécanisme de crédit post-audit)
  - Timeline (5 jours ouvrés)
  - Pour qui (PMEs 10-250 salariés avec process manuel 5h+/sem)
  - Ce qui se passe après
  - Politique de remboursement
  - Pourquoi payant et pas gratuit (framing rule: risk-reduction, wrong-path cost avoidance)
  - Sablia vs IAPreneurs (uses `product-v1.md §6` statement verbatim)
- **Behavioral rules**:
  - MODIFY `FaqSection.tsx`, replace existing 24-question scope with diagnostic-focused set
  - Accordion kept, styling unchanged

### 9. Footer CTA band

- **Purpose**: final conversion opportunity for visitors who scrolled past the hero without clicking
- **Content slots**:
  - Short final nudge line (≤15 words)
  - Primary CTA button: "Démarrer mon diagnostic, 490€" → scrolls to `#diagnostic-form`
  - Secondary text link: Calendly
- **Behavioral rules**:
  - NEW markup, can be a new component `FooterCTABand.tsx` OR merged into `Footer.tsx` above the standard footer links
  - Calendly fallback is the ONLY other Calendly surface on the page (removed from ContactFormSection)

## 2. CTA rules (locked)

1. **Total CTAs on homepage**: **2 max**, 1 primary diagnostic + 1 secondary Calendly. Down from 9 currently.
2. **Hero primary CTA**: scrolls to `#diagnostic-form`. NOT Calendly direct. NOT external link.
3. **Calendly**: appears only as a text link, in hero secondary position AND in footer band. Never as an inline widget on the homepage.
4. **PricingSection**: removed from `Landing.tsx`. Remains at `/tarifs` (untouched in this release).
5. **LogosCloud expertise cards**: deleted. Replaced by pure logo strip (no links anywhere).
6. **ThreeStepProcess**: deleted. Its intent is carried by §3 (Le problème) + §4 (Le diagnostic).
7. **Single CTA above-fold on mobile**: the primary CTA must be the only interactive button visible on a 390px viewport without scroll.

## 3. DiagnosticForm mechanics (`#diagnostic-form`)

New component `DiagnosticForm.tsx`. Submit is the core funnel event.

### Fields, **4 champs max**

| # | Field | Type | Required | Validation |
|---|-------|------|----------|------------|
| 1 | `nom` | text | ✓ | non-empty, ≥2 chars |
| 2 | `email` | email | ✓ | valid RFC email |
| 3 | `entreprise` | text | ✓ | non-empty |
| 4 | `processus_couteux` | textarea | ✗ | optional; label: *"Quel process vous coûte le plus de temps ?"* |

Plus: honeypot field `website` (hidden, must be empty) + RGPD consent checkbox (required).

### Schema

- Zod schema colocated with the component (`DiagnosticForm.tsx` next to `diagnostic-form.schema.ts` OR inline, keep colocation)
- Use `safeParse()` (per frontend rules)
- Error format: `{ error: string, code?: string }`

### Submit behavior

- **Endpoint**: new `WEBHOOK_DIAGNOSTIC` (URL TBD, Brice creates new n8n workflow `sablia-site-diagnostic`). Add `WEBHOOK_DIAGNOSTIC` constant to `client/src/lib/form-constants.ts` once workflow is live.
- Not reusing `WEBHOOK_CONTACT`, clean funnel metrics + separate n8n routing for diagnostic-specific downstream (intake form, Stripe link, calendar booking).
- **Redirect on success**: `/thank-you?source=diagnostic`
- **On error**: inline error display with `{ error, code }` format, no redirect
- Honeypot failure → silent discard (no user feedback, looks like success to bot)

### Downstream (future, not this release)

The new n8n workflow should eventually:
- Send intake form link to visitor
- Create Stripe payment link
- Notify Brice
- Book a 15-min intake call slot
Not in scope for Phase B wireframe, just document the endpoint contract here.

## 4. Sections deleted / reduced / widget removed

- **DELETE from homepage**: `PricingSection` (stays on `/tarifs`), Calendly inline widget (from `ContactFormSection`)
- **REDUCE**: `TestimonialsSection` (5 → 3 per selection rule above), `FaqSection` (scope trimmed to diagnostic-focused + Sablia vs IAPreneurs)
- **REPLACE**: `LogosCloud` (4 expertise cards + 4 links) → `ClientLogosStrip.tsx` (pure logos, no links)
- **DELETE component**: `ThreeStepProcess.tsx` (new §3 + §4 subsume intent)
- **DELETE component**: `ContactFormSection.tsx` (Calendly moves to secondary link in hero + footer band; no separate contact form, only `DiagnosticForm`)

## 5. Scoped file map

### MODIFY

- `client/src/pages/Landing.tsx`, new section stack per §1
- `client/src/components/landing/HeroSection.tsx`, copy, credential, CTAs (see copy-v1.md)
- `client/src/components/landing/TestimonialsSection.tsx`, 5 → 3 reduction, schema.org reviewCount
- `client/src/components/landing/CalculatorROI.tsx`, default investment 1500 → 490
- `client/src/components/landing/FaqSection.tsx`, diagnostic focus + Sablia vs IAPreneurs Q
- `client/src/lib/form-constants.ts`, add `WEBHOOK_DIAGNOSTIC` constant

### CREATE

- `client/src/components/landing/DiagnosticForm.tsx` (+ colocated Zod schema)
- `client/src/components/landing/WhatRevealsSection.tsx`
- `client/src/components/landing/ClientLogosStrip.tsx`
- `client/src/components/landing/FooterCTABand.tsx` (OR inline into Footer, decision at implementation time)

### DELETE

- `client/src/components/landing/LogosCloud.tsx`
- `client/src/components/landing/ThreeStepProcess.tsx`
- `client/src/components/landing/ContactFormSection.tsx`
- Current `PricingSection` import/render from `Landing.tsx` (component stays at `/tarifs`)

### UNTOUCHED

- `client/src/components/Navigation.tsx`
- `client/src/App.tsx` (route map unchanged, `/gap` kept for ad campaigns, all other routes kept)
- `client/src/pages/GapForm.tsx` (kept for ad LP: cold email + `/lp/*` routes reference it)
- `client/src/pages/Tarifs.tsx` / existing `PricingSection.tsx` (current grid preserved at `/tarifs`)

## 6. Accessibility & responsive constraints

- **Mobile single-CTA (390px viewport)**: primary CTA button visible above-fold without scrolling; no other button within the first viewport
- **Credential line**: no truncation on 320px-width devices, if credential line would overflow, wrap to 2 lines, don't ellipsis
- **Calendly secondary link**: must have explicit `aria-label="Réserver un créneau de discussion avec Brice sur Calendly"`
- **DiagnosticForm focus order**: nom → email → entreprise → processus_couteux → RGPD checkbox → submit. Honeypot `website` field must be `tabindex="-1"` and `aria-hidden="true"`
- **Price floors in §5 cards**: must meet WCAG AA contrast (≥4.5:1) against card background

## 7. Validation against Phase A

Cross-reference check, every Phase A product decision is reflected in this wireframe:

| Phase A decision | Reflected in wireframe |
|---|---|
| Product name "Diagnostic Sablia" | §1 (Hero copy slot), §4 (Le diagnostic), §9 (footer CTA) |
| 490€ HT price + crédit post-audit | §4 (inline), §9 (CTA button label), §8 FAQ |
| 5 jours ouvrés turnaround | §4 (inline), §8 FAQ |
| 3 post-audit paths + 1 price floor (formation 1 500€ HT) | §5 (3 cards) |
| Capacity 4-6/mo | §8 FAQ (optional, implicit via "pour qui") |
| Brice's title "Responsable Pédagogique et Coach Développement IA" | §1 (credential slot) |
| IAPreneurs credential (500+ members, 200k+ YouTube) | §1 (credential slot) |
| Sablia vs IAPreneurs statement | §8 FAQ (verbatim from product-v1.md §6) |
| No "partners" framing | §8 FAQ (enforced in copy) |

## Changelog

- **v2 (2026-04-19)** : sync avec `product-v1.md` v2 — prix 990€ → 490€ (hero CTA, §4 inline, §8 FAQ requis, §9 footer CTA, §7 CalculatorROI default), ajout mention "crédit 490€ si signature Dév/Accomp. dans 90j" dans §4 content slots + §8 FAQ requise + validation table.
- **v1 (2026-04-18)** : création initiale, freeze après résolution des 3 HITL Phase B (B4 nouveau endpoint, B2 delete+create ClientLogosStrip, B6 delete ThreeStepProcess). Sortie de `/execute sablia-site-acquisition-predesign` Phase B. Phase C autorisée à démarrer.
