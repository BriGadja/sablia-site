# INITIAL - Refonte Landing Page Sablia v3 (From Scratch)

## Contexte du projet

Ce document définit les exigences pour une **refonte complète from scratch** de la landing page Sablia. Les tentatives précédentes ont échoué principalement à cause d'animations non fonctionnelles et d'un manque de cohérence visuelle. Cette fois, nous repartons de zéro avec une méthodologie rigoureuse basée sur des documents de référence validés et une inspiration claire.

**Objectif principal** : Créer une landing page digne des Awwwards qui convertit les décideurs B2B en leads qualifiés, en démontrant l'expertise technique de Sablia par l'implémentation même du site.

---

## FEATURE

### Vue d'ensemble

Développer une **landing page complètement nouvelle** (`client/src/pages/LandingV3.tsx`) inspirée de https://www.chatflowai.co/ avec les caractéristiques suivantes :

#### Effets visuels requis (inspirés de ChatflowAI)
1. **Système de particules** : Effet "étoiles dans le ciel" en background
   - Particules qui se déplacent lentement
   - Connexions subtiles entre particules proches
   - Interaction avec le curseur (attraction légère)

2. **Curseur lumineux personnalisé** :
   - Point lumineux qui suit le curseur
   - Halo diffus avec effet de traînée
   - Visible uniquement sur desktop (breakpoint lg+)

3. **Animations au scroll** :
   - Apparition progressive des sections avec fade-in + translate
   - Parallax subtil sur certains éléments
   - Stagger animations pour les listes/grilles d'items

4. **Typographie professionnelle** :
   - Police Inter (déjà dans le projet)
   - Hiérarchie claire : H1 72px, H2 48px, Body 16-18px
   - Line-height 1.5 pour readability optimale

5. **Formulaire de contact intelligent** :
   - Questions précises pour qualifier les leads
   - Validation en temps réel avec Zod
   - Design soigné avec micro-interactions

### Architecture technique

#### Structure de la page (sections obligatoires)

```tsx
<LandingV3>
  <CustomCursor />              {/* Curseur personnalisé */}
  <AnimatedParticles />         {/* Système de particules */}

  <Navigation />                {/* Nav sticky avec CTA */}

  <main>
    <HeroSection />             {/* Gradient + Proposition de valeur + CTA */}
    <LogosCloud />              {/* Social proof - logos clients */}
    <ProblemSection />          {/* 3 problèmes B2B identifiés */}
    <SolutionSection />         {/* La solution Sablia */}
    <ThreeStepProcess />        {/* Méthodologie en 3 étapes */}
    <TestimonialsSection />     {/* 5 témoignages clients avec carousel */}
    <ServicesGrid />            {/* Présentation des services */}
    <PricingSection />          {/* Grille tarifaire complète */}
    <CalculatorROI />           {/* Calculateur interactif */}
    <ContactFormSection />      {/* Formulaire intelligent */}
    <FaqSection />              {/* 8-10 questions essentielles */}
  </main>

  <Footer />
</LandingV3>
```

#### Contenus à intégrer (depuis documents fournis)

**Tarifs** (📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md) :
- Appel Découverte : GRATUIT (30 min)
- Audit Express : 350€ (nouveau service)
- Diagnostic IA PME : 4 500€ (ROI 50-150k€/an)
- Diagnostic IA ETI : 8-15k€ (ROI 300-800k€/an)
- Formations : 700€ (demi-j) à 3 300€ (3j)
- Workflow Simple : 2 500-5 000€
- Système Standard : 8-18k€
- Transformation Complète : 25-60k€
- Retainer : 1 500€/mois (Support) à 2 500€/mois (Stratégique)

**Témoignages** (Testimonials.md) :
1. **Hélène - GirlsGang** : Génération menus automatisée (1h → 30min pour toutes)
2. **Directeur anonyme** : Veille concurrentielle, vision 360° marché
3. **Yassine - Norloc** : Agent vocal + CRM, conversion améliorée
4. **Valentin - Stefano/Exotic** : Réactivation BDD, milliers contacts dormants
5. **Amir - BTP** : Gestion interventions, plus d'erreurs, efficacité max

**Principes design** (Design professionnel pour Sablia.md) :
- Minimalisme gradient + Swiss Design
- Palette : Navy Blue #0A2463, Electric Blue #3E92CC, Cyan #52D1DC
- Whitespace généreux (80px entre sections)
- Grille 12 colonnes avec alignement précis
- Maximum 0-2 emojis sur toute la page
- Animations GPU-accelerated uniquement (transform, opacity)
- Performance : < 3s chargement, 60fps animations

**Animations** (MIGRATION_GUIDE.md + ANIMATION_GUIDE.md) :
- Utiliser les composants existants : CustomCursor, AnimatedParticles, ScrollReveal
- Respecter prefers-reduced-motion
- Stagger delay pour grilles (index * 0.1s)
- Durées standards : 0.3-0.6s pour micro-interactions

---

## EXAMPLES

### Composants d'animation existants à réutiliser

Le projet contient déjà des composants d'animation professionnels dans `client/src/components/animations/` :

1. **CustomCursor.tsx** : Curseur personnalisé avec halo
   - Utilisation : `<CustomCursor />` au niveau root de la page
   - Configuration : couleur via classe Tailwind `bg-v2-cyan`

2. **AnimatedParticles.tsx** : Système de particules Canvas optimisé
   - Utilisation : `<AnimatedParticles />` en background fixed
   - Props : `particleCount`, `lineColor`, `particleColor`

3. **ScrollReveal.tsx** : Composants pour animations au scroll
   - `<ScrollReveal direction="up|down|left|right|fade|scale" delay={0.2}>`
   - `<ColorChangeText fromColor="#FFF" toColor="#52D1DC">`
   - `<ParallaxSection speed={0.5}>`
   - `<ScaleOnScroll>`

4. **MagneticElements.tsx** : Éléments magnétiques au survol
   - `<MagneticButton strength={0.3}>`
   - `<MagneticCard glassEffect={true}>`

5. **AnimatedText.tsx** : Effets de texte sophistiqués
   - `<GradientText animate={true}>`
   - `<TypewriterText text="..." speed={0.05}>`
   - `<FloatingText intensity={10}>`

### Patterns de code à suivre

**Pattern 1 : Section avec animations**
```tsx
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function MySection() {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <ScrollReveal direction="fade">
          <h2 className="text-5xl font-bold text-center mb-16">
            Titre Section
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <ScrollReveal
              key={index}
              direction="up"
              delay={index * 0.1}
            >
              <div className="p-6 rounded-xl bg-white shadow-lg">
                {/* Contenu */}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Pattern 2 : Hero avec gradient**
```tsx
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-v2-navy via-v2-electric-blue to-v2-navy" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-7xl font-bold text-white mb-6">
          Automatisez vos processus métier
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Réduisez vos coûts de 50 000€+/an avec l'IA et l'automatisation
        </p>
        <button className="px-8 py-4 bg-v2-cyan text-white rounded-lg text-lg font-semibold hover:scale-105 transition-transform">
          Diagnostic Gratuit 30min
        </button>
      </div>
    </section>
  );
}
```

**Pattern 3 : Carousel de témoignages**
```tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const testimonials = [/* array */];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-96">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {testimonials[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

**Pattern 4 : Formulaire avec validation Zod**
```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  company: z.string().min(2, "Entreprise requise"),
  employees: z.enum(["1-10", "10-50", "50-250", "250+"]),
  message: z.string().min(10, "Message trop court"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <input
          {...register("name")}
          className="w-full px-4 py-3 rounded-lg border"
          placeholder="Votre nom"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      {/* Autres champs */}
    </form>
  );
}
```

### Référence existante à étudier

**LandingV2.tsx actuel** : Ne PAS copier mais comprendre la structure
- Fichier : `client/src/pages/LandingV2.tsx`
- Composants V2 : `client/src/components/v2/*`
- Problèmes identifiés : animations non fonctionnelles, manque de cohérence

**Composant à réutiliser tel quel** :
- `Navigation.tsx` : Déjà bien fait, peut être réutilisé avec ajustements mineurs
- `Footer.tsx` : Réutilisable directement

---

## DOCUMENTATION

### Documentation des librairies

1. **Framer Motion** (animations React)
   - Docs officielles : https://www.framer.com/motion/
   - Guide animations : https://www.framer.com/motion/animation/
   - ScrollTrigger : https://www.framer.com/motion/scroll-animations/
   - Gestures : https://www.framer.com/motion/gestures/

2. **React Hook Form + Zod** (formulaires)
   - React Hook Form : https://react-hook-form.com/get-started
   - Zod integration : https://react-hook-form.com/get-started#SchemaValidation
   - Zod docs : https://zod.dev/

3. **Tailwind CSS** (styling)
   - Configuration : https://tailwindcss.com/docs/configuration
   - Animations : https://tailwindcss.com/docs/animation
   - Custom colors : https://tailwindcss.com/docs/customizing-colors

4. **Canvas API** (particules)
   - MDN Canvas : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
   - Performance tips : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

### Documents de référence du projet

**Obligatoires à lire et respecter** :

1. **Design professionnel pour Sablia.md** :
   - Palette de couleurs validée
   - Règles typographiques strictes
   - Principes Swiss Design + Gradient
   - Liste des pièges à éviter (emojis, buzzwords, etc.)
   - Stack technique recommandé

2. **📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md** :
   - Prix exact de chaque service
   - ROI attendu pour chaque offre
   - Exemples concrets d'utilisation
   - Messages clés et différenciateurs

3. **Testimonials.md** :
   - 5 témoignages clients complets
   - Versions longues et courtes
   - Projets et résultats concrets

4. **MIGRATION_GUIDE.md** :
   - Workflow Git et déploiement
   - Configuration Vercel
   - Variables d'environnement

5. **ANIMATION_GUIDE.md** :
   - Utilisation des composants animations
   - Best practices performance
   - Troubleshooting animations

### Inspiration design

**Site de référence principal** : https://www.chatflowai.co/
- Étudier : système de particules, curseur custom, animations scroll
- Analyser : hiérarchie typographique, espacement, palette
- Reproduire : feeling premium et moderne tout en restant B2B pro

**Sites Awwwards mentionnés dans le design guide** :
- Igloo Inc (7.92/10) : WebGL immersif, minimalisme, performance
- Kriss.ai (7.45/10) : Centré humain, narrative claire
- Zentry (7.67/10) : Motion design ADN, fonte custom
- Inkfish (7.53/10) : Minimalisme extrême, typographie forte

---

## OTHER CONSIDERATIONS

### Exigences de performance

**Vitaux Core Web Vitals** :
- LCP (Largest Contentful Paint) : < 2.5s
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1

**Budget performance** :
- JavaScript total : < 300kb
- CSS total : < 50kb
- Animations librairies : < 50kb (Framer Motion déjà inclus)
- Images : WebP, lazy loading, max 1920px width

**Optimisations obligatoires** :
- Code splitting par section
- Lazy loading des sections below-the-fold
- Preload des fonts (Inter déjà dans le projet)
- Image optimization via next/image ou équivalent

### Accessibilité (WCAG 2.1 AA minimum)

**Requis** :
- Contraste minimum 4.5:1 pour texte
- Navigation au clavier complète (Tab, Enter, Esc)
- Labels ARIA sur éléments interactifs
- Alt text sur toutes images
- Focus visible sur tous éléments interactifs

**Animations accessibles** :
- Respecter `prefers-reduced-motion` (déjà implémenté dans composants)
- Animations essentielles : fade simple, pas de mouvement complexe
- Jamais d'autoplay vidéo/audio
- Carousel : contrôles pause/play visibles

### Pièges à éviter absolument

**Contenu** :
- ❌ ZÉRO emoji dans CTAs, navigation, headings
- ❌ Maximum 0-2 emojis sur toute la page
- ❌ Pas de buzzwords creux : "synergy", "ecosystem", "paradigm shift"
- ❌ Éviter phrases IA : "delve into", "ever-evolving landscape", "game-changer"
- ✅ Langage spécifique, concret, chiffres précis

**Design** :
- ❌ Pas de gradients sur texte (lisibilité)
- ❌ Pas de glassmorphism excessif (tendance passagère)
- ❌ Maximum 4-5 couleurs total sur la page
- ❌ Maximum 3 familles de polices (Inter suffit)
- ✅ Whitespace généreux (80px entre sections)
- ✅ Grille 12 colonnes stricte

**Animations** :
- ❌ Ne JAMAIS animer width, height, top, left, margin, padding
- ❌ Animations > 1 seconde (trop longues)
- ✅ Animer UNIQUEMENT transform et opacity
- ✅ Durées 300-600ms pour micro-interactions
- ✅ Toujours vérifier prefers-reduced-motion

**Formulaires** :
- ❌ Pas de placeholder comme label
- ❌ Validation après submit uniquement (frustrant)
- ✅ Validation en temps réel après first blur
- ✅ Messages d'erreur clairs et actionnables
- ✅ Loading states pendant submission

### Stratégie de développement

**Phase 1 : Architecture et animations de base** (priorité max)
1. Créer `LandingV3.tsx` avec structure complète (sections vides)
2. Intégrer `CustomCursor` et `AnimatedParticles` au niveau root
3. Implémenter `HeroSection` avec gradient et animations
4. Tester animations scroll sur 2-3 sections test
5. **Validation Playwright** : Vérifier visuellement que TOUT fonctionne

**Phase 2 : Contenu et sections**
1. `LogosCloud` avec logos clients
2. `ProblemSection` + `SolutionSection` (contenu design guide)
3. `ThreeStepProcess` avec animations stagger
4. `TestimonialsSection` avec carousel auto (5 témoignages)
5. **Validation visuelle** après chaque section

**Phase 3 : Services et tarifs**
1. `ServicesGrid` (3-4 services phares)
2. `PricingSection` avec grille tarifaire complète
3. `CalculatorROI` interactif avec React Hook Form
4. **Test de conversion** : CTAs bien visibles ?

**Phase 4 : Contact et finalisation**
1. `ContactFormSection` avec questions intelligentes
2. `FaqSection` (8-10 questions depuis design guide)
3. Navigation sticky avec CTA toujours visible
4. Footer avec liens légaux, réseaux sociaux
5. **Tests E2E** : Formulaires, navigation, responsive

**Phase 5 : Polish et optimisation**
1. Optimisation images (compression, WebP)
2. Code splitting et lazy loading
3. Tests performance (Lighthouse 90+)
4. Tests accessibilité (axe DevTools 0 erreurs)
5. Tests cross-browser (Chrome, Firefox, Safari)
6. Tests mobile (iOS et Android réels)

### Tests et validation

**Validation visuelle Playwright (OBLIGATOIRE)** :
```bash
# Après chaque section développée
npm run dev
# Puis dans Claude :
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_snapshot()  # Vérifier structure
mcp__playwright__browser_take_screenshot({ filename: "section-x.png" })
```

**Checklist avant commit** :
- [ ] Animations fonctionnent (pas de stutter)
- [ ] Curseur custom visible desktop uniquement
- [ ] Particules animées en background
- [ ] Sections apparaissent au scroll
- [ ] Pas d'emojis dans CTAs/nav/headings
- [ ] Contraste texte >= 4.5:1
- [ ] Formulaires validés avec Zod
- [ ] Aucune erreur console
- [ ] Build passe sans warnings (`npm run build`)
- [ ] Mobile responsive testé

**Métriques de succès** :
- Lighthouse Performance : >= 90
- Lighthouse Accessibility : 100
- Lighthouse Best Practices : >= 95
- Temps de chargement : < 3s
- Animations 60fps constant
- 0 erreurs TypeScript (`npm run check`)

### Points d'attention spécifiques

**Formulaire de contact** :
- Questions qualifiantes : nom, email, entreprise, taille équipe, budget estimé, délai projet
- Conditional logic : Si budget < 5k€, proposer formation ; si > 25k€, mentionner accompagnement dédié
- Intégration Calendly pour prise RDV directe post-soumission

**Calculateur ROI** :
- Inputs : nombre employés, salaire moyen horaire, heures/semaine tâches répétitives
- Formule : (heures économisées * salaire horaire * 52 semaines) - coût automatisation
- Affichage : ROI % et économies annuelles en gros caractères
- CTA contextualisé selon résultat

**Navigation sticky** :
- Transparente en haut, devient opaque au scroll
- Logo left, liens center, CTA right
- Menu burger mobile < 768px
- Scroll spy : highlight section active

**Grille tarifaire** :
- 3 colonnes desktop : Starter / Growth / Enterprise
- Highlight colonne milieu (most popular)
- Afficher prix + ROI attendu
- CTA différent par colonne : "Commencer" / "Diagnostic gratuit" / "Contacter"

### Stack technique validé

**Frontend** (déjà en place) :
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS 3.4+
- Framer Motion 11.x
- React Hook Form + Zod

**Animations** (composants existants) :
- CustomCursor.tsx
- AnimatedParticles.tsx
- ScrollReveal.tsx
- MagneticElements.tsx
- AnimatedText.tsx

**Deployment** :
- Vercel (configuration dans vercel.json)
- Git workflow : direct push to main pour landing page (selon CLAUDE.md)

### Livrables attendus

**Fichiers à créer** :
1. `client/src/pages/LandingV3.tsx` (page principale)
2. `client/src/components/v3/HeroSection.tsx`
3. `client/src/components/v3/LogosCloud.tsx`
4. `client/src/components/v3/ProblemSection.tsx`
5. `client/src/components/v3/SolutionSection.tsx`
6. `client/src/components/v3/ThreeStepProcess.tsx`
7. `client/src/components/v3/TestimonialsSection.tsx`
8. `client/src/components/v3/ServicesGrid.tsx`
9. `client/src/components/v3/PricingSection.tsx`
10. `client/src/components/v3/CalculatorROI.tsx`
11. `client/src/components/v3/ContactFormSection.tsx`
12. `client/src/components/v3/FaqSection.tsx`

**Fichiers à modifier** :
- `client/src/App.tsx` : Ajouter route `/landingv3`
- `tailwind.config.js` : Vérifier couleurs v2 (navy, electric-blue, cyan)

**Documentation à créer** :
- `LandingV3_README.md` : Guide d'utilisation des composants v3
- Screenshots avant/après dans `refonte_graphique/screenshots/`

---

## CRITÈRES DE SUCCÈS

La refonte sera considérée comme réussie si :

1. **Animations fonctionnent** : Curseur custom visible, particules animées, sections apparaissent au scroll
2. **Design professionnel** : Respect strict des guidelines (palette, typographie, whitespace)
3. **Contenu complet** : Tous les tarifs et témoignages intégrés correctement
4. **Performance** : Lighthouse >= 90, 60fps animations, < 3s chargement
5. **Accessibilité** : WCAG AA, 0 erreurs axe DevTools
6. **Responsive** : Parfait sur mobile, tablette, desktop
7. **Conversion optimisée** : CTAs visibles, formulaires validés, ROI calculator fonctionnel
8. **Validation visuelle** : Playwright screenshots confirment conformité design

---

## NOTES POUR L'EXÉCUTION

**Ordre d'implémentation recommandé** :
1. Structure de page + animations de base (curseur, particules)
2. Hero + validation visuelle
3. Sections contenu (problem, solution, process) + validation
4. Témoignages carousel + validation
5. Services + tarifs + validation
6. Formulaire + ROI calculator + validation
7. FAQ + footer + validation finale
8. Optimisations performance
9. Tests accessibilité
10. Tests responsive complets

**À chaque étape** :
- Build pour vérifier (`npm run build`)
- Validation Playwright visuelle
- Commit avec message descriptif
- Screenshot pour documentation

**Communication avec l'utilisateur** :
- Montrer screenshots Playwright après chaque section majeure
- Demander validation avant de passer à la section suivante
- Proposer alternatives si quelque chose ne fonctionne pas
- Être transparent sur les difficultés rencontrées

---

## CONCLUSION

Ce document INITIAL fournit tous les éléments nécessaires pour générer un PRP (Product Requirements Prompt) complet qui guidera le développement d'une landing page Sablia digne des Awwwards. L'accent est mis sur :

1. **Animations fonctionnelles** : Composants existants testés + validation Playwright
2. **Design professionnel B2B** : Guidelines strictes du document de design
3. **Contenu marketing validé** : Tarifs et témoignages officiels
4. **Performance et accessibilité** : Standards 2025 non négociables
5. **Méthodologie rigoureuse** : Développement itératif avec validation visuelle constante

**Prochaine étape** : Exécuter `/generate-prp INITIAL_refonte_v3.md` pour créer le PRP détaillé.
