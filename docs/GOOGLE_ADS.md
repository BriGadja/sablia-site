# Google Ads — Sablia Site

**Last updated**: 2026-03-02

---

## IDs & Accounts

| Item | Value |
|------|-------|
| GA4 Property | 526481476 |
| GA4 Measurement ID | G-JVXKHE3VD8 |
| GA4 Web Stream ID | 13689650940 |
| Google Ads Account | 424-135-0048 |
| Conversion ID | AW-17987411130 |
| GA4 <> Ads linked | Yes |

### Conversion Labels

| Conversion | Label | GA4 Event | Estimated Value |
|------------|-------|-----------|-----------------|
| contact_form | `v-CoCPq02YEcELq5iIFD` | `generate_lead` (label: contact_form) | 50 EUR |
| gap_form | `0t07CP202YEcELq5iIFD` | `generate_lead` (label: gap_form) | 100 EUR |
| calendly_booking | `sZJBCPi12YEcELq5iIFD` | `generate_lead` (label: calendly_booking) | 150 EUR |

---

## Implementation Status

- [x] Conversion actions created in Google Ads
- [x] Conversion labels configured in `.env` (VITE_GADS_*)
- [x] Landing pages deployed (`/lp/automatisation-pme`, `/lp/audit-gratuit`)
- [x] Conversion tracking code in `analytics.ts` + form components
- [x] GA4 <> Google Ads linked (metrics + audiences)
- [ ] **Campaign creation** (NOT done)
- [ ] **Budget/bidding/extensions** (NOT done)
- [ ] **Tag Assistant verification** (NOT done)

### Promo

Spend 400 EUR, get 400 EUR credit. **Expires May 1, 2026.**

---

## Campaign Structure

### Campaign: "Sablia — Automatisation PME" (Search)

- **Type**: Search (Reseau de Recherche)
- **Objectif**: Leads (formulaire contact + GAP)
- **Zone geographique**: France metropolitaine
- **Langues**: Francais
- **Strategie d'encheres**: Maximiser les conversions (phase apprentissage)
- **Budget quotidien**: Phase 1 = 15 EUR/jour

### Ad Groups

| # | Ad Group | Landing Page | Objectif |
|---|----------|-------------|----------|
| 1 | Automatisation Entreprise | `/lp/automatisation-pme` | Leads contact |
| 2 | n8n / No-Code | `/lp/automatisation-pme` | Leads contact |
| 3 | Audit Gratuit | `/lp/audit-gratuit` | Leads GAP |
| 4 | Formation IA / Automatisation | `/lp/automatisation-pme` | Leads contact |

---

## Keywords (Phrase Match)

### Ad Group 1 — Automatisation Entreprise

```
"automatisation entreprise"
"automatiser processus"
"automatisation PME"
"automatisation taches repetitives"
"automatisation workflow"
"automatiser son entreprise"
"gain de temps automatisation"
"automatisation processus metier"
"consultant automatisation"
"automatisation business"
"transformation digitale PME"
"optimisation processus"
"automatisation gestion"
"reduire taches manuelles"
"solution automatisation"
```

### Ad Group 2 — n8n / No-Code

```
"n8n consultant"
"n8n France"
"n8n entreprise"
"n8n integration"
"formation n8n"
"make.com consultant"
"make.com entreprise"
"no code automatisation"
"low code automatisation"
"zapier alternative"
"n8n vs zapier"
"automatisation no code"
"integration API entreprise"
"connecter outils entreprise"
"workflow no code"
```

### Ad Group 3 — Audit Gratuit

```
"audit automatisation"
"audit digital gratuit"
"diagnostic automatisation"
"audit processus entreprise"
"evaluer automatisation"
"audit transformation digitale"
"diagnostic digital PME"
"audit gratuit entreprise"
"bilan automatisation"
"analyse processus metier"
"audit efficacite operationnelle"
"potentiel automatisation"
```

### Ad Group 4 — Formation IA / Automatisation

```
"formation automatisation"
"formation IA entreprise"
"formation n8n"
"formation make.com"
"formation intelligence artificielle PME"
"formation workflow"
"apprendre automatisation"
"formation no code"
"formation transformation digitale"
"montee en competence IA"
"formation outils IA"
"accompagnement IA entreprise"
```

### Negative Keywords (campaign level)

```
"emploi" "recrutement" "salaire" "offre d'emploi" "stage" "alternance"
"tutoriel gratuit" "cours gratuit" "open source" "telecharger" "code source" "github"
"definition" "c'est quoi" "wikipedia"
"RPA" "robot" "chatbot"
```

---

## Ad Copy (Responsive Search Ads)

### Ad Group 1 — Automatisation Entreprise

**Headlines** (30 chars each):
1. Automatisez Votre Entreprise
2. -20h de Taches Manuelles
3. ROI en 4-8 Mois Garanti
4. Formation + Developpement
5. Devis Gratuit en 24h
6. Expert Automatisation PME
7. Workflows n8n & Make.com
8. Gardez le Controle
9. Economisez 50-150k EUR/an
10. Sans Engagement
11. Reponse Sous 24 Heures
12. +100 Processus Automatises
13. Consultant Automatisation
14. Liberez Vos Equipes
15. Solution Sur Mesure

**Descriptions** (90 chars each):
1. Formation de vos equipes + developpement de workflows. Gardez le controle total.
2. Automatisez CRM, facturation, emails. ROI mesurable en 4-8 mois. Devis gratuit.
3. Expert n8n et Make.com en France. Accompagnement personnalise pour votre PME.
4. Vos equipes deviennent autonomes. Pas de dependance. Audit gratuit de 30 min.

### Ad Group 2 — n8n / No-Code

**Headlines**:
1. Expert n8n en France
2. Consultant Make.com & n8n
3. Formation n8n Entreprise
4. Automatisation No Code
5. Integrez Tous Vos Outils
6. n8n pour les Entreprises
7. Devis Gratuit Sous 24h
8. Workflows Sur Mesure
9. Alternative a Zapier
10. +500 Integrations n8n
11. Formation 1-3 Jours
12. Self-Hosted & Securise
13. Donnees en France
14. Accompagnement Complet
15. De 0 a l'Autonomie

**Descriptions**:
1. Consultant certifie n8n en France. Formation + developpement pour PME. Devis gratuit.
2. Connectez vos outils sans coder. CRM, email, facturation, tout en automatique.
3. Alternative a Zapier, hebergee en France. Vos donnees restent souveraines.
4. De l'audit a l'autonomie. Vos equipes prennent le controle de leurs workflows.

### Ad Group 3 — Audit Gratuit

**Headlines**:
1. Audit Automatisation Gratuit
2. 2 Min Pour un Diagnostic
3. Recommandations en 24h
4. Sans Engagement
5. Identifiez Vos Economies
6. Analyse Personnalisee
7. Gratuit et Rapide
8. Decouvrez Votre Potentiel
9. Economies Estimees
10. Rapport Detaille Offert
11. Expert Automatisation
12. Pistes Concretes
13. Testez Maintenant
14. Reponse Garantie 24h
15. 100% Gratuit

**Descriptions**:
1. Remplissez notre formulaire en 2 min. Recevez vos pistes d'automatisation sous 24h.
2. Identifiez gratuitement vos 3 processus les plus chronophages a automatiser.
3. Analyse personnalisee de votre entreprise. Recommandations actionnables. Sans frais.
4. Rejoignez les PME qui economisent +20h/semaine. Commencez par un audit gratuit.

### Ad Group 4 — Formation IA / Automatisation

**Headlines**:
1. Formation Automatisation IA
2. Formation n8n 1-3 Jours
3. Montez en Competences
4. Autonomie Garantie
5. Formation Sur Mesure
6. Expert IA en France
7. De Debutant a Autonome
8. Formation Make.com
9. Workshops Pratiques
10. ROI des la Formation
11. Paiement Echelonne
12. Groupes ou Individuel
13. Certifications Incluses
14. Support Post-Formation
15. A Partir de 700 EUR

**Descriptions**:
1. Formations pratiques de 1 a 3 jours. Vos equipes deviennent autonomes sur n8n.
2. Apprenez a automatiser vos processus avec l'IA. Workshops, exercices, cas reels.
3. Formation adaptee a votre niveau. De debutant a expert. Paiement echelonne possible.
4. Formez vos equipes a l'automatisation. Independance garantie apres la formation.

---

## Budget Plan

### Phase 1 — Apprentissage (Semaines 1-4)

- **Budget**: 400 EUR (budget initial)
- **Budget quotidien**: ~15 EUR/jour
- **Strategie**: Maximiser les conversions
- **Actions**: Activer 4 ad groups, monitorer Quality Score, identifier search terms, ajouter negative keywords

### Phase 2 — Optimisation (Semaines 5-8)

- **Budget**: 400 EUR (credits promo)
- **Budget quotidien**: ~15 EUR/jour
- **Strategie**: CPA cible (base sur donnees Phase 1)
- **Actions**: Pauser sous-performants, augmenter encheres top performers, A/B tester headlines

### Phase 3 — Scale (Mois 3+)

- **Budget**: Based on Phase 1-2 ROI data (not yet available)
- **Condition**: CPA < 50 EUR par lead ET leads qui convertissent
- **Actions**: Ajouter remarketing/Display, tester nouvelles landing pages, elargir mots-cles

### Target Metrics

| Metrique | Cible Phase 1 | Cible Phase 2 |
|----------|--------------|--------------|
| CPC moyen | < 3 EUR | < 2.50 EUR |
| CTR | > 3% | > 5% |
| Taux conversion LP | > 5% | > 8% |
| CPA (cout par lead) | < 60 EUR | < 40 EUR |
| Quality Score moyen | > 5 | > 7 |

---

## Landing Page Mapping

| Ad Group | Landing Page | Conversion Action |
|----------|-------------|-------------------|
| Automatisation Entreprise | `/lp/automatisation-pme` | contact_form |
| n8n / No-Code | `/lp/automatisation-pme` | contact_form |
| Audit Gratuit | `/lp/audit-gratuit` > `/gap` | gap_form |
| Formation IA | `/lp/automatisation-pme` | contact_form |

### UTM Template

```
utm_source=google&utm_medium=cpc&utm_campaign=automatisation-pme&utm_term={keyword}&utm_content={ad_group}
```

---

## Pre-Launch Checklist

- [x] Conversion actions created
- [x] Labels configured in `.env`
- [x] Landing pages deployed and tested
- [x] GA4 <> Google Ads linked
- [ ] Conversion tracking verified with Google Tag Assistant
- [ ] Budget quotidien configured
- [ ] Negative keywords applied
- [ ] Extensions configured (sitelinks, callouts, structured snippets)

### Recommended Ad Extensions

**Sitelinks**: Calculateur ROI (`/roi`), Nos Tarifs (`/tarifs`), Cas Clients (`/cas-clients`), FAQ (`/faq`)

**Callouts**: Audit Gratuit 30 min, ROI en 4-8 Mois, Expert n8n France, Sans Engagement

**Structured Snippets (Services)**: Automatisation, Formation n8n, Audit Digital, Agents Vocaux IA, Integration API

---

## Related Docs

- [INTEGRATIONS.md](./INTEGRATIONS.md) — Conversion tracking implementation
- [SEO.md](./SEO.md) — GA4 setup, analytics consent flow
- [SITE_CONTENT.md](./SITE_CONTENT.md) — Landing page content
