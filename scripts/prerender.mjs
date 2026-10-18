import { createReadStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { assertCleanStaticHtml } from './seo/prerender-guards.mjs'
import { assertRessourceHtml, listPublishedSlugs, ressourceTitle } from './seo/ressources.mjs'
import { resolveRoutes } from './seo/routes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'dist', 'public')
const PORT = 4173

// Static pages come from the route manifest (scripts/seo/routes.mjs, mirrors App.tsx).
// Pre-rendering noindex pages is fine — Helmet emits the right robots meta. A draft page (status
// read from its JSON) is not prerenderable: no static file may exist for it.
const STATIC_ROUTES = resolveRoutes()
  .filter((r) => !r.draft)
  .map((r) => r.path)

// '/ressources/:slug' is parametric and read client-side from Supabase: its routes are listed at
// build time from the published rows (decision D7, "no redeploy per resource", is superseded by
// Q2a: publishing a resource now means a redeploy). The browser that renders the page reads the row.
const YOUTUBE_HOSTS = ['youtube-nocookie.com', 'youtube.com', 'ytimg.com']
const READY = 'main[data-ready="true"]'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

// Static server with SPA fallback (mirrors vercel.json rewrites).
function startServer() {
  return new Promise((resolveStart) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${PORT}`)
      let pathname = decodeURIComponent(url.pathname)
      if (pathname.endsWith('/')) pathname += 'index.html'
      let filePath = join(DIST, pathname)
      try {
        const s = await stat(filePath)
        if (s.isDirectory()) filePath = join(filePath, 'index.html')
      } catch {
        // SPA fallback
        filePath = join(DIST, 'index.html')
      }
      try {
        await stat(filePath)
      } catch {
        filePath = join(DIST, 'index.html')
      }
      res.setHeader('content-type', MIME[extname(filePath)] || 'application/octet-stream')
      createReadStream(filePath).pipe(res)
    })
    server.listen(PORT, () => resolveStart(server))
  })
}

function isYoutube(url) {
  try {
    const host = new URL(url).hostname
    return YOUTUBE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}

// The page reads its row in the browser: one failed read (no `data-ready`) is retried once by
// reloading before the build is failed. A bad slug never sets `data-ready` and fails here.
async function loadResource(page, url) {
  for (let attempt = 1; ; attempt++) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    try {
      await page.waitForSelector(READY, { timeout: 15000 })
      return
    } catch (err) {
      if (attempt >= 2) throw err
      console.warn(`  ! ${url} not ready after 15s, reloading once`)
    }
  }
}

// Helmet flushes asynchronously, AFTER the commit that sets `data-ready`: wait for the row's own
// title (the canonical is already right while loading, so it proves nothing), then read the DECODED
// DOM values. On 2026-10-18 the deploy of 48cc7aa failed reading the loading title.
async function readDom(page, wantTitle) {
  await page
    .waitForFunction((title) => document.title === title, { timeout: 5000 }, wantTitle)
    .catch(() => {})
  return page.evaluate(() => {
    const attr = (selector, name) => document.querySelector(selector)?.getAttribute(name) ?? null
    const h1 = document.querySelector('main h1')
    return {
      title: document.title,
      canonical:
        attr('link[rel="canonical"][data-rh="true"]', 'href') ??
        attr('link[rel="canonical"]', 'href'),
      description:
        attr('meta[name="description"][data-rh="true"]', 'content') ??
        attr('meta[name="description"]', 'content'),
      h1: h1 ? h1.textContent.trim() : null,
      text: document.querySelector('main')?.textContent.replace(/\s+/g, ' ').trim() ?? '',
      html: document.documentElement.outerHTML,
    }
  })
}

async function prerender() {
  // Listed first: a missing key on Vercel or a failed read must stop the build before Chromium.
  const rows = await listPublishedSlugs()
  console.log(`[prerender] ${rows.length} published resource(s)`)

  console.log(`[prerender] starting static server on :${PORT}`)
  const server = await startServer()

  console.log('[prerender] launching puppeteer (sparticuz chromium)')
  // @sparticuz/chromium ships its own libs (libnspr4, libnss3, libgbm…),
  // bypassing Vercel's minimal build container missing those system deps.
  const browser = await puppeteer.launch({
    headless: chromium.headless,
    args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: await chromium.executablePath(),
  })

  const jobs = [
    ...STATIC_ROUTES.map((route) => ({ route })),
    ...rows.map((row) => ({ route: `/ressources/${row.slug}`, row })),
  ]
  const results = []
  try {
    for (const { route, row } of jobs) {
      const url = `http://localhost:${PORT}${route}`
      const page = await browser.newPage()
      // The consent banner and the analytics loader stay out of the static HTML (plan R9).
      await page.evaluateOnNewDocument(() => {
        window.__SABLIA_PRERENDER__ = true
      })
      // Skip downloading webfonts/images — we only need the rendered HTML
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        const type = req.resourceType()
        if (type === 'image' || type === 'font' || type === 'media') {
          req.abort()
        } else if (row && (req.frame() !== page.mainFrame() || isYoutube(req.url()))) {
          // A ready resource mounts a YouTube iframe (a `document` request): never load it.
          req.abort()
        } else {
          req.continue()
        }
      })

      try {
        if (row) {
          await loadResource(page, url)
          assertRessourceHtml(await readDom(page, ressourceTitle(row)), row)
        } else {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
          // Helmet flushes asynchronously and tags itself with data-rh="true".
          // Wait until at least one Helmet-managed tag exists — proves React mounted + flushed.
          await page.waitForSelector('[data-rh="true"]', { timeout: 10000 })
        }
        const html = await page.content()
        assertCleanStaticHtml(html, route)
        const canonical = await page
          .$eval('link[rel="canonical"]', (el) => el.getAttribute('href'))
          .catch(() => null)
        const title = await page.title()

        const outDir = route === '/' ? DIST : join(DIST, route)
        await mkdir(outDir, { recursive: true })
        await writeFile(join(outDir, 'index.html'), html, 'utf8')

        results.push({ route, ok: true, canonical, title })
        console.log(`  ✓ ${route.padEnd(32)}  canonical=${canonical ?? '(noindex)'}`)
      } catch (err) {
        results.push({ route, ok: false, error: String(err) })
        console.error(`  ✗ ${route} — ${err.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    server.close()
  }

  const failed = results.filter((r) => !r.ok)
  console.log(`\n[prerender] done — ${results.length - failed.length}/${results.length} ok`)
  if (failed.length) {
    console.error('[prerender] FAILURES:')
    for (const f of failed) console.error(` - ${f.route}: ${f.error}`)
    process.exit(1)
  }
}

prerender().catch((err) => {
  console.error('[prerender] fatal:', err)
  process.exit(1)
})
