// Builds the About-section photos from PersonalPhoto2.jpeg, PersonalPhoto.jpeg and PersonalPhoto3.jpeg (kept local,
// gitignored): an even-skin pass on the lower face (scripts/skin-tone.mjs), a crop centred on the subject, a 2x
// super-resolution pass (scripts/upscale.py, optional), a Lanczos resize and a light sharpen, as AVIF/WebP/JPEG in
// public/about/. All three are 4:5. The two small cards draw at about 105 to 165px wide (320 and 480px files) and the
// hero beach shot at up to 340px (480 and 720px files).
//
// The super-resolution step uses the Swin2SR classical x2 ONNX model, which is not committed (54 MB). To enable it:
//   pip install onnxruntime numpy pillow
//   download https://huggingface.co/Xenova/swin2SR-classical-sr-x2-64/resolve/main/onnx/model.onnx
//   to .models/swin2sr-classical-x2.onnx
// Without it the script falls back to a plain Lanczos resize.
// Usage: node scripts/portrait.mjs
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { root } from './lib.mjs'
import { evenSkin } from './skin-tone.mjs'

const out = resolve(root, 'public/about')
mkdirSync(out, { recursive: true })

const model = resolve(root, '.models/swin2sr-classical-x2.onnx')

/** Upscales a PNG buffer 2x with the super-resolution model, or returns it unchanged if that is not available. */
function upscale(png) {
  if (!existsSync(model)) {
    console.warn('No super-resolution model at .models/swin2sr-classical-x2.onnx: using a plain resize.')
    return png
  }
  const dir = mkdtempSync(resolve(tmpdir(), 'portrait-'))
  try {
    writeFileSync(resolve(dir, 'in.png'), png)
    execFileSync(
      'python',
      ['-I', resolve(root, 'scripts/upscale.py'), model, resolve(dir, 'in.png'), resolve(dir, 'out.png')],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    )
    return readFileSync(resolve(dir, 'out.png'))
  } catch (error) {
    console.warn(`Super-resolution failed (${error.code ?? error.message}): using a plain resize.`)
    return png
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const photos = [
  {
    name: 'portrait-a',
    file: 'PersonalPhoto2.jpeg',
    widths: [320, 480],
    ratio: 1.25,
    crop: { left: 95, top: 0, width: 300, height: 376 },
    skin: { strength: 0.8, ref: { cx: 245, cy: 142, r: 14 }, region: { cx: 245, cy: 212, rx: 66, ry: 62 } },
  },
  {
    name: 'portrait-b',
    file: 'PersonalPhoto.jpeg',
    widths: [320, 480],
    ratio: 1.25,
    crop: { left: 155, top: 45, width: 460, height: 575 },
    skin: { strength: 0.5, ref: { cx: 385, cy: 262, r: 18 }, region: { cx: 392, cy: 400, rx: 85, ry: 85 } },
  },
  {
    name: 'portrait-c',
    file: 'PersonalPhoto3.jpeg',
    widths: [480, 720],
    ratio: 1.25,
    crop: { left: 560, top: 426, width: 560, height: 700 },
    skin: {
      strength: 0.85,
      lift: 0.5,
      ref: { cx: 827, cy: 607, r: 14 },
      region: { cx: 820, cy: 668, rx: 58, ry: 55 },
    },
  },
]

for (const { name, file, widths, ratio, crop, skin } of photos) {
  const { data, info } = await sharp(resolve(root, file))
    .rotate()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  evenSkin(data, info.width, info.height, skin)
  const cropped = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } })
    .extract(crop)
    .png()
    .toBuffer()
  const source = upscale(cropped)
  for (const width of widths) {
    const base = () =>
      sharp(source)
        .resize({ width, height: Math.round(width * ratio), kernel: 'lanczos3' })
        .modulate({ brightness: 1.03, saturation: 1.04 })
        .sharpen({ sigma: 0.8, m1: 0.7, m2: 1.4 })
    await base()
      .avif({ quality: 70, effort: 6 })
      .toFile(resolve(out, `${name}-${width}.avif`))
    await base()
      .webp({ quality: 90 })
      .toFile(resolve(out, `${name}-${width}.webp`))
    await base()
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(resolve(out, `${name}-${width}.jpg`))
  }
}
console.log('Wrote public/about/portrait-{a,b,c}-*.{avif,webp,jpg}')
