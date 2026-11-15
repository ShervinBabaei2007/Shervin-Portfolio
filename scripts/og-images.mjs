// Generates 1200×630 PNG share images into public/og/.
// LinkedIn, Slack, X and iMessage ignore SVG previews, so these must be PNG.
// Usage: npm run og:images   (re-run after changing project names or highlights)
//        npm run og:images -- writeups   (only the named images)
import { mkdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fontUrl, importTs, launchBrowser, root } from './lib.mjs'

const { projects } = await importTs('src/data/projects.ts')
const { site } = await importTs('src/data/site.ts')
const { notes } = await importTs('src/data/notes.ts')
const outDir = resolve(root, 'public/og')
mkdirSync(outDir, { recursive: true })

const logoUrl = `data:image/svg+xml;base64,${readFileSync(resolve(root, 'public/logo.svg')).toString('base64')}`
const dmSansUrl = fontUrl('@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2')
const dmMonoUrl = fontUrl('@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2')

/** Escapes the two characters that could break the HTML of a card. */
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Font size for the title: smaller as the title gets longer, so it always fits. */
function titleSize(title) {
  if (title.length > 40) return 60
  if (title.length > 18) return 84
  return 104
}

/** The full HTML page for one share image. */
const card = ({ kicker, title, subtitle, result }) => `<!doctype html><html><head><style>
@font-face { font-family: Display; src: url('${dmSansUrl}'); font-weight: 100 1000; }
@font-face { font-family: Body; src: url('${dmSansUrl}'); font-weight: 100 1000; }
@font-face { font-family: Mono; src: url('${dmMonoUrl}'); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; padding: 72px 84px; display: flex; flex-direction: column;
  color: #f4efe4; font-family: Body, sans-serif;
  background-color: #1b1a18;
  background-image: linear-gradient(rgba(244,239,228,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,239,228,.05) 1px, transparent 1px);
  background-size: 38px 38px; }
.top { display: flex; align-items: center; justify-content: space-between; }
.mark { display: flex; align-items: center; gap: 10px; }
.mark img { width: 56px; height: 56px; border-radius: 13px; }
.kicker { color: #a59e91; font: 22px Mono; }
h1 { margin-top: auto; max-width: 960px; font: 600 ${titleSize(title)}px/1.04 Display; letter-spacing: -.02em; }
p { margin-top: 22px; max-width: 960px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; color: #a59e91; font-size: 30px; line-height: 1.35; }
.result { display: inline-block; margin-top: 34px; padding: 12px 18px; border-left: 6px solid #8ca3ff; background: #242220; font: 600 26px Body; }
.foot { display: flex; justify-content: space-between; margin-top: 40px; color: #a59e91; font: 20px Mono; }
</style></head><body>
<div class="top"><div class="mark"><img src="${logoUrl}" alt="" /></div><span class="kicker">${escape(kicker)}</span></div>
<h1>${escape(title)}</h1>
<p>${escape(subtitle)}</p>
${result ? `<div><span class="result">${escape(result)}</span></div>` : ''}
<div class="foot"><span>${escape(site.name)}</span><span>${escape(site.url.replace(/^https?:\/\//, ''))}</span></div>
</body></html>`

// Every share image: home, one per case study, the projects and writeups lists, and one per writeup.
const cards = [
  {
    name: 'home',
    kicker: 'VANCOUVER, BC / BCIT',
    title: site.name,
    subtitle: 'Full-stack developer who goes down the stack: React, Node, Redis, and a language model running locally.',
    result: 'Top 6 of 36 teams, Hack the Break 2026',
  },
  ...projects.map((project) => ({
    name: project.slug,
    kicker: `CASE STUDY / ${project.category.toUpperCase()}`,
    title: project.name,
    subtitle: project.subtitle,
    result: project.highlight,
  })),
  {
    name: 'projects',
    kicker: 'PROJECTS',
    title: 'Projects',
    subtitle: 'Full-stack apps, a Discord bot and more, each with the stack and what it taught me.',
    result: `${projects.length} projects`,
  },
  {
    name: 'writeups',
    kicker: 'WRITEUPS',
    title: 'Writeups',
    subtitle: 'Short writeups on bugs I found in my own projects and what I changed.',
    result: `${notes.length} writeups`,
  },
  ...notes.map((note) => ({
    name: `writeup-${note.slug}`,
    kicker: `WRITEUP / ${note.minutes} MIN READ`,
    title: note.title,
    subtitle: note.summary,
    result: '',
  })),
]

// Optional: name the images to regenerate, for example `npm run og:images -- writeups home`. No names means all.
const only = process.argv.slice(2)
const browser = await launchBrowser()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const item of cards.filter((card) => only.length === 0 || only.includes(card.name))) {
  await page.setContent(card(item), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: resolve(outDir, `${item.name}.png`) })
  console.log(`og/${item.name}.png`)
}
await browser.close()
