// Renders every route to static HTML after `vite build`.
// Run through `npm run build`; it expects dist/ (client) and dist-ssr/ (server bundle).
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const manifestPath = resolve(dist, '.vite/manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const { render, staticRoutes, site } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

// Chunks the entry script already loads; no need to preload them again.
const entryChunks = new Set()
const collect = (key, into) => {
  const chunk = manifest[key]
  if (!chunk || into.has(chunk.file)) return
  into.add(chunk.file)
  for (const imported of chunk.imports ?? []) collect(imported, into)
}
collect('index.html', entryChunks)

/** <link rel="modulepreload"> for the page's own chunk and its shared dependencies. */
const modulePreloads = (pageSource) => {
  const files = new Set()
  collect(pageSource, files)
  return [...files]
    .filter((file) => !entryChunks.has(file))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`)
    .join('\n    ')
}

const write = (file, html) => {
  const target = resolve(dist, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
}

const page = async (url) => {
  const { html, head, pageSource } = await render(url)
  return template.replace('<!--head-->', `${head}\n    ${modulePreloads(pageSource)}`).replace('<!--app-->', html)
}

for (const url of staticRoutes) {
  // With "cleanUrls" in vercel.json, /work/skillmatch is served from work/skillmatch.html.
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  write(file, await page(url))
  console.log(`prerendered ${url}`)
}
write('404.html', await page('/404'))

const urls = staticRoutes.map((url) => `  <url><loc>${site.url}${url === '/' ? '/' : url}</loc></url>`).join('\n')
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
if (existsSync(resolve(dist, '.vite'))) rmSync(resolve(dist, '.vite'), { recursive: true, force: true })
