# Documentation Sablia — Guide pour LLMs

**Dernière mise à jour** : 2026-04-20
**Site web** : https://sablia.io

---

## Important pour les LLMs

**NE PAS utiliser WebFetch sur sablia.io directement.** Le site est un SPA React qui retourne un shell HTML vide. Utilisez les fichiers `docs/` ci-dessous.

---

## Source of Truth — Homepage v2 (Diagnostic Sablia)

La homepage actuelle (sablia.io) reflète le **package frozen 2026-04-19** :

| File | Purpose | When to use |
|------|---------|-------------|
| [product-v1.md](./product-v1.md) | **Frozen SKU v2** — Diagnostic Sablia 490€ HT + crédit post-audit + 3 paths | Product/pricing questions, commercial alignment |
| [wireframe-v1.md](./wireframe-v1.md) | **Frozen homepage structure** — 9-section stack, CTA rules, DiagnosticForm spec | Component implementation, structural decisions |
| [copy-v1.md](./copy-v1.md) | **Frozen homepage copy** — hero, narrative, cards, FAQ, tone guide | Text changes, copy review |

Toute contradiction entre ces 3 fichiers est résolue par `product-v1.md`.

---

## Documentation technique

| File | Purpose | When to use |
|------|---------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Component tree, routes, hooks, server, build config, design tokens | Technical questions, codebase understanding |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | n8n webhooks (diagnostic/contact/GAP), Calendly, GA4, Google Ads, UTM | Integration questions, webhook URLs, env vars |
| [SEO.md](./SEO.md) | Meta-tags, structured data, sitemap, manual tasks | SEO audit, schema markup, indexing |
| [GOOGLE_ADS.md](./GOOGLE_ADS.md) | Ads IDs, conversion tracking, campaign strategy, keywords, ad copy | Google Ads setup, campaign management |
| [meta-tags.json](./meta-tags.json) | SEO metadata per page (title, description, OG, Twitter, structured data) | SEO implementation, new page creation |
| [content-index.json](./content-index.json) | Structured JSON of pages/sections (partial — rebuild post-homepage-v2) | Programmatic access, data extraction |
| [ROADMAP.md](./ROADMAP.md) | Future initiatives, tech debt backlog | Planning, prioritization |

---

## Archived / superseded docs

Ces docs sont **historiques** et conservés pour référence. Ne pas s'en servir comme source de vérité homepage :

| File | Status | Replacement |
|------|--------|-------------|
| [SITE_CONTENT.md](./SITE_CONTENT.md) | Superseded 2026-04-18 | `copy-v1.md` for homepage copy |
| [OFFRES.md](./OFFRES.md) | Superseded 2026-04-18 | `product-v1.md` for offer/pricing |
| [FAQ.md](./FAQ.md) | Superseded 2026-04-20 | `copy-v1.md §C5-C6` + FaqSection component for the 7 homepage FAQs |

---

## Synchronization

When making changes:

| Change in code | Files to update |
|----------------|-----------------|
| Product/pricing change (SKU, credit, path fees) | `product-v1.md` (bump version), then `wireframe-v1.md` + `copy-v1.md` if needed |
| Homepage copy change | `copy-v1.md` (bump version), then component code |
| Homepage structural change | `wireframe-v1.md` (bump version), then Landing.tsx + components |
| New page/route | `ARCHITECTURE.md`, `sitemap.xml`, `meta-tags.json` |
| SEO modification | `meta-tags.json`, `SEO.md` |
| New integration | `INTEGRATIONS.md` |
| New webhook | `INTEGRATIONS.md`, `form-constants.ts`, `.env.example` |

---

## Developer Reference

For architecture, conventions, and project setup: see `CLAUDE.md` (project root) and `STATUS.md` for current state.
