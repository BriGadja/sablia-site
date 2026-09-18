# Registre de specs fonctionnelles — sablia-site

> Source narrative : `../PRD.md` (documentation, 2026-03-02) et, pour la home, les briefs datés
> cités en Source. Une entrée par story visible, 5 champs, aucun champ vide.
> Conventions : `.claude/skills/architect/references/registry-template.md`.
> Sha de référence : SATELLITE (`projects/sablia/websites/sablia-site`, dépôt propre, gitignoré
> par le hub ; un push hub ne déploie rien). Créé le 2026-09-18 à l'alignement du run
> `2026-09-18-section-formations` ; les stories antérieures de la home sont couvertes par
> `client/src/components/landing/landing.copy.test.ts` et n'ont pas été rétro-inscrites.

Full-pass: 2026-09-18 @88fd143 (les 5 stories marchées sur la PRODUCTION par le stage 03-validate)

## US-1 — Voir la section Formations sur la home [chemin-critique]
- Surface : / (section `#formations`, après Cas clients, avant l'appel à l'action)
- Parcours : (cible) ouvrir sablia.io → défiler après « Cas clients »
- Oracle : la section porte l'accroche « Nous formons votre entreprise à l'IA, du comité de direction aux équipes. » et les trois lignes Comex et Codir · Vos équipes · Séminaires et journées d'entreprise, la preuve « responsable pédagogique d'une académie de plus de 1 400 entrepreneurs », la citation de Denis ; aucun prix ; aucun des mots interdits (IAPreneurs, MASSA, Chatflow, Madeca, OPCO, Qualiopi, Elorri, convention de formation) dans le HTML rendu
- Statut : VALIDÉE 2026-09-18 @bc1ad63
- Source : brief D10 2026-09-18, A1/A3/A4/A5, AC-1/AC-3 ; accroche élargie au-delà du séminaire — validée par Brice le 2026-09-18 (preview puis prod, 1440 et 390)

## US-2 — Naviguer avec 5 items
- Surface : / (TopNav, 1440 et 390)
- Parcours : (cible) ouvrir sablia.io → lire la nav ; à 390 ouvrir le menu
- Oracle : exactement 5 items dans l'ordre Offres · Méthode · Cas clients · Formations · Contact, plus le bouton rendez-vous
- Statut : VALIDÉE 2026-09-18 @88fd143
- Source : brief D10 2026-09-18, A2, AC-2

## US-3 — Lire la home à la voix « nous »
- Surface : / (toutes sections, dont `#equipe`) et `/llms.txt`
- Parcours : (cible) lire la section fondateur et `llms.txt`
- Oracle : « Notre fondateur » présent ; aucun « avec lui » / « par lui » / « tient lui-même » ; `llms.txt` porte « Séminaires et formations : sur demande, prix non publié » ; `landing.copy.test.ts` vert
- Statut : VALIDÉE 2026-09-18 @88fd143
- Source : brief D10 2026-09-18, A6/A9, AC-4/AC-7

## US-4 — Envoyer une demande de contact [chemin-critique]
- Surface : / (formulaire `#contact` dans la section Formations, aussi via nav « Contact » et pied de page) → `POST /api/contact` (fonction Vercel)
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
