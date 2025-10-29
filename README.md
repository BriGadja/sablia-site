# Sablia - Automatisation Intelligente

Site web moderne de conseil en automatisation d'entreprise avec calculateur ROI, formulaires de génération de leads et présentation des services.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Base de données**: PostgreSQL + Drizzle ORM
- **Styling**: Tailwind CSS + Radix UI
- **Déploiement**: Vercel

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL (local ou distant)

### Configuration locale

1. **Cloner le projet**
   ```bash
   git clone https://github.com/BriGadja/sablia-site.git
   cd sablia-site
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   Puis modifier le fichier `.env` avec vos propres valeurs.

4. **Configuration de la base de données**
   ```bash
   # Pousser le schéma vers la base de données
   npm run db:push
   ```

5. **Lancer en développement**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:5000`

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run start` - Lance l'application en production
- `npm run check` - Vérification TypeScript
- `npm run db:push` - Pousse le schéma vers la base de données

## 🌐 Déploiement

### Vercel

1. Connecter votre repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel
3. Le déploiement se fera automatiquement

## 🏗️ Structure du projet

```
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages de l'application
│   │   ├── lib/         # Utilitaires et configuration
│   │   └── hooks/       # React hooks personnalisés
│   └── index.html
├── server/              # Backend Express
│   ├── routes.ts        # Routes API
│   ├── index.ts         # Point d'entrée serveur
│   └── vite.ts          # Configuration Vite
├── db/                  # Schéma base de données
│   └── schema.ts
└── migrations/          # Migrations de base de données
```

## 🔧 Configuration

### Variables d'environnement

- `DATABASE_URL` - URL de connexion PostgreSQL
- `NODE_ENV` - Environnement (development/production)

### Intégrations

- **Calendly**: Système de prise de rendez-vous
- **TSParticles**: Animations de fond

## 🎨 Fonctionnalités

- ✅ Calculateur ROI interactif
- ✅ Formulaires de génération de leads
- ✅ Design responsive et moderne
- ✅ Animations fluides
- ✅ Interface administrateur

## 📝 Licence

MIT

---
*Dernière mise à jour : Migration vers Vercel*