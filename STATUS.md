# Sablia Site - Status

**Last Updated**: 2026-04-20

---

## Current State

Site is live at https://sablia.io. GA4 + Google Ads infrastructure deployed. Pre-design package frozen (product-v1 v2 / wireframe-v1 v2 / copy-v1 v2). **Homepage v2 + global cohérence shipped 2026-04-20** (P0 + P1 + P2 of `plans/site-completion-checklist.md`). Build + tsc + tests all clean. Remaining: P3 (Google Ads manual launch — promo expires 2026-05-01), P4 (HITL business decisions + E2E use cases), P5 (tech debt backlog).

---

## Known Issues

- [ ] Import `generate_lead` conversion in Google Ads (Goals > Conversions > Import from GA4)

---

## Active Plans

| Plan / Brief | Status | Next |
|---|---|---|
| `plans/site-completion-checklist.md` | **P0 + P1 + P2 DONE 2026-04-20**. Homepage v2 shipped (9-section stack, Diagnostic Sablia funnel, n8n workflow live). Cohérence globale propagée (navigation, about, /faq, /tarifs, /cas-clients, docs). Remaining: P3 (Google Ads manual — promo expires 2026-05-01), P4 (HITL + E2E), P5 (tech debt). | Brice: launch P3 (Google Ads UI) + trancher HITL P4.1-P4.4 |
| `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` | Amended 2026-04-18. Pre-design unit delivered (v2: 490€ HT + crédit post-audit). Units 3-6 (pricing page redesign, hub pages, case studies, content cadence) backlog | Post P1 completion |

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
