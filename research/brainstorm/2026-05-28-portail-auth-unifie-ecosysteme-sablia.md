---
type: brainstorm
status: pending
topic: "Portail authentifié unifié pour l'écosystème web Sablia"
created: "2026-05-28"
agents: 4
findings: 37
sources: 28
---

# Brainstorm: Portail authentifié unifié pour l'écosystème web Sablia
> Generated 2026-05-28 | 4 agents | ~28 sources consulted | 37 findings

## Executive Summary
Sablia veut un point d'entrée unique authentifié (« comme vox ») : depuis le site, un login donne accès — selon les droits — à toutes les fenêtres web internes (dashboard ads, futurs dashboards, UIs de lancement n8n) présentes et futures. La recherche converge fortement : pour une petite équipe, **un seul projet Supabase + cookie `.sablia.io` + monorepo Turborepo** est le bon socle ; micro-frontends / Module Federation sont du sur-dimensionnement (< 50 devs). Le RBAC natif Supabase (hook JWT + RLS + table `apps`) mappe directement sur le problème d'app-launcher, et le modèle multi-tenant de vox (`user_org_memberships` + `custom_access_token_hook`) est réutilisable tel quel. **Le point dur n'est pas technique mais un choix de consolidation Supabase** : le SSO par cookie exige UN projet, or les données ads/CRM/n8n vivent dans la base `Sablia` tandis que le modèle d'auth éprouvé vit dans `sablia-voice`.

## Problem Statement
Le site `sablia.io` est aujourd'hui une LP marketing (React 18 + Vite SPA, sans auth). En parallèle, Sablia accumule des apps web indépendantes (dashboard ads, autoresearch-dashboard, sablia-crm/dashboard, board) toutes déjà en Next.js 16 + Supabase, plus vox (vox.sablia.io) qui possède l'auth multi-tenant de référence. Il manque une **couche d'identité + d'autorisation unifiée** permettant à l'équipe (puis, à terme, à des démos/POC clients) de se connecter une fois et d'accéder uniquement aux apps autorisées — sans dupliquer le login dans chaque repo.

## Context Bootstrap
Pour `/architect`, charger :
- Ce brief (intégralité).
- `projects/internal/websites/sablia-vox/middleware.ts`, `lib/auth.ts`, `supabase/migrations/20260402120000_admin_multiorg_access.sql` — modèle d'auth de référence (hook JWT + RLS multi-org).
- `projects/internal/websites/sablia-site/CLAUDE.md` (stack Vite SPA actuelle) + `docs/crm/` (offre CRM cible).
- Bases Supabase : `Sablia` (`qlxoitzdxjqhljjoeqoq`, données ads `sabcrm_*` + CRM + n8n + cold email, **auth vide**) et `sablia-voice` (`mgsfrhirsvqbyjagrswt`, auth/org + voix). Les deux créées après mai 2025 → probablement déjà clés JWT asymétriques (à vérifier).

## Key Findings
- **Un seul projet Supabase est obligatoire pour le SSO par cookie** — le cookie référence le secret/clé JWT d'un projet unique ; deux projets = deux silos d'auth non mutuellement vérifiables. Source: github.com/supabase/supabase/discussions/5742. Relevance: HIGH.
- **Le levier exact = `cookieOptions.domain: ".sablia.io"`** sur les clients serveur ET navigateur (`@supabase/ssr` ≥ 0.6.1), point de dot initial requis ; cohérent sur toutes les apps. Source: micheleong.com/blog/share-sessions-subdomains-supabase. Relevance: HIGH.
- **Consensus anti-fragmentation pour petite équipe** — monolithe / monorepo Turborepo l'emportent sauf > 50 devs ou builds > 30 min. Module Federation = O(N²) de complexité pour zéro bénéfice ici. Source: news.ycombinator.com/item?id=37929711 + feature-sliced.design. Relevance: HIGH.
- **Le RBAC natif Supabase mappe directement sur l'app-launcher** — enum `app_permission` = clés du registre d'apps ; `authorize(required_permission)` dans une policy RLS répond à « quel user voit quelle tuile ». Source: supabase.com/docs/.../custom-claims-and-role-based-access-control-rbac. Relevance: HIGH.
- **Trigger n8n sécurisé = Route Handler (pas Server Action) + Header Auth** — secret uniquement en `process.env` serveur, jamais dans le bundle ; timeout sync 64s → pattern async `jobId` + polling pour les workflows longs. Source: docs.n8n.io + makerkit.dev. Relevance: HIGH.

## Decision Matrix

### Décision 1 — Architecture d'hébergement

| Option | Maturité | Lock-in | Complexité | Sablia Fit | Effort |
|--------|----------|---------|------------|------------|--------|
| Monorepo Turborepo (apps séparées, `packages/auth`+`packages/ui` partagés, chaque app = projet Vercel) | Élevée | Faible | Moyenne | **Excellent** — apps déjà Next.js+Supabase | Moyen |
| Monolithe Next.js unique (route groups) | Élevée | Faible | Faible | Bon mais fusion big-bang des repos | Élevé (migration) |
| Next.js Multi-Zones | Moyenne | Faible | Moyenne | Possible, mais hard-navigation entre zones | Moyen |
| Micro-frontends / Module Federation | Élevée | Moyen | **Élevée** | Mauvais (< 50 devs) | Élevé |
| Gateway Vercel pur (rewrites path-based) | Élevée | Faible | Faible | Bon pour garder le site marketing intact | Faible |

**Recommandation**: **Monorepo Turborepo** avec `packages/auth` (client Supabase + config cookie) et `packages/ui` (design system `@sablia/ui`). Portail = app `app.sablia.io` hébergeant les dashboards légers en routes internes, + tuiles-liens vers les apps lourdes autonomes (vox.sablia.io). Site marketing Vite **laissé tel quel**, bouton « Espace / Connexion » → `app.sablia.io`.

### Décision 2 — Quel projet Supabase comme identité de plateforme (le point dur)

| Option | Données déjà en place | Modèle auth | Migration vox | Risque |
|--------|----------------------|-------------|---------------|--------|
| **A. Base `Sablia`** (`qlxoitzdxjqhljjoeqoq`) | Ads `sabcrm_*`, CRM, n8n, cold email (réel) ; `auth.users` vide | À porter depuis vox (artefact SQL migratable) | Différée (Phase 2) | Faible MVP / vox reste séparé un temps |
| B. Base `sablia-voice` (`mgsfrhirsvqbyjagrswt`) | Auth/org + RLS éprouvés ; données voix | Déjà là, vox reste en place | Nulle | Déplacer ads/CRM/n8n cross-projet (RLS impossible) |
| C. Nouveau projet dédié | Rien | À construire | Totale | Coût migration max |

**Recommandation**: **Option A — la base `Sablia` devient l'identité de plateforme.** Justification : (1) les données que les dashboards exposent (ads, CRM, n8n) y sont déjà — la RLS doit vivre dans le même projet que les données ; (2) `auth.users` y est **vide** → port du modèle d'auth de vox sans migration d'utilisateurs ; (3) Brice la pressentait. **vox reste sur `sablia-voice` en Phase 1** (login distinct, audience différente — acceptable court terme) ; sa consolidation SSO devient une unité dédiée de Phase 2, dé-risquée et non bloquante. ⚠️ Contrainte dure à acter : la RLS ne traverse pas les projets — toute donnée à filtrer par l'utilisateur connecté doit, à terme, vivre dans la base `Sablia`.

### Décision 3 — Modèle d'autorisation

| Option | Infra | Complexité | Sablia Fit |
|--------|-------|------------|------------|
| **Postgres RBAC + hook JWT + RLS** (natif Supabase) | Aucune | Faible | **Excellent** |
| CASL (lib JS, filtrage UI) en complément | Aucune | Faible | Bon (couche UI au-dessus de RLS) |
| OpenFGA / Permify / SpiceDB (Zanzibar) | Sidecar + store | Élevée | Overkill (< 20 apps, 4 users) |
| Retool / Appsmith (SaaS) | Externe | Faible | Mauvais ($260/mo + lock-in) |

**Recommandation**: **RBAC Postgres natif** — étendre `user_org_memberships` avec une table `apps` (registre) + `role_permissions` + clés dot-namespacées (`app.ads`, `feature.crm.bulk_import`). JWT porte le rôle → le front filtre les tuiles, la RLS enforce. Multi-tenant-ready via `org_id` (MVP : org unique `sablia-internal`).

## Prior Art / Inspiration
- **Modèle d'auth vox** — `sablia-vox/lib/auth.ts` + migration `20260402120000` — `custom_access_token_hook` injecte `org_id`/`is_admin`/`org_ids`, RLS via `auth.jwt() -> 'app_metadata'`. Réutilisable tel quel.
- **Supabase RBAC officiel** — supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac — `app_permission` enum + `authorize()` + RLS.
- **SAP Fiori Launchpad** — heflo.com/blog/sap-fiori-launchpad-explained — sépare catalogue (apps existantes) / entitlement (rôle) / layout (préférences UX) ; modèle de référence app-launcher.
- **Vercel microfrontends / gateway** — vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain — routage CDN < 1ms, apps indépendantes sous un domaine.

## Proposed Scope
**Phase 1 — Socle (MVP équipe interne)**
- Choisir + préparer la base `Sablia` comme identité plateforme : porter `user_org_memberships`, `custom_access_token_hook`, RLS ; vérifier clés JWT asymétriques ; activer `getClaims()`.
- Monorepo Turborepo : `apps/portal` (= `app.sablia.io`) + `packages/auth` (client Supabase, cookie `.sablia.io`, middleware) + `packages/ui` (`@sablia/ui`).
- Schéma RBAC : tables `apps`, `role_permissions`, enum `app_permission`/`app_role`, fonction `authorize()`, org `sablia-internal` + 4 users.
- Portail shell + app-launcher : login, grille de tuiles filtrée par claim JWT (CASL ou check direct), RLS en double rideau.

**Phase 1b — Première fédération de valeur**
- Intégrer le dashboard **ads** (`sabcrm_*` déjà dans la base) comme route interne du portail ou tuile.
- Package réutilisable « trigger n8n » : Route Handler + Header Auth (secret server-only) + pattern async `jobId`/polling + clé d'idempotence ; durcir n8n.sablia.io (IP allowlist egress Vercel).

**Phase 2 — Extension (différée)**
- Bouton « Connexion » sur le site marketing Vite → `app.sablia.io`.
- Consolidation vox dans le SSO : migrer auth + données voix de `sablia-voice` vers la base plateforme (unité dédiée, dé-risquée).
- Ouverture multi-tenant : nouvelles orgs pour démos / POC clients (insertions, zéro changement de schéma).

## Technical Reference Sheet

| Package | Version | Context7 ID | Link | Notes |
|---------|---------|-------------|------|-------|
| @supabase/ssr | ≥ 0.6.1 (prod 0.10.2) | N/A (quota) | npmjs.com/package/@supabase/ssr | Cookie cross-domain ; pin > PR #30424 (bug domaine OAuth) |
| @supabase/supabase-js | 2.105.0 | N/A | npmjs.com/package/@supabase/supabase-js | `getClaims()` (juil. 2025) |
| Turborepo | — | N/A | turbo.build | Monorepo, cache incrémental, ~10 packages |
| CASL | — (gratuit OSS) | N/A | casl.js.org | Filtrage authz UI optionnel, zéro infra |
| n8n (Webhook node) | 2.17.8 | — | docs.n8n.io/integrations/builtin/credentials/webhook | Header Auth ; pas de HMAC natif (code node) |

Key URLs:
- github.com/supabase/supabase/discussions/5742 — SSO cross-sous-domaines, config cookie, mainteneur confirme « 1 projet »
- supabase.com/blog/jwt-signing-keys — clés asymétriques + JWKS, vérif locale du JWT
- supabase.com/docs/.../custom-access-token-hook — injection claims org/rôle
- docs.n8n.io/.../respondtowebhook — sync vs async, timeout 64s
- vercel.com/kb/.../multiple-projects-under-a-single-domain — gateway / cookie `.sablia.io`

## Implementation Patterns

### Config cookie cross-sous-domaines (`@supabase/ssr`)
À appliquer identiquement côté serveur ET navigateur — un mismatch crée un cookie plus étroit qui masque le partagé.
```typescript
createServerClient(url, anonKey, {
  cookieOptions: {
    domain: process.env.NODE_ENV === "production" ? ".sablia.io" : "localhost",
    path: "/", sameSite: "lax", secure: true,
  },
  cookies: { getAll, setAll },
});
```
Source: github.com/supabase/supabase/discussions/5742

### Lecture des claims en middleware (zéro round-trip DB)
```typescript
const { data: { claims } } = await supabase.auth.getClaims();
const orgId = claims?.app_metadata?.org_id;
const role  = claims?.app_metadata?.org_role;
if (!orgId) return NextResponse.redirect('/login');
```
Source: supabase.com/docs/reference/javascript/auth-getclaims

### Trigger n8n sécurisé (Route Handler, secret server-only)
```typescript
// app/api/trigger-workflow/route.ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'X-API-Key': process.env.N8N_WEBHOOK_SECRET!, 'X-Idempotency-Key': key },
  body: JSON.stringify({ ...body, userId: user.id }),
});
```
Source: makerkit.dev/blog/tutorials/nextjs-api-best-practices

### Registre d'apps + entitlement (app-launcher)
```sql
create type public.app_permission as enum ('app.ads', 'app.crm', 'app.voice');
create table public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, label text not null, icon_url text,
  launch_url text not null, required_permission text not null,
  org_id uuid references organizations(id)  -- NULL = toutes orgs
);
create policy "only permitted apps" on public.apps
  for select using (authorize(apps.required_permission));
```
Source: supabase.com/docs/.../custom-claims-and-role-based-access-control-rbac

## Cost & Performance Baseline

| Metric | Value | Source | Notes |
|--------|-------|--------|-------|
| Build custom vs Retool | $0 vs $260/mo (4×$65) | retool.com/blog/ai-build-vs-buy-report-2026 | + lock-in évité ; devient asset démo client |
| Timeout sync webhook n8n | 64 s | docs.n8n.io | > 30s → async jobId+poll obligatoire |
| Expiry JWT Supabase | 3600 s (1h, min 60s) | supabase docs | Fenêtre de staleness révocation org |
| Propagation rotation JWKS | ~20 min (10 edge + 10 client) | supabase.com/blog/jwt-signing-keys | Clés asymétriques |
| Seuil monolithe → split | > 50 devs / > 30 min build | HN / feature-sliced | Sablia très en-dessous |
| Latence rewrites Vercel | < 1 ms | vercel.com/kb | Gateway path-based |

## Constraints & Decisions
- **Stack imposée** : Next.js 16 + React 19 + @supabase/ssr + Tailwind v4 + shadcn (STACK.md). Apps à fédérer déjà conformes ; seul le site marketing est Vite (laissé tel quel).
- **Invariant dur** : SSO par cookie ⇒ UN projet Supabase ; RLS ne traverse pas les projets ⇒ données filtrées par user et auth dans le même projet.
- **MVP** = équipe interne (Brice, Rémi, Raphaël, Pablo), org unique `sablia-internal` ; archi multi-tenant-ready (FK `org_id`), extension = insertions.
- **Sécurité** : secret n8n jamais côté client ; Route Handler valide session+permission avant tout appel ; IP allowlist sur n8n.sablia.io.
- **Décidé** : Turborepo + RBAC Postgres natif + base `Sablia` comme identité plateforme ; vox SSO différé Phase 2.

## Open Questions
1. Vérifier que la base `Sablia` (créée 2025-09-06) utilise bien les clés JWT **asymétriques** (sinon migration avant `getClaims()` local).
2. La base `Sablia` est très sollicitée par les crons (heartbeats, autofix queue, cold email) — l'ajout de l'auth + RLS y pose-t-il un problème de charge / d'isolation ? Faut-il un schéma dédié `platform`/`auth_app` ?
3. Dashboards à fédérer : routes internes du portail (monolithe-léger) OU sous-domaines autonomes (`ads.sablia.io`) ? Critère = poids/cadence de release de chaque app.
4. OAuth Google déjà utilisé : confirmer la version `@supabase/ssr` post-PR #30424 (bug propagation domaine sur le callback OAuth).
5. Périmètre exact du MVP : quelles apps en Phase 1 (portail + ads seulement, ou +autoresearch-dashboard/board) ?
6. vox : migration complète vers la base plateforme en Phase 2, ou vox reste un silo et on accepte un double login durablement ?

---

## Research Archive

### Top 10 Findings

| # | Finding | Source | Relevance | Domains |
|---|---------|--------|-----------|---------|
| 1 | Un seul projet Supabase requis pour SSO cookie | discussions/5742 | HIGH | Web Dev & SaaS |
| 2 | Config `cookieOptions.domain: ".sablia.io"` (serveur+nav) | micheleong.com | HIGH | Web Dev & SaaS |
| 3 | Anti-fragmentation : monolithe/Turborepo < 50 devs | HN 37929711 | HIGH | Web Dev & SaaS |
| 4 | RBAC natif Supabase mappe sur app-launcher (`authorize()`) | supabase docs RBAC | HIGH | Web Dev & SaaS, AI Agents & LLM |
| 5 | Trigger n8n = Route Handler + Header Auth, secret server-only | docs.n8n.io | HIGH | n8n & Automation, Web Dev & SaaS |
| 6 | `getClaims()` + clés asymétriques = vérif JWT locale | supabase.com/blog/jwt-signing-keys | HIGH | Web Dev & SaaS |
| 7 | `custom_access_token_hook` injecte org/rôle dans `app_metadata` | supabase docs | HIGH | Web Dev & SaaS |
| 8 | Timeout sync n8n 64s → async jobId+poll | community.n8n.io/125678 | HIGH | n8n & Automation |
| 9 | Build custom $0 vs Retool $260/mo + asset démo | retool.com 2026 | MEDIUM | Business & Services |
| 10 | Registre `apps` découplé des grants (Fiori) + idempotence clé client | heflo.com / n8n 275249 | MEDIUM | Web Dev & SaaS, n8n & Automation |

### By Research Angle

#### Supabase cross-subdomain SSO & multi-tenant auth
**Agent stats**: 8 queries | 9 fetches | 9 findings | 0 failed queries | 1 failed fetch
- **Cookie domain `.sablia.io`** — sur serveur+nav, `@supabase/ssr` ≥ 0.6.1. Source: discussions/5742. HIGH. Web Dev & SaaS.
- **1 projet = condition du SSO cookie** — projets séparés = silos JWT. Source: discussions/5742. HIGH.
- **Bug OAuth callback ignore `domain`** (issue #30279, fixé PR #30424) — pin la version. Source: github issue 30279. MEDIUM.
- **`custom_access_token_hook`** — query `user_org_memberships`, `jsonb_set` dans `app_metadata` (safe, non user-writable). Source: supabase docs. HIGH.
- **`auth.jwt()` en RLS vs `getClaims()` en middleware** — lecture claim sans round-trip. Source: supabase docs. HIGH.
- **Clés JWT asymétriques (juil. 2025)** — JWKS public, vérif locale ; défaut RSA depuis mai 2025. Source: supabase blog. HIGH.
- **RLS claim JWT vs join** — claim = rapide mais stale 1h (révocation org en différé, mitiger via refresh n8n). Source: supabase docs. MEDIUM.
- **Localhost ne respecte pas `Domain`** — `/etc/hosts` + `.sablia.local` ou reverse-proxy dev. Source: discussions/5742. MEDIUM.
- **httpOnly split-cookie par défaut** — ne pas override sauf nécessité. Source: discussions/5742. MEDIUM.

#### Federated frontend / portal hosting architecture
**Agent stats**: 8 queries | 6 fetches | 10 findings | 0 failed queries | 0 failed fetches
- **Next.js Multi-Zones** — `assetPrefix` + rewrites, mais hard-navigation entre zones, UI partagée à packager. Source: nextjs.org/docs. MEDIUM. Web Dev & SaaS.
- **Gateway Vercel path-based** — ~5 lignes `vercel.json`, < 1ms, apps indépendantes. Source: vercel.com/kb. HIGH.
- **Cookie cross-projets Vercel non automatique** — scoper `.sablia.io`. Source: vercel.com/kb. HIGH.
- **Sous-domaines + cookie parent** — isolation max, mais wildcard TLS + CORS. Source: github PHAC/183. MEDIUM.
- **Module Federation justifié à grande échelle seulement** — O(N²) deps. Source: HN 37929711. HIGH.
- **Monolithe = plus rapide < 20 devs / < 15 min build**. Source: dailydevpost. HIGH.
- **Turborepo = voie médiane** — apps séparées + `packages/` partagés, pas de big-bang. Source: feature-sliced. HIGH.
- **Multi-Zones ne partage pas les layouts** — extraire `@sablia/ui`. Source: nextjs.org. MEDIUM.
- **Garder le SPA marketing via gateway** — code intact. Source: dev.to/ianmacartney. HIGH.
- **FSD : poser les frontières dans le monolithe d'abord** — extraction sûre plus tard. Source: feature-sliced. MEDIUM.

#### Internal RBAC, entitlements & app-launcher patterns
**Agent stats**: 8 queries | 5 fetches | 9 findings | 0 failed queries | 0 failed fetches
- **RBAC pur = bon départ ; hybride RBAC→ReBAC→ABAC plus tard**. Source: caduh.com. HIGH. Web Dev & SaaS.
- **RBAC natif Supabase** — enums + hook JWT + `authorize()` RLS. Source: supabase docs. HIGH.
- **Table `apps` découplée des grants** — nouvelle app = une ligne. Source: inference/Fiori. HIGH.
- **Schéma multi-tenant = `org_id` FK partout** — `user_org_memberships` déjà compatible. Source: permit.io. HIGH.
- **Clés dot-namespacées** `app.crm`/`feature.crm.bulk_import` — pas de système de flags séparé. Source: schematichq. MEDIUM.
- **OpenFGA/Permify/SpiceDB overkill** < 20 apps. Source: pkgpulse. MEDIUM.
- **CASL = authz JS zéro infra** — filtrage UI + RLS. Source: sph.sh. MEDIUM.
- **Custom > Retool ($260/mo) / Appsmith** pour équipe dev. Source: retool.com. MEDIUM. Business.
- **SAP Fiori Launchpad** — sépare catalogue/entitlement/layout. Source: heflo.com. MEDIUM.

#### Secure webhook-trigger UIs from authenticated web apps
**Agent stats**: 7 queries | 6 fetches | 9 findings | 0 failed queries | 0 failed fetches
- **Route Handler + secret header server-only** — jamais `NEXT_PUBLIC_*`. Source: makerkit.dev. HIGH. n8n & Automation.
- **n8n Header Auth** = bon choix service-to-service. Source: docs.n8n.io. HIGH.
- **HMAC** plus fort mais pas natif n8n (code node + `timingSafeEqual`). Source: rapidevelopers. MEDIUM.
- **Sync vs async : limite 64s** — `Respond: Immediately` + `{jobId}`. Source: docs.n8n.io. HIGH.
- **Async = jobId + poll/callback** ; `$execution.id` dispo tôt ; Wait node après 65s. Source: community.n8n.io. HIGH.
- **Idempotence = UUID client stable** + `SET NX` Redis / unique Supabase. Source: community.n8n.io. HIGH.
- **JWT Auth Supabase possible** mais n8n ne vérifie pas `exp`/`iss`/`aud` auto. Source: community.n8n.io. MEDIUM.
- **Erreurs : n8n renvoie 200 même en échec** — envelope `{success,error,data}` explicite. Source: inference. MEDIUM.
- **Durcissement réseau : IP allowlist egress Vercel** sur n8n.sablia.io. Source: logicworkflow.com. MEDIUM.

### Sablia Cross-Domain Map

| Domain | Relevant Findings | Actionable Ideas |
|--------|-------------------|------------------|
| Voice Agents & Telephony | 2 | Consolider vox dans le SSO plateforme (Phase 2) ; modèle auth vox = source de vérité |
| n8n & Automation | 8 | Package « trigger n8n » réutilisable (Route Handler + Header Auth + async) ; durcir n8n.sablia.io |
| Web Dev & SaaS | 24 | Turborepo + cookie `.sablia.io` + RBAC natif Supabase ; portail `app.sablia.io` |
| Cold Email & Outreach | 0 | None found |
| AI Agents & LLM | 1 | UIs de lancement d'automatisations IA via n8n (préparer le CRM) |
| Business & Services | 2 | Portail custom = $0 + asset démo client ; brique vers l'offre CRM |

### Unconventional Takes
1. **Le vrai sujet n'est pas l'auth, c'est la consolidation des données.** On part de « faire un login comme vox », mais le login est trivial (cookie `.sablia.io`, hook JWT — déjà fait dans vox). Le coût réel et le risque sont dans le choix « quel projet Supabase héberge l'identité », parce que la RLS ne traverse pas les projets : la décision force, à terme, à rapatrier toutes les données filtrées-par-user dans une base unique. Le brainstorm a déplacé la question de « comment authentifier » vers « où vit la donnée ».
2. **Construire le portail interne est un acte commercial, pas seulement technique.** Un portail RBAC multi-tenant fait maison devient une démo vivante pour les prospects CRM (« voilà comment on modéliserait les accès de votre équipe »). Le MVP interne et l'asset de vente sont le même livrable — argument fort contre Retool/Appsmith au-delà du simple coût.
3. **La tentation micro-frontend est un piège de maturité.** « Plusieurs apps indépendantes » évoque instinctivement Module Federation / micro-frontends, mais tout le signal 2025-2026 dit : à < 50 devs c'est de la dette pure. La bonne réponse « avancée » est en fait la plus simple — un monorepo Turborepo avec des packages partagés. Résister à la sur-ingénierie est ici la décision d'architecture la plus rentable.

### Other Next Steps
- `/architect portail-auth-unifie` — découper en unités (socle identité, RBAC, portail shell, fédération ads, package n8n-trigger, Phase 2 vox/marketing).
- `/n8n-create` — workflow de refresh de session sur changement de membership org (mitigation staleness JWT 1h), quand le RBAC sera en place.
