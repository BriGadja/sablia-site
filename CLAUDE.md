# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last updated**: 2026-01-26

## Quick Reference

| Item | Value |
|------|-------|
| **Domain** | sablia.io |
| **Dev server** | http://localhost:5000 |
| **Contact form webhook** | https://n8n.sablia.io/webhook/sablia-site-formulaire |
| **GAP form webhook** | Uses `VITE_N8N_WEBHOOK_URL` env var |
| **Calendly** | https://calendly.com/brice-gachadoat/30min |
| **Supabase project** | supabase-sablia (shared with n8n-intelligence) |
| **DB table prefix** | `site_` (e.g., `site_users`) |

### Key Files for Content Questions

- **Site content (text, pricing, testimonials)**: `docs/SITE_CONTENT.md`
- **Service offerings details**: `docs/OFFRES.md`
- **FAQ answers**: `docs/FAQ.md`
- **SEO meta-tags**: `docs/meta-tags.json`
- **Structured content data**: `docs/content-index.json`

### Landing Page Sections (in order)

1. Navigation → `components/landing/Navigation.tsx`
2. Hero → `components/landing/HeroSection.tsx`
3. Testimonials → `components/landing/TestimonialsSection.tsx`
4. Integrations (LogosCloud) → `components/landing/LogosCloud.tsx`
5. Problem → `components/landing/ProblemSection.tsx`
6. Solution → `components/landing/SolutionSection.tsx`
7. Process → `components/landing/ThreeStepProcess.tsx`
8. Pricing → `components/landing/PricingSection.tsx`
9. ROI Calculator → `components/landing/CalculatorROI.tsx`
10. Contact Form → `components/landing/ContactFormSection.tsx`
11. FAQ → `components/landing/FaqSection.tsx`
12. Footer → `components/Footer.tsx`

---

## Project Overview

Sablia is a modern business automation consulting website built with a React frontend and Express backend, using TypeScript throughout. The application features lead generation forms, ROI calculator, and service presentations.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Wouter (routing)
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS + Tailwind Animate
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion + GSAP + TSParticles

## Essential Commands

```bash
# Development
npm run dev              # Start development server (port 5000)

# Build & Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database

# Type Checking
npm run check           # Run TypeScript type checking
```

## Project Architecture

### Path Aliases

- `@/` → `client/src/`
- `@db` → `db/`
- `@db/*` → `db/*`

### Server Architecture

The Express server (port 5000) serves both API and client:

- Development: Vite dev server integration via `server/vite.ts`
- Production: Static file serving from `dist/public`
- API routes registered via `server/routes.ts`
- Request logging middleware for `/api` endpoints

### Client Architecture

- **Routing**: Wouter-based SPA with pages in `client/src/pages/`
- **Components**: Reusable UI components in `client/src/components/`
- **State**: React Query for server state management
- **Forms**: React Hook Form with Zod schemas for validation
- **Toasts**: Persistent toast system using custom hooks

### Database

- Drizzle ORM with PostgreSQL (hosted on Supabase)
- Schema defined in `db/schema.ts`
- Connection via `DATABASE_URL` environment variable
- Migrations stored in `migrations/`

**Supabase Instance**: `supabase-sablia` (shared with n8n-intelligence)
- Project: `qlxoitzdxjqhljjoeqoq`
- URL: `db.qlxoitzdxjqhljjoeqoq.supabase.co:5432`
- Credentials: `~/.credentials/supabase-sablia-db-url.txt`

**IMPORTANT - Table Naming Convention**:
- Use `site_` prefix for all new tables (e.g., `site_users`, `site_contacts`, `site_leads`)
- This avoids conflicts with existing n8n-intelligence tables in the same database
- Update `db/schema.ts` with prefixed table names before running `db:push`

## Key Integrations

| Integration | Purpose | Details |
|-------------|---------|---------|
| **n8n webhook** | Contact form submissions | `https://n8n.sablia.io/webhook/sablia-site-formulaire` |
| **Calendly** | Appointment scheduling | `https://calendly.com/brice-gachadoat/30min` (30min discovery call) |
| **Framer Motion** | Component animations | fadeInUp, staggerContainer, buttonHover, cardHover |
| **GSAP** | Advanced timeline animations | Complex scroll-based animations |
| **TSParticles** | Background particles | Interactive particle system in hero |

### Form Integrations

**Contact Form** (`ContactFormSection.tsx`):
- Sends POST to n8n webhook with: `nom`, `email`, `entreprise`, `telephone`, `message`
- Shows success animation with CheckCircle icon
- Auto-resets after 5 seconds
- Toast notifications for feedback

**GAP Analysis Form** (`GapForm.tsx`):
- Uses `VITE_N8N_WEBHOOK_URL` environment variable
- Falls back to `/api/webhook-test` for local development
- Fields: prénom, nom, email, entreprise, secteur, challenge, disponibilité

## Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Development Notes

- Server always runs on port 5000
- Client routing uses Wouter (not React Router)
- UI components follow shadcn/ui patterns with Radix UI primitives
- Form validation uses Zod schemas with React Hook Form
- All TypeScript with strict mode enabled
- ESM modules throughout (type: "module" in package.json)

## Current Landing Page Architecture

The site uses **Landing** as the homepage (`/` route):

- **Main Page**: `client/src/pages/Landing.tsx` - Complete landing page with all sections
- **Components**: All landing page components are in `client/src/components/landing/`
- **Navigation**: Includes both anchor links to sections AND route links to `/gap` and `/about` pages

### Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Homepage with all sections |
| `/home` | Home | Alternative home layout |
| `/gap` | GapForm | GAP analysis lead gen form |
| `/about` | About | About Brice + Sablia |
| `/tarifs` | Tarifs | Pricing page (same as landing pricing section) |
| `/roi` | Roi | ROI calculator page |
| `/mentions-legales` | MentionsLegales | Legal notice |
| `/politique-confidentialite` | PolitiqueConfidentialite | Privacy policy (GDPR) |
| `/cgv` | CGV | Terms of service |

## Site Content Documentation

**CRITICAL**: The site content is fully documented in `docs/` for LLM accessibility and consistency.

### Documentation Files

#### `docs/SITE_CONTENT.md`

Comprehensive markdown documentation of ALL site content:

- Complete page structure and sections
- All headlines, copy, and CTAs
- Pricing tables and offers
- Testimonials and social proof
- FAQ questions and answers
- Navigation and footer content
- Design system (colors, animations, effects)
- Key messaging and differentiators

**Purpose**:

- Enable LLMs to understand site content without browsing
- Serve as single source of truth for content
- Facilitate content updates and translations
- Support SEO and marketing alignment

#### `docs/content-index.json`

Structured JSON index of site content:

- Programmatic access to all pages and sections
- Metadata for each page (title, description, CTAs)
- Pricing data structure
- Navigation and footer structure
- Technical stack and theme information

**Purpose**:

- Machine-readable content for automated tools
- Quick lookup for specific content elements
- Integration with CMS or content pipelines

#### `docs/OFFRES.md`

Detailed documentation of all Sablia service offerings:

- **3 categories**: Audit & Consulting, Formations, Solutions d'automatisation
- Complete descriptions with pricing, deliverables, and timelines
- Target audiences and use cases
- Technical specifications and prerequisites
- ROI calculations and examples

**Purpose**:

- Sales and commercial reference
- Onboarding guide for new team members
- Client proposal foundation
- Service catalog maintenance

#### `docs/FAQ.md`

Extended FAQ documentation for customer support:

- **8 categories**: Tools, Delays, Skills, ROI, Support, Approach, Pricing, Security
- 30+ questions with detailed answers
- Client success examples and testimonials
- Troubleshooting and edge cases
- Glossary of technical terms

**Purpose**:

- First-line customer support resource
- Sales objection handling
- Onboarding documentation
- SEO content source (FAQ schema markup)

#### `client/public/sitemap.xml`

SEO sitemap for search engine crawlers:

- All public pages with priorities and change frequencies
- Canonical URLs (https://sablia.io)
- Last modification dates
- XML format compliant with sitemaps.org protocol
- **Location**: `client/public/sitemap.xml` (copied to `dist/public/sitemap.xml` during build)

**Purpose**:

- Improve Google/Bing indexation
- Signal page hierarchy to crawlers
- SEO best practice compliance
- Accessible at https://sablia.io/sitemap.xml in production

**Maintenance**: Update lastmod dates when pages change significantly.

#### `docs/meta-tags.json`

SEO-optimized meta-tags for all pages:

- Title tags (50-60 chars) with keyword optimization
- Meta descriptions (150-160 chars) for SERP CTR
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Structured data (JSON-LD) for rich snippets
- Implementation notes and testing checklist

**Purpose**:

- Improve search engine rankings
- Optimize social media sharing previews
- Increase click-through rates from search results
- Enable rich snippets in Google

**Maintenance**: Update when page content changes or when launching new pages.

### Maintenance Protocol

**IMPORTANT**: These documentation files MUST be kept in sync with actual site content.

#### When to Update

**Update `docs/SITE_CONTENT.md` and `docs/content-index.json`** when:

- ✅ Modifying any text on landing page sections
- ✅ Changing pricing, offers, or packages
- ✅ Adding/removing/editing testimonials
- ✅ Updating FAQ questions or answers
- ✅ Changing CTAs or navigation items
- ✅ Modifying page structure or adding new sections
- ✅ Updating contact information or links
- ✅ Changing color palette or design system
- ✅ Adding or removing pages

**Update `docs/OFFRES.md`** when:

- ✅ Changing pricing or package details
- ✅ Adding/removing service offerings
- ✅ Modifying deliverables or timelines
- ✅ Updating ROI calculations or examples
- ✅ Changing target audience descriptions

**Update `docs/FAQ.md`** when:

- ✅ Adding new frequently asked questions
- ✅ Modifying answers based on customer feedback
- ✅ Adding new categories or reorganizing content
- ✅ Updating contact information or processes
- ✅ Adding new client testimonials or examples

**Update `client/public/sitemap.xml`** when:

- ✅ Adding or removing pages/routes
- ✅ Changing page priorities or frequencies
- ✅ Making significant content updates (update lastmod)
- ✅ Restructuring site navigation

**Update `docs/meta-tags.json`** when:

- ✅ Launching new pages
- ✅ Changing page titles or descriptions
- ✅ Updating SEO keywords strategy
- ✅ Creating new Open Graph images
- ✅ Modifying structured data

#### How to Update

**For PRP-based changes**:

1. Include content documentation update in PRP validation steps
2. Verify documentation matches implementation before completing
3. Add specific task in TodoWrite to update documentation

**For direct changes**:

1. After modifying site content, immediately update relevant docs:
   - `docs/SITE_CONTENT.md` for page content
   - `docs/content-index.json` for structured data
   - `docs/OFFRES.md` for service offerings
   - `docs/FAQ.md` for FAQ changes
   - `client/public/sitemap.xml` for route or priority changes
   - `docs/meta-tags.json` for SEO updates
2. Commit documentation changes alongside content changes
3. Use commit message format:

   ```
   feat: Update [section] content + sync documentation

   - Modified [specific content change]
   - Updated docs/SITE_CONTENT.md to reflect changes
   - Synced docs/content-index.json
   - [Optional] Updated docs/OFFRES.md with new pricing
   - [Optional] Refreshed client/public/sitemap.xml lastmod dates

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

#### Validation Checklist

Before committing content changes, verify:

- [ ] `docs/SITE_CONTENT.md` reflects all text changes
- [ ] `docs/content-index.json` data structures are updated
- [ ] `docs/OFFRES.md` pricing and offers are current (if applicable)
- [ ] `docs/FAQ.md` questions/answers match site content (if applicable)
- [ ] `client/public/sitemap.xml` lastmod dates updated for changed pages
- [ ] `docs/meta-tags.json` reflects new/updated page metadata (if applicable)
- [ ] Last updated date is current in all docs (format: YYYY-MM-DD)
- [ ] No placeholder or outdated information remains
- [ ] All URLs and links are correct (sablia.io, not other domains)

### Why This Matters

Maintaining accurate content documentation:

- ✅ Enables Claude Code to answer content questions instantly
- ✅ Prevents content drift and inconsistencies
- ✅ Facilitates collaboration with copywriters/marketers
- ✅ Supports A/B testing and content experiments
- ✅ Creates audit trail for content evolution
- ✅ Enables automated content analysis and SEO optimization

**Golden Rule**: Code and content documentation should always match reality. When in doubt, verify against live site or actual component code.

## Visual Validation with Playwright MCP

When making design changes to the Landing page or other visual components, **ALWAYS** use Playwright MCP integration to validate changes before committing:

### Workflow for Visual Changes

1. **Start dev server:**

   ```bash
   npm run dev  # Runs on http://localhost:5000
   ```

2. **Navigate to the page:**

   ```javascript
   mcp__playwright__browser_navigate({ url: "http://localhost:5000" });
   ```

3. **Capture visual state:**

   **PREFERRED METHOD - Accessibility Snapshot:**

   ```javascript
   mcp__playwright__browser_snapshot();
   ```

   Use this for structure analysis, layout verification, and identifying elements. Best for most validation tasks.

   **ALTERNATIVE - Partial Screenshots ONLY:**

   **NEVER use `fullPage: true`** - it exceeds the 8000 pixel limit and will fail.

   Instead, take partial screenshots of:

   a) **Viewport only** (visible area):

   ```javascript
   mcp__playwright__browser_take_screenshot({
     filename: "hero-viewport.png",
   });
   ```

   b) **Specific elements** (after getting element ref from snapshot):

   ```javascript
   // First get snapshot to find element refs
   mcp__playwright__browser_snapshot();

   // Then screenshot specific element
   mcp__playwright__browser_take_screenshot({
     element: "Hero section",
     ref: "[element-ref-from-snapshot]",
     filename: "hero-section.png",
   });
   ```

   c) **Multiple sections** (take separate screenshots):

   ```javascript
   // Hero section
   mcp__playwright__browser_take_screenshot({ filename: "section-hero.png" });

   // Scroll down
   mcp__playwright__browser_evaluate({ function: "() => window.scrollBy(0, 800)" });

   // Problem section
   mcp__playwright__browser_take_screenshot({ filename: "section-problem.png" });
   ```

4. **Review against design requirements:**
   - Compare against `refonte_graphique/Design professionnel pour Sablia _ Guide complet pour une landing page primée.md`
   - Verify emoji usage (max 0-2 for B2B sites, NEVER on CTAs)
   - Check professional credibility vs visual excitement balance
   - Validate typography, spacing, and hierarchy

5. **Iterate based on evidence:**
   - Make corrections based on visual validation
   - Re-capture to verify fixes
   - Ensure compliance before committing

### Why This Matters

Visual validation prevents:

- ❌ Emoji overuse that damages B2B credibility (74% of professionals 45+ see it as unprofessional)
- ❌ Positioning conflicts (e.g., scroll indicators over CTAs)
- ❌ Animations too subtle to notice
- ❌ Violations of professional design guidelines

Always validate visually **before** pushing, not after deployment.

## Git Workflow for Landing Page

### Landing Page Changes

When working on the landing page (`client/src/pages/Landing.tsx` and `client/src/components/landing/*`), you can **push directly to main** after validation:

```bash
# 1. Validate visually with Playwright (see above)
# 2. Build to ensure no errors
npm run build

# 3. Commit and push directly
git add [files]
git commit -m "Your descriptive message

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

### Other Changes

For features outside the landing page (backend, database, forms, etc.), follow standard git workflow with branches and PRs as needed.

### Commit Message Template

Use descriptive commit messages that explain the "why" and include:

- Clear summary of changes
- Reference to design guide compliance when relevant
- Metrics (bundle size, emoji count, performance)
- Design violations fixed

---

## Context Engineering Methodology

This project uses **Context Engineering** - a systematic approach to working with AI coding assistants that ensures consistent, high-quality implementations.

### Philosophy

**Context Engineering > Prompt Engineering > Vibe Coding**

Context Engineering is not about clever prompts - it's about providing comprehensive context through:

- Structured documentation
- Real code examples
- Validation loops
- Detailed requirements

### Workflow Overview

```
INITIAL.md → /generate-prp → PRP → /execute-prp → Implementation
```

### Step-by-Step Process

#### 1. Define Your Feature (INITIAL.md)

When you want to build a new feature, create or edit `INITIAL.md` with four key sections:

**FEATURE**: Specific description of what to build

- Be detailed about functionality and requirements
- Include user-facing behavior and technical requirements

**EXAMPLES**: Reference examples from `examples/` folder

- Point to specific files that demonstrate patterns to follow
- Explain what aspects should be mimicked
- Examples are CRITICAL for success

**DOCUMENTATION**: Include all relevant resources

- API documentation URLs with specific sections
- Library guides and best practices
- Database schema references
- MCP server documentation

**OTHER CONSIDERATIONS**: Capture important details

- Common pitfalls and gotchas
- Performance requirements
- Authentication/security needs
- Edge cases often missed

**Example INITIAL.md**:

```markdown
## FEATURE:

Build a contact form component with Calendly integration. The form should
collect name, email, phone, and allow users to schedule a consultation.

## EXAMPLES:

- `examples/components/FormExample.tsx` - Follow this pattern for form
  structure with React Hook Form and Zod validation
- `examples/api/useDataHook.ts` - Use this pattern for API integration

## DOCUMENTATION:

- React Hook Form: https://react-hook-form.com/docs
- Calendly API: https://developer.calendly.com/
- Zod validation: https://zod.dev/

## OTHER CONSIDERATIONS:

- Must work on mobile devices
- Include GDPR-compliant consent checkbox
- Show loading state during submission
- Handle API errors gracefully
```

#### 2. Generate a PRP (Product Requirements Prompt)

Run the slash command:

```bash
/generate-prp INITIAL.md
```

This command will:

1. **Research Phase**: Analyze your codebase for similar patterns
2. **Documentation Gathering**: Fetch relevant docs and examples
3. **Blueprint Creation**: Create a step-by-step implementation plan
4. **Quality Check**: Ensure confidence score of 8+ (out of 10)

Output: `PRPs/{feature-name}.md` - a comprehensive implementation blueprint

#### 3. Execute the PRP

Run the slash command:

```bash
/execute-prp PRPs/{feature-name}.md
```

The AI will:

1. **Load**: Read all context from the PRP
2. **Plan**: Create detailed task list with TodoWrite
3. **Implement**: Execute each component
4. **Validate**: Run tests and checks
5. **Iterate**: Fix any issues
6. **Complete**: Verify all requirements met

#### 4. Validation Gates

Every PRP includes validation commands that MUST pass:

**Level 1 - Syntax & Style**:

```bash
npm run check    # TypeScript type checking
npm run lint     # Code style
```

**Level 2 - Build**:

```bash
npm run build    # Production build
```

**Level 3 - Testing** (when applicable):

```bash
npm test         # Unit/integration tests
```

The AI will iterate until ALL validation gates pass.

### The examples/ Folder is Critical

AI coding assistants perform 10x better with concrete examples. Populate `examples/` with:

- **Component Patterns**: React components showing your preferred structure
- **API Patterns**: How you make API calls and handle responses
- **Form Patterns**: Complete form implementations with validation
- **Testing Patterns**: How you structure and write tests
- **Error Handling**: How you handle and display errors

See `examples/README.md` for detailed guidance.

### Key Principles

1. **Be Explicit**: Don't assume the AI knows your preferences
2. **Provide Examples**: More examples = better implementations
3. **Use Validation**: PRPs include test commands that must pass
4. **Follow Patterns**: Reference existing code patterns liberally
5. **Iterate on PRPs**: If a PRP doesn't work well, improve it for next time

### Why This Works

Traditional approaches fail because they lack context. Context Engineering succeeds by:

- **Comprehensive Context**: All needed information in one place
- **Validation Loops**: AI can self-correct using tests
- **Pattern Following**: Examples show the "right way"
- **Progressive Success**: Build simple, validate, then enhance

### Advanced: Reusing PRPs

Well-crafted PRPs can be reused for similar features:

1. Copy a similar PRP from `PRPs/` folder
2. Modify for your specific needs
3. Execute with `/execute-prp`

This makes implementing similar features extremely fast.

### Project-Specific Patterns

When creating PRPs for Sablia, ensure they reference:

- **React Patterns**: Functional components with TypeScript
- **Form Patterns**: React Hook Form + Zod validation
- **API Patterns**: React Query for data fetching
- **Routing**: Wouter for navigation
- **Styling**: Tailwind CSS with shadcn/ui components
- **State**: React Query for server state, React hooks for local state

### Getting Started with Context Engineering

1. **First Time**: Create a comprehensive `INITIAL.md` for your first feature
2. **Generate PRP**: Run `/generate-prp INITIAL.md`
3. **Review PRP**: Check the generated PRP - does it have enough context?
4. **Execute**: Run `/execute-prp PRPs/your-feature.md`
5. **Learn**: Note what worked and what didn't
6. **Improve**: Update examples and PRP templates based on learnings

The first PRP might take extra time, but subsequent features will be dramatically faster and more consistent.
