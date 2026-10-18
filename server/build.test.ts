// @vitest-environment node
/**
 * The production bundle is self-contained (plan R4): built with scripts/build-server.mjs, started
 * from a directory with NO node_modules, it serves, answers SIGTERM and holds no import of `vite`.
 */
import { type ChildProcess, execFileSync, spawn } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { makeDist } from './test-helpers'

const ROOT = join(__dirname, '..')
const work = mkdtempSync(join(tmpdir(), 'sablia-bundle-'))
let child: ChildProcess | undefined

const freePort = () =>
  new Promise<number>((resolve) => {
    const s = createServer().listen(0, '127.0.0.1', () => {
      const p = (s.address() as { port: number }).port
      s.close(() => resolve(p))
    })
  })

afterAll(() => {
  if (child?.pid && child.exitCode === null) process.kill(child.pid)
})

describe('production bundle', () => {
  it('builds, holds no import of vite, and runs from a directory without node_modules', async () => {
    execFileSync(
      'node',
      [join(ROOT, 'scripts/build-server.mjs'), `--outdir=${join(work, 'dist')}`],
      {
        cwd: ROOT,
        stdio: 'pipe',
      },
    )
    const bundle = readFileSync(join(work, 'dist/index.js'), 'utf8')
    expect(bundle).not.toMatch(/from\s*["']vite["']/)
    cpSync(makeDist(), join(work, 'dist/public'), { recursive: true })
    writeFileSync(join(work, 'RELEASE'), 'testsha-20261018T100000Z')

    const port = await freePort()
    child = spawn('node', [join(work, 'dist/index.js')], {
      cwd: work,
      env: { PATH: process.env.PATH ?? '', HOST: '127.0.0.1', PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stderr = ''
    child.stderr?.on('data', (d) => {
      stderr += d
    })
    let body: { ok?: boolean; release?: string } | undefined
    for (let i = 0; i < 50 && !body; i++) {
      try {
        body = await (await fetch(`http://127.0.0.1:${port}/healthz`)).json()
      } catch {
        await new Promise((r) => setTimeout(r, 100))
      }
    }
    expect(stderr).toBe('')
    expect(body).toEqual({ ok: true, release: 'testsha-20261018T100000Z' })
    const home = await fetch(`http://127.0.0.1:${port}/cgv`)
    expect(home.status).toBe(200)

    const exited = new Promise<number | null>((resolve) =>
      child?.on('exit', (code) => resolve(code)),
    )
    child.kill('SIGTERM')
    expect(await exited).toBe(0)
  }, 30_000)
})
