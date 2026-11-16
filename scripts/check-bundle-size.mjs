// Fails when the shared entry chunk grows past its budget (gzip), so a heavy import cannot slip in unnoticed.
// Usage: npm run build && npm run check:bundle
// To raise the budget on purpose, change BUDGET_KB below and say why in the commit message.
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { root } from './lib.mjs'

const BUDGET_KB = 125 // lowered from 250 (2026-11): measured 108 KB, so a heavy import now fails CI instead of slipping in
const assets = resolve(root, 'dist/assets')
// The entry chunk is the index-*.js file that calls createRoot (other index-*.js chunks may exist).
const entry = readdirSync(assets).find(
  (file) => /^index-[\w-]+\.js$/.test(file) && readFileSync(resolve(assets, file), 'utf8').includes('createRoot'),
)
if (!entry) {
  console.error('Could not find the entry chunk in dist/assets. Run `npm run build` first.')
  process.exit(1)
}
const kb = gzipSync(readFileSync(resolve(assets, entry))).length / 1024
console.log(`entry chunk ${entry}: ${kb.toFixed(1)} KB gzip (budget ${BUDGET_KB} KB)`)
if (kb > BUDGET_KB) {
  console.error('Over budget. Run `npm run analyze` to see what grew, and lazy-load it or raise the budget on purpose.')
  process.exit(1)
}
