## Overview

Sablia.io is a dark-first, editorial B2B landing page for an AI integration agency. The base atmosphere is a **warm dark canvas** (`{colors.canvas}` — #0f0f12) — deliberately dark but not cold, with warm undertones that prevent it from feeling corporate-sterile. Headlines run a **serif display** (Cormorant Garamond) at weight 500 with negative letter-spacing, paired with **Inter** body sans. The combination feels like a premium consulting publication, not a generic SaaS marketing page.

Brand voltage comes from the **dark + coral pairing** — coral (`{colors.primary}` — #cc785c) is the signature Sablia accent, used on every primary CTA, on callout cards, and on key data highlights. The coral is warm, confident, and distinctive — a deliberate departure from the cold blues and greens of generic SaaS, signaling craft and human presence.

The system has three surface modes that alternate section-by-section:
1. **Dark canvas** (`{colors.canvas}`) — default page floor
2. **Dark elevated cards** (`{colors.surface-card}`) — feature cards, use case cards
3. **Light cream sections** (`{colors.surface-light}`) — contrast bands for testimonials, CRM logo strips, or breathing room

The light sections are where Sablia shows real-world output — dashboard screenshots, CRM pipeline views, client results. The dark-to-light contrast is the page's pacing rhythm.

**Key Characteristics:**
- Warm dark canvas (`{colors.canvas}` — #0f0f12) with warm light text (`{colors.on-dark}` — #f0ede6). The brand's defining color choice — dark but never cold.
- Coral primary CTA (`{colors.primary}` — #cc785c). Used on primary buttons, callout cards, key data highlights, and inline accents.
- Teal secondary accent (`{colors.accent-teal}` — #5db8a6). Reserved for success states, secondary data highlights, and contrast moments against coral — never as a primary CTA.
- Serif display headlines via Cormorant Garamond at weight 500 with negative letter-spacing. Pairs with Inter humanist sans body for an editorial, premium voice.
- Light cream contrast sections (`{colors.surface-light}` — #f5f2ec) carrying dashboard mockups, CRM screenshots, client results — Sablia shows real product output, not abstract marketing illustrations.
- Dark elevated cards (`{colors.surface-card}` — #1a1a1f) — slightly lighter than canvas, used for feature cards and use case explanations.
- Border radius is hierarchical: `{rounded.md}` (8px) for buttons + inputs, `{rounded.lg}` (12px) for content cards, `{rounded.xl}` (16px) for hero mockup containers, `{rounded.pill}` for badges.
- Section rhythm `{spacing.section}` (96px) — modern-SaaS standard. Internal card padding stays generous at `{spacing.xl}` (32px).

## Colors

### Brand & Accent
- **Coral / Primary** (`{colors.primary}` — #cc785c): The signature Sablia coral. Used on every primary CTA background, on callout cards, on key metrics and data highlights. Warm, confident, distinctive — the brand's defining accent color.
- **Coral Active** (`{colors.primary-active}` — #a9583e): The press / hover-darker variant.
- **Coral Disabled** (`{colors.primary-disabled}` — #e6dfd8): A desaturated light-tinted disabled state.
- **Accent Teal** (`{colors.accent-teal}` — #5db8a6): Secondary accent for success states, positive KPIs, data chart secondary lines, and contrast moments. Never used as a primary CTA.
- **Accent Amber** (`{colors.accent-amber}` — #e8a55a): A companion warm-tone used on KPI highlights and inline data callouts.

### Surface
- **Canvas** (`{colors.canvas}` — #0f0f12): The default page floor. Warm dark — not pure black, not cool gray.
- **Canvas Soft** (`{colors.canvas-soft}` — #141418): Slightly elevated from canvas, used for nav bar and subtle section differentiation.
- **Surface Card** (`{colors.surface-card}` — #1a1a1f): Feature cards, use case cards. One step lighter than canvas.
- **Surface Card Elevated** (`{colors.surface-card-elevated}` — #222228): Hover states or emphasized cards inside dark bands.
- **Surface Light** (`{colors.surface-light}` — #f5f2ec): Contrast sections — cream-tinted, warm, used for dashboard mockups, CRM screenshots, client testimonials.
- **Surface Light Card** (`{colors.surface-light-card}` — #ebe6dd): Cards inside light sections. One step darker than the light surface.
- **Hairline** (`{colors.hairline}` — #2a2a30): The 1px border tone on dark surfaces. Subtle, barely visible.
- **Hairline Light** (`{colors.hairline-light}` — #e0dbd2): The 1px border tone on light contrast sections.

### Text
- **On Dark** (`{colors.on-dark}` — #f0ede6): All headlines and primary text on dark surfaces. Warm off-white, not pure white.
- **On Dark Strong** (`{colors.on-dark-strong}` — #ffffff): Maximum emphasis — hero h1, key numbers.
- **On Dark Body** (`{colors.on-dark-body}` — #b8b5ae): Default paragraph text on dark surfaces. Readable, muted warmth.
- **On Dark Muted** (`{colors.on-dark-muted}` — #7a7770): Sub-headings, secondary labels, footer text.
- **On Dark Soft** (`{colors.on-dark-soft}` — #5a5852): Captions, fine-print, timestamps.
- **Ink** (`{colors.ink}` — #141413): Headlines and primary text on light surfaces.
- **Body** (`{colors.body}` — #3d3d3a): Default paragraph text on light surfaces.
- **Muted** (`{colors.muted}` — #6c6a64): Secondary text on light surfaces.
- **On Primary** (`{colors.on-primary}` — #ffffff): Text on coral buttons — white on coral for maximum contrast.

### Semantic
- **Success** (`{colors.success}` — #5db872): Positive KPIs, active indicators.
- **Warning** (`{colors.warning}` — #d4a017): Caution callouts.
- **Error** (`{colors.error}` — #c64545): Validation errors.

## Typography

### Font Family
The system runs **Cormorant Garamond** as the serif display face for headlines, and **Inter** as the humanist sans for body, navigation, and UI labels. **JetBrains Mono** handles code and data blocks. The fallback stack walks `Cormorant Garamond, Garamond, "Times New Roman", serif` for display and `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` for body.

The display/body split is editorial:
- Cormorant Garamond serif (weight 500, negative tracking) — h1, h2, h3, hero display, key metrics
- Inter sans (weight 400-500) — body, navigation, buttons, captions, labels
- JetBrains Mono — data blocks, KPI numbers, CRM field labels

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 64px | 500 | 1.05 | -1.5px | Homepage h1 — Cormorant Garamond serif |
| `{typography.display-lg}` | 48px | 500 | 1.1 | -1px | Section heads — Cormorant Garamond |
| `{typography.display-md}` | 36px | 500 | 1.15 | -0.5px | Sub-section heads — Cormorant Garamond |
| `{typography.display-sm}` | 28px | 500 | 1.2 | -0.3px | Callout headlines, KPI labels — Cormorant Garamond |
| `{typography.title-lg}` | 22px | 500 | 1.3 | 0 | Card titles — Inter |
| `{typography.title-md}` | 18px | 500 | 1.4 | 0 | Feature card titles, intro paragraphs |
| `{typography.title-sm}` | 16px | 500 | 1.4 | 0 | Use case card titles, list labels |
| `{typography.body-md}` | 16px | 400 | 1.55 | 0 | Default running-text — Inter |
| `{typography.body-sm}` | 14px | 400 | 1.55 | 0 | Footer body, fine-print |
| `{typography.caption}` | 13px | 500 | 1.4 | 0 | Badge labels, captions |
| `{typography.caption-uppercase}` | 12px | 500 | 1.4 | 1.5px | Category tags, CRM names in logo strip |
| `{typography.data}` | 14px | 400 | 1.6 | 0 | KPI values, data labels — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | Standard button labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
Display sizes use weight 500 (medium), never bold. Negative letter-spacing (-0.3 to -1.5px) is essential — Cormorant Garamond without it looks loose. The serif character is what gives Sablia its premium, consultative voice; switching to a sans-serif display would make the site feel like every other AI agency.

Body type stays at weight 400 for paragraphs, weight 500 for labels and emphasized phrases. Inter is humanist — never geometric. Helvetica or Arial would be too neutral and break the editorial feel.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px . `{spacing.xs}` 8px . `{spacing.sm}` 12px . `{spacing.md}` 16px . `{spacing.lg}` 24px . `{spacing.xl}` 32px . `{spacing.xxl}` 48px . `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) — modern-SaaS rhythm.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, use case cards; `{spacing.lg}` (24px) for dashboard mockup cards and CRM tiles.
- **Callout / CTA bands:** `{spacing.xxl}` (48px) inside coral callout cards; 64px inside the larger booking CTA band.

### Grid & Container
- **Max content width:** ~1200px centered.
- **Editorial body:** Single 12-column grid; hero uses 6/6 split (h1 + sub-headline + CTA left, dashboard mockup right).
- **Use case card grids:** 3-up at desktop, 2-up at tablet, 1-up at mobile.
- **CRM logo strip:** Horizontal scroll or 4-6 logos inline at desktop, 3-up at tablet.

### Whitespace Philosophy
The dark canvas + serif display + generous internal padding create a premium pacing — Sablia reads like a high-end consulting proposition, not a marketing template. Whitespace between bands stays uniform at 96px; whitespace inside cards is generous (32px), letting type breathe. On dark surfaces, generous spacing prevents the page from feeling heavy or oppressive.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body sections, hero bands |
| Subtle hairline | 1px `{colors.hairline}` border | Cards on dark surfaces, inputs |
| Dark card | `{colors.surface-card}` background — no shadow | Feature cards, use case cards |
| Light contrast section | `{colors.surface-light}` background — no shadow | Dashboard mockups, testimonials, CRM logo strip |
| Subtle glow | Faint coral glow at low alpha | Primary CTA hover state (`0 0 20px rgba(204,120,92,0.15)`) |

The elevation philosophy is **color-block first, shadow rare**. Most depth comes from the dark-vs-light surface contrast. Shadows are minimal. The light contrast sections carry their own internal detail (dashboard screenshots, CRM pipeline views) which adds visual richness without needing external decoration.

### Decorative Depth
- Dashboard mockup screenshots inside light sections carry their own internal depth: charts, KPI numbers, colored status badges.
- CRM pipeline views show real Salesforce/HubSpot/Pipedrive UI fragments — the visitor recognizes their own tools.
- No abstract AI illustrations. Every visual is either a real product screenshot or a clean icon.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Badge accents, tiny dropdowns |
| `{rounded.sm}` | 6px | Small inline buttons, dropdown items |
| `{rounded.md}` | 8px | Standard CTA buttons, text inputs |
| `{rounded.lg}` | 12px | Content cards (feature, use case, dashboard mockup) |
| `{rounded.xl}` | 16px | Hero mockup container, large showcase elements |
| `{rounded.pill}` | 9999px | Badge pills, CRM name tags |
| `{rounded.full}` | 9999px / 50% | Avatar circles, icon buttons |

### Photography & Illustrations
Sablia's LP uses real product output, not stock photography or abstract illustrations:
- Dashboard screenshots in light contrast sections (the hero's right-side "wow" element)
- CRM pipeline views showing actual Salesforce/HubSpot/Pipedrive interfaces with Claude AI annotations
- Clean iconography for use case cards (line-art style, coral + warm gray strokes on dark)
- Team photos crop to perfect circles at 48px diameter if social proof section is active

## Components

### Top Navigation

**`top-nav`** — Dark nav bar pinned to the top of every page. 64px tall, `{colors.canvas-soft}` background. Carries the Sablia wordmark at left, primary horizontal menu (Offre, Comment ca marche, Cas d'usage, A propos) center-left, right-side CTA "Reserver un call" `{component.button-primary}` (coral). Menu items in `{typography.nav-link}` (Inter 14px / 500) with `{colors.on-dark-body}` color, active state in `{colors.on-dark}`.

### Buttons

**`button-primary`** — The signature coral CTA. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), type `{typography.button}` (Inter 14px / 500), padding 12px x 20px, height 40px, rounded `{rounded.md}` (8px). Active state `button-primary-active` darkens to `{colors.primary-active}` (#a9583e). Hover adds subtle coral glow.

**`button-secondary`** — Dark card button with hairline outline. Background transparent, text `{colors.on-dark}`, 1px `{colors.hairline}` border, same padding + height + radius as primary.

**`button-secondary-on-light`** — Used over light contrast sections. Background transparent, text `{colors.ink}`, 1px `{colors.hairline-light}` border.

**`button-text-link`** — Inline text button, no background. Used for nav secondary actions.

**`button-icon-circular`** — 36px circular icon button. Background `{colors.surface-card}`, hairline border, `{colors.on-dark}` icon.

**`text-link`** — Inline body links in `{colors.primary}` (coral). Underlined on hover.

### Cards & Containers

**`hero-band`** — Dark-canvas hero with a 6-6 grid: h1 promise + sub-headline + booking CTA on the left, dashboard mockup card on the right. The h1 is the benefit promise (e.g., "Gagnez 15h/semaine sur vos processus commerciaux"). Vertical padding `{spacing.section}` (96px).

**`dashboard-mockup-card`** — The hero's right-side artifact — a screenshot of a real Meta Ads dashboard or CRM analytics view inside a light cream card. Background `{colors.surface-light}`, rounded `{rounded.xl}` (16px), internal padding `{spacing.lg}` (24px). This is the "wow" element from the R2 presentation strategy.

**`use-case-card`** — Used in 3-up use case grids. Background `{colors.surface-card}` (#1a1a1f), rounded `{rounded.lg}` (12px), internal padding `{spacing.xl}` (32px). Carries a clean icon at top in coral, a `{typography.title-md}` headline, and a body description in `{typography.body-md}`. Each card represents one CRM automation capability (dashboard analytics, nurturing automatise, analyse de calls).

**`crm-logo-strip`** — Horizontal band showing supported CRM logos (Salesforce, HubSpot, Pipedrive, etc.). Background `{colors.surface-light}` for contrast, logos in grayscale at ~60% opacity, padding `{spacing.xxl}` (48px) vertical. The band signals compatibility without requiring text explanation. Caption-uppercase text "Compatible avec votre CRM" above the logo row.

**`process-step-card`** — Used in a horizontal 3-4 step process flow ("Comment ca marche"). Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding `{spacing.xl}`. Carries a step number in `{typography.display-sm}` (serif, coral color), a title, and a short description. Steps: Call discovery → Diagnostic CRM → Implementation sur-mesure → Suivi.

**`callout-card-coral`** — A full-bleed coral card carrying a major call-to-action. Background `{colors.primary}` (#cc785c), text `{colors.on-primary}` (white), rounded `{rounded.lg}`, padding `{spacing.xxl}` (48px). CTA inside uses an inverted dark button.

**`booking-cta-band`** — The primary conversion band, used as pre-footer CTA. Background `{colors.canvas-soft}` with a centered layout: h2 in serif ("Pret a optimiser votre CRM ?"), a sub-line describing the free discovery call, and a `{component.button-primary}` (coral). Can also appear mid-page after use cases.

**`testimonial-card`** — Used in social proof section (when available). Background `{colors.surface-light}`, rounded `{rounded.lg}`, padding `{spacing.xl}`. Carries a quote in `{typography.body-md}` italic, client name + role + company in `{typography.caption}`, circular avatar photo. Shows on light contrast band.

### Inputs & Forms

**`text-input`** — Standard text input. Background `{colors.canvas}`, text `{colors.on-dark}`, type `{typography.body-md}`, rounded `{rounded.md}` (8px), padding 10px x 14px, height 40px. 1px `{colors.hairline}` border.

**`text-input-focused`** — Focus state. Border shifts to `{colors.primary}` (coral). Carries a 3px coral-at-15%-alpha outer ring.

### Tags / Badges

**`badge-pill`** — Small pill label. Background `{colors.surface-card}`, text `{colors.on-dark-body}`, type `{typography.caption}` (13px / 500), rounded `{rounded.pill}`, padding 4px x 12px.

**`badge-coral`** — Coral-fill badge for emphasis. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.caption-uppercase}` (12px / 500 / 1.5px tracking), rounded `{rounded.pill}`, padding 4px x 12px.

**`badge-teal`** — Teal-fill badge for success/positive states. Background `{colors.accent-teal}`, text `{colors.canvas}`, same sizing as `{component.badge-coral}`.

**`crm-name-tag`** — Small tag showing a CRM name (Salesforce, HubSpot, etc.). Background `{colors.surface-card-elevated}`, text `{colors.on-dark-body}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px x 10px. Used in use case cards to show which CRM the use case applies to.

### CTA / Footer

**`footer`** — Dark footer that closes every page. Background `{colors.canvas}` (same as body — no contrast break needed), text `{colors.on-dark-muted}`. Simple layout: Sablia wordmark + tagline left, contact email center, legal links right. Vertical padding 64px. Minimal — this is a single-page LP, not a multi-page site.

## Do's and Don'ts

### Do
- Anchor every section on the dark canvas. Pure black reads as aggressive; the warm dark tint (#0f0f12) is the brand differentiator.
- Use Cormorant Garamond serif for every display headline. Pair with Inter sans body. Negative letter-spacing on display sizes is non-negotiable.
- Use `{colors.primary}` (coral) for primary CTAs and full-bleed `{component.callout-card-coral}` moments. Coral is the dominant brand accent.
- Use `{colors.accent-teal}` sparingly as a secondary accent — success badges, positive data, chart contrast lines. Teal complements coral, never competes.
- Use `{component.dashboard-mockup-card}` and CRM screenshots to show real product output. Don't use abstract AI illustrations or stock photos — show actual dashboards, actual CRM pipelines.
- Alternate dark canvas bands with `{colors.surface-light}` contrast sections. The dark-to-light rhythm is the page's pacing mechanism.
- Use generous whitespace on dark sections to prevent visual heaviness. Dark + cramped = oppressive. Dark + spacious = premium.
- Keep the LP focused: one page, one CTA (book a discovery call), maximum 5-6 sections total.
- Apply `{spacing.section}` (96px) between major bands.

### Don't
- Don't use pure black (#000000) for canvas. The warm dark tint is the brand.
- Don't bold serif display weight. Cormorant Garamond at 700+ reads as heavy; the system stays at 500.
- Don't use teal as a primary CTA color — teal is a secondary accent for data and success states only. Coral is the primary.
- Don't scatter coral across every element. Use it on primary CTAs, callout cards, and key highlights — not on every border or label.
- Don't use Inter for display headlines. The serif character is the premium voice.
- Don't repeat the same surface mode in two consecutive bands. The pacing alternates: dark → dark-card → light-contrast → dark → coral-callout → dark-footer.
- Don't list every capability on the LP. Maximum 3 use cases. The visitor should feel "these people are focused and expert", not "these people do everything".
- Don't show pricing on the LP. The offer is custom — the CTA is always a discovery call.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 768px | Hamburger nav; hero h1 64->32px; dashboard-mockup-card stacks below content; use case grids 1-up; CRM logo strip horizontal scroll; footer stacks vertically |
| Tablet | 768-1024px | Top nav stays horizontal but tightens; use case cards 2-up; CRM logos 4-up |
| Desktop | 1024-1440px | Full top-nav; 3-up use case cards; 6-up CRM logos; hero 6/6 split |
| Wide | > 1440px | Same as desktop with more outer breathing room; max content width caps at 1200px |

### Touch Targets
- `{component.button-primary}` at minimum 40 x 40px.
- `{component.button-icon-circular}` at exactly 36 x 36.
- `{component.text-input}` height is 40px.

### Collapsing Strategy
- Top nav collapses to hamburger at < 768px; menu opens as a full-screen dark sheet.
- Hero band's 6-6 grid collapses to single-column on mobile — h1 + sub-head + CTA first, then the dashboard mockup card below.
- Use case grids reduce columns rather than scaling cards down.
- CRM logo strip becomes horizontally scrollable on mobile.
- Process steps collapse from horizontal to vertical timeline on mobile.

## Iteration Guide

1. Focus on ONE component at a time. Reference its token key (`{component.use-case-card}`, `{component.dashboard-mockup-card}`).
2. Variants of an existing component (`-active`, `-disabled`, `-focused`) live as separate entries.
3. Use `{token.refs}` everywhere — never inline hex.
4. Display headlines stay Cormorant Garamond serif 500 with negative tracking. Body stays Inter 400. The split is unbreakable.
5. Dark canvas + coral primary + teal accent + light contrast sections is the palette. Don't introduce colors outside this system.
6. When in doubt about emphasis: bigger Cormorant Garamond serif before bolder weight.
7. Every visual element on the page should be either a real product screenshot, a clean icon, or typography. No decorative illustrations, no gradients, no abstract shapes.

## Changelog

- **2026-05-26**: Primary color swapped from teal (#5db8a6) to coral (#cc785c). Teal demoted to secondary accent. Rationale: coral is warmer, more distinctive, better contrast against the dark canvas. Teal remains for success states and data accents.
- **2026-05-27**: DESIGN.md updated to reflect the coral-primary reality already implemented in code.
