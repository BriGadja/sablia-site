// Writes dist/public/sitemap.xml at build time (US-55): indexable routes (routes.mjs, contract C2)
// dated from the lastmod ledger, plus every published /ressources/{slug} dated from its row.
// A Supabase read failure fails the build (the shared helper retries 3 times). Chain position:
// after export-guards (dist/public is moved into place by finalize-export first).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { listPublishedSlugs } from './ressources.mjs'
import { resolveRoutes } from './routes.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..')
const ORIGIN = 'https://sablia.io'
const RESSOURCES = '/ressources'

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const day = (iso) => String(iso).slice(0, 10)
const resourceDate = (row) => day(row.updated_at ?? row.published_at)

export function buildSitemap({ routes, ledger, resources }) {
  const urls = []
  const dated = resources.filter((r) => r.published_at || r.updated_at)
  const latest = dated.map(resourceDate).sort().at(-1)

  for (const route of routes) {
    if (route.indexable !== true) continue
    const entry = ledger[route.path]
    if (!entry?.lastmod) {
      throw new Error(`sitemap: no lastmod for ${route.path} (run stamp-lastmod.mjs --write)`)
    }
    const lastmod =
      route.path === RESSOURCES && latest && latest > entry.lastmod ? latest : entry.lastmod
    urls.push({ ...route, lastmod })
  }
  for (const row of dated) {
    urls.push({
      path: `${RESSOURCES}/${row.slug}`,
      lastmod: resourceDate(row),
      changefreq: 'monthly',
      priority: 0.6,
    })
  }

  const body = urls
    .map(
      (u) => `  <url>
    <loc>${esc(ORIGIN + (u.path === '/' ? '/' : u.path))}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${Number(u.priority).toFixed(1)}</priority>
  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

async function main(argv) {
  const i = argv.indexOf('--out')
  const out = i === -1 ? join(ROOT, 'dist', 'public', 'sitemap.xml') : resolve(argv[i + 1])
  const resources = await listPublishedSlugs()
  const ledger = JSON.parse(readFileSync(join(HERE, 'lastmod.json'), 'utf8'))
  const xml = buildSitemap({ routes: resolveRoutes({ root: ROOT }), ledger, resources })
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, xml)
  console.log(`[sitemap] ${(xml.match(/<loc>/g) ?? []).length} urls -> ${out}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(`[sitemap] ${err.message}`)
    process.exit(1)
  })
}
