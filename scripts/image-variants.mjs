// Creates a 480px-wide copy of every large screenshot in public/projects/ and
// records each image's size in src/data/images.json. Components use that file
// for width/height (no layout shift) and srcset (phones get the small copy).
// Usage: npm run images   (also runs at the end of npm run screenshots)
import { readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { root } from './lib.mjs'

const SMALL = 480
const dir = resolve(root, 'public/projects')
const images = {}

for (const file of readdirSync(dir).sort()) {
  if (!file.endsWith('.webp') || file.endsWith(`-${SMALL}.webp`)) continue
  const { width, height } = await sharp(resolve(dir, file)).metadata()
  const entry = { width, height }
  if (width > SMALL * 1.25) {
    const small = file.replace(/\.webp$/, `-${SMALL}.webp`)
    await sharp(resolve(dir, file)).resize({ width: SMALL }).webp({ quality: 80 }).toFile(resolve(dir, small))
    entry.small = { src: `/projects/${small}`, width: SMALL }
  }
  images[`/projects/${file}`] = entry
}

writeFileSync(resolve(root, 'src/data/images.json'), `${JSON.stringify(images, null, 2)}\n`)
console.log(`Recorded ${Object.keys(images).length} images in src/data/images.json`)
