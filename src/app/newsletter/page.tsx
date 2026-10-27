import NewsletterForm from '@/components/newsletter/NewsletterForm'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { pageMetadata } from '@/lib/seo'
import '@/components/newsletter/newsletter.css'

export const metadata = pageMetadata({
  path: '/newsletter',
  title: "L'IA au travail — la lettre du mardi de Brice Gachadoat",
  description:
    "Chaque mardi, la vidéo de la semaine poussée plus loin : le problème d'entreprise derrière, ce que dix minutes ne disent pas, et mon avis. Par Brice Gachadoat, Sablia.",
})

const PARTS = [
  "Le problème d'entreprise derrière",
  'Ce que dix minutes ne disent pas',
  'Mon avis',
] as const

/** An envelope sealed with the hourglass, in gold contours on the night (the sand-drawing rule). */
function Envelope() {
  return (
    <svg
      className="nl-envelope ill-draw"
      viewBox="0 0 240 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M58 52V22h124v30" />
      <path d="M76 38h88M76 52h56" />
      <rect x="20" y="52" width="200" height="112" rx="8" />
      <path d="M20 58l100 62 100-62" />
      <path d="M20 160l74-52M220 160l-74-52" />
      <circle cx="120" cy="120" r="15" />
      <path d="M113 111h14l-14 18h14z" />
    </svg>
  )
}

/**
 * `/newsletter` — « L'IA au travail ». The form and the two token links of the letter (`?c=` from
 * the confirmation mail, `?t=` from the invitation) live in `NewsletterForm`; everything readable
 * here is in the static HTML (SSR content rule), the motion only stages it.
 */
export default function NewsletterPage() {
  return (
    <main id="contenu" className="v2-newsletter">
      <section id="top" className="nl-hero">
        <div className="wrap nl-grid">
          <div className="nl-copy">
            <Eyebrow>La lettre du mardi</Eyebrow>
            <h1>
              <span className="nl-underline">L&apos;IA au travail</span>
            </h1>
            <p className="nl-lede">
              Chaque mardi, la vidéo de la semaine poussée plus loin : le problème d&apos;entreprise
              derrière, ce que dix minutes ne disent pas, et mon avis.
            </p>
            <p className="nl-by">
              {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
              <img src="/brand/badge.svg" alt="" width={28} height={28} />
              <span>
                Par <strong>Brice Gachadoat</strong>, Sablia
              </span>
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <section id="numero" className="nl-band">
        <Dune back="#C68A8E" front="#161B29" />
        <div className="wrap nl-band-grid">
          <div>
            <Eyebrow onDark>Dans chaque numéro</Eyebrow>
            <h2>La vidéo de la semaine, poussée plus loin.</h2>
            <ol className="nl-parts">
              {PARTS.map((part, index) => (
                <li key={part}>
                  <span className="nl-num">{String(index + 1).padStart(2, '0')}</span>
                  <span>{part}</span>
                </li>
              ))}
            </ol>
            <p className="nl-note">
              Le mardi matin, dans votre boîte mail. Un lien de désinscription dans chaque lettre.
            </p>
          </div>
          <figure className="nl-figure" aria-hidden="true">
            <Envelope />
          </figure>
        </div>
      </section>
    </main>
  )
}
