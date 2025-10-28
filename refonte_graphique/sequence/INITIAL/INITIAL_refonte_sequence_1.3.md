# INITIAL - PRP 1.3 - LogosCloud (Intégrations)

## FEATURE

Create a logos cloud section displaying 13 integration/tool logos that Sablia can work with, in a responsive grid layout.

**Requirements**:
- Grid of 13 integration logos (automation & productivity tools)
- Responsive grid: 5 columns desktop → 3 tablet → 2 mobile
- Fade-in animation on scroll (ScrollReveal)
- Hover effect: grayscale → color transition + subtle scale
- Professional spacing and alignment
- Logos should be SVG or high-quality PNG with transparent background
- Section title: "Intégrations & Outils" or "Les outils que nous maîtrisons"

**Visual Deliverable**: Clean grid of integration logos showing Sablia's technical capabilities, with smooth hover effects and scroll animations, positioned after the testimonials section.

**Technical Requirements**:
- Component path: `client/src/components/v3/LogosCloud.tsx`
- Use ScrollReveal for section animation
- Staggered fade-in for individual logos (Framer Motion)
- Integrate into LandingV3.tsx as third section (after Testimonials)
- Logo assets in `public/logos/integrations/` directory

## EXAMPLES

**LogosCloud Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface Integration {
  id: number;
  name: string;
  imageUrl: string;
  category: string; // "automation" | "ai" | "productivity" | "communication" | "development"
}

const integrations: Integration[] = [
  // Automation platforms
  { id: 1, name: "n8n", imageUrl: "/logos/integrations/n8n.svg", category: "automation" },
  { id: 2, name: "Make", imageUrl: "/logos/integrations/make.svg", category: "automation" },

  // AI platforms
  { id: 3, name: "OpenAI", imageUrl: "/logos/integrations/openai.svg", category: "ai" },
  { id: 4, name: "Anthropic", imageUrl: "/logos/integrations/anthropic.svg", category: "ai" },
  { id: 5, name: "Gemini", imageUrl: "/logos/integrations/googlegemini.svg", category: "ai" },
  { id: 6, name: "Perplexity", imageUrl: "/logos/integrations/perplexity.svg", category: "ai" },

  // Productivity & Google ecosystem
  { id: 7, name: "Google Sheets", imageUrl: "/logos/integrations/googlesheets.svg", category: "productivity" },
  { id: 8, name: "Google Drive", imageUrl: "/logos/integrations/googledrive.svg", category: "productivity" },
  { id: 9, name: "Google Forms", imageUrl: "/logos/integrations/googleforms.svg", category: "productivity" },
  { id: 10, name: "Notion", imageUrl: "/logos/integrations/notion.svg", category: "productivity" },

  // Communication
  { id: 11, name: "Slack", imageUrl: "/logos/integrations/slack.svg", category: "communication" },

  // Development & Deployment
  { id: 12, name: "GitHub", imageUrl: "/logos/integrations/github.svg", category: "development" },
  { id: 13, name: "Vercel", imageUrl: "/logos/integrations/vercel.svg", category: "development" },
];

export default function LogosCloud() {
  return (
    <section
      id="logos"
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-v2-white mb-4">
              Intégrations & Outils
            </h2>
            <p className="text-lg text-v2-off-white/70">
              Automatisez vos workflows avec les outils que vous utilisez déjà
            </p>
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

          {/* Subtitle */}
          <p className="text-center mt-12 text-sm text-v2-off-white/50">
            Et bien d'autres intégrations possibles
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

**Reference Existing Component**: Check `client/src/components/v2/LogosCloud.tsx` for existing patterns (but create new v3 version).

**Staggered Animation Pattern**:
```typescript
// Each logo fades in with increasing delay
transition={{ duration: 0.5, delay: index * 0.08 }}
// Logo 1: 0s delay, Logo 2: 0.08s delay, Logo 3: 0.16s delay, etc.
// Total reveal time: 13 × 0.08s = 1.04s
```

## DOCUMENTATION

**Integration Tools** (grouped by category):

### Automation Platforms
1. **n8n** - Open-source workflow automation
   - File: `n8n.svg` ✓ Present
   - Colors: Brand purple (#EA4B71)

2. **Make** - Visual automation platform (formerly Integromat)
   - File: `make.svg` ✓ Present
   - Colors: Brand purple/blue

### AI Platforms
3. **OpenAI** - GPT models, ChatGPT
   - File: `openai.svg` ✓ Present
   - Colors: Black with green accent

4. **Anthropic** - Claude AI
   - File: `anthropic.svg` ✓ Present
   - Colors: Orange/peach gradient

5. **Gemini** - Google AI
   - File: `googlegemini.svg` ✓ Present
   - Colors: Google multi-color

6. **Perplexity** - AI-powered search
   - File: `perplexity.svg` ✓ Present
   - Colors: Blue/teal gradient

### Productivity & Google Ecosystem
7. **Google Sheets** - Spreadsheets
   - File: `googlesheets.svg` ✓ Present
   - Colors: Green

8. **Google Drive** - Cloud storage
   - File: `googledrive.svg` ✓ Present
   - Colors: Multi-color triangle

9. **Google Forms** - Form builder
   - File: `googleforms.svg` ✓ Present
   - Colors: Purple

10. **Notion** - Workspace & docs
    - File: `notion.svg` ✓ Present
    - Colors: Black & white

### Communication
11. **Slack** - Team communication
    - File: `slack.svg` ✓ Present
    - Colors: Multi-color hash mark

### Development & Deployment
12. **GitHub** - Version control & collaboration
    - File: `github.svg` ✓ Present
    - Colors: Black/white

13. **Vercel** - Deployment platform
    - File: `vercel.svg` ✓ Present
    - Colors: Black/white

**Logo Files Status**:

✓ **All 13 logos are present** in `public/logos/integrations/` directory:
- anthropic.svg
- github.svg
- googledrive.svg
- googleforms.svg
- googlegemini.svg
- googlesheets.svg
- make.svg
- n8n.svg
- notion.svg
- openai.svg
- perplexity.svg
- slack.svg
- vercel.svg

**Note**: Use exact filenames as listed above (e.g., `googlegemini.svg` not `gemini.svg`)

**Logo Guidelines**:
- Format: SVG preferred (scales perfectly), fallback high-res PNG
- Size: At least 200px width for quality
- Background: Transparent
- Style: Official brand logos (respect brand guidelines)
- Ratio: Vary heights acceptable, maintain aspect ratio

**Grayscale Filter**:
```css
filter: grayscale(100%);  /* Default state - uniform appearance */
filter: grayscale(0%);    /* Hover state - brand colors show */
opacity: 0.6;              /* Default dimmed */
opacity: 1.0;              /* Hover bright */
```

**Framer Motion Viewport**:
- `whileInView`: Trigger animation when element enters viewport
- `viewport={{ once: true }}`: Animation triggers once (doesn't repeat on scroll)
- `whileHover={{ scale: 1.05 }}`: Subtle lift effect on hover
- https://www.framer.com/motion/scroll-animations/##viewport-scroll

**Grid Responsive Breakpoints**:
- Mobile (<640px): 2 columns (`grid-cols-2`)
- Tablet (640-1024px): 3 columns (`md:grid-cols-3`)
- Desktop (>1024px): 5 columns (`lg:grid-cols-5`)
- Gap: 8px mobile → 12px desktop

## GRADIENT SYSTEM

⚠️ **CRITICAL**: LandingV3 uses a continuous vertical gradient that progresses from sky blue (top) → night (middle) → dawn/sunrise (bottom). This gradient creates a visual metaphor for the customer journey and MUST NOT be interrupted by solid backgrounds on sections.

**📖 Full Reference**: See `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md` for complete specifications.

**Key Rules**:
- ❌ **DO NOT** use solid backgrounds (`bg-v2-navy`, `bg-v2-electric`, `bg-v2-charcoal`) on `<section>` elements
- ❌ **DO NOT** use local gradients (`bg-gradient-to-b`, etc.) that would conflict with the main gradient
- ✅ **DO** keep sections transparent (no background class) to reveal the main gradient
- ✅ **DO** use light glassmorphism for cards/containers if needed (`bg-v2-charcoal/20 backdrop-blur-md`)
- ✅ **DO** use white text throughout (`text-v2-white`, `text-v2-off-white`)

**Gradient Applied On**: The main wrapper `<motion.div>` in `LandingV3.tsx` via inline style:
```typescript
style={{
  background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
}}
```

## OTHER CONSIDERATIONS

**Logo Placeholder Strategy** (if files not yet available):
Use colored div placeholders with tool names:
```typescript
<div className="h-12 lg:h-14 px-4 flex items-center justify-center bg-v2-charcoal/30 backdrop-blur-md rounded-lg border border-v2-cyan/20">
  <span className="text-v2-cyan font-semibold text-xs uppercase tracking-wider">
    {integration.name}
  </span>
</div>
```

**Logo Image Optimization**:
- Compress PNGs with TinyPNG or ImageOptim
- Optimize SVGs with SVGO: https://jakearchibald.github.io/svgomg/
- Use WebP format for better compression (with PNG fallback)
- All logos should be < 50KB each

**Hover Effect Specifics**:
- Default: `grayscale(100%) opacity-60` (uniform gray, dimmed)
- Hover: `grayscale(0%) opacity-100 scale(1.05)` (color, bright, slight lift)
- Transition: 300ms smooth
- Creates professional "activation" effect showing tool colors

**Animation Timing**:
- Stagger delay: 0.08s between each logo (80ms)
- Total reveal time for 13 logos: 1.04s
- Duration per logo: 0.5s
- `once: true` prevents re-animation on scroll up/down

**Section Copy**:
- Title: "Intégrations & Outils" (Integration & Tools)
- Subtitle: "Automatisez vos workflows avec les outils que vous utilisez déjà" (Automate your workflows with tools you already use)
- Footer: "Et bien d'autres intégrations possibles" (And many other integrations possible)

**Accessibility**:
- Each logo should have descriptive `alt` text: "{Tool Name} integration"
- Add `title` attribute for tooltip on hover
- Logos are meaningful (show technical capabilities)
- Sufficient contrast in default state (60% opacity ensures visibility)

**Performance**:
- Use `loading="lazy"` for images (browser native lazy loading)
- Optimize image file sizes (< 50KB each)
- SVG preferred (smaller file size, perfect scaling)
- 13 logos × ~20KB = ~260KB total (acceptable)

**Responsive Design**:
- Logo height: 48px mobile → 56px desktop
- Grid gap: 32px mobile → 48px desktop
- Container padding: `px-6 lg:px-8`
- Maintain aspect ratios with `object-contain`
- 5 columns on desktop allows 13 logos in 3 rows (5-5-3 pattern)

**Gotchas**:
- Ensure all logos have similar visual weight (not one huge, one tiny)
- Test grayscale effect on colored logos (most should work well)
- Microsoft/Google logos may have complex colors (test grayscale appearance)
- Don't use `object-cover` (will crop logos)
- Some logos (like Notion) are simpler and may appear smaller - adjust size as needed

**Z-Index**:
- LogosCloud: default flow (no special z-index needed)
- Logos: no z-index (in normal flow)

**Known Issues to Avoid**:
- If logos appear at different sizes, ensure consistent height property
- If grayscale doesn't work, check browser support (works in modern browsers)
- If stagger animation is too slow, reduce delay multiplier (0.08s → 0.05s)
- If images don't load, check file paths and extensions
- Some brand logos have padding built-in (like Slack) - may need adjustment

**Logo Directory Structure**:
```
public/
  logos/
    integrations/
      anthropic.svg
      github.svg
      googledrive.svg
      googleforms.svg
      googlegemini.svg
      googlesheets.svg
      make.svg
      n8n.svg
      notion.svg
      openai.svg
      perplexity.svg
      slack.svg
      vercel.svg
```

**Fallback for Missing Logos**:
```typescript
// If logo image fails to load, show styled text fallback
<img
  src={integration.imageUrl}
  alt={`${integration.name} integration`}
  onError={(e) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextElementSibling?.classList.remove('hidden');
  }}
/>
<div className="hidden h-12 lg:h-14 px-4 flex items-center justify-center bg-v2-charcoal/30 backdrop-blur-md rounded-lg border border-v2-cyan/20">
  <span className="text-v2-cyan font-semibold text-xs uppercase tracking-wider">
    {integration.name}
  </span>
</div>
```

**Brand Compliance Notes**:
- Respect each tool's brand guidelines when using logos
- Don't modify logo colors manually (grayscale filter is acceptable)
- Don't stretch or distort logos
- Ensure adequate spacing around logos
- Most brands allow logo usage in "integration partner" context

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to logos section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('logos')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot after stagger animation completes
mcp__playwright__browser_take_screenshot({ filename: "prp-1.3-integrations-cloud.png" })

// Test hover effect on one logo
mcp__playwright__browser_hover({ element: "First integration logo", ref: "e_logo_1" })
mcp__playwright__browser_wait_for({ time: 0.5 })
mcp__playwright__browser_take_screenshot({ filename: "prp-1.3-logo-hover.png" })

// Test mobile responsiveness
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('logos')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "prp-1.3-integrations-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] Section title "Intégrations & Outils" displays correctly
- [ ] Subtitle displays below title
- [ ] 13 integration logos visible in grid layout
- [ ] Desktop: 5 columns (5-5-3 row pattern)
- [ ] Tablet: 3 columns
- [ ] Mobile: 2 columns
- [ ] Logos fade in with staggered timing (0.08s delay each)
- [ ] Logos default to grayscale + 60% opacity
- [ ] Hover effect: color + 100% opacity + scale 1.05
- [ ] Transition is smooth (300ms)
- [ ] Logos maintain aspect ratio (not distorted)
- [ ] All logos have similar visual weight
- [ ] Alt text and title attributes present
- [ ] Footer text "Et bien d'autres..." displays
- [ ] Mobile: grid adapts to 2 columns
- [ ] No console errors
- [ ] Performance: animations smooth at 60fps

**Success Criteria**:
- ✅ Grid with 13 integration logos (automation + AI + productivity tools)
- ✅ Responsive: 5 cols desktop → 3 tablet → 2 mobile
- ✅ Section title + subtitle + footer text
- ✅ Fade-in animation on scroll (ScrollReveal)
- ✅ Staggered animation for individual logos (0.08s delay)
- ✅ Grayscale → color hover effect + scale
- ✅ Smooth transition (300ms)
- ✅ Logos maintain aspect ratio (object-contain)
- ✅ Professional spacing and alignment
- ✅ Section positioned after Testimonials
- ✅ Accessible alt text and titles on all logos
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 1.3 - LogosCloud (Intégrations)
- **Prochaine étape**: PRP 2.1 - ProblemSection
