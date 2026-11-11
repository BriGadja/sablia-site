// Pure helpers for prerendering `/ressources/{slug}` (US-54) and `/lettre/{slug}` (US-101). Everything
// that can be tested without a browser lives here; `prerender.mjs` launches Chromium at import and must
// stay free of logic.
import { fixtureLettres } from './lettre-fixtures.mjs'

// Same constant as client/src/lib/contenu.ts — a public project ref, not a secret.
const SUPABASE_URL = 'https://qlxoitzdxjqhljjoeqoq.supabase.co'
const SELECT = 'slug,titre,resume,youtube_id,published_at,updated_at'
const TRIES = 3
const BACKOFF_MS = 1000
const FILE_URL_MARK = 'storage/v1/object/public/contenu-ressources'

const realSleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Published resources, newest first. The anon key is public by design (it ships in the bundle) but
 * is read from the environment, never committed. Three tries with a growing backoff, then throws.
 * Without the key: throws on Vercel or when PRERENDER_STRICT is set (the self-hosted deploy sets it:
 * a build must not silently ship without its pages), warns and returns [] anywhere else. An empty list is a valid answer, not an error.
 */
export async function listPublishedSlugs({
  env = process.env,
  fetch: doFetch = globalThis.fetch,
  sleep = realSleep,
  warn = console.warn,
} = {}) {
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!key) {
    if (env.VERCEL || env.PRERENDER_STRICT) {
      throw new Error(
        'VITE_SUPABASE_ANON_KEY is not set on a production build (VERCEL or PRERENDER_STRICT): cannot list the resources to prerender',
      )
    }
    warn('[prerender] VITE_SUPABASE_ANON_KEY is not set: skipping /ressources/{slug} (local build)')
    return []
  }

  const url = `${SUPABASE_URL}/rest/v1/contenu_ressources?select=${SELECT}&published=eq.true&order=published_at.desc`
  let lastError
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    try {
      const res = await doFetch(url, { headers: { apikey: key, authorization: `Bearer ${key}` } })
      if (!res.ok) throw new Error(`contenu_ressources read answered HTTP ${res.status}`)
      const rows = await res.json()
      if (!Array.isArray(rows)) throw new Error('contenu_ressources read did not return a list')
      return rows
        .filter((r) => r && typeof r.slug === 'string' && r.slug.length > 0)
        .sort((a, b) => String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')))
    } catch (err) {
      lastError = err
      if (attempt < TRIES) await sleep(BACKOFF_MS * 2 ** (attempt - 1))
    }
  }
  throw lastError
}

export function ressourceRoutes(rows) {
  return rows.map((row) => `/ressources/${row.slug}`)
}

const NAMED = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  laquo: '«',
  raquo: '»',
}

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body) => {
    if (body[0] === '#') {
      const code =
        body[1].toLowerCase() === 'x' ? Number.parseInt(body.slice(2), 16) : Number(body.slice(1))
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole
    }
    return NAMED[body.toLowerCase()] ?? whole
  })
}

const strip = (html) => html.replace(/<[^>]+>/g, ' ')
const squash = (text) => text.replace(/\s+/g, ' ').trim()

/** Serialized HTML -> the same decoded shape the prerender reads from the live DOM. */
export function extractFromHtml(html) {
  const one = (re) => re.exec(html)?.[1]
  const tag = (re, attr) => {
    const m = re.exec(html)
    if (!m) return null
    const a = new RegExp(`${attr}="([^"]*)"`, 'i').exec(m[0])
    return a ? decode(a[1]) : null
  }
  const main = one(/<main[^>]*>([\s\S]*?)<\/main>/i) ?? html
  const h1 = one(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  return {
    title: decode(squash(strip(one(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? ''))),
    canonical: tag(/<link[^>]*rel="canonical"[^>]*>/i, 'href'),
    description: tag(/<meta[^>]*name="description"[^>]*>/i, 'content'),
    h1: h1 === undefined ? null : decode(squash(strip(h1))),
    text: decode(squash(strip(main))),
    html,
  }
}

/** The <title> a resource page renders once its row is read (`client/src/pages/Ressource.tsx`). */
export function ressourceTitle(row) {
  return `${row.titre} — Sablia`
}

/**
 * Throws when a prerendered resource page is not the page of `row`. Values are DECODED (as read from
 * the DOM): a title « Claude & Pipedrive » compares equal to itself, never to its escaped form.
 */
export function assertRessourceHtml(dom, row) {
  const fail = (what, got, want) => {
    throw new Error(
      `/ressources/${row.slug}: ${what} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`,
    )
  }
  const wantTitle = ressourceTitle(row)
  if (dom.title !== wantTitle) fail('title', dom.title, wantTitle)
  const wantCanonical = `https://sablia.io/ressources/${row.slug}`
  if (dom.canonical !== wantCanonical) fail('canonical', dom.canonical, wantCanonical)
  if (row.resume != null && dom.description !== row.resume)
    fail('description', dom.description, row.resume)
  if (dom.h1 !== row.titre) fail('h1', dom.h1, row.titre)

  const text = dom.text ?? ''
  if (!text.includes(row.titre) || text.includes('Chargement…')) {
    throw new Error(`/ressources/${row.slug}: body text is missing the resource (still loading?)`)
  }
  if (row.resume != null && !text.includes(row.resume)) {
    throw new Error(`/ressources/${row.slug}: body text is missing the résumé`)
  }
  if (row.corps_md) {
    const first = row.corps_md
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .find((b) => b && !/^#{1,6}\s/.test(b))
    if (first && !text.includes(first)) {
      throw new Error(
        `/ressources/${row.slug}: body text is missing the first paragraph of corps_md`,
      )
    }
  }
  if ((dom.html ?? '').includes('<iframe')) {
    throw new Error(
      `/ressources/${row.slug}: html mounts an <iframe> before any click (the video must sit behind VideoFacade)`,
    )
  }
  if ((dom.html ?? '').includes(FILE_URL_MARK)) {
    throw new Error(
      `/ressources/${row.slug}: html leaks a public ${FILE_URL_MARK} file URL (decision D8)`,
    )
  }
}

// ---------------------------------------------------------------------------------------------
// The Tuesday letter (US-101). `contenu_lettres` is written by the hub (`scripts/newsletter.py`,
// the publish step of the send) and only ever read here, with the public anon key.

const LETTRE_SELECT = 'slug,titre,resume,corps_md,youtube_id,published_at,updated_at'
const LETTRE_TIMEOUT_MS = 10_000

const newestFirst = (rows) =>
  [...rows].sort((a, b) => String(b.published_at ?? '').localeCompare(String(a.published_at ?? '')))

/**
 * Published issues, newest first: the ONE reader of `contenu_lettres`, called once by each process of
 * the build chain (posters, the Next build through `src/components/lettre/data.ts`, the export guards,
 * the sitemap). Fixtures (`SABLIA_FIXTURE_LETTRES`) come first and refuse a strict build. Then three
 * tries with a growing backoff. Strict (`PRERENDER_STRICT` or `VERCEL`): a missing key or an unreadable
 * table THROWS, so the deploy keeps the previous release. Elsewhere both warn and answer []. An empty
 * list is a valid answer in both modes.
 */
export async function listPublishedLettres({
  env = process.env,
  fetch: doFetch = globalThis.fetch,
  sleep = realSleep,
  warn = console.warn,
} = {}) {
  const fixtures = fixtureLettres(env)
  if (fixtures.length > 0) return newestFirst(fixtures)

  const strict = Boolean(env.VERCEL || env.PRERENDER_STRICT)
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!key) {
    if (strict) {
      throw new Error(
        'VITE_SUPABASE_ANON_KEY is not set on a production build (VERCEL or PRERENDER_STRICT): cannot list the issues of the letter',
      )
    }
    warn('[lettres] VITE_SUPABASE_ANON_KEY is not set: no /lettre/{slug} page (local build)')
    return []
  }

  const url = `${SUPABASE_URL}/rest/v1/contenu_lettres?select=${LETTRE_SELECT}&published=eq.true&order=published_at.desc`
  let lastError
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    try {
      const res = await doFetch(url, {
        headers: { apikey: key, authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(LETTRE_TIMEOUT_MS),
      })
      if (!res.ok) throw new Error(`contenu_lettres read answered HTTP ${res.status}`)
      const rows = await res.json()
      if (!Array.isArray(rows)) throw new Error('contenu_lettres read did not return a list')
      return newestFirst(rows.filter((r) => r && typeof r.slug === 'string' && r.slug.length > 0))
    } catch (err) {
      lastError = err
      if (attempt < TRIES) await sleep(BACKOFF_MS * 2 ** (attempt - 1))
    }
  }
  if (strict) throw lastError
  warn(
    `[lettres] could not read contenu_lettres (${lastError?.message ?? String(lastError)}): no /lettre/{slug} page (local build)`,
  )
  return []
}

/** The <title> of an issue page. */
export function lettreTitle(row) {
  return `${row.titre} — Sablia`
}

const JSON_LD = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
// The body renderer emits no <div> (Markdown with raw HTML disabled), so the first </div> closes it.
const LETTRE_BODY = /<div\b[^>]*\bdata-body="lettre"[^>]*>([\s\S]*?)<\/div>/i

/**
 * Throws when a built issue page is not the page of `row`. `dom` is the decoded shape of
 * `extractFromHtml` plus `html` (the raw page, scripts included). Titles and texts are compared with
 * `squash()` on BOTH sides, so a no-break space typed in the hub never fails a build.
 */
export function assertLettreHtml(dom, row) {
  const where = `/lettre/${row.slug}`
  const fail = (what, got, want) => {
    throw new Error(`${where}: ${what} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`)
  }
  const same = (a, b) => squash(String(a ?? '')) === squash(String(b ?? ''))

  if (!same(dom.title, lettreTitle(row))) fail('title', dom.title, lettreTitle(row))
  const wantCanonical = `https://sablia.io/lettre/${row.slug}`
  if (dom.canonical !== wantCanonical) fail('canonical', dom.canonical, wantCanonical)
  if (!same(dom.description, row.resume)) fail('description', dom.description, row.resume)
  if (!same(dom.h1, row.titre)) fail('h1', dom.h1, row.titre)
  if (!squash(dom.text ?? '').includes(squash(row.resume ?? ''))) {
    throw new Error(`${where}: visible text is missing the résumé`)
  }

  const html = dom.html ?? ''
  if (!/<main\b[^>]*\bdata-ready="true"/i.test(html)) {
    throw new Error(`${where}: <main> lacks data-ready="true"`)
  }
  const articles = [...html.matchAll(JSON_LD)]
    .flatMap((m) => {
      try {
        return [JSON.parse(m[1])].flat()
      } catch {
        return []
      }
    })
    .filter((d) => d?.['@type'] === 'Article')
  if (articles.length !== 1) {
    throw new Error(`${where}: expected one Article JSON-LD block, found ${articles.length}`)
  }
  const [article] = articles
  if (!article.author?.name) throw new Error(`${where}: the Article has no author.name`)
  if (article.datePublished !== row.published_at) {
    fail('Article datePublished', article.datePublished, row.published_at)
  }
  if (html.includes('<iframe')) {
    throw new Error(
      `${where}: html mounts an <iframe> before any click (the video must sit behind VideoFacade)`,
    )
  }
  if (html.includes('{{{')) throw new Error(`${where}: html still carries a merge tag {{{…}}}`)
  const body = LETTRE_BODY.exec(html)
  if (!body) throw new Error(`${where}: the issue body block (data-body="lettre") is missing`)
  if (/<img\b/i.test(body[1])) {
    throw new Error(
      `${where}: the issue body carries an <img> (an issue is published without images)`,
    )
  }
}
