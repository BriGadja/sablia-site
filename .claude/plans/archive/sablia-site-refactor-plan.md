# Sablia.io Website Refactor - Plan

## What
Refactor sablia.io to eliminate tech debt, fix legal compliance, improve performance, and add content pages.

## Key Findings from Research

### Codebase State
- **84 components**, ~15,000 lines TypeScript
- **~1,000 lines dead code** (duplicate components, unused pages)
- **~650KB unnecessary bundle** (passport, react-icons, GSAP for 3 files, unused shadcn/ui)
- **3 animation libraries** (Framer Motion, GSAP, TSParticles) where 1 suffices
- **No error boundaries** — component crash = white screen
- **No RGPD consent checkbox** on contact form (legal risk)
- **No robots.txt** for search engines

### Industry Research
- B2B sites in 2026: "strategic minimalism", trust-first, performance >90 Lighthouse
- Core Web Vitals tightened: LCP <2.0s, CLS <0.05, INP <200ms
- French B2B culture demands professionalism, credentials, partnership focus
- Case studies are #1 trust mechanism (73% of B2B buyers)
- Transparent pricing is a "conversion killer" when hidden

## Deliverables Created
1. **PRD.md** at project root — full product requirements
2. **Implementation plan** at `.claude/plans/sablia-site-refactor.md` — 4 phases, 24 tasks

## 4 Phases

| Phase | Focus | Tasks | Effort |
|-------|-------|-------|--------|
| **A** | Critical fixes (RGPD, error boundaries, robots.txt) | 5 | 1-2h |
| **B** | Dead code & dependency cleanup (~650KB savings) | 8 | 2-3h |
| **C** | GSAP → Framer Motion migration + performance | 6 | 3-4h |
| **D** | New /faq + /cas-clients pages, OG images, docs | 5 | 2-3h |

**Total**: ~8-12h across sessions

## Next Step
`/execute sablia-site-refactor`
