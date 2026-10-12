#!/usr/bin/env node
// IndexNow submission for sablia.io (docs: https://www.indexnow.org/documentation).
// Selects URLs by sitemap diff (new URL or changed <lastmod>), never a date window.
//   node scripts/seo/indexnow.mjs --sitemap <new> --previous-sitemap <old> [--dry-run]
//   node scripts/seo/indexnow.mjs --all --sitemap <new> [--dry-run]     (first submission)
// <new>/<old> are file paths or http(s) URLs. Exit 0 on 200/202 and on 422/429 (warning), 1 on 400/403.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS = 10000
const config = JSON.parse(readFileSync(new URL('./indexnow.config.json', import.meta.url), 'utf8'))

export function parseSitemap(xml) {
  const map = new Map()
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1]
    if (loc) map.set(loc, block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1] ?? '')
  }
  return map
}

const onHost = (url, host) => {
  try {
    return new URL(url).hostname === host
  } catch {
    return false
  }
}

export function selectAll(xml, host = config.host) {
  return [...parseSitemap(xml).keys()].filter((u) => onHost(u, host)).slice(0, MAX_URLS)
}

export function diffSitemaps(newXml, oldXml, host = config.host) {
  const prev = parseSitemap(oldXml)
  return [...parseSitemap(newXml)]
    .filter(([loc, lastmod]) => onHost(loc, host) && (!prev.has(loc) || prev.get(loc) !== lastmod))
    .map(([loc]) => loc)
    .slice(0, MAX_URLS)
}

export function buildRequest({ host, key, urlList }) {
  return {
    url: ENDPOINT,
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
  }
}

export function interpret(status) {
  if (status === 200 || status === 202) return { level: 'ok', exit: 0 }
  if (status === 422 || status === 429) return { level: 'warning', exit: 0 }
  return { level: 'failure', exit: 1 }
}

const load = async (src) => {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src)
    if (!res.ok) throw new Error(`${src} answered ${res.status}`)
    return res.text()
  }
  return readFileSync(src, 'utf8')
}

async function pollKeyFile({ host, key }, tries = 12, delayMs = 10000) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`https://${host}/${key}.txt`)
      if (res.status === 200 && (await res.text()).trim() === key) return true
    } catch {}
    await new Promise((r) => setTimeout(r, delayMs))
  }
  return false
}

function arg(argv, name) {
  const i = argv.indexOf(name)
  return i >= 0 ? argv[i + 1] : undefined
}

export async function main(argv) {
  const { host, key } = config
  const all = argv.includes('--all')
  const dry = argv.includes('--dry-run')
  const newSrc = arg(argv, '--sitemap')
  const oldSrc = arg(argv, '--previous-sitemap')
  if (!newSrc) throw new Error('--sitemap is required')
  const newXml = await load(newSrc)

  let urls
  if (all) {
    urls = selectAll(newXml)
  } else {
    let oldXml = null
    try {
      if (!oldSrc) throw new Error('no --previous-sitemap')
      oldXml = await load(oldSrc)
    } catch (e) {
      console.log(`previous sitemap unavailable (${e.message}): falling back to --all`)
    }
    urls = oldXml === null ? selectAll(newXml) : diffSitemaps(newXml, oldXml)
  }

  const req = buildRequest({ host, key, urlList: urls })
  console.log(
    `host: ${host}\nkeyLocation: ${JSON.parse(req.body).keyLocation}\nurls: ${urls.length}`,
  )
  for (const u of urls) console.log(u)
  if (dry) return 0
  if (urls.length === 0) {
    console.log('nothing to submit')
    return 0
  }
  if (!(await pollKeyFile(config))) {
    console.log('::error::key file did not answer 200 with the key in time')
    return 1
  }
  const res = await fetch(req.url, { method: req.method, headers: req.headers, body: req.body })
  const out = interpret(res.status)
  const msg = `IndexNow answered ${res.status}`
  if (out.level === 'warning') console.log(`::warning::${msg}`)
  else if (out.level === 'failure') console.log(`::error::${msg}`)
  else console.log(msg)
  return out.exit
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e.message)
      process.exit(1)
    },
  )
}
