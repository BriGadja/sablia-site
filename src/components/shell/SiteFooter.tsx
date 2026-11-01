import Link from 'next/link'
import { NDA_LINE } from '@/content/declaration'
import { WhenUpcoming } from '@/content/session-bar'
import { ConsentLink } from './ConsentLink'
import { Logo } from './Logo'
import './site-footer.css'

/**
 * Link order of 01b § 6: the training structure, the CRM offer page, resources, then the legal row.
 * `untilSession`: gone from `SESSION_START`, like the header entry (`/webinaire` is the one session page).
 */
const LINKS = [
  { href: '/formations', label: 'Formation' },
  { href: '/webinaire', label: 'Webinaires', untilSession: true },
  { href: '/accompagnement', label: 'Après la formation' },
  { href: '/realisations', label: 'Réalisations' },
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

export function SiteFooter() {
  return (
    <footer className="v2-footer">
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
          <p>{NDA_LINE}</p>
          <span>© 2026 Sablia</span>
        </div>
      </div>
    </footer>
  )
}
