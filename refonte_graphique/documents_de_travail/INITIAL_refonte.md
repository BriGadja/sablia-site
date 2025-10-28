# INITIAL_refonte.md - Refonte complète Sablia.io 2025

## FEATURE:

Refonte complète du site Sablia.io avec nouvelle identité visuelle, architecture d'information optimisée, et grille tarifaire transparente. Le site doit projeter crédibilité, innovation technique et souveraineté technologique européenne.

### 🎯 IMPORTANT : Structure du Projet

**La refonte doit être créée dans une route séparée `/landingv2` pour permettre des comparaisons faciles.**

**Structure cible** :
```
client/src/
├── pages/
│   ├── Home.tsx                    # Page actuelle (RESTE INTACTE)
│   └── LandingV2.tsx               # ✨ NOUVELLE page de refonte
├── components/
│   ├── ui/                         # Composants existants (ne pas modifier)
│   └── v2/                         # ✨ NOUVEAUX composants pour la refonte
│       ├── Hero.tsx
│       ├── PricingPathways.tsx
│       ├── CalculatorROI.tsx
│       ├── TestimonialCard.tsx
│       ├── ThreeStepProcess.tsx
│       ├── PricingGrid.tsx
│       └── ... autres composants v2
└── styles/
    └── landingv2.css               # ✨ Styles spécifiques v2 (optionnel)
```

**Routing** (dans le fichier principal App/Router) :
- `/` → Page actuelle Home.tsx (inchangée)
- `/landingv2` → Nouvelle page LandingV2.tsx

**Principes d'isolation** :
1. ❌ **NE PAS modifier** les composants existants dans `client/src/components/ui/`
2. ✅ **CRÉER** tous les nouveaux composants dans `client/src/components/v2/`
3. ✅ **RÉUTILISER** les composants de base existants si compatibles (Button, Card, Input)
4. ✅ **CRÉER** des variants v2 si les composants existants ne correspondent pas au nouveau design
5. ✅ **ISOLER** les styles spécifiques v2 pour éviter conflits avec la version actuelle

**Avantages de cette approche** :
- ✅ Comparaison facile : `/` vs `/landingv2`
- ✅ Tests A/B possibles
- ✅ Rollback instantané si problème
- ✅ Développement sans risque pour le site actuel
- ✅ Migration progressive possible (copier section par section si v2 performe mieux)

**Configuration Tailwind** :
- Les nouvelles couleurs (Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC) doivent être ajoutées au `tailwind.config.ts` SANS remplacer les couleurs actuelles
- Utiliser des noms préfixés : `v2-navy`, `v2-electric`, `v2-cyan` pour éviter conflits

**Navigation entre versions** :
- Ajouter un lien temporaire dans le footer ou header de développement pour basculer facilement
- Cookie ou localStorage pour se souvenir de la version préférée (optionnel)

**Testing** :
- Tester les deux versions en parallèle
- Vérifier qu'aucune modification accidentelle n'affecte la version actuelle
- Comparer les performances (Lighthouse) entre `/` et `/landingv2`

### Direction Visuelle : Minimalisme Gradient + Swiss Design

**Style général** :
- Approche hybride : rigueur Swiss Design (grilles précises, espaces blancs généreux, typographie hiérarchique) + modernité tech (gradients subtils, animations GPU-accelerated)
- Layout basé sur grille 12 colonnes avec whitespace généreux (80px entre sections majeures)
- Palette restreinte pour sophistication par retenue
- Animations purposeful (jamais gratuites) respectant prefers-reduced-motion

**Palette chromatique** :
- **Primaires** :
  - Navy Blue #0A2463 (texte headlines, trust, stabilité)
  - Electric Blue #3E92CC (liens, éléments secondaires, technologie)
  - Cyan vibrant #52D1DC (CTAs, accents d'action)
- **Neutres** :
  - Blanc pur #FFFFFF (backgrounds principaux)
  - Off-white #F8F9FA (sections alternées, réduit fatigue)
  - Charcoal #2D3142 (texte body)
- **Gradients** : Navy → Electric Blue à 45° pour hero section uniquement

**Typographie** :
- Font : Inter (gratuite, hautement readable, optimisée web)
- Scale :
  - H1 : 72px Inter Bold (hero headline)
  - H2 : 48px (section headlines)
  - H3 : 32px (subsections)
  - H4 : 24px (card headings)
  - Body : 16-18px Inter Regular (line-height 1.5)
  - Small : 14px (captions, footer)
- Left-aligned ragged-right pour readability
- Letter-spacing -1% to -2% pour large headlines

**Système d'espacement** :
- Base unit : 8px (alignement pixel-perfect)
- Component padding : 24-32px
- Section spacing : 80px (50px mobile)
- Grid gaps : 32px entre colonnes
- Breakpoints : 640px, 768px, 1024px, 1280px

### Architecture d'Information : 3 Pathways Stratégiques

**Structure narrative** : Client = héros (framework StoryBrand)

**3 Pathways principaux** (évite paralysie décisionnelle des 6 services) :

1. **DÉCOUVRIR** (TOFU - Top of Funnel)
   - Appel gratuit 30 min (CTA principal site)
   - Audit Express 350€ (barrier d'entrée basse)
   - Positionnement : "Voir si l'automation a du sens pour vous"

2. **TRANSFORMER** (MOFU - Middle of Funnel)
   - Diagnostics IA : 4 500€ (PME) à 15 000€ (ETI)
   - Formations : 700€ (demi-journée) à 3 300€ (3 jours)
   - Positionnement : "Planifier votre transformation"

3. **RÉALISER** (BOFU - Bottom of Funnel)
   - Développement : 2 500€ (workflow simple) à 60 000€+ (transformation complète)
   - Retainer : 1 500€/mois (maintenance) à 5 000€/mois (gestion déléguée)
   - Positionnement : "Automatiser et scaler durablement"

Chaque pathway s'ouvre en accordéon pour révéler options spécifiques (progressive disclosure).

### Sections de la Landing Page (ordre psychologique)

**1. Hero Section** (passe le "grunt test" en 3 secondes)
- Headline : "Vos meilleurs collaborateurs se noient dans le copier-coller"
- Subhead : "Formation-first automation qui donne à votre équipe les moyens de posséder les systèmes qui pilotent la croissance"
- Gradient Navy → Electric Blue background
- CTA principal : "Diagnostic gratuit 30 min"
- CTA secondaire : "Calculer mon ROI automation"

**2. Logos Clients** (social proof immédiate)
- 10-20 logos reconnaissables
- Grid arrangement clean
- Label : "2 000+ entreprises européennes nous font confiance"

**3. Problème-First Framing**
- Section "Vous êtes coincé entre croissance et burnout"
- 3 douleurs spécifiques :
  - Votre équipe passe la moitié de sa journée sur tâches répétitives
  - Les processus manuels créent des goulots d'étranglement
  - Chaque nouveau client = plus de chaos
- Visuels : Before/After Grid (5 dimensions HAVE/FEEL/DAY/STATUS/RIGHT-WRONG)

**4. Solution : Notre Différenciation**
- 3 piliers Sablia (icônes + headlines audacieux) :
  - 🎓 Formation d'abord : "Toute votre équipe devient experte en automation"
  - 💰 Stack souverain : "Vos données restent en Europe, zéro vendor lock-in"
  - ⏱️ ROI immédiat : "Récupérez 15h par semaine dès le 1er mois"
- Métriques quantifiées par bloc

**5. Comment ça marche** (processus 3 étapes max)
- Timeline visuelle avec indicateurs "Vous êtes ici"
- Étape 1 : DÉCOUVRIR & ÉVALUER (Semaine 1)
- Étape 2 : FORMER & IMPLÉMENTER (Semaines 2-6)
- Étape 3 : OPTIMISER & SCALER (Continu)
- CTA après processus : "Commencez par l'étape 1"

**6. Les 3 Pathways** (cœur de l'offre)
- Présentation en 3 colonnes desktop (Good/Better/Best)
- Anchoring psychologique : Premium à gauche → Entrée à droite
- Option cible (TRANSFORMER) highlightée avec badge "Plus populaire"
- Chaque pathway avec :
  - Icône distinctive
  - Headline court
  - Pour qui c'est fait
  - Prix (fourchette transparente)
  - Bénéfices clés (3-4 bullets)
  - ROI attendu année 1
  - CTA spécifique au pathway
  - Expandable pour détails (progressive disclosure)

**7. Grille Tarifaire Détaillée** (transparence = différenciation)
- Transparence totale : Appel gratuit, Audit 350€, Formations 700-3 300€
- Fourchettes qualifiées : Diagnostics 4 500-15 000€ avec "projet typique : 8 000€"
- Prix de départ : Développement "À partir de 2 500€" avec exemples concrets
- Toujours accompagné de :
  - Ce qui est inclus
  - Durée estimée
  - ROI attendu
  - Exemples concrets de projets
- Format : Cards avec ombres subtiles, grid arrangement

**8. Preuves Sociales** (testimonials + case studies)
- 5-8 témoignages avec :
  - Photos clients (vraies, pas stock)
  - Nom + fonction + entreprise
  - Métriques spécifiques : "40% gain temps", "50K€ économies année 1"
  - Quote courte mais impactante
- 2-3 case studies format Challenge-Solution-Résultats
- Filtrables par industrie (optionnel)

**9. FAQ Stratégique** (gestion objections)
- "Trop cher ?" → Reframing ROI : "Investment 15K€ | Économies annuelles 50K€+ | Payback < 4 mois"
- "Prend trop de temps ?" → "Résultats en 30 jours, pas 6 mois"
- "Notre équipe n'est pas technique ?" → "Pas de code requis. Si vous utilisez un tableur, vous pouvez automatiser"
- "Pas de temps pour formation ?" → "Formation pendant implémentation — pas de temps extra"
- "Pourquoi n8n et pas Zapier ?" → Comparaison détaillée
- "C'est quoi le retainer ?" → Explication des 3 niveaux

**10. Footer** (dark navy #0A2463)
- Navigation clean
- Newsletter signup (microcopy : "Pas de spam, insights actionnables uniquement")
- Social icons
- Mentions légales

### CTAs Stratégiques par Stage du Funnel

**TOFU (Awareness)** :
- "Téléchargez : Guide du coût caché des processus manuels" (lecture 5 min)
- "Quiz : Votre score de maturité automation"
- "Webinaire : IA sans le hype"
- Placement : Exit-intent popup, blog articles

**MOFU (Considération)** :
- "Obtenez votre estimation ROI personnalisée" (calculateur interactif)
- "Audit gratuit 30 min — zéro engagement"
- "Comparez : n8n vs Zapier vs Make"
- Microcopy : "L'audit gratuit révèle des opportunités de X€"
- Placement : Près testimonials, après section processus

**BOFU (Décision)** :
- "Réservez votre session stratégie"
- "Lancez votre projet automation"
- "Planifions ensemble votre projet"
- Microcopy : "Prochaine dispo : Mardi 14h", "Commencez à voir ROI sous 30 jours"
- Placement : Près études de cas, après grille tarifaire

**Sticky Header CTA** : "Audit Gratuit 30min" toujours visible

### Éléments Interactifs (démonstration capacités)

**Calculateur ROI** :
- Inputs visiteur :
  - Nombre employés
  - Heures/semaine tâches répétitives
  - Salaire horaire moyen
  - Nombre de processus manuels
- Calcul temps réel :
  - Coût annuel des processus manuels
  - Économies potentielles avec automation
  - ROI % et payback période
  - Temps libéré par employé
- Visualisation : Bar chart gains temps, pie chart répartition économies (Recharts)
- CTA après calcul : "Obtenez un plan personnalisé"

**Quiz Maturité Automation** :
- 8-10 questions interactives
- Scoring dynamique
- Résultat personnalisé avec recommandations
- Lead capture après résultat

**Comparateur n8n vs autres** :
- Tableau comparatif interactif
- Critères : Prix, souveraineté données, flexibilité, courbe apprentissage, communauté
- Toggle pour afficher détails

### Animations & Interactions (Framer Motion + GSAP)

**Respect absolu prefers-reduced-motion** (WCAG 2.1 Level AA)

**Animations autorisées** :
- Fade-in on scroll (whileInView) pour sections
- Staggered children animations pour listes/grids
- Hover states subtils sur cards/buttons (transform: scale(1.02), shadow augmente)
- Smooth scroll entre sections
- Progress indicator scroll

**Animations avancées (si motion accepté)** :
- Parallax subtle sur hero background
- Horizontal scroll gallery pour testimonials
- Numbers counting up pour métriques (40% → animation de 0 à 40)
- Workflow diagrams animés (étapes apparaissent progressivement)

**Exclusivement GPU-accelerated** :
- Animer uniquement transform et opacity
- Éviter width, height, top, left, margin, padding
- Target 60fps minimum (16ms/frame)

### Navigation

**Desktop** (60-80% trafic B2B) :
- Navigation complète visible
- 6 items max : Solutions, Tarifs, Cas Clients, Ressources, À propos, Contact
- Logo left, menu center/right
- CTA button "Audit Gratuit" toujours visible (sticky)

**Mobile** :
- Hamburger menu
- Touch targets minimum 48x48px
- Navigation optimisée pouce

### Messages à Éliminer (détection IA)

**Phrases clichés à bannir** :
- "delve into", "in the ever-evolving landscape", "game-changer"
- "unlock the power", "leverage synergies", "seamless integration"
- "digital transformation" sans contexte spécifique
- Points exclamation excessifs (max 1-2 par page)
- Buzzwords vides : synergy, ecosystem, paradigm shift, thought leadership

**Remplacer par** :
- Langage spécifique et concret
- Data précises : "Le marché SaaS a crû 18% en Q4 2024"
- Métriques quantifiées : "75% de réduction" pas "très efficace"

### Performance & Accessibilité

**Performance Budgets** :
- JavaScript initial < 100kb
- CSS < 50kb
- Animation libraries < 50kb
- Total bundle < 300kb
- Images : WebP, lazy loading, optimisation aggressive
- Target : FID < 100ms, CLS < 0.1, LCP < 2.5s

**Accessibilité** :
- WCAG 2.1 Level AA minimum
- Contraste minimum 4.5:1 (texte body), 3:1 (large text)
- Navigation clavier complète
- ARIA labels sur tous éléments interactifs
- Support dark mode (optionnel mais recommandé)
- prefers-reduced-motion respecté absolument

### Mobile-First Responsive

**Typography scale réduit mobile** :
- H1 : 48px (au lieu de 72px)
- Body : 16px
- Espacement sections : 50px (au lieu de 80px)

**Grid collapse** :
- 3 cols → 2 cols → 1 col selon breakpoints
- Cards stack verticalement
- Calculateur ROI simplifié mobile

**Navigation** :
- Hamburger menu
- CTAs full-width
- Forms optimisés touch

---

## EXAMPLES:

### Design & Composants UI

**À créer dans examples/** :
- `FormWithValidation.tsx` - Formulaire audit avec React Hook Form + Zod
  - Email business validation (rejeter @gmail, @yahoo, etc.)
  - Phone formatting
  - Consent checkbox GDPR
  - Loading states
  - Error display
  - Success feedback (toast)

- `PricingCard.tsx` - Card component pour grille tarifaire
  - Props: title, price, features[], highlight, cta
  - Hover effects subtils
  - Badge "Plus populaire"
  - Expandable pour détails

- `TestimonialCard.tsx` - Testimonial avec photo
  - Image optimization
  - Quote formatting
  - Metrics display
  - Responsive layout

- `CalculatorROI.tsx` - Calculateur interactif
  - Number inputs avec formatting
  - Calculs temps réel
  - Recharts integration
  - Results display avec CTAs

- `ThreeStepProcess.tsx` - Timeline processus
  - Visual timeline
  - Step indicators
  - Expandable details
  - Mobile-friendly

### Patterns Existants à Suivre

Références dans le codebase actuel :
- `client/src/components/ui/ContactForm.tsx` - Pattern de formulaire
- `client/src/components/ui/Card.tsx` - Style des cards
- `client/src/components/ui/Button.tsx` - Variants de boutons
- Navigation Wouter existante à adapter
- Toast system actuel à réutiliser

### Inspirations Sites Awwwards

**Igloo Inc** (Site de l'Année 2024) :
- Palette minimaliste 2 couleurs
- WebGL optimisé 60fps
- Crédibilité technique par implémentation

**Kriss.ai** (Site du Mois) :
- Lead with human impact, not technical features
- Palette années 70 chaude (vs tech froid)
- Micro-interactions logo intégrées partout

**Inkfish** :
- Minimalisme extrême noir/blanc
- Typographie editorial comme élément design primaire
- Parallax fullscreen dramatique

**Shopify Plus** :
- Enterprise sans ennui
- Palette brun chaud + menthe pâle
- Headers excellents avec propositions valeur cristallines

**Locomotive Agency** :
- Fonte custom devenant fondation identité
- Stylesheet minimaliste (2 fontes, 4 styles)
- Consistance bat spectacle

---

## DOCUMENTATION:

### Frameworks & Libraries

**Frontend** :
- Next.js 14/15 : https://nextjs.org/docs
  - App Router
  - Server Components
  - Image optimization : https://nextjs.org/docs/app/api-reference/components/image
- Framer Motion 11 : https://www.framer.com/motion/
  - whileInView : https://www.framer.com/motion/gestures/#viewport-scroll
  - Variants system : https://www.framer.com/motion/animation/#variants
  - Respect prefers-reduced-motion automatique

**Animation Avancée** :
- GSAP 3.x : https://greensock.com/docs/
- ScrollTrigger : https://greensock.com/docs/v3/Plugins/ScrollTrigger
- React Three Fiber (si 3D nécessaire) : https://docs.pmnd.rs/react-three-fiber

**Styling** :
- Tailwind CSS 3.4+ : https://tailwindcss.com/docs
  - Container Queries : https://tailwindcss.com/docs/container-queries
  - Custom Properties : https://tailwindcss.com/docs/customizing-colors#using-css-variables
- Modern CSS :
  - Grid : https://css-tricks.com/snippets/css/complete-guide-grid/
  - Custom Properties : https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

**Forms & Validation** :
- React Hook Form : https://react-hook-form.com/docs
  - Multi-step forms : https://react-hook-form.com/advanced-usage#WizardFormFunnel
  - Zod resolver : https://react-hook-form.com/docs/useform#resolver
- Zod : https://zod.dev
  - Email validation : https://zod.dev/?id=strings
  - Number coercion : https://zod.dev/?id=coercion-for-primitives

**Data Visualization** :
- Recharts : https://recharts.org/en-US/
  - Bar Chart : https://recharts.org/en-US/api/BarChart
  - Pie Chart : https://recharts.org/en-US/api/PieChart
  - Responsive Container : https://recharts.org/en-US/api/ResponsiveContainer

**State Management** :
- React Query : https://tanstack.com/query/latest/docs/framework/react/overview
  - Mutations : https://tanstack.com/query/latest/docs/framework/react/guides/mutations

### Design Patterns & UX

**Frameworks Narratifs** :
- StoryBrand (Donald Miller) : https://storybrand.com/
- Before & After Grid (Ryan Deiss)
- Strategic Narrative (Andy Raskin)

**Psychology & Conversion** :
- Choice Architecture : https://en.wikipedia.org/wiki/Choice_architecture
- Progressive Disclosure : https://www.nngroup.com/articles/progressive-disclosure/
- Anchoring Effect : https://thedecisionlab.com/reference-guide/psychology/anchoring-bias

**Accessibility** :
- WCAG 2.1 Guidelines : https://www.w3.org/WAI/WCAG21/quickref/
- Contrast Checker : https://webaim.org/resources/contrastchecker/
- prefers-reduced-motion : https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

### Awwwards Sites Analysés

- Igloo Inc : https://www.awwwards.com/sites/igloo-inc (7.92/10, Site de l'Année 2024)
- Kriss.ai : https://www.awwwards.com/sites/kriss-ai (7.45/10)
- Zentry : https://www.awwwards.com/sites/zentry (7.67/10)
- Active Theory V6 : https://www.awwwards.com/sites/active-theory-v6 (7.95/10)
- Inkfish : https://www.awwwards.com/sites/inkfish (7.53/10)
- Shopify Plus : https://www.awwwards.com/sites/shopify-plus (7.24/10)

### Sites Concurrents Performants

- Flowmondo : https://www.flowmondo.com/n8n-experts (structure pathways excellente)
- MQLFlow : https://mqlflow.com/marketing-automation-agency (transparence tarifaire)
- Bitovi : https://www.bitovi.com/n8n-automation-consulting (offre gratuite proéminente)
- Fruition Services : https://www.fruitionservices.io/partnerships/n8n-integration-partner (social proof massive)
- B2B Streamlined : https://b2bstreamlined.com/workflow-automation (empathie radicale)

---

## OTHER CONSIDERATIONS:

### Gotchas Techniques (IA assistants missent souvent)

**Performance** :
- Lazy loading images CRITIQUE sur landing page riche en visuels
- Code splitting par route Next.js
- Preload critical fonts (Inter)
- Defer non-critical scripts (analytics, Calendly si utilisé)
- Test sur vrais devices low-powered, pas seulement browser DevTools

**Animations** :
- TOUJOURS check `matchMedia('(prefers-reduced-motion: reduce)')` avant animations avancées
- Framer Motion respecte automatiquement, mais GSAP nécessite check manuel
- Ne jamais relayer sur animation pour transmettre info essentielle (accessibilité)

**Forms** :
- Validation email business : rejeter explicitement @gmail.com, @yahoo.com, @hotmail.com, @outlook.com
- Message erreur utile : "Merci d'utiliser votre email professionnel"
- Phone number formatting : international, optionnel
- GDPR consent : checkbox opt-in (JAMAIS pre-checked), link vers privacy policy

**Calculateur ROI** :
- Debounce inputs (300ms) pour éviter recalculs constants
- Validation : nombres positifs uniquement
- Formatting : commas pour milliers, symbole €
- Mobile : simplifier si nécessaire, garder utilisable sur petits écrans

**Progressive Disclosure (Pathways expandables)** :
- Pas de flash of unstyled content lors du expand
- Smooth height transition (pas instant)
- Icon rotation (chevron) pour indiquer état open/closed
- Accessible clavier : Enter/Space pour toggle
- ARIA : aria-expanded, aria-controls

### Pièges Design à Éviter Absolument

**Photos** :
- ❌ Stock photos génériques (équipe diverse pointant laptop en souriant)
- ✅ Vraies photos équipe Sablia, bureau, workshops clients (avec permission)
- Si stock nécessaire : choisir images unusual, pas clichés

**Gradients** :
- ❌ Overuse, rainbow gradients, gradients sur texte
- ✅ Subtil, monochromatic/analogous, hero sections uniquement

**Navigation** :
- ❌ Plus de 7 items menu, labels vagues ("Solutions"), hamburger sur desktop
- ✅ 6 items max, labels clairs, navigation complète desktop

**Value Proposition** :
- ❌ Visiteur ne comprenant pas ce que vous faites en 10 secondes
- ✅ Headline énonce : ce que vous faites, pour qui, bénéfice clé

**Emojis** :
- ❌ Overuse (74% professionnels 45+ voient comme unprofessional)
- ✅ Maximum 2-3 par page, universels uniquement (✓ ✗ 📊 📈 💡)
- ❌ Jamais dans navigation, headings principaux, CTAs critiques

### Données Secteur à Intégrer

**Conversion Benchmarks** :
- Landing pages performantes B2B : 14.9% (vs médiane 7.84%)
- Sites avec pricing transparent : +20% conversions qualifiées
- Progressive disclosure : -40% paralysie décisionnelle
- Testimonials avec photos : +30% trust vs anonymes

**Comportement Utilisateurs** :
- 88% utilisateurs ne reviendront pas après mauvaise UX
- 53% visiteurs mobiles abandonnent si site charge > 3 secondes
- 70% acheteurs B2B abandonnent face opacité tarifaire
- 68% acheteurs B2B préfèrent rechercher indépendamment online

**Psychologie Prix** :
- Anchoring : voir prix premium d'abord rend options mid-tier raisonnables
- Center-stage effect : 70% choisissent option du milieu (3 choix présentés)
- Decoy effect : option-leurre fait exploser ventes option cible

### Tests Essentiels Avant Lancement

**Performance** :
- Lighthouse score : 90+ sur toutes métriques
- Test vrais devices : iPhone SE, Samsung Galaxy A, Pixel
- Test connexions lentes : Throttle 3G
- Bundle analysis : vérifier aucune lib inutile

**Accessibilité** :
- Test keyboard navigation complète
- Test screen reader (NVDA ou JAWS)
- Test avec motion réduite activée
- Contrast ratios tous textes

**Conversion** :
- Tous CTAs cliquables et fonctionnels
- Forms submittent correctement
- Calculateur ROI calcule juste
- Emails notification arrivent
- Analytics tracking fonctionne

**Cross-browser** :
- Chrome, Firefox, Safari, Edge
- iOS Safari (bugs layout spécifiques)
- Tablets (souvent oubliés)

### Timeline Réaliste

**Semaine 1-2** : Design system + composants de base
- Palette couleurs, typographie, espacement dans Tailwind config
- Components UI : Button, Card, Input, Form
- Layout grille 12 colonnes
- Navigation header + footer

**Semaine 3-4** : Sections principales + contenu
- Hero section avec gradient + CTAs
- Section problème + solution
- Processus 3 étapes
- Grid 3 pathways avec progressive disclosure

**Semaine 5-6** : Grille tarifaire + éléments interactifs
- Pricing cards détaillées
- Calculateur ROI fonctionnel
- Testimonials + case studies
- FAQ

**Semaine 7-8** : Animations + optimisations
- Framer Motion scroll animations
- GSAP animations avancées (si nécessaire)
- Image optimization
- Performance tuning
- Accessibility audit

**Semaine 9** : Tests + corrections
- Tests devices
- Accessibility
- Performance
- Cross-browser
- User testing (5 personnes minimum)

**Semaine 10** : Launch + monitoring
- Déploiement
- Analytics setup
- A/B tests setup
- Monitoring conversion rates

### KPIs Post-Launch

**Conversion Rates** :
- TOFU : Downloads guides, quiz complétions
- MOFU : Audit bookings, ROI calculator submissions
- BOFU : Demo bookings, projet requests
- Target global : 10-15% (vs médiane 7.84%)

**Engagement** :
- Temps moyen sur page : > 2 minutes
- Bounce rate : < 40%
- Pages par session : > 3
- Scroll depth : > 70% atteignent grille tarifaire

**Performance** :
- LCP : < 2.5s
- FID : < 100ms
- CLS : < 0.1
- Page load : < 3s (mobile)

### Différenciateurs Sablia à Marteler

Sur CHAQUE page/section, rappeler au moins 1 de ces 3 piliers :

1. **Formation d'abord** :
   - "Nous formons vos équipes AVANT d'automatiser"
   - "Votre équipe possède la solution, pas nous"
   - "Autonomie garantie en 30 jours"

2. **Stack souverain** :
   - "n8n open-source = zéro vendor lock-in"
   - "Vos données restent en Europe, 100% RGPD"
   - "Coûts prévisibles, scaling illimité"

3. **ROI mesurable** :
   - "15h économisées par semaine dès le 1er mois"
   - "ROI visible sous 30 jours, pas 6 mois"
   - "Payback < 4 mois sur projet typique"

Ces messages doivent être déclinés dans headlines, subheads, CTAs, testimonials, FAQ.

---

## 🚧 ISOLATION DU PROJET - RÈGLES CRITIQUES

### Checklist d'Isolation Obligatoire

**Avant de commencer l'implémentation, vérifier** :

✅ **Structure des fichiers** :
- [ ] Nouvelle page créée : `client/src/pages/LandingV2.tsx`
- [ ] Dossier composants créé : `client/src/components/v2/`
- [ ] Route ajoutée pour `/landingv2` dans le router principal
- [ ] Aucune modification dans `client/src/pages/Home.tsx`

✅ **Composants** :
- [ ] Tous les nouveaux composants sont dans `client/src/components/v2/`
- [ ] Les imports pointent vers `@/components/v2/...` pas `@/components/ui/...`
- [ ] Si réutilisation de composants existants, imports explicites depuis `@/components/ui/`
- [ ] Aucun fichier dans `client/src/components/ui/` n'a été modifié

✅ **Styles** :
- [ ] Nouvelles couleurs ajoutées dans `tailwind.config.ts` avec préfixe `v2-`
- [ ] Exemple : `v2-navy: '#0A2463'`, `v2-electric: '#3E92CC'`, `v2-cyan: '#52D1DC'`
- [ ] Les couleurs actuelles restent intactes
- [ ] Classes Tailwind utilisent les nouvelles couleurs : `bg-v2-navy`, `text-v2-electric`

✅ **Routing** :
- [ ] Route `/landingv2` accessible
- [ ] Route `/` toujours fonctionnelle avec page actuelle
- [ ] Lien de navigation temporaire ajouté pour basculer entre versions
- [ ] Aucun redirect automatique de `/` vers `/landingv2`

✅ **Assets** :
- [ ] Nouvelles images/assets dans dossier séparé (optionnel) : `public/v2/`
- [ ] Ou bien nommées avec préfixe v2- pour éviter confusion
- [ ] Pas de remplacement d'assets existants

### Développement Parallèle - Workflow Recommandé

**Phase 1 : Setup (Semaine 1)**
1. Créer la structure de dossiers v2
2. Ajouter les couleurs au tailwind.config.ts
3. Créer la page LandingV2.tsx vide avec structure de base
4. Ajouter la route `/landingv2`
5. Vérifier que `/` fonctionne toujours normalement
6. **Commit** : "Setup structure LandingV2 isolée"

**Phase 2 : Composants de base (Semaine 1-2)**
1. Créer les composants v2 de base :
   - `v2/Button.tsx` (variants spécifiques v2)
   - `v2/Card.tsx` (style Swiss design)
   - `v2/Container.tsx` (grid 12 colonnes)
2. Tester chaque composant en isolation
3. **Commit** : "Add v2 base components"

**Phase 3 : Sections par sections (Semaines 3-8)**
1. Implémenter une section à la fois dans LandingV2.tsx
2. Tester la section sur `/landingv2`
3. Comparer visuellement avec version actuelle
4. **Commit après chaque section** : "Add Hero section v2", "Add Pricing Pathways v2", etc.

**Phase 4 : Optimisations (Semaine 9)**
1. Animations Framer Motion
2. Performance tuning
3. Accessibility audit
4. **Commit** : "Optimize LandingV2 performance & a11y"

**Phase 5 : Testing & Comparaison (Semaine 10)**
1. Tests côte à côte `/` vs `/landingv2`
2. User testing
3. Analytics comparative
4. Décision : rollout progressif ou switch complet

### Migration Finale (Optionnelle)

**Si LandingV2 performe mieux** :

**Option A : Switch complet**
1. Backup de la version actuelle
2. Remplacer `pages/Home.tsx` par le contenu de `pages/LandingV2.tsx`
3. Merger composants v2 dans ui si pertinent
4. Nettoyer les fichiers obsolètes

**Option B : Rollout progressif**
1. Router basé sur feature flag ou cookie
2. 10% trafic → v2
3. 50% trafic → v2
4. 100% trafic → v2
5. Puis switch complet

**Option C : Garder les deux**
1. `/` = version actuelle (pour clients existants)
2. `/landingv2` = nouvelle version (pour acquisition)
3. Renommer `/landingv2` en `/new` ou autre URL marketing

### Checklist Pre-Merge (Si switch complet)

Avant de merger v2 vers production :

- [ ] Tous les liens internes pointent correctement
- [ ] Formulaires soumettent aux bons endpoints
- [ ] Analytics tracking configuré
- [ ] SEO meta tags à jour
- [ ] Sitemap.xml mis à jour
- [ ] Redirects configurés si URLs changent
- [ ] Tests de performance validés
- [ ] Tests accessibilité passés
- [ ] Tests cross-browser OK
- [ ] Tests mobile devices OK
- [ ] Backup de la version actuelle créé
- [ ] Plan de rollback défini

### Commandes de Vérification

**Pendant le développement, vérifier régulièrement** :

```bash
# Vérifier que la version actuelle fonctionne toujours
npm run dev
# Visiter http://localhost:5000/

# Vérifier la nouvelle version
# Visiter http://localhost:5000/landingv2

# Type checking (aucune erreur introduite)
npm run check

# Build (les deux versions buildent correctement)
npm run build

# Tests (si existants)
npm test
```

**Comparer les performances** :

```bash
# Lighthouse pour la version actuelle
lighthouse http://localhost:5000/ --view

# Lighthouse pour la v2
lighthouse http://localhost:5000/landingv2 --view

# Comparer les scores
```

### Communication avec les Stakeholders

**Pendant le développement** :
- Partager régulièrement `/landingv2` pour feedback
- Expliquer que `/` reste la version live
- Montrer comparaisons visuelles

**Avant le switch** :
- Présenter métriques comparatives (performance, engagement)
- Proposer plan de rollout
- Définir critères de succès

---

## 📝 NOTES FINALES POUR L'IA

**Lors de l'exécution du PRP, tu DOIS** :

1. ⚠️ **TOUJOURS vérifier** que tu travailles dans les bons dossiers (`v2/`, `LandingV2.tsx`)
2. ⚠️ **JAMAIS modifier** les fichiers existants dans `pages/Home.tsx` ou `components/ui/`
3. ⚠️ **TOUJOURS préfixer** les nouvelles couleurs Tailwind avec `v2-`
4. ⚠️ **CRÉER la route** `/landingv2` dans le router sans toucher à la route `/`
5. ⚠️ **TESTER régulièrement** que `/` fonctionne toujours
6. ⚠️ **COMMITTER souvent** avec messages clairs ("Add v2 Hero section", pas "Update")

**Si tu détectes un conflit potentiel** :
- STOP et demande confirmation
- Explique le conflit
- Propose une solution d'isolation

**Si tu dois réutiliser un composant existant** :
- Import explicite : `import { Button } from '@/components/ui/Button'`
- Si le style ne correspond pas, crée un variant v2 au lieu de modifier l'original
- Documente pourquoi tu réutilises vs. pourquoi tu crées nouveau

**Validation continue** :
- Après chaque section implémentée, vérifier `/` toujours OK
- Build le projet régulièrement (`npm run build`)
- Type checking (`npm run check`)

Cette approche garantit une refonte sans risque avec comparaison facile et rollback instantané si nécessaire.
