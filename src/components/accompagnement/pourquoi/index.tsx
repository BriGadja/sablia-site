import Link from 'next/link'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead } from '@/components/shell/SandIllustration'
import './pourquoi.css'

const WHYS = [
  {
    k: 'En production',
    title: 'Je fais tourner ce que je montre',
    what: 'Automatisations, agents vocaux, applications et intégrations CRM chez des clients.',
  },
  {
    k: 'En atelier',
    title: "J'enseigne en continu",
    what: "Des débutants complets aux développeurs : à l'école Noésia toutes les deux semaines, et en entreprise à la demande.",
  },
  {
    k: 'En entreprise',
    title: "J'ai vécu le terrain",
    what: "Des années dans les systèmes d'information d'un grand groupe, puis dans le conseil data.",
  },
] as const

export function AccompagnementPourquoi() {
  return (
    <section id="pourquoi" className="v2-acc-pourquoi">
      <div className="panel">
        <div className="wrap">
          <IllHead>
            <div>
              <Eyebrow onDark>Pourquoi moi</Eyebrow>
              <h2 className="acc-h2">Du débutant aux frontières de l'IA.</h2>
              <p className="acc-lede">
                Je mets en production ce que j'enseigne : automatisations, agents vocaux,
                applications, intégrations CRM.
              </p>
            </div>
            {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
            <img
              className="acc-photo"
              src="/photos/accueil-meetup-public-900.webp"
              srcSet="/photos/accueil-meetup-public-540.webp 540w, /photos/accueil-meetup-public-900.webp 900w"
              sizes="(max-width: 900px) 100vw, 500px"
              alt="Brice Gachadoat anime une formation IA devant un public"
              loading="lazy"
            />
          </IllHead>
          <div className="why">
            {WHYS.map((w) => (
              <div key={w.k} className="wcard">
                <div className="wk">{w.k}</div>
                <h3>{w.title}</h3>
                <p>{w.what}</p>
              </div>
            ))}
          </div>
          <Link href="/formations" className="why-link">
            Voir aussi les formations
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
