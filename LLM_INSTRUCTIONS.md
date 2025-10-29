# Instructions pour les LLMs

🤖 **Si vous êtes un LLM (Claude, GPT, etc.) travaillant sur ce projet** :

## ⚠️ Important : Ne pas fetch le site directement

Le site **sablia.io** est un SPA React. Si vous utilisez `WebFetch` ou des outils similaires, vous obtiendrez uniquement un shell HTML vide.

## ✅ Solution : Utilisez les fichiers de documentation

Toute l'information sur le site est disponible dans **`docs/`** :

```
docs/
├── README.md              ← COMMENCEZ ICI (guide complet pour LLMs)
├── SITE_CONTENT.md        ← Contenu complet du site
├── content-index.json     ← Structure programmatique
├── OFFRES.md              ← Détails des offres/pricing
├── FAQ.md                 ← FAQ exhaustive (30+ questions)
└── meta-tags.json         ← SEO et metadata
```

## 🚀 Quick Start

1. **Lisez d'abord** : `docs/README.md` (ce fichier explique tout)
2. **Pour le contenu du site** : `docs/SITE_CONTENT.md`
3. **Pour les questions commerciales** : `docs/OFFRES.md`
4. **Pour le support client** : `docs/FAQ.md`

## 📖 Documentation développeur

Pour l'architecture du projet, les conventions de code, et les workflows :
- Lisez `CLAUDE.md` (racine du projet)

---

**Pourquoi ces fichiers existent** : Les SPAs React ne sont pas accessibles via fetch simple. Ces documents permettent aux LLMs d'accéder au contenu sans avoir à exécuter JavaScript ou à utiliser un navigateur headless.

**Dernière synchronisation** : 29 octobre 2025
