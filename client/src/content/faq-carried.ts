/**
 * FAQ content carried over from the home page (decision 4, 2026-09-28), not part of the OF-1
 * module: this is a standalone copy of `FaqSection.tsx`'s five items, `href` fields dropped since
 * the page IS the offer. Figures still resolve through `of1`/`eurHt`, never hard-coded here.
 */

import type { Of1Faq } from '@/content/of1'
import { of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

export const FAQ_CARRIED: readonly Of1Faq[] = [
  {
    q: 'Devrons-nous changer de CRM ?',
    a: `Non. Nous nous adaptons à votre outil (${of1.crms.join(', ')}). Vous conservez votre stack.`,
  },
  {
    q: 'Quel budget prévoir ?',
    a: `Nos offres cadrées ont un prix affiché, avant tout paiement. Le CRM qui se remplit tout seul après chaque appel est à ${eurHt(of1.price.oneShotHt)}, avec un récurrent de ${of1.price.monthlyHt} € HT par mois, premier mois offert. Un besoin hors catalogue est chiffré par brique : ${eurHt(of1.price.brickHt)} pour au plus ${of1.delay.sabliaWorkDaysMax} jours de travail, plancher ${eurHt(of1.price.brickFloorHt)}, confirmé sous 24 heures.`,
  },
  {
    q: 'Combien de temps avant la mise en production ?',
    a: `${of1.delay.days} jours pour une offre cadrée, avec un test sur 5 appels réels avec vous avant la mise en service. Un besoin spécifique est planifié dans son devis.`,
  },
  {
    q: "Nous n'avons personne sur l'IA en interne.",
    a: "C'est exactement notre cas client. Nous concevons, déployons et formons votre équipe pour qu'elle reste autonome.",
  },
  {
    q: 'Quelles garanties sur la sécurité de nos données ?',
    a: "Claude est déployé via l'API commerciale d'Anthropic : par engagement contractuel, aucune de vos données n'entraîne le modèle. Conforme RGPD. Un DPA peut être signé.",
  },
]
