import type { Lettre } from '@/components/lettre/data'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { buildTime } from '@/content/session-clock'
import { FIRST_ISSUE_AT } from './first-issue'
import { IssueList } from './IssueList'
import NewsletterForm from './NewsletterForm'
import './newsletter.css'

const PARTS = [
  "Le problème d'entreprise derrière",
  'Ce que dix minutes ne disent pas',
  'Mon avis',
] as const

/**
 * The form's « Premier numéro mardi 17 novembre. » shows while no issue is published AND the build is
 * before that morning, so a lagging publication never leaves a past date on the page (the form also
 * checks the visitor's clock at the confirmation). Without a build instant (tests, a tool rendering
 * outside Next) the issues alone decide here.
 */
function announceFirstIssue(lettres: readonly Lettre[]): boolean {
  const builtAt = buildTime()
  return lettres.length === 0 && (builtAt === null || builtAt.getTime() < FIRST_ISSUE_AT)
}

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
 * The body of `/newsletter`: « L'IA au travail ». The form and the two token links of the letter
 * (`?c=` from the confirmation mail, `?t=` from the invitation) live in `NewsletterForm`; the issues
 * already published are listed in `#numeros` (`IssueList`). Everything readable here is in the static
 * HTML (SSR content rule), the motion only stages it. Synchronous: the page (`src/app/newsletter/
 * page.tsx`) reads the issues and passes them in.
 */
export default function NewsletterView({ lettres }: { lettres: readonly Lettre[] }) {
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
          <NewsletterForm announceFirstIssue={announceFirstIssue(lettres)} />
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

      <IssueList lettres={lettres} />
    </main>
  )
}
