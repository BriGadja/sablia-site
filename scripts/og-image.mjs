// OG / Twitter images (1200x630) from the chosen symbol, the site fonts and the offer title (US-12).
// Same browser recipe as scripts/prerender.mjs (puppeteer-core + @sparticuz/chromium).
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

const template = readFileSync(resolve(ROOT, 'scripts', 'og-image.html'), 'utf8')
for (const slot of ['{{FONTS}}', '{{SYMBOL}}', '{{TITLE}}']) {
  if (template.split(slot).length !== 2)
    throw new Error(`og-image.html must hold ${slot} exactly once`)
}
const html = template
  .replace(
    '{{FONTS}}',
    [
      font(
        'Cormorant Garamond Variable',
        'cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2',
      ),
      font('Inter Variable', 'inter/files/inter-latin-wght-normal.woff2'),
    ].join('\n'),
  )
  .replace('{{SYMBOL}}', readFileSync(resolve(PUBLIC, 'brand', 'symbol.svg'), 'utf8'))
  .replace('{{TITLE}}', title)

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
    console.log(`client/public/${name} ${png.length} bytes`)
  }
} finally {
  await browser.close()
}
