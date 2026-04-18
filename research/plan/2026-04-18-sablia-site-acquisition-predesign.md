---
topic: Sablia Site acquisition machine — pre-design plan (Unit 1 + Unit 2 + Unit 2.5 from brief)
created: 2026-04-18
agents: [french-pme-pricing, sablia-site-codebase-map, iapreneurs-positioning-verification]
plan: plans/sablia-site-acquisition-predesign.md
brief: research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md
---

## Research Findings

### Agent A — French PME AI audit pricing

**Recommended anchor: 990€ HT** (kept, different justification).

The sub-1500€ fixed-price diagnostic tier is nearly empty in France — competitors either free (lead-gen) or jump to €1500-13000 (institutional). 990€ sits in an uncontested gap, 1€ under the 1000€ psychological threshold for French PME dirigeants' unilateral-decision zone (next tier = 3000€ needs devis + sign-off). Maps cleanly to ~1.5 days at confirmed TJM 600-700€, signalling "below-market introductory price, recouped on implementation".

**Alt prices evaluated**:
- 690€: reads as "few hours" deliverable, undersells the 5-day scope. Dismissed.
- 1490€: crosses 1000€ threshold (needs devis). Better institutional credibility (matches Prizm IA 1500€) but lower conversion. Fallback option if 990€ under-converts.

**French comparables found**:
| Product | Company | Price | Format |
|---|---|---|---|
| Diagnostic Flash | Prizm IA | 1 500€ HT | 1 week, 2h call + 3 use cases + ROI |
| Audit IA PME | Bradroit Solutions | 2 500-3 000€ HT | 3-7 jours terrain, rapport 15-30 pages |
| Demi-journée expertise | Reboot IA (n8n) | 350€ HT | 4h audit workflow |
| Audit IA PME | Drakkar | 6 000€ HT | 1 journée, 3-6 cas d'usage |
| Diagnostic IA & Data | Call Me Newton | 13 000€ HT (BPI -42%) | 4 phases, roadmap priorisée |
| Audit express | YouFeel | gratuit ou 1 500€ | 1-2h, 3 cas d'usage avec ROI |
| Diag Data IA | Bpifrance | 10 000€ HT (PME -25%) | 8-10 jours expert accrédité |

**Key finding — IA Booster structural reality**: IA Booster Phase 2 costs €10000 HT with 25-50% subsidy. The diagnostic tier eligible is €7500-13000 HT (institutional level). A 990€ product is structurally NOT IA-Booster-accredited — it's the practitioner-led alternative. If Brice later wants IA Booster eligibility, it requires a SECOND €3500-5000€ product tier, not a repositioning of the 990€.

Sources: prizm-ia.com/solutions/, bradroit-solutions.fr/audit-ia-pme-eti, rebootia.com, drakkar.io/agence-ia/audit, callmenewton.fr/diagnostic-ia-data/, youfeel.fr/agence-ia-pme/, bpifrance.fr/catalogue-offres/diag-data-ia, digitalunicorn.fr, onyri-strategy.com, bloom-ai.fr, cynker.fr, koino.fr

### Agent B — Sablia-site codebase map

**Entry point**: `client/src/pages/Landing.tsx` (not `Home.tsx`). Mounts 10 sections in order:
1. Navigation (line 30)
2. HeroSection (line 33)
3. TestimonialsSection (line 34)
4. LogosCloud (line 35)
5. TransformationSection (line 36)
6. ThreeStepProcess (line 37)
7. PricingSection (line 38)
8. CalculatorROI (lazy, line 67)
9. ContactFormSection (lazy, line 68)
10. FaqSection (lazy, line 69)

**HeroSection.tsx current state**:
- Small label line 33: "Automatisation & IA sur mesure pour PME"
- H1 line 36-38: "Retournez le sablier"
- Sub lines 40-42: "Sablia automatise vos processus répétitifs. Reprenez le contrôle de votre temps."
- 2 CTAs: "Diagnostic Gratuit" (→ #contact), "Calculer mon ROI" (→ #calculator)
- Credential line 63-73: "Brice Gachadoat — Resp. Pédagogique & Expert IA, IAPreneurs" with affiliate link `https://www.iapreneurs.com/?affiliate_code=8b6eda` already live at line 66
- Animation: custom cubic-bezier `[0.25, 0.1, 0.25, 1]` on mount (immediate, not whileInView)

**Total CTAs on homepage = 9** (corrected 2026-04-18 Round 2 verifier):
- Hero (2): Diagnostic Gratuit → #contact | Calculer mon ROI → #calculator
- LogosCloud (4): 4 expertise cards each linking to #contact / #pricing (Diagnostic Express / Vos équipes autonomes / Workflows sur mesure / Agents IA)
- TransformationSection (1)
- PricingSection (1): single-button column CTA (initial scout over-counted)
- CalculatorROI (1)
Plus embedded Calendly widget in ContactFormSection (not counted as CTA).

**Pricing** (`PricingSection.tsx` rendered on homepage AND at `/tarifs`): 3 columns × 3 offers = 9 offers:
- Audit & Consulting: Appel Découverte (free), Audit Express (350€), Audit Complet (2000-5000€)
- Formations: Demi-journée (700€), Jour (1200€), 2-3 jours (2200-3300€)
- Solutions automatisation: Workflow Simple (2500-5000€), Système Standard (8000-18000€), Transformation Complète (25000-60000€)

**Forms**:
- Contact form `ContactFormSection.tsx`: embedded on homepage at `#contact`, 6 fields (nom, email, entreprise, téléphone, message, rgpd), honeypot present, target `WEBHOOK_CONTACT`, redirect `/thank-you?source=contact`
- GAP form `GapForm.tsx`: standalone at `/gap`, NOT embedded on homepage (brief was wrong on this), 4 required + 3 optional fields, honeypot present, target `WEBHOOK_GAP`, redirect `/thank-you?source=gap`
- `form-constants.ts`: defines `WEBHOOK_CONTACT`, `WEBHOOK_GAP`, `inputClasses`

**Animation pattern** (all landing sections except hero): Framer Motion whileInView fade-up
```
initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}}
viewport={{once:true}} transition={{duration:0.4, delay:index*0.08}}
```

**Testimonials**: 5 testimonials in `TestimonialsSection.tsx` (Hélène GirlsGang, directeur anonyme, Yassine Norloc, Valentin Stefano/Exotic Design, Amir BTP) — verified 2026-04-18 against testimonials array + schema.org reviewCount. Initial scout erroneously reported 7.

**LogosCloud.tsx**: 4 expertise cards currently linking → #contact / #pricing (not pure logo strip).

**ROI calc `CalculatorROI.tsx`**: lazy-loaded, 2 sliders (hoursPerWeek 8, hourlyCost 35), formula `(annualSavings-investment)/investment*100`, investment constant 1500€, efficiency 70%.

**Routes confirmed in App.tsx**: `/`, `/tarifs`, `/gap`, `/about`, `/roi`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/faq`, `/cas-clients`, `/thank-you`, `/lp/automatisation-pme`, `/lp/audit-gratuit`, `*` (404).

**docs/ folder**: 9 existing docs (ARCHITECTURE, FAQ, GOOGLE_ADS, INTEGRATIONS, OFFRES, README, ROADMAP, SEO, SITE_CONTENT). `docs/copy-v1.md` does NOT exist.

### Agent C — IAPreneurs positioning verification

**Differentiation verdict: GREEN** (clear, supportable by public iapreneurs.com claims).

| Axis | IAPreneurs | Sablia |
|---|---|---|
| Who pays | Freelancers & entrepreneurs (learners) | PMEs (operators) |
| Want | Build consulting business selling AI | Integrate AI into existing ops |
| Output | AI consultant trained to sell | PME with automated processes |
| Brice's role | Teaches IAPreneurs members | Executes for PME clients |

Zero audience overlap at buyer level: IAPreneurs' customers want to BECOME consultants; Sablia's customers want to HIRE one.

**Verified facts**:
1. IAPreneurs paid academy = 990€/year — **same number as Sablia's planned audit price** — avoid conflation in copy.
2. IAPreneurs target = freelancers, entrepreneurs, career-changers — explicitly NOT PME operators.
3. Modules: "Acquisition Client", LinkedIn prospecting, copywriting — B2B sales training for AI consultants.
4. Yassine Sdiri: founder + primary instructor. 160k YouTube subscribers (verified). LinkedIn: linkedin.com/in/yassine-sdiri-2793711b2/
5. **"500+ members"** = UNVERIFIED from primary source. Paid academy ~450-500 per third-party jedha.co (not primary). Free Skool community = 52,500 (different product, would mislead if cited as academy size). **HITL decision needed.**
6. Tagline: "Créer la prochaine génération d'experts IA" — generating experts, not deploying AI.

**Brice's actual title**: "Responsable Pédagogique IA" — NOT "coach" (loose usage in brief amendment).

**GREEN-zone copy templates** (Agent-provided, safe to use):
- "Brice Gachadoat — Responsable pédagogique IA, communauté IAPreneurs"
- "Formé les prochains experts IA francophones chez IAPreneurs — maintenant, il intègre l'IA dans votre PME"
- "IAPreneurs forme des consultants IA. Sablia, c'est votre consultant IA."

**Phrases to avoid**:
- "IAPreneurs (500+)" without verified primary source
- Calling Brice "coach IAPreneurs" — use official title
- Framing the two as "partners" or "complementary" — they serve opposite sides of same market

**Risk nuance**: IAPreneurs-trained consultants could eventually become Sablia competitors (market dynamic, not audience conflict). Don't amplify the connection beyond credential-proof.

Sources: iapreneurs.com, linkedin.com/in/yassine-sdiri-2793711b2/, linkedin.com/company/iapreneur-acad%C3%A9mie, skool.com/ia-school-6161, skool.com/@yass-ia-4169, jedha.co/formation-ia/les-10-meilleures-formations-ia-en-lignes-en-2025
