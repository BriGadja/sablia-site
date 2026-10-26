import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ACC_DATA } from '@/components/accompagnement/hero/data'
import Page, { metadata } from './page'

const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&')

describe('/accompagnement static sections (SSR content rule)', () => {
  const out = decode(renderToString(<Page />))

  it('carries the six section ids in order', () => {
    const ids = ['situations', 'livrables', 'exemples', 'pourquoi', 'questions', 'fin']
    const at = ids.map((id) => out.indexOf(`id="${id}"`))
    expect(at.every((i) => i > 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('renders the first audience situations and livrables', () => {
    for (const s of ACC_DATA[0].situs) expect(out).toContain(s)
    for (const [t] of ACC_DATA[0].delivs) expect(out).toContain(t)
    expect(out).toContain('Vous vous reconnaissez ?')
    expect(out).toContain('Vous repartez avec.')
  })

  it('renders exemples, pourquoi, questions and the closing band', () => {
    expect(out).toContain("L'équipe IT d'un grand groupe")
    expect(out).toContain("Les élèves de l'école Noésia")
    expect(out).toContain("Du débutant aux frontières de l'IA.")
    expect(out).toContain('/photos/accueil-meetup-public-900.webp')
    expect(out).toContain('Voir aussi les formations')
    expect(out).toContain('Combien de temps dure un accompagnement ?')
    expect(out).toContain('À distance ?')
    expect(out).toContain('Trente minutes pour voir par où commencer.')
  })

  it('names no client, no IAPreneurs, no em dash, no digit figure in the static copy', () => {
    expect(out).not.toMatch(/IAPreneurs/i)
    const text = out.replace(/<[^>]*>/g, ' ')
    expect(text).not.toContain('—')
    expect(text).not.toMatch(/\d\s?(%|€|\+)/)
  })

  it('sets the page metadata', () => {
    expect(metadata.alternates?.canonical).toBe('/accompagnement')
  })
})

describe('audience toggle', () => {
  it('swaps situations and livrables', () => {
    render(<Page />)
    expect(screen.getByText(ACC_DATA[0].situs[0])).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Pour votre équipe' }))
    expect(screen.getByText(ACC_DATA[1].situs[0])).toBeTruthy()
    expect(screen.getByText(ACC_DATA[1].delivs[3][0])).toBeTruthy()
    expect(screen.queryByText(ACC_DATA[0].situs[0])).toBeNull()
  })
})
