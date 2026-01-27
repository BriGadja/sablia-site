# Sablia Site - Roadmap

**Last Updated**: 2026-01-26

This document tracks future initiatives for sablia.io that are planned but not yet started.

---

## Completed

### SEO Audit & Optimization (2026-01-26)
- Technical SEO implementation (Phases A-C)
- See `PROGRESS.md` for details

---

## Planned Initiatives

### 1. Sablia Blog / Content Hub

**Priority**: Medium
**Effort**: 2-4 weeks
**Type**: Feature development

**Scope** (from SEO audit Phase D):
- [ ] Plan blog/resource section architecture
- [ ] Research French SEO keywords for n8n/automation niche
- [ ] Create 3-5 use-case pages (by industry or process)
- [ ] Add case studies with measurable ROI results
- [ ] Implement internal linking strategy

**Content Ideas**:
| Type | Target Keyword | Est. Search Volume |
|------|----------------|-------------------|
| Guide | "automatisation PME" | 300-500/mo |
| Tutorial | "formation n8n" | 200-400/mo |
| Comparison | "n8n vs Make.com" | 100-200/mo |
| Use Case | "automatiser facturation" | 150-300/mo |
| ROI Guide | "calculer ROI automatisation" | 50-100/mo |

**Technical Decisions Needed**:
- Content format: MDX files vs headless CMS (Strapi, Sanity)?
- Blog routes: `/blog/*` or `/ressources/*`?
- Category structure: by industry, by tool, by process type?

**To Start**: Run `/plan sablia-blog` when ready

---

### 2. Case Studies Section

**Priority**: Medium-High
**Effort**: 1-2 weeks (code) + ongoing (content)
**Type**: Feature development

**Scope**:
- Dedicated case study template/component
- Client logo showcase (with permission)
- Measurable ROI metrics display
- Before/after process visualization

**Depends On**: Blog architecture decision (could be part of blog)

---

## Ideas / Backlog

These are not planned but could be valuable:

- **Multi-language support** (English version for international reach)
- **Interactive automation demos** (embedded n8n workflow previews)
- **Client portal** (for existing customers to access resources)
- **Pricing calculator** (more detailed than current ROI calculator)

---

## How to Use This Document

1. **When ready to start an initiative**:
   - Move it from "Planned" to a new plan file
   - Run `/plan {initiative-name}` to create detailed plan
   - Track progress in PROGRESS.md

2. **To add new ideas**:
   - Add to "Ideas / Backlog" section
   - Include priority estimate and brief scope

3. **Keep updated**:
   - Move completed items to "Completed" section
   - Update priorities based on business needs
