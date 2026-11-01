import { act, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { SURMESURE } from '../content'
import { Surmesure } from '.'

function placeBoard(top: number) {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 400,
    left: 0,
    right: 600,
    width: 600,
    height: 400,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&')

describe('#surmesure, server HTML', () => {
  const html = decode(renderToString(<Surmesure />))

  it('carries the copy, the CRM lead link and the realisations link', () => {
    for (const s of [SURMESURE.eyebrow, SURMESURE.title, SURMESURE.line]) expect(html).toContain(s)
    expect(html).toContain('id="surmesure"')
    expect(html).toMatch(
      /<a[^>]*href="\/offres\/compte-rendu-appel"[^>]*>Le compte rendu d'appel dans votre CRM/,
    )
    expect(html).toMatch(/<a[^>]*href="\/realisations"[^>]*>Voir les réalisations/)
  })

  it('lists the six CRM pages as links under one accessible name', () => {
    const list = html.match(/<ul[^>]*aria-label="([^"]*)"[^>]*>([\s\S]*?)<\/ul>/)
    expect(list?.[1]).toBe(SURMESURE.crmAria)
    const links = [...(list?.[2] ?? '').matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    expect(links.map((l) => l[1])).toEqual(SURMESURE.crms.map((c) => c.href))
    expect(links.map((l) => l[2].replace(/<[^>]*>/g, '').trim())).toEqual(
      SURMESURE.crms.map((c) => c.label),
    )
  })

  it('draws the board in its final state (no armed class, no inline opacity)', () => {
    expect(html).not.toContain('is-armed')
    expect(html).not.toMatch(/opacity:\s*0/)
    expect(html).toContain(SURMESURE.node)
  })
})

describe('#surmesure, motion', () => {
  it('below the fold: armed after hydration, drawn once in view', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    placeBoard(2000)
    const { container } = render(<Surmesure />)
    const board = container.querySelector('.board') as HTMLElement
    expect(board.classList.contains('is-armed')).toBe(true)
    act(() => io.trigger(board, true))
    expect(board.classList.contains('is-armed')).toBe(false)
    expect(board.classList.contains('is-in')).toBe(true)
  })

  it('reduced motion: never armed', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    placeBoard(2000)
    const { container } = render(<Surmesure />)
    const board = container.querySelector('.board') as HTMLElement
    expect(board.classList.contains('is-armed')).toBe(false)
  })

  it('the links stay reachable while armed', () => {
    mockReducedMotion(false)
    mockIntersectionObserver()
    placeBoard(2000)
    render(<Surmesure />)
    for (const c of SURMESURE.crms)
      expect(screen.getByRole('link', { name: c.label }).getAttribute('href')).toBe(c.href)
  })
})
