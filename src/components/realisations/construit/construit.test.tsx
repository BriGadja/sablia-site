import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { CARDS, deckSlot, FINAL_STAGE, figureText, fmt, IDLE_STAGE } from './content'
import { Construit } from './index'
import { lit, panel } from './types'

vi.mock('./cards/helene', () => ({
  HeleneCard: ({ stage }: { stage: import('./types').CardStage }) => (
    <div
      data-testid="helene"
      className={panel(stage, 1)}
      data-l={lit(stage, 5)}
      data-plan={String(stage.plan)}
    />
  ),
}))
vi.mock('./cards/noesia', () => ({
  NoesiaCard: ({ stage }: { stage: import('./types').CardStage }) => (
    <div data-testid="noesia" data-b={String(stage.b)} data-plan={String(stage.plan)} />
  ),
}))

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
  it('lists the six wall cards in the decided order, voice last', () => {
    expect(CARDS.map((c) => c.kind)).toEqual([
      'helene',
      'site',
      'cash',
      'noesia',
      'seminar',
      'voice',
    ])
    expect(CARDS[CARDS.length - 1].muted).toBe(true)
  })

  it('carries the recounted cashback figure and the voice figure', () => {
    const cash = CARDS.find((c) => c.kind === 'cash')
    expect(figureText(cash!, FINAL_STAGE.f)).toBe('699 000+ relevés')
    const voice = CARDS.find((c) => c.kind === 'voice')
    expect(figureText(voice!, 1)).toBe('68 rendez-vous pris en cinq mois')
    expect(fmt(0)).toBe('0')
  })

  it('counts up with ease-out and only adds the plus at the end', () => {
    const cash = CARDS.find((c) => c.kind === 'cash')!
    expect(figureText(cash, 0)).toBe('0 relevés')
    expect(figureText(cash, 0.5).endsWith('+ relevés')).toBe(false)
  })

  // Adversarial review K6 (dir-4, fai-4): voice is no longer sold (« Agent vocal », not « Sur demande ») and
  // the 68 bookings are worded as proof line P-8 (sector, period, no name). Brice at VP2 (13/11, « laisse
  // vingtaine »): « une vingtaine … depuis 2024 » stays, his own count of 19/10 (CAREER.md « Voice agents »).
  it('says what the voice card was: tag « Agent vocal », « une vingtaine » since 2024, the 68 bookings of P-8', () => {
    const voice = CARDS.find((c) => c.kind === 'voice')
    if (voice === undefined) throw new Error('the wall lost its voice card')
    expect(voice.tags).toBe('Agent vocal')
    expect(voice.text).toBe(
      "Une vingtaine mis en service depuis 2024 : accueil téléphonique, rappels, prise de rendez-vous. Les 68 rendez-vous : un agent sortant, dans l'investissement locatif clé en main, d'avril à août 2026.",
    )
    expect(`${voice.tags} ${voice.text}`).not.toMatch(/sur demande/i)
    expect(voice.muted).toBe(true)
  })

  // Brice at VP2 (13/11): the maintenance card leaves (no written proof it served); the cashback card is
  // named for what was built, « Plateforme de veille concurrentielle », and said in the past (the service
  // stopped on 07/11; 699 014 rates read from 22/02 to 24/10/2026, recount of 26/10).
  it('drops the maintenance card and names the cashback card for what was built, in the past', () => {
    expect(CARDS.some((c) => (c.kind as string) === 'maint')).toBe(false)
    expect(CARDS.map((c) => `${c.sector} ${c.text}`).join(' ')).not.toMatch(/maintenance/i)
    const cash = CARDS.find((c) => c.kind === 'cash')
    if (cash === undefined) throw new Error('the wall lost its cashback card')
    expect(cash.sector).toBe('Plateforme de veille concurrentielle')
    expect(cash.text).toBe(
      'Pour une plateforme de cashback : les taux de ses concurrents, relevés chaque jour pendant huit mois dans une application.',
    )
    expect(cash.tags).toBe('Application')
    expect(cash.types).toEqual(['outils'])
  })

  // The seminar card is the « matinée de sensibilisation » of proof line P-19, shown under « Conférences ».
  it('tags the seminar card « Séminaire »', () => {
    expect(CARDS.find((c) => c.kind === 'seminar')?.tags).toBe('Séminaire')
  })

  it('has no em dash, no IAPreneurs and no client name in the visitor copy', () => {
    const all = CARDS.map((c) => `${c.tags} ${c.sector} ${c.text}`).join(' ')
    expect(all).not.toMatch(/—|IAPreneurs|cliente/)
  })

  it('exposes an idle and a final stage', () => {
    expect(IDLE_STAGE).toEqual({ plan: false, b: 0, l: 0, f: 0 })
    expect(FINAL_STAGE).toEqual({ plan: true, b: 9, l: 9, f: 1 })
  })
})

describe('Construit', () => {
  it('server-renders the title, the six rows and the final figures', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const section = container.querySelector('section#construit.v2-construit')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Exemples de réalisations.')
    expect(screen.getByText('Plus de 10 clients accompagnés depuis 2025.')).toBeTruthy()
    expect(section?.querySelectorAll('ol[aria-label="Toutes les réalisations"] li').length).toBe(6)
    expect(section?.querySelectorAll('article.deck-card').length).toBe(6)
    expect(section?.textContent).toContain('699 000+ relevés')
    expect(section?.textContent).toContain('68 rendez-vous pris en cinq mois')
    expect(section?.textContent).not.toMatch(/—/)
  })

  it('shows only the first card to assistive tech and marks its row current', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const cards = container.querySelectorAll('article.deck-card')
    expect(cards[0].getAttribute('aria-hidden')).toBe('false')
    expect(cards[1].getAttribute('aria-hidden')).toBe('true')
    const rows = container.querySelectorAll('button.caserow')
    expect(rows[0].getAttribute('aria-current')).toBe('true')
    expect(rows[1].getAttribute('aria-current')).toBeNull()
  })

  it('jumps to a card when its row is clicked', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const rows = container.querySelectorAll('button.caserow')
    fireEvent.click(rows[2])
    const cards = container.querySelectorAll('article.deck-card')
    expect(cards[2].getAttribute('aria-hidden')).toBe('false')
    expect(cards[0].getAttribute('aria-hidden')).toBe('true')
    expect(rows[2].getAttribute('aria-current')).toBe('true')
  })

  it('advances to the next card when the progress bar ends, and wraps to the first', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    const rows = () => container.querySelectorAll('button.caserow')
    fireEvent.click(rows()[5])
    const grow = container.querySelector('.grow') as HTMLElement
    fireEvent.animationEnd(grow)
    expect(rows()[0].getAttribute('aria-current')).toBe('true')
  })

  it('pauses the bar with the button and says so', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    const section = container.querySelector('section') as HTMLElement
    act(() => io.trigger(section, true))
    const grow = () => container.querySelector('.grow') as HTMLElement
    expect(grow().style.animationPlayState).toBe('running')
    const btn = screen.getByRole('button', { name: /Mettre en pause/ })
    expect(btn.getAttribute('aria-pressed')).toBeNull()
    fireEvent.click(btn)
    expect(grow().style.animationPlayState).toBe('paused')
    expect(screen.getByRole('button', { name: /Reprendre le défilement/ })).toBeTruthy()
  })

  it('plays the first card when scrolled into view: plan, panels, then lines', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    const section = container.querySelector('section') as HTMLElement
    act(() => io.trigger(section, true))
    const first = () => container.querySelectorAll('article.deck-card')[0]
    const d = () => first().querySelector('[data-testid="helene"]') as HTMLElement
    expect(d().dataset.plan).toBe('true')
    expect(d().className).not.toContain('on')
    await tick(510)
    await tick(260 * 2 + 10)
    expect(d().className).toContain('on')
    expect(d().dataset.l).toBe('')
    await tick(450 + 550 * 5 + 10)
    expect(d().dataset.l).toBe('on')
  })

  it('under reduced motion nothing advances on its own and the bar is not animated', () => {
    mockReducedMotion(true)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    act(() => io.trigger(container.querySelector('section') as HTMLElement, true))
    const d = container.querySelector('[data-testid="helene"]') as HTMLElement
    expect(d.dataset.l).toBe('on')
    expect(d.className).toContain('on')
  })
})

describe('card footers', () => {
  it('links the Noésia card to noesia.school as a real anchor', () => {
    mockIntersectionObserver()
    const { container } = render(<Construit />)
    const link = container.querySelector('a[href="https://noesia.school"]')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('rel')).toBe('noopener')
    expect(link?.closest('article')?.textContent).toContain('École Noésia')
  })

  it('names no client company and no headcount on the séminaire card', () => {
    const seminar = CARDS.find((c) => c.kind === 'seminar')!
    expect(`${seminar.sector} ${seminar.text}`).not.toMatch(
      /\d+\s*(personnes|participants|collaborateurs)/i,
    )
  })
})

/**
 * US-108: the wall filters by type. Strings typed from copy deck B5 (`real.filter.*`, `real.list.label`,
 * `real.status`), never read back from the source. Types: plan Phase G table.
 */
const CHIPS = ['Toutes', 'Outils', 'Formations', 'Conférences', 'Sites']
const SECTORS = {
  helene: 'Hélène, psychopraticienne et conseillère en nutrition',
  site: 'Un institut de beauté à Rouen',
  cash: 'Plateforme de veille concurrentielle',
  noesia: 'École Noésia',
  seminar: 'Un cabinet de conseil en ingénierie',
  voice: 'Agents vocaux',
}
const SETS: Record<string, { list: string; status: string; sectors: string[] }> = {
  Toutes: {
    list: 'Toutes les réalisations',
    status: '6 réalisations sur 6',
    sectors: Object.values(SECTORS),
  },
  Outils: {
    list: 'Réalisations : outils',
    status: '3 réalisations sur 6',
    sectors: [SECTORS.helene, SECTORS.cash, SECTORS.voice],
  },
  Formations: {
    list: 'Réalisations : formations',
    status: '2 réalisations sur 6',
    sectors: [SECTORS.noesia, SECTORS.seminar],
  },
  Conférences: {
    list: 'Réalisations : conférences',
    status: '1 réalisation sur 6',
    sectors: [SECTORS.seminar],
  },
  Sites: {
    list: 'Réalisations : sites',
    status: '2 réalisations sur 6',
    sectors: [SECTORS.helene, SECTORS.site],
  },
}

const group = () => screen.getByRole('group', { name: 'Filtrer les réalisations' })
const chip = (label: string) => within(group()).getByRole('button', { name: label })
const press = (label: string) => fireEvent.click(chip(label))
const rows = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLButtonElement>('button.caserow'))
const rowSectors = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('ol.cn-list .cn-row-sector')).map((s) => s.textContent)
const currentSector = (c: HTMLElement) =>
  c.querySelector('button.caserow[aria-current="true"] .cn-row-sector')?.textContent
/** The card shown to assistive tech: the one front card of the deck. */
const frontSector = (c: HTMLElement) =>
  c.querySelector('article.deck-card[aria-hidden="false"] .cn-sector')?.textContent
const shownCards = (c: HTMLElement) => c.querySelectorAll('article.deck-card:not([hidden])')
const pauseButton = () =>
  screen.queryByRole('button', { name: /Mettre en pause|Reprendre le défilement/ })

describe('filter by type (US-108)', () => {
  it('gives every card at least one type, as the plan table says', () => {
    const allowed = ['outils', 'formations', 'conferences', 'sites']
    for (const c of CARDS) {
      expect(c.types.length, c.kind).toBeGreaterThan(0)
      for (const t of c.types) expect(allowed, c.kind).toContain(t)
    }
    expect(Object.fromEntries(CARDS.map((c) => [c.kind, [...c.types].sort()]))).toEqual({
      helene: ['outils', 'sites'],
      site: ['sites'],
      cash: ['outils'],
      noesia: ['formations'],
      seminar: ['conferences', 'formations'],
      voice: ['outils'],
    })
  })

  it('offers a group of five toggle buttons whose labels never change, « Toutes » pressed first', () => {
    mockReducedMotion(false)
    render(<Construit />)
    const buttons = within(group()).getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual(CHIPS)
    expect(buttons.map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
      'false',
      'false',
    ])
    for (const label of [...CHIPS.slice(1), 'Toutes']) {
      press(label)
      const now = within(group()).getAllByRole('button')
      expect(now.map((b) => b.textContent)).toEqual(CHIPS)
      expect(
        now.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.textContent),
      ).toEqual([label])
    }
  })

  it('keeps only the cards of the pressed type, in the list and in the deck, and names the list after it', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    for (const label of ['Sites', 'Conférences', 'Formations', 'Outils', 'Toutes']) {
      press(label)
      const set = SETS[label]
      expect(rowSectors(container), label).toEqual(set.sectors)
      expect(container.querySelector('ol.cn-list')?.getAttribute('aria-label'), label).toBe(
        set.list,
      )
      expect(shownCards(container).length, label).toBe(set.sectors.length)
      expect(container.querySelectorAll('article.deck-card').length, label).toBe(6)
      for (const a of container.querySelectorAll('article.deck-card[hidden]'))
        expect(a.getAttribute('aria-hidden'), label).toBe('true')
    }
  })

  it('says the count in a status line outside the deck, present in the server HTML', () => {
    mockReducedMotion(false)
    const html = renderToString(<Construit />)
    expect(html).toMatch(/role="status"[^>]*>6 réalisations sur 6</)
    const { container } = render(<Construit />)
    const status = screen.getByRole('status')
    expect(status.closest('.deck-wrap')).toBeNull()
    expect(status.closest('ol')).toBeNull()
    expect(status.closest('article')).toBeNull()
    for (const label of ['Sites', 'Conférences', 'Outils', 'Formations', 'Toutes']) {
      press(label)
      expect(screen.getByRole('status').textContent, label).toBe(SETS[label].status)
    }
    expect(container.querySelectorAll('[role="status"]').length).toBe(1)
  })

  it('advances and wraps inside the filtered set', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    press('Sites')
    expect(currentSector(container)).toBe(SECTORS.helene)
    fireEvent.animationEnd(container.querySelector('.grow') as HTMLElement)
    expect(currentSector(container)).toBe(SECTORS.site)
    expect(frontSector(container)).toBe(SECTORS.site)
    fireEvent.animationEnd(container.querySelector('.grow') as HTMLElement)
    expect(currentSector(container)).toBe(SECTORS.helene)
    expect(frontSector(container)).toBe(SECTORS.helene)
    press('Formations')
    fireEvent.animationEnd(container.querySelector('.grow') as HTMLElement)
    fireEvent.animationEnd(container.querySelector('.grow') as HTMLElement)
    expect(currentSector(container)).toBe(SECTORS.noesia)
  })

  it('a filter press goes back to the first card of the set', () => {
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    fireEvent.click(rows(container)[4]) // the seminar card, also in « Formations »
    expect(currentSector(container)).toBe(SECTORS.seminar)
    press('Formations')
    expect(currentSector(container)).toBe(SECTORS.noesia)
    expect(frontSector(container)).toBe(SECTORS.noesia)
    expect(container.querySelectorAll('.grow').length).toBe(1)
  })

  it('a filter press leaves no build-up running on the card it hides', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    act(() => io.trigger(container.querySelector('section') as HTMLElement, true))
    await tick(510) // the first card is building up: its next panel is due 250 ms later
    press('Formations')
    const helene = container.querySelector('[data-testid="helene"]')?.closest('article')
    expect(helene?.hasAttribute('hidden')).toBe(true)
    const noesia = () => container.querySelector('[data-testid="noesia"]') as HTMLElement
    expect(noesia().dataset.plan).toBe('true')
    expect(noesia().dataset.b).toBe('0')
    await tick(480) // the hidden card's steps must not land on the new front card
    expect(noesia().dataset.b).toBe('0')
    await tick(30) // the new card's own first panel, 500 ms after its plan
    expect(noesia().dataset.b).toBe('1')
  })

  it('with one card, the auto-advance stops on purpose and no pause button is offered', async () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    act(() => io.trigger(container.querySelector('section') as HTMLElement, true))
    expect(pauseButton()).not.toBeNull()
    press('Conférences')
    expect(rowSectors(container)).toEqual([SECTORS.seminar])
    expect(frontSector(container)).toBe(SECTORS.seminar)
    expect(container.querySelector('.grow')).toBeNull()
    expect(pauseButton()).toBeNull()
    await tick(20000)
    expect(frontSector(container)).toBe(SECTORS.seminar)
    press('Toutes')
    expect(pauseButton()).not.toBeNull()
    expect(container.querySelector('.grow')).not.toBeNull()
  })

  it('with two cards, the card behind is the next one and never the leaving one', () => {
    // the stack slot of a two-card and a one-card set is the slot of a full deck
    expect(deckSlot(1, 0, 2)).toEqual(deckSlot(1, 0, 6))
    expect(deckSlot(0, 1, 2)).toEqual(deckSlot(1, 0, 6))
    expect(deckSlot(0, 0, 2)).toEqual(deckSlot(0, 0, 6))
    expect(deckSlot(0, 0, 1)).toEqual(deckSlot(0, 0, 6))
    // the full deck keeps its leaving slot (behind, faded out)
    expect(deckSlot(5, 0, 6)).toMatchObject({ active: false, ty: 16, op: 0, z: 1 })
    mockReducedMotion(false)
    const { container } = render(<Construit />)
    press('Sites')
    const behind = Array.from(shownCards(container)).find(
      (a) => a.getAttribute('aria-hidden') === 'true',
    ) as HTMLElement
    expect(behind.querySelector('.cn-sector')?.textContent).toBe(SECTORS.site)
    expect(behind.style.opacity).toBe('1')
    expect(behind.style.zIndex).toBe('9')
    expect(behind.style.transform).toBe('translate(0px, -14px) scale(0.965)')
  })

  it('a pause set by the visitor survives a filter press', () => {
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Construit />)
    act(() => io.trigger(container.querySelector('section') as HTMLElement, true))
    fireEvent.click(screen.getByRole('button', { name: /Mettre en pause/ }))
    press('Sites')
    expect(screen.getByRole('button', { name: /Reprendre le défilement/ })).toBeTruthy()
    expect((container.querySelector('.grow') as HTMLElement).style.animationPlayState).toBe(
      'paused',
    )
    press('Conférences')
    press('Toutes')
    expect(screen.getByRole('button', { name: /Reprendre le défilement/ })).toBeTruthy()
    expect((container.querySelector('.grow') as HTMLElement).style.animationPlayState).toBe(
      'paused',
    )
  })

  it('server HTML and reduced motion show all six and hydrate on « Toutes » without a mismatch', async () => {
    for (const reduced of [false, true]) {
      mockReducedMotion(reduced)
      mockIntersectionObserver()
      const html = renderToString(<Construit />)
      const container = document.createElement('div')
      const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html')
      container.append(...Array.from(parsed.body.childNodes))
      document.body.appendChild(container)
      expect(container.querySelectorAll('ol.cn-list li').length).toBe(6)
      expect(shownCards(container).length).toBe(6)
      expect(container.querySelector('[role="status"]')?.textContent).toBe('6 réalisations sur 6')
      expect(
        container.querySelector('[role="group"] button[aria-pressed="true"]')?.textContent,
      ).toBe('Toutes')
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
      const recoverable = vi.fn()
      try {
        await act(async () => {
          hydrateRoot(container, <Construit />, { onRecoverableError: recoverable })
        })
        expect(recoverable, `reduced=${reduced}`).not.toHaveBeenCalled()
        expect(errors, `reduced=${reduced}`).not.toHaveBeenCalled()
        expect(container.querySelectorAll('ol.cn-list li').length).toBe(6)
        expect(shownCards(container).length).toBe(6)
        expect(
          container.querySelector('[role="group"] button[aria-pressed="true"]')?.textContent,
        ).toBe('Toutes')
        await tick(20000)
        expect(currentSector(container)).toBe(SECTORS.helene)
      } finally {
        errors.mockRestore()
        container.remove()
      }
    }
  })
})

// V2 of 13/11: the voice card's text grew (« une vingtaine … depuis 2024 », Brice) and, on phones, the
// tag row (tag + figure pill, wrapped on two lines) was the one flex item allowed to shrink: it slid under
// the title. Measured in Chromium: the row needs 58 px and got 29; the voice text needs 38 px more at 320.
describe('card layout on phones', () => {
  const css = readFileSync(join(__dirname, 'construit.css'), 'utf8')
  it('never squeezes the tag row under the title', () => {
    expect(css.match(/\.cn-meta \{([^}]*)\}/)?.[1] ?? '').toMatch(/flex-shrink:\s*0/)
  })
  it('gives phone cards the room of the longest text, the deck following', () => {
    const card = Number(css.match(/\.deck-card \{\s*height:\s*(\d+)px;\s*\}/)?.[1])
    const wrap = Number(css.match(/\.deck-wrap \{\s*height:\s*(\d+)px;\s*\}/)?.[1])
    expect(card).toBeGreaterThanOrEqual(448)
    expect(wrap - card).toBe(30) // the room above the stack, unchanged (it was 430 / 400)
  })
})

describe('touch target', () => {
  it('the noesia.school link carries cn-link, rel kept, with a 44 px hit area', () => {
    const { container } = render(<Construit />)
    const a = container.querySelector('a[href="https://noesia.school"]') as HTMLAnchorElement
    expect(a.className).toContain('cn-link')
    expect(a.getAttribute('rel')).toBe('noopener')
    const css = readFileSync(join(__dirname, 'construit.css'), 'utf8')
    expect(css.match(/\.cn-link \{([^}]*)\}/)?.[1] ?? '').toMatch(/padding-block:\s*12px/)
  })
})
