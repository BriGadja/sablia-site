import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { of1 } from '@/content/of1'
import { eurHt } from '@/lib/format'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { FAQS, FIN_BAND } from './content'
import { Faq } from './index'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('content', () => {
  it('holds nine questions in the mockup order', () => {
    expect(FAQS).toHaveLength(9)
    expect(FAQS[0].q).toBe('Ça marche avec mon CRM ?')
    expect(FAQS[8].q).toBe('Faites-vous aussi des agents vocaux ?')
  })

  it('FAQ 5 carries the verified D3 answer', () => {
    expect(FAQS[4].q).toBe('Où vont nos données ?')
    expect(FAQS[4].a).toContain("par défaut Anthropic ne s'en sert pas pour entraîner ses modèles")
    expect(FAQS[4].a).toContain('sous 30 jours')
    expect(FAQS[4].a).not.toMatch(/conforme RGPD|pas de sous-traitant/i)
  })

  it('FAQ 7 shows the OF-1 price and delay figures from of1.ts', () => {
    expect(FAQS[6].a).toContain(eurHt(of1.price.oneShotHt))
    expect(FAQS[6].a).toContain(`${of1.price.monthlyHt} €/mois`)
    expect(FAQS[5].a).toContain(`${of1.delay.days} jours`)
  })

  it('has no em dash, no banned wording, no IAPreneurs', () => {
    const all = FAQS.map((f) => `${f.q} ${f.a}`).join(' ')
    expect(all).not.toMatch(/—|conforme RGPD|sous-traitant|IAPreneurs/)
  })

  it('gives the home closing band its copy and the resources link', () => {
    expect(FIN_BAND.title).toBe('Trente minutes pour voir si ça tourne chez vous.')
    expect(FIN_BAND.link).toEqual({
      href: '/ressources',
      label: 'Pas encore prêt ? Le guide et les ressources gratuites.',
    })
  })
})

describe('Faq', () => {
  it('server-renders every answer, nine buttons and the live stack', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const section = container.querySelector('section#faq.v2-faq')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      "Ce qu'on nous demande avant d'appeler.",
    )
    expect(section?.querySelectorAll('button.qbtn').length).toBe(9)
    for (const f of FAQS) expect(section?.textContent).toContain(f.a)
    expect(section?.querySelector('[aria-live="polite"]')).not.toBeNull()
  })

  it('stages question 1 first, the others stay out of view', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const shown = container.querySelectorAll('.fq-pair:not([hidden])')
    expect(shown.length).toBe(1)
    expect(shown[0].textContent).toContain(FAQS[0].a)
    expect(container.querySelector('button.qbtn[aria-pressed="true"]')?.textContent).toBe(FAQS[0].q)
  })

  it('keeps the last three asked questions and moves the pressed state', () => {
    mockReducedMotion(false)
    const { container } = render(<Faq />)
    const btn = (i: number) => container.querySelectorAll('button.qbtn')[i] as HTMLElement
    for (const i of [1, 2, 3]) fireEvent.click(btn(i))
    const shown = [...container.querySelectorAll('.fq-pair:not([hidden])')]
    expect(shown.length).toBe(3)
    expect(shown.map((s) => s.querySelector('.fq-q')?.textContent)).toEqual([
      FAQS[1].q,
      FAQS[2].q,
      FAQS[3].q,
    ])
    expect(container.querySelectorAll('button.qbtn[aria-pressed="true"]').length).toBe(1)
    expect(btn(3).getAttribute('aria-pressed')).toBe('true')
  })

  it('types dots then answers after a click, and shows no dots under reduced motion', () => {
    mockReducedMotion(false)
    const a = render(<Faq />)
    fireEvent.click(a.container.querySelectorAll('button.qbtn')[1])
    expect(a.container.querySelector('.fq-dots')).not.toBeNull()
    a.unmount()

    mockReducedMotion(true)
    const b = render(<Faq />)
    fireEvent.click(b.container.querySelectorAll('button.qbtn')[1])
    expect(b.container.querySelector('.fq-dots')).toBeNull()
    expect(b.container.querySelectorAll('.fq-pair:not([hidden])').length).toBe(2)
  })

  it('replays question 1 once when the section first scrolls into view', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Faq />)
    expect(container.querySelector('.fq-dots')).toBeNull()
    const section = container.querySelector('section#faq') as Element
    await act(async () => io.trigger(section, true))
    expect(container.querySelector('.fq-dots')).not.toBeNull()
  })
})
