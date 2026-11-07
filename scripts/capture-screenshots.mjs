// Captures sharp 2× screenshots of live projects into public/projects/ as WebP.
// Usage: npm run screenshots   (or: npm run screenshots -- <part of a name>)
//
// Edit the list below to add pages. For screens behind a login, sign in in a
// normal browser, take a full-window screenshot at 2× zoom, and convert it with:
//   npx sharp-cli -i shot.png -o public/projects/name.webp resize 1600 --withoutEnlargement -f webp -q 82
// Then add the file to the project's `screenshots` list in src/data/projects.ts.
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { launchBrowser, root } from './lib.mjs'

const shots = [
  { name: 'skillmatch-home', url: 'https://skillmatch-web.vercel.app/' },
  { name: 'gitscribe-sign-in', url: 'https://git-scribe-aybm.vercel.app/' },
  { name: 'linklocker-home', url: 'https://linklocker.northcentralus.cloudapp.azure.com/' },
]
// `npm run screenshots -- linklocker` captures only the entries whose name contains the word.
const only = process.argv[2]

const outDir = resolve(root, 'public/projects')
mkdirSync(outDir, { recursive: true })

const browser = await launchBrowser()
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await desktop.newPage()
for (const shot of shots.filter((shot) => !only || shot.name.includes(only))) {
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(1500) // let fonts, images and entrance animations settle
  const png = await page.screenshot()
  await sharp(png)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(resolve(outDir, `${shot.name}.webp`))
  console.log(`public/projects/${shot.name}.webp`)
}
await browser.close()
