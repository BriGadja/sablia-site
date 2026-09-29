// OG / Twitter images (1200x630) from the chosen symbol, the site fonts and the offer title, and the
// four lockups of decision 7 (US-12). Same browser recipe as scripts/prerender.mjs
// (puppeteer-core + @sparticuz/chromium).
// Usage: node scripts/og-image.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'client', 'public')
const OUTPUTS = ['og-image-home.png', 'og-image.png', 'twitter-image-home.png', 'twitter-image.png']

const font = (family, file) => {
  const data = readFileSync(resolve(ROOT, 'node_modules', '@fontsource-variable', file)).toString(
    'base64',
  )
  return `@font-face { font-family: '${family}'; font-weight: 100 900; font-style: normal; src: url(data:font/woff2;base64,${data}) format('woff2'); }`
}

const title = readFileSync(resolve(ROOT, 'client', 'src', 'content', 'of1.ts'), 'utf8').match(
  /^ {2}title: '([^']+)',$/m,
)?.[1]
if (!title) throw new Error('of1.title not found in client/src/content/of1.ts')

const fonts = [
  font(
    'Cormorant Garamond Variable',
    'cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2',
  ),
  font('Inter Variable', 'inter/files/inter-latin-wght-normal.woff2'),
].join('\n')
const symbol = readFileSync(resolve(PUBLIC, 'brand', 'symbol.svg'), 'utf8')

const template = readFileSync(resolve(ROOT, 'scripts', 'og-image.html'), 'utf8')
for (const slot of ['/*FONTS*/', '<!--SYMBOL-->', '<!--TITLE-->']) {
  if (template.split(slot).length !== 2)
    throw new Error(`og-image.html must hold ${slot} exactly once`)
}
const html = template
  .replace('/*FONTS*/', fonts)
  .replace('<!--SYMBOL-->', symbol)
  .replace('<!--TITLE-->', title)

/**
 * The lockups (grill 2026-09-28, decision 7): symbol + « Sablia », horizontal and vertical, with an
 * ink word for a light background and a cream word for a dark one. Transparent PNG at 2x, for the
 * uses outside the site (decks, social profiles, signatures). Same proportions as the OG lockup.
 */
const INK = { light: '#141413', dark: '#f5f2ec' }
const lockup = (layout, tone) => `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
* { margin: 0; padding: 0; } html, body { background: transparent; }
.lockup { display: inline-flex; align-items: center; padding: 24px; color: ${INK[tone]};
  ${layout === 'horizontal' ? 'flex-direction: row; gap: 22px;' : 'flex-direction: column; gap: 16px;'} }
.lockup svg { width: 88px; height: 88px; display: block; }
.wordmark { font-family: 'Cormorant Garamond Variable', serif; font-weight: 500; font-size: 64px;
  letter-spacing: -1px; line-height: 1; }
</style></head><body><div class="lockup">${symbol}<span class="wordmark">Sablia</span></div></body></html>`

const browser = await puppeteer.launch({
  headless: chromium.headless,
  args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: await chromium.executablePath(),
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  for (const name of OUTPUTS) {
    writeFileSync(resolve(PUBLIC, name), png)
    process.stdout.write(`client/public/${name} ${png.length} bytes\n`)
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
      process.stdout.write(`client/public/${name} ${out.length} bytes\n`)
    }
  }
} finally {
  await browser.close()
}
