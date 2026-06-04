---
type: brainstorm
status: pending
topic: "Portal dashboard: Claude conversation themes/summaries + cron health"
created: "2026-06-04"
agents: 5
findings: 46
sources: 30
---

# Brainstorm: Portal dashboard — Claude conversation themes/summaries + cron health

> Generated 2026-06-04 | 5 research agents + 1 workspace-map agent | ~30 sources consulted | 46 raw findings

## Executive Summary
The idea — a new app in the sablia.io portal that visually tracks the **themes/summaries of our Claude Code conversations** plus **cron health** — splits cleanly into one solved half and one net-new half. The cron half is **largely already built**: `cron_runs` + `cron_heartbeats` tables already exist and are populated in the `sablia` Supabase project; the dashboard just *reads* them. The conversation half is the real work and is a **genuinely under-served niche**: usage/cost is solved first-party (native Claude Code analytics, `ccusage`) and session-viewing is solved a dozen times over, but *cross-session theme tracking + AI summaries in a DB-backed dashboard* is done by essentially no forkable tool (the closest, `claude-mem`, stores local SQLite/Chroma). The unexpectedly strong recommendation across three independent angles: **don't use a fragile lifecycle hook — have `/close` itself write the row.** Sablia owns `/close`, it already has the themes + files + git diff in context, and this sidesteps a documented bug (#41577) that kills `SessionEnd` hooks mid-write.

## Problem Statement
Today, "what have Brice and Claude been working on, and which themes recur over time?" is only answerable by grepping `memory/daily/*.md` and reading `STATUS.md`; cron health is scattered across an `infra-health` STATUS.md anchor and Telegram pings. There is no single visual surface. The opportunity: a portal dashboard that turns the conversation stream into trackable themes + summaries and unifies cron health beside it — directly serving Principle 7 (*la compréhension ne se délègue pas*: a visual surface of what we did grows Brice's understanding, vs a passive text dump).

## Key Findings
- **`/close` should write the summary row, not a hook.** SessionEnd is semantically correct but a documented bug (#41577) SIGKILLs async hooks mid-write; Stop fires per-turn (wrong granularity). Sablia owns the `/close` skill, which already holds themes + files + git diff — the most robust ingestion point. Source: https://code.claude.com/docs/en/hooks. Relevance: HIGH.
- **The cron half already exists at the data layer.** `cron_runs` + `cron_heartbeats` tables are present and populated in the `sablia` Supabase project (service-role RLS). The dashboard reads them — no new ingestion to build for crons. Source: workspace map (CRONS.md / HEALTH-MODEL.md). Relevance: HIGH.
- **The conversation-theme dashboard is an unserved gap.** `claude-mem` (80.5K★, Apache-2.0) is the only close prior art (hooks + Agent-SDK summarization + viewer) but stores **local-only** SQLite/ChromaDB. Fork its capture+summarization *idea*, swap storage to Supabase, build a fresh Next.js viewer. Source: https://github.com/thedotmack/claude-mem. Relevance: HIGH.
- **For this data size, skip embeddings/clustering.** The Clio method (LLM facet-extract → optional embed/cluster → LLM name clusters) is canonical, but clustering needs volume (HDBSCAN labels up to 90% of a small corpus as outliers). Have Claude emit a structured `{summary, primary_theme, themes[]}` at `/close`; defer pgvector to phase 3. Source: https://www.anthropic.com/research/clio. Relevance: HIGH.
- **Don't rebuild usage/cost.** Native Claude Code analytics + Grafana dashboard #25052 + `ccusage` own tokens/cost via OpenTelemetry. Spend build effort on the theme layer; optionally pipe OTel for cost panels later. Source: https://code.claude.com/docs/en/analytics. Relevance: MEDIUM.

## Decision Matrix — conversation ingestion trigger
2+ viable triggers emerged and the choice drives the whole architecture.

| Option | Reliability | Granularity | Has full context | Effort | Sablia Fit |
|--------|-------------|-------------|------------------|--------|------------|
| **`/close` in-skill Supabase write** | High (runs while Claude alive) | 1 row/session | Yes (themes, files, diff) | Low | **Best — Sablia owns the skill** |
| `UserPromptExpansion` hook (matcher `close`) | High (deterministic) | 1 row/session | No (must re-read transcript) | Med | Good backstop |
| `SessionEnd` hook (sync/detached) | Med (bug #41577 kills async) | 1 row/session | No | Med | Backstop for non-`/close` sessions only |
| `Stop` hook | Low (fires every turn) | 1 row/turn | Partial | High | Poor for session summary |
| OpenTelemetry export | High | metrics only | No (prompts redacted) | Low | Cost/token panels only, not themes |

**Recommendation**: `/close` in-skill write as the **primary** path for themes+summaries; **OTel** (later) for cost/token/session-count panels; a **SessionEnd backstop** only if we want to capture sessions that never run `/close`. The two channels join on `session_id`.

## Decision Matrix — theme extraction approach
| Option | Min. data size | Interpretable labels | Emergent themes | v1 fit |
|--------|----------------|----------------------|-----------------|--------|
| **LLM tags at `/close` (structured output)** | none | Yes (free) | Via free-text `themes[]` | **Yes — v1** |
| pgvector + k-means (in-DB) | ~hundreds | No (needs LLM naming) | Yes | Phase 3 |
| BERTopic / Kura (offline batch) | 100–1,000+ | Partial | Yes | Overkill until scale |

**Recommendation**: hybrid — a small **fixed `primary_theme` enum** (clean weekly stacked-area chart) + a **free-text `themes[]`** array (novelty), with a monthly LLM "taxonomy review" promoting recurring free-text labels into the enum. No embeddings for v1.

## Prior Art / Inspiration
- **claude-mem** — https://github.com/thedotmack/claude-mem — 80.5K★ Apache-2.0; hooks + Agent-SDK summarization + local viewer. Closest prior art; storage is local SQLite/Chroma (swap to Supabase).
- **claude-memory-compiler** — https://github.com/coleam00/claude-memory-compiler — capture→refine→consolidate into themed knowledge; argues against embeddings at small scale. ⚠️ **No license** — can't fork, study only.
- **ccusage** — https://github.com/ryoppippi/ccusage — 15.5K★; reference JSONL parser + cost math (license reads NOASSERTION — verify before reuse).
- **claude-code-otel** — https://github.com/ColeMurray/claude-code-otel — 419★ MIT; OTel→Prometheus/Loki→Grafana. Don't fork into Next.js; the OTel *config* is the takeaway.
- **healthchecks.io** — https://github.com/healthchecks/healthchecks — BSD; gold-standard heartbeat/dead-man's-switch ping contract + grace logic to replicate.
- **Kura** — https://github.com/jxnl/kura — MIT Clio reproduction (summarize→cluster→hierarchy→2D map); reference for a phase-3 emergent-theme batch run.

## Proposed Scope
**Phase 1 — MVP (the differentiator)**
- Create a `cc_sessions` table in the `sablia` Supabase project: `session_id`, `ts`, `cwd/project`, `summary`, `primary_theme` (enum), `themes text[]`, `artifacts`, `git_sha`, plus a JSONB `payload`. BRIN(ts) + GIN(themes) indexes.
- Add a structured-output step to `/close`: Claude emits `{summary, primary_theme, themes[], artifacts}`, then a small script writes one row using the **service-role key** (from `.credentials/`, never client-shipped).
- New portal route `apps/portal/src/app/(app)/observatory/` (name TBD), gated by existing `@sablia/auth` + `platform.user_app_permissions`. Three panels: (a) **weekly stacked-area "themes per week"** from `primary_theme`, (b) **recent-sessions feed** with summaries, (c) **cron-health grid** reading the existing `cron_runs` + `cron_heartbeats`.
- Charts: shadcn `chart` over **recharts 2.15.4** (the pinned `react-is` 19 override already in the portal from Unit 4 — reuse, do NOT upgrade to 3.x).

**Phase 2 — depth**
- Backfill historical sessions by parsing `memory/daily/*.md` frontmatter (one-off cron).
- `SessionEnd` backstop hook (sync/detached write) for sessions that never run `/close`.
- Telegram alert on cron down-transition (reuse `telegram_notification_log`).
- Supabase Realtime (`postgres_changes`) for a live-updating feed.

**Phase 3 — emergent + cost**
- pgvector embedding column on `cc_sessions` → "similar past sessions" semantic search + offline k-means for emergent themes; monthly LLM taxonomy review.
- OTel → cost/token/session panels (or just link native analytics).
- Consume the learning-layer `learning_topics` table as an "À apprendre" tile.

## Technical Reference Sheet

| Package | Version | Context7 ID | Link | Notes |
|---------|---------|-------------|------|-------|
| @supabase/ssr | 0.10.2 | /supabase/ssr | supabase.com/docs | Read side (Server Component + client) |
| recharts | 2.15.4 (exact) | /recharts/recharts | recharts.org | Needs `react-is` 19 override; do NOT use 3.x |
| pg_cron | — | /citusdata/pg_cron | supabase.com/docs/guides/cron | `cron.job_run_details` for DB-side schedules |
| pgvector | — | /pgvector/pgvector | supabase.com/docs/guides/ai | Phase 3 semantic search (+ /pgvector/pgvector-node) |
| healthchecks | — | /websites/healthchecks_io | healthchecks.io/docs | Ping-contract reference to replicate |
| runitor | — | /bdd/runitor | github.com/bdotdub/runitor | Wraps a cron command → auto start/exit/duration ping |
| bertopic | — | /maartengr/bertopic | maartengr.github.io/BERTopic | Phase 3 only; overkill at small scale |
| sentence-transformers | — | /huggingface/sentence-transformers | sbert.net | Local embeddings if avoiding paid API |
| claude-mem | — | /thedotmack/claude-mem | github.com/thedotmack/claude-mem | Pipeline to study/fork |
| kura | N/A | N/A (Context7 match is unrelated Eclipse IoT) | usekura.xyz | Phase-3 emergent-theme batch reference |

Key URLs:
- https://code.claude.com/docs/en/hooks — hook events, payloads, `type:"http"`/`command`
- https://code.claude.com/docs/en/monitoring-usage — OTel metrics, attributes, `session.id` join key
- https://supabase.com/blog/postgres-audit — append-only JSONB event-log schema template
- https://healthchecks.io/docs/http_api/ — start/fail/exit-code ping contract + duration
- https://www.anthropic.com/research/clio — facet-extract → cluster → name pipeline

## Implementation Patterns

### `/close` structured theme-tagging (the v1 core)
Claude emits this at `/close`; validate with Zod, write one `cc_sessions` row.
```jsonc
{
  "type": "object",
  "properties": {
    "summary":      { "type": "string", "description": "2-3 sentence recap, 'why' not 'what'" },
    "primary_theme":{ "type": "string", "enum": ["n8n","voice","frontend","infra","cold-email","planning","docs","other"] },
    "themes":       { "type": "array", "items": { "type": "string" }, "maxItems": 4 },
    "artifacts":    { "type": "array", "items": { "type": "string" } }
  },
  "required": ["summary","primary_theme","themes"]
}
```
Source: https://www.anthropic.com/research/clio (facet pattern) + Anthropic tool-use docs.

### Append-only event/session schema (Supabase audit pattern)
```sql
create table cc_sessions (
  id          bigserial primary key,
  session_id  uuid,
  ts          timestamptz not null default now(),
  project     text,
  summary     text,
  primary_theme text,
  themes      text[] default '{}',
  payload     jsonb
);
create index cc_sessions_ts on cc_sessions using brin(ts);          -- ~100s× smaller than btree
create index cc_sessions_themes on cc_sessions using gin(themes);   -- theme = ANY(...) / @>
-- weekly theme time-series for the stacked-area chart:
select date_trunc('week', ts) wk, primary_theme, count(*)
from cc_sessions group by 1,2 order by 1;
```
Source: https://supabase.com/blog/postgres-audit.

### Cron heartbeat (if extending VPS-cron coverage)
```bash
URL="$SUPABASE_FUNCTIONS_URL/cron-ping/<job>"
curl -fsS -m 10 --retry 5 "$URL/start"
out=$(/path/to/job.py 2>&1); code=$?
curl -fsS -m 10 --retry 5 --data-raw "$out" "$URL/$code"   # 0=ok, 1-255=fail; duration auto-computed
```
Source: https://healthchecks.io/docs/http_api/.

## Cost & Performance Baseline

| Metric | Value | Source | Notes |
|--------|-------|--------|-------|
| claude-mem | 80,582★, Apache-2.0 | github.com/thedotmack/claude-mem | Dominant prior art (local storage) |
| ccusage | 15,527★, NOASSERTION | github.com/ryoppippi/ccusage | Verify license before reuse |
| claude-memory-compiler | 1,122★, NO license | github.com/coleam00 | Study only — can't fork |
| Supabase Realtime (free) | 200 conns / 2M msgs/mo / 256 KB | supabase.com/docs/guides/realtime/limits | Non-issue at single-user scale |
| Supabase DB (free) | ~500 MB | supabase docs | Only long-term ceiling → add retention cron |
| BRIN vs BTREE | ~100s× smaller | supabase.com/blog/postgres-audit | On monotonic `ts` |
| OTel export interval | metrics 60s / logs 5s | code.claude.com/docs/en/monitoring-usage | Phase-3 cost panels |
| Cronitor (hosted) | $2/monitor/mo, free=5 | cronitor.io/pricing | Stopgap; keeps data off-VPS |
| Clio study scale | 1M conversations | anthropic.com/research/clio | Why clustering needs volume |
| HDBSCAN small-corpus | up to 90% outliers | chrisellis.dev | Why skip clustering for v1 |
| recharts pin | 2.15.4 + react-is 19.2.6 | STACK.md / recharts#6857 | Confirmed; 3.x reintroduces blank-render |

## Constraints & Decisions
- **Host**: single-app `apps/portal`, add route `(app)/observatory/` (not a new monorepo app). Next 16.2.6 + React 19 + Tailwind v4 + shadcn + `@sablia/auth`.
- **Supabase**: `sablia` project (`qlxoitzdxjqhljjoeqoq`) — same project as `cron_runs`/`cron_heartbeats`/`telegram_notification_log` and the planned `learning_topics`. Keeps all infra data co-located.
- **Charts**: recharts 2.15.4 exact + `react-is` 19 override (already present in the portal from Unit 4) — reuse, do NOT upgrade to 3.x.
- **Security**: service-role key for the hook/`/close` writer (server-side only, `.credentials/`, never committed/client-shipped). Anon write-only RLS only if a writer could ever leak client-side (has a returning-representation gotcha).
- **Realtime**: `postgres_changes` is correct at single-user scale; Broadcast-from-triggers is the escape hatch only if viewers multiply.
- **Relationship to Learning Layer**: complementary, not duplicative. `learning_topics` = *external resources to understand* (surfaced via `/prime`+Telegram); `cc_sessions` = *what we actually did together*. The dashboard can render `learning_topics` as one tile.
- **Don't rebuild usage/cost** — native analytics/`ccusage` solve it; theme layer is the build.

## Open Questions
1. **Exact schema of the existing `cron_runs` + `cron_heartbeats`** — verify columns before the dashboard reads them (and whether a retention/purge job already exists; pg_cron never auto-purges).
2. **Schema placement** for `cc_sessions` — `sablia` `public` with a prefix, a dedicated `observ` schema, or the portal's `platform` schema?
3. **Which skills write rows** — only `/close`, or also `/execute`/`/validate`/`/plan` (richer but noisier; risk of multi-row-per-session)?
4. **Starter `primary_theme` enum** — derive from existing `memory/topics/` filenames, or hand-pick?
5. **Backfill** — parse `memory/daily/*.md` history into `cc_sessions`, or start fresh from 2026-06-04?
6. **App naming** — "Observatory" / "Cockpit" / "Suivi" / other?
7. **Ship independently or fold into the learning-layer roadmap** (which is pending `/challenge`)?

---

## Research Archive

### Top 10 Findings

| # | Finding | Source | Relevance | Domains |
|---|---------|--------|-----------|---------|
| 1 | `/close` in-skill write is the most robust ingestion trigger (avoids SessionEnd bug #41577) | code.claude.com/docs/en/hooks | HIGH | AI Agents & LLM |
| 2 | Cron half already built: `cron_runs` + `cron_heartbeats` exist in sablia Supabase | workspace map (CRONS.md) | HIGH | n8n & Automation; Web Dev |
| 3 | Theme-tracking DB-backed dashboard is an unserved gap; claude-mem (80.5K★) closest but local-only | github.com/thedotmack/claude-mem | HIGH | AI Agents & LLM |
| 4 | Clio pipeline: LLM facet-extract first, embed/cluster optional | anthropic.com/research/clio | HIGH | AI Agents & LLM |
| 5 | Small dataset → LLM-tags-at-write-time beats clustering; skip embeddings v1 | chrisellis.dev | HIGH | AI Agents & LLM |
| 6 | Service-role key from server-side hook = least-effort secure ingestion | supabase.com/docs/guides/api/securing-your-api | HIGH | Web Dev & SaaS |
| 7 | Append-only JSONB + `text[]` themes (GIN) + BRIN(ts) schema | supabase.com/blog/postgres-audit | HIGH | Web Dev & SaaS |
| 8 | Heartbeat dead-man's-switch catches silent no-show in-script logging can't | healthchecks.io/docs/monitoring_cron_jobs | HIGH | n8n & Automation |
| 9 | recharts 2.15.4 + react-is 19 pin confirmed correct; don't upgrade to 3.x | recharts#6857 | MED | Web Dev & SaaS |
| 10 | Transcript JSONL has full conversation; `sessions-index.json` already has auto-summaries | code.claude.com/docs/en/hooks | MED | AI Agents & LLM |

### By Research Angle

#### Claude Code observability mechanisms
**Agent stats**: 6 queries | 2 fetches | 9 findings | 0 failed queries | 0 failed fetches

- **SessionEnd fires once at exit but bug #41577 kills async hooks mid-write** — write must be sync/fast or detached (`nohup … & disown`). Source: github.com/anthropics/claude-code/issues/41577. HIGH. Domains: AI Agents & LLM.
- **Stop fires per-turn** — wrong granularity for one-summary-per-session; suited to incremental deltas. Source: code.claude.com/docs/en/hooks. MED. AI Agents & LLM.
- **`/close` surfaces as `UserPromptExpansion`** (`command_name:"close"`) — cleanest to write from inside the skill while Claude is alive. HIGH. AI Agents & LLM.
- **Every hook gets `session_id` + `transcript_path` + `cwd` via stdin** — hand the path to a downstream parser. HIGH. AI Agents & LLM.
- **Hooks run arbitrary shell (`type:"command"`) OR POST directly (`type:"http"`)** — curl-to-Supabase natively supported. HIGH. Web Dev; AI Agents & LLM.
- **Transcript JSONL = complete conversation** at `~/.claude/projects/<enc>/<session>.jsonl` (text/thinking/tool_use/tool_result + per-message `usage`). HIGH. AI Agents & LLM.
- **`sessions-index.json` already holds auto-generated per-session summaries** (undocumented — verify on machine). MED. AI Agents & LLM.
- **OTel export** (`CLAUDE_CODE_ENABLE_TELEMETRY=1`): `claude_code.cost.usage`, `token.usage`, `session.count`, etc.; prompts redacted unless `OTEL_LOG_USER_PROMPTS=1`. HIGH (cost half). n8n & Automation; AI Agents & LLM.
- **`session.id` is the shared join key** between OTel metrics and hook-written rows; `tool_use_id` cross-links at tool granularity. MED. Web Dev; AI Agents & LLM.

#### Existing OSS tools & dashboards for Claude Code
**Agent stats**: 6 queries | 4 fetches | 9 findings | 0 failed queries | 0 failed fetches

- **claude-mem** (80.5K★, Apache-2.0) — hooks + Agent-SDK summarization + local viewer; swap storage to Supabase. HIGH. AI Agents & LLM.
- **ccusage** (15.5K★, NOASSERTION) — JSONL parser + cost; terminal-only, lift the parsing lib. MED. AI Agents & LLM; Business.
- **claude-memory-compiler** (1.1K★, NO license) — capture→refine→consolidate themed knowledge; no-embeddings argument. Study only. MED. AI Agents & LLM.
- **claude-code-otel** (419★, MIT) — OTel→Prometheus/Loki→Grafana; metrics only, don't fork into Next.js. MED. Web Dev.
- **vibe-log** (328★, MIT) — productivity insights + summaries; polished dashboard is the proprietary cloud tier. MED. AI Agents & LLM; Business.
- **Session-viewer cluster** — many JSONL browsers; all confirm `~/.claude/projects/**/*.jsonl` is canonical; none do cross-session theme clustering. MED. AI Agents & LLM.
- **Real-time multi-session monitors** (Stargx/claude-code-dashboard, ccgauge, MyCCusage) — "what's running now"; orthogonal. LOW. Web Dev.
- **Native Claude Code analytics + Grafana #25052** — usage/cost is first-party solved; don't rebuild. MED. Web Dev; Business.
- **awesome-claude-code** — watch-list directory where new tools surface (claude-mem featured). LOW. AI Agents & LLM.

#### Conversation theme extraction & summarization
**Agent stats**: 8 queries | 3 fetches | 10 findings | 0 failed queries | 0 failed fetches

- **Clio pipeline** (Anthropic) — facet-extract → semantic cluster → LLM name → hierarchy; LLM bookends a cheap embed step. HIGH. AI Agents & LLM.
- **Kura** (MIT) — OSS Clio reproduction; tuned for 100/1,000/10,000+ conversations — overkill for one user. MED. AI Agents & LLM.
- **LLM-tags-at-write-time beats clustering at small scale** — HDBSCAN up to 90% outliers; no min-size for LLM labels. HIGH. AI Agents & LLM.
- **Cost negligible at single-user volume** — theme tag rides the already-running `/close` turn; embeddings add capability, not savings. MED. AI Agents & LLM; Business.
- **Structured output enforces stable theme schema** — enum = fixed taxonomy, free-text = emergent; the single fixed-vs-emergent lever. HIGH. AI Agents & LLM.
- **Fixed vs emergent is the core decision** — hybrid (enum spine + free-text + monthly taxonomy review) wins for a personal dashboard. HIGH. AI Agents & LLM.
- **pgvector** is the right home for embeddings when added (HNSW < 1M rows, no new vendor). MED. Web Dev; AI Agents & LLM.
- **BERTopic** — heavyweight; small-dataset remedies (seed topics) = re-introducing a taxonomy by hand. LOW. AI Agents & LLM.
- **Viz: SparkClouds + stacked-area beat plain tag clouds** — stacked-area "themes per week" is highest signal. MED. Web Dev.
- **WildVis / 2D bubble map** — embedding-space view; meaningful only at hundreds+ points. LOW. Web Dev; AI Agents & LLM.

#### Dashboard architecture & ingestion
**Agent stats**: 9 queries | 5 fetches | 9 findings | 0 failed queries | 2 failed fetches

- **Service-role from server-side hook beats scoped anon insert** — trusted environment, documented pattern. HIGH. Web Dev.
- **Anon write-only RLS gotcha** — needs `returning:'minimal'` or a SELECT policy or the insert read-back fails. MED. Web Dev.
- **Append-only JSONB + real columns + BRIN(ts)** — Supabase's own audit pattern; don't filter inside JSONB on hot paths. HIGH. Web Dev.
- **`text[]` + GIN for themes** beats a join table at this scale; `unnest(themes)` feeds categorical charts. HIGH. Web Dev.
- **Server Component initial fetch + client `postgres_changes` subscription** (with `removeChannel` cleanup). HIGH. Web Dev.
- **Broadcast-from-triggers** is the scale escape hatch; `postgres_changes` fine for single-user. MED. Web Dev.
- **Realtime free-tier (200 conns / 2M msgs/mo)** a non-issue; DB storage (~500 MB) is the only ceiling. MED. Web Dev.
- **recharts 2.15.4 + react-is 19 override CONFIRMED** under React 19; 3.x reintroduces blank-render (#6857). MED. Web Dev.
- **shadcn `chart`** wraps recharts, Tailwind-v4/React-19 ready (`var(--chart-1)` token syntax). MED. Web Dev.

#### Cron & scheduled-job monitoring
**Agent stats**: 6 queries | 3 fetches | 9 findings | 0 failed queries | 1 failed fetch

- **Passive heartbeat (push) beats active polling** — one curl at job end, no inbound network, captures real exit code. HIGH. n8n & Automation.
- **Heartbeat catches failures in-script logging can't** — machine down, bad crontab, never-started (the most dangerous). HIGH. n8n & Automation.
- **Ping contract**: `/start`, `/fail`, `/<exitcode>`, body=output (≤100 kB), duration auto-computed. HIGH. n8n & Automation.
- **Grace Time + Period** make "missed" deterministic: `now > last_ping + period + grace` — fits Karpathy deterministic-metric principle. MED. n8n & Automation.
- **Healthchecks (BSD)** — reference to copy (ping semantics + grace), but a whole Django app to self-host. MED. n8n & Automation.
- **Runitor** (Go) — wraps any command → auto start/exit/duration ping, no script edits. MED. n8n & Automation.
- **pg_cron `cron.job_run_details`** — ready-made cron_runs schema for DB-side schedules. MED. n8n & Automation; Web Dev.
- **pg_cron never auto-purges** — schedule a retention DELETE or it bloats. MED. n8n & Automation; Web Dev.
- **Cronitor** ($2/monitor/mo, free=5) — valid stopgap but data lives off-VPS (conflicts with single-portal goal). LOW. Business; n8n & Automation.

### Sablia Cross-Domain Map

| Domain | Relevant Findings | Actionable Ideas |
|--------|-------------------|------------------|
| Voice Agents & Telephony | 1 | `voice-health-check` / `voice-weekly-report` crons appear in the cron-health grid (reuse existing tables) |
| n8n & Automation | 9 | n8n workflows are crons too — extend the heartbeat/`cron_runs` model to cover them; alert on down-transition via Telegram |
| Web Dev & SaaS | 11 | The whole dashboard: portal route + append-only schema + recharts/shadcn + Realtime — all standard Sablia stack |
| Cold Email & Outreach | 1 | `cold-brain` cron (currently cut) surfaces in the health grid when re-enabled |
| AI Agents & LLM | 13 | `/close` structured-output theme tagging → `cc_sessions`; study claude-mem/Clio; pgvector phase 3 |
| Business & Services | 3 | Serves Principle 7 — a visual surface of "what we did" grows Brice's understanding vs a text dump |

### Unconventional Takes
1. **Don't use a hook at all for the primary path — use the skill you already own.** Every OSS tool reaches for lifecycle hooks because they don't control the agent. Sablia *does* control `/close`. Writing the summary row from inside `/close` (while Claude is alive, with full themes+diff context) is more robust *and* simpler than any hook, and dodges the documented `SessionEnd` async-kill bug entirely. The hook is the fallback, not the foundation.
2. **The "cron dashboard" is 70% already built and nobody noticed.** The instinct was to design a cron-monitoring system; the workspace already has `cron_runs` + `cron_heartbeats` populated. The work isn't building monitoring — it's *rendering* what's already collected. Verify the existing schema before writing a single new table.
3. **Embeddings are a trap at this scale.** The impressive 2D bubble maps and BERTopic clusters everyone reaches for *require* volume; on a single user's tens-to-hundreds of sessions they produce scattered noise (HDBSCAN: up to 90% outliers). The "boring" answer — Claude emits 1-4 theme labels per session — is not a compromise, it's the *correct* method at this scale, and it's free because `/close` is already paying for an LLM turn.
4. **Resist rebuilding usage/cost.** It's the most tempting panel (numbers go up!) and the most wasteful — native analytics + `ccusage` + a free Grafana dashboard already own it. Every hour spent on a token chart is an hour not spent on the theme layer, which is the only thing no tool does.

### Other Next Steps
- `/architect research/brainstorm/2026-06-04-dashboard-conversations-claude-cron.md` — if this ships as its own portal unit (3+ domains: skill change + Supabase + portal frontend).
- `/plan` (single unit) — if scoped tight to Phase 1 MVP only.
- `/brainstorm n8n workflow runs in the cron-health model` — adjacent unknown: unifying n8n execution status into the same `cron_runs` view.
