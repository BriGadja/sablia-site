import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { QUESTIONNAIRE, QUESTIONS } from '@/content/webinaire'
import QuestionnairePage, { metadata } from './questionnaire/page'

/**
 * `/webinaire/questionnaire?t=` (US-90). Opening the link only READS (`GET ?t=` → `{prenom}`), the
 * token leaves the address bar at once, the ten questions are in the static HTML, every answer is
 * optional but at least one is needed to send, the POST carries exactly q1..q10, and the answers of
 * `api/webinaire-questionnaire.ts` map to one screen each: 200/204 thanks, 409 already, 404 unknown.
 */
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

const TOKEN = `${'a'.repeat(32)}0123456789abcdef0123456789abcdef`

const text = (html: string) =>
  html
    .replace(/<\/?(?:strong|span|em|a|b)(?:\s[^>]*)?>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')

type Answer = { status: number; body?: unknown }

/** GET answers `get`, POST answers `post`; every call is recorded. */
function stubApi(get: Answer, post: Answer = { status: 200, body: { state: 'saved' } }) {
  const spy = vi.fn(async (_url: string, init?: RequestInit) => {
    const a = (init?.method ?? 'GET') === 'POST' ? post : get
    return new Response(a.body === undefined ? null : JSON.stringify(a.body), {
      status: a.status,
      headers: { 'content-type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', spy)
  return spy
}

const posts = (spy: ReturnType<typeof stubApi>) =>
  spy.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === 'POST')

async function open(search: string) {
  window.history.replaceState(null, '', `/webinaire/questionnaire${search}`)
  const view = render(<QuestionnairePage />)
  await act(async () => {})
  return { view, user: userEvent.setup() }
}

/** A paragraph whose whole text is `message` (a mailto link may split it into several nodes). */
const paragraph = (message: string) =>
  screen.findByText((_, el) => el?.tagName === 'P' && el.textContent === message)

const group = (label: string) => screen.getByRole('group', { name: label })
const progress = (n: number) => QUESTIONNAIRE.progress.replace('{n}', String(n))
const submit = () => screen.getByRole('button', { name: QUESTIONNAIRE.submit })

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState(null, '', '/')
})

describe('/webinaire/questionnaire: the static HTML', () => {
  const html = renderToString(<QuestionnairePage />)
  const t = text(html)

  it('carries the title and the ten questions, one h1', () => {
    expect(QUESTIONS.map((q) => q.key)).toEqual(Array.from({ length: 10 }, (_, i) => `q${i + 1}`))
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(t).toContain(QUESTIONNAIRE.title)
    for (const q of QUESTIONS) expect(t).toContain(q.label)
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('is noindex with its own canonical', () => {
    expect(metadata.alternates?.canonical).toBe('/webinaire/questionnaire')
    expect(metadata.robots).toEqual({ index: false, follow: false })
  })
})

describe('/webinaire/questionnaire: opening the link', () => {
  it('reads the first name with ONE GET, drops the token from the address, posts nothing', async () => {
    const spy = stubApi({ status: 200, body: { prenom: 'Claire' } })
    await open(`?t=${TOKEN}`)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0]?.[0]).toBe(`/api/webinaire-questionnaire?t=${TOKEN}`)
    expect((spy.mock.calls[0]?.[1] as RequestInit | undefined)?.method ?? 'GET').toBe('GET')
    expect(window.location.search).toBe('')
    expect(await screen.findByText('Bonjour Claire,')).toBeTruthy()
    expect(posts(spy)).toHaveLength(0)
  })

  it('no token, or a malformed one: the « lien non reconnu » screen, no request', async () => {
    for (const search of ['', '?t=abc', `?t=${TOKEN.toUpperCase()}`]) {
      const spy = stubApi({ status: 200, body: { prenom: 'Claire' } })
      const { view } = await open(search)
      expect(await paragraph(QUESTIONNAIRE.unknown)).toBeTruthy()
      expect(spy).not.toHaveBeenCalled()
      expect(screen.queryByRole('button', { name: QUESTIONNAIRE.submit })).toBeNull()
      view.unmount()
    }
  })

  it('a token the server does not know (404): the same screen', async () => {
    stubApi({ status: 404, body: { error: 'Lien inconnu', code: 'not_found' } })
    await open(`?t=${TOKEN}`)
    expect(await paragraph(QUESTIONNAIRE.unknown)).toBeTruthy()
    expect(screen.queryByRole('button', { name: QUESTIONNAIRE.submit })).toBeNull()
  })
})

describe('/webinaire/questionnaire: answering', () => {
  it('counts answered questions and needs at least one to send', async () => {
    stubApi({ status: 200, body: { prenom: 'Claire' } })
    const { user } = await open(`?t=${TOKEN}`)
    await screen.findByText('Bonjour Claire,')
    expect(screen.getByText(progress(0))).toBeTruthy()
    expect(submit()).toHaveProperty('disabled', true)

    await user.type(screen.getByLabelText(QUESTIONS[0]?.label ?? ''), 'Comptes rendus')
    expect(screen.getByText(progress(1))).toBeTruthy()
    await user.click(within(group(QUESTIONS[1]?.label ?? '')).getByLabelText('Claude'))
    expect(screen.getByText(progress(2))).toBeTruthy()
    expect(submit()).toHaveProperty('disabled', false)
  })

  it('posts the token and EXACTLY q1..q10 as strings; chips joined, the detail appended', async () => {
    const spy = stubApi({ status: 200, body: { prenom: 'Claire' } })
    const { user } = await open(`?t=${TOKEN}`)
    await screen.findByText('Bonjour Claire,')
    await user.type(screen.getByLabelText(QUESTIONS[0]?.label ?? ''), 'Comptes rendus')
    const tools = group(QUESTIONS[1]?.label ?? '')
    await user.click(within(tools).getByLabelText('ChatGPT'))
    await user.click(within(tools).getByLabelText('Claude'))
    await user.click(within(group(QUESTIONS[2]?.label ?? '')).getByLabelText('6 à 12'))
    const q8 = QUESTIONS[7]
    await user.click(within(group(q8?.label ?? '')).getByLabelText('Trois jours étalés'))
    await user.type(screen.getByLabelText(q8?.detail ?? ''), 'janvier')
    await user.click(submit())

    const call = posts(spy)[0]
    expect(call?.[0]).toBe('/api/webinaire-questionnaire')
    const body = JSON.parse(String((call?.[1] as RequestInit).body)) as {
      token: string
      answers: Record<string, string>
      website: string
      elapsedMs: number
    }
    expect(body.token).toBe(TOKEN)
    expect(body.website).toBe('')
    expect(typeof body.elapsedMs).toBe('number')
    expect(Object.keys(body.answers)).toEqual(Array.from({ length: 10 }, (_, i) => `q${i + 1}`))
    expect(Object.values(body.answers).every((v) => typeof v === 'string')).toBe(true)
    expect(body.answers).toMatchObject({
      q1: 'Comptes rendus',
      q2: 'ChatGPT, Claude',
      q3: '6 à 12',
      q4: '',
      q8: 'Trois jours étalés · janvier',
      q10: '',
    })
    expect(
      await screen.findByText(
        "Merci, Claire. Vos réponses sont enregistrées, on en parle pendant l'appel.",
      ),
    ).toBeTruthy()
  })

  it('a single-choice question keeps one answer; ticking a chip twice removes it', async () => {
    const spy = stubApi({ status: 200, body: { prenom: '' } })
    const { user } = await open(`?t=${TOKEN}`)
    await screen.findByText(progress(0))
    const q6 = group(QUESTIONS[5]?.label ?? '')
    await user.click(within(q6).getByLabelText('Oui, écrites'))
    await user.click(within(q6).getByLabelText('Pas encore'))
    const tools = group(QUESTIONS[1]?.label ?? '')
    await user.click(within(tools).getByLabelText('Gemini'))
    await user.click(within(tools).getByLabelText('Gemini'))
    await user.click(submit())
    const body = JSON.parse(String((posts(spy)[0]?.[1] as RequestInit).body)) as {
      answers: Record<string, string>
    }
    expect(body.answers.q6).toBe('Pas encore')
    expect(body.answers.q2).toBe('')
    expect(
      await screen.findByText(
        "Merci. Vos réponses sont enregistrées, on en parle pendant l'appel.",
      ),
    ).toBeTruthy()
  })

  it('409: « déjà enregistrées », the form is gone', async () => {
    stubApi(
      { status: 200, body: { prenom: 'Claire' } },
      { status: 409, body: { error: 'Déjà envoyé', code: 'already_submitted' } },
    )
    const { user } = await open(`?t=${TOKEN}`)
    await screen.findByText('Bonjour Claire,')
    await user.type(screen.getByLabelText(QUESTIONS[4]?.label ?? ''), 'Les plannings')
    await user.click(submit())
    expect(await paragraph(QUESTIONNAIRE.already)).toBeTruthy()
    expect(screen.queryByRole('button', { name: QUESTIONNAIRE.submit })).toBeNull()
  })

  it('204 (honeypot or too fast) reads as thanks', async () => {
    stubApi({ status: 200, body: { prenom: 'Claire' } }, { status: 204 })
    const { user } = await open(`?t=${TOKEN}`)
    await screen.findByText('Bonjour Claire,')
    await user.type(screen.getByLabelText(QUESTIONS[0]?.label ?? ''), 'x')
    await user.click(submit())
    expect(await screen.findByText(/Merci, Claire\./)).toBeTruthy()
  })

  it('400 and 500 keep the answers and let the visitor send again', async () => {
    for (const [status, message] of [
      [400, QUESTIONNAIRE.invalid],
      [500, QUESTIONNAIRE.error],
    ] as const) {
      stubApi(
        { status: 200, body: { prenom: 'Claire' } },
        { status, body: { error: 'x', code: status === 400 ? 'invalid_payload' : 'internal' } },
      )
      const { user, view } = await open(`?t=${TOKEN}`)
      await screen.findByText('Bonjour Claire,')
      const q1 = screen.getByLabelText(QUESTIONS[0]?.label ?? '') as HTMLTextAreaElement
      await user.type(q1, 'Comptes rendus')
      await user.click(submit())
      expect((await screen.findByRole('alert')).textContent).toBe(message)
      expect(q1.value).toBe('Comptes rendus')
      expect(submit()).toHaveProperty('disabled', false)
      view.unmount()
    }
  })
})
