# 🚀 Guide de Migration - Replit vers GitHub/Vercel

Ce guide vous accompagne pour migrer votre projet Sablia de Replit vers un environnement de développement local avec déploiement sur Vercel.

## ✅ Préparatifs (Déjà fait)

Les fichiers suivants ont été créés/modifiés automatiquement :
- ✅ `.gitignore` - Fichiers à ignorer par Git
- ✅ `.env.example` - Template des variables d'environnement
- ✅ `README.md` - Documentation du projet
- ✅ `vercel.json` - Configuration de déploiement Vercel
- ✅ `.vercelignore` - Fichiers à ignorer lors du déploiement
- ✅ Suppression des packages Replit spécifiques
- ✅ Application du thème sombre par défaut

## 🔧 Étape 1 : Correction manuelle nécessaire

**IMPORTANT** : Avant de continuer, vous devez modifier le fichier `vite.config.ts` :

```typescript
// Remplacez le contenu actuel par :
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

## 💻 Étape 2 : Setup local (Sur votre PC)

### 2.1 Prérequis
- Node.js 18+ installé
- Git installé
- VS Code ou votre éditeur préféré

### 2.2 Récupération du code
```bash
# Dans votre dossier projets
cd C:\Users\pc\Documents\Projets

# Cloner le repository
git clone https://github.com/BriGadja/sablia-site.git

# Aller dans le dossier
cd sablia-site

# Installer les dépendances
npm install
```

### 2.3 Configuration de l'environnement
```bash
# Copier le template d'environnement
copy .env.example .env

# Éditer le fichier .env avec vos vraies valeurs
notepad .env
```

## 🗄️ Étape 3 : Configuration de la base de données

### 3.1 Base de données locale (Option recommandée pour le développement)
```bash
# Installer PostgreSQL localement ou utiliser un service cloud
# Puis mettre à jour votre .env avec l'URL de connexion

# Pousser le schéma vers la base
npm run db:push
```

### 3.2 Base de données cloud (Neon, Supabase, etc.)
1. Créer une base PostgreSQL sur Neon/Supabase
2. Copier l'URL de connexion dans votre `.env`
3. Exécuter `npm run db:push`

## 🚀 Étape 4 : Initialisation Git et GitHub

### 4.1 Initialiser Git
```bash
# Dans le dossier sablia-site
git init
git add .
git commit -m "Initial commit"
```

### 4.2 Lier à GitHub
```bash
git remote add origin https://github.com/BriGadja/sablia-site.git
git branch -M main
git push -u origin main
```

## ⚡ Étape 5 : Déploiement sur Vercel

### 5.1 Connexion du repository
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec votre compte GitHub
3. Cliquer sur "New Project"
4. Sélectionner votre repository `sablia-site`
5. Vercel détectera automatiquement la configuration

### 5.2 Variables d'environnement Vercel
Dans les paramètres du projet Vercel, ajouter :
- `DATABASE_URL` : URL de votre base PostgreSQL
- `NODE_ENV` : `production`

### 5.3 Configuration domaine (si nécessaire)
1. Dans Vercel > Settings > Domains
2. Ajouter votre domaine personnalisé
3. Configurer les redirections DNS

## 🌐 Étape 6 : Configuration DNS/OVH

### 6.1 Configuration DNS
Si vous utilisez OVH pour votre domaine :
1. Aller dans l'espace client OVH
2. Section "Domaines" > Votre domaine > "Zone DNS"
3. Ajouter/modifier les enregistrements :
   - Type `A` : Pointer vers l'IP de Vercel
   - Type `CNAME` : `www` vers votre domaine Vercel (ex: `sablia-site.vercel.app`)

### 6.2 Certificat SSL
- Vercel gère automatiquement les certificats SSL
- Aucune configuration supplémentaire nécessaire

## 🔄 Étape 7 : Workflow de développement

### 7.1 Développement local
```bash
# Lancer le serveur de développement
npm run dev

# L'application sera accessible sur http://localhost:5000
```

### 7.2 Déploiement
```bash
# Après vos modifications
git add .
git commit -m "Description des changements"
git push origin main

# Vercel déploiera automatiquement
```

## 📋 Checklist finale

- [ ] Fichier `vite.config.ts` modifié manuellement
- [ ] Code récupéré localement
- [ ] Base de données configurée
- [ ] Variables d'environnement définies
- [ ] Code poussé sur GitHub
- [ ] Projet déployé sur Vercel
- [ ] Domaine configuré (si applicable)
- [ ] Tests de fonctionnement

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev          # Lancer le serveur de développement
npm run build        # Build pour production
npm run start        # Lancer en production
npm run check        # Vérification TypeScript
npm run db:push      # Mettre à jour le schéma DB

# Git
git status           # Voir les changements
git add .            # Ajouter tous les fichiers
git commit -m "msg"  # Commit avec message
git push             # Pousser vers GitHub
```

## 🆘 Dépannage

### Erreur de base de données
- Vérifier l'URL dans `.env`
- Exécuter `npm run db:push`

### Erreur de build
- Vérifier que `vite.config.ts` a été modifié
- Exécuter `npm install`

### Problème de déploiement
- Vérifier les variables d'environnement Vercel
- Consulter les logs de déploiement

---

🎉 **Félicitations !** Votre site est maintenant prêt pour le développement local et le déploiement automatique !