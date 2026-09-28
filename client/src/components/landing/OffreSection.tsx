import { useState } from 'react'
import { Link } from 'wouter'
import { ArrowRight } from '@/components/icons/lucide-crm'
import { HOME_VIDEO, PROOF_LINE } from '@/content/home'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'

/**
 * The offer on the home (grill 2026-09-28, decisions 3 to 5): the OF-1 card, the demo video Brice
 * published that day, and the two proof figures. Every word of the card is the OF-1 module's; the
 * delay is `of1.delay.days`, never typed (decision 5, reversed by Brice the same day: the home shows
 * it). No monthly fee, no « Bientôt » card, no off-catalogue card: they left the home (decision 4).
 */

/**
 * Click-to-play facade: before the click the visitor loads a local thumbnail and no byte from
 * YouTube; the click mounts the privacy-enhanced player, whose `autoplay=1` then follows a user
 * gesture. Browsers may still keep it paused on a session they do not trust with sound.
 */
function VideoFacade() {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${HOME_VIDEO.youtubeId}?autoplay=1&rel=0`}
        title={HOME_VIDEO.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="aspect-video w-full rounded-xl border-0 bg-ink"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Lire la vidéo : ${HOME_VIDEO.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-ink"
    >
      <img
        src="/photos/video-demo-of1.webp"
        alt=""
        width={960}
        height={540}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-base group-hover:scale-[1.02]"
      />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary shadow-lg transition-transform duration-base group-hover:scale-105">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-on-primary">
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-left text-[14px] font-medium text-white">
        Voir la démo en direct ({HOME_VIDEO.durationLabel})
      </span>
    </button>
  )
}

export default function OffreSection() {
  return (
    <section id="offre" className="on-light scroll-mt-20 px-4 py-section sm:px-8">
      <div className="mx-auto grid max-w-editorial items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="order-2 min-w-0 rounded-2xl border border-hairline-light bg-white p-6 sm:p-9 lg:order-1">
          <div className="eyebrow mb-4 text-primary">Offre n°1 · Compte rendu d'appel</div>
          <h2 className="t-display-lg [text-wrap:balance]">{of1.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed sm:text-base">{of1.promise}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary px-4 py-1.5 text-[15px] font-semibold text-on-primary">
              {eurHt(of1.price.oneShotHt)}
            </span>
            <span className="rounded-full border border-hairline-light px-4 py-1.5 text-[14px] text-ink">
              Livré en {of1.delay.days} jours
            </span>
          </div>
          <div className="mt-6 border-t border-hairline-light pt-5">
            <div className="text-[13px] font-semibold uppercase tracking-[1.5px] text-ink">
              Si ça ne tourne pas, vous ne payez rien
            </div>
            <p className="mt-2 text-[14px] leading-relaxed">{of1.guarantee}</p>
          </div>
          <Link
            href={OF1_ROUTE}
            className="t-button mt-7 inline-flex items-center gap-2 text-[15px] text-ink underline decoration-primary underline-offset-4 hover:text-primary-active"
          >
            Voir l'offre et son prix <ArrowRight size={16} />
          </Link>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <VideoFacade />
        </div>

        {/* The sentence opens on « Déjà en production chez nos clients » itself: an eyebrow repeating
            it would print the phrase twice, so a coral rule marks the block instead. */}
        <p className="order-3 min-w-0 max-w-[900px] border-l-2 border-primary pl-5 text-[16px] leading-relaxed text-ink sm:text-lg lg:col-span-2">
          {PROOF_LINE}
        </p>
      </div>
    </section>
  )
}
