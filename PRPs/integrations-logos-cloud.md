# PRP: Intégrations LogosCloud (v3)

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript checking
2. **Build**: Production build validation
3. **Visual Testing**: Playwright browser validation with hover effects

**Confidence Score**: 9/10 - All 13 logo files confirmed present, clear patterns from v2/v3 components, straightforward grid implementation.

---

## 1. Goal and Why

**What are we building?**
A responsive grid showcasing 13 integration/tool logos that Sablia can automate workflows with, featuring grayscale-to-color hover effects and staggered scroll animations.

**Why are we building it?**
- Demonstrate technical capabilities and integration expertise
- Show clients the tools/platforms Sablia works with
- Build credibility through recognizable brands (n8n, Make, OpenAI, Anthropic, GitHub, etc.)
- Replace "client logos" concept with "integration showcase"
- Professional grid layout with smooth animations (v3 aesthetic)

**Visual Effect**: Professional grid of well-known integration logos that "activate" (turn from gray to colored) when hovered, with fade-in animations on scroll.

---

## 2. What (Requirements)

### User-Visible Behavior
1. User sees section titled "Intégrations & Outils" with subtitle
2. Grid displays 13 integration logos in 5 columns (desktop)
3. Logos appear in grayscale (60% opacity) by default
4. On hover, individual logo:
   - Transitions from grayscale to full color (brand colors)
   - Increases opacity to 100%
   - Scales up slightly (1.05x)
   - Transition is smooth (300ms)
5. Logos fade in with staggered timing when scrolling into view
6. Grid adapts responsively: 5 cols → 3 cols → 2 cols
7. Footer text: "Et bien d'autres intégrations possibles"
8. Dark navy background consistent with v3 theme

### Functional Requirements
- Component: `client/src/components/v3/LogosCloud.tsx`
- 13 integration logos from `public/logos/integrations/` directory
- Categories: Automation (2), AI (4), Productivity (4), Communication (1), Development (2)
- Integration into LandingV3.tsx as third section (after Testimonials)
- ScrollReveal wrapper for section animation
- Framer Motion for individual logo stagger animations
- Grid responsive breakpoints: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- Hover effects using CSS `filter: grayscale()` + Framer Motion scale

### Non-Functional Requirements
- **Performance**: All 13 SVG logos should load quickly (< 500KB total)
- **Animation**: Staggered fade-in with 0.08s delay between each logo (total ~1s reveal)
- **Accessibility**: Alt text on all logos, title attributes for tooltips
- **Browser Support**: Grayscale filter works in modern browsers
- **Responsive**: Logos maintain aspect ratio and visual weight across screen sizes

---

## 3. Success Criteria

The implementation is complete when:
- [ ] LogosCloud.tsx created with 13 integration entries
- [ ] All 13 SVG logos render correctly (no 404 errors)
- [ ] Logos organized by category in TypeScript interface
- [ ] Grid displays as 5 columns on desktop (5-5-3 row pattern)
- [ ] Grid adapts to 3 columns on tablet, 2 columns on mobile
- [ ] Default state: grayscale(100%) + opacity-60
- [ ] Hover state: grayscale(0%) + opacity-100 + scale(1.05)
- [ ] Transition is smooth (300ms duration)
- [ ] Staggered fade-in animation (0.08s delay × 13 = 1.04s total)
- [ ] ScrollReveal wraps entire section for entry animation
- [ ] Section positioned after Testimonials in LandingV3
- [ ] Section title: "Intégrations & Outils"
- [ ] Subtitle: "Automatisez vos workflows avec les outils que vous utilisez déjà"
- [ ] Footer: "Et bien d'autres intégrations possibles"
- [ ] TypeScript check passes (no new errors)
- [ ] Production build succeeds
- [ ] Visual validation confirms all logos visible and hover works

---

## 4. Documentation & References

### Official Documentation
- **Framer Motion - whileInView**: https://www.framer.com/motion/scroll-animations/#viewport-scroll
  - Use `whileInView` to trigger animation when entering viewport
  - `viewport={{ once: true }}` ensures animation triggers once only
- **Framer Motion - whileHover**: https://www.framer.com/motion/gestures/##hover
  - Simple hover gesture for scale effect
- **Tailwind CSS - Filters**: https://tailwindcss.com/docs/filter
  - `filter grayscale` utility for grayscale effect
  - `hover:grayscale-0` to remove grayscale on hover

### Relevant Code Examples
- `client/src/components/v2/LogosCloud.tsx` - **PRIMARY REFERENCE**
  - Shows basic grid structure with client names
  - Uses Framer Motion `whileInView` + staggered delays
  - Has section header with motion animations
  - **ADAPT**: Replace text with image logos, add grayscale hover, change to 5 columns
- `client/src/components/v3/TestimonialsSection.tsx` - v3 styling reference
  - Demonstrates ScrollReveal usage
  - Shows v3 color palette (v2-navy, v2-cyan, v2-off-white)
  - Section structure with container padding
- `client/src/components/v3/HeroSection.tsx` - v3 component structure
  - Shows motion component patterns in v3
  - Uses ScrollReveal for section animation
  - Demonstrates v3 spacing and typography

### External Resources
- **CSS Grayscale Filter**: https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/grayscale
  - `grayscale(100%)` = fully desaturated
  - `grayscale(0%)` = original colors
- **Logo Files Confirmed Present**:
  - All 13 logos verified in `public/logos/integrations/` directory
  - Filenames: anthropic.svg, github.svg, googledrive.svg, googleforms.svg, googlegemini.svg, googlesheets.svg, make.svg, n8n.svg, notion.svg, openai.svg, perplexity.svg, slack.svg, vercel.svg

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── v2/
│   │   └── LogosCloud.tsx (existing - uses text placeholders)
│   ├── v3/
│   │   ├── HeroSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── (LogosCloud.tsx will be created here)
│   └── animations/
│       └── ScrollReveal.tsx (GSAP-based scroll animation)
└── pages/
    └── LandingV3.tsx (integration point)

public/
└── logos/
    └── integrations/
        ├── anthropic.svg ✓
        ├── github.svg ✓
        ├── googledrive.svg ✓
        ├── googleforms.svg ✓
        ├── googlegemini.svg ✓
        ├── googlesheets.svg ✓
        ├── make.svg ✓
        ├── n8n.svg ✓
        ├── notion.svg ✓
        ├── openai.svg ✓
        ├── perplexity.svg ✓
        ├── slack.svg ✓
        └── vercel.svg ✓
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   └── v3/
│       ├── HeroSection.tsx
│       ├── TestimonialsSection.tsx
│       └── LogosCloud.tsx (NEW - 13 integration logos)
└── pages/
    └── LandingV3.tsx (updated with LogosCloud import)
```

### Key Files to Modify
- `client/src/pages/LandingV3.tsx`:
  - Add import: `import LogosCloud from "@/components/v3/LogosCloud";`
  - Insert `<LogosCloud />` after `<TestimonialsSection />`
  - Remove placeholder `<section id="logos" className="py-24" />` from hidden div

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- **Framer Motion**: `whileInView` + `whileHover` can be used together safely
  - `whileInView` controls entry animation
  - `whileHover` controls hover effect
  - No conflicts when combined on same element
- **CSS Grayscale Filter**: Does not work in Internet Explorer (acceptable - modern browsers only)
  - Works in Chrome, Firefox, Safari, Edge (Chromium)
- **Image Loading**: SVG files load instantly, but ensure correct path (`/logos/integrations/` not `/public/logos/integrations/`)

### Common Mistakes
- ❌ **Anti-pattern**: Using `public/` in image path
  ```typescript
  // WRONG
  imageUrl: "/public/logos/integrations/n8n.svg"
  ```
- ✅ **Correct approach**: Omit `public/` in path
  ```typescript
  // CORRECT
  imageUrl: "/logos/integrations/n8n.svg"
  ```

- ❌ **Anti-pattern**: Using `object-cover` on logos (crops them)
  ```typescript
  className="object-cover"  // Will crop/distort
  ```
- ✅ **Correct approach**: Use `object-contain` to maintain aspect ratio
  ```typescript
  className="object-contain"  // Preserves aspect ratio
  ```

- ❌ **Anti-pattern**: Setting fixed width on logos
  ```typescript
  className="w-32 h-12"  // Forces specific dimensions
  ```
- ✅ **Correct approach**: Set height only, let width adapt
  ```typescript
  className="h-12 lg:h-14 w-auto"  // Height fixed, width adapts
  ```

### Error Patterns
- **Error**: `404 Not Found` for logo images
  - **Cause**: Incorrect file path or missing file
  - **Fix**: Verify file exists in `public/logos/integrations/` and path doesn't include `public/` prefix

- **Error**: Logos appear at different sizes
  - **Cause**: Not using consistent height or using `object-cover`
  - **Fix**: Set uniform height with `h-12 lg:h-14` and use `object-contain`

- **Error**: Grayscale filter not working
  - **Cause**: Old browser or incorrect Tailwind class
  - **Fix**: Use `filter grayscale` (not `grayscale-100`), ensure modern browser

- **Error**: Hover effect too slow or too fast
  - **Cause**: Missing or incorrect transition duration
  - **Fix**: Add `transition-all duration-300` to image element

---

## 7. Data Models & Schemas

### Integration Interface
```typescript
interface Integration {
  id: number;
  name: string;
  imageUrl: string;
  category: "automation" | "ai" | "productivity" | "communication" | "development";
}
```

### Integration Data Array (All 13 Logos)
```typescript
const integrations: Integration[] = [
  // Automation platforms (2)
  { id: 1, name: "n8n", imageUrl: "/logos/integrations/n8n.svg", category: "automation" },
  { id: 2, name: "Make", imageUrl: "/logos/integrations/make.svg", category: "automation" },

  // AI platforms (4)
  { id: 3, name: "OpenAI", imageUrl: "/logos/integrations/openai.svg", category: "ai" },
  { id: 4, name: "Anthropic", imageUrl: "/logos/integrations/anthropic.svg", category: "ai" },
  { id: 5, name: "Gemini", imageUrl: "/logos/integrations/googlegemini.svg", category: "ai" },
  { id: 6, name: "Perplexity", imageUrl: "/logos/integrations/perplexity.svg", category: "ai" },

  // Productivity & Google ecosystem (4)
  { id: 7, name: "Google Sheets", imageUrl: "/logos/integrations/googlesheets.svg", category: "productivity" },
  { id: 8, name: "Google Drive", imageUrl: "/logos/integrations/googledrive.svg", category: "productivity" },
  { id: 9, name: "Google Forms", imageUrl: "/logos/integrations/googleforms.svg", category: "productivity" },
  { id: 10, name: "Notion", imageUrl: "/logos/integrations/notion.svg", category: "productivity" },

  // Communication (1)
  { id: 11, name: "Slack", imageUrl: "/logos/integrations/slack.svg", category: "communication" },

  // Development & Deployment (2)
  { id: 12, name: "GitHub", imageUrl: "/logos/integrations/github.svg", category: "development" },
  { id: 13, name: "Vercel", imageUrl: "/logos/integrations/vercel.svg", category: "development" },
];
```

**Note on Filenames**: Use exact filenames from directory:
- `googlegemini.svg` (not `gemini.svg`)
- `googledrive.svg` (not `google-drive.svg`)
- `googlesheets.svg` (not `google-sheets.svg`)

---

## 8. Implementation Tasks

### Task 1: Create LogosCloud Component
**Action**: CREATE
**Location**: `client/src/components/v3/LogosCloud.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Integration {
  id: number;
  name: string;
  imageUrl: string;
  category: "automation" | "ai" | "productivity" | "communication" | "development";
}

const integrations: Integration[] = [
  // [Paste full array from Section 7]
];

export default function LogosCloud() {
  return (
    <section
      id="logos"
      className="py-24 bg-v2-navy relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-v2-cyan uppercase tracking-wider mb-3"
            >
              Les outils que nous maîtrisons
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-v2-white"
            >
              Intégrations & Outils
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-v2-off-white/70 mt-4"
            >
              Automatisez vos workflows avec les outils que vous utilisez déjà
            </motion.p>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center"
              >
                <img
                  src={integration.imageUrl}
                  alt={`${integration.name} integration`}
                  title={integration.name}
                  className="h-12 lg:h-14 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </motion.div>
            ))}
          </div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-sm text-v2-off-white/50"
          >
            Et bien d'autres intégrations possibles
          </motion.p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Why**: This creates the complete LogosCloud component with all 13 integrations, using v3 styling and animation patterns.

**Gotchas**:
- Use exact filenames from directory (e.g., `googlegemini.svg`)
- Image path must NOT include `public/` prefix
- Stagger delay is `index * 0.08` (80ms between each logo)
- Grid classes: `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` for responsive layout
- Logo height: `h-12 lg:h-14` ensures consistent size
- Grayscale + opacity combo creates professional hover effect

### Task 2: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:

**Step 2a**: Add import at top of file (after other v3 imports)
```typescript
import LogosCloud from "@/components/v3/LogosCloud";
```

**Step 2b**: Insert component after TestimonialsSection
**FIND** this line:
```typescript
{/* Testimonials Section */}
<TestimonialsSection />
```

**INJECT** after it:
```typescript
{/* Logos Cloud Section */}
<LogosCloud />
```

**Step 2c**: Remove placeholder from hidden div
**FIND** this line in the hidden div:
```typescript
<section id="logos" className="py-24" />
```

**DELETE** this line (no longer needed as placeholder)

**Why**: This integrates LogosCloud as the third section in LandingV3, positioned after Testimonials.

**Gotchas**:
- Import must use `@/components/v3/LogosCloud` (not `../components/...`)
- Component goes INSIDE the `<main>` tag, AFTER Testimonials, BEFORE the hidden div
- Don't forget to remove the placeholder `<section id="logos" />` from hidden div

---

## 9. Testing Strategy

### Visual Testing with Playwright

**Test Sequence**:
1. Start dev server: `npm run dev`
2. Navigate to LandingV3
3. Scroll to logos section
4. Verify all 13 logos visible
5. Test hover effect on one logo
6. Test responsive (mobile viewport)

**Playwright Commands**:
```javascript
// 1. Navigate to LandingV3
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// 2. Scroll to logos section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('logos')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })  // Wait for stagger animation

// 3. Take screenshot after animation
mcp__playwright__browser_take_screenshot({
  filename: "logos-cloud-desktop.png"
})

// 4. Hover over first logo (n8n) to test hover effect
// (Check snapshot for element ref first)
mcp__playwright__browser_snapshot()
// Then hover based on ref from snapshot

// 5. Test mobile responsiveness
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('logos')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "logos-cloud-mobile.png"
})
```

### Manual Verification Checklist
- [ ] Section title "Intégrations & Outils" displays correctly
- [ ] Subtitle displays below title
- [ ] All 13 integration logos visible
- [ ] No 404 errors in console for logo images
- [ ] Desktop: 5 columns layout (5-5-3 row pattern)
- [ ] Tablet: 3 columns layout
- [ ] Mobile: 2 columns layout
- [ ] Logos appear in grayscale + 60% opacity by default
- [ ] Hover effect works:
  - Logo transitions to full color (grayscale-0)
  - Opacity increases to 100%
  - Logo scales to 1.05x
  - Transition is smooth (300ms)
- [ ] Staggered fade-in animation works (0.08s delay each)
- [ ] Footer text "Et bien d'autres..." displays
- [ ] Logos maintain aspect ratio (not distorted)
- [ ] All logos have similar visual weight

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: No new TypeScript errors (pre-existing v2 errors OK)

### Level 2: Build
```bash
npm run build
```
**Expected**: Build succeeds, bundle size increases slightly (~300KB for 13 SVGs)

### Level 3: Visual Validation
**Required screenshots**:
1. `logos-cloud-desktop.png` - Full section view, all 13 logos visible in 5-column grid
2. `logos-cloud-mobile.png` - Mobile view with 2-column grid
3. *(Optional)* `logos-cloud-hover.png` - One logo in hover state (color, not grayscale)

---

## 11. Integration Points

### Configuration Changes
None required - all logo files already present in `public/logos/integrations/`

### Route Registration
Not applicable - frontend component only

### Database Migrations
Not applicable - static content

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Include `public/` in image paths (causes 404)
- ❌ Use `object-cover` on logos (crops them)
- ❌ Set fixed width on logos (distorts aspect ratio)
- ❌ Use `whileHover` to control the entry animation (wrong tool)
- ❌ Hardcode logo data inline (use array for maintainability)
- ❌ Skip alt text on images (accessibility requirement)
- ❌ Use different stagger delay formula (0.08s is optimal)

### DO:
- ✅ Use `/logos/integrations/` path (omit `public/`)
- ✅ Use `object-contain` to maintain aspect ratio
- ✅ Set height only, let width adapt (`h-12 lg:h-14 w-auto`)
- ✅ Use `whileInView` for entry, `whileHover` for interaction
- ✅ Define integrations array separately for clarity
- ✅ Include descriptive alt text: `{integration.name} integration`
- ✅ Use `index * 0.08` for stagger delay consistency

---

## 13. Progressive Success

### Minimal Viable Implementation (Start Here)
1. Create LogosCloud.tsx with basic structure
2. Add integrations array with all 13 entries
3. Render grid with images (no animations yet)
4. Verify all images load correctly (no 404s)

### Validation Checkpoint 1
- Run `npm run check` - should pass
- Start dev server, navigate to page
- Confirm all 13 logos visible

### Add Enhancements
5. Add ScrollReveal wrapper
6. Add section header with motion animations
7. Add staggered `whileInView` animations to logos
8. Add grayscale filter + hover effects
9. Add footer text
10. Integrate into LandingV3.tsx

### Validation Checkpoint 2
- Run `npm run build` - should pass
- Visual test: confirm animations work
- Test hover effect: logos turn from gray to color
- Test responsive: 5 → 3 → 2 columns

### Final Polish
11. Verify all alt text and title attributes present
12. Test mobile viewport (375px width)
13. Take screenshots for documentation
14. Update avancement_refonte.md with execution log

---

## Final Validation Checklist

Before marking complete:
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] All 13 logos render without 404 errors
- [ ] Grid layout is 5-5-3 pattern on desktop
- [ ] Grid adapts to 3 columns on tablet
- [ ] Grid adapts to 2 columns on mobile
- [ ] Grayscale + opacity hover effect works smoothly
- [ ] Staggered fade-in animation works (1.04s total)
- [ ] ScrollReveal wrapper animates section entry
- [ ] Section integrated into LandingV3 after Testimonials
- [ ] Placeholder removed from hidden div
- [ ] Alt text present on all images
- [ ] Screenshots taken for visual validation
- [ ] No console errors or warnings
- [ ] Execution log written to avancement_refonte.md

---

## Appendix: Logo File Reference

**All 13 logos confirmed present** in `public/logos/integrations/`:

| Category | Tool | Filename | Colors |
|----------|------|----------|--------|
| Automation | n8n | `n8n.svg` | Purple/pink |
| Automation | Make | `make.svg` | Purple/blue |
| AI | OpenAI | `openai.svg` | Black/green |
| AI | Anthropic | `anthropic.svg` | Orange/peach |
| AI | Gemini | `googlegemini.svg` | Multi-color |
| AI | Perplexity | `perplexity.svg` | Blue/teal |
| Productivity | Google Sheets | `googlesheets.svg` | Green |
| Productivity | Google Drive | `googledrive.svg` | Multi-color |
| Productivity | Google Forms | `googleforms.svg` | Purple |
| Productivity | Notion | `notion.svg` | Black/white |
| Communication | Slack | `slack.svg` | Multi-color |
| Development | GitHub | `github.svg` | Black/white |
| Development | Vercel | `vercel.svg` | Black/white |

**Grid Layout on Desktop (5 columns)**:
```
Row 1: n8n, Make, OpenAI, Anthropic, Gemini
Row 2: Perplexity, Google Sheets, Google Drive, Google Forms, Notion
Row 3: Slack, GitHub, Vercel
```

---

## Execution Log Template

After successful implementation, document in `avancement_refonte.md`:

```markdown
## PRP 1.3: Integrations LogosCloud - Grid Layout (YYYY-MM-DD)

**Status**: ✅ COMPLETED

**PRP Source**: `PRPs/integrations-logos-cloud.md`

**Confidence Score**: 9/10

### Objectif
Implémenter une section grid de 13 logos d'intégrations avec effet grayscale-to-color au hover et animations staggered pour LandingV3.

### Fonctionnalités Implémentées
- [Document details here]

### Fichiers Créés
- `client/src/components/v3/LogosCloud.tsx`

### Fichiers Modifiés
- `client/src/pages/LandingV3.tsx`

### Validation
- ✅ TypeScript check passed
- ✅ Production build succeeded
- ✅ Visual validation completed

**Prochaine étape**: PRP 2.1 - ProblemSection
```
