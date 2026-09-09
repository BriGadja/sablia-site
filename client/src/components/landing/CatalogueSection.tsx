import { Link } from 'wouter'
import { ArrowRight } from '@/components/icons/lucide-crm'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'
import { openBooking } from './BookingModal'

/**
 * Position 3 of the home, where 9 of the 10 productized sites of the 2026-09-09 audit put their
 * offer block. Replaces the "trois automatisations sur mesure" grid, which contradicted the
 * catalogue one click away. Figures come from the OF-1 module.
 */
export default function CatalogueSection() {
  return (
    <section id="catalogue" className="bg-canvas px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <div className="eyebrow mb-4 text-primary">Catalogue</div>
          <h2 className="t-display-lg [text-wrap:balance]">
            Des offres à prix affiché, et une règle écrite pour le reste.
          </h2>
          <p className="mt-4 text-on-dark-body">
            Vous savez ce que vous payez avant de nous parler. Le call de 30 minutes sert à choisir,
            pas à découvrir le prix.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          <article className="flex flex-col gap-4 rounded-lg border border-primary/50 bg-surface-card p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-primary">Offre n°1 · Compte rendu d'appel</span>
              <span className="t-caption-uppercase shrink-0 whitespace-nowrap rounded-full bg-accent-teal/15 px-2.5 py-1 text-accent-teal">
                Disponible
              </span>
            </div>
            <h3 className="t-display-sm text-on-dark-strong [text-wrap:balance]">{of1.title}</h3>
            <p className="text-[15px] leading-relaxed text-on-dark-body">{of1.promise}</p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {[
                eurHt(of1.price.oneShotHt),
                `${of1.price.monthlyHt} €/mois de supervision, premier mois offert`,
                `Livré en ${of1.delay.days} jours`,
              ].map((pill) => (
                <li
                  key={pill}
                  className="t-caption rounded-pill border border-hairline bg-surface-card-elevated px-3 py-1.5 text-on-dark"
                >
                  {pill}
                </li>
              ))}
            </ul>
            <Link
              href={OF1_ROUTE}
              className="t-button mt-auto inline-flex h-11 w-fit items-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
            >
              Voir l'offre et son prix <ArrowRight size={16} />
            </Link>
          </article>

          <article className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface-card p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-primary">Offre n°2 · Relance</span>
              <span className="t-caption-uppercase shrink-0 whitespace-nowrap rounded-full bg-surface-card-elevated px-2.5 py-1 text-on-dark-body">
                En préparation
              </span>
            </div>
            <h3 className="t-display-sm text-on-dark-strong [text-wrap:balance]">
              La relance qui part au bon moment, dans votre ton.
            </h3>
            <p className="text-[15px] leading-relaxed text-on-dark-body">
              Déclenchée par les signaux de votre CRM, rédigée par Claude sur votre vocabulaire,
              validée par le commercial avant envoi.
            </p>
            <button
              type="button"
              onClick={openBooking}
              className="t-button mt-auto inline-flex h-11 w-fit items-center rounded-md border border-hairline px-5 text-on-dark transition-colors hover:border-on-dark-muted"
            >
              M'en parler au call
            </button>
          </article>

          <article className="flex flex-col gap-4 rounded-lg border border-hairline bg-surface-card p-8">
            <span className="eyebrow text-primary">Hors catalogue</span>
            <h3 className="t-display-sm text-on-dark-strong [text-wrap:balance]">
              Un besoin spécifique ? La règle de prix est publique.
            </h3>
            <p className="text-[15px] leading-relaxed text-on-dark-body">
              L'unité est la brique : un automatisme livrable en {of1.delay.sabliaWorkDaysMax} jours
              de travail au plus, à {eurHt(of1.price.brickHt)}. Une journée suffit :{' '}
              {eurHt(of1.price.brickFloorHt)}. Chiffre exact confirmé sous 24 heures.
            </p>
            <button
              type="button"
              onClick={openBooking}
              className="t-button mt-auto inline-flex h-11 w-fit items-center rounded-md border border-hairline px-5 text-on-dark transition-colors hover:border-on-dark-muted"
            >
              Décrire mon besoin
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
