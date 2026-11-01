import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MerciBooking } from '@/components/webinaire/MerciBooking'
import { NextWebinarBanner } from '@/components/webinaire/NextWebinarBanner'
import WebinaireForm from '@/components/webinaire/WebinaireForm'
import {
  APRES,
  CONSTAT,
  FORM,
  INTERVENANT,
  MERCI,
  NEXT_WEBINAR_BANNER,
  PREUVE,
  PROGRAMME,
  SESSION,
} from '@/content/webinaire'
import ApresPage, { metadata as apresMeta } from './apres-reservation/page'
import MerciPage, { metadata as merciMeta } from './merci/page'
import WebinairePage, { metadata } from './page'

/**
 * `/webinaire` and its two after-pages (US-86, US-88). The static HTML carries every promise and the
 * whole form (SSR content rule); the callback box is UNTICKED; the form posts the exact contract of
 * `api/webinaire.ts` and reads its answers: 200 and 204 = registered, 429 = busy, 400 = the field.
 */
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

/** The text a reader sees: inline tags vanish, block tags separate words. */
const text = (html: string) =>
  html
    .replace(/<\/?(?:strong|span|em|a|b)(?:\s[^>]*)?>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;| /g, ' ')
    .replace(/\s+/g, ' ')

/**
 * Funding, state labels, the client of October, a competitor, scarcity, countdown. Each word carries
 * a one-character class (`[P]`) so the plan's literal grep over src/app/webinaire (Phase B) reads the
 * pages, not this test; the match is the same.
 */
const FORBIDDEN =
  /\bC[P]F\b|fin[a]n[cç]|cert[i]fi|qual[i]opi|mad[e]ca|mist[e]r ?ia|dernières? places|places? limitées|compte à rebours|plus que \d+ places|OP[C]O|prise en charge/i

type Spy = ReturnType<typeof vi.fn>

function stubFetch(status: number, body: unknown = null): Spy {
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

const sent = (spy: Spy, call = 0) =>
  JSON.parse(String((spy.mock.calls[call]?.[1] as RequestInit | undefined)?.body)) as Record<
    string,
    unknown
  >

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(FORM.labels.prenom), 'Claire')
  await user.type(screen.getByLabelText(FORM.labels.nom), 'Morel')
  await user.type(screen.getByLabelText(FORM.labels.email), 'claire.morel@exemple.fr')
  await user.type(screen.getByLabelText(FORM.labels.telephone), '06 12 34 56 78')
  await user.type(screen.getByLabelText(FORM.labels.fonction), 'Directrice')
  const taille = screen.getByRole('radiogroup', { name: FORM.labels.taille })
  await user.click(within(taille).getByLabelText('10 à 49'))
  const usage = screen.getByRole('radiogroup', { name: FORM.labels.usage_ia })
  await user.click(within(usage).getByLabelText("À l'essai"))
}

async function openForm() {
  const onRegistered = vi.fn()
  const view = render(<WebinaireForm onRegistered={onRegistered} />)
  await act(async () => {})
  return { onRegistered, view, user: userEvent.setup() }
}

const submit = () => screen.getByRole('button', { name: FORM.submit })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('/webinaire: the static HTML (SSR content rule)', () => {
  const html = renderToString(<WebinairePage />)
  const t = text(html)

  it('carries the title, the date, the place, the presenter and one h1', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(t).toContain(SESSION.title)
    expect(t).toContain('Jeudi 19 novembre, de 12 h à 13 h')
    expect(t).toContain('En visio, sur Google Meet')
    expect(t).toContain('Gratuit')
    expect(t).toContain('Animé par Brice Gachadoat')
    expect(t).toContain(INTERVENANT.line)
  })

  it('opens on the branch figures WITH their source and a link to it', () => {
    expect(t).toContain('86 %')
    expect(t).toContain('57 %')
    for (const stat of CONSTAT.stats) expect(t).toContain(stat.label)
    expect(t).toContain(CONSTAT.source)
    expect(html).toContain(`href="${CONSTAT.sourceHref}"`)
  })

  it('shows the four demonstrations, the fictional-documents note and the anonymised proof with its base', () => {
    for (const demo of PROGRAMME.demos) {
      expect(t).toContain(demo.title)
      expect(t).toContain(demo.line)
    }
    for (const segment of PROGRAMME.segments) expect(t).toContain(segment.label)
    expect(t).toContain(PROGRAMME.note)
    expect(t).toContain(PREUVE.line)
    expect(PREUVE.line).toContain('7 réponses sur 23 participants')
  })

  it('carries the whole form, the UNTICKED callback box and its information line', () => {
    expect(html).toContain('data-form="webinaire"')
    for (const label of Object.values(FORM.labels)) expect(t).toContain(label)
    expect(t).toContain(FORM.rappel.label)
    expect(t).toContain(FORM.rappel.info)
    expect(t).toContain(FORM.privacy)
    expect(html).toContain('href="/politique-confidentialite"')
    const box = html.match(/<input[^>]*name="rappel_consent"[^>]*>/)?.[0] ?? ''
    expect(box).toContain('type="checkbox"')
    expect(box).not.toMatch(/\schecked/)
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('says no forbidden word: funding, state label, the client of October, scarcity, countdown', () => {
    expect(t).not.toMatch(FORBIDDEN)
  })

  it('is indexable, with its own canonical', () => {
    expect(metadata.alternates?.canonical).toBe('/webinaire')
    expect(metadata.robots).toEqual({ index: true, follow: true })
  })
})

describe('/webinaire: the form posts the contract of api/webinaire.ts', () => {
  it('sends exactly the contract fields, the box unticked by default', async () => {
    const spy = stubFetch(200, { state: 'registered' })
    const { user, onRegistered } = await openForm()
    expect((screen.getByLabelText(FORM.rappel.label) as HTMLInputElement).checked).toBe(false)
    await fillValid(user)
    await user.click(submit())

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy.mock.calls[0]?.[0]).toBe('/api/webinaire')
    const init = spy.mock.calls[0]?.[1] as RequestInit
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'content-type': 'application/json' })
    const body = sent(spy)
    expect(Object.keys(body).sort()).toEqual(
      [
        'elapsedMs',
        'email',
        'fonction',
        'nom',
        'pourquoi',
        'prenom',
        'rappel_consent',
        'taille',
        'telephone',
        'usage_ia',
        'website',
      ].sort(),
    )
    expect(body).toMatchObject({
      prenom: 'Claire',
      nom: 'Morel',
      email: 'claire.morel@exemple.fr',
      telephone: '06 12 34 56 78',
      fonction: 'Directrice',
      taille: '10-49',
      usage_ia: 'essai',
      pourquoi: '',
      rappel_consent: false,
      website: '',
    })
    expect(typeof body.elapsedMs).toBe('number')
    expect(onRegistered).toHaveBeenCalledTimes(1)
  })

  it('sends rappel_consent true only when the box is ticked, and the optional question', async () => {
    const spy = stubFetch(200, { state: 'registered' })
    const { user } = await openForm()
    await fillValid(user)
    await user.type(screen.getByLabelText(FORM.labels.pourquoi), 'Poser des règles')
    await user.click(screen.getByLabelText(FORM.rappel.label))
    await user.click(submit())
    expect(sent(spy)).toMatchObject({ rappel_consent: true, pourquoi: 'Poser des règles' })
  })

  it('treats 204 (honeypot or too fast) as registered, like 200', async () => {
    stubFetch(204)
    const { user, onRegistered } = await openForm()
    await fillValid(user)
    await user.click(submit())
    expect(onRegistered).toHaveBeenCalledTimes(1)
  })

  it('locks the button while sending: one click, one request', async () => {
    let release: (r: Response) => void = () => {}
    const spy = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          release = resolve
        }),
    )
    vi.stubGlobal('fetch', spy)
    const { user, onRegistered } = await openForm()
    await fillValid(user)
    await user.click(submit())
    const busy = screen.getByRole('button', { name: FORM.sending })
    expect(busy).toHaveProperty('disabled', true)
    await user.click(busy)
    expect(spy).toHaveBeenCalledTimes(1)
    await act(async () => release(new Response(null, { status: 204 })))
    expect(onRegistered).toHaveBeenCalledTimes(1)
  })

  it('429: says « réessayez demain », stays on the page, button usable again', async () => {
    stubFetch(429, { error: "Trop d'inscriptions aujourd'hui", code: 'busy' })
    const { user, onRegistered } = await openForm()
    await fillValid(user)
    await user.click(submit())
    expect((await screen.findByRole('alert')).textContent).toBe(FORM.busy)
    expect(onRegistered).not.toHaveBeenCalled()
    expect(submit()).toHaveProperty('disabled', false)
  })

  it('400 on the phone: the message sits under the phone field, which is marked invalid', async () => {
    stubFetch(400, {
      error: 'Numéro de téléphone invalide (exemple : 06 12 34 56 78)',
      code: 'invalid_payload',
    })
    const { user, onRegistered } = await openForm()
    await fillValid(user)
    await user.click(submit())
    const phone = screen.getByLabelText(FORM.labels.telephone)
    const message = await screen.findByText(FORM.phoneError)
    expect(phone.getAttribute('aria-invalid')).toBe('true')
    expect(phone.getAttribute('aria-describedby')).toContain(message.id)
    expect(onRegistered).not.toHaveBeenCalled()
  })

  it('400 on another field: names the field with its visible label', async () => {
    stubFetch(400, {
      error: 'Formulaire incomplet ou invalide (champ : taille)',
      code: 'invalid_payload',
    })
    const { user } = await openForm()
    await fillValid(user)
    await user.click(submit())
    expect((await screen.findByRole('alert')).textContent).toBe(
      FORM.fieldError.replace('{champ}', FORM.labels.taille),
    )
    expect(
      screen.getByRole('radiogroup', { name: FORM.labels.taille }).getAttribute('aria-invalid'),
    ).toBe('true')
  })

  it('a failure (500 or network) points to Brice and keeps the answers', async () => {
    stubFetch(500, { error: 'Service indisponible', code: 'internal' })
    const { user, onRegistered, view } = await openForm()
    await fillValid(user)
    await user.click(submit())
    expect((await screen.findByRole('alert')).textContent).toBe(FORM.error)
    expect((screen.getByLabelText(FORM.labels.prenom) as HTMLInputElement).value).toBe('Claire')
    view.unmount()

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('offline')
      }),
    )
    const second = await openForm()
    await fillValid(second.user)
    await second.user.click(submit())
    expect((await screen.findByRole('alert')).textContent).toContain('brice@sablia.io')
    expect(onRegistered).not.toHaveBeenCalled()
    expect(second.onRegistered).not.toHaveBeenCalled()
  })
})

describe('/webinaire/merci', () => {
  const html = renderToString(<MerciPage />)
  const t = text(html)

  it('says what happens next: invitation, two reminders, spam, how to leave', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(t).toContain(MERCI.title)
    for (const step of MERCI.steps) {
      expect(t).toContain(step.when)
      expect(t).toContain(step.what)
    }
    expect(t).toContain(MERCI.spam)
    expect(t).toContain(MERCI.leave)
    expect(t).not.toMatch(FORBIDDEN)
  })

  it('is noindex with its own canonical', () => {
    expect(merciMeta.alternates?.canonical).toBe('/webinaire/merci')
    expect(merciMeta.robots).toEqual({ index: false, follow: false })
  })

  it('shows no booking button while the dedicated booking URL is not set', () => {
    expect(t).not.toContain(MERCI.booking.cta)
    expect(renderToString(<MerciBooking url={null} />)).toBe('')
  })

  it('once set, the booking button opens THAT url, never the CRM one', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const url = 'https://calendly.com/exemple/echange-30-minutes'
    render(<MerciBooking url={url} />)
    await userEvent.setup().click(screen.getByRole('button', { name: MERCI.booking.cta }))
    expect(open).toHaveBeenCalledTimes(1)
    expect(open.mock.calls[0]?.[0]).toBe(url)
  })
})

describe('/webinaire/apres-reservation (après réservation)', () => {
  const html = renderToString(<ApresPage />)
  const t = text(html)

  it('après réservation: the five steps in order, the questionnaire announced, no word on funding', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1)
    expect(t).toContain(APRES.title)
    expect(t).toContain(APRES.lede)
    const positions = APRES.steps.map((step) => t.indexOf(step.title))
    expect(positions.every((p) => p >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    expect(APRES.steps.map((s) => s.key)).toEqual([
      'appel',
      'resume',
      'devis',
      'convention',
      'paiement',
    ])
    for (const step of APRES.steps) expect(t).toContain(step.line)
    expect(t).not.toMatch(FORBIDDEN)
  })

  it('après réservation: noindex with its own canonical', () => {
    expect(apresMeta.alternates?.canonical).toBe('/webinaire/apres-reservation')
    expect(apresMeta.robots).toEqual({ index: false, follow: false })
  })
})

describe('« prochain webinaire » banner, shipped OFF', () => {
  it('renders nothing while the flag is off', () => {
    expect(NEXT_WEBINAR_BANNER.enabled).toBe(false)
    expect(renderToString(<NextWebinarBanner />)).toBe('')
  })

  it('once on, it links to /webinaire with its text', () => {
    const html = renderToString(
      <NextWebinarBanner banner={{ ...NEXT_WEBINAR_BANNER, enabled: true }} />,
    )
    expect(text(html)).toContain(NEXT_WEBINAR_BANNER.text)
    expect(html).toContain('href="/webinaire"')
  })
})
