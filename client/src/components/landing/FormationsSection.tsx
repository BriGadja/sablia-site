import { FORMATIONS_PHOTO } from '@/content/home'
import ContactForm from './ContactForm'

/**
 * Séminaires et formations (decision A1, 2026-09-18). A section on the home, not a second
 * productised offer and not a dedicated page: the shape is deliberately open, and the first real
 * request is what will structure it. No price, and none of the names the training work goes
 * through — the academy, the training company and the client whose seminar is not delivered yet
 * stay out of a public surface until their owner has said yes in writing.
 */

/**
 * What we deliver, in Brice's words (A4, widened on 2026-09-18: the first accroche reduced the
 * offer to the seminar; the training work spans the executive committee, the teams and the
 * seminar, always built for the client's sector, with exercises).
 */
const OFFERS = [
  {
    title: 'Comex et Codir',
    desc: "Comprendre ce que l'IA change pour votre secteur, et décider où investir : une intervention en réunion de direction, sur vos enjeux.",
  },
  {
    title: 'Vos équipes',
    desc: "Des ateliers pratiques sur vos outils et vos cas réels, avec des exercices, pour que l'usage reste après notre passage.",
  },
  {
    title: "Séminaires et journées d'entreprise",
    desc: "Nous préparons et animons l'intervention IA, construite pour votre secteur d'activité.",
  },
] as const

/**
 * The one quote on the home. It moved here from the founder section on 2026-09-18: it is a
 * TRAINING testimonial (A5), and a quote printed twice on one page is noise. Received as a written
 * comment from its author on 2026-09-17; the first name is published on Brice's ruling of the same
 * day. The hub keeps the text and its status (P-14 in the proof dossier), and `landing.copy.test.ts`
 * fails if the two ever diverge by a word.
 */
export const TESTIMONIAL = {
  quote:
    "J'ai englouti tout son tutoriel en un mois. Je pensais avoir atteint mon plafond dans ma façon de travailler ; en fait j'ai tout remis à plat, la technique, la méthode, et surtout la rigueur que je m'imposais. Ça m'a ouvert des portes que je n'avais même pas imaginées.",
  who: "Denis, développeur d'une application de devis pour artisans",
  context: 'Formé par Brice, 2026',
} as const

export default function FormationsSection() {
  return (
    <section
      id="formations"
      className="on-light border-t border-hairline-light px-4 py-section sm:px-8"
    >
      {/* 1440: photo · text · form on one row. 1024: photo above the text, form beside both.
          390: photo, text, then the form, stacked (grill 2026-09-28, decision 3). */}
      <div className="mx-auto grid max-w-editorial gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[280px_1fr_380px] xl:gap-10">
        <figure className="min-w-0 lg:col-start-1 lg:row-start-1">
          <img
            src={FORMATIONS_PHOTO.src}
            srcSet={FORMATIONS_PHOTO.srcSet}
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 560px, 100vw"
            width={FORMATIONS_PHOTO.width}
            height={FORMATIONS_PHOTO.height}
            alt={FORMATIONS_PHOTO.alt}
            loading="lazy"
            className="block aspect-[4/5] w-full rounded-xl object-cover object-[65%_30%] lg:aspect-[16/10] xl:sticky xl:top-24 xl:aspect-[2/3]"
          />
        </figure>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2 xl:col-start-2 xl:row-start-1">
          <div className="eyebrow mb-4 text-primary">Formations</div>
          <h2 className="t-display-lg [text-wrap:balance]">
            Nous formons votre entreprise à l'IA, du comité de direction aux équipes.
          </h2>

          <ul className="mt-8 grid gap-4">
            {OFFERS.map((offer) => (
              <li
                key={offer.title}
                className="rounded-lg border border-hairline-light bg-surface-light-card p-6"
              >
                <h3 className="t-title-sm">{offer.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed">{offer.desc}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[600px] text-[15px] leading-relaxed">
            Notre fondateur est responsable pédagogique d'une académie de plus de 1&nbsp;400
            entrepreneurs formés à l'IA et à l'automatisation (ateliers toutes les deux semaines,
            module Claude Code de 10&nbsp;heures).
          </p>

          <figure className="mt-8 max-w-[620px] border-t border-hairline-light pt-6">
            <blockquote className="font-display text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.35] text-ink">
              <span aria-hidden="true" className="text-primary">
                «&nbsp;
              </span>
              {TESTIMONIAL.quote}
              <span aria-hidden="true" className="text-primary">
                &nbsp;»
              </span>
            </blockquote>
            <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px]">
              <span className="font-medium text-body">{TESTIMONIAL.who}</span>
              <span className="text-muted-text">{TESTIMONIAL.context}</span>
            </figcaption>
          </figure>
        </div>

        <div
          id="contact"
          className="min-w-0 scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 xl:col-start-3 xl:row-span-1"
        >
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
