import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Lettre } from '@/components/lettre/data'

const loadLettres = vi.fn()
vi.mock('@/components/lettre/data', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/lettre/data')>()),
  loadLettres: (...a: unknown[]) => loadLettres(...a),
}))

import { NUMEROS } from '@/components/lettre/content'
import NewsletterView from '@/components/newsletter/NewsletterView'
import NewsletterPage, { metadata } from './page'

/**
 * `/newsletter` (US-81, US-83, US-102): the static HTML carries the whole promise, the form and the
 * list of the issues already published; the token links of the confirmation mail (`?c=`) and of the
 * invitation (`?t=`) show a button and post NOTHING on load: a mail scanner that opens the link
 * subscribes nobody. The page is an async wrapper that reads the issues once; the view is synchronous.
 */
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

const issue = (slug: string, titre: string, published_at: string): Lettre => ({
  slug,
  titre,
  resume: 'Résumé.',
  corps_md: '## A\n\nTexte.',
  youtube_id: null,
  published_at,
  updated_at: published_at,
})
const OLDER = issue('2026-11-17-premier', 'Le premier numéro', '2026-11-17T07:30:00+00:00')
// 23:30 UTC on 23/11 is already Tuesday 24/11 in Paris.
const NEWER = issue('2026-11-24-deuxieme', 'Le deuxième numéro', '2026-11-23T23:30:00+00:00')

beforeEach(() => {
  delete process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  loadLettres.mockReset()
})

const TOKEN = '6f1c2a9e-4b7d-4c1e-9a3f-2d5e8b7c1a40'

/** The text a reader sees: inline tags vanish, block tags separate words. */
const text = (html: string) =>
  html
    .replace(/<\/?(?:strong|span|em|a)(?:\s[^>]*)?>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')

function stubFetch(status: number, body: unknown = null) {
  const spy = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      new Response(body === null ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
  )
  vi.stubGlobal('fetch', spy)
  return spy
}

const sent = (spy: ReturnType<typeof stubFetch>) =>
  JSON.parse(String(spy.mock.calls[0]?.[1]?.body)) as Record<string, unknown>

/** Renders the page body at a given address and lets the mount effects run. */
async function open(search = '', lettres: Lettre[] = []) {
  window.history.replaceState(null, '', `/newsletter${search}`)
  const view = render(<NewsletterView lettres={lettres} />)
  await act(async () => {})
  return view
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

describe('/newsletter: the static HTML (SSR content rule)', () => {
  const t = text(renderToString(<NewsletterView lettres={[]} />))

  it('carries the title, the promise, the byline, the form and the consent line', () => {
    expect(t).toContain("L'IA au travail")
    expect(t).toContain(
      "Chaque mardi, la vidéo de la semaine poussée plus loin : le problème d'entreprise derrière, ce que dix minutes ne disent pas, et mon avis.",
    )
    expect(t).toContain('Par Brice Gachadoat, Sablia')
    expect(t).toContain('Prénom')
    expect(t).toContain('Email')
    expect(t).toContain('Recevoir la lettre')
    expect(t).toContain(
      'En vous inscrivant, vous acceptez de recevoir la lettre du mardi. Un lien de désinscription dans chaque mail.',
    )
    const html = renderToString(<NewsletterView lettres={[]} />)
    expect(html).toContain('href="/politique-confidentialite"')
    expect(html).toContain('data-form="newsletter"')
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('declares its own canonical path and title', () => {
    expect(metadata.alternates?.canonical).toBe('/newsletter')
    expect(metadata.title).toEqual({
      absolute: "L'IA au travail · la lettre du mardi de Brice Gachadoat",
    })
  })
})

describe('/newsletter: the list of issues (#numeros, US-102)', () => {
  it('sits after #numero and lists the issues newest first: Paris date, title, link to the page', () => {
    const { container } = render(<NewsletterView lettres={[OLDER, NEWER]} />)
    const ids = Array.from(container.querySelectorAll('main > section[id]')).map((s) => s.id)
    expect(ids).toEqual(['top', 'numero', 'numeros'])
    const section = container.querySelector('section#numeros') as Element
    expect(section.querySelector('h2')?.textContent).toBe(NUMEROS.title)
    const items = Array.from(section.querySelectorAll('li'))
    expect(items).toHaveLength(2)
    const links = items.map((li) => li.querySelector('a')?.getAttribute('href'))
    expect(links).toEqual(['/lettre/2026-11-24-deuxieme', '/lettre/2026-11-17-premier'])
    expect(items[0].textContent).toContain('Le deuxième numéro')
    const time = items[0].querySelector('time') as HTMLTimeElement
    expect(time.textContent).toBe('24 novembre 2026')
    expect(time.getAttribute('datetime')).toBe(NEWER.published_at)
    expect(section.querySelector('[data-state="empty"]')).toBeNull()
  })

  it('never lets « : » start a line in a listed title', () => {
    const { container } = render(
      <NewsletterView lettres={[{ ...OLDER, titre: 'Relancer : la méthode' }]} />,
    )
    expect(container.querySelector('#numeros li')?.textContent).toContain(
      'Relancer\u00a0: la méthode',
    )
  })

  it('says so in one sentence while no issue is published, with no list', () => {
    const { container } = render(<NewsletterView lettres={[]} />)
    const section = container.querySelector('section#numeros') as Element
    expect(section.querySelector('[data-state="empty"]')?.textContent).toBe(NUMEROS.empty)
    expect(section.querySelectorAll('li')).toHaveLength(0)
  })

  it('carries the list in the static HTML', () => {
    const html = renderToString(<NewsletterView lettres={[NEWER]} />)
    expect(html).toContain('href="/lettre/2026-11-24-deuxieme"')
    expect(html).toContain('Le deuxième numéro')
  })

  it('the page reads the published issues once and renders them', async () => {
    loadLettres.mockResolvedValue([NEWER, OLDER])
    const { container } = render(await NewsletterPage())
    expect(loadLettres).toHaveBeenCalledTimes(1)
    expect(container.querySelector('a[href="/lettre/2026-11-17-premier"]')).not.toBeNull()
  })

  it('the page propagates a strict read failure (an unreadable register never ships)', async () => {
    loadLettres.mockRejectedValue(new Error('contenu_lettres read answered HTTP 500'))
    await expect(NewsletterPage()).rejects.toThrow(/HTTP 500/)
  })
})

describe('/newsletter: the public form', () => {
  it('posts nothing on mount', async () => {
    const spy = stubFetch(200, { ok: true, state: 'pending' })
    await open()
    expect(spy).not.toHaveBeenCalled()
  })

  it('sends a request and shows the same « pending » screen whatever the address', async () => {
    const spy = stubFetch(200, { ok: true, state: 'pending' })
    const user = userEvent.setup()
    await open()
    await user.type(screen.getByLabelText('Prénom'), 'Léa')
    await user.type(screen.getByLabelText('Email'), 'lea@exemple.fr')
    await user.click(screen.getByRole('button', { name: 'Recevoir la lettre' }))

    expect(spy.mock.calls[0]?.[0]).toBe('/api/newsletter')
    expect(sent(spy)).toMatchObject({
      kind: 'request',
      prenom: 'Léa',
      email: 'lea@exemple.fr',
      website: '',
    })
    expect(typeof sent(spy).elapsedMs).toBe('number')
    expect(
      await screen.findByText(
        "Si cette adresse n'est pas déjà inscrite, un mail vient de partir : cliquez sur son lien pour confirmer.",
      ),
    ).toBeTruthy()
  })

  it('shows the same « pending » screen to a bot answered 204', async () => {
    stubFetch(204)
    const user = userEvent.setup()
    await open()
    await user.type(screen.getByLabelText('Prénom'), 'Bot')
    await user.type(screen.getByLabelText('Email'), 'bot@exemple.fr')
    await user.click(screen.getByRole('button', { name: 'Recevoir la lettre' }))
    expect(await screen.findByText(/un mail vient de partir/)).toBeTruthy()
  })

  it('says « réessayez demain » on 429 and points to Brice on a failure', async () => {
    stubFetch(429, { error: 'busy', code: 'busy' })
    const user = userEvent.setup()
    const first = await open()
    await user.type(screen.getByLabelText('Prénom'), 'Léa')
    await user.type(screen.getByLabelText('Email'), 'lea@exemple.fr')
    await user.click(screen.getByRole('button', { name: 'Recevoir la lettre' }))
    expect(
      await screen.findByText("Trop d'inscriptions aujourd'hui, réessayez demain."),
    ).toBeTruthy()
    first.unmount()

    stubFetch(502, { error: 'Envoi impossible', code: 'mail_failed' })
    await open()
    await user.type(screen.getByLabelText('Prénom'), 'Léa')
    await user.type(screen.getByLabelText('Email'), 'lea@exemple.fr')
    await user.click(screen.getByRole('button', { name: 'Recevoir la lettre' }))
    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toContain('écrivez à brice@sablia.io')
  })
})

describe('/newsletter: the token links', () => {
  it('jeton ?c= : a button, nothing posted on load, the token dropped from the address', async () => {
    const spy = stubFetch(200, { ok: true, state: 'subscribed', prenom: 'Léa' })
    await open(`?c=${TOKEN}`)
    expect(spy).not.toHaveBeenCalled()
    expect(window.location.search).toBe('')
    expect(screen.queryByLabelText('Email')).toBeNull()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Confirmer mon inscription' }))
    expect(spy).toHaveBeenCalledTimes(1)
    expect(sent(spy)).toEqual({ kind: 'confirm', token: TOKEN })
    expect(
      await screen.findByText("C'est fait, Léa. Premier numéro mardi 17 novembre."),
    ).toBeTruthy()
  })

  it("jeton ?t= : the invitation button posts an invite and says « C'est fait. »", async () => {
    const spy = stubFetch(200, { ok: true, state: 'subscribed' })
    await open(`?t=${TOKEN}`)
    expect(spy).not.toHaveBeenCalled()
    expect(window.location.search).toBe('')

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Confirmer mon inscription' }))
    expect(sent(spy)).toEqual({ kind: 'invite', token: TOKEN })
    expect(await screen.findByText("C'est fait. Premier numéro mardi 17 novembre.")).toBeTruthy()
  })

  it('drops the « Premier numéro » line once an issue is published', async () => {
    stubFetch(200, { ok: true, state: 'subscribed', prenom: 'Léa' })
    await open(`?c=${TOKEN}`, [OLDER])
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Confirmer mon inscription' }))
    const done = await screen.findByText("C'est fait, Léa.")
    expect(done.textContent).toBe("C'est fait, Léa.")
    expect(document.body.textContent).not.toContain('Premier numéro')
  })

  it('drops the « Premier numéro » line once the build is at or after Tuesday 17/11 09:00 Paris', async () => {
    const cases = [
      ['2026-11-17T07:59:59.999Z', "C'est fait, Léa. Premier numéro mardi 17 novembre."], // 08:59:59 Paris
      ['2026-11-17T08:00:00.000Z', "C'est fait, Léa."], // 09:00 Paris, the send
      ['2026-12-01T10:00:00.000Z', "C'est fait, Léa."],
    ] as const
    for (const [builtAt, message] of cases) {
      vi.stubEnv('NEXT_PUBLIC_BUILD_AT', builtAt)
      stubFetch(200, { ok: true, state: 'subscribed', prenom: 'Léa' })
      const view = await open(`?c=${TOKEN}`)
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: 'Confirmer mon inscription' }))
      const done = await screen.findByText(/^C'est fait, Léa\./)
      expect(done.textContent, builtAt).toBe(message)
      view.unmount()
      vi.unstubAllEnvs()
    }
  })

  it('jeton refusé (404 or 410) : the same neutral message, and the form to start again', async () => {
    for (const status of [404, 410]) {
      stubFetch(status, { error: 'x', code: status === 404 ? 'unknown_token' : 'opposed' })
      const view = await open(`?c=${TOKEN}`)
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: 'Confirmer mon inscription' }))
      expect(await screen.findByText(/Ce lien n'est plus valable/)).toBeTruthy()
      expect(screen.getByLabelText('Email')).toBeTruthy()
      view.unmount()
    }
  })
})

describe('/newsletter: motion', () => {
  const css = readFileSync(join(__dirname, '../../components/newsletter/newsletter.css'), 'utf8')

  it('gives the issue rows no scroll-driven entry animation (axe reads text below the fold in its from state)', () => {
    expect(css).not.toMatch(/\.nl-issues li[^{}]*\{[^}]*animation/)
  })

  it('keeps the hover of an issue row', () => {
    expect(css).toMatch(/\.nl-issue:hover \.nl-issue-title \{[^}]*color: #835a0c/)
  })
})
