---
name: copy-v1
description: Frozen copy package for sablia.io acquisition machine v1, every word the homepage visitor will read. Hands off to claude.ai/design and then /frontend-design.
version: 2
status: frozen
frozen_at: 2026-04-19
frozen_by: brice@sablia.io (via /execute sablia-site-acquisition-predesign)
source_product: docs/product-v1.md
source_wireframe: docs/wireframe-v1.md
locked_decisions:
  positioning: coach-implémenteur
  tone: vouvoiement
  title_canonical: "Responsable Pédagogique et Coach Développement IA"
  iapreneurs_credential: "IAPreneurs (500+ membres, 200k+ abonnés YouTube)"
  price_anchor: "490€ HT"
  post_audit_credit: "Les 490€ sont déduits de la première facture si signature Développement ou Accompagnement dans les 90 jours (non applicable à Formation)."
  positioning_statement: "Intégrer l'intelligence artificielle dans votre PME, avec le Responsable Pédagogique IA d'IAPreneurs."
  hero_h1: "Cinq jours. Un PDF. Une décision claire."
---

# Copy Package v1, Homepage sablia.io

All homepage copy, in the order the visitor reads it. Vouvoiement throughout. "Intelligence artificielle" preferred on first mention, "IA" thereafter. Verbatim strings to be pasted into components at implementation time.

---

## C1. Positioning statement (LOCKED)

Single-line positioning, goes into the `<meta name="description">`, social share preview, and pitch-deck opener.

**Locked (Variant B, 103 chars)** :

> *"Intégrer l'intelligence artificielle dans votre PME, avec le Responsable Pédagogique IA d'IAPreneurs."*

Rejected alternates archived in appendix.

---

## C2. Hero package (LOCKED)

Copy fills the `HeroSection.tsx` component (see `wireframe-v1.md §1.1`).

**Locked hero (Variant E, rhythmic/punchy)** :

- **H1** (7 mots, rythme ternaire) :

  > *"Cinq jours. Un PDF. Une décision claire."*

- **Sub** (22 mots) :

  > *"Le Diagnostic Sablia cartographie vos process, identifie les automatisations qui valent vraiment le coup, et signale celles à laisser de côté. 490€ HT, déduits de la première facture si vous signez ensuite un contrat Développement ou Accompagnement."*

- **Credential line** :

  > *"Brice Gachadoat, Responsable Pédagogique et Coach Développement IA chez [IAPreneurs](https://www.iapreneurs.com/?affiliate_code=8b6eda) (500+ membres, 200k+ abonnés YouTube)"*

- **Primary CTA button** :

  > **Démarrer mon diagnostic, 490€**

- **Secondary link** (Calendly) :

  > *"Préférer en discuter d'abord →"*

Rejected H1 alternates archived in appendix.

---

## C3. Narrative arc (sections 3-9 of wireframe)

Copy for each below-fold homepage section. Follows the structure locked in `wireframe-v1.md §1`.

### § 3, Le problème

- **H2** (8 words): *"Vos équipes perdent du temps sur du manuel."*
- **Body** (60 words):

  *"Extraction de données, relances clients, reporting, saisie multi-outils. Vos équipes savent que ces tâches devraient être automatisées, mais chaque nouveau projet pose deux questions concrètes : est-ce que ça en vaut le coup ? Et par où commencer ? Les bonnes réponses ne sont jamais les mêmes d'une PME à l'autre."*

### § 4, Le diagnostic

- **H2** (6 words): *"Cinq jours pour y voir clair."*
- **Body** (68 words):

  *"Le Diagnostic Sablia structure votre état des lieux. Vous recevez un PDF de 10 à 15 pages : cartographie de vos process, opportunités d'implémentation IA classées par ROI, feuille de route 90 jours, et estimation chiffrée de la phase suivante. Tout ça en 5 jours ouvrés, pour 490€ HT. Si le diagnostic débouche sur un contrat Développement ou Accompagnement signé dans les 90 jours, ces 490€ sont intégralement déduits de votre première facture. Payable par Stripe ou virement. Annulation avec remboursement intégral jusqu'à 72h avant l'intake."*

### § 5, Ce que révèle votre diagnostic

See **C4** below (three cards, un seul price floor sur le path d'entrée Formation, no in-card CTAs).

### § 6, Témoignages

- **H2** (7 words): *"Ce qu'en disent les dirigeants passés par là."*
- Body: (aucun texte de section, les témoignages parlent)
- **Selection rule** (for implementation): 3 témoignages max. ≥2 doivent porter un chiffre ROI explicite (temps gagné, revenu, coût évité). Priorité à Yassine (Norloc), Valentin (Stefano/Exotic Design), Amir (BTP). Hélène (GirlsGang) et Directeur anonyme = dernière priorité sauf si l'un des trois premiers refuse la reprise.

### § 7, ROI calculator

- **H2** (6 words): *"Calculez le ROI de vos automatisations."*
- **Body** (42 words, sous-titre du calculateur):

  *"Entrez le nombre d'heures concernées, le coût horaire, l'efficacité attendue. Vous obtenez instantanément l'économie annuelle estimée et le temps de retour sur 490€. Chiffres indicatifs, le diagnostic produit l'estimation réelle pour votre cas."*

- **Technical note for implementation**: `CalculatorROI.tsx`, change default investment constant from 1500 to 490 (matches diagnostic). Keep efficiency default at 70%.

### § 8, FAQ

See **C5** (Sablia vs IAPreneurs) and **C6** (4-6 diagnostic FAQs) below.

### § 9, Footer CTA band

- **H2** (8 words): *"Prêt à voir ce qui est automatisable ?"*
- **Body** (24 words):

  *"Cinq jours, un PDF, une recommandation claire. Si le diagnostic conclut que l'IA n'a pas sa place chez vous, c'est dit aussi."*

- **Primary CTA button**: **Démarrer mon diagnostic, 490€**
- **Secondary link**: *"Préférer en discuter d'abord →"* (→ Calendly)

---

## C4. "Ce que révèle votre diagnostic", 3 cards

No CTA, no link, no `/tarifs` reference. **Seul le path d'entrée "Formation d'équipes internes" affiche un price floor** (1 500€ HT). Accompagnement et Développement : pas de prix sur homepage, discuté en 1-to-1 (norme French B2B sur les montants de ce niveau). Cards render in order Formation → Accompagnement → Développement.

### Card 1, Formation d'équipes internes

- **Title**: *"Formation d'équipes internes"*
- **Intro** (2 lignes) :

  *"Vos équipes doivent maîtriser un outil ou un workflow spécifique. On construit le curriculum sur mesure et on forme en présentiel ou à distance."*

- **Ce que votre équipe peut faire après** (bullets) :
  - Utiliser n8n ou Make pour automatiser leurs process internes sans support technique
  - Prompter correctement un LLM pour la relecture de contrats, la synthèse de réunion, le reporting
  - Auditer un nouveau process automatisable sans dépendre d'un prestataire externe

- **Price floor** : *À partir de 1 500€ HT*

### Card 2, Accompagnement

- **Title**: *"Accompagnement"*
- **Intro** (2 lignes) :

  *"Un sponsor interne porte le projet IA dans votre entreprise. On le coache chaque semaine pour qu'il délivre sans dérailler, sans over-engineering."*

- **Ce que votre équipe peut faire après** (bullets) :
  - Structurer la roadmap d'implémentation IA et la défendre en interne
  - Piloter les prestataires techniques avec les bons critères et les bons livrables
  - Décider quelles automatisations lancer, arbitrer les priorités, arrêter celles qui ne livrent pas

- **Price floor** : pas d'affichage sur homepage (chiffre discuté en 1-to-1 si recommandation en restitution de diagnostic).

### Card 3, Développement

- **Title**: *"Développement"*
- **Intro** (2 lignes) :

  *"Vous voulez que les automatisations soient construites directement par Sablia. On livre clé en main avec documentation de handoff."*

- **Ce que votre équipe peut faire après** (bullets) :
  - Exploiter des workflows n8n sur mesure (finance, ops, commercial, support)
  - Déployer des agents vocaux Dipler pour standards, relances clients, prises de rendez-vous
  - Utiliser des applications web internes (dashboards, formulaires, espaces clients)

- **Price floor** : pas d'affichage sur homepage (chiffre discuté en 1-to-1 si recommandation en restitution de diagnostic).

---

## C5. FAQ, "Sablia vs IAPreneurs"

Single Q&A, uses the differentiation statement locked in `product-v1.md §6`.

- **Q** : *"En quoi Sablia est-il différent d'IAPreneurs ?"*

- **A** :

  *"IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'intelligence artificielle. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients, Brice exerce simplement les deux rôles. IAPreneurs s'adresse à des freelances et consultants IA en construction. Sablia s'adresse à des dirigeants de PME de 10 à 250 salariés avec des process opérationnels déjà en place."*

**Règles de langage (appliquées) :** entités distinctes, indépendantes, non-co-opérantes. Brice porte les deux casquettes, aucune suggestion que les deux structures se combinent, se renforcent mutuellement, ou partagent leur pipeline client.

---

## C6. FAQ, Diagnostic-focused (6 Q&A)

### Q1, Combien coûte le Diagnostic Sablia ?

*490€ HT. TVA non applicable (art. 293 B du CGI). Paiement upfront par Stripe ou virement. Ce prix couvre l'intake, la session de deep-dive de 3 heures, la rédaction du livrable PDF de 10 à 15 pages, et la restitution d'une heure. Pas de coût caché, pas de dépassement.*

*Si, dans les 90 jours suivant la restitution, vous signez un contrat Développement ou Accompagnement avec Sablia, les 490€ sont intégralement déduits de votre première facture. Non applicable au path Formation d'équipes internes (qui reste facturé au plein tarif de sa fourchette).*

### Q2, Combien de temps ça prend ?

*Cinq jours ouvrés entre la fin de l'intake et la restitution du PDF. L'intake lui-même dure 45 minutes (un formulaire asynchrone + un appel de 15 minutes pour clarifier). Le deep-dive synchrone dure 3 heures. La restitution dure 1 heure.*

### Q3, Pour quel type d'entreprise ?

*PME de 10 à 250 salariés avec au moins un process manuel qui coûte 5 heures ou plus par semaine à l'équipe. Le diagnostic est taillé pour les structures qui ont déjà des opérations en place, pas pour valider une idée de startup. Si votre process ne saigne pas encore 5h+/semaine, attendez.*

### Q4, Que se passe-t-il après le diagnostic ?

*Le livrable PDF contient une recommandation claire parmi trois paths : formation d'équipes internes, accompagnement d'un sponsor interne, ou développement des automatisations par Sablia. Vous êtes libre de choisir n'importe lequel, de les combiner, ou de décliner, le diagnostic se tient seul, sans obligation de continuer.*

### Q5, Quelle est la politique de remboursement ?

*Jusqu'à 72 heures avant l'intake, annulation avec remboursement intégral sans justification. Une fois l'intake démarré, le diagnostic est non-remboursable, parce que le travail d'analyse commence immédiatement après.*

### Q6, Pourquoi un diagnostic payant et pas un audit gratuit ?

*Un audit gratuit dure 30 minutes et finit toujours par recommander ce que le prestataire vend. Un diagnostic payant de 5 jours cartographie réellement vos process et peut conclure qu'aucune implémentation IA n'est pertinente chez vous. On préfère qu'on vous dise ça plutôt qu'on vous vende une solution qui ne marchera pas. Le coût du diagnostic protège la qualité de la recommandation.*

---

## C7. Pricing surfacing, règle d'affichage

**Décision de release** :
1. **Aucun lien vers `/tarifs`** sur la nouvelle homepage (la page `/tarifs` actuelle rend encore la grille 9-offres historique, dissonance directe avec la nouvelle homepage ; redesign futur dans un plan séparé).
2. **Un seul price floor affiché** : 1 500€ HT sur la card "Formation d'équipes internes" (path d'entrée, niveau de prix où la transparence aide à se qualifier soi-même).
3. **Pas de price floor** sur Accompagnement (2 500€/mois) et Développement (5 000€+). Ces chiffres sont discutés en 1-to-1 lors de la restitution du diagnostic ou en appel de qualification. Conforme à la norme French B2B : les montants > 2 000€ sont généralement communiqués après un échange, pas en grille ouverte sur le site.

**Rationale** : afficher 5 000€+ sur une card refroidit le prospect avant même qu'il ait accès au diagnostic. Le diagnostic (490€ HT, crédité sur Développement ou Accompagnement signé) est la porte d'entrée ; les montants engagement-path se discutent une fois la relation amorcée.

---

## C8. Tone glossaire (règles pour toute future production Sablia)

### Tutoiement / vouvoiement

- **Vouvoiement** confirmé pour toute copie Sablia (site, emails, slides, PDFs). Cible : dirigeants PME 10-250 salariés, 45-60 ans typique, vouvoiement = B2B standard.
- Tutoiement réservé à IAPreneurs (casquette formation) et éventuellement aux internals, jamais côté Sablia client-facing.

### Termes proscrits

- **"formation" seul** → toujours qualifier : *"formation d'équipes internes"*, *"formation sur mesure"*
- **"IA" en premier hero** → préférer *"intelligence artificielle"* au premier usage, *"IA"* ensuite.
- **"agence IA"** → positionnement rejeté. Sablia = coach-implémenteur, pas agence.
- **Cadrage IAPreneurs** → toujours audiences distinctes et indépendantes. Interdire tout mot ou tournure suggérant que les deux entités co-opèrent, se complètent, ou forment un écosystème conjoint. Brice porte les deux casquettes, c'est tout.
- **Aides publiques de financement IA** → jamais évoquées dans la copie. Sablia n'y recourt pas ; le produit est vendu au plein tarif.
- **"Dipler"** → à éviter dans tout contenu partagé avec IAPreneurs ou cross-distribué. Sur sablia.io, usage ponctuel OK si contexte technique.

### Termes requis

- **CTA verbs outcome-tied** : *"Démarrer"*, *"Recevoir"*, *"Cartographier"*, *"Obtenir"*. Jamais *"Cliquer"*, *"Soumettre"*, *"Envoyer"* nu.
- **Prix en HT explicite** : toujours "490€ HT", "1 500€ HT", etc. Jamais de prix nu.
- **Singular hero rule** : un message, un CTA primaire. Le CTA secondaire est un lien texte, pas un bouton.

### Structure recommandée pour toute nouvelle section homepage

1. H2 ≤ 8 mots, tournure active
2. Body ≤ 80 mots, deliverable-tied (*"vous recevez X en Y jours"*), pas activity-tied (*"on fait X"*)
3. Optionnel : hint visuel pour design phase
4. Pas de CTA en-section (CTA primaire reste dans Hero + Footer band)

### Règle "why paid, not free"

Toujours framing **risk-reduction + wrong-path cost avoidance**, jamais seller-centric :
- ✅ *"un diagnostic payant peut conclure qu'aucune implémentation IA n'est pertinente chez vous"*
- ❌ *"mon temps coûte cher"* / *"je suis expert donc c'est payant"*

Cette règle s'applique aussi aux futures pages commerciales.

### Copie à répliquer dans CLAUDE.md

À faire en fin de session : ajouter une ligne dans `CLAUDE.md` (projet sablia-site) pointant ici : *"Tone glossaire : voir `docs/copy-v1.md §C8`"*.

---

## C9. HITL review cycle (frontmatter update upon freeze)

### Review checklist, Brice

Avant de passer en `status: frozen`, vérifier point par point :

- [ ] **C1**, Positioning statement choisi (A/B/C)
- [ ] **C2**, Hero variant choisi (A/B/C) + alternates conservés en appendix
- [ ] **C3**, Chaque H2 lu à voix haute, teste le 5-second hero rule
- [ ] **C4**, Card 1 (Formation) a bien son price floor à 1 500€ HT. Card 2 (Accompagnement) et Card 3 (Développement) n'affichent pas de prix. Aucune card n'a de CTA.
- [ ] **C5**, FAQ Sablia vs IAPreneurs lue, aucune formulation de co-opération entre les deux entités
- [ ] **C6**, FAQ Q6 (pourquoi payant) suit bien le framing risk-reduction
- [ ] **C8**, Tone glossaire cohérent avec le reste du fichier
- [ ] Grep ne doit remonter aucune occurrence des termes explicitement proscrits par le plan (aides publiques IA, co-opération IAPreneurs/Sablia, etc.)
- [ ] Grep manuel : `grep "490" docs/copy-v1.md` → ≥ 3 résultats (hero CTA, narrative §4, FAQ Q1). Mention du crédit post-audit présente dans §4 + FAQ Q1 au minimum.

### Upon freeze, update frontmatter

Lorsque la checklist ci-dessus est green, remplacer dans le frontmatter :

```yaml
status: frozen
frozen_at: YYYY-MM-DD
frozen_by: brice@sablia.io
```

et archiver les hero/positioning alternates non retenus dans l'appendix ci-dessous.

---

## Appendix, Archived alternates (post-freeze)

### C1 positioning, rejected variants

- **Variant A** (108 chars) : *"Pour les PME qui intègrent l'intelligence artificielle dans leurs opérations, par le Responsable Pédagogique IA d'IAPreneurs."*
  Rejected because : surface-level clone de B, plus long sans gain d'information.

- **Variant C** (118 chars) : *"Diagnostic IA sur mesure pour PME, par le Responsable Pédagogique et Coach Développement IA d'IAPreneurs."*
  Rejected because : over-indexe sur le titre du rôle au lieu de la promesse d'intégration.

### C2 hero H1, rejected variants

**Première série (IA-forward, jugées trop orientées marché US)** :

- A : *"L'intelligence artificielle dans vos opérations, en 5 jours."*. Rejected : hook faible, sonne générique consultant IA.
- B : *"Combien d'heures perdez-vous sur des process manuels ?"*. Rejected : oblige le prospect à se diagnostiquer lui-même avant de cliquer.
- C : *"Intégrer l'intelligence artificielle, ou apprendre qu'il ne faut pas."*. Rejected : tonalité trop contrariante pour un hero en tête de site.

**Deuxième série (repositionnée sur rythme/métaphore/anti-consulting)** :

- D : *"Votre temps est trop cher pour l'exécution manuelle."*
- F : *"Le seul diagnostic IA qui peut conclure que l'IA n'a pas sa place."*
- G : *"On regarde vos process. On dit ce qui mérite l'IA, et ce qui ne le mérite pas."*
- H : *"Arrêtez de payer des heures sur des tâches qu'une machine peut faire."*
- I : *"Vos équipes savent ce qui devrait être automatisé. Elles n'ont pas le temps de le prouver."*
- J : *"On ne vous vend pas une solution. On vous aide à décider laquelle choisir."*

Toutes rejetées au profit de E (*"Cinq jours. Un PDF. Une décision claire."*), retenue pour son rythme ternaire, sa concision, et son implicite ("décision" = décision de faire OU ne pas faire, donc positionnement coach-implémenteur plutôt que consultant-qui-vend).

---

## Changelog

- **v2 frozen (2026-04-19)** : sync avec `product-v1.md` v2 — prix 990€ HT → **490€ HT** (hero sub C2, CTA button C2 + C3§9, narrative C3§4, ROI calculator C3§7, §C7 rationale, §C8 example, §C9 grep check). Ajout du **mécanisme de crédit post-audit** : les 490€ sont déduits de la première facture si signature Développement ou Accompagnement dans les 90 jours (pas sur Formation). Mention ajoutée verbatim dans hero sub, narrative §4, FAQ Q1, §C7 rationale. `locked_decisions.price_anchor` passé à "490€ HT", nouveau champ `locked_decisions.post_audit_credit`.
- **v1 frozen (2026-04-18)** : création initiale + freeze après HITL C9. Picks : C1=B (positioning "Intégrer l'intelligence artificielle dans votre PME…"), C2=E (H1 "Cinq jours. Un PDF. Une décision claire."). Révisions appliquées en cours de /execute : em dashes supprimés partout (98 → 0), 160k → 200k+ YouTube, price floors réduits à 1 seul (Card 1 Formation uniquement, Cards 2 et 3 passent en discussion 1-to-1 per norme French B2B).
