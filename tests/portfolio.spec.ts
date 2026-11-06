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
  // The live GitHub request is outside this site's control (and rate-limited per IP),
  // so answer it locally to keep this test about the site's own code.
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
  const errors = collectErrors(page)
  for (const path of [
    '/',
    '/work/thinkboard',
    '/resume',
    '/how-its-built',
    '/notes',
    '/notes/sliding-window-rate-limiting',
  ]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})

test('home shows four flagships and a compact list for the rest', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-slot="carousel"] .project-card')).toHaveCount(4)
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
  await expect(page.getByRole('link', { name: 'Team repository' })).toHaveAttribute(
    'href',
    'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD',
  )
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
  await page.getByRole('tab', { name: 'Systems & Low-Level' }).click()
  const chip = page.locator('.skill-chip', { hasText: 'Redis' })
  await chip.click()
  await expect(page.getByText('Showing projects that use')).toBeVisible()
  await expect(page.locator('[data-slot="carousel"] .project-card')).toHaveCount(1)
  await expect(page.locator('.more-projects')).toHaveCount(0)
  await page.getByRole('button', { name: 'Clear skill filter' }).click()
  await expect(page.locator('[data-slot="carousel"] .project-card')).toHaveCount(4)
})

test('every listed skill is backed by at least one project', async ({ page }) => {
  await page.goto('/')
  const counts = await page.locator('.skill-chip span').allTextContents()
  expect(counts.length).toBeGreaterThan(0)
  for (const count of counts) expect(Number(count)).toBeGreaterThan(0)
})

test('theme is dark by default and remembers a manual choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto('/')
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'))
  expect(await isDark()).toBe(true)

  await page.getByRole('button', { name: 'Choose theme' }).click()
  await page.getByRole('menuitemradio', { name: 'Light' }).click()
  expect(await isDark()).toBe(false)
  await page.reload()
  expect(await isDark()).toBe(false)

  await page.getByRole('button', { name: 'Choose theme' }).click()
  await page.getByRole('menuitemradio', { name: 'System' }).click()
  expect(await page.evaluate(() => localStorage.getItem('color-scheme'))).toBe('system')
  expect(await isDark()).toBe(true)
  await context.close()
})

test('layout stays within phone, tablet, and desktop viewports', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      '/',
      '/work/skillmatch',
      '/work/thinkboard',
      '/resume',
      '/notes/skillmatch-attend-race-condition',
    ]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0)
      // .site-shell clips overflow, so also check that no text block is cut off at the edge.
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('main p, main h1, main h2, main pre, main li')]
          .filter((el) => !el.closest('pre') && !el.closest('.project-visual') && !el.closest('[data-slot="carousel"]'))
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
    await context.addInitScript((value) => localStorage.setItem('color-scheme', value), scheme)
    const page = await context.newPage()
    for (const path of [
      '/',
      '/work/skillmatch',
      '/work/thinkboard',
      '/work/mini-rpg-battle',
      '/resume',
      '/how-its-built',
      '/notes',
      '/notes/skillmatch-attend-race-condition',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations.map((v) => `${path}: ${v.id} (${v.nodes.length})`)).toEqual([])
    }
    await context.close()
  })
}

test('CSS is one cached stylesheet, not inlined into every page', async ({ request }) => {
  for (const path of ['/', '/work/skillmatch', '/resume']) {
    const html = await (await request.get(path)).text()
    expect(html, path).not.toContain('<style>')
    expect(html, path).toMatch(/<link rel="stylesheet" crossorigin href="\/assets\/index-[\w-]+\.css">/)
  }
})

test('each page preloads only its own code chunk', async ({ request }) => {
  const resume = await (await request.get('/resume')).text()
  expect(resume).toMatch(/modulepreload[^>]+ResumePage-/)
  expect(resume).not.toMatch(/modulepreload[^>]+(CaseStudyPage|HomePage)-/)
  const caseStudy = await (await request.get('/work/thinkboard')).text()
  expect(caseStudy).toMatch(/modulepreload[^>]+CaseStudyPage-/)
  expect(caseStudy).not.toMatch(/modulepreload[^>]+(ResumePage|HomePage)-/)
})

test('fonts: two above-the-fold files preloaded, unused weight not shipped', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const preloads = html.match(/rel="preload" as="font"[^>]+/g) ?? []
  expect(preloads).toHaveLength(2)
  expect(html).toMatch(/dm-mono-latin-400/)
  const css = await (await request.get(html.match(/\/assets\/index-[\w-]+\.css/)![0])).text()
  expect(css).not.toContain('dm-mono-latin-500')
})

test('large screenshots offer a small copy and reserve their space', async ({ page }) => {
  await page.goto('/work/thinkboard')
  const image = page.getByRole('img', { name: /ThinkBoard dark notes dashboard/ })
  await expect(image).toHaveAttribute('srcset', /thinkboard-screen-1-480\.webp 480w/)
  await expect(image).toHaveAttribute('width', '1000')
  await expect(image).toHaveAttribute('height', /\d+/)
})

test('rate-limiter demo: a burst hits 429, and per-visitor keys isolate the other visitor', async ({ page }) => {
  await page.goto('/work/thinkboard')
  const demo = page.locator('.limiter-demo')
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await expect(demo.locator('.limiter-log li.is-limited').first()).toBeVisible({ timeout: 5000 })
  await expect(demo.getByRole('meter').first()).toHaveAttribute('aria-valuenow', '10')

  // Shared key: the other visitor is blocked by your burst.
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('.limiter-log li').first()).toContainText('Another visitor')
  await expect(demo.locator('.limiter-log li').first()).toContainText('429')

  // Per-visitor keys: the same burst no longer affects them.
  await demo.getByLabel(/One key per visitor/).check()
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await expect(demo.locator('.limiter-log li.is-limited').first()).toBeVisible({ timeout: 5000 })
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('.limiter-log li').first()).toContainText('200 OK')
})

test('engineering notes: listed on home, own pages, linked from case studies', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#notes .note-list li')).toHaveCount(3)
  await page
    .getByRole('link', { name: /The race condition in SkillMatch/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/notes\/skillmatch-attend-race-condition$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('race condition')
  await expect(page.locator('.note-body code').first()).toBeVisible()
  await page.getByRole('link', { name: /Case study/ }).click()
  await expect(page).toHaveURL(/\/work\/skillmatch$/)
  await expect(page.getByRole('heading', { name: 'Go deeper' })).toBeVisible()
})

test('GitHub activity shows live recent pushes, and hides itself when nothing is recent', async ({ page }) => {
  const recent = new Date(Date.now() - 2 * 86_400_000).toISOString()
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      json: [
        {
          name: 'Portfolio',
          html_url: 'https://github.com/ShervinBabaei2007/Portfolio',
          description: null,
          language: 'TypeScript',
          pushed_at: recent,
          fork: false,
        },
      ],
    }),
  )
  await page.goto('/')
  const activity = page.locator('.github-activity')
  await expect(activity).toContainText('Portfolio')
  await expect(activity).toContainText('2 days ago')
  await expect(activity).toContainText('Live from GitHub')

  const stale = await page.context().newPage()
  await stale.route('https://api.github.com/**', (route) =>
    route.fulfill({
      json: [
        {
          name: 'Old',
          html_url: 'https://github.com/x/Old',
          description: null,
          language: null,
          pushed_at: '2025-01-01T00:00:00Z',
          fork: false,
        },
      ],
    }),
  )
  await stale.goto('/')
  await stale.waitForLoadState('networkidle')
  if (!(await stale.locator('.github-activity').count())) return // stale snapshot and stale live data: hidden
  await expect(stale.locator('.github-activity')).not.toContainText('Old')
})

test('a page whose code fails to load shows a reload prompt, not a blank site', async ({ page }) => {
  await page.route(/\/assets\/HomePage-[\w-]+\.js$/, (route) => route.abort())
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Work' }).click()
  await expect(page.getByRole('heading', { name: "This page didn't load." })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reload the page' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()

  await page.getByRole('link', { name: 'Resume' }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
})

test('a slow page keeps the current page on screen, then lands on the linked section', async ({ page }) => {
  await page.route(/\/assets\/HomePage-[\w-]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/notes')
  await expect(page.locator('.notes-index')).toBeVisible()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.locator('.notes-index')).toBeVisible()
  await expect(page.locator('.page-loading')).toHaveCount(0)

  await expect(page).toHaveURL(/\/#contact$/, { timeout: 5000 })
  await expect(page.locator('#contact')).toBeInViewport()
})

test('if the current page’s code cannot load, the prerendered page stays readable', async ({ page }) => {
  await page.route(/\/assets\/ResumePage-[\w-]+\.js$/, (route) => route.abort())
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav.getByRole('link', { name: 'Notes' })).toHaveAttribute('href', '/notes')
})

test('the first load does not download the SEO data chunk', async ({ page }) => {
  const seoRequests: string[] = []
  page.on('request', (request) => {
    if (/\/assets\/seo-[\w-]+\.js$/.test(request.url())) seoRequests.push(request.url())
  })
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  expect(seoRequests).toEqual([])
})
