---
name: product-v1
description: Frozen SKU definition for Sablia's single paid door-opener product, the Diagnostic Sablia. Feeds Phases B (wireframe) and C (copy).
version: 2
status: frozen
frozen_at: 2026-04-19
frozen_by: brice@sablia.io
source_brief: research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md
source_plan: plans/sablia-site-acquisition-predesign.md
---

# Diagnostic Sablia : Product Definition v1

Productized paid entry point for Sablia. Single SKU, fixed scope, fixed price, fixed turnaround. Replaces all prior grid-style pricing on the homepage. Doors open exactly one way: a diagnostic.

## 1. Product identity

- **Name (canonical)**: Diagnostic Sablia
- **Rationale**: brand-forward; "IA" and "implémentation" already implied by Sablia's positioning; short, repeatable, works as a CTA verb object ("Démarrer mon diagnostic").
- **Rejected variants** (archived for transparency): "Diagnostic IA Sablia" (redundant), "Diagnostic Implémentation IA" (weakens brand tie, reads as commodity).

## 2. SKU specification

| Axis | Spec |
|------|------|
| Price | **490€ HT**, affiché verbatim "490€ HT" (franchise TVA applicable, pas d'affichage TTC nécessaire) |
| Format | 30-min intake (async form + 15-min call) → 3h deep-dive synchronous (vidéo-call) → 1h restitution (vidéo-call) |
| Deliverable | PDF de 10-15 pages : process map + AI implementation opportunities + 90-day roadmap + recommandation du path post-audit + estimation chiffrée de l'implémentation |
| Turnaround | 5 jours ouvrés entre la fin de l'intake et la restitution |
| Paiement | Upfront. Moyens acceptés : Stripe + virement |
| Annulation | 72h avant l'intake → remboursement intégral. Après l'intake → non-remboursable |
| Facture | Mention "TVA non applicable, art. 293 B du CGI" (régime auto-entrepreneur, franchise en base) |
| Crédit post-audit | Les **490€ HT sont déduits intégralement** de la première facture si le client signe un contrat **Développement** ou **Accompagnement** dans les **90 jours** suivant la restitution. Non applicable au path **Formation d'équipes internes** (qui reste facturé au prix plein de sa fourchette). |

**Price justification**: 490€ HT baisse encore le seuil d'entrée (vs 990€ initial) pour amplifier le volume de diagnostics et élargir le funnel. Reste au-dessus des audits gratuits pour filtrer les prospects non-qualifiés (un dirigeant qui sort 490€ signale intention réelle), mais bien en-dessous du seuil psychologique des 1000€ : décision unilatérale instantanée, pas de devis ni de PO. Le mécanisme de crédit post-audit (490€ déduits sur contrat Dév/Accomp.) rend l'entrée quasi gratuite pour les prospects qui convertissent, tout en maintenant un revenu récurrent pour le volume qui ne convertit pas.

## 3. Les 3 paths post-audit

Le diagnostic ouvre sur **un et un seul** des trois paths suivants, recommandé dans le livrable PDF en fonction du diagnostic. Le mot "formation" seul est proscrit : toujours qualifier.

### 3.1 Formation d'équipes internes

- **Promesse** : montée en compétence ciblée de l'équipe cliente sur des skills IA/automatisation spécifiques.
- **Durée** : 1 à 3 jours
- **Fourchette de prix** : **1 500 – 4 500€ HT**
- **Livrable** : curriculum sur-mesure + workshops hands-on + bibliothèque de modules enregistrés
- **Cadre** : NON une académie complète. Toujours un scope qualifié (ex : "former 4 chefs de projet à n8n pour automatiser leurs process P2P en 2 jours").

### 3.2 Accompagnement

- **Promesse** : coaching intégré d'un sponsor client pendant 4-12 semaines pour porter un projet IA en interne.
- **Durée** : 4 à 12 semaines
- **Fourchette de prix** : **2 500 – 4 000€ / mois**
- **Livrable** : call hebdomadaire 1h + Slack async + accès bibliothèque de templates

### 3.3 Développement

- **Promesse** : Sablia construit les automatisations (n8n / agents vocaux Dipler / webapps).
- **Durée** : 2 à 12 semaines
- **Fourchette de prix** : **5 000 – 25 000€ projet** + retainer optionnel **2 500 – 5 000€ / mois**
- **Livrable** : automatisations livrées en production + documentation de handoff

## 4. Modèle de capacité (opérations)

- **Plafond** : **4 à 6 diagnostics par mois max**
- **Contrainte** : retainer Qwertys 6j/mois déjà engagé. Un diagnostic = 0,5 à 1j de charge (intake + deep-dive 3h + restitution 1h + rédaction livrable). 4-6 diagnostics/mois = 2 à 6j de charge, compatible avec les 14-16j restants.
- **Effet levier** : chaque diagnostic alimente soit (i) un path payant (formation/accompagnement/développement) soit (ii) une donnée de marché qui affine le positionnement.
- **Signal de saturation** : si le pipeline dépasse 6 demandes/mois, passer en liste d'attente (pas de baisse de prix, pas d'extension de capacité à la hâte).

## 5. Crédibilité

### 5.1 Titre officiel de Brice

**Canonical (utilisé verbatim)** : "Responsable Pédagogique et Coach Développement IA"

- Organisation : IAPreneurs
- Contexte (optionnel en copy) : "chez IAPreneurs, la communauté francophone de formation IA fondée par Yassine Sdiri"

### 5.2 Chiffres IAPreneurs autorisés

Deux chiffres validés avec Yassine Sdiri (2026-04-18), utilisables ensemble ou séparément selon l'espace :

- **500+ membres** (membres de la communauté IAPreneurs)
- **200k+ abonnés YouTube** (chaîne Yassine Sdiri, signal de portée publique)

**Formulations préférées** :
- Version longue : "Responsable Pédagogique et Coach Développement IA chez IAPreneurs (500+ membres, 200k+ abonnés YouTube)"
- Version courte : "Responsable Pédagogique et Coach Développement IA chez IAPreneurs (500+ membres)"
- Version neutre pour contextes où le chiffre serait déplacé : "Responsable Pédagogique et Coach Développement IA chez IAPreneurs"

### 5.3 Lien affilié

- URL : `https://www.iapreneurs.com/?affiliate_code=8b6eda`
- Déjà live à `HeroSection.tsx:66`
- Conserver verbatim dans toute nouvelle version du site

## 6. Différenciation Sablia vs IAPreneurs

**Statement canonique (utilisé verbatim en FAQ C5)** :

> IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'IA. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients. Brice exerce simplement les deux rôles.

### Axes de différenciation (pour toute future reformulation)

| Axe | IAPreneurs | Sablia |
|-----|-----------|--------|
| Audience | Entrepreneurs, freelances, consultants IA en construction | Dirigeants PME 10-250 salariés avec process opérationnels existants |
| Depth | Formation + communauté sur la durée (LMS, cohortes) | Diagnostic puis implémentation ponctuelle sur un périmètre défini |
| Purpose | Bâtir une offre qui vend l'IA à des clients | Intégrer l'IA dans des opérations qu'on exploite déjà |

**Règles de langage** :
- **Jamais** : "partenaires", "partners", "complémentaires", "écosystème commun"
- **Toujours** : audiences distinctes, Brice porte les deux casquettes, pas de flux client entre les deux

## 7. Positionnement dans le funnel

```
Trafic (cold email + SEO case studies + LinkedIn)
        ↓
Homepage sablia.io (1 CTA → #diagnostic-form)
        ↓
Diagnostic Sablia, 490€ HT, 5 jours (crédit 490€ si signature Dév/Accomp. dans les 90 j)
        ↓
Recommandation vers 1 des 3 paths (formation / accompagnement / développement)
        ↓
Contrat path (1.5k – 25k€ selon path)
```

**Ce document est la source autoritative** pour les phases B (wireframe) et C (copy). Toute contradiction ultérieure dans `docs/wireframe-v1.md` ou `docs/copy-v1.md` est résolue en faveur de ce fichier. Modifications après freeze : bump `version`, update `frozen_at`, documenter le changement en footer ci-dessous.

## Changelog

- **v2 (2026-04-19)** : (i) prix 990€ HT → **490€ HT** pour abaisser encore le seuil d'entrée et maximiser le volume de diagnostics ; (ii) ajout du **crédit post-audit** — les 490€ sont déduits intégralement de la première facture si le client signe un contrat Développement ou Accompagnement dans les 90 jours (pas sur Formation). Rationale : transforme le diagnostic en "quasi-free" pour les prospects qui convertissent tout en conservant le filtre d'intention (490€ > 0€) et un revenu sur les non-convertis. Downstream : `docs/wireframe-v1.md` + `docs/copy-v1.md` + `CalculatorROI.tsx` doivent être mis à jour (remplacer 990 → 490 partout, ajouter mention du crédit dans hero CTA, FAQ Q1, narrative §4 et §9).
- **v1 (2026-04-18)** : création initiale, freeze après résolution des 6 HITL Phase A (A1 nom, A2 facture, A4 capacité, A5 crédential, A6 différenciation, A7 Elorri). Sortie de `/execute sablia-site-acquisition-predesign` Phase A.
