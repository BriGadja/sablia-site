/**
 * CGV v2 (catalogue v1), ported from research/site-theophile-2026-10/cgv-v2-draft.md in the hub (drafted 26/10). Brice validated it at
 * the VP1 recette on 26/10 (« CGV ok »): the five [À CONFIRMER] points carry the recommended wording.
 * Inline markup: `**bold**` and `[À CONFIRMER : what to settle]`, which LegalText renders as a highlighted marker. The PROD slot's
 * build guard (scripts/qa/content-gates.sh --auto) fails while one remains. The text the site shipped before is cgv-v1.ts.
 */

export type CgvBlock = { kind: 'p'; text: string } | { kind: 'ul'; items: readonly string[] }

export interface CgvArticle {
  n: number
  title: string
  blocks: readonly CgvBlock[]
}

export const cgvV2 = {
  intro: 'Applicables aux clients professionnels uniquement. Dernière mise à jour : 26/10/2026.',
  articles: [
    {
      n: 1,
      title: 'Parties',
      blocks: [
        {
          kind: 'p',
          text: 'Les présentes conditions lient GACHADOAT Brice, entrepreneur individuel, exerçant sous le nom commercial Sablia (SIREN 940 901 127, siège : 60 rue François Ier, 75008 Paris), ci-après « Sablia », et toute personne exerçant une activité professionnelle qui commande une prestation, ci-après « le Client ».',
        },
      ],
    },
    {
      n: 2,
      title: "Champ d'application",
      blocks: [
        {
          kind: 'p',
          text: "Elles s'appliquent à toute commande de prestation passée auprès de Sablia. Elles ne s'adressent pas aux consommateurs. Toute condition contraire du Client est écartée, sauf accord écrit de Sablia. La commande vaut acceptation des présentes conditions.",
        },
      ],
    },
    {
      n: 3,
      title: 'Prestations',
      blocks: [
        {
          kind: 'p',
          text: "3.1. **Compte rendu d'appel** : Sablia installe, sur le CRM et la téléphonie du Client, une chaîne automatisée qui produit après chaque appel un compte rendu structuré et une tâche de relance dans le CRM. Elle est proposée en deux variantes : transcript fourni par la téléphonie, ou débrief vocal de 30 secondes. CRM couverts : HubSpot, Zoho, Pipedrive, Salesforce, Airtable, Google Sheets, Excel 365 (Excel 365 : fichier hébergé sur OneDrive ou SharePoint).",
        },
        {
          kind: 'p',
          text: "3.2. **Sur demande** : les agents vocaux et les CRM construits sur mesure ne font pas partie de l'offre ci-dessus. Ils font l'objet d'un devis écrit, remis sous 24 heures après la demande.",
        },
        {
          kind: 'p',
          text: '3.3. **Briques supplémentaires** : un besoin hors catalogue est chiffré en « briques » (un automatisme livrable en deux jours de travail de Sablia au plus). Le prix est confirmé par écrit avant toute exécution. Au-delà de deux jours de travail, un devis séparé est établi.',
        },
        {
          kind: 'p',
          text: "3.4. **Exclusions** : sauf mention contraire du devis, sont exclus les licences et abonnements du Client (CRM, téléphonie, option de transcription, n8n, hébergement), la refonte du CRM, la migration de données existantes, la formation au-delà d'un rituel de 10 minutes, l'astreinte et les interventions hors heures ouvrées.",
        },
        {
          kind: 'p',
          text: "3.5. Le périmètre exact de la commande est celui de l'offre ou du devis remis au Client.",
        },
      ],
    },
    {
      n: 4,
      title: 'Commande',
      blocks: [
        {
          kind: 'p',
          text: "La commande est ferme à la signature du contrat ou du devis, ou à la validation écrite de l'offre par le Client. Le contrat de prestation signé et son offre annexée prévalent sur les présentes conditions en cas de contradiction.",
        },
      ],
    },
    {
      n: 5,
      title: 'Prix',
      blocks: [
        {
          kind: 'p',
          text: "5.1. Les prix sont exprimés en euros hors taxes : compte rendu d'appel, 1 490 € HT ; brique supplémentaire, 1 490 € HT (990 € HT pour une brique simple d'une journée).",
        },
        {
          kind: 'p',
          text: "5.2. Option d'installation sur un serveur dédié au nom du Client : 390 € HT, une fois.",
        },
        {
          kind: 'p',
          text: '5.3. Les prix sont hors taxes ; la TVA applicable est ajoutée au taux en vigueur à la date de la facture.',
        },
        {
          kind: 'p',
          text: "5.4. Aucun frais n'est ajouté en cours de mission sans accord écrit préalable du Client.",
        },
      ],
    },
    {
      n: 6,
      title: 'Paiement',
      blocks: [
        {
          kind: 'p',
          text: "6.1. Le prix de la prestation est payable en une seule fois, à la commande, par virement, sur facture payable à réception. L'encaissement conditionne le lancement de la prestation.",
        },
        {
          kind: 'p',
          text: "6.2. Tout retard de paiement entraîne de plein droit, sans mise en demeure, des pénalités au taux de refinancement de la Banque centrale européenne majoré de 10 points, ainsi qu'une indemnité forfaitaire de recouvrement de 40 €, conformément au Code de commerce.",
        },
      ],
    },
    {
      n: 7,
      title: 'Délai de livraison',
      blocks: [
        {
          kind: 'p',
          text: "La prestation est livrée sous 7 jours calendaires à compter de l'encaissement du prix et de la réception de l'ensemble des accès nécessaires. Le délai est suspendu tant que le Client n'a pas fourni un élément qui lui incombe.",
        },
      ],
    },
    {
      n: 8,
      title: 'Recette et remboursement',
      blocks: [
        {
          kind: 'p',
          text: '8.1. Sablia remet une recette écrite : ce qui a été livré, ce qui tourne, ce qui a été testé sur 5 appels réels mis à disposition par le Client.',
        },
        {
          kind: 'p',
          text: '8.2. Le Client dispose de 5 jours ouvrés pour formuler ses réserves par écrit. À défaut, la recette est réputée acquise.',
        },
        {
          kind: 'p',
          text: '8.3. **Remboursement** : si, à la recette, le compte rendu ne fonctionne pas sur les 5 appels de test, le Client ne paie rien : les sommes versées lui sont intégralement remboursées sous 15 jours.',
        },
        {
          kind: 'p',
          text: '8.4. Après la recette, Sablia corrige sans frais toute anomalie signalée par écrit pendant 60 jours. Une demande qui ajoute ou modifie le périmètre est une évolution, chiffrée à part.',
        },
        {
          kind: 'p',
          text: "8.5. Le remboursement prévu à l'article 8.3 est écarté lorsque l'échec de la recette résulte d'un accès, d'une donnée ou d'un outil dont le Client a la maîtrise et qu'il n'a pas rendu disponible ou conforme dans les délais convenus.",
        },
      ],
    },
    {
      n: 9,
      title: 'Supervision et maintenance (optionnelle)',
      blocks: [
        { kind: 'p', text: '9.1. Trois paliers mensuels, sans engagement, premier mois offert :' },
        {
          kind: 'ul',
          items: [
            "**Socle, 149 € HT par mois** : surveillance des exécutions, reprise des échecs sous un jour ouvré, adaptation aux changements d'interface du CRM et de la téléphonie, une évolution mineure de prompt par mois, jusqu'à trois briques, jusqu'à 1 000 appels Claude par mois.",
            "**Suivi, 390 € HT par mois** : le Socle, avec réponse sous 4 heures ouvrées, une évolution cadrée par mois, jusqu'à six briques, jusqu'à 3 000 appels Claude par mois.",
            "**Partenaire, 790 € HT par mois** : le Suivi, avec joignabilité en semaine jusqu'à 20 h, deux évolutions cadrées par mois, jusqu'à 10 000 appels Claude par mois.",
          ],
        },
        {
          kind: 'p',
          text: '9.2. Au-delà du volume inclus, une évolution cadrée coûte 390 € HT ; une brique supplémentaire au-delà du palier, 49 € HT par mois (Socle). Les appels Claude au-delà du plafond sont refacturés au réel, sans marge.',
        },
        { kind: 'p', text: '9.3. Rien la nuit ni le week-end, dans aucun palier.' },
        {
          kind: 'p',
          text: '9.4. Résiliation ou changement de palier par simple courriel avant le 20 du mois, pour le mois suivant.',
        },
        {
          kind: 'p',
          text: "9.5. À l'arrêt, la chaîne continue de fonctionner chez le Client. Sablia remplace sa clé d'accès au modèle par celle du Client et assure 30 minutes de passation, puis n'intervient plus.",
        },
      ],
    },
    {
      n: 10,
      title: 'Obligations du Client',
      blocks: [
        {
          kind: 'p',
          text: "Le Client fournit les accès nécessaires, désigne un interlocuteur unique, répond aux demandes de Sablia sous 5 jours ouvrés et met à disposition les 5 appels de test. Il recueille les consentements et informe les personnes concernées pour tout enregistrement ou transcription d'appels. Sablia n'enregistre jamais un appel à la place du Client.",
        },
      ],
    },
    {
      n: 11,
      title: 'Comptes et licences',
      blocks: [
        {
          kind: 'p',
          text: "L'automatisation fonctionne sur les comptes du Client (n8n déjà détenu, n8n Cloud à son nom, ou serveur à son nom). Les licences restent à sa charge. Le compte rendu est rédigé par Claude, avec la clé d'accès de Sablia pendant la supervision.",
        },
      ],
    },
    {
      n: 12,
      title: 'Propriété',
      blocks: [
        {
          kind: 'p',
          text: 'Les automatisations livrées, leur configuration et les prompts écrits pour le Client lui appartiennent après paiement complet. Sablia conserve ses méthodes, outils internes et modèles génériques, et peut les réutiliser. Sablia peut citer la mission en référence, sauf opposition écrite du Client.',
        },
      ],
    },
    {
      n: 13,
      title: 'Confidentialité et données personnelles',
      blocks: [
        {
          kind: 'p',
          text: "Chaque partie garde confidentielles les informations de l'autre. Pour les données personnelles traitées par la chaîne, le Client est responsable de traitement et Sablia agit comme sous-traitant : elle ne les traite que sur instruction du Client, pour la prestation, et supprime ses accès à la fin de la mission ou de la supervision. Seul le texte de l'appel est transmis au modèle d'IA ; selon les conditions du fournisseur, ces données ne servent pas à entraîner ses modèles par défaut et sont effacées de ses systèmes sous 30 jours.",
        },
      ],
    },
    {
      n: 14,
      title: 'Responsabilité',
      blocks: [
        {
          kind: 'p',
          text: "Sablia est tenue d'une obligation de moyens. Sa responsabilité est plafonnée au montant hors taxes payé par le Client pour la prestation concernée. Les comptes rendus sont générés automatiquement et peuvent comporter des erreurs ou omissions ; Sablia ne répond ni des décisions commerciales prises sur leur base, ni des interruptions imputables à un service tiers (CRM, téléphonie, hébergement, fournisseur du modèle).",
        },
      ],
    },
    {
      n: 15,
      title: 'Droit applicable et juridiction',
      blocks: [
        {
          kind: 'p',
          text: "Droit français. Recherche d'une solution amiable d'abord ; à défaut, compétence exclusive du tribunal de commerce de Paris.",
        },
      ],
    },
    {
      n: 16,
      title: 'Contact',
      blocks: [{ kind: 'p', text: 'Toute question : brice@sablia.io.' }],
    },
  ] as readonly CgvArticle[],
}
