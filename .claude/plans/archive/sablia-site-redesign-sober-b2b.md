# Plan: Sablia Site — Professional Sober B2B Redesign

**Created**: 2026-02-06
**Confidence**: 8/10 (one-pass success)
**Skill**: `/frontend-design:frontend-design` (Anthropic plugin, already available)
**References**: langdock.com, leftclick.ai

---

## Context & Problem

The current Sablia site has a **dark, gradient-heavy, glassmorphism aesthetic** (cyan/navy/charcoal/brown gradient background, neon-style accents, animated rainbow text, magnetic buttons). While visually striking, this style reads more **SaaS startup / gaming** than **professional B2B consulting**.

**Target audience**: French B2B executives (PMEs/ETIs) looking for automation consulting. They need to feel **trust, expertise, and sobriety** — not spectacle.

**Reference sites analysis**:
- **Langdock**: White background, near-black text, single blue accent (#4d65ff), ultra-minimal animations (0.2s), bento grid, enterprise trust signals
- **LeftClick**: White background, black text, Inter Tight font, monochrome palette, grain texture overlay, deliberate 0.5s animations, numbered sections

**Common formula**: White/light backgrounds + dark text + maximum 1 accent color + generous whitespace + invisible typography + subtle animations + immediate social proof.

---

## Design Direction

### Aesthetic: "Luxury Minimal B2B" — restrained, confident, white-dominant

| Token | Current | New |
|-------|---------|-----|
| **Background** | Animated gradient (cyan→navy→charcoal→brown) | `#ffffff` with optional `#fafafa` alternating sections |
| **Text primary** | `#FFFFFF` on dark bg | `#1a1c21` (near-black) on white bg |
| **Text secondary** | `rgba(248,249,250,0.7)` | `rgba(26, 28, 33, 0.55)` |
| **Text tertiary** | `rgba(248,249,250,0.5)` | `rgba(26, 28, 33, 0.35)` |
| **Accent** | `#52D1DC` (cyan neon) | `#2563eb` (professional blue, Tailwind blue-600) |
| **Cards** | Glassmorphism (charcoal/30 + backdrop-blur) | White with subtle `1px solid rgba(26,28,33,0.08)` border |
| **Font** | Inter (400-900 weights, up to 144px) | **Inter Tight** (400-700 weights, max 72px) |
| **Animations** | Scroll reveals, magnetic buttons, gradient text, particles | Fade-up only (0.3s), stagger (0.08s), hover transitions (0.2s) |
| **Border radius** | 16px cards, 12px buttons | 8px cards, 6px buttons |
| **Section spacing** | `py-24` (96px) | `py-32` (128px) for breathing room |

### Typography Scale (B2B appropriate)

| Element | Current | New |
|---------|---------|-----|
| Hero H1 | 80-144px (`text-5xl` to `text-9xl`) | 48-64px (`text-4xl lg:text-6xl`) |
| Section H2 | 48-112px (`text-5xl` to `text-7xl`) | 36-48px (`text-3xl lg:text-4xl`) |
| Card H3 | 24-32px | 20-24px (`text-xl lg:text-2xl`) |
| Body large | 20-24px | 18px (`text-lg`) |
| Body | 16-18px | 16px (`text-base`) |
| Small/labels | 12-14px | 14px (`text-sm`) |

### What Gets Removed
- Full-page animated gradient background
- Glassmorphism (backdrop-blur, transparent cards)
- `GradientText` animated component (replace with simple bold or accent-colored text)
- `MagneticButton` (replace with clean hover transitions)
- `RainbowText` CSS animation
- `AnimatedParticles` (TSParticles)
- `MagneticCard` 3D rotation
- Testimonials infinite scroll (replace with static grid or simple carousel)
- v2/v3 color tokens (navy, electric, cyan, charcoal, orange, amber, gold)
- `animate-gradient-xy` keyframe
- Overly aggressive stagger delays

### What Gets Added
- **Inter Tight** font (via Google Fonts or @fontsource)
- Subtle grain/noise texture overlay (optional, like LeftClick)
- Clean section dividers (whitespace or thin `1px` lines)
- `font-smoothing: antialiased` + `text-rendering: optimizeLegibility` globally
- Professional blue accent system
- Light mode optimized CSS variables

---

## Phases

### Phase 0: Setup & Font Infrastructure
**Files**: `client/index.html`, `client/src/index.css`, `tailwind.config.ts`, `package.json`
**Effort**: Small

1. Install Inter Tight font (`@fontsource-variable/inter-tight` or Google Fonts link)
2. Update `tailwind.config.ts`:
   - Change `fontFamily.sans` to `["Inter Tight", "Inter", "system-ui", "sans-serif"]`
   - Remove v2/v3 color tokens
   - Add new color tokens: `text-primary`, `text-secondary`, `text-tertiary`, `accent`, `surface`
3. Update `index.css`:
   - Redefine CSS custom properties for light-first design
   - Add `body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }`
   - Remove `rainbow-text`, `animate-gradient-xy` keyframes
   - Keep `accordion-*`, `page-transition-*`, and `prefers-reduced-motion` rules
4. Optional: Add grain texture overlay as CSS pseudo-element on `body::after`

**Validation**: `npm run build` passes, dev server shows white background with dark text

---

### Phase 1: Landing Page — Layout & Background
**Files**: `client/src/pages/Landing.tsx`, all `components/landing/*.tsx`
**Effort**: Medium
**Skill**: `/frontend-design:frontend-design` for component generation

1. **Landing.tsx**: Remove full-page gradient background div, replace with `bg-white`
2. **HeroSection.tsx**:
   - White/light background
   - Reduce headline to `text-4xl lg:text-6xl font-bold`
   - Dark text color (`text-[#1a1c21]`)
   - Simplify CTAs: one solid accent button + one outline/ghost button
   - Remove `MagneticButton` usage, use clean `<button>` with hover transition
   - Remove `AnimatedParticles` import
   - Add social proof logos immediately below hero
3. **Navigation.tsx**:
   - White background with subtle bottom border
   - Dark text links
   - Remove glassmorphism capsule style
   - Clean hover underlines (like Langdock)
4. **All sections**:
   - Remove `bg-v2-*` / `border-v2-*` / `text-v2-*` classes
   - Replace with new color system classes
   - Increase section padding to `py-32`

**Validation**: Visual check via Playwright — white background, dark text, readable hierarchy

---

### Phase 2: Component Redesign — Cards, Buttons, Typography
**Files**: `components/landing/*.tsx`, animation components
**Effort**: Medium
**Skill**: `/frontend-design:frontend-design`

1. **Cards** (ProblemSection, SolutionSection, PricingSection, ThreeStepProcess):
   - Remove glassmorphism (`bg-v2-charcoal/30 backdrop-blur-md`)
   - Replace with `bg-white border border-gray-100 rounded-lg` or `bg-gray-50/50 rounded-lg`
   - Clean hover: `hover:shadow-sm hover:border-gray-200 transition-all duration-200`
   - Reduce border-radius from `rounded-2xl` to `rounded-lg`
2. **Buttons**:
   - Primary: `bg-[#2563eb] text-white rounded-md px-6 py-3 font-medium hover:bg-[#1d4ed8] transition-colors duration-200`
   - Secondary: `border border-gray-200 text-[#1a1c21] rounded-md px-6 py-3 font-medium hover:bg-gray-50 transition-colors duration-200`
   - Remove all `MagneticButton` instances
3. **Typography cleanup**:
   - Cap all headlines at `text-6xl` maximum
   - Reduce font-weight usage: primarily 400, 500, 600, 700 (remove 800, 900)
   - Standardize body text at `text-base` (16px) with `leading-relaxed`
4. **GradientText** → replace with `<span className="text-[#2563eb] font-semibold">` or just bold text
5. **TestimonialsSection**: Replace infinite scroll with static 3-column grid or simple card layout

**Validation**: `npm run build` passes, Playwright snapshot shows consistent card styling

---

### Phase 3: Animation Simplification
**Files**: `client/src/lib/animations.ts` (or wherever ScrollReveal lives), all `components/landing/*.tsx`
**Effort**: Small-Medium

1. **Keep** `ScrollReveal` but simplify:
   - Default: `opacity: 0 → 1`, `y: 20px → 0`, `duration: 0.4s`
   - Ease: `[0.25, 0.1, 0.25, 1]` (standard ease)
   - Remove `scale`, `left`, `right` variants — only `up` and `fade`
   - Reduce stagger to `0.06s` (from 0.2-0.3s)
2. **Remove**: `ParallaxSection`, `ColorChangeText`, `ScaleOnScroll`, `MagneticButton`, `MagneticCard`, `FloatingText`, `TypewriterText`
3. **Simplify hover animations**:
   - Cards: `transition-all duration-200` with `hover:shadow-sm`
   - Buttons: `transition-colors duration-200`
   - No scale transforms on hover (remove `hover:scale-[1.02]`)
4. **Remove tsparticles**: Remove `@tsparticles/*` packages from `package.json`, delete `AnimatedParticles` component
5. Clean up `vite.config.ts` manualChunks if any removed packages are listed

**Validation**: `npm run build` passes, no console errors, animations feel fast/subtle

---

### Phase 4: Forms & Contact Section
**Files**: `ContactFormSection.tsx`, `GapForm.tsx`
**Effort**: Small

1. **ContactFormSection**:
   - White background, clean form inputs with subtle borders
   - Accent-colored submit button
   - Remove any glassmorphism styling
   - Keep Calendly widget integration as-is
2. **GapForm**:
   - Remove `RainbowText` if used, replace with simple styled heading
   - Clean input styling consistent with new design system
3. **Input styles**: `border border-gray-200 rounded-md px-4 py-3 text-base focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-colors`

**Validation**: Forms submit correctly, visual check via Playwright

---

### Phase 5: Footer, Legal Pages & Secondary Pages
**Files**: `Footer.tsx`, `MentionsLegales.tsx`, `PolitiqueConfidentialite.tsx`, `CGV.tsx`, `About.tsx`, `Tarifs.tsx`, `Roi.tsx`, `Faq.tsx`, `CaseStudies.tsx`
**Effort**: Medium

1. **Footer**: Simplify to minimal multi-column layout, dark text on light bg
2. **Legal pages**: Apply new typography and color system
3. **About, Tarifs, Roi, Faq, CaseStudies**: Update backgrounds, card styles, typography
4. All pages: Remove v2/v3 color references, use new design tokens

**Validation**: `npm run build`, visual check of each route

---

### Phase 6: Cleanup & Performance
**Files**: Various
**Effort**: Small

1. Remove unused dependencies:
   - `@tsparticles/*` packages (if AnimatedParticles fully removed)
   - Check for any other unused animation libraries
2. Clean up `vite.config.ts` manualChunks
3. Remove unused v2/v3 color tokens from tailwind config
4. Remove unused CSS keyframes from index.css
5. Remove unused animation components from `lib/animations.ts`
6. Run `npm run build` and verify bundle size reduction
7. Update docs: `docs/SITE_CONTENT.md`, `docs/content-index.json` — reflect new design system

**Validation**:
- `npm run build` — no errors, bundle size ≤ current
- `npm run check` — TypeScript clean
- Playwright visual check of all main routes

---

## Key Design Decisions

### Why Inter Tight over Inter?
Inter is the "default AI font" — every generic site uses it. Inter Tight is a condensed variant that feels more **editorial and intentional** while maintaining the same readability. It's what LeftClick uses. The tighter letter-spacing creates a more premium, European feel appropriate for a French B2B consultancy.

### Why white background instead of dark?
Both reference sites use white. Dark backgrounds with neon accents read as **tech startup / SaaS product**, not **consulting firm**. White backgrounds with dark text are the universal language of B2B trust. They let content speak.

### Why remove most animations?
Both Langdock (0.2s) and LeftClick (0.5s) use animations so subtle you barely notice them. The current Sablia site has magnetic buttons, parallax, scale-on-scroll, gradient text cycling, infinite carousels, and particle effects. This creates visual noise that undermines the "expert consultant" positioning. Less animation = more confidence.

### Why `#2563eb` (blue-600) as accent?
It's between Langdock's `#4d65ff` and a standard professional blue. Blue universally signals trust and expertise in B2B. One accent color used sparingly (CTAs, links, key highlights) is more powerful than the current multi-color palette.

### About the frontend-design skill
The `/frontend-design:frontend-design` skill is available and will be invoked during component generation in Phases 1-2. It will be directed with explicit constraints toward "luxury minimal / sober B2B" aesthetic to avoid its default tendency toward bold/distinctive designs. The skill excels at generating clean, well-structured component code with proper Tailwind patterns.

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing form functionality | High | Phase 4 is forms-only, test webhooks after |
| Missing v2/v3 color references | Medium | Global search-replace, grep for all `v2-` and `v3-` before cleanup |
| Removing component used elsewhere | Medium | Always `grep` before deleting (lesson from MEMORY.md) |
| vite.config.ts manualChunks stale refs | Medium | Check manualChunks after every dependency removal |
| Bundle size regression | Low | Inter Tight is small; removing tsparticles should decrease size |

---

## Execution

```
/execute sablia-site-redesign-sober-b2b
```

Estimated phases: 7 (Phase 0-6)
Each phase has clear validation gates.
