import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NewsletterPage, { metadata } from './page'

/**
 * `/newsletter` (US-81, US-83): the static HTML carries the whole promise and the form; the token
 * links of the confirmation mail (`?c=`) and of the invitation (`?t=`) show a button and post NOTHING
 * on load: a mail scanner that opens the link subscribes nobody.
 */
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

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

/** Renders the page at a given address and lets the mount effects run. */
async function open(search = '') {
  window.history.replaceState(null, '', `/newsletter${search}`)
  const view = render(<NewsletterPage />)
  await act(async () => {})
  return view
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

describe('/newsletter: the static HTML (SSR content rule)', () => {
  const t = text(renderToString(<NewsletterPage />))

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
    const html = renderToString(<NewsletterPage />)
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
      await screen.findByText("C'est fait, Léa. Premier numéro mardi 3 novembre."),
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
    expect(await screen.findByText("C'est fait. Premier numéro mardi 3 novembre.")).toBeTruthy()
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
