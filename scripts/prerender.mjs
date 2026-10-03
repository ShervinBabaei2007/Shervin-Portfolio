// Renders every route to static HTML after `vite build`.
// Run through `npm run build`; it expects dist/ (client) and dist-ssr/ (server bundle).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const { render, staticRoutes, site } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const write = (file, html) => {
  const target = resolve(dist, file)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
}

const page = (url) => {
  const { html, head } = render(url)
  return template.replace('<!--head-->', head).replace('<!--app-->', html)
}

for (const url of staticRoutes) {
  // With "cleanUrls" in vercel.json, /work/skillmatch is served from work/skillmatch.html.
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  write(file, page(url))
  console.log(`prerendered ${url}`)
}
write('404.html', page('/404'))

const origin = site.url
{
  const urls = staticRoutes.map((url) => `  <url><loc>${origin}${url === '/' ? '/' : url}</loc></url>`).join('\n')
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`)
}

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
