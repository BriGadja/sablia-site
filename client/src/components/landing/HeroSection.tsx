import { ArrowRight, Check } from '@/components/icons/lucide-crm'
import { BOOKING_LABEL, HERO_PHOTO } from '@/content/home'
import { of1 } from '@/content/of1'
import { openBooking } from './BookingModal'
import RecordCard from './RecordCard'

/**
 * The first screen (grill 2026-09-28, decision 2): the offer's own title and one booking button,
 * beside a real photo of Brice at work with the CRM record filling itself over it. Light background.
 * The photo's QR code and slide text are blurred in the asset (`scripts/prepare-photos.py`), and the
 * record card covers that corner as well. Words come from the OF-1 module; the delay check is
 * `of1.delay.days`, never typed (decision 5, reversed by Brice the same day: the home shows it).
 */
const CHECKS = [
  'Call audit gratuit, sans engagement',
  `Livré en ${of1.delay.days} jours`,
  'Remboursé si ça ne tourne pas',
]

/**
 * `fetchpriority` goes through a spread, lowercase: react-dom 18.3.1 maps neither casing, so the
 * camelCase prop (the only one the React types know) would warn and the lowercase one would not
 * type-check as a JSX attribute. Revisit on a React 19 upgrade, which maps `fetchPriority`.
 */
const HIGH_PRIORITY = { fetchpriority: 'high' }

export default function HeroSection() {
  return (
    <section className="bg-surface-light px-4 pb-16 pt-10 sm:px-8 lg:pb-20 lg:pt-16">
      <div className="mx-auto grid max-w-editorial items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div className="min-w-0">
          <div className="eyebrow mb-5 inline-flex items-center gap-2 text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Agence d'intégration Claude AI × CRM
          </div>
          <h1 className="t-display-xl text-ink [text-wrap:balance]">{of1.title}.</h1>
          <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-body sm:text-lg">
            {of1.promise} Pour les équipes commerciales de {of1.teamSize.min} à {of1.teamSize.max}{' '}
            personnes qui ont déjà un CRM.
          </p>
          <button
            type="button"
            onClick={openBooking}
            className="t-button mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary-active px-6 text-[15px] text-on-primary hover:bg-primary-hover active:bg-primary-hover transition-shadow duration-base hover:shadow-glow-coral sm:w-auto"
          >
            {BOOKING_LABEL} <ArrowRight size={16} />
          </button>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-text">
            {CHECKS.map((check) => (
              <li key={check} className="inline-flex items-center gap-1.5">
                <Check size={14} className="shrink-0 text-success" /> {check}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative mx-auto w-full max-w-[560px]">
          <img
            src={HERO_PHOTO.src}
            srcSet={HERO_PHOTO.srcSet}
            sizes="(min-width: 1024px) 560px, 100vw"
            width={HERO_PHOTO.width}
            height={HERO_PHOTO.height}
            alt={HERO_PHOTO.alt}
            loading="eager"
            {...HIGH_PRIORITY}
            className="block aspect-[4/5] w-full rounded-xl object-cover object-[60%_30%] lg:aspect-[5/6] lg:max-h-[640px] lg:rounded-2xl"
          />
          <RecordCard className="absolute left-3 top-3 w-[72%] sm:left-6 sm:top-6 sm:w-[260px]" />
        </figure>
      </div>
    </section>
  )
}
