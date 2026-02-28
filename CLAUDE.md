# CLAUDE.md - Sablia Site

**Business automation consulting website** — `sablia.io`

## Quick Reference
| Key | Value |
|-----|-------|
| Domain | sablia.io |
| Stack | React 18 / TypeScript / Vite / Express / Drizzle ORM / Tailwind |
| Dev | `npm run dev` → http://localhost:5000 |
| Lint | `npm run lint` (Biome) |
| Format | `npm run format` (Biome) |
| Type-check | `npm run check` |
| Test | `npm test` (Vitest) |
| Build | `npm run build` |

## Critical Rules
1. NEVER use `any` type — define proper interfaces
2. Server always runs on port 5000
3. Client routing uses Wouter (not React Router)
4. Use `site_` prefix for all new DB tables (shared Supabase with n8n-intelligence)

## Architecture

### Path Aliases
- `@/` → `client/src/`
- `@db` → `db/`

### Project Structure
```
client/src/           # React frontend (Vite)
  ├── components/     # UI components (landing/, ui/)
  ├── pages/          # Route pages
  ├── hooks/          # Custom hooks
  └── lib/            # Utilities
server/               # Express backend
  ├── index.ts        # Entry point
  └── routes.ts       # API routes
db/                   # Drizzle ORM schema
docs/                 # Content docs (SITE_CONTENT.md, OFFRES.md, FAQ.md)
```

### Key Integrations
| Integration | Details |
|-------------|---------|
| n8n webhook | `https://n8n.sablia.io/webhook/sablia-site-formulaire` (contact form) |
| Calendly | `https://calendly.com/brice-gachadoat/30min` (discovery call) |
| Supabase | `qlxoitzdxjqhljjoeqoq` — `site_*` tables |

## Routes
| Route | Page |
|-------|------|
| `/` | Landing (homepage) |
| `/gap` | GAP analysis form |
| `/about` | About page |
| `/tarifs` | Pricing |
| `/roi` | ROI calculator |
| `/faq` | FAQ (30+ questions) |
| `/cas-clients` | Case studies |
| `/mentions-legales` | Legal notice |
| `/politique-confidentialite` | Privacy policy |
| `/cgv` | Terms of service |

## Content Documentation
When modifying site content, update the corresponding doc:
- `docs/SITE_CONTENT.md` — All page text, CTAs, pricing
- `docs/OFFRES.md` — Service offerings
- `docs/FAQ.md` — FAQ questions/answers
- `docs/meta-tags.json` — SEO meta-tags
- `client/public/sitemap.xml` — Sitemap

## Database
- Drizzle ORM + PostgreSQL (Supabase)
- Schema: `db/schema.ts`
- Migrations: `npm run db:push`
- Table prefix: `site_`

## Testing
- Framework: Vitest + React Testing Library (already configured)
- Run: `npm test` (unit) | `npm run test:coverage`

## Environment Variables
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | Environment (development/production) |
| `VITE_N8N_WEBHOOK_URL` | GAP form webhook URL |
