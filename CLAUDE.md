# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **Animations**: Framer Motion + TSParticles

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
- Drizzle ORM with PostgreSQL
- Schema defined in `db/schema.ts`
- Connection via `DATABASE_URL` environment variable
- Migrations stored in `migrations/`

## Key Integrations

- **Voiceflow**: Chatbot integration for customer support
- **Calendly**: Appointment scheduling system
- **TSParticles**: Background animations

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

The site now uses **LandingV3** as the homepage (`/` route):
- **Main Page**: `client/src/pages/LandingV3.tsx` - Complete landing page with all sections
- **Components**: All components are in `client/src/components/v3/`
- **Navigation**: Includes both anchor links to sections AND route links to `/gap` and `/about` pages
- **Previous versions**: LandingV2 has been deprecated and removed

### Available Routes
- `/` - LandingV3 (homepage with all sections)
- `/gap` - GAP analysis form
- `/about` - About page
- `/tarifs` - Pricing page
- `/roi` - ROI calculator

## Visual Validation with Playwright MCP

When making design changes to LandingV3 or other visual components, **ALWAYS** use Playwright MCP integration to validate changes before committing:

### Workflow for Visual Changes

1. **Start dev server:**
   ```bash
   npm run dev  # Runs on http://localhost:5000
   ```

2. **Navigate to the page:**
   ```javascript
   mcp__playwright__browser_navigate({ url: "http://localhost:5000" })
   ```

3. **Capture visual state:**

   **PREFERRED METHOD - Accessibility Snapshot:**
   ```javascript
   mcp__playwright__browser_snapshot()
   ```
   Use this for structure analysis, layout verification, and identifying elements. Best for most validation tasks.

   **ALTERNATIVE - Partial Screenshots ONLY:**

   **NEVER use `fullPage: true`** - it exceeds the 8000 pixel limit and will fail.

   Instead, take partial screenshots of:

   a) **Viewport only** (visible area):
   ```javascript
   mcp__playwright__browser_take_screenshot({
     filename: "hero-viewport.png"
   })
   ```

   b) **Specific elements** (after getting element ref from snapshot):
   ```javascript
   // First get snapshot to find element refs
   mcp__playwright__browser_snapshot()

   // Then screenshot specific element
   mcp__playwright__browser_take_screenshot({
     element: "Hero section",
     ref: "[element-ref-from-snapshot]",
     filename: "hero-section.png"
   })
   ```

   c) **Multiple sections** (take separate screenshots):
   ```javascript
   // Hero section
   mcp__playwright__browser_take_screenshot({ filename: "section-hero.png" })

   // Scroll down
   mcp__playwright__browser_evaluate({ function: "() => window.scrollBy(0, 800)" })

   // Problem section
   mcp__playwright__browser_take_screenshot({ filename: "section-problem.png" })
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

### Landing Page Changes (LandingV3)

When working on the landing page (`client/src/pages/LandingV3.tsx` and `client/src/components/v3/*`), you can **push directly to main** after validation:

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