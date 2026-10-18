import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Express } from 'express'

/** A dist/public with the SHAPE of the real build: hashed bundle, directory pages, a dotfile dir. */
export const PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0x10, 0x80,
])

export function makeDist(): string {
  const root = mkdtempSync(join(tmpdir(), 'sablia-dist-'))
  const files: Record<string, string | Buffer> = {
    'index.html':
      '<!doctype html><title>Home</title><script type="module" src="/assets/main-abc12345.js"></script>',
    'escalier-modeles.html': '<!doctype html><title>Escalier</title>',
    'cgv/index.html': '<!doctype html><title>CGV</title>',
    'ressources/index.html': '<!doctype html><title>Ressources</title>',
    'ressources/pipedrive-nouveau-lead/index.html': '<!doctype html><title>Pipedrive</title>',
    'assets/main-abc12345.js': 'console.log("main")',
    'assets/index-ff00aa11.css': 'body{margin:0}',
    '.well-known/ai.txt': 'ai policy',
    '.env': 'SECRET_SHOULD_NEVER_BE_SERVED',
    'sitemap.xml': '<?xml version="1.0"?><urlset></urlset>',
    'robots.txt': 'User-agent: *\nAllow: /',
    'b726ffc356cf2894abdd81a5a309a181.txt': 'b726ffc356cf2894abdd81a5a309a181',
    'favicon.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
    'photos/a.webp': PNG,
  }
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, content)
  }
  return root
}

export async function listen(app: Express): Promise<{ url: string; close: () => Promise<void> }> {
  const server = await new Promise<import('node:http').Server>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s))
  })
  const { port } = server.address() as AddressInfo
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  }
}
