import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

test('hero states role, proof, availability, and links to the resume page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Full-stack developer')
  const proof = page.getByRole('list', { name: 'Highlights' })
  await expect(proof).toContainText('Top 6 of 36')
  await expect(proof).toContainText('114 commits')
  await expect(page.locator('.hero-target')).toContainText(/Open to|Available from/)
  await expect(page.getByRole('link', { name: 'View resume' }).first()).toHaveAttribute('href', '/resume')
})

test('pages are prerendered with content, metadata, and a PNG share image', async ({ request }) => {
  const html = await (await request.get('/work/skillmatch')).text()
  expect(html).toContain('<h1 id="case-study-title">SkillMatch</h1>')
  expect(html).toContain('<title>SkillMatch case study | Shervin Babaei</title>')
  expect(html).toMatch(/<link rel="canonical" href="https:\/\/[^"]+\/work\/skillmatch"/)
  expect(html).toMatch(/<meta property="og:image" content="https:\/\/[^"]+\/og\/skillmatch\.png"/)
  expect(html).toContain('application/ld+json')
  const image = await request.get('/og/skillmatch.png')
  expect(image.headers()['content-type']).toBe('image/png')
})

test('prerendered pages hydrate without errors', async ({ page }) => {
  const errors = collectErrors(page)
  for (const path of ['/', '/work/thinkboard', '/resume', '/how-its-built']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})

test('home shows four flagships and a compact list for the rest', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.project-grid .project-card')).toHaveCount(4)
  await expect(page.locator('.more-projects li')).toHaveCount(4)
  await expect(page.getByText('Illustrative interface preview')).toHaveCount(0)
})

test('case study is a shareable page with team context, code, and trade-off', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'SkillMatch case study' }).click()
  await expect(page).toHaveURL(/\/work\/skillmatch$/)
  await expect(page).toHaveTitle('SkillMatch case study | Shervin Babaei')
  await expect(page.getByRole('heading', { level: 1, name: 'SkillMatch' })).toBeVisible()
  await expect(page.locator('.case-study-at-a-glance')).toContainText('114 of roughly 245 commits')
  await expect(page.getByRole('link', { name: 'Team repository' })).toHaveAttribute('href', 'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD')
  await expect(page.getByRole('heading', { name: 'How a request flows' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The trade-off' })).toBeVisible()
  await expect(page.locator('.code-block')).toContainText("router.post('/:id/attend'")
  const screenshot = page.getByRole('img', { name: /SkillMatch dashboard/ })
  await expect.poll(() => screenshot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  await page.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(/\/work\/gitscribe$/)
  await page.getByRole('link', { name: 'All projects' }).click()
  await expect(page).toHaveURL(/\/#work$/)
})

test('terminal projects show a recorded session', async ({ page }) => {
  await page.goto('/work/mini-rpg-battle')
  await expect(page.locator('.terminal-block')).toContainText('Victory! Survived 10 rounds.')
})

test('unknown routes show a 404 page', async ({ page }) => {
  await page.goto('/work/does-not-exist')
  await expect(page.getByRole('heading', { name: "This page doesn't exist." })).toBeVisible()
})

test('skill chips filter projects and can be cleared', async ({ page }) => {
  await page.goto('/')
  const chip = page.locator('.skill-chip', { hasText: 'Redis' })
  await chip.click()
  await expect(page.getByText('Showing projects that use')).toBeVisible()
  await expect(page.locator('.project-grid .project-card')).toHaveCount(1)
  await expect(page.locator('.more-projects')).toHaveCount(0)
  await page.getByRole('button', { name: 'Clear skill filter' }).click()
  await expect(page.locator('.project-grid .project-card')).toHaveCount(4)
})

test('every listed skill is backed by at least one project', async ({ page }) => {
  await page.goto('/')
  const counts = await page.locator('.skill-chip span').allTextContents()
  expect(counts.length).toBeGreaterThan(0)
  for (const count of counts) expect(Number(count)).toBeGreaterThan(0)
})

test('theme follows the system and remembers a manual choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto('/')
  const paper = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--paper').trim())
  expect(await paper()).toBe('#1a211c')

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  expect(await paper()).toBe('#f5f6f1')
  await page.reload()
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')
  expect(await paper()).toBe('#f5f6f1')

  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBeNull()
  await context.close()
})

test('layout stays within phone, tablet, and desktop viewports', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/work/skillmatch', '/resume']) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0)
      // .site-shell clips overflow, so also check that no text block is cut off at the edge.
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('main p, main h1, main h2, main pre, main li')]
          .filter((el) => !el.closest('pre') && !el.closest('.project-visual'))
          .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
          .map((el) => el.textContent?.slice(0, 40)),
      )
      expect(clipped, `${path} at ${width}px`).toEqual([])
    }
  }
})

for (const scheme of ['light', 'dark'] as const) {
  test(`pages pass axe accessibility checks in ${scheme} mode`, async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: scheme })
    const page = await context.newPage()
    for (const path of ['/', '/work/skillmatch', '/work/mini-rpg-battle', '/resume', '/how-its-built']) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations.map((v) => `${path}: ${v.id} (${v.nodes.length})`)).toEqual([])
    }
    await context.close()
  })
}
