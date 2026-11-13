/**
 * Home `#webinaire`, the next-session band (plan site-formation-lot1 U8, copy 01b « Next webinar
 * block »). The title, the three facts and the lede come from the webinar page's own file, read only
 * (the chain is frozen until 03/12): a date or a title is never typed twice. Shown only while the
 * session is upcoming (`WhenUpcoming`); no countdown, no scarcity.
 */
import { HERO, SESSION } from '@/content/webinaire'

export const WEBINAIRE_BAND = {
  eyebrow: 'Prochain webinaire · gratuit',
  title: SESSION.title,
  facts: HERO.facts,
  line: HERO.lede,
  cta: "Je m'inscris",
  /** The registration page (`PATHS.page`, pinned by the test). */
  href: '/webinaire',
  /** Quiet line: the « Échange de 30 minutes » booking, for visitors of another trade. */
  autre: {
    lead: 'Un autre métier ?',
    action: 'Réserver un échange de 30 minutes.',
  },
} as const
