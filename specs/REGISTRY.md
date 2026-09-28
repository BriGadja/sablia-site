# Registre de specs fonctionnelles — sablia-site

> Source narrative : `../PRD.md` (documentation, 2026-03-02) et, pour la home, les briefs datés
> cités en Source. Une entrée par story visible, 5 champs (v1) ou 7 champs (v2) pour les stories clamées depuis le 2026-09-28, aucun champ vide.
> Conventions : `.claude/skills/architect/references/registry-template.md`.
> Sha de référence : SATELLITE (`projects/sablia/websites/sablia-site`, dépôt propre, gitignoré
> par le hub ; un push hub ne déploie rien). Créé le 2026-09-18 à l'alignement du run
> `2026-09-18-section-formations` ; les stories antérieures de la home sont couvertes par
> `client/src/components/landing/landing.copy.test.ts` et n'ont pas été rétro-inscrites.

Full-pass: 2026-09-18 @88fd143 (les 5 stories marchées sur la PRODUCTION par le stage 03-validate)

## US-1 — Voir la section Formations sur la home [chemin-critique]
- Surface : / (section `#formations`, après l'offre, avant l'appel final ; photo verticale de Brice face au public)
- Parcours : (cible) ouvrir sablia.io → défiler après la section Offre
- Oracle : la section porte l'accroche « Nous formons votre entreprise à l'IA, du comité de direction aux équipes. » et les trois lignes Comex et Codir · Vos équipes · Séminaires et journées d'entreprise, la preuve « responsable pédagogique d'une académie de plus de 1 400 entrepreneurs », la citation de Denis, la photo `photos/accueil-meetup-public-*.webp` rendue (`naturalWidth > 0`, QR de l'écran flouté) et le formulaire `#contact` ; aucun prix ; aucun des mots interdits (IAPreneurs, MASSA, Chatflow, Madeca, OPCO, Qualiopi, Elorri, convention de formation) dans le HTML rendu
- Exemple : Étant donné la preview Vercel de la branche `autopilot/2026-09-28-refonte-accueil-sablia` ouverte à 1440×900 / Quand on défile après la section Offre / Alors `#formations` affiche l'accroche, les trois lignes, la citation de Denis, la photo verticale à gauche du texte et le formulaire à droite, sans aucun « € » ; puis à 390 la photo passe au-dessus du texte et le formulaire reste en dernier
- Test : vitest client/src/components/landing/landing.copy.test.ts (bloc « the Formations section ») + marche navigateur 1440/390
- Statut : JAMAIS-PASSÉE
- Source : brief D10 2026-09-18, A1/A3/A4/A5 (accroche validée par Brice le 2026-09-18, preview puis prod @bc1ad63) ; amendée le 2026-09-28 (grill refonte accueil, décision 3 : photo `en-action/2026-06-19-meetup-iap-face-public.webp`, section déplacée après l'offre) — oracle élargi, donc à remarcher

## US-2 — Naviguer avec 3 items et le bouton « Réserver 30 min »
- Surface : / (TopNav, 1440 et 390)
- Parcours : (cible) ouvrir sablia.io → lire la nav ; à 390 ouvrir le menu
- Oracle : exactement 3 items dans l'ordre Offre (`/offres/compte-rendu-appel`) · Formations (`/#formations`) · Ressources (`/ressources`), plus le bouton « Réserver 30 min » qui ouvre `https://calendly.com/brice-gachadoat/30min` ; le menu mobile porte les mêmes 3 items ; le logo de la barre est le nouveau logo horizontal dès que US-12 est livrée
- Exemple : Étant donné la home à 1440 / Quand on lit la barre / Alors on lit Offre · Formations · Ressources et le bouton « Réserver 30 min » ; puis à 390 / Quand on ouvre le menu / Alors les 3 mêmes items apparaissent dans le même ordre, puis le bouton
- Test : vitest client/src/components/landing/TopNav.test.tsx
- Statut : JAMAIS-PASSÉE
- Source : brief D10 2026-09-18, A2 (5 items) ; NS-19 2026-09-22 (D7, « Ressources ») ; amendée le 2026-09-28 (grill refonte accueil, décision 3 : Offre · Formations · Ressources + « Réserver 30 min », « Cas clients » et « Contact » quittent la barre, le pied de page garde `/#contact`)

## US-6 — Lister les ressources
- Surface : /ressources
- Parcours : (cible) ouvrir sablia.io/ressources → lire la liste
- Oracle : une ressource `published=true` s'affiche en carte titre/résumé/date, triée `published_at desc` ; liste vide → « Les premières ressources arrivent avec la première vidéo » ; clé Supabase absente ou lecture en échec → « La bibliothèque est momentanément indisponible. Réessayez dans un instant. » ; nav 3 items au-dessus (Offre · Formations · Ressources, depuis le 2026-09-28)
- Statut : JAMAIS-PASSÉE
- Source : plan `sablia-machine-de-contenu.md` T24/T25/T34 (NS-19, décision D7) ; marchée en preview le 2026-09-22 avec une ressource témoin publiée puis retirée, prod = geste de Brice (Règle 15)

## US-7 — Ouvrir une ressource et la recevoir par mail [chemin-critique]
- Surface : /ressources/:slug (page détail + `RessourceForm` → `POST /api/ressources-request`)
- Parcours : (cible) ouvrir une carte de /ressources → lire le détail (vidéo YouTube si présente, corps, fichiers derrière le formulaire) → remplir prénom + email, case décochée → envoyer
- Oracle : réponse `200 { ok, files, lead }` ; les liens des fichiers s'affichent à l'écran (« C'est à vous », « Le lien vous est aussi envoyé par mail ») ; ligne `sabcrm_leads` relue avec `source='contenu'`, `owner='Brice'`, `stage='nouveau'` ; mail Resend reçu par le visiteur (« Votre ressource Sablia : {titre} ») ; slug inconnu ou `published=false` → 404 « Ressource introuvable », page en `noindex`
- Statut : JAMAIS-PASSÉE
- Source : plan `sablia-machine-de-contenu.md` T25-T28/T34 (NS-19, décision D7) ; marchée en preview le 2026-09-22 (POST réel relu en base et mail Gmail confirmé), prod = geste de Brice (Règle 15)

## US-8 — Demander à être contacté depuis une ressource
- Surface : /ressources/:slug (case « Je souhaite être contacté par Sablia », décochée par défaut) → `POST /api/ressources-request`
- Parcours : (cible) ouvrir une ressource → remplir le formulaire, cocher la case → envoyer
- Oracle : ligne `sabcrm_leads` relue avec `stage='a_contacter'`, `owner='Raphael'` (sans accent), `next_action` = « Rappeler : a demandé à être contacté depuis /ressources/{slug} » ; second mail interne envoyé à brice@sablia.io (+ Raphaël dès confirmation V3) ; case décochée → aucun de ces deux effets, `stage='nouveau'`, `owner='Brice'`
- Statut : JAMAIS-PASSÉE
- Source : plan `sablia-machine-de-contenu.md` T27/T28/T34 (NS-19, décision D7) ; marchée en preview le 2026-09-22, prod = geste de Brice (Règle 15)

## US-3 — Lire la home à la voix « nous »
- Surface : / (toutes sections ; la section fondateur `#equipe` a quitté la home le 2026-09-28) et `/llms.txt`
- Parcours : (cible) lire la home entière et `llms.txt`
- Oracle : « Notre fondateur » présent dans `#formations` et dans `llms.txt` ; aucun « avec lui » / « par lui » / « tient lui-même » dans les sources de la home ni dans `llms.txt` ; `llms.txt` porte « Séminaires et formations : sur demande, prix non publié » ; `landing.copy.test.ts` vert
- Exemple : Étant donné les sources de la home et `client/public/llms.txt` / Quand on cherche « par lui », « avec lui », « tient lui-même » / Alors aucune occurrence ; et « Notre fondateur » se lit dans la section Formations (« Notre fondateur est responsable pédagogique… ») et dans `llms.txt`
- Test : vitest client/src/components/landing/landing.copy.test.ts (bloc « the voice is « nous » »)
- Statut : JAMAIS-PASSÉE
- Source : brief D10 2026-09-18, A6/A9 (validée @88fd143 quand `#equipe` existait) ; amendée le 2026-09-28 (grill refonte accueil, décision 4 : TeamSection retirée, la voix reste « nous » sur toute la home)

## US-9 — Voir le premier écran : la photo, la fiche qui se remplit, le titre, le bouton [chemin-critique]
- Surface : / (section hero, 1440 et 390)
- Parcours : (cible) ouvrir sablia.io → lire le premier écran sans défiler
- Oracle : fond clair ; `h1` = « Le CRM qui se remplit tout seul après chaque appel » (`of1.title`) ; la photo `photos/accueil-meetup-ecran-*.webp` rendue (`naturalWidth > 0`), le QR et le texte de la diapositive floutés ; par-dessus la photo, une fiche CRM « Catherine Durand · à jour » avec 4 champs (Besoin, Échéance, Décideurs, Relance) dont les barres se remplissent l'une après l'autre (animation de la maquette 2 ; `prefers-reduced-motion` → barres pleines, immobiles) ; un seul bouton « Réserver 30 min » qui ouvre `https://calendly.com/brice-gachadoat/30min` ; à 390, le bas du bouton est à moins de 844 px du haut de page ; le délai n'est jamais écrit en dur sur la home, il se lit dans le module OF-1 (`of1.delay.days`)
- Exemple : Étant donné la preview à 1440×900 / Quand la page s'ouvre / Alors le titre et le bouton sont à gauche, la photo à droite avec la fiche « Catherine Durand » en haut à gauche de la photo, et la barre « Besoin » se remplit avant « Échéance » ; puis à 390×844 / Quand la page s'ouvre / Alors titre, bouton puis photo (4:5, fiche par-dessus) s'empilent et le bouton est visible sans défiler
- Test : vitest client/src/components/landing/HeroSection.test.tsx + marche navigateur 1440/390 (`getBoundingClientRect`, `naturalWidth`)
- Statut : JAMAIS-PASSÉE
- Source : grill refonte accueil 2026-09-28, décisions 2 et 5 (la 5 renversée par Brice le même jour : l'accueil affiche le délai, lu dans le module) ; maquette 2 du 2026-09-25 (`research/site-audit-2026-09/visual-2026-09-25/maquettes/index.html` #m2) ; photo `projects/sablia/contenu/en-action/README.md`

## US-10 — Voir l'offre, sa vidéo et ses preuves
- Surface : / (section `#offre`, après la bande des CRM compatibles)
- Parcours : (cible) ouvrir sablia.io → défiler après la bande des CRM → cliquer sur la vidéo
- Oracle : une carte OF-1 avec `of1.title`, `of1.promise`, « 1 490 € HT », « Livré en 7 jours » (lu dans `of1.delay.days`, jamais écrit en dur), la garantie `of1.guarantee` mot pour mot et le lien « Voir l'offre et son prix » vers `/offres/compte-rendu-appel` ; à côté, la vidéo YouTube `d5fo00AFqVM` en façade (miniature locale + bouton lecture, AUCUN iframe avant le clic) ; au clic, un iframe `https://www.youtube-nocookie.com/embed/d5fo00AFqVM?autoplay=1` remplace la façade ; sous les deux, la ligne « Déjà en production chez nos clients : 289 appels sur 326 décrochés ont eu une suite concrète, soit 89 %, et 68 rendez-vous posés sans un seul appel manuel. » ; ni carte « Bientôt : la relance », ni « 149 €/mois » sur la home
- Exemple : Étant donné la home en preview / Quand on lit `#offre` sans cliquer / Alors aucun `<iframe>` n'existe dans la page ; puis Quand on clique sur la façade / Alors un `<iframe src="https://www.youtube-nocookie.com/embed/d5fo00AFqVM?autoplay=1">` est monté et la vidéo démarre ; et la ligne de preuve porte « 289 », « 326 », « 89 % » et « 68 rendez-vous »
- Test : vitest client/src/components/landing/OffreSection.test.tsx
- Statut : JAMAIS-PASSÉE
- Source : grill refonte accueil 2026-09-28, décisions 3, 4 et 5 (la 5 renversée par Brice le même jour : la carte affiche le délai) ; vidéo relue dans `contenu_videos` (`slug=2026-09-28-demo-of1`, `statut=en_ligne`, `youtube_id=d5fo00AFqVM`) ; chiffres P-7/P-8 du dossier de preuve (`ProofSection.tsx` jusqu'au 2026-09-28). La phrase « Déjà en production… » est l'une des 2 phrases nouvelles montrées à Brice sur la preview

## US-11 — Réserver depuis l'appel final
- Surface : / (dernière section avant le pied de page)
- Parcours : (cible) ouvrir sablia.io → défiler jusqu'en bas → cliquer sur « Réserver 30 min »
- Oracle : un titre nouveau (phrase montrée à Brice sur la preview, proposition : « Trente minutes pour voir si ça tourne chez vous. »), le paragraphe existant « 30 minutes en partage d'écran… » et un bouton « Réserver 30 min » qui ouvre `https://calendly.com/brice-gachadoat/30min` (`window.open`, événement `book_call`) ; les deux liens « Pas encore prêt à parler ? » (guide, questionnaire) restent
- Exemple : Étant donné la home en preview / Quand on clique sur « Réserver 30 min » en bas de page / Alors `window.open` est appelé avec `https://calendly.com/brice-gachadoat/30min` et l'événement Vercel `book_call` porte `path='/'`
- Test : vitest client/src/components/landing/CalloutSection.test.tsx
- Statut : JAMAIS-PASSÉE
- Source : grill refonte accueil 2026-09-28, décisions 3 et 6 (2 phrases nouvelles seulement : la ligne de preuve et ce titre)

## US-12 — Voir le nouveau logo et la nouvelle favicon [script]
- Surface : barre de navigation (logo horizontal), onglet du navigateur (`favicon.svg`, `favicon.png`, `favicon.ico`, `apple-touch-icon.png`, icônes du `manifest.json`), `client/index.html` (`"logo"` du schema.org), `og-image-home.png` / `og-image.png` / `twitter-image*.png`
- Parcours : `[script] python3 scripts/brand-check.py` puis ouvrir sablia.io et lire l'onglet
- Oracle : aucun des fichiers livrés n'a le md5 des fichiers dérivés de la marque Madeca (`logo.svg`/`favicon.svg` 4c3f1d0252d598cca15b797b8253d470, `wordmark-dark.svg` 852204724faaebdfbe7665d6c21a6200, `wordmark-light.svg` 0abb16676047c931cdb3f48e229e9570, `favicon.ico` 4ab52fa3e811d0d50586c4400249480b, `og-image-home.png` 1c8aa119291b0c3959eb47f114eb4ec6) ; `favicon.ico` contient les tailles 16, 32 et 48 ; les 4 images OG font 1200×630 ; le SVG du symbole ne contient aucun `<image>` bitmap ; la piste retenue est celle que Brice a choisie parmi ≥ 3 propositions Claude Design ; couleur #D97757
- Exemple : Étant donné les fichiers de `client/public/` après export / Quand `python3 scripts/brand-check.py` tourne / Alors il sort 0 et liste les 5 md5 remplacés, les 3 tailles de l'ICO et 4 × « 1200×630 » ; puis Étant donné sablia.io ouvert dans le navigateur partagé / Quand on lit l'onglet et la barre / Alors la favicon et le logo sont ceux de la piste choisie
- Test : [script] python3 scripts/brand-check.py
- Statut : JAMAIS-PASSÉE
- Source : grill refonte accueil 2026-09-28, décision 7 (logo actuel = marque Madeca tournée de 90°, vérifié ; interdit : deux triangles joints par la pointe avec des chevrons ; livraison favicon avant le 2026-10-22, site avant le 2026-10-09 même si le logo traîne) ; choix de piste = point de validation Brice

## US-13 — Lire les questions de l'accueil sur la page offre
- Surface : /offres/compte-rendu-appel (section `#faq`)
- Parcours : (cible) ouvrir la page offre → défiler jusqu'à la FAQ → ouvrir une question
- Oracle : la FAQ liste les 5 questions d'OF-1 (`of1.faq`) puis les 5 questions qui vivaient sur l'accueil jusqu'au 2026-09-28 (Devrons-nous changer de CRM ? · Quel budget prévoir ? · Combien de temps avant la mise en production ? · Nous n'avons personne sur l'IA en interne. · Quelles garanties sur la sécurité de nos données ?) avec leurs réponses d'alors, chiffres lus dans le module OF-1 ; le JSON-LD `FAQPage` de la page compte 10 questions
- Exemple : Étant donné la page offre / Quand on ouvre « Devrons-nous changer de CRM ? » / Alors on lit « Non. Nous nous adaptons à votre outil (HubSpot, Zoho, Pipedrive, Salesforce, Airtable). Vous conservez votre stack. » ; et le script `application/ld+json` FAQPage porte 10 entrées `Question`
- Test : vitest client/src/content/of1.copy.test.ts (bloc « structured data ») + vitest client/src/components/offre/OffreFaq.test.tsx
- Statut : JAMAIS-PASSÉE
- Source : grill refonte accueil 2026-09-28, décision 4 (FaqSection quitte la home ; toute question que la page offre n'avait pas y est reportée)

## US-4 — Envoyer une demande de contact [chemin-critique]
- Surface : / (formulaire `#contact` dans la section Formations, aussi via le lien « Nous écrire » du pied de page ; « Contact » a quitté la nav le 2026-09-28) → `POST /api/contact` (fonction Vercel)
- Parcours : (cible) remplir nom, société, email, taille d'équipe, texte libre → envoyer
- Oracle : mail reçu dans brice@sablia.io (Resend, `send.sablia.io`) ET ligne `sabcrm_leads` relue avec `source = 'formation'`, owner Brice ; aucune ligne `sabcrm_lead_sequences` pour ce lead
- Statut : VALIDÉE 2026-09-18 @88fd143 (PROD)
- Source : brief D10 2026-09-18, A7, AC-5/AC-6 ; hébergement fonction Vercel — validé par Brice le 2026-09-18. **Marchée sur la PRODUCTION par 03-validate le 2026-09-18** : formulaire rempli dans le navigateur partagé sur `https://sablia.io/#contact`, honeypot vide, 7,6 s après le montage → `POST /api/contact` **200**, bloc de succès rendu ; ligne `981f7fc8-20e8-41e8-a855-c5622a3f5cd2` relue (`source='formation'`, `owner='Brice'`, `stage='nouveau'`, `updated_by='sablia-site/api/contact'`), **0 ligne dans les 6 tables filles** lues AVANT la suppression, puis `delete … returning` 1 ligne et relecture à 0 (base revenue de 138 à 137, 0 orphelin). Le 200 prouve que le runtime de PRODUCTION lit bien `RESEND_API_KEY` et `SUPABASE_SERVICE_ROLE_KEY` (sinon 500 `not_configured` ou 502 `mail_failed`). Preuve antérieure conservée : envoi de 02-execute sur la preview `sablia-site-git-autopilot-2026-d7c176-brices-projects-c5e1ba72.vercel.app` (lead `ef4b285d-4fb0-4d6e-9d5a-4c6bc57bfe69`, supprimé), mail Gmail `1a0b3ef5656b9a04` confirmé par l'orchestrateur

## US-5 — Rejeter un envoi automatisé ou invalide [script]
- Surface : `POST /api/contact`
- Parcours : `curl` × 3 : champ caché rempli ; délai < 3 s ; payload sans email
- Oracle : 204 sans mail ni ligne en base pour les deux premiers ; 400 pour le troisième
- Statut : VALIDÉE 2026-09-18 @88fd143
- Source : brief D10 2026-09-18, A7, AC-5
