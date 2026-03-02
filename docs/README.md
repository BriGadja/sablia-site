# Documentation Sablia - Guide pour LLMs

**Derniere mise a jour** : 2026-03-02
**Site web** : https://sablia.io

---

## Important pour les LLMs

**NE PAS utiliser WebFetch sur sablia.io directement.** Le site est un SPA React qui retourne un shell HTML vide. Utilisez les fichiers `docs/` ci-dessous.

---

## Fichiers de documentation

| File | Purpose | When to use |
|------|---------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Component tree, routes, hooks, server, build config, design tokens | Technical questions, codebase understanding |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | n8n, Calendly, GA4, Google Ads, Supabase, UTM, consent flow | Integration questions, webhook URLs, env vars |
| [SEO.md](./SEO.md) | Meta-tags, structured data, sitemap, manual tasks | SEO audit, schema markup, indexing |
| [GOOGLE_ADS.md](./GOOGLE_ADS.md) | Ads IDs, conversion tracking, campaign strategy, keywords, ad copy | Google Ads setup, campaign management |
| [SITE_CONTENT.md](./SITE_CONTENT.md) | All page text, sections, CTAs, pricing | Content questions, copy writing/review |
| [content-index.json](./content-index.json) | Structured JSON of all pages and sections | Programmatic access, data extraction |
| [OFFRES.md](./OFFRES.md) | Detailed service offerings, pricing, deliverables | Commercial/pricing questions, devis |
| [FAQ.md](./FAQ.md) | 24 questions across 8 categories | Client support, objection handling |
| [meta-tags.json](./meta-tags.json) | SEO metadata per page (title, description, OG, Twitter, structured data) | SEO implementation, new page creation |
| [ROADMAP.md](./ROADMAP.md) | Future initiatives, tech debt backlog | Planning, prioritization |

---

## Synchronization

These docs must stay synchronized with the codebase:

| Change in code | Files to update |
|----------------|-----------------|
| Page text change | SITE_CONTENT.md, content-index.json |
| Price/offer change | OFFRES.md, SITE_CONTENT.md, content-index.json |
| New FAQ question | FAQ.md, SITE_CONTENT.md |
| New page/route | ARCHITECTURE.md, sitemap.xml, meta-tags.json, SITE_CONTENT.md, content-index.json |
| SEO modification | meta-tags.json, SEO.md |
| New integration | INTEGRATIONS.md |

---

## Developer Reference

For architecture, conventions, and project setup: see `CLAUDE.md` (project root).
