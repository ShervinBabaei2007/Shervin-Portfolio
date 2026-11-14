// Renders public/logo.svg into the favicon and app-icon files in public/.
// Usage: npm run favicons   (re-run after editing public/logo.svg)
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { root } from './lib.mjs'

const svg = readFileSync(resolve(root, 'public/logo.svg'))
/** Renders the logo as a square PNG of the given size (high density keeps the edges crisp). */
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

for (const [file, size] of [
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  writeFileSync(resolve(root, 'public', file), await png(size))
  console.log(`public/${file}`)
}

// favicon.ico: PNG-compressed 16, 32 and 48px images in one container.
const sizes = [16, 32, 48]
const images = await Promise.all(sizes.map(png))
// ICO layout: a 6-byte file header (type 1 = icon, image count), then a 16-byte entry per image, then the images.
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((size, i) => {
  // Each entry: width, height, 1 colour plane, 32 bits per pixel, image byte length, and where the image starts.
  const entry = 6 + 16 * i
  header.writeUInt8(size, entry)
  header.writeUInt8(size, entry + 1)
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(images[i].length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += images[i].length
})
writeFileSync(resolve(root, 'public/favicon.ico'), Buffer.concat([header, ...images]))
console.log('public/favicon.ico')
