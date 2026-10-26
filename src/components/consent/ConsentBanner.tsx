'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OPEN_EVENT, readConsent, writeConsent } from '@/lib/consent'
import './consent.css'

/**
 * The consent banner (US-66). One question: may we record, anonymously, clicks and scrolling on
 * these pages (tier 2)? The cookieless audience count (tier 1) does not depend on the answer.
 *
 * Both answers are the same button: same class, same row, refusal first in the DOM (the CNIL
 * asks that refusing be as easy as accepting). Not modal, no wall, no animation. Silence stores
 * nothing and records nothing. Escape counts as a refusal and is stored, so the question is not
 * asked on every page. Closed in the static HTML: it opens in an effect, after hydration.
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
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
    <section data-consent-banner="" aria-label="Choix de confidentialité" className="v2-consent">
      <div className="v2-consent-inner">
        <div className="v2-consent-copy">
          <p className="v2-consent-title">Aidez-nous à améliorer ce site</p>
          <p className="v2-consent-text">
            Nous mesurons la fréquentation de ce site de façon anonyme, sans cookie et sans vous
            suivre d'un site à l'autre. Avec votre accord, nous enregistrons aussi, sans vous
            identifier directement, vos clics et vos défilements sur nos pages pour repérer ce qui
            est difficile à utiliser — les champs de saisie et les formulaires ne sont jamais
            enregistrés. Ces données sont hébergées sur notre serveur en France (sauvegardes
            chiffrées) et ne sont jamais revendues.{' '}
            <Link href="/politique-confidentialite">En savoir plus</Link>
          </p>
        </div>
        <div className="v2-consent-answers">
          <button type="button" className="v2-consent-answer" onClick={() => choose(false)}>
            Tout refuser
          </button>
          <button type="button" className="v2-consent-answer" onClick={() => choose(true)}>
            Tout accepter
          </button>
        </div>
      </div>
    </section>
  )
}
