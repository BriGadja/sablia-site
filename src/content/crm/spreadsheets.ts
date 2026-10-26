/**
 * The two spreadsheet pages of OF-1 (`google-sheets`, `excel-365`), added by the lot-2 grill
 * (L2-3, 2026-10-19). Unlike the four CRM pages they carry no `facts` table: there is no hub
 * ledger of vendor documentation for them, so every sentence below restates the hub offer file
 * (`projects/sablia/offre/of-1-compte-rendu-appel.md`) and nothing else. Price, delay and guarantee
 * come from `of1` at render time, never typed here.
 */
import { eurHt } from '@/lib/format'
import { of1 } from '../of1'
import { crmPath, type CrmView } from './view'

export const SPREADSHEET_SLUGS = ['google-sheets', 'excel-365'] as const
export type SpreadsheetSlug = (typeof SPREADSHEET_SLUGS)[number]

export interface SpreadsheetPage extends CrmView {
  slug: SpreadsheetSlug
  seo: { title: string; description: string }
}

const price = eurHt(of1.price.oneShotHt)

export const SPREADSHEET_PAGES: Record<SpreadsheetSlug, SpreadsheetPage> = {
  'google-sheets': {
    slug: 'google-sheets',
    tool: 'Google Sheets',
    path: crmPath('google-sheets'),
    seo: {
      title: "Compte rendu d'appel dans Google Sheets : fiche et relance automatiques",
      description:
        'Votre suivi commercial vit dans un Google Sheets ? Chaque appel y laisse son compte rendu et sa relance, sans que le commercial ouvre la feuille.',
    },
    hero: {
      title: 'Google Sheets rempli après chaque appel.',
      lead: "Votre CRM est un Google Sheets ? L'offre le couvre, au même prix qu'un CRM du marché. La chaîne écrit le compte rendu de l'appel et la relance dans votre feuille, et le commercial n'a pas à l'ouvrir.",
    },
    blocks: [
      {
        heading: 'Ce que votre feuille reçoit',
        body: "À chaque appel, une synthèse structurée est écrite dans la feuille que votre équipe utilise déjà, rangée dans vos champs et avec vos étapes de vente. La relance est créée avec sa date et son propriétaire. Le prompt est adapté à votre vocabulaire, pas à un modèle générique.",
      },
      {
        heading: 'Deux façons de téléphoner, une seule feuille',
        body: "Vos commerciaux appellent depuis une téléphonie d'entreprise comme Ringover ou Aircall : la variante A lit le transcript que cette téléphonie produit déjà. Ils appellent depuis un portable classique : la variante B leur demande trente secondes de note vocale en raccrochant. Dans les deux cas, nous ne faisons jamais enregistrer un appel à votre place.",
      },
      {
        heading: 'Une feuille qui existe et qui vit',
        body: "Nous ne vendons pas le CRM, nous le remplissons : la feuille doit déjà être tenue par votre équipe. Les accès nous sont confiés au cadrage de 30 minutes. Reprendre vos données existantes dans une autre structure ne fait pas partie de l'offre.",
      },
      {
        heading: 'Pas de feuille tenue, pas de CRM ?',
        body: "Nous pouvons le construire avec vous : un tableur bien tenu, un CRM du marché configuré pour vous, ou un outil sur mesure. Cela ne fait pas partie de cette offre et se chiffre à part, sous 24 heures.",
        warn: true,
      },
    ],
    faq: [
      {
        q: 'Mon CRM est un Google Sheets : est-ce couvert ?',
        a: `Oui. Google Sheets figure parmi les outils couverts, aux conditions de l'offre : ${price}, livré en ${of1.delay.days} jours, remboursé si cela ne tourne pas sur vos 5 appels de test.`,
      },
      {
        q: "Et si mon outil n'est ni un tableur ni un CRM de la liste ?",
        a: "Un autre outil ouvert aux intégrations, par API ou par MCP, peut convenir. Nous confirmons la faisabilité sous 24 heures, sans engagement de votre part.",
      },
      {
        q: 'Qui garde la main sur mon fichier ?',
        a: "Vous. Le flux tourne sur votre n8n, à votre nom, et la feuille reste dans votre compte. Même sans supervision, le flux garde sa place chez vous et ne s'éteint pas.",
      },
    ],
  },
  'excel-365': {
    slug: 'excel-365',
    tool: 'Excel 365',
    path: crmPath('excel-365'),
    seo: {
      title: "Compte rendu d'appel dans Excel 365 : fiche et relance automatiques",
      description:
        "Votre suivi commercial est un classeur Excel 365 dans OneDrive ou SharePoint ? Chaque appel y dépose le compte rendu et la tâche de relance, automatiquement.",
    },
    hero: {
      title: 'Excel 365 à jour après chaque appel.',
      lead: "Votre CRM est un classeur Excel 365 ? L'offre le couvre, à une condition : que le fichier vive dans OneDrive ou SharePoint. Le compte rendu et la relance s'y écrivent seuls.",
    },
    blocks: [
      {
        heading: 'La condition : OneDrive ou SharePoint',
        body: "Excel 365 est joignable par la chaîne seulement si le classeur se trouve dans OneDrive ou SharePoint. Un fichier posé sur un seul poste n'est pas joignable. C'est la première vérification de notre cadrage de 30 minutes.",
      },
      {
        heading: 'Ce que votre classeur reçoit',
        body: "Après chaque appel, une synthèse structurée est ajoutée au classeur : vos étapes de vente, vos objections, vos champs. La relance part datée, au nom du bon commercial. Aucun besoin de rouvrir Excel pour recopier une note.",
      },
      {
        heading: 'Téléphonie ou note vocale, même classeur',
        body: "Avec une téléphonie qui produit un transcript, la variante A suffit et vos équipes ne changent rien. Avec des portables classiques, la variante B passe par une note vocale de trente secondes dictée au raccroché. Aucun appel n'est enregistré par nos soins.",
      },
      {
        heading: 'Le fichier est sur un seul poste',
        body: "Alors la chaîne ne peut pas l'atteindre. Deux issues : le déplacer dans OneDrive ou SharePoint, ou passer à un CRM, que nous pouvons construire ou configurer avec vous. Ce chantier-là est hors de cette offre et chiffré sous 24 heures.",
        warn: true,
      },
    ],
    faq: [
      {
        q: 'Excel 365 est-il vraiment couvert ?',
        a: `Oui, sous réserve de l'emplacement du fichier. Les conditions sont celles de l'offre : ${price} une fois, une livraison sous ${of1.delay.days} jours, et le remboursement intégral si la recette échoue.`,
      },
      {
        q: 'Mon classeur Excel est sur mon ordinateur : est-ce possible ?',
        a: "Pas en l'état : un fichier posé sur un seul poste n'est pas joignable. Placé dans OneDrive ou SharePoint, il l'est. Nous regardons cela ensemble pendant le cadrage.",
      },
      {
        q: 'Où reste mon classeur pendant et après ?',
        a: "Dans votre compte Microsoft, à votre nom. Le flux tourne sur votre n8n, et il ne s'arrête pas le jour où la supervision prend fin.",
      },
    ],
  },
}

export const isSpreadsheetSlug = (value: string): value is SpreadsheetSlug =>
  (SPREADSHEET_SLUGS as readonly string[]).includes(value)
