import Link from 'next/link'
import { ConsentLink } from './ConsentLink'
import { Logo } from './Logo'
import './site-footer.css'

const LINKS = [
  { href: '/#offre', label: "L'offre" },
  { href: '/ressources', label: 'Ressources' },
  { href: '/#videos', label: 'Vidéos' },
  { href: '/guides/integrer-l-ia-dans-votre-entreprise', label: 'Guide' },
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
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
          <ConsentLink />
        </nav>
        <span>© 2026 Sablia</span>
      </div>
    </footer>
  )
}
