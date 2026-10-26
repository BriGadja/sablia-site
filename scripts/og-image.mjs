// OG / Twitter images (1200x630) from the chosen symbol, the site fonts and the offer title, and the
// four lockups of decision 7 (US-12). Same browser recipe as the former prerender script (deleted 2026-10-26)
// (puppeteer-core + @sparticuz/chromium).
// Usage: node scripts/og-image.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')

const FONT_DIR = resolve(ROOT, 'src', 'app', 'fonts')
const font = (family, file, weight) => {
  const data = readFileSync(resolve(FONT_DIR, file)).toString('base64')
  return `@font-face { font-family: '${family}'; font-weight: ${weight}; font-style: normal; src: url(data:font/woff2;base64,${data}) format('woff2'); }`
}

// The home preview carries the home H1 (the mockup's line, never of1.title); the default preview
// carries the offer title.
const HOME_LINE = 'Appel terminé, CRM à jour'
const titleMatch = readFileSync(resolve(ROOT, 'src', 'content', 'of1.ts'), 'utf8').match(
  /^ {2}title: (?:"([^"]+)"|'([^']+)'),$/m,
)
const title = titleMatch?.[1] ?? titleMatch?.[2]
if (!title) throw new Error('of1.title not found in src/content/of1.ts')
const SLOTS = [
  { names: ['og-image-home.png', 'twitter-image-home.png'], line: HOME_LINE },
  { names: ['og-image.png', 'twitter-image.png'], line: title },
]

const fonts = [
  font('Familjen Grotesk', 'familjen-grotesk-latin-wght-normal.woff2', '400 700'),
  font('Fragment Mono', 'fragment-mono-latin-400-normal.woff2', '400'),
].join('\n')
const symbol = readFileSync(resolve(PUBLIC, 'brand', 'symbol.svg'), 'utf8')

const template = readFileSync(resolve(ROOT, 'scripts', 'og-image.html'), 'utf8')
for (const slot of ['/*FONTS*/', '<!--SYMBOL-->', '<!--TITLE-->']) {
  if (template.split(slot).length !== 2)
    throw new Error(`og-image.html must hold ${slot} exactly once`)
}
const render = (line) =>
  template
    .replace('/*FONTS*/', fonts)
    .replace('<!--SYMBOL-->', symbol)
    .replace('<!--TITLE-->', line)

/**
 * The lockups (grill 2026-09-28, decision 7): symbol + « Sablia », horizontal and vertical, with an
 * ink word for a light background and a cream word for a dark one. Transparent PNG at 2x, for the
 * uses outside the site (decks, social profiles, signatures). Same proportions as the OG lockup.
 */
const INK = { light: '#131620', dark: '#F4ECDD' }
const lockup = (layout, tone) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
* { margin: 0; padding: 0; } html, body { background: transparent; }
.lockup { display: inline-flex; align-items: center; padding: 24px; color: ${INK[tone]};
  ${layout === 'horizontal' ? 'flex-direction: row; gap: 22px;' : 'flex-direction: column; gap: 16px;'} }
.lockup svg { width: 88px; height: 88px; display: block; }
.wordmark { font-family: 'Familjen Grotesk', sans-serif; font-weight: 600; font-size: 64px;
  letter-spacing: -2px; line-height: 1; }
</style></head><body><div class="lockup">${symbol}<span class="wordmark">Sablia</span></div></body></html>`

const browser = await puppeteer.launch({
  headless: chromium.headless,
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  for (const { names, line } of SLOTS) {
    await page.setContent(render(line), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    })
    for (const name of names) {
      writeFileSync(resolve(PUBLIC, name), png)
      process.stdout.write(`public/${name} ${png.length} bytes\n`)
    }
  }

  await page.setViewport({ width: 800, height: 400, deviceScaleFactor: 2 })
  for (const layout of ['horizontal', 'vertical']) {
    for (const tone of ['light', 'dark']) {
      await page.setContent(lockup(layout, tone), { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      const element = await page.$('.lockup')
      const out = await element.screenshot({ type: 'png', omitBackground: true })
      const name = `brand/lockup-${layout}-${tone}.png`
      writeFileSync(resolve(PUBLIC, name), out)
      process.stdout.write(`public/${name} ${out.length} bytes\n`)
    }
  }
} finally {
  await browser.close()
}
