import { fireEvent, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ACC_DATA } from './data'
import { AccompagnementHero } from './index'
import { AccompagnementModeProvider } from './mode'

const html = (n: string) => n.replace(/&#x27;/g, "'")

describe('static HTML (SSR content rule)', () => {
  const out = html(
    renderToString(
      <AccompagnementModeProvider>
        <AccompagnementHero />
      </AccompagnementModeProvider>,
    ),
  )

  it('is #top with the h1, the lede, both toggle labels and the booking call', () => {
    expect(out).toContain('id="top"')
    expect(out).toContain('Un accompagnement à votre rythme.')
    expect(out).toContain("s'y mettre sérieusement")
    expect(out).toContain('Pour vous')
    expect(out).toContain('Pour votre équipe')
    expect(out).toContain('Réserver 30 min')
    expect(out).toContain('Gratuit, sans engagement.')
  })

  it('carries the active audience week card', () => {
    expect(out).toContain('Dirigeant, indépendant')
    for (const [day, text] of ACC_DATA[0].week) {
      expect(out).toContain(day)
      expect(out).toContain(text)
    }
  })
})

describe('the toggle', () => {
  const setup = () =>
    render(
      <AccompagnementModeProvider>
        <AccompagnementHero />
      </AccompagnementModeProvider>,
    )

  it('starts on « Pour vous » and swaps the week card to the team on click', () => {
    setup()
    expect(screen.getByRole('button', { name: 'Pour vous' }).getAttribute('aria-pressed')).toBe(
      'true',
    )
    fireEvent.click(screen.getByRole('button', { name: 'Pour votre équipe' }))
    expect(
      screen.getByRole('button', { name: 'Pour votre équipe' }).getAttribute('aria-pressed'),
    ).toBe('true')
    expect(screen.getByRole('button', { name: 'Pour vous' }).getAttribute('aria-pressed')).toBe(
      'false',
    )
    expect(screen.getByText('Équipe')).toBeTruthy()
    expect(screen.getByText('Une séance de groupe sur vos outils')).toBeTruthy()
    expect(screen.queryByText('Dirigeant, indépendant')).toBeNull()
  })

  it('slides the pill with the selection', () => {
    const { container } = setup()
    const pill = container.querySelector<HTMLElement>('.seg-pill')
    expect(pill?.style.transform).toBe('translateX(0%)')
    fireEvent.click(screen.getByRole('button', { name: 'Pour votre équipe' }))
    expect(pill?.style.transform).toBe('translateX(100%)')
  })

  it('replays the rows (new nodes) on a real switch only', () => {
    const { container } = setup()
    const row = () => container.querySelector('.wk-row')
    const before = row()
    fireEvent.click(screen.getByRole('button', { name: 'Pour vous' }))
    expect(row()).toBe(before)
    fireEvent.click(screen.getByRole('button', { name: 'Pour votre équipe' }))
    expect(row()).not.toBe(before)
  })
})

describe('CP4 13: the checks land one after the other', () => {
  it('each check pops after its own row and later than the previous check', () => {
    const { container } = render(
      <AccompagnementModeProvider>
        <AccompagnementHero />
      </AccompagnementModeProvider>,
    )
    const rows = [...container.querySelectorAll<HTMLElement>('.wk-row')]
    const rowDelay = rows.map((r) => Number.parseInt(r.style.animationDelay, 10))
    const okDelay = rows.map((r) =>
      Number.parseInt(r.querySelector<HTMLElement>('.wk-ok')?.style.animationDelay ?? '', 10),
    )
    expect(rows).toHaveLength(3)
    okDelay.forEach((d, i) => {
      expect(d).toBeGreaterThan(rowDelay[i] ?? 0)
      if (i > 0) expect(d - (okDelay[i - 1] ?? 0)).toBeGreaterThanOrEqual(250)
    })
  })
})
