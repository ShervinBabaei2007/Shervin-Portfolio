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

/**
 * The prerendered HTML is already readable, so the app's JavaScript does not need to compete with the CSS and fonts
 * for the first paint. This moves the entry script and its preloads out of the markup and into a tiny inline loader
 * that starts them once the first paint has happened (the largest-contentful-paint entry), on the first interaction,
 * or after 2.5 seconds at the latest. Hydration begins a few tens of milliseconds later than before; the page's
 * links are plain anchors, so they work even before it does.
 */
const deferScripts = (html) => {
  const preloads = []
  let entry = ''
  html = html.replace(/\s*<link rel="modulepreload"[^>]*?href="([^"]+)"[^>]*>/g, (_match, href) => {
    preloads.push(href)
    return ''
  })
  html = html.replace(/\s*<script type="module"[^>]*?src="([^"]+)"[^>]*><\/script>/, (_match, src) => {
    entry = src
    return ''
  })
  if (!entry) return html
  const loader = `<script>(function(){var d=0,p=${JSON.stringify(preloads)},e=${JSON.stringify(entry)};function go(){if(d)return;d=1;for(var i=0;i<p.length;i++){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=p[i];document.head.appendChild(l)}var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=e;document.head.appendChild(s)}function later(){setTimeout(go,60)}try{new PerformanceObserver(function(l,o){if(l.getEntries().length){o.disconnect();later()}}).observe({type:'largest-contentful-paint',buffered:true})}catch(x){addEventListener('load',later)}['pointerdown','keydown','touchstart'].forEach(function(n){addEventListener(n,go,{once:true,passive:true})});setTimeout(go,2500)})()</script>`
  return html.replace('</head>', `    ${loader}\n  </head>`)
}

const page = async (url) => {
  const { html, head, pageSource } = await render(url)
  return deferScripts(
    template.replace('<!--head-->', `${head}\n    ${modulePreloads(pageSource)}`).replace('<!--app-->', html),
  )
}

for (const url of staticRoutes) {
  // With "cleanUrls" in vercel.json, /work/skillmatch is served from work/skillmatch.html.
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  write(file, await page(url))
  console.log(`prerendered ${url}`)
}
write('404.html', await page('/404'))

const urls = staticRoutes.map((url) => `  <url><loc>${site.url}${url === '/' ? '/' : url}</loc></url>`).join('\n')
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true })
if (existsSync(resolve(dist, '.vite'))) rmSync(resolve(dist, '.vite'), { recursive: true, force: true })
