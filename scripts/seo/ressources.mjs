// Pure helpers for prerendering `/ressources/{slug}` (US-54). Everything that can be tested without
// a browser lives here; `prerender.mjs` launches Chromium at import and must stay free of logic.

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
