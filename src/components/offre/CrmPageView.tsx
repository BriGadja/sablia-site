import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { Cta } from '@/components/shell/Cta'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { pageFaqSchema, pageServiceSchema } from '@/content/crm/schema'
import type { CrmView } from '@/content/crm/view'
import { OF1_ROUTE, of1 } from '@/content/of1'
import './offre.css'
import './crm-page.css'
import { FlowDiagram } from './FlowDiagram'
import { FaqList } from './OffreFaq'
import OffreCallout from './OffreCallout'
import { euros } from './format'

/**
 * One template for the six CRM pages: the four JSON pages (sourced facts) and the two spreadsheet
 * pages (hub offer file only). The price, delay and guarantee come from `of1`, never from content.
 */
export default function CrmPageView({ view, description }: { view: CrmView; description: string }) {
  const { tool, path, hero, blocks, facts, faq, proofLine } = view
  const pills = [
    `${euros(of1.price.oneShotHt)} € HT`,
    `${of1.price.monthlyHt} €/mois de supervision, premier mois offert`,
    `Livré en ${of1.delay.days} jours`,
  ]

  return (
    <main id="contenu" tabIndex={-1} className="v2-offre v2-crm">
      <JsonLd
        data={pageServiceSchema({ name: `${of1.title} dans ${tool}`, description, tool, path })}
      />
      <JsonLd data={pageFaqSchema(faq)} />
      <BreadcrumbJsonLd
        items={[
          { name: of1.title, path: OF1_ROUTE },
          { name: tool, path },
        ]}
      />

      <section id="top" className="hero">
        <Dune back="#E8CFC8" front="#EAD9BD" edge="bottom" />
        <div className="wrap hero-grid">
          <div>
            <nav aria-label="Fil d'Ariane">
              <ol className="crumbs">
                <li>
                  <Link href="/">Accueil</Link>
                </li>
                <li>
                  <Link href={OF1_ROUTE}>{of1.title}</Link>
                </li>
                <li aria-current="page">{tool}</li>
              </ol>
            </nav>
            <Eyebrow>{`${of1.title} · ${tool}`}</Eyebrow>
            <h1 className="h1">{hero.title}</h1>
            <p className="lede is-wide">{hero.lead}</p>
            <ul className="chipline">
              {pills.map((pill) => (
                <li key={pill} className="tagchip">
                  {pill}
                </li>
              ))}
            </ul>
            <div className="hero-actions">
              <Cta size="lg" arrow />
            </div>
            {proofLine ? <p className="proofline">{proofLine}</p> : null}
          </div>
          <FlowDiagram tool={tool} />
        </div>
      </section>

      <section id="propre" className="sec is-card">
        <div className="wrap">
          <Eyebrow>{tool}</Eyebrow>
          <h2 className="h2">{`Ce qui est propre à ${tool}`}</h2>
          <div className="blocks">
            {blocks.map((block) => (
              <article key={block.heading} className={`block${block.warn ? ' is-warn' : ''}`}>
                <h3>{block.heading}</h3>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {facts ? (
        <section id="sources" className="sec">
          <div className="wrap">
            <Eyebrow>Sources</Eyebrow>
            <h2 className="h2">Ce que la documentation établit.</h2>
            <p className="sub">{`La documentation officielle de ${tool}, un lien par ligne.`}</p>
            <table className="facts">
              <thead>
                <tr>
                  <th scope="col">Point</th>
                  <th scope="col">{`Dans ${tool}`}</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {facts.map((fact) => (
                  <tr key={fact.sourceId}>
                    <th scope="row">{fact.label}</th>
                    <td>{fact.value}</td>
                    <td>
                      <a href={fact.sourceUrl} rel="noreferrer" target="_blank">
                        {new URL(fact.sourceUrl).host}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section id="prix" className={`sec${facts ? ' is-rose' : ''}`}>
        <div className="wrap">
          <Eyebrow>Prix</Eyebrow>
          <h2 className="h2">Prix, délai, garantie.</h2>
          <p className="terms-text">
            {euros(of1.price.oneShotHt)} € HT à l'installation, livré sous {of1.delay.days} jours
            calendaires à compter de la réception de vos accès. {of1.guarantee}
          </p>
          <div className="hero-actions">
            <Link className="quiet-link" href={OF1_ROUTE}>
              Voir l'offre complète
            </Link>
          </div>
        </div>
      </section>

      <section id="faq" className={`sec${facts ? '' : ' is-card'}`}>
        <div className="wrap column">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="h2">Les questions que vous vous posez.</h2>
          <FaqList items={faq} />
        </div>
      </section>

      <OffreCallout />
    </main>
  )
}
