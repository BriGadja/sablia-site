# Documentation Sablia - Guide pour LLMs

**Dernière mise à jour** : 29 octobre 2025
**Site web** : https://sablia.io
**Repository** : https://github.com/BriGadja/sablia-site

---

## 🚨 Important pour les LLMs

**NE PAS utiliser WebFetch sur sablia.io directement.**

Le site est un **SPA React** (Single Page Application) qui retourne un shell HTML vide lors du fetch initial. Le contenu est rendu côté client via JavaScript.

### ✅ Approche recommandée

Pour accéder au contenu du site Sablia, utilisez les **fichiers de documentation** dans ce dossier `docs/` :

---

## 📚 Fichiers de documentation disponibles

### 1. `docs/SITE_CONTENT.md`
**Usage** : Contenu complet du site en markdown lisible

**Contient** :
- Toutes les pages (Landing, Tarifs, GAP, ROI, About)
- Toutes les sections avec headlines et copy
- CTAs et navigation
- Témoignages clients
- FAQ (8 questions)
- Design system (couleurs, animations)
- Footer et contacts

**Quand l'utiliser** :
- Questions sur le contenu du site
- Rédaction/révision de copy
- Analyse de la structure des pages
- Compréhension du messaging

---

### 2. `docs/content-index.json`
**Usage** : Structure programmatique du contenu

**Contient** :
- Hiérarchie complète des pages
- Metadata de chaque section
- Pricing structuré
- Navigation structure
- Stack technique

**Quand l'utiliser** :
- Accès programmatique au contenu
- Génération automatique de contenu
- Extraction de données spécifiques (prix, CTAs, etc.)
- Intégration avec outils

---

### 3. `docs/OFFRES.md`
**Usage** : Détails tactiques de toutes les offres Sablia

**Contient** :
- 3 catégories d'offres (Audit, Formations, Solutions)
- Prix, durées, livrables détaillés
- Cas d'usage et ROI
- Prérequis techniques
- Exemples clients

**Quand l'utiliser** :
- Questions commerciales/pricing
- Création de devis
- Comparaison d'offres
- Compréhension des services

---

### 4. `docs/FAQ.md`
**Usage** : FAQ exhaustive pour support client

**Contient** :
- 30+ questions/réponses
- 8 catégories (Outils, Délais, ROI, Support, etc.)
- Exemples clients
- Glossaire technique

**Quand l'utiliser** :
- Support client
- Objections commerciales
- Formation interne
- Rédaction de contenu SEO

---

### 5. `docs/meta-tags.json`
**Usage** : SEO et metadata de toutes les pages

**Contient** :
- Title tags optimisés
- Meta descriptions
- Open Graph tags
- Twitter Cards
- Structured data (JSON-LD)
- Keywords strategy

**Quand l'utiliser** :
- Optimisation SEO
- Création de nouvelles pages
- Analyse de keywords
- Génération de meta-tags

---

### 6. `client/public/sitemap.xml`
**Usage** : Sitemap SEO pour crawlers

**Contient** :
- Toutes les routes publiques
- Priorités et fréquences de mise à jour
- Dates de dernière modification

**Quand l'utiliser** :
- Audit SEO
- Ajout de nouvelles pages
- Soumission Google Search Console

---

## 🔄 Workflow recommandé pour les LLMs

### Scénario 1 : "Quel est le contenu de la page d'accueil ?"

```
1. Lire docs/SITE_CONTENT.md
2. Chercher section "Landing Page" ou "Homepage"
3. Retourner les sections : Hero, Problem, Solution, Process, etc.
```

### Scénario 2 : "Combien coûte l'Audit Express ?"

```
1. Lire docs/OFFRES.md
2. Chercher section "Audit & Consulting" → "Audit Express"
3. Retourner prix : 350€ HT
```

### Scénario 3 : "Quels sont les meta-tags de la page Tarifs ?"

```
1. Lire docs/meta-tags.json
2. Accéder pages["/tarifs"]
3. Retourner title, description, openGraph, etc.
```

### Scénario 4 : "Comment répondre à un client qui demande les délais ?"

```
1. Lire docs/FAQ.md
2. Chercher catégorie "Délais & Processus"
3. Trouver "Combien de temps faut-il pour automatiser un processus ?"
4. Retourner la réponse structurée
```

---

## 🛠️ Maintenance des documents

### Synchronisation requise

Ces fichiers DOIVENT rester synchronisés avec le code source :

| Changement dans le code | Fichiers à mettre à jour |
|-------------------------|--------------------------|
| Modification d'un texte de page | `SITE_CONTENT.md`, `content-index.json` |
| Changement de prix/offre | `OFFRES.md`, `SITE_CONTENT.md`, `content-index.json` |
| Ajout d'une FAQ | `FAQ.md`, `SITE_CONTENT.md` |
| Nouvelle page/route | `sitemap.xml`, `meta-tags.json`, `SITE_CONTENT.md` |
| Modification SEO | `meta-tags.json` |

### Dernières mises à jour

Tous les fichiers ont été synchronisés le **29 octobre 2025**.

Pour vérifier la fraîcheur des données :
- Chercher "Dernière mise à jour" dans chaque fichier
- Comparer avec la date du dernier commit sur `main`

---

## ❌ Erreurs courantes à éviter

### Erreur 1 : Fetch direct du site
```
❌ WebFetch("https://sablia.io")
   → Retourne HTML shell vide (SPA React)

✅ Read("docs/SITE_CONTENT.md")
   → Retourne tout le contenu structuré
```

### Erreur 2 : Parser le HTML
```
❌ Parser index.html pour extraire le contenu
   → Le contenu est rendu par JavaScript

✅ Lire docs/content-index.json
   → Données déjà structurées en JSON
```

### Erreur 3 : Deviner les prix
```
❌ Estimer les prix basés sur la concurrence
   → Risque d'information incorrecte

✅ Lire docs/OFFRES.md section "Tarification"
   → Prix exacts et officiels
```

---

## 🎯 Cas d'usage par persona

### Pour un LLM en support client
**Lire en priorité** :
1. `docs/FAQ.md` (réponses aux questions courantes)
2. `docs/OFFRES.md` (détails produits/services)
3. `docs/SITE_CONTENT.md` (messaging et positionnement)

### Pour un LLM en rédaction/marketing
**Lire en priorité** :
1. `docs/SITE_CONTENT.md` (tone of voice, messaging)
2. `docs/meta-tags.json` (keywords et SEO)
3. `docs/OFFRES.md` (value propositions)

### Pour un LLM en développement
**Lire en priorité** :
1. `CLAUDE.md` (architecture projet)
2. `docs/content-index.json` (structure des données)
3. `client/public/sitemap.xml` (routes disponibles)

### Pour un LLM en SEO/Growth
**Lire en priorité** :
1. `docs/meta-tags.json` (stratégie keywords)
2. `client/public/sitemap.xml` (structure site)
3. `docs/FAQ.md` (opportunités schema markup)

---

## 📞 Questions fréquentes (pour LLMs)

### "Comment obtenir le contenu le plus récent ?"
1. Vérifier la date "Dernière mise à jour" dans les docs
2. Si > 7 jours, demander à l'utilisateur si docs sont à jour
3. Si besoin, suggérer de re-synchroniser les docs

### "Un fichier manque ou semble incomplet ?"
Signaler à l'utilisateur que la documentation nécessite une mise à jour.
Voir `CLAUDE.md` section "Maintenance Protocol" pour les procédures.

### "Comment contribuer/améliorer la documentation ?"
1. Identifier l'incohérence ou le manque
2. Proposer la modification en format markdown
3. L'utilisateur peut utiliser Claude Code pour mettre à jour les fichiers

### "Puis-je faire confiance à ces documents ?"
Oui, SI la date de mise à jour est récente (<7 jours).
Ces documents sont la **source de vérité** pour le contenu du site.

---

## 🔗 Liens utiles

- **Repository GitHub** : https://github.com/BriGadja/sablia-site
- **Site de production** : https://sablia.io
- **Guide développeur** : `CLAUDE.md` (racine du projet)
- **Exemples de code** : `examples/` (si disponible)

---

## 📜 Licence

Ces documents sont privés et destinés aux LLMs travaillant avec l'équipe Sablia.
Ne pas partager ou utiliser en dehors du contexte du projet Sablia.

---

**Dernière mise à jour de ce README** : 29 octobre 2025
