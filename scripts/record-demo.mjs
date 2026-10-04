// Records a short, silent screen capture of a live project for its case study.
// Usage:   npm run record -- skillmatch
// Output:  public/projects/<name>-demo.webm (+ .mp4 if ffmpeg is installed)
//          public/projects/<name>-demo-poster.webp
//
// Each demo below is a list of steps. The selectors are a starting point:
// open the live site, check them, and adjust until the recording shows the
// flow you want. Keep it under 60 seconds. Then add to the project in
// src/data/projects.ts:
//   video: { src: '/projects/skillmatch-demo.mp4', poster: '/projects/skillmatch-demo-poster.webp', caption: '…' }
import { execFileSync } from 'node:child_process'
import { mkdirSync, renameSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { launchBrowser, root } from './lib.mjs'

const demos = {
  skillmatch: {
    url: 'https://skillmatch-web.vercel.app/',
    steps: [
      { pause: 1500 },
      { scroll: 600 },
      { pause: 1000 },
      { scroll: 600 },
      { pause: 1200 },
      // Example: open a page by visible text. Change the text to match the live site.
      { clickText: 'Login', optional: true },
      { pause: 2000 },
    ],
  },
  gitscribe: {
    url: 'https://git-scribe-aybm.vercel.app/',
    steps: [{ pause: 1500 }, { hover: 'text=Continue with GitHub', optional: true }, { pause: 2500 }],
  },
  // Local check that the recorder works: npm run build && npx vite preview, then npm run record -- self-test
  'self-test': {
    url: 'http://localhost:4173/work/thinkboard',
    steps: [
      { pause: 800 },
      { scrollTo: '.limiter-demo' },
      { clickText: 'Burst 15 requests' },
      { pause: 1800 },
      { clickText: 'Other visitor sends 1' },
      { pause: 1500 },
    ],
  },
}

const name = process.argv[2]
const demo = demos[name]
if (!demo) {
  console.error(`Usage: npm run record -- <${Object.keys(demos).join(' | ')}>`)
  process.exit(1)
}

const outDir = resolve(root, 'public/projects')
const tempDir = resolve(root, '.recording')
mkdirSync(outDir, { recursive: true })
rmSync(tempDir, { recursive: true, force: true })

const size = { width: 1280, height: 800 }
const browser = await launchBrowser()
const context = await browser.newContext({ viewport: size, recordVideo: { dir: tempDir, size } })
const page = await context.newPage()

await page.goto(demo.url, { waitUntil: 'networkidle', timeout: 60_000 })
const poster = await page.screenshot()

for (const step of demo.steps) {
  try {
    if (step.pause) await page.waitForTimeout(step.pause)
    if (step.scroll) await page.mouse.wheel(0, step.scroll)
    if (step.scrollTo) await page.locator(step.scrollTo).first().scrollIntoViewIfNeeded()
    if (step.clickText) await page.getByText(step.clickText, { exact: false }).first().click({ timeout: 5000 })
    if (step.hover) await page.locator(step.hover).first().hover({ timeout: 5000 })
  } catch (error) {
    if (!step.optional) throw error
    console.warn(`skipped optional step ${JSON.stringify(step)}: ${error.message.split('\n')[0]}`)
  }
}

const video = page.video()
await context.close()
await browser.close()

const webm = resolve(outDir, `${name}-demo.webm`)
renameSync(await video.path(), webm)
rmSync(tempDir, { recursive: true, force: true })
await sharp(poster).resize({ width: 1280 }).webp({ quality: 80 }).toFile(resolve(outDir, `${name}-demo-poster.webp`))
console.log(`public/projects/${name}-demo.webm`)

// MP4 (H.264) plays everywhere, including older iPhones. Needs ffmpeg on your PATH.
try {
  const mp4 = resolve(outDir, `${name}-demo.mp4`)
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '28', '-movflags', '+faststart', '-an', mp4])
  console.log(`public/projects/${name}-demo.mp4`)
} catch {
  console.warn('ffmpeg not found: only the .webm was written. Install ffmpeg for an .mp4 that plays on every browser.')
}
