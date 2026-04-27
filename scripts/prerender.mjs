import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import puppeteer from 'puppeteer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(__dirname, '..', 'dist', 'public')
const PORT = 4173

// Routes mirror App.tsx <Route path="..."> declarations.
// Pre-rendering noindex pages is fine — Helmet emits the right robots meta.
const ROUTES = [
  '/',
  '/tarifs',
  '/gap',
  '/about',
  '/roi',
  '/mentions-legales',
  '/politique-confidentialite',
  '/cgv',
  '/faq',
  '/cas-clients',
  '/thank-you',
  '/lp/automatisation-pme',
  '/lp/audit-gratuit',
]

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

async function prerender() {
  console.log(`[prerender] starting static server on :${PORT}`)
  const server = await startServer()

  console.log('[prerender] launching puppeteer')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const results = []
  try {
    for (const route of ROUTES) {
      const url = `http://localhost:${PORT}${route}`
      const page = await browser.newPage()
      // Skip downloading webfonts/images — we only need the rendered HTML
      await page.setRequestInterception(true)
      page.on('request', (req) => {
        const type = req.resourceType()
        if (type === 'image' || type === 'font' || type === 'media') {
          req.abort()
        } else {
          req.continue()
        }
      })

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
        // Helmet flushes asynchronously and tags itself with data-rh="true".
        // Wait until at least one Helmet-managed tag exists — proves React mounted + flushed.
        await page.waitForSelector('[data-rh="true"]', { timeout: 10000 })
        const html = await page.content()
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
