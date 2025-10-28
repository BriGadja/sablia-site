# Gradient Background Reference - LandingV3

## Vue d'ensemble

LandingV3 utilise un **gradient vertical continu** qui progresse naturellement du haut vers le bas de la page, créant une métaphore visuelle "ciel → nuit → aube". Ce gradient ne doit **JAMAIS être interrompu** par des backgrounds solides sur les sections individuelles.

## Implémentation Technique

### Gradient Principal (LandingV3.tsx)

Le gradient est défini directement sur le wrapper principal de `LandingV3.tsx` via un style inline:

```typescript
<motion.div
  className="min-h-screen"
  style={{
    background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
  }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.4 }}
>
```

### Progression des Couleurs

| Position | Couleur | Description | Zone de la page |
|----------|---------|-------------|-----------------|
| 0% | #52D1DC | Cyan clair - ciel bleu jour | Hero (haut) |
| 15% | #3E92CC | Electric blue | Hero (bas) / Testimonials |
| 35% | #0A2463 | Navy - début de nuit | Testimonials / Logos |
| 50% | #0A2463 | Navy - pleine nuit | Logos / Problem |
| 65% | #2D3142 | Charcoal - transition | Problem (bas) |
| 80% | #3d2f1f | Brun foncé - aube | Solution (début) |
| 95% | #4a3621 | Brun moyen foncé - lever de soleil | Solution (milieu) |
| 100% | #3d2f1f | Brun foncé - fin | Solution (bas) / Footer |

### Métaphore Visuelle

Le gradient raconte une histoire:
1. **Ciel bleu lumineux (0-15%)**: Jour, clarté, départ du parcours
2. **Transition vers la nuit (15-50%)**: Approfondissement, les défis apparaissent
3. **Nuit profonde (35-65%)**: Les problématiques, le point le plus sombre
4. **Aube et lever de soleil (65-100%)**: Les solutions, l'espoir, un nouveau départ

## Règles Critiques

### ✅ À FAIRE

1. **Sections transparentes**: Toutes les sections doivent avoir des backgrounds transparents ou semi-transparents pour laisser le gradient visible
2. **Texte blanc**: Utiliser `text-v2-white` ou `text-v2-off-white` pour assurer la lisibilité sur toutes les zones du gradient
3. **Glassmorphism optionnel**: Utiliser `bg-v2-navy/10` ou `bg-v2-charcoal/20` pour des effets de glassmorphism légers si nécessaire
4. **Cohérence**: Le gradient doit être fluide et continu du haut en bas de la page

### ❌ À NE PAS FAIRE

1. **NE JAMAIS** utiliser de background solide (`bg-v2-navy`, `bg-v2-electric`, etc.) sur les sections principales
2. **NE JAMAIS** utiliser de gradient local qui entrerait en conflit avec le gradient principal
3. **NE JAMAIS** utiliser de texte foncé qui deviendrait illisible sur les zones foncées du gradient
4. **NE JAMAIS** créer de "cassures" visuelles qui interrompraient la progression du gradient

## Exemples d'Implémentation

### Section avec Background Transparent (Correct ✅)

```typescript
export default function MySection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Le gradient de LandingV3 transparaît naturellement */}
      <div className="container mx-auto px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-v2-white mb-4">
          Mon Titre
        </h2>
        <p className="text-v2-off-white/80">
          Mon contenu
        </p>
      </div>
    </section>
  );
}
```

### Section avec Glassmorphism Léger (Correct ✅)

```typescript
<section className="py-24 relative overflow-hidden">
  <div className="container mx-auto px-6 lg:px-8">
    <div className="bg-v2-charcoal/20 backdrop-blur-md rounded-xl p-8">
      <h3 className="text-2xl font-bold text-v2-white mb-4">
        Card Title
      </h3>
    </div>
  </div>
</section>
```

### Section avec Background Solide (INCORRECT ❌)

```typescript
// ❌ MAUVAIS EXEMPLE - Ne pas faire
<section className="py-24 bg-v2-navy relative overflow-hidden">
  {/* Le bg-v2-navy cache le gradient principal */}
  <div className="container mx-auto px-6 lg:px-8">
    <h2 className="text-5xl font-bold text-v2-white mb-4">
      Mon Titre
    </h2>
  </div>
</section>
```

### Section avec Gradient Local (INCORRECT ❌)

```typescript
// ❌ MAUVAIS EXEMPLE - Ne pas faire
<section className="py-24 bg-gradient-to-b from-v2-navy to-v2-charcoal">
  {/* Le gradient local entre en conflit avec le gradient principal */}
  <div className="container mx-auto px-6 lg:px-8">
    <h2 className="text-5xl font-bold text-v2-white mb-4">
      Mon Titre
    </h2>
  </div>
</section>
```

## Validation Visuelle

Lors de l'implémentation de nouvelles sections, **toujours valider visuellement** avec Playwright MCP:

```bash
# 1. Lancer le dev server
npm run dev

# 2. Naviguer vers la page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

# 3. Capturer des screenshots à différents points de scroll
# - Hero (haut)
# - Problem section (milieu)
# - Solution section (bas)

# 4. Vérifier que:
# - Le gradient progresse de manière fluide sans cassures
# - Le texte blanc est lisible partout
# - Aucune section ne cache le gradient avec un background solide
```

## Palette Complémentaire

Pour les éléments qui nécessitent des accents ou des highlights:

- **Accent primaire**: `text-v2-cyan` (#52D1DC) - pour les icônes, liens, CTAs
- **Accent secondaire**: `text-v2-electric` (#3E92CC) - pour les hover states
- **Texte principal**: `text-v2-white` (#FFFFFF) - titres, texte important
- **Texte secondaire**: `text-v2-off-white` (#F8F9FA) - descriptions, body text
- **Texte tertiaire**: `text-v2-off-white/80` - texte avec 80% opacité

## Historique

- **2025-10-27**: Création du gradient continu "ciel → nuit → aube"
- **2025-10-27**: Ajustement des tons finaux (#3d2f1f, #4a3621) pour garantir la lisibilité du texte blanc
- **2025-10-27**: Documentation et standardisation pour tous les PRPs futurs
