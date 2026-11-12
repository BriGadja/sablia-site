/**
 * The assembled home (US-104, plan sablia-site-structure-offre E1): eleven bands in order inside
 * `main#contenu`, the monthly offer right after the hero, each id once, the hash anchors the footer,
 * `/about` (301 to `/#derriere`) and the closing band rely on, and none of the bands that left the home
 * (`scene` went to the CRM offer page, `construit` to /realisations, `apres` gave way to `mensuel`).
 * `#webinaire` and the closing band's webinar link exist only while the 03/12 session is ahead, so
 * every case fixes the clock, never the real date.
 */
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SessionBar } from '@/components/shell/SessionBar'
import { SiteFooter } from '@/components/shell/SiteFooter'
import { SiteHeader } from '@/components/shell/SiteHeader'
import { HERO as WEBINAR_HERO } from '@/content/webinaire'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { FACTURE } from './automatisations/content'
import { FAQS } from './faq/content'
import { HomePage } from './HomePage'
import { OFFRE } from './offre/content'
import { resolveTiles } from './videos/content'

// `Videos` is an async server component (its tiles are read at build time); the home test renders
// its own view with the fallback tiles, so the band keeps its real markup and its id.
vi.mock('./videos', async (importOriginal) => {
  const real = await importOriginal<typeof import('./videos')>()
  return { ...real, Videos: () => <real.VideosView tiles={resolveTiles(null)} /> }
})
// The served page wraps the home in the shell (bar, header, footer), which reads the pathname.
vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

const BEFORE = new Date('2026-11-05T09:00:00+01:00')
const START = new Date('2026-12-03T12:00:00+01:00')

const ORDER = [
  'top',
  'mensuel',
  'automatisations',
  'offre',
  'formations',
  'conferences',
  'videos',
  'derriere',
  'webinaire',
  'faq',
  'fin',
]
const ANCHORS = ['top', 'offre', 'derriere', 'videos', 'faq', 'fin']
const WEBINAR_LINK = 'Pas encore prêt ? Le webinaire gratuit du jeudi 3 décembre.'

function at(now: Date) {
  vi.useFakeTimers({ now, toFake: ['Date'] })
  vi.stubEnv('NEXT_PUBLIC_BUILD_AT', '')
}

/** Ids of the bands: sections with an id that sit in no other section. */
function bands(root: ParentNode): string[] {
  return Array.from(root.querySelectorAll<HTMLElement>('section[id]'))
    .filter((s) => s.parentElement?.closest('section') == null)
    .map((s) => s.id)
}

beforeEach(() => {
  mockReducedMotion(false)
  mockIntersectionObserver()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('home before the 03/12 session', () => {
  it('mounts the eleven bands in the contract order inside main#contenu', () => {
    at(BEFORE)
    const { container } = render(<HomePage />)
    const main = container.querySelector('main#contenu') as HTMLElement
    expect(main).not.toBeNull()
    expect(main.getAttribute('tabindex')).toBe('-1')
    expect(bands(main)).toEqual(ORDER)
  })

  it('carries each hash anchor exactly once, and no band that left the home', () => {
    at(BEFORE)
    render(<HomePage />)
    for (const id of [
      ...ANCHORS,
      'mensuel',
      'conferences',
      'webinaire',
      'formations',
      'automatisations',
    ]) {
      expect(document.querySelectorAll(`[id="${id}"]`), `#${id}`).toHaveLength(1)
    }
    for (const gone of ['scene', 'construit', 'apres'])
      expect(document.getElementById(gone), `#${gone}`).toBeNull()
  })

  it('the static HTML (what crawlers read) has the same bands in the same order', () => {
    at(BEFORE)
    const html = renderToString(<HomePage />)
    const idx = ORDER.map((id) => html.indexOf(`id="${id}"`))
    expect(idx.every((i) => i >= 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    for (const gone of ['scene', 'construit', 'apres']) expect(html).not.toContain(`id="${gone}"`)
  })

  it('the closing band keeps its quiet link to the webinar and its booking button', () => {
    at(BEFORE)
    render(<HomePage />)
    const fin = document.getElementById('fin') as HTMLElement
    const link = fin.querySelector('a[href="/webinaire"]')
    expect(link?.textContent).toBe(WEBINAR_LINK)
    expect(fin.querySelector('button')?.textContent).toContain('Réserver 30 min')
  })
})

describe('home from the session start (03/12 12:00 Paris)', () => {
  it('drops #webinaire and keeps every other band in order', () => {
    at(START)
    const { container } = render(<HomePage />)
    const main = container.querySelector('main#contenu') as HTMLElement
    expect(bands(main)).toEqual(ORDER.filter((id) => id !== 'webinaire'))
    for (const id of ANCHORS) expect(document.getElementById(id), `#${id}`).not.toBeNull()
  })

  it('the closing band no longer names the past session, its booking button stays', () => {
    at(START)
    render(<HomePage />)
    const fin = document.getElementById('fin') as HTMLElement
    expect(fin.querySelector('a[href="/webinaire"]')).toBeNull()
    expect(fin.textContent).not.toContain('3 décembre')
    expect(fin.querySelector('button')?.textContent).toContain('Réserver 30 min')
  })
})

/**
 * US-104 Exemple, « no price on the home » (E-fix): the home as served (shell and page, server
 * rendered) carries no amount anywhere but in the demo scenes of `#automatisations`, whose figures
 * are the fictional example invoice of a scene (`FACTURE`), not a Sablia price. A price written into
 * any other band, the bar, the header or the footer turns this red, whichever file it comes from (the
 * source guard `no-training-price.test.ts` reads a fixed list of files). The word « prix » is said
 * only where the page tells where the price lives (the training panel, the FAQ answer) or that the
 * webinar is free; « tarif » never.
 */
const AMOUNT = /\d[\d\s .,]*\s?(€|euros?)/gi // the shape of no-training-price.test.ts
const amounts = (s: string) => s.match(AMOUNT) ?? []

function servedHome(): HTMLElement {
  const root = document.createElement('div')
  root.innerHTML = renderToString(
    <>
      <SessionBar />
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </>,
  )
  return root
}

function textNodes(node: Node, out: string[] = []): string[] {
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) out.push(child.nodeValue ?? '')
    else textNodes(child, out)
  }
  return out
}

const SAYS_PRICE = /\bprix\b|tarif/i
const PRICE_FAQ = FAQS.find((f) => f.q === 'Combien ça coûte ?')
/** The price answer's text nodes: its words around the link to the offer page (K6 review, tel-6). */
const PRICE_FAQ_NODES = (() => {
  const a = PRICE_FAQ?.a ?? 'missing FAQ answer'
  const link = PRICE_FAQ?.link?.text
  const at = link ? a.indexOf(link) : -1
  if (!link || at < 0) return [a]
  return [a.slice(0, at), a.slice(at + link.length)].map((t) => t.trim())
})()
const WHERE_THE_PRICE_LIVES = new Set<string>([
  OFFRE.prix,
  ...PRICE_FAQ_NODES,
  WEBINAR_HERO.facts.find((f) => f.key === 'prix')?.label ?? 'missing webinar fact',
])

describe.each([
  ['before', BEFORE],
  ['from', START],
])('the served home %s the 03/12 session start', (_, now) => {
  it('carries no amount outside the demo scenes of #automatisations, whose figures are the example invoice', () => {
    at(now)
    const root = servedHome()
    const all = amounts(root.innerHTML)
    const auto = root.querySelector('section#automatisations') as HTMLElement
    expect(auto).not.toBeNull()
    const inScenes = amounts(auto.outerHTML)
    expect(inScenes.length, 'the scanner sees the scenes’ amounts in this HTML').toBeGreaterThan(0)
    auto.remove()
    expect(amounts(root.innerHTML)).toEqual([])
    expect(all).toEqual(inScenes)
    const example = new Set(FACTURE.map(([, v]) => v.replace(/\s/g, '')))
    for (const a of inScenes) expect(example.has(a.replace(/\s/g, '')), a).toBe(true)
  })

  it('says « prix » only where it tells where the price lives, and never « tarif »', () => {
    at(now)
    const root = servedHome()
    root.querySelector('section#automatisations')?.remove()
    const said = textNodes(root)
      .map((t) => t.trim())
      .filter((t) => SAYS_PRICE.test(t))
    expect(said.filter((t) => !WHERE_THE_PRICE_LIVES.has(t))).toEqual([])
    const attrs = Array.from(root.querySelectorAll('*')).flatMap((el) =>
      ['alt', 'aria-label', 'title', 'content']
        .map((name) => el.getAttribute(name) ?? '')
        .filter((v) => SAYS_PRICE.test(v) || amounts(v).length > 0),
    )
    expect(attrs).toEqual([])
  })
})
