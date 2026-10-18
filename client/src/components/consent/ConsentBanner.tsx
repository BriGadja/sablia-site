import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'

/**
 * The consent banner (US-66). One question — may we record, anonymously, clicks and scrolling on
 * these pages (tier 2)? The cookieless audience count (tier 1) does not depend on the answer.
 *
 * Both answers are the same button: same classes, same row, refusal first in the DOM (the CNIL
 * asks that refusing be as easy as accepting). Not modal, no wall, no animation. Silence stores
 * nothing and records nothing. Escape counts as a refusal and is stored, so the question is not
 * asked on every page. Never mounted during the prerender run: the static HTML must not carry it.
 */
type MaybePrerender = Window & { __SABLIA_PRERENDER__?: boolean }

const ANSWER =
  'inline-flex h-10 min-w-[8.5rem] items-center justify-center rounded-md border border-on-dark/40 px-5 text-sm font-medium text-on-dark hover:bg-on-dark/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark'

export default function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if ((window as MaybePrerender).__SABLIA_PRERENDER__ === true) return
    setOpen(readConsent() === null)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const choose = (replay: boolean) => {
    writeConsent(replay)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        writeConsent(false)
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <section
      data-consent-banner=""
      aria-label="Choix de confidentialité"
      className="fixed inset-x-0 bottom-0 z-50 max-h-40 overflow-y-auto border-t border-hairline bg-ink px-4 py-3 text-on-dark shadow-lg sm:max-h-none sm:px-8 sm:py-4"
    >
      <div className="mx-auto flex max-w-editorial flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Aidez-nous à améliorer ce site</p>
          <p className="mt-1 text-xs leading-snug text-on-dark-body sm:text-[13px]">
            Nous mesurons la fréquentation de ce site de façon anonyme, sans cookie et sans vous
            suivre d'un site à l'autre. Avec votre accord, nous enregistrons aussi, sans vous
            identifier directement, vos clics et vos défilements sur nos pages pour repérer ce qui
            est difficile à utiliser — les champs de saisie et les formulaires ne sont jamais
            enregistrés. Ces données sont hébergées sur notre serveur en France (sauvegardes
            chiffrées) et ne sont jamais revendues.{' '}
            <Link href="/politique-confidentialite" className="underline underline-offset-2">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className={ANSWER} onClick={() => choose(false)}>
            Tout refuser
          </button>
          <button type="button" className={ANSWER} onClick={() => choose(true)}>
            Tout accepter
          </button>
        </div>
      </div>
    </section>
  )
}
