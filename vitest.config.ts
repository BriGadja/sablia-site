import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['{src,server,db,api}/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**'],
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/mockData/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@db': path.resolve(__dirname, 'db'),
      '@docs': path.resolve(__dirname, 'docs'),
    },
  },
})
