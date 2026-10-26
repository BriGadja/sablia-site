// Guards on the static export (dist/public), run in the build chain after finalize-export and
// before the sitemap. Replaces the prerender-time checks of the Vite era: the pages are now real
// build output, so this walks the HTML files and fails the build on anything a crawler or a visitor
// would trip over. Pure `checkExport`/`checkOrganizationJsonLd` (tested on fixtures); the CLI only
// loads the routes, the published resources and the files.
//   node scripts/seo/export-guards.mjs [dir]      (default dist/public)
// Strict mode: `listPublishedSlugs` throws on a Supabase failure (or a missing key when
// PRERENDER_STRICT/VERCEL is set), so a deploy never bakes an « unavailable » page.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { assertCleanStaticHtml } from './prerender-guards.mjs'
import { assertRessourceHtml, extractFromHtml, listPublishedSlugs } from './ressources.mjs'
import { resolveRoutes } from './routes.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const ORIGIN = 'https://sablia.io'
const ORG_ID = `${ORIGIN}/#organization`
const RESSOURCES = '/ressources'

// Pages that are not routes: Next's own 404 (no canonical, no h1 by design) and the standalone
// file served from public/.
const EXEMPT = new Set([
  '404.html',
  '_not-found.html',
  '_not-found/index.html',
  'escalier-modeles.html',
])

const stripBlocks = (html) =>
  html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, base, out)
    else if (name.endsWith('.html')) out.push(relative(base, full).split('\\').join('/'))
  }
  return out
}

/** `index.html` -> `/`, `a/b.html` -> `/a/b`, `a/index.html` -> `/a`. */
function routeOfFile(file) {
  const bare = file.replace(/\.html$/, '').replace(/(^|\/)index$/, '')
  return bare === '' ? '/' : `/${bare}`
}

function metaContent(html, name) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (new RegExp(`name="${name}"`, 'i').test(tag))
      return /content="([^"]*)"/i.exec(tag)?.[1] ?? ''
  }
  return null
}

const hrefs = (html) => [...stripBlocks(html).matchAll(/href="([^"]*)"/gi)].map((m) => m[1])

/**
 * Returns the list of problems (empty = the export is clean).
 * `routes` = resolveRoutes() rows, `rows` = the published resources (slug, titre, resume, youtube_id).
 */
export function checkExport({ dir, routes, rows }) {
  const problems = []
  const files = existsSync(dir) ? walk(dir) : []
  if (files.length === 0) return [`no html found under ${dir}`]

  const byPath = new Map(routes.map((r) => [r.path, r]))
  const slugs = new Set(rows.map((r) => r.slug))
  const pageOf = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`)
  const read = (file) => readFileSync(join(dir, file), 'utf8')

  for (const file of files) {
    const html = read(file)
    try {
      assertCleanStaticHtml(html, routeOfFile(file))
    } catch (err) {
      problems.push(err.message)
    }
    if (EXEMPT.has(file)) continue

    const path = routeOfFile(file)
    const isSlug = path.startsWith(`${RESSOURCES}/`) && slugs.has(path.slice(RESSOURCES.length + 1))
    const route = byPath.get(path)
    if (!route && !isSlug) {
      problems.push(`${path} (${file}): built page that routes.mjs does not list`)
      continue
    }

    const page = stripBlocks(html)
    const h1s = (page.match(/<h1[\s>]/gi) ?? []).length
    if (h1s !== 1) problems.push(`${path}: ${h1s} <h1> (exactly one expected)`)

    const dom = extractFromHtml(page)
    const want = path === '/' ? ORIGIN : `${ORIGIN}${path}`
    if (!dom.canonical) problems.push(`${path}: canonical missing`)
    else if (dom.canonical !== want) {
      problems.push(`${path}: canonical is ${dom.canonical}, expected ${want} (no trailing slash)`)
    }

    const robots = metaContent(page, 'robots') ?? ''
    const noindex = /noindex/i.test(robots)
    const wantNoindex = route ? route.indexable !== true : false
    if (wantNoindex && !noindex)
      problems.push(`${path}: noindex expected (routes.mjs), robots is "${robots}"`)
    if (!wantNoindex && noindex)
      problems.push(`${path}: carries noindex but routes.mjs lists it as indexable`)
  }

  for (const route of routes) {
    if (route.draft) continue
    if (!files.includes(pageOf(route.path))) {
      problems.push(`${route.path}: page ${pageOf(route.path)} is missing from the export`)
    }
  }

  for (const row of rows) {
    const path = `${RESSOURCES}/${row.slug}`
    const file = pageOf(path)
    if (!files.includes(file)) {
      problems.push(`${path}: published resource without its page (${file} missing)`)
      continue
    }
    const html = read(file)
    const dom = extractFromHtml(stripBlocks(html))
    const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(stripBlocks(html))?.[1] ?? ''
    dom.text = main
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    dom.html = html
    if (!/<main\b[^>]*data-ready="true"/i.test(html))
      problems.push(`${path}: <main> lacks data-ready="true"`)
    if (dom.text.includes('Chargement…')) problems.push(`${path}: body still shows « Chargement… »`)
    try {
      assertRessourceHtml(dom, row)
    } catch (err) {
      problems.push(err.message)
    }
  }

  if (files.includes(pageOf(RESSOURCES))) {
    const listed = new Set(hrefs(read(pageOf(RESSOURCES))))
    for (const row of rows) {
      if (!listed.has(`${RESSOURCES}/${row.slug}`))
        problems.push(`${RESSOURCES}: does not list ${row.slug}`)
    }
  }

  if (files.includes('index.html')) {
    const ids = new Map(rows.filter((r) => r.youtube_id).map((r) => [r.youtube_id, r.slug]))
    for (const href of hrefs(read('index.html'))) {
      const internal = /^\/ressources\/([^/?#]+)$/.exec(href)?.[1]
      if (internal && !slugs.has(internal))
        problems.push(`home: tile links to ${href}, not a published resource`)
      const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/.exec(href)?.[1]
      if (yt && ids.has(yt)) {
        problems.push(`home: tile links to YouTube ${yt} but ${RESSOURCES}/${ids.get(yt)} exists`)
      }
    }
  }
  return problems
}

/** The site-wide Organization JSON-LD: exactly one, valid, without the retired claims. */
export function checkOrganizationJsonLd(html) {
  const blocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
  ].map((m) => m[1])
  const problems = []
  const orgs = []
  for (const raw of blocks) {
    try {
      const data = JSON.parse(raw)
      if ([data].flat().some((d) => d?.['@id'] === ORG_ID)) orgs.push(raw)
    } catch (err) {
      problems.push(`invalid JSON in a JSON-LD block: ${err.message}`)
    }
  }
  if (orgs.length !== 1)
    problems.push(`organization JSON-LD: expected exactly one ${ORG_ID}, found ${orgs.length}`)
  for (const raw of orgs) {
    if (/30 jours/i.test(raw)) problems.push('organization JSON-LD still claims « 30 jours »')
    if (/dashboards intelligents/i.test(raw))
      problems.push('organization JSON-LD still sells « dashboards intelligents »')
  }
  return problems
}

async function main(argv) {
  const dir = resolve(argv[0] ?? join(ROOT, 'dist', 'public'))
  const rows = await listPublishedSlugs()
  const problems = checkExport({ dir, routes: resolveRoutes({ root: ROOT }), rows })
  const home = join(dir, 'index.html')
  if (existsSync(home))
    problems.push(...checkOrganizationJsonLd(readFileSync(home, 'utf8')).map((p) => `home: ${p}`))
  for (const p of problems) console.error(`[export-guards] ${p}`)
  console.log(
    `[export-guards] ${problems.length === 0 ? 'ok' : `${problems.length} problem(s)`} (${rows.length} resource page(s) expected) in ${dir}`,
  )
  return problems.length === 0 ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`[export-guards] ${err.message}`)
      process.exit(1)
    },
  )
}
