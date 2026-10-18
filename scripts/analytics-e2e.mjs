// End-to-end proof of the measurement (plan sablia-io-lot0-vps, AC-6 and AC-17): drives a real
// Chrome through the site, then reads what the self-hosted Umami received for the PREVIEW website.
//
//   node scripts/analytics-e2e.mjs --base https://preview.sablia.io [--netrc FILE] [--replay]
//   node scripts/analytics-e2e.mjs --base http://preview.sablia.io:18080 --map preview.sablia.io=127.0.0.1
//
// --netrc   machine/login/password file for the preview's basic auth (never on the command line)
// --map     host=ip, Chrome's host-resolver rule (a private Caddy on loopback, before DNS exists)
// --replay  also prove tier 2: a stored replay longer than 5 s, a heatmap click, no canary in it
//
// The Umami API key is read at runtime from the file named by UMAMI_CREDENTIALS (never argv). The form endpoints are
// answered by the script itself (no mail, no CRM row): the proof is about the events, not the API.
// Exit 0 = every check passes.
import { readFileSync } from 'node:fs'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

const argv = process.argv.slice(2)
const opt = (name) => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const base = (opt('base') ?? '').replace(/\/$/, '')
const mapArg = opt('map')
const netrcPath = opt('netrc')
const replayMode = argv.includes('--replay')
if (!base) {
  console.error('usage: analytics-e2e.mjs --base URL [--map host=ip] [--netrc FILE] [--replay]')
  process.exit(2)
}
const origin = new URL(base).origin

const credPath = process.env.UMAMI_CREDENTIALS
if (!credPath) {
  console.error(
    'set UMAMI_CREDENTIALS to the JSON file holding the Umami api_key, local_url and website ids',
  )
  process.exit(2)
}
const cred = JSON.parse(readFileSync(credPath, 'utf8'))
const UMAMI = cred.local_url
const WEBSITE = cred.websites.preview
const KEY = cred.api_key

let basic = null
if (netrcPath) {
  const words = readFileSync(netrcPath, 'utf8').split(/\s+/)
  const at = (k) => words[words.indexOf(k) + 1]
  basic = { username: at('login'), password: at('password') }
}

const results = []
const check = (name, ok, detail = '') => {
  results.push(ok)
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok || !detail ? '' : ` — ${detail}`}`)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function umami(path, params = {}) {
  const url = new URL(UMAMI + path)
  url.searchParams.set('startAt', String(startedAt))
  url.searchParams.set('endAt', String(Date.now() + 60_000))
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  const res = await fetch(url, { headers: { authorization: `Bearer ${KEY}` } })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.json()
}

const startedAt = Date.now() - 1000
const run = Math.random().toString(36).slice(2, 8)
const CANARY = `CANARY-${run}`
// A normal desktop user agent: Umami silently drops HeadlessChrome (plan R6). The build number is
// random so this run is its own visitor.
const UA = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.${1000 + Math.floor(Math.random() * 8000)}.0 Safari/537.36`

const browser = await puppeteer.launch({
  headless: chromium.headless,
  args: [
    ...chromium.args,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    ...(mapArg
      ? [`--host-resolver-rules=MAP ${mapArg.split('=')[0]} ${mapArg.split('=')[1]}`]
      : []),
  ],
  executablePath: await chromium.executablePath(),
  defaultViewport: { width: 390, height: 844 },
})

const requests = []
let consentAt = Infinity
let videoPlayed = false
try {
  const page = await browser.newPage()
  await page.setUserAgent(UA)
  if (basic) await page.authenticate(basic)
  await page.evaluateOnNewDocument(() => {
    window.__opened = []
    window.open = (...a) => {
      window.__opened.push(a[0])
      return null
    }
    // keep the page where it is when an outbound link is clicked (our listener already ran)
    document.addEventListener('click', (e) => {
      const a = e.target?.closest?.('a[href]')
      if (a && a.origin !== location.origin) e.preventDefault()
    })
  })
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const url = new URL(req.url())
    const sameOrigin = url.origin === origin
    requests.push({ url: req.url(), t: Date.now(), sameOrigin, method: req.method() })
    if (
      sameOrigin &&
      req.method() === 'POST' &&
      /^\/api\/(contact|ressources-request)$/.test(url.pathname)
    ) {
      req.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, lead: true, files: [] }),
      })
    } else if (!sameOrigin && !url.hostname.endsWith('.supabase.co')) {
      req.abort()
    } else {
      req.continue()
    }
  })

  const clickText = (selector, re) =>
    page.evaluate(
      (selector, source) => {
        const rx = new RegExp(source)
        const el = [...document.querySelectorAll(selector)].find((e) =>
          rx.test(e.textContent ?? ''),
        )
        el?.click()
        return Boolean(el)
      },
      selector,
      re.source,
    )

  // ── 1. tier 1, no consent ──────────────────────────────────────────────────
  await page.goto(`${base}/`, { waitUntil: 'networkidle0', timeout: 45_000 })
  await page.waitForSelector('[data-consent-banner]', { timeout: 10_000 })
  const banner = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[data-consent-banner] button')]
    return {
      labels: buttons.map((b) => b.textContent?.trim()),
      sameClass: new Set(buttons.map((b) => b.className)).size === 1,
      sameSize: new Set(buttons.map((b) => `${b.offsetWidth}x${b.offsetHeight}`)).size === 1,
    }
  })
  check(
    'banner offers « Tout refuser » then « Tout accepter »',
    banner.labels.join('|') === 'Tout refuser|Tout accepter',
    banner.labels.join('|'),
  )
  check(
    'both buttons have the same classes and the same rendered size',
    banner.sameClass && banner.sameSize,
  )

  check(
    'the tracker is requested from our own origin',
    requests.some((r) => r.url === `${origin}/m/a.js`),
  )
  check(
    'the recorder is NOT requested before a choice',
    !requests.some((r) => r.url.includes('/m/r.js')),
  )

  await clickText('nav button', /Réserver 30 min/)
  await sleep(500)
  await page.evaluate(() => document.querySelector('a[href^="https://app.sablia.io"]')?.click())
  await sleep(300)
  for (const ratio of [0.3, 0.55, 0.8, 1]) {
    await page.evaluate(
      (r) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * r),
      ratio,
    )
    await sleep(500)
  }
  // typing in the contact form before any consent: nothing form_* may leave the page
  await page.evaluate(() => document.querySelector('form[data-form="contact"]')?.scrollIntoView())
  await sleep(500)
  await page.type('form[data-form="contact"] input[name="name"]', `PRECONSENT-${run}`)
  await page.evaluate(() => document.activeElement?.blur())
  await sleep(500)

  const pre = await page.evaluate(() => ({
    cookie: document.cookie,
    keys: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  }))
  check('document.cookie is empty before consent', pre.cookie === '', pre.cookie)
  check(
    'localStorage holds nothing before the visitor chooses',
    pre.keys.length === 0,
    pre.keys.join(','),
  )
  const offBefore = requests.filter((r) => !r.sameOrigin)
  check(
    'no request leaves our origin before consent (home)',
    offBefore.length === 0,
    offBefore.map((r) => new URL(r.url).host).join(','),
  )

  // ── 2. accept → tier 2 ─────────────────────────────────────────────────────
  consentAt = Date.now()
  await clickText('[data-consent-banner] button', /^Tout accepter$/)
  await sleep(1500)
  const recorderRequests = requests.filter((r) => r.url === `${origin}/m/r.js`)
  check(
    '« Tout accepter » requests the recorder exactly once',
    recorderRequests.length === 1,
    String(recorderRequests.length),
  )
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('sablia_consent') ?? 'null'),
  )
  check('the choice is stored as {v:1, replay:true}', stored?.v === 1 && stored?.replay === true)

  // forms with consent: the canary goes into the fields; the endpoint is answered locally
  await page.evaluate(() => document.querySelector('form[data-form="contact"]')?.scrollIntoView())
  await sleep(800)
  await page.click('form[data-form="contact"] input[name="name"]', { clickCount: 3 })
  await page.type('form[data-form="contact"] input[name="name"]', CANARY)
  await page.type('form[data-form="contact"] input[name="company"]', `Société ${CANARY}`)
  await page.type('form[data-form="contact"] input[name="email"]', `${run}@canary.example`)
  await page.select('form[data-form="contact"] select[name="teamSize"]', '2_à_5_personnes')
  await page.type('form[data-form="contact"] textarea[name="message"]', `Message ${CANARY}`)
  await page.evaluate(() => document.activeElement?.blur())
  await sleep(400)
  await page.click('form[data-form="contact"] button[type="submit"]')
  await sleep(1500)

  // a click that the heatmap can see
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(500)
  await page.mouse.click(150, 400)
  await sleep(500)

  // ── 3. a resource: facade, video_play, ressource form ──────────────────────
  await page.goto(`${base}/ressources`, { waitUntil: 'networkidle0', timeout: 45_000 })
  const slugPath = await page.evaluate(
    () => document.querySelector('a[href^="/ressources/"]')?.getAttribute('href') ?? null,
  )
  check('the library lists at least one resource', Boolean(slugPath))
  if (slugPath) {
    await page.goto(`${base}${slugPath}`, { waitUntil: 'networkidle0', timeout: 45_000 })
    await page.waitForSelector('main[data-ready="true"]', { timeout: 15_000 })
    const frames0 = await page.evaluate(() => document.querySelectorAll('iframe').length)
    check('the resource page mounts no iframe before the click', frames0 === 0, String(frames0))
    const played = await page.evaluate(() => {
      const b = document.querySelector('button[aria-label^="Lire la vidéo"]')
      b?.click()
      return Boolean(b)
    })
    videoPlayed = played
    if (played) {
      await sleep(800)
      const frames1 = await page.evaluate(() => document.querySelectorAll('iframe').length)
      check('the click mounts the player', frames1 === 1, String(frames1))
    } else {
      console.log('NOTE this resource has no video: video_play not exercised')
    }
    const form = 'form[data-form="ressource"]'
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), form)
    await sleep(800)
    await page.type(`${form} input[name="prenom"]`, CANARY)
    await page.type(`${form} input[name="email"]`, `${run}@canary.example`)
    await page.evaluate(() => document.activeElement?.blur())
    await sleep(300)
    await page.click(`${form} button[type="submit"]`)
    await sleep(1500)
  }

  const during = await page.evaluate(() => ({
    cookie: document.cookie,
    keys: Object.keys(localStorage),
  }))
  check('document.cookie is still empty after consent', during.cookie === '', during.cookie)
  check(
    'localStorage holds only sablia_consent',
    during.keys.join(',') === 'sablia_consent',
    during.keys.join(','),
  )

  if (replayMode) {
    // The recorder only stores what happens: keep the page busy for 7 s so the replay outlasts 5 s.
    for (let i = 0; i < 14; i++) {
      await page.mouse.move(60 + i * 20, 200 + (i % 3) * 40)
      await page.evaluate((n) => window.scrollBy(0, n % 2 ? 90 : -90), i)
      await sleep(500)
    }
  }
  await page.goto('about:blank')
  await sleep(4000)
  await page.close()

  // ── 4. what Umami received ─────────────────────────────────────────────────
  const events = (await umami(`/api/websites/${WEBSITE}/events`, { pageSize: 200 })).data.filter(
    (e) => e.eventName,
  )
  const mine = events.filter((e) => new Date(e.createdAt).getTime() >= startedAt)
  const named = (n) => mine.filter((e) => e.eventName === n)
  const dataOf = async (e) => {
    const rows = await umami(`/api/websites/${WEBSITE}/event-data/${e.id}`)
    return Object.fromEntries(rows.map((r) => [r.dataKey, r.stringValue ?? r.numberValue]))
  }
  const tier1 = [
    'click',
    'cta_book',
    'outbound',
    'scroll_25',
    'scroll_50',
    'scroll_75',
    'scroll_100',
  ]
  for (const n of tier1)
    check(
      `Umami received ${n} without consent`,
      named(n).some((e) => new Date(e.createdAt).getTime() < consentAt),
      `${named(n).length} event(s)`,
    )
  const book = named('cta_book')[0]
  const bookData = book ? await dataOf(book) : {}
  check(
    'cta_book carries zone « nav » and the label',
    bookData.zone === 'nav' && /Réserver 30 min/.test(String(bookData.label)),
    JSON.stringify(bookData),
  )
  const out = named('outbound')[0]
  const outData = out ? await dataOf(out) : {}
  check(
    'outbound carries the host only',
    outData.host === 'app.sablia.io' && !('url' in outData),
    JSON.stringify(outData),
  )
  const sc = (
    await Promise.all(named('scroll_50').map(async (e) => ({ e, d: await dataOf(e) })))
  ).find((x) => x.d.page === '/')?.e
  const scData = sc ? await dataOf(sc) : {}
  check('scroll_50 carries the page path', scData.page === '/', JSON.stringify(scData))

  const gated = mine.filter((e) => /^(video_|form_)/.test(e.eventName))
  check(
    'no video_* or form_* event predates the consent',
    gated.every((e) => new Date(e.createdAt).getTime() >= consentAt),
    gated.map((e) => e.eventName).join(','),
  )
  for (const n of ['form_start', 'form_field', 'form_submit', 'form_success'])
    check(`Umami received ${n} after consent`, named(n).length > 0)
  if (videoPlayed) check('Umami received video_play after consent', named('video_play').length > 0)
  const fieldRows = await Promise.all(named('form_field').map(dataOf))
  check(
    'form_field carries field names only',
    fieldRows.length > 0 &&
      fieldRows.every((d) => typeof d.field === 'string' && !JSON.stringify(d).includes('canary')),
    JSON.stringify(fieldRows),
  )
  const allData = JSON.stringify(await Promise.all(mine.map(dataOf)))
  check(
    'no event carries the canary or an e-mail address',
    !allData.includes('CANARY') && !allData.includes('@'),
    'canary leaked into event data',
  )

  const offAfter = requests.filter((r) => !r.sameOrigin && r.t >= consentAt)
  const stray = offAfter.filter((r) => {
    const h = new URL(r.url).hostname
    return !(
      h.endsWith('.supabase.co') ||
      h === 'i.ytimg.com' ||
      h.endsWith('youtube-nocookie.com') ||
      h === 'www.youtube.com'
    )
  })
  check(
    'after consent the only off-origin requests are Supabase, YouTube poster/player',
    stray.length === 0,
    stray.map((r) => r.url).join(' '),
  )

  // ── 5. tier 2 proof ────────────────────────────────────────────────────────
  if (replayMode) {
    const list = await umami(`/api/websites/${WEBSITE}/replays`, { pageSize: 50 })
    const replays = list.data ?? []
    console.log(
      `NOTE ${replays.length} replay row(s); first: ${JSON.stringify(replays[0] ?? null).slice(0, 300)}`,
    )
    const longest =
      replays
        .map((r) => r.duration ?? Date.parse(r.endedAt) - Date.parse(r.startedAt) ?? 0)
        .sort((a, b) => b - a)[0] ?? 0
    check('a stored replay is longer than 5 s', longest > 5000, `longest ${longest} ms`)
    let leaked = null
    for (const r of replays) {
      const chunks = JSON.stringify(
        await umami(`/api/websites/${WEBSITE}/replays/${r.id}`).catch(() => ({})),
      )
      if (chunks.includes(CANARY)) leaked = r.id
    }
    check(
      'the canary typed in both forms is absent from every stored replay',
      leaked === null,
      `found in ${leaked}`,
    )
    const heat = await umami(`/api/websites/${WEBSITE}/heatmaps`, { urlPath: '/', mode: 'click' })
    check(
      'a heatmap click point exists for /',
      (heat.points ?? []).length > 0,
      JSON.stringify(heat).slice(0, 200),
    )
  }
} finally {
  await browser.close()
}

const failed = results.filter((ok) => !ok).length
console.log(`${results.length - failed}/${results.length} checks pass`)
process.exit(failed ? 1 : 0)
