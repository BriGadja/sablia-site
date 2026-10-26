# Product

<!-- impeccable:product-schema 1 -->

> Provenance: the init interview was answered from sources, not held live: the two site grills
> (`research/site-theophile-2026-10/decisions.md` 16/10, `decisions-lot2.md` 19/10, 21 questions answered by
> Brice), `memory/identity/` (PROFILE, GOALS), and competitor sites looked at on 2026-10-24. [ASSUMED] marks
> what no source says. Nothing here is a visual decision; the charte is chosen on the mockup canvas.

## Platform

web

## Users
- Primary: owners and sales managers of French small companies with 2 to 20 salespeople, who keep their
  customers in HubSpot, Pipedrive, Zoho, Salesforce, Airtable, or a plain Google Sheets / Excel. Job: stop
  losing what was said on a call; have the record and the follow-up written without retyping.
- Secondary: teams who want to learn Claude (trainings, seminars, workshops), and visitors comparing Brice
  with other experts of the Noésia school.

## Product Purpose
sablia.io sells one offer, « Compte rendu d'appel »: when a salesperson hangs up, Claude writes the call
report into the CRM record and creates the dated follow-up. 1 490 € HT once, running in 7 days, refunded if
it does not work on 5 real test calls. Everything else (automations, apps, trainings, voice agents on
request) is shown as proof, and every button leads to the same 30-minute call. Success = a booked call.

## Positioning
Claude installed inside the tools the company already has (its CRM, its telephony, its n8n), at a fixed
small price, by a person who also teaches it (expert of the Noésia school, 1 400+ students). Call-intelligence
SaaS sell a new platform and seats; Sablia writes into the CRM the client already pays for.

## Operating Context
- The demo: a voice note dictated after a call fills the HubSpot record 40 seconds later (measured on our
  demo, 08/09). Variant A reads the transcript the telephony already produces; variant B is a 30 s voice note.
- Visitors arrive from Brice's LinkedIn and YouTube, the Noésia experts page (where Théophile's site is one
  click away), a link sent by Raphaël after a sales call, and word of mouth. [ASSUMED] phone first from
  LinkedIn, desktop when deciding.

## Capabilities and Constraints
- No client company is named on the site (sector only); exceptions: Hélène (first name + job) and the Noésia
  school. Never a headcount. « Nous » everywhere; Brice is the only face.
- As little text as possible: each section = a title of 7 words or fewer + at most one line; the animation
  carries the logic (Brice, 19/10).
- Voice agents exist « sur demande » only, never as part of the offer.
- Stack of the live site: Vite + React (lot 3 re-examines it).

## Brand Commitments
- Name « Sablia » (from « sablier », hourglass). Logo: an S drawn as an hourglass, from Brice's own sketch
  (29/09). The sand image « Goulot » (an hourglass drawn by falling sand) was picked by Brice for his LinkedIn
  banner on 14/10 (`projects/sablia/assets/brand/linkedin-banner/`).
- Not the Anthropic/Claude look: Brice judged a cream + serif + terracotta page « très généré par IA » and
  « trop Claude » (19/10). The current coral `#D97757` is exactly Anthropic's « Clay ».
- Théophile's site is the reference for flow and motion, never for its look (grid paper, electric blue,
  yellow, offset shadows) or copy (16/10).

## Evidence on Hand
- Figures: 1 400+ élèves · 30+ ateliers · 4 masterclass · module Claude Code 10 h, 29 vidéos (declared);
  40 s (measured); 68 rendez-vous on the voice card (measured); « plus de 20 clients accompagnés depuis 2025 »
  (declared). Full table in `decisions-lot2.md` § Figures.
- Brice's real photos and videos (`projects/sablia/contenu/`); written testimonials (Denis, Vassili, Franky).
- No client logo, no client video testimonial yet: do not fabricate any.

## Product Principles
1. Show it working: a real CRM record changing state beats any sentence.
2. One door: every action leads to the same 30-minute call.
3. Nothing invented: a missing fact is a placeholder, never a plausible fake.
4. Plain French, short, « nous ».

## Accessibility & Inclusion
WCAG 2.2 AA; loops over 5 s get a pause control; reduced motion shows final states.

## Audience & secteur

> Written 2026-10-24 for the charte round (design phase step 0). Sources above; competitors looked at in
> headless captures on 2026-10-24: modjo.ai, noota.io, claap.io, ringover.fr, gong.io, maitrise-enfin-ia.com.

**Le métier et son esprit.** Installer Claude dans le CRM d'une petite équipe commerciale : après l'appel,
la fiche est à jour et la relance posée. L'esprit attendu est celui d'un outil fiable et précis, pas d'une
promesse « IA ». Les logiciels voisins (Modjo, Noota, Gong, Ringover) se présentent tous pareil : fond blanc,
bleu ou violet, captures d'écran dans des cadres en dégradé, parfois un robot mascotte (Ringover) ou des
capitales condensées (Modjo). Claap est le seul à avoir un monde à lui, un grand paysage peint, et c'est le
plus mémorable. Côté experts IA (Théophile) : papier quadrillé, bleu électrique, jaune, photo dans un cercle.

**Qui arrive sur le site.** Un dirigeant ou un responsable commercial pressé, sollicité chaque semaine par
des offres « IA », donc méfiant. Ses doutes sont les 9 questions de la FAQ : mon CRM ? vous enregistrez nos
appels ? où vont nos données ? combien ? qui fait le travail ? Il vient vérifier que ça marche sur un vrai
CRM, voir le prix et le risque, et qu'il y a une vraie personne derrière. Une partie compare avec Théophile.

**Ce qui rassure, ce qui plaît.** Une vraie fiche CRM qui se remplit sous ses yeux ; les logos de ses outils ;
le prix et le remboursement affichés ; une personne nommée avec un parcours (LVMH, MeltOne, Noésia) ; un
chiffre mesuré (40 s). Ce qui plaît : la logique visible en animation, peu de texte.

**Codes à garder.** L'interface produit montrée en vrai, des blocs sombres pour les moments forts, un seul
appel à l'action, des chiffres concrets. **À éviter** : le look Claude (crème, titre à empattement, argile
`#D97757`), le bleu et le violet de la catégorie, les dégradés, les robots, étincelles et cerveaux, les
captures en cadre dégradé, le quadrillage et le jaune de Théophile, les ombres décalées.

**Contraintes de style (vérifiables sur une capture).**
1. Tempo : vif et précis, le mouvement montre une cause puis son effet ; il ne décore pas.
2. Densité : moyenne ; un objet animé et un titre court par section ; aucune bande vide de plus d'un tiers
   d'écran ; aucun décor répété sur tout l'écran.
3. Couleur : un neutre profond pour les blocs, un fond clair qui n'est pas crème, UNE couleur de signal qui
   n'est ni le bleu/violet de la catégorie ni l'argile d'Anthropic ; texte à 4,5:1 au moins.
   **Arbitrage de Brice (24/10, round 11 de la maquette)** : « les changements de couleur sont okay » pour la palette
   « désert au crépuscule » : fonds sable `#F4ECDD` et rose du soir `#F2E3DF`, un bandeau violet du soir très sombre
   `#262038`, des crêtes de dunes. Ils priment sur « pas crème » et « pas violet » ci-dessus ; un critique ne les
   compte plus comme écarts. Restent interdits : le violet vif de la catégorie, l'argile `#D97757`, le titre à empattement.
4. Imagerie : l'interface dessinée porte l'explication ; la signature est le sable et le S-sablier ; la seule
   photo humaine est Brice ; jamais de robot, de visage généré ni de poignée de main.
5. Voix : « nous », phrases courtes, français simple.

**Matériel propre à Sablia (signature possible).** Le S-sablier du croquis de Brice ; le sable « Goulot » ;
le compteur 00:00 → 00:40 de la vraie mesure ; le parcours LVMH → MeltOne → Sablia → Noésia ; les photos et
vidéos de Brice.
