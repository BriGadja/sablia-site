import { act, fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { CALLS, CALL_LINES, SR_INTRO, callFinal, callReset, derive, offerFigures, chipPlace } from './content'
import { Scene } from './index'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })

describe('content', () => {
  it('takes the offer figures from the OF-1 file', () => {
    expect(offerFigures()).toEqual({ price: '1 490 € HT', days: '7 jours' })
  })

  it('has the two cases of the mockup', () => {
    expect(CALLS.map((c) => c.tab)).toEqual(['Appel · Google Sheets', 'Note vocale · HubSpot'])
    expect(CALLS[0]?.f.map((f) => f.v)).toEqual([
      'Remplacer les devis Excel',
      'Avant le 15 novembre',
      'La gérante et son comptable',
    ])
  })

  it('writes the « 40 s » line per case, with no figure for the call case', () => {
    expect(CALL_LINES[0]).toEqual({
      figure: null,
      text: 'Appel passé sur votre téléphonie (Ringover, Aircall) : Claude lit la transcription, rien à dicter.',
    })
    expect(CALL_LINES[1]?.figure).toBe('40 s')
    expect(CALL_LINES[1]?.text).toBe('Note vocale dictée, fiche remplie 40 secondes plus tard : mesuré sur notre démo HubSpot.')
  })

  it('derives the reset and final frames', () => {
    const a = derive(1, callReset())
    expect(a.mids.every((m) => m.empty)).toBe(true)
    expect(a.fields.every((f) => !f.on)).toBe(true)
    expect(a.taskOn).toBe(false)
    expect(a.claudeStatus).toBe("En attente de l'appel")
    const z = derive(0, callFinal())
    expect(z.fields.every((f) => f.on)).toBe(true)
    expect(z.taskOn).toBe(true)
    expect(z.claudeStatus).toBe('Fait : fiche à jour')
    expect(z.steps.map((s) => s.cls)).toEqual(['done', 'done', 'done', 'done'])
  })

  it('places the flying chips on the three columns', () => {
    expect(chipPlace(0, 1, 0, { x: 1, px: null, py: null })).toEqual({ left: 'calc(0% + 17px)', top: 122 })
    expect(chipPlace(0, 1, 0, { x: 3, px: null, py: null }).left).toBe('calc(70% + 33px)')
    expect(chipPlace(1, 1, 0, { x: 3, px: null, py: null }).left).toBe('calc(70% + 7px)')
    expect(chipPlace(1, 1, 3, { x: 3, px: null, py: null })).toEqual({ left: 'calc(70% + 17px)', top: 334 })
  })

  it('carries no em dash, no banned phrase and no « IAPreneurs »', () => {
    const all = JSON.stringify([CALLS, CALL_LINES, SR_INTRO])
    expect(all).not.toMatch(/—|IAPreneurs|étape de vente avance/)
  })
})

/** Renders with a controllable IntersectionObserver and puts the pipeline in view. */
function mountInView() {
  const io = mockIntersectionObserver()
  const out = render(<Scene />)
  act(() => io.trigger(out.container.querySelector('.pp') as Element, true))
  return out
}

describe('Scene', () => {
  it('server-renders the section, the sr-only text, the final call case and the offer block', () => {
    mockReducedMotion(false)
    const { container } = render(<Scene />)
    const section = container.querySelector('section#scene.v2-scene')
    expect(section).not.toBeNull()
    expect(section?.textContent).toContain('Ce qui se passe quand votre commercial raccroche.')
    expect(section?.textContent).toContain('repérées dans le transcript')
    expect(section?.textContent).not.toContain('étape de vente avance')
    const html = renderToString(<Scene />)
    expect(html).toContain('Remplacer les devis Excel')
    expect(html).toContain('Raccroché')
    expect(section?.textContent).toContain('Appel passé sur votre téléphonie (Ringover, Aircall)')
    const offre = container.querySelector('#offre')
    expect(offre?.textContent).toContain('1 490 € HT')
    expect(offre?.textContent).toContain('7 jours')
    expect(offre?.textContent).toContain('Remboursé')
    expect(offre?.querySelector('a[href="/offres/compte-rendu-appel"]')).not.toBeNull()
    const tools = [...container.querySelectorAll('ul[aria-label="Outils compatibles"] li')].map(
      (li) => li.querySelector('img')?.getAttribute('alt') ?? li.textContent,
    )
    expect(tools).toEqual(['HubSpot', 'Pipedrive', 'Zoho', 'Salesforce', 'Airtable', 'Google Sheets', 'Excel'])
  })

  it('with motion allowed, the first client frame is the start frame, before the section is in view', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    const { container } = render(<Scene />)
    expect(container.querySelector('.pp')?.textContent).toContain("En attente de l'appel")
    expect(container.querySelector('.pp')?.textContent).not.toContain('Raccroché')
  })

  it('under reduced motion shows the final frame and no pause button', () => {
    mockReducedMotion(true)
    render(<Scene />)
    expect(screen.queryByRole('button', { name: /pause/i })).toBeNull()
    expect(screen.getByText('Fait : fiche à jour')).toBeTruthy()
  })

  it('plays one lap, then the note case with its own « 40 s » line', async () => {
    mockReducedMotion(false)
    const { container } = mountInView()
    await tick(10)
    expect(container.textContent).toContain("En attente de l'appel")
    expect(container.querySelectorAll('.pp-q').length).toBe(0)
    await tick(1500)
    expect(container.querySelectorAll('.pp-q').length).toBeGreaterThan(0)
    await tick(14000)
    expect(container.textContent).toContain('Fait : fiche à jour')
    expect(container.querySelectorAll('.st4.done').length).toBe(4)
    await tick(4100)
    expect(container.querySelector('.pp.fade')).not.toBeNull()
    await tick(1500)
    expect(container.textContent).toContain('Note vocale dictée, fiche remplie 40 secondes plus tard')
    expect(container.textContent).not.toContain('Appel passé sur votre téléphonie')
    expect(container.querySelector('.ctab[aria-pressed="true"]')?.textContent).toContain('Note vocale')
  })

  it('picks a tab, restarts from the top and shows that case', async () => {
    mockReducedMotion(false)
    const { container } = mountInView()
    await tick(3000)
    fireEvent.click(screen.getByRole('button', { name: /Note vocale/ }))
    await tick(10)
    expect(container.textContent).toContain('Note vocale dictée')
    expect(container.textContent).toContain("En attente de l'appel")
  })

  it('pauses on the button, parks on the final frame and resumes from the start', async () => {
    mockReducedMotion(false)
    const { container } = mountInView()
    await tick(3000)
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(container.textContent).toContain('Fait : fiche à jour')
    fireEvent.click(screen.getByRole('button', { name: 'Reprendre' }))
    await tick(10)
    expect(container.textContent).toContain("En attente de l'appel")
  })

  it('has the css scoped and the layer statement first', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/components/home/scene/scene.css'), 'utf8')
    expect(css.startsWith('@layer theme, base, components, utilities;')).toBe(true)
    expect(css).not.toMatch(new RegExp(['Familjen', 'Fragment'].join('|')))
  })
})
