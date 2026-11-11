import { loadLettres } from '@/components/lettre/data'
import NewsletterView from '@/components/newsletter/NewsletterView'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  path: '/newsletter',
  title: "L'IA au travail · la lettre du mardi de Brice Gachadoat",
  description:
    "Chaque mardi, la vidéo de la semaine poussée plus loin : le problème d'entreprise derrière, ce que dix minutes ne disent pas, et mon avis. Par Brice Gachadoat, Sablia.",
})

/**
 * `/newsletter` (US-81, US-83, US-102): the view, given the issues published at build time. One read
 * of `contenu_lettres` per build process (`loadLettres` is memoised and shared with `/lettre/[slug]`);
 * on a strict build an unreadable table fails the build, so the page has no « unavailable » state.
 */
export default async function NewsletterPage() {
  return <NewsletterView lettres={await loadLettres()} />
}
