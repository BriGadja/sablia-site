---
name: site-completion-checklist
description: Checklist actionnable pour rendre sablia.io opérationnel en production, faire pointer les Google Ads correctement et valider tous les use cases clients. Attaque une tâche à la fois.
status: in_progress
created_at: 2026-04-20
owner: brice@sablia.io
progress:
  P0: done 2026-04-20
  P1: done 2026-04-20
  P2: done 2026-04-20 (partial — P2.17-19 CGV blocked on HITL P4.1 statut juridique)
  P3: pending — Brice manual Google Ads UI (promo expires 2026-05-01)
  P4: pending — HITL P4.1-P4.4 + E2E validation
  P5: pending — tech debt post-launch
---

# Sablia Site — Checklist de complétion

Objectif triple :
1. **Site opérationnel** : formulaires qui atterrissent, pages cohérentes, zéro 404 / erreur visible
2. **Google Ads → site alignés** : campagne live, conversions trackées, LPs pertinentes
3. **Use cases clients validés** : chaque parcours (contact, GAP, diagnostic, réserv. Calendly, ROI) vérifié end-to-end

Règle : on coche au fur et à mesure, chaque item est autonome, on attaque dans l'ordre P0 → P5 sauf priorité inverse.

---

## État actuel (snapshot 2026-04-20)

| Vérif | Résultat |
|-------|----------|
| `npm test` | ✅ 5/5 pass (Footer.test.tsx) |
| `npm run check` | ✅ tsc clean |
| Webhook Contact (n8n) | ✅ OPTIONS 204 + POST 200 |
| Webhook GAP (n8n) | ✅ OPTIONS 204 + POST 200 |
| Homepage v2 | ❌ pas implémentée (Landing.tsx = ancienne version) |
| Nouveau SKU (Diagnostic Sablia 490€) | ❌ absent du site, présent uniquement dans `docs/product-v1.md` |
| Campagne Google Ads | ❌ non lancée (tracking OK, campagne non créée) |

STATUS.md listait 3 "Known Issues" qui sont **obsolètes** (tests passent, tsc clean) → à nettoyer lors du prochain `/close`.

---

## P0 — Pré-requis avant tout travail d'impl

- [ ] **P0.1** Confirmer que le build prod passe : `npm run build` → 0 erreur, assets générés
- [ ] **P0.2** Lighthouse baseline sur sablia.io actuelle (capturer scores avant refonte pour éviter régression)
- [ ] **P0.3** Nettoyer STATUS.md "Known Issues" obsolètes (3 items : Footer.test, toBeInTheDocument, animations.ts)

---

## P1 — Nouvelle homepage (Diagnostic Sablia)

Gros morceau. Dépend du handoff claude.ai/design. Découpé pour pouvoir attaquer en parallèle / séquentiellement.

### P1.A — Infrastructure en amont (peut être fait avant le design handoff)

- [ ] **P1.A.1** Créer le workflow n8n `sablia-site-diagnostic` (clone `sablia-site-formulaire`, adapter routage downstream : intake form, lien Stripe, notif Brice, réservation créneau 15min)
- [ ] **P1.A.2** Récupérer l'URL du webhook diagnostic + ajouter `webhookId` UUID sur le node Webhook (cf. learning MEMORY.md : sans `webhookId`, CORS OPTIONS fail 500)
- [ ] **P1.A.3** Désactiver/réactiver le workflow pour forcer l'enregistrement du webhook
- [ ] **P1.A.4** Vérifier OPTIONS + POST manuellement (curl depuis origin sablia.io)
- [ ] **P1.A.5** Ajouter `WEBHOOK_DIAGNOSTIC` dans `client/src/lib/form-constants.ts`
- [ ] **P1.A.6** Ajouter `VITE_DIAGNOSTIC_WEBHOOK_URL` dans `.env.example` + Vercel env vars

### P1.B — Handoff externe (manuel, Brice)

- [ ] **P1.B.1** Envoyer les 3 docs figés à claude.ai/design : `docs/product-v1.md`, `docs/wireframe-v1.md`, `docs/copy-v1.md`
- [ ] **P1.B.2** Récupérer le design output (tokens, mockups, palette, typo, animations)
- [ ] **P1.B.3** Stocker le design output dans `docs/design-v1/` (ou équivalent)

### P1.C — Implémentation composants (après handoff)

- [ ] **P1.C.1** `DiagnosticForm.tsx` + schéma Zod colocated (4 champs : nom, email, entreprise, processus_coûteux + honeypot + RGPD)
- [ ] **P1.C.2** Tests unitaires `DiagnosticForm.test.tsx` (validation Zod, honeypot, submit success/error)
- [ ] **P1.C.3** `WhatRevealsSection.tsx` (3 cards des 3 paths post-audit, prix floor sur Card 1 uniquement)
- [ ] **P1.C.4** `ClientLogosStrip.tsx` (logos sans liens, greyed-out avec hover)
- [ ] **P1.C.5** `FooterCTABand.tsx` (ou intégration dans Footer.tsx)
- [ ] **P1.C.6** Section `LeProblème` (section 3, nouvelle markup, pas de composant partagé prévu)
- [ ] **P1.C.7** Section `LeDiagnostic` (section 4, nouvelle markup)

### P1.D — Modif composants existants

- [ ] **P1.D.1** `HeroSection.tsx` : remplacer copy (H1 = "Cinq jours. Un PDF. Une décision claire.", sub, credential, primary CTA "Démarrer mon diagnostic, 490€", secondary Calendly text link)
- [ ] **P1.D.2** `TestimonialsSection.tsx` : 5 → 3 témoignages (règle : ≥2 avec ROI quantifié, candidats : Yassine/Norloc, Valentin/Stefano, Amir/BTP)
- [ ] **P1.D.3** `TestimonialsSection.tsx` : schema.org `reviewCount: '5'` → `'3'`
- [ ] **P1.D.4** `CalculatorROI.tsx` : default investment `1500` → `490`
- [ ] **P1.D.5** `FaqSection.tsx` : scope → 4-6 Q diagnostic-focused + 1 Q "Sablia vs IAPreneurs" (verbatim product-v1 §6)

### P1.E — Refonte Landing.tsx

- [ ] **P1.E.1** Retirer imports : `LogosCloud`, `ThreeStepProcess`, `PricingSection`, `ContactFormSection`, `TransformationSection`
- [ ] **P1.E.2** Ajouter imports : `ClientLogosStrip`, `DiagnosticForm`, `WhatRevealsSection`, `FooterCTABand`
- [ ] **P1.E.3** Stack exact (9 sections) : Hero → ClientLogosStrip → LeProblème → LeDiagnostic + DiagnosticForm (`#diagnostic-form`) → WhatReveals → Testimonials → ROI → FAQ → FooterCTABand
- [ ] **P1.E.4** Vérifier : 1 CTA primary + 1 CTA secondary total sur la page (down de 9)
- [ ] **P1.E.5** Vérifier mobile 390px : seul le CTA primary visible above-fold

### P1.F — Nettoyage composants obsolètes

- [ ] **P1.F.1** Supprimer `client/src/components/landing/LogosCloud.tsx` + usages
- [ ] **P1.F.2** Supprimer `client/src/components/landing/ThreeStepProcess.tsx`
- [ ] **P1.F.3** Supprimer `client/src/components/landing/ContactFormSection.tsx` (Calendly désormais en text link)
- [ ] **P1.F.4** Vérifier que `PricingSection.tsx` n'est plus importé par Landing mais **reste** disponible pour `/tarifs`
- [ ] **P1.F.5** Grep global pour références orphelines aux composants supprimés

### P1.G — Validation

- [ ] **P1.G.1** `npm run check` → 0 erreur TS
- [ ] **P1.G.2** `npm test` → tous verts (incl. DiagnosticForm.test.tsx)
- [ ] **P1.G.3** `npm run build` → 0 erreur
- [ ] **P1.G.4** `npm run lint` → 0 erreur Biome
- [ ] **P1.G.5** Lighthouse audit (Performance ≥90, a11y ≥95, SEO ≥95)
- [ ] **P1.G.6** Vérif visuelle via browser-verifier agent (structure + copy + CTAs)
- [ ] **P1.G.7** E2E test : soumission DiagnosticForm → n8n reçoit payload → Brice reçoit notif

---

## P2 — Cohérence globale du site

Après refonte homepage, plusieurs pages deviennent inconsistantes (elles parlent d'anciennes offres). À traiter avant pointage des Google Ads dessus.

- [ ] **P2.1** `/tarifs` (Tarifs.tsx + PricingSection.tsx) : décision éditoriale — soit (a) purger l'ancienne grille et afficher uniquement les 3 paths post-audit + 490€ diagnostic, soit (b) garder en l'état mais aligner le discours sur "accessible après diagnostic"
- [ ] **P2.2** `/lp/automatisation-pme` (LpAutomatisation.tsx) : aligner sur nouveau positionnement Coach-Implémenteur, CTA → `#diagnostic-form` sur homepage ou page dédiée
- [ ] **P2.3** `/lp/audit-gratuit` (LpAuditGratuit.tsx) : décision — garder GAP form (audit gratuit pour leads froids) OU migrer vers DiagnosticForm ? Impact conversion tracking
- [ ] **P2.4** `/gap` (GapForm.tsx) : garder tel quel si LP audit-gratuit conservée
- [ ] **P2.5** `/faq` (Faq.tsx) : mettre à jour Q&A post-pivot (24 → scope diagnostic-focused), fusionner avec section FAQ homepage ou différencier
- [ ] **P2.6** `/cas-clients` : vérifier cohérence discours (pas de contradiction avec nouveau positionnement)
- [ ] **P2.7** `/roi` (Roi.tsx) : propager default 1500 → 490€ (même logique que CalculatorROI home)
- [ ] **P2.8** `/about` : relire et aligner credential "Responsable Pédagogique et Coach Développement IA chez IAPreneurs (500+ membres, 200k+ abonnés YouTube)"
- [ ] **P2.9** Navigation.tsx : vérifier que les liens pointent toujours vers les bonnes sections
- [ ] **P2.10** `/thank-you` : ajouter gestion `?source=diagnostic` en plus de `contact`/`gap`

### Docs à refondre

- [ ] **P2.11** `docs/SITE_CONTENT.md` : rewrite complète (marqué superseded dans CLAUDE.md)
- [ ] **P2.12** `docs/OFFRES.md` : rewrite ou supprimer (marqué superseded)
- [ ] **P2.13** `docs/FAQ.md` : aligner avec nouveau scope
- [ ] **P2.14** `docs/meta-tags.json` : update meta description homepage (= positioning statement C1)
- [ ] **P2.15** `client/public/sitemap.xml` : vérifier toutes les routes + lastmod
- [ ] **P2.16** `docs/INTEGRATIONS.md` : ajouter WEBHOOK_DIAGNOSTIC

### Mentions légales & commerciales

- [ ] **P2.17** `/cgv` (CGV.tsx) : vérifier compatibilité avec SKU 490€ HT + mécanisme crédit post-audit + franchise TVA art. 293 B CGI
- [ ] **P2.18** `/mentions-legales` : raison sociale / statut à jour (dépend du choix SASU vs auto-entrepreneur — voir P4.1)
- [ ] **P2.19** `/politique-confidentialite` : vérifier mention webhook n8n (traitement données formulaire)

---

## P3 — Google Ads : campagne live

Tracking infra OK (GA4 ↔ Ads, conversion labels, LPs déployées). Il reste le **manuel UI Google Ads** + quelques verifs tech.

### Tech / verifs

- [ ] **P3.1** Importer conversion `generate_lead` depuis GA4 dans Google Ads (Goals > Conversions > Import from GA4) — bloqué sur STATUS.md TODO
- [ ] **P3.2** Tag Assistant verification (chrome extension) sur `/lp/*` → vérifier que les 3 conversion labels firent bien (contact_form, gap_form, calendly_booking)
- [ ] **P3.3** Vérifier que GA4 reçoit les events `form_submit` + `generate_lead` (Rapport temps réel, soumettre un lead test)

### Campagne UI (manuel Brice, 1-2h)

- [ ] **P3.4** Créer campagne "Sablia — Automatisation PME" (Search, France, FR, Maximiser conversions)
- [ ] **P3.5** Budget quotidien 15€/j (Phase 1)
- [ ] **P3.6** Créer les 4 ad groups (Automatisation Entreprise, n8n/No-Code, Audit Gratuit, Formation IA)
- [ ] **P3.7** Importer mots-clés phrase match (listés dans `docs/GOOGLE_ADS.md`)
- [ ] **P3.8** Importer negative keywords campaign-level
- [ ] **P3.9** Créer 4 Responsive Search Ads (1 par ad group, headlines + descriptions dans GOOGLE_ADS.md)
- [ ] **P3.10** Configurer extensions : sitelinks (/roi, /tarifs, /cas-clients, /faq), callouts, structured snippets (Services)
- [ ] **P3.11** UTM template : `utm_source=google&utm_medium=cpc&utm_campaign=automatisation-pme&utm_term={keyword}&utm_content={ad_group}`
- [ ] **P3.12** Vérifier LP mapping : ad groups 1, 2, 4 → `/lp/automatisation-pme`, ad group 3 → `/lp/audit-gratuit`
- [ ] **P3.13** Valider avec Brice que le promo "400€ offerts pour 400€ dépensés" est activé (expire **1er mai 2026**, soit 11 jours)
- [ ] **P3.14** Activer la campagne + monitorer 48h pour sanity check (pas de spike CPC anormal)

### Post-launch

- [ ] **P3.15** Semaine 1 : review search terms report, ajouter negative keywords apparus
- [ ] **P3.16** Semaine 2-4 : ajuster enchères selon Quality Score
- [ ] **P3.17** Semaine 5+ : transition vers CPA cible basé sur data Phase 1

---

## P4 — Validation use cases clients (end-to-end)

Tester chaque parcours comme un vrai visiteur / client, pas juste les composants isolés.

### Pré-requis business (HITL, bloquants)

- [ ] **P4.1** Confirmer statut SASU vs auto-entrepreneur (impact : capacité, mention TVA, modèle facturation)
- [ ] **P4.2** Locker capacité mensuelle (4-6 diagnostics/mois max, alignement retainer Qwertys 6j/mois)
- [ ] **P4.3** Consentements cas clients (Nestenn, Qwertys, Stefano, Norloc, CER) : named vs anonymisé
- [ ] **P4.4** Clarifier boundaries Elorri (Formation IA Normandie) vs Sablia "formation d'équipes internes"

### Parcours client à valider

- [ ] **P4.5** **Parcours Contact générique** (homepage avant refonte OU futur `/contact`) : formulaire → n8n → CRM/email Brice → réponse sous 24h
- [ ] **P4.6** **Parcours GAP (audit gratuit)** : `/lp/audit-gratuit` → `/gap` → soumission → n8n → Brice reçoit brief → réponse
- [ ] **P4.7** **Parcours Diagnostic** (nouveau, après P1) : homepage → `#diagnostic-form` → n8n → intake form email → Stripe link → créneau calendar
- [ ] **P4.8** **Parcours Calendly** : clic secondaire hero/footer → Calendly InlineWidget ou page → réservation → event `calendly_booking` tiré dans GA4 + Ads
- [ ] **P4.9** **Parcours ROI Calculator** : `/roi` ou section home → interaction sliders → affichage résultat → CTA de fin → redirect cohérent
- [ ] **P4.10** **Parcours LP Ads** (simulé) : clic Google Ad → `/lp/*` → CTA → formulaire → conversion trackée dans Ads (délai ~3h)

### Edge cases & cross-device

- [ ] **P4.11** Honeypot : soumission avec champ `website` rempli → silent success (pas de lead envoyé)
- [ ] **P4.12** Validation Zod : email invalide, nom court, RGPD non coché → erreurs inline propres
- [ ] **P4.13** Mobile 390px : toutes les pages lisibles, CTAs accessibles, pas de débordement
- [ ] **P4.14** iPad 768px : layout 2-col tient, pas de wraps bizarres
- [ ] **P4.15** Safari iOS : tester Calendly embed + smooth-scroll `#diagnostic-form`
- [ ] **P4.16** Chrome Android : tester soumission formulaire + redirect `/thank-you`

---

## P5 — Tech debt (non-bloquant, à traiter post-launch)

Repris de `docs/ROADMAP.md` + observations session actuelle.

- [ ] **P5.1** Fix canonical trailing slash inconsistency (SEO)
- [ ] **P5.2** Résoudre duplicate JSON-LD sur homepage (SEO)
- [ ] **P5.3** Add structured data à `/cas-clients`
- [ ] **P5.4** Fix www vs non-www redirect (Vercel DNS)
- [ ] **P5.5** Evaluate React Query usage (currently configured but minimal use)
- [ ] **P5.6** Blog / content hub (2-4 semaines, décision format MDX vs headless CMS)
- [ ] **P5.7** Migration vers Next.js (conformité STACK.md) — long terme, ROI à évaluer

---

## Ordre d'attaque recommandé

1. **P0** (15 min) — verifs rapides, état de sanity check
2. **P1.A** (n8n workflow, peut être fait sans attendre design) — 45-60 min
3. **P1.B.1** — Brice envoie les 3 docs à claude.ai/design (parallèle, pendant que Claude Code attaque le reste)
4. **P4.1 → P4.4** — HITL business, Brice les tranche en asynchrone (impact P2, P3, P1 selon)
5. **P3.1 → P3.3** — Tag Assistant + import `generate_lead` (15 min, débloque le monitoring)
6. **Attendre design output P1.B.2**
7. **P1.C → P1.G** — impl homepage refonte (estimé 4-8h avec browser-verifier + Lighthouse)
8. **P2** — cohérence globale (2-3h)
9. **P3.4 → P3.14** — campagne Google Ads (1-2h, manuel Brice)
10. **P4.5 → P4.16** — validation end-to-end (1-2h)
11. **P5** — tech debt, traité selon bande passante

---

## Notes

- Chaque tâche cochée → commit dédié avec message verbose (Principe 3 : Git History Is Memory)
- Les blocs P1.C à P1.F sont candidats à passer en `/plan` formel quand le design arrive (trop de fichiers touchés pour un exec direct)
- P3.4-P3.14 : manuel Brice uniquement (Claude n'a pas d'accès UI Google Ads)
- P4.1-P4.4 : HITL obligatoires, bloquent certaines décisions éditoriales P2

**Prochain step suggéré** : attaquer P0.1 (`npm run build`) + P0.3 (clean STATUS.md) pendant que Brice envoie les 3 docs à claude.ai/design (P1.B.1) en parallèle.
