# Sablia Site - Status

**Last Updated**: 2026-04-18

---

## Current State

Site is live at https://sablia.io. GA4 + Google Ads infrastructure deployed. Master refactor plan completed (3 units). **Strategic pivot pre-design package frozen 2026-04-18**: 3 deliverables (`docs/product-v1.md`, `docs/wireframe-v1.md`, `docs/copy-v1.md`) ready for claude.ai/design handoff. Next: external visual design pass, then `/frontend-design` to implement.

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
| `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` | Amended 2026-04-18. Pre-design unit delivered. Remaining units 3-6 (pricing page redesign, hub pages, case studies, content cadence) scheduled as separate /plan passes | Plan Unit 3+ or hand off pre-design docs to claude.ai/design |
| `plans/archive/sablia-site-acquisition-predesign.md` | **COMPLETED 2026-04-18**. 3 docs frozen: `docs/product-v1.md` + `docs/wireframe-v1.md` + `docs/copy-v1.md`. Locked: product name "Diagnostic Sablia" @ 990€ HT, C1 positioning=B, C2 hero H1=E ("Cinq jours. Un PDF. Une décision claire."), Option 3 price display (1 price floor on Formation card only), IAPreneurs credential "500+ membres, 200k+ abonnés YouTube", title "Responsable Pédagogique et Coach Développement IA" | Hand off the 3 docs to claude.ai/design externally, then `/frontend-design` to build |

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
