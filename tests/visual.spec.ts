import { expect, test } from '@playwright/test'

/*
 * Screenshot comparison, run locally only (`npm run test:visual`). Baselines are named per
 * platform and are NOT committed (about 9 MB, and different on every OS). Before a refactor, create them
 * from the current code with `npm run test:visual -- --update-snapshots`; after it, `npm run test:visual`
 * should pass. Update them on purpose only after reviewing a diff you intended.
 */

const pages = ['/', '/work/skillmatch', '/work/mini-rpg-battle', '/resume', '/notes', '/lab', '/how-its-built']
const widths = [390, 768, 1440]

for (const scheme of ['dark', 'light'] as const) {
  for (const width of widths) {
    // Light mode is checked at the two widths that matter most, to keep the baseline set small.
    if (scheme === 'light' && width === 768) continue
    for (const path of pages) {
      test(`@visual ${path} at ${width}px, ${scheme}`, async ({ browser }) => {
        const context = await browser.newContext({
          colorScheme: scheme,
          viewport: { width, height: 900 },
          reducedMotion: 'reduce',
        })
        await context.addInitScript((value) => localStorage.setItem('color-scheme', value), scheme)
        const page = await context.newPage()
        // The panel's contents change every build and every day, so keep the data fixed and mask the box.
        // The rate-limiter demo draws a bar from the clock, so pin it.
        await page.clock.setFixedTime(new Date('2026-06-01T12:00:00Z'))
        await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)
        await expect(page).toHaveScreenshot(
          `${path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home'}-${width}-${scheme}.png`,
          {
            fullPage: true,
            animations: 'disabled',
            mask: [page.locator('[data-github]'), page.locator('[role="progressbar"]')],
            maxDiffPixelRatio: 0.002,
          },
        )
        await context.close()
      })
    }
  }
}
