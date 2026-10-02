import { Link } from 'wouter'
import { ArrowRight } from '@/components/icons/lucide-crm'
import VideoFacade from '@/components/VideoFacade'
import { HOME_VIDEO, PROOF_LINE } from '@/content/home'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { eurHt, frenchSpacing } from '@/lib/format'

/**
 * The offer on the home (grill 2026-09-28, decisions 3 to 5): the OF-1 card, the demo video Brice
 * published that day, and the proof line (one sentence since 2026-09-29, `PROOF_LINE`). Every word
 * of the card is the OF-1 module's; the delay is `of1.delay.days`, never typed (decision 5, reversed
 * by Brice the same day: the home shows it). No monthly fee, no « Bientôt » card, no off-catalogue
 * card: they left the home (decision 4).
 */

export default function OffreSection() {
  return (
    <section id="offre" className="scroll-mt-20 bg-surface-light px-4 py-section sm:px-8">
      <div className="mx-auto grid max-w-editorial items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="order-2 min-w-0 rounded-2xl border border-hairline-light bg-white p-6 sm:p-9 lg:order-1">
          <div className="eyebrow mb-4 text-primary">Offre n°1 · Compte rendu d'appel</div>
          <h2 className="t-display-lg text-ink [text-wrap:balance]">{of1.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-body sm:text-base">{of1.promise}</p>
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
            <p className="mt-2 text-[14px] leading-relaxed text-body">{of1.guarantee}</p>
          </div>
          <Link
            href={OF1_ROUTE}
            className="t-button mt-7 inline-flex items-center gap-2 text-[15px] text-ink underline decoration-primary underline-offset-4 hover:text-primary-active"
          >
            Voir l'offre et son prix <ArrowRight size={16} />
          </Link>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <VideoFacade
            youtubeId={HOME_VIDEO.youtubeId}
            title={HOME_VIDEO.title}
            thumbnail={{ src: '/photos/video-demo-of1.webp', width: 960, height: 540 }}
          />
          {/* Under the player, not over it: the thumbnail carries its own title. */}
          <p className="mt-3 text-[14px] text-muted-text">
            Voir la démo en direct ({HOME_VIDEO.durationLabel})
          </p>
        </div>

        {/* One sentence, marked by a coral rule rather than an eyebrow (Brice, 2026-09-29: no call
            figures on the home). */}
        <p className="order-3 min-w-0 max-w-[900px] border-l-2 border-primary pl-5 text-[16px] leading-relaxed text-ink sm:text-lg lg:col-span-2">
          {frenchSpacing(PROOF_LINE)}
        </p>
      </div>
    </section>
  )
}
