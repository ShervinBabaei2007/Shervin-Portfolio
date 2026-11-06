// Shared helpers for the build-time scripts in this folder.
import { build } from 'esbuild'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Imports a TypeScript module from src/ by bundling it with esbuild (ships with Vite). */
export async function importTs(relativePath) {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-'))
  const outfile = join(dir, 'module.mjs')
  await build({
    entryPoints: [resolve(root, relativePath)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile,
    logLevel: 'silent',
  })
  const module = await import(pathToFileURL(outfile).href)
  rmSync(dir, { recursive: true, force: true })
  return module
}

/** Launches Chromium. Run `npx playwright install chromium` once, or set CHROME_PATH. */
export function launchBrowser() {
  return chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
}

/** Fonts are inlined as data URLs because pages opened with setContent cannot read local files. */
export const fontUrl = (path) =>
  `data:font/woff2;base64,${readFileSync(resolve(root, 'node_modules', path)).toString('base64')}`
