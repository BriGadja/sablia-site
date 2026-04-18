# Sablia Site - Status

**Last Updated**: 2026-04-18

---

## Current State

Site is live at https://sablia.io. GA4 + Google Ads infrastructure deployed. Master refactor plan completed (3 units). **Strategic pivot in flight**: acquisition-machine-v1 brief amended 2026-04-18 to lock "coach-implémenteur" positioning (option C) with IAPreneurs credential + single paid-audit door-opener (no IA Booster). Ready for `/plan`.

---

## Known Issues

- Footer.test.tsx: "Documentation pour IA" test fails (link was removed, test not updated)
- Footer.test.tsx: TS type errors (missing vitest type augmentation for toBeInTheDocument)
- animations.ts: TS errors (framer-motion Variant type mismatch)
- [ ] Import `generate_lead` conversion in Google Ads (Goals > Conversions > Import from GA4)

---

## Active Plans

| Plan / Brief | Status | Next |
|---|---|---|
| `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` | Amended 2026-04-18 — positioning locked (option C Coach-Implémenteur), IA Booster dropped, IAPreneurs credential validated by Yassine (affiliate link `?affiliate_code=8b6eda` already live in HeroSection.tsx), formation renamed "formation d'équipes internes", Unit 2.5 Copy & Unit 7 Design Handoff added | Brief scoped — /plan run (see next row) |
| `plans/sablia-site-acquisition-predesign.md` | **Ready 2026-04-18** — narrow /plan covering Unit 1 + Unit 2 + Unit 2.5. Phase A Product Definition + Phase B Homepage Wireframe + Phase C Copy Package. 23 tasks, 22 verification constraints, 9 HITL open questions. Challenge: **GO** after 4 rounds (BLOCKING 3→2→1→0). Price 990€ HT validated against French market comparables | `/execute sablia-site-acquisition-predesign` (after optional /challenge review) |

---

## TODO — Strategic Pivot

- [x] ~~Brice ↔ Yassine Sdiri validation~~ — **DONE 2026-04-18**: validated + affiliate link provided (`https://www.iapreneurs.com/?affiliate_code=8b6eda`).
- [ ] Confirm SASU vs auto-entrepreneur status (impact: capacity model, TVA, invoice legitimacy at 990€).
- [ ] Capacity model: lock monthly diagnostic limit (hypothesis: 4-6/mo given existing Qwertys 6j/mo retainer).
- [ ] Case study consent: Nestenn, Qwertys, Stefano, Norloc, CER — named vs anonymized.
- [ ] Elorri / Formation IA Normandie overlap with Sablia "formation d'équipes internes" — clarify boundaries.

---

## References

- **Meta Tags Config**: `docs/meta-tags.json`
- **Sitemap**: `client/public/sitemap.xml`
