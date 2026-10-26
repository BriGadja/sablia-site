/**
 * The CGV the site shipped before v2 (last updated 20/04/2026), kept verbatim as the fallback: if Brice
 * does not validate cgv-v2.ts at VP1, this text ships and TODO t-20260929-01 stays open.
 * Same inline markup as cgv-v2.ts (`**bold**`); the contact e-mail is written plain and linked by LegalText.
 */
import type { CgvArticle } from './cgv-v2'

export const cgvV1 = {
  intro:
    "Conditions applicables à toute prestation Sablia — Diagnostic Sablia et paths post-audit (Formation d'équipes internes, Accompagnement, Développement).",
  updated: 'Dernière mise à jour : 20/04/2026.',
  articles: [
    {
      n: 1,
      title: 'Parties',
      blocks: [
        {
          kind: 'p',
          text: "Les présentes conditions régissent les prestations entre d'une part GACHADOAT Brice, entrepreneur individuel (SIREN 940 901 127), exerçant sous le nom commercial Sablia, et d'autre part le client signataire du bon de commande ou acceptant le paiement en ligne du Diagnostic Sablia.",
        },
      ],
    },
    {
      n: 2,
      title: 'Objet',
      blocks: [
        { kind: 'p', text: 'Les prestations Sablia couvrent quatre types de missions :' },
        {
          kind: 'ul',
          items: [
            "**Diagnostic Sablia** — audit de 5 jours ouvrés débouchant sur un livrable PDF de 10 à 15 pages et une restitution d'une heure. Prix : 490€ HT.",
            "**Formation d'équipes internes** — montée en compétence ciblée sur 1 à 3 jours. Prix : à partir de 1 500€ HT, chiffré au cas par cas.",
            "**Accompagnement** — coaching d'un sponsor interne sur 4 à 12 semaines. Prix mensuel chiffré en restitution de diagnostic.",
            "**Développement** — construction clé en main d'automatisations, workflows, agents vocaux ou applications web. Chiffrage par périmètre après diagnostic.",
          ],
        },
      ],
    },
    {
      n: 3,
      title: 'Prix et TVA',
      blocks: [
        {
          kind: 'p',
          text: "Tous les prix sont exprimés en euros hors taxes. En application de l'article 293 B du CGI, la TVA n'est pas applicable (régime de la franchise en base). Aucun coût caché n'est appliqué en cours de mission.",
        },
      ],
    },
    {
      n: 4,
      title: 'Paiement',
      blocks: [
        {
          kind: 'p',
          text: "Le Diagnostic Sablia est payable d'avance, par carte bancaire via Stripe ou par virement. Les autres prestations (Formation, Accompagnement, Développement) font l'objet d'un bon de commande spécifique fixant échéance et modalités de règlement.",
        },
        {
          kind: 'p',
          text: "En cas de retard de paiement, les pénalités de retard sont calculées au taux d'intérêt appliqué par la Banque centrale européenne à son opération de refinancement la plus récente, majoré de 10 points, conformément au Code de commerce.",
        },
      ],
    },
    {
      n: 5,
      title: 'Crédit post-audit',
      blocks: [
        {
          kind: 'p',
          text: "Les 490€ HT du Diagnostic Sablia sont intégralement déduits de la première facture si le client signe un contrat **Développement** ou **Accompagnement** dans les 90 jours calendaires suivant la restitution. Ce crédit n'est pas applicable au path **Formation d'équipes internes**, qui est facturé au plein tarif de sa fourchette.",
        },
      ],
    },
    {
      n: 6,
      title: 'Annulation et remboursement',
      blocks: [
        {
          kind: 'p',
          text: "Le client peut annuler sa commande de Diagnostic Sablia jusqu'à 72 heures avant le début de l'intake. Dans ce délai, le remboursement est intégral, sans justification. Passé ce délai ou une fois l'intake entamé, le diagnostic est non-remboursable, le travail d'analyse ayant déjà commencé.",
        },
      ],
    },
    {
      n: 7,
      title: 'Délais',
      blocks: [
        {
          kind: 'p',
          text: "Sablia s'engage à livrer le PDF du Diagnostic dans un délai de 5 jours ouvrés à compter de la fin de l'intake synchrone. Tout dépassement est notifié au client dans les 24 heures avec cause et nouveau créneau de livraison.",
        },
      ],
    },
    {
      n: 8,
      title: 'Propriété des livrables',
      blocks: [
        {
          kind: 'p',
          text: "Les livrables produits dans le cadre d'une mission (PDF de diagnostic, code source, workflows n8n, agents vocaux, documentation) sont cédés au client dès règlement complet. Sablia conserve le droit de mentionner la mission en référence commerciale, sauf opposition écrite du client.",
        },
      ],
    },
    {
      n: 9,
      title: 'Confidentialité',
      blocks: [
        {
          kind: 'p',
          text: "Toute information transmise par le client dans le cadre d'une mission Sablia est traitée confidentiellement. Un NDA peut être signé sur demande avant l'intake.",
        },
      ],
    },
    {
      n: 10,
      title: 'Responsabilité',
      blocks: [
        {
          kind: 'p',
          text: "Sablia est tenu à une obligation de moyens. La responsabilité de Sablia est limitée au montant TTC de la prestation concernée. Sont exclus les dommages indirects, notamment la perte de chiffre d'affaires, de clientèle ou de données liée à un dysfonctionnement des outils tiers (n8n, Dipler, Supabase, etc.).",
        },
      ],
    },
    {
      n: 11,
      title: 'Droit applicable et juridiction',
      blocks: [
        {
          kind: 'p',
          text: "Les présentes CGV sont régies par le droit français. Tout différend relève, à défaut d'accord amiable, des tribunaux compétents du ressort du siège de l'éditeur.",
        },
      ],
    },
    {
      n: 12,
      title: 'Contact',
      blocks: [
        {
          kind: 'p',
          text: 'Toute question relative aux présentes conditions peut être adressée à brice@sablia.io.',
        },
      ],
    },
  ] as readonly CgvArticle[],
}
