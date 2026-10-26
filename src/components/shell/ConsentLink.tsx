'use client'

import { requestConsentBanner } from '@/lib/consent'

/** « Gérer mes choix »: a button (it acts, it does not navigate) that reopens the consent banner. */
export function ConsentLink() {
  return (
    <button type="button" onClick={requestConsentBanner}>
      Gérer mes choix
    </button>
  )
}
