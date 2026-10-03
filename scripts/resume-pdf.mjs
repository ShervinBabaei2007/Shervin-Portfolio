// Prints the /resume page to public/Shervin_Babaei_Resume.pdf so the PDF never
// drifts from the website. Usage: npm run build && npm run resume:pdf
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { preview } from 'vite'
import { launchBrowser, root } from './lib.mjs'

if (!existsSync(resolve(root, 'dist/resume.html'))) {
  console.error('Run `npm run build` first.')
  process.exit(1)
}

const server = await preview({ root, preview: { port: 4317, strictPort: true }, logLevel: 'silent' })
const browser = await launchBrowser()
try {
  const page = await browser.newPage()
  await page.goto('http://localhost:4317/resume', { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })
  const target = resolve(root, 'public/Shervin_Babaei_Resume.pdf')
  await page.pdf({ path: target, format: 'Letter', printBackground: false, preferCSSPageSize: true })
  copyFileSync(target, resolve(root, 'dist/Shervin_Babaei_Resume.pdf'))
  console.log('Wrote public/Shervin_Babaei_Resume.pdf')
} finally {
  await browser.close()
  await new Promise((done) => server.httpServer.close(done))
}
