import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HOME_VIDEO, PROOF_LINE } from '@/content/home'
import { OF1_ROUTE, of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'
import OffreSection from './OffreSection'

/** Prices and delays are rendered with non-breaking spaces so they never wrap mid-figure. */
const plain = (text: string | null): string => (text ?? '').replace(/[   ]/g, ' ')

/**
 * US-10, the offer section of the home (grill decisions 3 to 5, 2026-09-28): the OF-1 card, the
 * demo video behind a click-to-play facade (no third-party byte before the click), the proof line.
 */
describe('OffreSection', () => {
  it('loads no video player before the visitor asks for it', () => {
    const { container } = render(<OffreSection />)
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
  })

  it('mounts the privacy-enhanced YouTube player on click, autoplaying', () => {
    const { container } = render(<OffreSection />)
    fireEvent.click(screen.getByRole('button', { name: /Lire la vidéo/ }))
    const frames = container.querySelectorAll('iframe')
    expect(frames).toHaveLength(1)
    expect(
      frames[0]
        .getAttribute('src')
        ?.startsWith('https://www.youtube-nocookie.com/embed/d5fo00AFqVM?autoplay=1'),
    ).toBe(true)
    expect(frames[0].getAttribute('title')).toBe(HOME_VIDEO.title)
  })

  it('shows the offer card with its price, its delay and its guarantee, from the module', () => {
    const { container } = render(<OffreSection />)
    const text = plain(container.textContent)
    expect(text).toContain(of1.title)
    expect(text).toContain(plain(eurHt(of1.price.oneShotHt)))
    expect(text).toContain(`Livré en ${of1.delay.days} jours`)
    expect(text).toContain(plain(of1.guarantee))
  })

  it('carries the proof line word for word', () => {
    const { container } = render(<OffreSection />)
    expect(plain(container.textContent)).toContain(plain(PROOF_LINE))
  })

  it('links to the product page', () => {
    const { container } = render(<OffreSection />)
    expect(container.querySelector(`a[href="${OF1_ROUTE}"]`)?.textContent).toContain(
      "Voir l'offre et son prix",
    )
  })
})
