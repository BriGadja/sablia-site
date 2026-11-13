import Link from 'next/link'
import { NDA_LINE } from '@/content/declaration'
import { WhenUpcoming } from '@/content/session-bar'
import { site } from '@/lib/site'
import { ConsentLink } from './ConsentLink'
import { Logo } from './Logo'
import './site-footer.css'

/**
 * Link order (US-103): the four entries of the header menu, same labels and hrefs (`nav-links.ts`;
 * the footer keeps its own list on purpose), the webinar while its session is ahead, the CRM offer
 * page, resources, then the legal row.
 * `untilSession`: gone from `SESSION_START` (`/webinaire` is the one session page).
 */
const LINKS = [
  { href: '/responsable-ia-externalise', label: 'Responsable IA externalisé' },
  { href: '/formations', label: 'Formations' },
  { href: '/conferences', label: 'Conférences' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/webinaire', label: 'Webinaires', untilSession: true },
  { href: '/offres/compte-rendu-appel', label: "Compte rendu d'appel" },
  { href: '/ressources', label: 'Ressources' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/#videos', label: 'Vidéos' },
  { href: '/guides/integrer-l-ia-dans-votre-entreprise', label: 'Guide' },
] as const

const LEGAL = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Confidentialité' },
  { href: '/cgv', label: 'CGV' },
] as const

/**
 * `data-zone="footer"`: its links sit in a `<nav>`, which `zoneOf` would name `nav` like the header
 * menu's; the zone keeps a door taken in the footer apart from one taken in the menu (US-110).
 */
export function SiteFooter() {
  return (
    <footer className="v2-footer" data-zone="footer">
      <div className="wrap v2-footer-row">
        <span className="v2-footer-brand">
          <Logo size={22} />
          <span>Sablia</span>
        </span>
        <nav aria-label="Pied de page">
          {LINKS.map((l) => {
            const link = (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            )
            return 'untilSession' in l ? (
              <WhenUpcoming key={l.label} upcoming={link} past={null} />
            ) : (
              link
            )
          })}
        </nav>
      </div>
      <div className="wrap v2-footer-row is-legal">
        <nav aria-label="Informations légales">
          {LEGAL.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
          <ConsentLink />
        </nav>
        <div className="v2-footer-mentions">
          <p className="v2-footer-place">
            {`Sablia, à ${site.locality}. Interventions en ${site.region} et partout en France.`}
          </p>
          <p>{NDA_LINE}</p>
          <span>© 2026 Sablia</span>
        </div>
      </div>
    </footer>
  )
}
