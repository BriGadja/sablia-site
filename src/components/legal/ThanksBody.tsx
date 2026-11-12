'use client'

// Client component: the copy depends on `?source=`, which a static export only knows in the browser.
import { useSearchParams } from 'next/navigation'
import { Cta } from '@/components/shell/Cta'
import { thanksCopy } from './thanks-copy'

export function ThanksBody() {
  const params = useSearchParams()
  const copy = thanksCopy(params?.get('source'))
  return (
    <>
      <h1>{copy.title}</h1>
      <p className="v2-thanks-lead">{copy.description}</p>
      <div className="v2-thanks-next">
        <h2>Prochaine étape</h2>
        <p>
          Réservez un échange gratuit de 30 minutes : vous nous parlez de votre CRM et de ce que
          vous avez déjà essayé, nous vous disons par où commencer.
        </p>
        <Cta size="lg" arrow />
      </div>
    </>
  )
}
