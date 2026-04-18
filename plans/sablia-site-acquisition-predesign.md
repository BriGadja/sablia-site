# Plan — Sablia Site: Acquisition Machine Pre-Design Package

**Status**: New — 3 phases — challenging...
**Brief**: `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` (amended 2026-04-18, positioning option C locked)
**Research**: `research/plan/2026-04-18-sablia-site-acquisition-predesign.md`
**Confidence**: 8/10 (one-pass success likely; HITL gates documented)
**Scope**: Narrow (pre-design path). Units 3-6 from brief (pricing page full redesign, hub pages, case studies, content cadence) planned in separate /plan passes later.

---

## Scope

Produce the three pre-design deliverables required to hand off to `claude.ai/design` with frozen inputs:

- **Phase A — Product Definition**: lock "Diagnostic Sablia" SKU (price, scope, deliverable, ops) + lock the 3 post-audit paths in `docs/product-v1.md`
- **Phase B — Homepage Structure & Wireframe**: define section-by-section stack + CTA hierarchy + form mechanics in `docs/wireframe-v1.md`
- **Phase C — Copy & Storytelling Package**: write every word the visitor reads (hero, narrative arc, pricing teaser, pillar stubs, FAQ, tone glossaire) in `docs/copy-v1.md`, frozen by Brice HITL

**Out of scope** (planned separately later): visual design (external: claude.ai/design), code implementation (/frontend-design), full `/tarifs` page redesign, hub pages `/automatisations` `/agents-vocaux` `/sites-web`, case studies pages, content cadence Q2-Q4, cold email retargeting, Elorri/Formation IA Normandie integration.

## Anchor Decisions (locked inputs from brief + research)

| Decision | Value | Source |
|---|---|---|
| Positioning | Coach-Implémenteur (option C) | Brief amendment 2026-04-18 + Agent C GREEN verification |
| Price | **990€ HT** | Agent A: fills uncontested French market gap, stays under 1000€ dirigeant-unilateral threshold |
| Brice's IAPreneurs title | **Responsable Pédagogique IA** | Agent C — verified on iapreneurs.com (NOT "coach") |
| IAPreneurs affiliate link | `https://www.iapreneurs.com/?affiliate_code=8b6eda` (live at `HeroSection.tsx:66`) | Yassine validated 2026-04-18 |
| 3 post-audit paths | formation d'équipes internes / accompagnement / développement | Brief amendment; "formation" seul proscrit |
| Stack | React 18 + Vite + Wouter + Tailwind v3 + Framer Motion + shadcn (no migration) | Brief constraint |
| Tokens | sienna / navy / cream palette preserved | Brief constraint |

---

## Phase A — Product Definition (Diagnostic Sablia SKU)

**Goal**: Freeze the productized SKU so Phase C can reference concrete, locked specs.

**Deliverable**: `docs/product-v1.md`

### Tasks

- **A1**. Product name HITL. Brief placeholder is "Diagnostic Sablia". Draft 3 variants (e.g. "Diagnostic Sablia", "Diagnostic IA Sablia", "Diagnostic Implémentation IA"). Brice picks one. Document rationale in `docs/product-v1.md` header.
- **A2**. Write SKU spec in `docs/product-v1.md`:
  - Name: from A1
  - Price: 990€ HT
  - Format: 30-min intake (async form + 15-min call) → 3h deep-dive synchronous → 1h restitution
  - Deliverable: 10-15 page PDF (process map + AI implementation opportunities + 90-day roadmap + recommendation for which post-audit path + pricing estimate for implementation)
  - Turnaround: 5 business days from intake to restitution
  - Payment: upfront. Stripe + virement accepted
  - Cancellation: 72h before intake = refund; after intake = non-refundable
  - Facture legale: TVA mention (SASU vs auto-entrepreneur — see Open Q #2)
- **A3**. Write 3 post-audit paths specs in `docs/product-v1.md` — each spec figes:
  - **Formation d'équipes internes**: upskilling client team on specific AI/automation skills. Duration 1-3 jours. Price range 1500-4500€ HT. Deliverable = curriculum + hands-on workshops + recorded module library. NOT a full academy — always qualified scope.
  - **Accompagnement**: embedded coaching of one client sponsor for 4-12 semaines. Price range 2500-4000€/mois. Deliverable = weekly 1h call + async Slack + template library access.
  - **Développement**: build automations (n8n / voice agents Dipler / webapps). Duration 2-12 semaines. Price range 5000-25000€ project + optional 2500-5000€/mois retainer. Deliverable = shipped automations + handoff docs.
- **A4**. Capacity model: lock 4-6 diagnostics/month max (hypothesis). Validate against Qwertys 6j/mois retainer commitment. Document in `docs/product-v1.md` "Operations" section.
- **A5**. **HITL — IAPreneurs figure + exact title treatment**. Two sub-decisions coupled:
  (a) **Figure**: pick ONE of:
  - (i) Verify exact paid-academy size with Yassine (primary source), cite with footnote
  - (ii) Drop the number, use "membre de l'équipe pédagogique IAPreneurs"
  - (iii) Pivot to Yassine's verified reach: "IAPreneurs — communauté francophone de formation IA fondée par Yassine Sdiri (160k abonnés YouTube)"
  (b) **Title reconciliation**: current live site (`HeroSection.tsx` lines 63-73) uses *"Resp. Pédagogique & Expert IA"* (abbreviated). Brief amendment / research recommends *"Responsable Pédagogique IA"* (full form, official per iapreneurs.com). Pick ONE canonical form — will be used verbatim everywhere. Default recommendation: full form "Responsable Pédagogique IA" (stronger, matches official).
  Lock both choices in `docs/product-v1.md`, used verbatim in Phase C.
- **A6**. Differentiation paragraph for Sablia vs IAPreneurs (GREEN-zone, audience/depth/purpose axes). Uses Agent C's templates. Lock in `docs/product-v1.md` → used verbatim in Phase C FAQ.
- **A7**. **Elorri / Formation IA Normandie boundary HITL** (resolves Open Q #7). Required before A3 can finalize the "Formation d'équipes internes" path spec. Brice must confirm: (i) Is Elorri a co-delivery partner for Sablia formation contracts? (ii) Does Elorri's Qualiopi certification underwrite Sablia formation invoices? (iii) Is there any content or audience overlap that requires a carve-out? Output: 1-paragraph boundary statement in `docs/product-v1.md` section "Partenariats formation" that Phase C C4/C6 copy can reference without ambiguity.

### Verification Constraints (A)
| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| file-exists | docs/product-v1.md | File created | `test -f docs/product-v1.md` |
| contains | docs/product-v1.md | 990€ price anchor present | `grep -q "990" docs/product-v1.md` |
| contains | docs/product-v1.md | All 3 post-audit paths named | `grep -cE "Formation d.équipes internes\|Accompagnement\|Développement" docs/product-v1.md` → `test $(grep -cE "Formation d.équipes internes|Accompagnement|Développement" docs/product-v1.md) -ge 3` |
| contains | docs/product-v1.md | Official title used | `grep -q "Responsable Pédagogique" docs/product-v1.md` |
| contains | docs/product-v1.md | No IA Booster mention | `! grep -qi "IA Booster" docs/product-v1.md` |
| contains | docs/product-v1.md | Sablia-vs-IAPreneurs differentiation paragraph | `grep -qi "IAPreneurs" docs/product-v1.md` |

---

## Phase B — Homepage Structure & Wireframe

**Goal**: Define section-by-section homepage stack + CTA hierarchy + form mechanics. Structure only, no visual design, no copy text.

**Deliverable**: `docs/wireframe-v1.md`

### Tasks

- **B1**. Audit current `Landing.tsx` against new rules. Current state (verified against codebase 2026-04-18): **10 sections + 1 lazy Calendly widget; 9 user-facing CTAs = Hero (×2) + LogosCloud expertise cards (×4) + TransformationSection (×1) + PricingSection (×1) + CalculatorROI (×1)**. Target: 7-9 sections, 1 primary CTA (hero), 1 secondary fallback (Calendly link). Net removal: 7+ CTAs.
- **B2**. Produce `docs/wireframe-v1.md` — section stack with purpose + content slots + behavioral rules:
  1. **Hero**: H1 + sub + credential line + 1 primary CTA button + 1 secondary text link (Calendly)
  2. **Social proof strip**: 3-5 client logos + 1 key metric. Current `LogosCloud.tsx` is NOT actually a logo cloud — it's 4 expertise cards with links (Diagnostic Express / Vos équipes autonomes / Workflows sur mesure / Agents IA). Decision: either (i) gut `LogosCloud.tsx` and convert to pure logo strip (keeping the name is fine) OR (ii) delete `LogosCloud.tsx` entirely and create a new `ClientLogosStrip.tsx`. Lock in wireframe doc B2.
  3. **Le problème**: 2-3 line naming PME pain (NEW section — may reuse `TransformationSection.tsx`)
  4. **Le diagnostic**: what it is + what it delivers (references product-v1.md verbatim)
  5. **Ce que révèle votre diagnostic**: 3 cards (formation d'équipes internes / accompagnement / développement) — outcomes only, NO CTAs, NO prices (NEW component `WhatRevealsSection.tsx`)
  6. **Témoignages**: reduce current 5 → 3 strongest (modify `TestimonialsSection.tsx`). **Selection rule**: ≥2 of the 3 must include ROI-quantified evidence (time saved, revenue delta, cost cut). Purely qualitative testimonials are last-priority. Verified 2026-04-18 against `TestimonialsSection.tsx` testimonials array + schema.org `reviewCount: '5'`: 5 entries = Hélène (GirlsGang), Directeur (anonyme), Yassine (Norloc), Valentin (Stefano/Exotic Design), Amir (BTP).
  7. **ROI calculator**: keep `CalculatorROI.tsx`, update default investment constant from 1500€ to 990€ (matches the diagnostic), efficiency stays 70%
  8. **FAQ**: 4-6 diagnostic-focused Q&A + 1 "Sablia vs IAPreneurs" Q (modify `FaqSection.tsx`)
  9. **Footer CTA band**: final diagnostic CTA + Calendly fallback (NEW component or merged into `Footer.tsx`)
- **B3**. CTA rules (locked):
  - **Hero CTA** (primary): scrolls to `#diagnostic-form` (NOT Calendly direct)
  - **Calendly fallback**: secondary link in hero text, also surfaced in footer band
  - **PricingSection** on homepage: REMOVE entirely from `Landing.tsx`. Pricing moves to `/tarifs` (which keeps the current `PricingSection.tsx`). Homepage no longer shows 3-column pricing.
  - **LogosCloud** expertise cards: REMOVE 4 cards' links (→ #contact / #pricing). Turn into pure visual logo strip.
  - Total CTAs on new homepage: **2 max** (1 primary diagnostic + 1 secondary Calendly). Currently ~9 per B1 count.
- **B4**. Form mechanics for `#diagnostic-form` — new component `DiagnosticForm.tsx`:
  - ≤ 4 fields: `nom`, `email`, `entreprise`, `processus_couteux` (textarea, optional, label: "Quel process vous coûte le plus de temps ?")
  - Honeypot field `website` (hidden)
  - RGPD consent checkbox (required)
  - Submit target: **HITL decision** — either new `WEBHOOK_DIAGNOSTIC` endpoint OR reuse `WEBHOOK_CONTACT` with `source: "diagnostic"` discriminator. Lock in wireframe doc; Brice creates n8n workflow if option A.
  - Redirect on success: `/thank-you?source=diagnostic`
  - Zod schema location: alongside component
- **B5**. Sections to DELETE from homepage: PricingSection. Sections to REDUCE: TestimonialsSection (5→3), FaqSection (current scope → diagnostic-focused). Sections to REMOVE INLINE WIDGET: Calendly inline embed in `ContactFormSection` → moved to secondary hero link + footer only.
- **B6**. Scoped file map (for Phase C reference + later implementation):
  - **MODIFY**: `Landing.tsx` (section stack), `HeroSection.tsx` (copy, credential, CTAs), `TestimonialsSection.tsx` (5→3 reduction), `CalculatorROI.tsx` (default investment 1500→990€), `FaqSection.tsx` (diagnostic focus + Sablia vs IAPreneurs Q), `PricingSection.tsx` (stays at `/tarifs` only, removed from Landing)
  - **MODIFY or DELETE (HITL)**: `LogosCloud.tsx` (gut to pure logo strip OR delete and create `ClientLogosStrip.tsx` — lock in B2), `ThreeStepProcess.tsx` (currently rendered between LogosCloud and PricingSection; the new section stack subsumes its intent via "Le problème" + "Le diagnostic" — recommend DELETE unless it carries reusable content)
  - **CREATE**: `DiagnosticForm.tsx`, `WhatRevealsSection.tsx`
  - **DELETE**: `ContactFormSection.tsx` (replaced by DiagnosticForm, Calendly moves to footer/secondary link)
  - **UNTOUCHED**: `Navigation.tsx`, routes (`App.tsx`), `GapForm.tsx` (kept at `/gap` for ad campaigns per brief: cold email + `/lp/*` routes reference it)
- **B7**. Document the 2-4 accessibility/responsive constraints: single CTA visible above-fold on mobile viewport (390px width), credential line readable without truncation, Calendly link has aria-label, form focus order.

### Verification Constraints (B)
| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| file-exists | docs/wireframe-v1.md | File created | `test -f docs/wireframe-v1.md` |
| count-check | docs/wireframe-v1.md | At least 7 numbered sections listed | `test $(grep -cE "^[0-9]+\. " docs/wireframe-v1.md) -ge 7` |
| contains | docs/wireframe-v1.md | Single-CTA rule explicit | `grep -qE "1 primary CTA\|un seul CTA\|single CTA" docs/wireframe-v1.md` |
| contains | docs/wireframe-v1.md | Lists MODIFY / CREATE / DELETE buckets | `grep -qE "MODIFY\|CREATE\|DELETE" docs/wireframe-v1.md` |
| contains | docs/wireframe-v1.md | DiagnosticForm spec ≤4 fields | `grep -q "DiagnosticForm" docs/wireframe-v1.md && grep -q "4 fields\|4 champs" docs/wireframe-v1.md` |
| contains | docs/wireframe-v1.md | Frozen frontmatter present (gates Phase C) | `grep -q "status: frozen" docs/wireframe-v1.md` |
| count-check | client/src/pages/Landing.tsx | Still exists (read-only this phase) | `test -f client/src/pages/Landing.tsx` |

---

## Phase C — Copy & Storytelling Package

**Goal**: Every word of the new homepage, frozen. Becomes the contractual input for claude.ai/design.

**Deliverable**: `docs/copy-v1.md` with frontmatter `status: frozen` once Brice validates.

**Phase gate**: Phase C CANNOT start until `docs/wireframe-v1.md` has frontmatter `status: frozen` AND Brice has validated Phase B B3/B5 section stack. Reason: copy is written *into* the wireframe's section structure — if section ordering shifts mid-C, narrative arc rewrites. If wireframe needs changes after C begins, pause C, amend wireframe, diff-check which C sections lose integrity, resume C only on unaffected sections.

### Tasks

- **C1**. Positioning statement — 1 line, ≤120 chars. Draft 3 variants. Anchor = coach-implémenteur. Brice picks.
  Example direction: *"Pour les PME qui veulent intégrer l'IA dans leurs opérations — par le Responsable Pédagogique IA qui forme les consultants IA de demain chez IAPreneurs."*
- **C2**. Hero package — 3 complete variants. Each variant:
  - H1 ≤10 words
  - Sub ≤25 words, outcome-tied (1 concrete deliverable + timeframe)
  - Credential line uses Phase A A5-locked title + Phase A A6-locked differentiation
  - Primary CTA: verb + outcome + 990€ (e.g. "Démarrer mon diagnostic — 990€")
  - Secondary link: outcome-tied ("Préférer en discuter d'abord →" → Calendly)
  Brice picks 1 final, alternates archived in `docs/copy-v1.md` appendix.
- **C3**. Narrative arc below-fold — 1 section per B2 wireframe entry 3-9. Each:
  - H2 ≤8 words
  - Body ≤80 words, deliverable-tied ("vous recevez X en Y jours"), NOT activity-tied ("je fais X")
  - Optional visual hint (for claude.ai/design)
- **C4**. "Ce que révèle votre diagnostic" copy — 3 cards. Each card: title + 2-line intro + 2-3 "ce que votre équipe peut faire après" bullets + **1-line price floor** (per C7 decision: no `/tarifs` link in release, price floors surfaced here instead). NO CTA on cards.
  - Card 1 (Formation d'équipes internes): + *"À partir de 1 500€ HT"* price floor
  - Card 2 (Accompagnement): + *"À partir de 2 500€/mois"* price floor
  - Card 3 (Développement): + *"À partir de 5 000€"* price floor
- **C5**. Sablia vs IAPreneurs FAQ entry. Use Agent C GREEN-zone templates:
  - Q: "En quoi Sablia est-il différent d'IAPreneurs ?"
  - A: audience / depth / purpose axes. Sample opener: *"IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'IA. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients — Brice exerce simplement les deux rôles."* NEVER use "partners" or "complémentaires".
- **C6**. 4-6 diagnostic-focused FAQs: price (990€ HT, justification), timeline (5 jours ouvrés), pour qui ("PMEs 10-250 salariés qui ont au moins 1 process manuel coûtant 5h+/semaine"), ce qui se passe après, politique de remboursement, **pourquoi payant et pas gratuit**. Framing rule for the "pourquoi payant" answer: lead with **risk-reduction and wrong-path cost avoidance** (*"un audit gratuit dure 30 min et recommande ce que le prestataire vend ; un diagnostic payant 5 jours cartographie vos process et peut conclure qu'aucune implémentation IA n'est pertinente — on préfère qu'on vous dise ça plutôt qu'on vous vende une solution qui ne marche pas"*), NOT with seller-centric justifications like "mon temps coûte cher". Target reader: dirigeant skeptical of consultant-speak.
- **C7**. **Pricing surfacing on homepage — NO `/tarifs` link in this release.** Rationale: current `/tarifs` page still renders the old 9-offer grid (redesign = future plan), so linking visitors there creates a contradictory experience vs new homepage positioning. Solution: embed **price floors directly on the 3 "Ce que révèle votre diagnostic" cards** from C4. Each card adds a 1-line price floor: *"À partir de 1 500€ HT"* (formation), *"À partir de 2 500€/mois"* (accompagnement), *"À partir de 5 000€"* (développement). When the future `/tarifs` redesign ships, a link is added back via a separate plan.
- **C8**. Tone glossaire — rules for all future Sablia content:
  - **Proscribed**: "formation" seul (always qualified "formation d'équipes internes"), "IA Booster", "IA" en hero (preferable: "intelligence artificielle" first mention, "IA" ensuite), "agence IA", "Dipler" if content shared with IAPreneurs
  - **Required**: outcome-tied CTA verbs ("Démarrer", "Recevoir", NOT "Cliquer"), tous prix en HT explicites, singular hero rule (1 message, 1 CTA)
  - **Tutoiement/vouvoiement** — HITL Brice decision (current site uses vouvoiement — keep unless shift decided)
  - Duplicate glossaire to `CLAUDE.md` at end of session
- **C9**. HITL review cycle — Brice reads `docs/copy-v1.md` end-to-end. ≥1 revision pass. Once validated, set frontmatter:
  ```
  status: frozen
  frozen_at: YYYY-MM-DD
  frozen_by: brice@sablia.io
  ```

### Verification Constraints (C)
| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| file-exists | docs/copy-v1.md | File created | `test -f docs/copy-v1.md` |
| contains | docs/copy-v1.md | Frozen frontmatter | `grep -q "status: frozen" docs/copy-v1.md` |
| contains | docs/copy-v1.md | Hero section present | `grep -qiE "^## hero\|^# hero\|^### hero" docs/copy-v1.md` |
| contains | docs/copy-v1.md | Sablia vs IAPreneurs FAQ | `grep -q "IAPreneurs" docs/copy-v1.md && grep -qE "différent\|différence" docs/copy-v1.md` |
| contains | docs/copy-v1.md | No IA Booster | `! grep -qi "IA Booster" docs/copy-v1.md` |
| contains | docs/copy-v1.md | 990 price present | `grep -q "990" docs/copy-v1.md` |
| contains | docs/copy-v1.md | Uses official title | `grep -q "Responsable Pédagogique" docs/copy-v1.md` |
| contains | docs/copy-v1.md | "partners" framing absent | `! grep -qE "partenaires?\|partners?\|complémentaires?" docs/copy-v1.md` |
| contains | docs/copy-v1.md | Tone glossaire section | `grep -qi "glossaire\|tone\|ton" docs/copy-v1.md` |

---

## Validation Strategy

### Acceptance Criteria

- **AC-1**: All three deliverables exist and are non-empty. Copy file has ≥100 lines. | Type: binary | Verify: `test -f docs/product-v1.md && test -f docs/wireframe-v1.md && test -f docs/copy-v1.md && test $(wc -l < docs/copy-v1.md) -gt 100`
- **AC-2**: Zero IA Booster mentions in any of the three deliverables. | Type: binary | Verify: `! grep -rli "IA Booster" docs/product-v1.md docs/wireframe-v1.md docs/copy-v1.md`
- **AC-3**: `docs/copy-v1.md` has `status: frozen` marker (Brice HITL approval captured). | Type: binary | Verify: `grep -q "status: frozen" docs/copy-v1.md`
- **AC-4**: Copy tone respects Sablia rules: no generic "IA" hero (first mention should be "intelligence artificielle"), no unqualified "formation", outcome-tied CTAs. | Type: scored | Verify: Brice HITL review, threshold 7/10
- **AC-5**: 3 post-audit paths consistently named across all three deliverables (same exact strings). | Type: binary | Verify: For each path `{formation d'équipes internes, accompagnement, développement}`, confirm it appears in all 3 files (grep -li in each)
- **AC-6**: Differentiation vs IAPreneurs present + uses Agent C GREEN-zone axes + does NOT frame as "partners". | Type: scored | Verify: Brice HITL review, check "partenaires" absence (binary) + audience/depth/purpose axes present, threshold 8/10
- **AC-7**: 990€ price consistent across deliverables, no old alt-price anchors leaked. | Type: binary | Verify: `! grep -E "\b(690|1490)\s*€|reste à charge|subvent" docs/product-v1.md docs/copy-v1.md` (catches 690€, 1490€, IA-Booster leakage phrases; does NOT false-match 1980 or other numbers containing "198")

### Validation Steps
1. Run binary AC-1/2/3/5/7 via shell commands (automated).
2. Brice HITL review pass on `docs/copy-v1.md` — focus: tone, differentiation clarity, 5-second hero test.
3. Read hero aloud: does it name the outcome in under 10 seconds?
4. Cross-check hero credential line against `iapreneurs.com` public positioning — no claim exceeds what Agent C verified.

### Iteration Protocol
- Binary fail: block progression, fix specific rule violation, re-run.
- Scored fail (< threshold): iterate on the specific section, re-score. Max 3 iterations per scored AC before escalating to brief amendment.
- HITL blocker (Open Q unresolved): pause phase, resolve Open Q, resume.

---

## Documentation Sources & Targets

### Sources (read during planning)
- `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` (amended 2026-04-18)
- `research/plan/2026-04-18-sablia-site-acquisition-predesign.md` (this plan's research)
- `client/src/pages/Landing.tsx`
- `client/src/components/landing/HeroSection.tsx` (lines 27-73 current hero, line 66 IAPreneurs link)
- `client/src/components/landing/PricingSection.tsx` (9 offers in 3 columns)
- `client/src/components/landing/ContactFormSection.tsx` (form + Calendly)
- `client/src/components/landing/TestimonialsSection.tsx` (5 testimonials)
- `client/src/components/landing/CalculatorROI.tsx`
- `client/src/lib/form-constants.ts`
- `client/src/App.tsx` (route map)
- `docs/OFFRES.md`, `docs/SITE_CONTENT.md`, `docs/FAQ.md` (existing content refs)

### Targets (update after execution)
- `docs/product-v1.md` — NEW, Phase A deliverable
- `docs/wireframe-v1.md` — NEW, Phase B deliverable
- `docs/copy-v1.md` — NEW, Phase C deliverable
- `CLAUDE.md` — append tone glossaire reference + link to copy-v1.md
- `docs/SITE_CONTENT.md` — will be superseded once new homepage ships (flag in Phase C but do not delete yet)
- `docs/OFFRES.md` — will be superseded once product-v1 ships (flag in Phase A but do not delete yet)
- `STATUS.md` — track phase completion, final state = "ready for claude.ai/design handoff"

---

## Open Questions (HITL gates — resolve during execution)

Each HITL decision below has an explicit blocking scope. Execute cannot proceed past the blocked task without resolution.

1. **Product name** (A1): pick 1 of 3 variants. Blocks A2.
2. **IAPreneurs figure + title reconciliation** (A5): verify 500+ / drop / pivot to Yassine reach; AND pick canonical title form ("Responsable Pédagogique IA" full vs "Resp. Pédagogique & Expert IA" abbreviated). Blocks C2 hero credential.
3. **Webhook strategy** (B4): new `WEBHOOK_DIAGNOSTIC` endpoint or reuse `WEBHOOK_CONTACT` with discriminator. Blocks B4 spec freeze + form-constants.ts update.
4. **Tutoiement vs vouvoiement** (C8): confirm current vouvoiement continues or shift. Blocks C2/C3 writing.
5. **Capacity model** (A4): 4-6 diagnostics/month validated vs Qwertys 6j/mois commitment. Blocks A4.
6. **SASU/auto-entrepreneur** (A2 facture): impacts TVA display on pricing + fiscal flow. Blocks A2 payment spec.
7. **Elorri / Formation IA Normandie overlap** (A3): does Sablia "formation d'équipes internes" overlap the Elorri partnership or operate as distinct offering? If overlap, clarify attribution in A3 card spec + C4 card copy. **Must resolve before A3 writes the formation path spec** — sub-task to add to Phase A task list if answer is "overlap exists" (requires scope-boundary note in product-v1.md).
8. **LogosCloud disposition** (B2 section 2, B6): gut existing `LogosCloud.tsx` → pure logo strip OR delete and create new `ClientLogosStrip.tsx`. Blocks B6 file map freeze.
9. **ThreeStepProcess disposition** (B6): MODIFY to carry "Le problème" / "Le diagnostic" content OR DELETE entirely (default recommendation: DELETE, new sections subsume intent). Blocks B6 file map freeze.

---

## Challenge Report

Integrated `/plan` shadow challenge protocol ran 4 rounds (3 fix-apply rounds + 1 GO confirmation). Final verdict: **GO**.

### Iteration History

| Round | Agents | Verdict | BLOCKING | Actions Applied | Key Change |
|-------|--------|---------|----------|-----------------|------------|
| 1 | Verifier + Devil's Advocate + Scout | REVISE | 3 | 10 | CTA count corrected (6→9), testimonials corrected (7→6, still wrong), /tarifs teaser → price floors, LogosCloud identity clarified, ThreeStepProcess added to file map, Phase C gate added, title reconciliation HITL in A5, pourquoi-payant framing rule, AC-7 regex tightened |
| 2 | Verifier + Devil's Advocate | REVISE | 2 | 5 | Intra-plan CTA contradiction fixed (B3), testimonials re-counted to actual 5, wireframe-freeze verification constraint added, HITL decisions moved to Open Questions (LogosCloud #8, ThreeStepProcess #9), Elorri HITL promoted to Phase A task A7 |
| 3 | Verifier | REVISE | 1 | 3 | 3 stale count references patched (B5 "7→3-5" → "5→3", B6 "6→3" → "5→3", Sources "7 testimonials" → "5 testimonials") |
| 4 | Verifier (confirm) | **GO** | 0 | — | All Round 3 fixes verified; 5 testimonials consistent across plan |

**Total agent spawns**: 9 (Round 1: 3, Round 2: 2, Round 3: 1, Round 4: 1, plus earlier research team: 3 agents were pre-plan research, not counted here)

### Verified Hypotheses (Agent 1 — Verifier, Round 4 final)
- 990€ price anchor structurally correct for French PME market (uncontested gap below €1500) — source: multiple FR comparables (Prizm IA, Bradroit, Drakkar, Call Me Newton)
- IAPreneurs affiliate link `?affiliate_code=8b6eda` verified live in `HeroSection.tsx:66`
- `TestimonialsSection.tsx` = exactly 5 entries (Hélène, Directeur, Yassine, Valentin, Amir) — confirmed via array + schema.org `reviewCount: '5'`
- `CalculatorROI.tsx` default `INVESTMENT = 1500` — verified; plan correctly specifies 1500→990 update
- `form-constants.ts` webhook URLs exact: `WEBHOOK_CONTACT`, `WEBHOOK_GAP` confirmed
- Stack versions: React 18, Vite, Wouter, Tailwind v3, Framer Motion, shadcn — verified in package.json

### Counter-arguments (Agent 2 — Devil's Advocate, Round 2 final)
All Round 1 RISKs addressed in Round 2 fixes. Round 2 RISKs also addressed. Zero BLOCKING at both round exits.

### External Insights (Agent 3 — External Scout, Round 1 only)
- Single-CTA hero: strongly validated (13.5% vs 10.5% conversion) — plan compatible
- Paid audit door-opener: documented higher project conversion (30-40% vs 10-15% free-call) — plan compatible
- `/tarifs` teaser with stale old pricing: flagged as BLOCKING → fixed by embedding price floors on C4 cards
- French PME confidence at multi-year low (Bpifrance -3 vs +16 avg) — informed testimonial selection rule (≥2 ROI-quantified)

### Deferred Actions
None. All RISKs and BLOCKING were addressed inline or integrated into Open Questions / task spec.

### Knowledge Harvest
Reviewed agent findings for reusable patterns. No new content worth persisting to workspace-level topic files — all findings are either codebase-specific (sablia-site landing structure) or plan-internal (count corrections). No rules contradictions detected.

## Session Recap

- /prime — focused mode, sablia-site project
- /plan research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md — 3-phase pre-design plan, converged GO in 4 rounds

- [x] Plan challenged (integrated /plan shadow challenge) — GO verdict 2026-04-18
