// Bundles server/index.ts into ONE self-contained dist/index.js (plan R4): nothing in node_modules
// is needed at runtime, and the dev-only Vite branch is removed by the NODE_ENV define.
// Usage: node scripts/build-server.mjs [--outdir=dist]
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const arg = process.argv.find((a) => a.startsWith('--outdir='))
const outdir = arg ? resolve(arg.slice('--outdir='.length)) : resolve(root, 'dist')

await build({
  entryPoints: [resolve(root, 'server/index.ts')],
  outdir,
  platform: 'node',
  format: 'esm',
  bundle: true,
  external: ['vite'],
  define: { 'process.env.NODE_ENV': '"production"' },
  // Express and friends use require() on Node built-ins; an ESM bundle has none.
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
  logLevel: 'warning',
})
