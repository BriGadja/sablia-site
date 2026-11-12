import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * US-111 (plan sablia-site-structure-offre I1): the word « audit » appears in no visitor-text source
 * of the site (Brice, 12/11: no « audit » on the site). Scanned: every non-test text file of
 * `src/app`, `src/components` and `public`. The WORD is matched, not the letters: « audit »,
 * « audits », « auditer », « audité(e)(s) », any case; « auditoire » and « auditeur(s) » are normal
 * words a conference page may need. Not scanned: `src/content/legal/cgv-v1.ts` (the unrendered
 * fallback of the CGV page, outside `src/app` and `src/components`), and the resource and letter
 * pages built from the content register (Phase K greps the built HTML once and lists any hit).
 */
const ROOT = resolve(__dirname, '..', '..')
const DIRS = ['src/app', 'src/components', 'public']
const TEXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
  '.txt',
  '.html',
  '.json',
  '.svg',
  '.md',
  '.xml',
  '.webmanifest',
])
const TEST = /\.test\.(ts|tsx)$/
const AUDIT = /(?<!\p{L})(audit|audits|auditer|audité|auditée|audités|auditées)(?!\p{L})/iu

function textFiles(dir: string): string[] {
  const out: string[] = []
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (TEXT.has(extname(name)) && !TEST.test(name)) out.push(relative(ROOT, p))
    }
  }
  walk(join(ROOT, dir))
  return out
}

const FILES = DIRS.flatMap(textFiles)

describe('no « audit » in the visitor-text sources', () => {
  it('the oracle matches the word and its forms, not « auditoire » nor « auditeur »', () => {
    for (const s of [
      'un audit',
      'Audit gratuit',
      'call audit',
      'des audits',
      'auditer vos processus',
      'un process audité',
      'les tâches auditées',
      'AUDIT.',
    ])
      expect(AUDIT.test(s), s).toBe(true)
    for (const s of ["l'auditoire", 'un auditeur', 'les auditeurs', 'une auditrice', 'audition'])
      expect(AUDIT.test(s), s).toBe(false)
  })

  it('reads the visitor sources it is meant to read', () => {
    expect(FILES.length).toBeGreaterThan(100)
    for (const known of [
      'public/llms.txt',
      'public/.well-known/ai.txt',
      'src/app/guides/integrer-l-ia-dans-votre-entreprise/page.tsx',
      'src/components/legal/ThanksBody.tsx',
    ])
      expect(FILES, known).toContain(known)
    expect(FILES.some((f) => TEST.test(f))).toBe(false)
  })

  it('no file says « audit »', () => {
    const hits = FILES.flatMap((f) =>
      readFileSync(join(ROOT, f), 'utf8')
        .split('\n')
        .flatMap((line, i) => (AUDIT.test(line) ? [`${f}:${i + 1}: ${line.trim()}`] : [])),
    )
    expect(hits).toEqual([])
  })
})
