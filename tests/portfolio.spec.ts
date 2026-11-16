import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { notes } from '../src/data/notes'
import { flagshipProjects, projects } from '../src/data/projects'
import { caseStudySections } from '../src/lib/caseStudySections'

/** The slug of the project `step` places after (or before, when negative) another in the case-study order. */
const neighbour = (slug: string, step: number) =>
  projects[projects.findIndex((project) => project.slug === slug) + step].slug

/** Starts recording console errors and uncaught page errors; returns the list it fills. */
const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

/** The app's script starts just after the first paint, so wait for React to take over the prerendered page before clicking. */
const hydrated = (page: Page) =>
  page.waitForFunction(() =>
    Object.keys(document.getElementById('root') ?? {}).some((key) => key.startsWith('__reactContainer')),
  )

test('hero states the role and offers two ways to act: the work, and the resume PDF', async ({ page }) => {
  await page.goto('/')
  // The name is the H1, the first and largest thing on the page; the tagline sits under it.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Shervin Babaei.')
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
  // The tagline's "down" is written twice in the markup: once for screen readers, once as animated letters.
  const tagline = page.locator('#hero-title + p')
  await expect(tagline.locator('.sr-only')).toHaveText('down')
  await expect(tagline).toContainText('Full-stack developer who goes')
  await expect(tagline).toContainText('the stack.')
  await expect(page.locator('#home')).toContainText('$ whoami')
  await expect(page.locator('#home')).toContainText('Open to work')
  await expect(page.locator('#home').getByRole('link', { name: /See selected work/ })).toHaveAttribute('href', '/#work')
  await expect(page.locator('#home')).not.toContainText('shervinb22')
  await expect(page.locator('#home').getByRole('link', { name: 'Download resume (PDF)' })).toHaveAttribute(
    'href',
    '/Shervin-Babaei-Resume.pdf',
  )
  // The header's Resume link shows from 960px up; below that it is in the phone menu.
  await page.setViewportSize({ width: 800, height: 900 })
  await expect(page.getByRole('banner').getByRole('link', { name: 'Download resume (PDF)' })).toBeHidden()
  await page.setViewportSize({ width: 1280, height: 800 })
  await expect(page.getByRole('banner').getByRole('link', { name: 'Download resume (PDF)' })).toBeVisible()
  await expect(page.locator('#home > dl dd')).toHaveText([String(projects.length), 'Top 6 of 36', '1,564'])
})

test('the status card shows the live Vancouver time after load, and I toggles inspect mode', async ({ page }) => {
  await page.goto('/')
  await hydrated(page)
  await expect(page.locator('#home time')).toHaveText(/^\d{2}:\d{2}:\d{2}$/)
  const button = page.locator('#home button[aria-pressed]')
  await expect(button).toHaveAttribute('aria-pressed', 'false')
  await page.keyboard.press('i')
  await expect(page.getByRole('status').filter({ hasText: 'Inspect mode' })).toBeVisible()
  await page.locator('#hero-title').hover()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('status').filter({ hasText: 'Inspect mode' })).toHaveCount(0)
  await button.click()
  await expect(button).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Exit · Esc' }).click()
  await expect(button).toHaveAttribute('aria-pressed', 'false')
})

test('pages are prerendered with content, metadata, and a PNG share image', async ({ request }) => {
  const html = await (await request.get('/work/skillmatch')).text()
  expect(html).toMatch(/<h1[^>]*id="case-study-title"[^>]*>SkillMatch<\/h1>/)
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
    '/writeups',
    '/lab',
    '/writeups/sliding-window-rate-limiting',
  ]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})

test('home shows the four flagships in a two-by-two grid and links to the full projects page', async ({ page }) => {
  await page.goto('/')
  const cards = page.locator('#work h3 a')
  await expect(cards).toHaveCount(flagshipProjects.length)
  await expect(cards.first()).toHaveAttribute('href', `/work/${flagshipProjects[0].slug}`)
  // Each card shows its main tools and opens the live app and the code in one click.
  const first = page.locator('#work').getByRole('list', { name: `${flagshipProjects[0].name} main tools` })
  await expect(first.getByRole('listitem')).toHaveCount(Math.min(4, flagshipProjects[0].mainStack.length))
  await expect(page.getByRole('link', { name: `Open the ${flagshipProjects[0].name} live app` })).toHaveAttribute(
    'href',
    flagshipProjects[0].live!,
  )
  await expect(page.getByRole('link', { name: `${flagshipProjects[0].name} source code on GitHub` })).toBeVisible()
  // The game projects are one click away from home.
  await expect(page.locator('#work').getByRole('link', { name: 'Mini RPG Battle' })).toHaveAttribute(
    'href',
    '/work/mini-rpg-battle',
  )
  await page.getByRole('link', { name: `All ${projects.length} projects` }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything')
  await expect(page.locator('[data-project-card]')).toHaveCount(projects.length)
})

test('the About page tells the story, lists the tools, and answers employer questions', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page).toHaveTitle(/^About \|/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('has never been enough for me')
  await expect(page.locator('#story-title ~ *, section h3').filter({ hasText: 'How I debug' }).first()).toBeVisible()
  await expect(page.getByText(`Used in ${projects.length} of ${projects.length} projects`)).toBeVisible()
  await hydrated(page)
  const photos = page.getByRole('group', { name: 'Choose a photo' }).getByRole('button')
  await expect(photos).toHaveCount(3)
  await photos.nth(1).click()
  await expect(photos.nth(1)).toHaveAttribute('aria-pressed', 'true')
  const first = page.getByRole('button', { name: 'Are you available, and where?' })
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'Have you worked with AI?' }).click()
  await expect(first).toHaveAttribute('aria-expanded', 'false')
})

test('on a touch phone the desktop-only features are gone and long pages start with their text', async ({
  browser,
}) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  await page.goto('/')
  await hydrated(page)
  // Inspect mode reads what is under a mouse pointer, so a touch screen gets neither the button nor the shortcut.
  await expect(page.locator('#home button[aria-pressed]')).toBeHidden()
  await page.keyboard.press('i')
  await expect(page.getByRole('status').filter({ hasText: 'Inspect mode' })).toHaveCount(0)
  // The three numbers under the hero sit on one row each, label beside the number.
  const stat = (await page.locator('#home > dl > div').first().boundingBox())!
  expect(stat.height).toBeLessThan(70)

  await page.goto('/writeups/fetching-links-you-dont-trust')
  await hydrated(page)
  const toc = page.getByRole('navigation', { name: 'On this page' })
  const toggle = toc.getByRole('button', { name: /On this page/ })
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toc.getByRole('link').first()).toBeHidden()
  await expect(page.getByRole('region', { name: 'About this writeup' })).toBeHidden()
  await toggle.tap()
  await expect(toc.getByRole('link').first()).toBeVisible()
  await toc.getByRole('link').nth(1).tap()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await context.close()
})

test('home lists three writeups and links to all of them', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#writeups li')).toHaveCount(3)
  await page.getByRole('link', { name: `All ${notes.length} writeups` }).click()
  await expect(page).toHaveURL(/\/writeups$/)
})

test('the header lists Work, Writeups, Lab, About and Contact, and one click flips the theme', async ({ page }) => {
  await page.goto('/')
  const links = page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')
  await expect(links).toHaveText(['Work', 'Writeups', 'Lab', 'About', 'Contact'])
  await hydrated(page)
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
  await expect(page.getByRole('menu')).toHaveCount(0)
})

test('projects with no screenshots show a labelled illustration that loads', async ({ page }) => {
  for (const slug of [
    'discord-ai-bridge',
    'mini-rpg-battle',
    'job-application-tracker',
    'tic-tac-toe-minimax',
    'ollama-rag',
  ]) {
    await page.goto(`/work/${slug}`)
    const media = page.locator('#media')
    await expect(media.getByRole('heading', { name: 'Illustration' })).toBeVisible()
    await expect(media.getByText(/not a real screenshot/)).toBeVisible()
    const image = media.getByRole('img')
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  }
})

test('old /notes links redirect to /writeups in the Vercel config', async () => {
  const { redirects } = JSON.parse(readFileSync('vercel.json', 'utf8'))
  expect(redirects).toContainEqual({ source: '/notes/:slug', destination: '/writeups/:slug', permanent: true })
})

test('case study is a shareable page with team context, code, and trade-off', async ({ page }) => {
  await page.goto('/')
  await page.locator('#work a[href="/work/skillmatch"]').click()
  await expect(page).toHaveURL(/\/work\/skillmatch$/)
  await expect(page).toHaveTitle('SkillMatch case study | Shervin Babaei')
  await expect(page.getByRole('heading', { level: 1, name: 'SkillMatch' })).toBeVisible()
  await expect(page.getByText('105 of 199 commits').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Team repository' })).toHaveAttribute(
    'href',
    'https://github.com/ClaisaZ/IDSP-MarketPlace-FSWD',
  )
  await expect(page.getByRole('heading', { name: 'How a request flows' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The trade-off' })).toBeVisible()
  await expect(page.locator('[data-code-block]')).toContainText("router.post('/:id/attend'")
  const screenshot = page.getByRole('img', { name: /SkillMatch dashboard/ })
  await expect.poll(() => screenshot.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  await page.getByRole('link', { name: /Next/ }).click()
  await expect(page).toHaveURL(new RegExp(`/work/${neighbour('skillmatch', 1)}$`))
  await page.getByRole('navigation', { name: 'breadcrumb' }).getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/\/projects$/)
})

test('the lab is its own page and linked from home', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Open the full lab/ }).click()
  await expect(page).toHaveURL(/\/lab$/)
  await expect(page.getByRole('heading', { level: 1, name: /Break the assumption/ })).toBeVisible()
  await expect(page.locator('[data-limiter-demo]')).toBeVisible()
})

test('case study opens with actions and jump links to its sections', async ({ page }) => {
  await page.goto('/work/skillmatch')
  const live = page.getByRole('link', { name: 'Live project' })
  await expect(live).toHaveAttribute('href', 'https://skillmatch-web.vercel.app/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'The trade-off' }).click()
  await expect(page).toHaveURL(/#tradeoff$/)
  await expect(page.locator('#tradeoff')).toBeInViewport()
})

test('the resume prints on one US Letter page and hides the screen-only toolbar', async ({ page }) => {
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await page.emulateMedia({ media: 'print' })
  const pdf = await page.pdf({ format: 'Letter', preferCSSPageSize: true, printBackground: false })
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []
  expect(pages.length).toBe(1)
  await expect(page.getByRole('link', { name: 'Download PDF' })).toBeHidden()
})

test('the phone menu opens on tap, navigates, and returns focus to its button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const button = page.getByRole('button', { name: 'Open menu' })
  await button.click()
  const nav = page.getByRole('navigation', { name: 'Mobile navigation' })
  await expect(nav).toBeVisible()
  await nav.getByRole('link', { name: 'Resume' }).click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(nav).toBeHidden()
  await button.click()
  await page.keyboard.press('Escape')
  await expect(nav).toBeHidden()
  await expect(button).toBeFocused()
})

test('toasts still appear even though the toast container loads after idle', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Search portfolio' }).click()
  await page.getByRole('option', { name: /Copy email address/i }).click()
  await expect(page.getByText('Email copied')).toBeVisible()
})

// The header also has an "Email" link, so look inside the form.
const contactForm = (page: Page) => page.locator('main form')

/** Fills every contact field with valid values; pass 'topic' to leave the topic unchosen. */
const fillContact = async (page: Page, skip?: 'topic') => {
  await contactForm(page).getByLabel('Name', { exact: true }).fill('Ada Lovelace')
  await contactForm(page).getByLabel('Email', { exact: true }).fill('ada@example.com')
  if (skip !== 'topic') await page.getByRole('radio', { name: 'Job Opportunity' }).click()
  await contactForm(page).getByLabel('Message', { exact: true }).fill('Hello, I would like to talk about a co-op.')
}

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
  })

  test('shows an inline error for every empty field, focuses the first, and sends nothing', async ({ page }) => {
    const requests: string[] = []
    await page.route('**/api/contact', (route) => {
      requests.push(route.request().url())
      return route.fulfill({ json: { ok: true } })
    })
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Enter your name.')).toBeVisible()
    await expect(page.getByText('Enter an email address I can reply to.')).toBeVisible()
    await expect(page.getByText('Choose what this is about.')).toHaveCount(0)
    await expect(page.getByText('Write a short message so I know how to help.')).toBeVisible()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toBeFocused()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toHaveAttribute('aria-invalid', 'true')
    expect(requests).toEqual([])

    // An error goes away as soon as its field is fixed.
    await contactForm(page).getByLabel('Name', { exact: true }).fill('Ada')
    await expect(page.getByText('Enter your name.')).toBeHidden()
  })

  test('starts with the first topic chosen, and the topic pills are radio buttons', async ({ page }) => {
    await expect(page.getByRole('radio', { name: 'Job Opportunity' })).toHaveAttribute('aria-checked', 'true')
    await page.getByRole('radio', { name: 'General Inquiry' }).click()
    await expect(page.getByRole('radio', { name: 'General Inquiry' })).toHaveAttribute('aria-checked', 'true')
    await expect(page.getByRole('radio', { name: 'Job Opportunity' })).toHaveAttribute('aria-checked', 'false')
  })

  test('rejects an email that is not an email address', async ({ page }) => {
    await fillContact(page)
    await contactForm(page).getByLabel('Email', { exact: true }).fill('not-an-email')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText("That email address doesn't look right.")).toBeVisible()
  })

  test('sends the fields, then shows a confirmation with a way to send another', async ({ page }) => {
    let body: Record<string, unknown> = {}
    await page.route('**/api/contact', (route) => {
      body = route.request().postDataJSON()
      return route.fulfill({ json: { ok: true } })
    })
    await fillContact(page)
    await page.getByRole('button', { name: 'Send message' }).click()
    const confirmation = page.getByRole('status').filter({ hasText: 'Message sent' })
    await expect(confirmation).toBeVisible()
    await expect(confirmation).toBeFocused()
    expect(body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      topic: 'Job Opportunity',
      message: 'Hello, I would like to talk about a co-op.',
    })
    await page.getByRole('button', { name: 'Send another message' }).click()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toBeFocused()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toHaveValue('')
  })

  test('keeps what was typed and offers the email address when sending fails', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 502, json: { error: 'Could not send the message.' } }),
    )
    await fillContact(page)
    await page.getByRole('button', { name: 'Send message' }).click()
    const alert = page.getByRole('alert').filter({ hasText: 'Message not sent' })
    await expect(alert).toContainText('Could not send the message.')
    await expect(alert.getByRole('link', { name: 'shervinb22@gmail.com' })).toBeVisible()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toHaveValue('Ada Lovelace')
  })

  test('counts message characters and passes axe with errors showing', async ({ page }) => {
    await contactForm(page).getByLabel('Message', { exact: true }).fill('hello')
    await expect(page.getByText('5 / 5000')).toBeVisible()
    await contactForm(page).getByLabel('Message', { exact: true }).fill('')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Enter your name.')).toBeVisible()
    const results = await new AxeBuilder({ page })
      .include('main form')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(results.violations.map((violation) => `${violation.id} (${violation.nodes.length})`)).toEqual([])
  })
})

test('the search palette explains an empty result', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+k')
  await expect(page.getByRole('dialog', { name: 'Search portfolio' })).toBeVisible()
  await page.keyboard.type('zzzzzz')
  await expect(page.getByText('Nothing matches that.')).toBeVisible()
  await expect(page.getByText(/Try a project name/)).toBeVisible()
})

test('the phone menu button shows it is busy while the menu code is still loading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route(/\/assets\/MobileNavSheet-[\w-]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  // Located without a role: once the menu is open it is modal, which hides the button from the accessibility tree.
  const button = page.locator('button[aria-label="Open menu"]')
  await button.click()
  await expect(button).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible({ timeout: 5000 })
  await expect(button).toHaveAttribute('aria-busy', 'false')
})

test.describe('copy buttons', () => {
  test('copying a code block copies the whole snippet and confirms it', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/work/skillmatch')
    await page.waitForLoadState('networkidle')
    const button = page.getByRole('button', { name: /Copy code from backend\/routes\/workshopRoutes\.js/ })
    await button.click()
    await expect(button).toHaveText('Copied')
    const copied = await page.evaluate(() => navigator.clipboard.readText())
    expect(copied).toContain("router.post('/:id/attend'")
    expect(copied.trimEnd().endsWith('});')).toBe(true)
    // The confirmation fades back to "Copy" on its own.
    await expect(button).toHaveText('Copy', { timeout: 5000 })
  })

  test('when the clipboard is blocked, the code is selected and the button says so', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('blocked')) },
      })
    })
    await page.goto('/work/skillmatch')
    await page.waitForLoadState('networkidle')
    const button = page.getByRole('button', { name: /Copy code from/ })
    await button.click()
    await expect(button).toHaveText('Press Ctrl+C')
    expect(await page.evaluate(() => window.getSelection()?.toString())).toContain("router.post('/:id/attend'")
  })

  test('a case study can copy its own link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/work/skillmatch')
    await page.waitForLoadState('networkidle')
    // The button's name changes with its state (Copy link / Link copied), so match both.
    const button = page.getByRole('button', { name: /link/i })
    await button.click()
    await expect(button).toHaveText('Link copied')
    const link = await page.evaluate(() => navigator.clipboard.readText())
    expect(link).toMatch(/^https:\/\/.+\/work\/skillmatch$/)
    await expect(button).toHaveText('Copy link', { timeout: 5000 })
  })
})

test('a slow page change shows a progress bar, and a fast one does not', async ({ page }) => {
  // The Contact page's code is held until 1.5 s after the Contact link is clicked. A fixed delay from page load would
  // race the background prefetch, which can finish before the click when the steps above are slow.
  let release = () => {}
  const clicked = new Promise<void>((resolve) => (release = resolve))
  await page.route(/\/assets\/ContactPage-[\w-]+\.js$/, async (route) => {
    await clicked
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/writeups')
  // No waiting for the network to go quiet: the delayed contact chunk is already being fetched and would finish first.
  await expect(page.getByRole('heading', { name: /Writeups on things I built/ })).toBeVisible()
  await hydrated(page)
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  const bar = page.locator('[data-nav-progress]')

  // /resume's code is not delayed, so this change is quick and must not flash the bar.
  await hydrated(page)
  await page.getByRole('button', { name: 'Search portfolio' }).click()
  await page.getByRole('option', { name: 'Resume', exact: true }).click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(bar).toHaveCount(0)

  // The Contact page's code takes 1.5 s: the bar appears while we wait, and goes once the page is shown.
  await nav.getByRole('link', { name: 'Contact' }).click()
  release()
  await expect(bar).toBeVisible({ timeout: 1200 })
  await expect(page.getByRole('status').filter({ hasText: 'Loading page' })).toBeAttached()
  await expect(page).toHaveURL(/\/contact$/, { timeout: 5000 })
  await expect(bar).toHaveCount(0)
})

test.describe('typography', () => {
  // Phones get a floor one pixel higher than desktop, because small text is hardest to read there.
  for (const [name, width, minimum] of [
    ['a phone', 390, 13],
    ['desktop', 1440, 12],
  ] as const) {
    test(`no visible text is under ${minimum}px on ${name}, and only the site fonts are used`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const path of ['/', '/about', '/work/skillmatch', '/work/mini-rpg-battle', '/resume', '/writeups', '/lab']) {
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => document.fonts.ready)
        const found = await page.evaluate((min) => {
          const problems: string[] = []
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node.textContent?.trim()
            const element = node.parentElement
            // Skip empty text, hidden elements, and decorative previews (aria-hidden) and screen-reader-only text.
            if (!text || !element || element.closest('[aria-hidden="true"], .sr-only')) continue
            const style = getComputedStyle(element)
            const box = element.getBoundingClientRect()
            if (style.display === 'none' || style.visibility === 'hidden' || box.width === 0 || box.height === 0)
              continue
            const size = parseFloat(style.fontSize)
            const family = style.fontFamily.split(',')[0].replace(/["']/g, '')
            if (size < min) problems.push(`${size}px "${text.slice(0, 30)}"`)
            if (!['Geist Variable', 'Bricolage Grotesque Variable', 'JetBrains Mono Variable'].includes(family))
              problems.push(`font ${family} "${text.slice(0, 30)}"`)
          }
          const loaded = ['Geist Variable', 'Bricolage Grotesque Variable', 'JetBrains Mono Variable'].every((font) =>
            document.fonts.check(`16px "${font}"`),
          )
          return loaded ? problems : [...problems, 'site fonts not loaded']
        }, minimum)
        expect(found, `${path} on ${name}`).toEqual([])
      }
    })
  }
})

test.describe('reading width', () => {
  // Body text is about 740px and the 19px lead line under a case-study title about 780px, so 800px has room.
  // Case studies and writeups are skipped too: case studies run the full width of the page and writeups use a centred column (see the tests below).
  for (const width of [1440, 2560]) {
    test(`long prose stays under 800px wide at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      for (const path of ['/lab', '/how-its-built', '/resume']) {
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        const tooWide = await page.evaluate(() =>
          [...document.querySelectorAll('main p, main li:not(:has(p))')]
            .filter(
              (element) =>
                (element.textContent ?? '').trim().length >= 70 && !element.closest('pre, [aria-hidden="true"]'),
            )
            .map((element) => ({
              width: Math.round(element.getBoundingClientRect().width),
              text: (element.textContent ?? '').trim().slice(0, 30),
            }))
            // Rows of the "more projects" list on the home page are grids, not prose; none appear on these pages.
            .filter((item) => item.width > 800),
        )
        expect(tooWide, `${path} at ${width}px`).toEqual([])
      }
    })
  }
})

test('case study text fills the column up to the rail, with no empty gap between them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/work/skillmatch')
  await page.waitForLoadState('networkidle')
  const rail = (await page.getByRole('navigation', { name: 'On this page' }).boundingBox())!
  for (const id of ['why', 'outcome', 'learned']) {
    const section = (await page.locator(`#${id}`).boundingBox())!
    // The sections are a wide column with the rail to the right of it...
    expect(section.width, `#${id}`).toBeGreaterThan(800)
    expect(rail.x, `#${id}`).toBeGreaterThan(section.x + section.width)
    // ...the paragraph fills that column, and only the normal gutter separates it from the rail.
    const text = (await page.locator(`#${id} p`).first().boundingBox())!
    expect(text.width, `#${id}`).toBeGreaterThan(section.width * 0.95)
    expect(rail.x - (text.x + text.width), `#${id}`).toBeLessThan(80)
  }
})

test('body text lines stay under about 120 characters on case studies and writeups', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const path of ['/work/skillmatch', '/writeups/skillmatch-attend-race-condition']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const longest = await page.evaluate(() => {
      const paragraph = [...document.querySelectorAll('main p')].find(
        (element) => (element.textContent ?? '').length > 260 && element.firstChild?.nodeType === Node.TEXT_NODE,
      )!
      const node = paragraph.firstChild as Text
      const range = document.createRange()
      const lines: number[] = []
      let count = 0
      let top = -1
      for (let index = 0; index < node.length; index++) {
        range.setStart(node, index)
        range.setEnd(node, index + 1)
        const y = Math.round(range.getBoundingClientRect().top)
        if (top === -1) top = y
        if (y !== top) {
          lines.push(count)
          count = 0
          top = y
        }
        count++
      }
      return Math.max(...lines)
    })
    expect(longest, path).toBeLessThanOrEqual(120)
    expect(longest, path).toBeGreaterThanOrEqual(55)
  }
})

test('writeups are centred and their header uses the 940px reading column', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/writeups/skillmatch-attend-race-condition')
  await page.waitForLoadState('networkidle')
  const article = (await page.locator('article').boundingBox())!
  // Centred: the same space on the left and the right.
  const main = (await page.locator('main').boundingBox())! // its width excludes the scrollbar
  expect(Math.abs(article.x - main.x - (main.x + main.width - article.x - article.width))).toBeLessThan(2)
  // The header runs the full width of the page content, and the title is not squeezed into half of it.
  expect(article.width).toBeGreaterThan(1000)
  // The title column is the same 940px reading column as the other page headers.
  const title = (await page.locator('#note-title').boundingBox())!
  expect(Math.round(title.width)).toBe(940)
  // Body paragraphs fill the column up to the rail, which sits to their right.
  const paragraph = (await page.locator('#note-body > p').first().boundingBox())!
  const rail = (await page.getByRole('navigation', { name: 'On this page' }).boundingBox())!
  expect(paragraph.width).toBeGreaterThan(800)
  expect(rail.x - (paragraph.x + paragraph.width)).toBeLessThan(80)
})

test.describe('the end of a page', () => {
  test('case studies and writeups end with the footer contact band only, with no second box above it', async ({
    page,
  }) => {
    for (const path of ['/work/skillmatch', '/writeups/skillmatch-attend-race-condition']) {
      await page.goto(path)
      await expect(page.getByRole('link', { name: /Get in touch/ }), path).toHaveCount(0)
      const band = page.locator('#contact')
      await expect(band.getByRole('heading', { name: /Have an interesting problem/ }), path).toBeVisible()
      await band.getByRole('link', { name: /Send a message/ }).click()
      await expect(page).toHaveURL(/\/contact$/)
    }
  })

  test('the project pager does not wrap around', async ({ page }) => {
    const pager = () => page.getByRole('navigation', { name: 'More case studies' })
    // First project: nothing before it, so the left slot goes back to the work list.
    await page.goto(`/work/${projects[0].slug}`)
    await expect(pager().getByRole('link', { name: /Previous/ })).toHaveCount(0)
    await expect(pager().getByRole('link', { name: /Back to work/ })).toHaveAttribute('href', '/projects')
    await expect(pager().getByRole('link', { name: /Next/ })).toHaveAttribute('href', `/work/${projects[1].slug}`)
    // Last project: nothing after it, so the right slot goes back to the work list.
    await page.goto(`/work/${projects.at(-1)!.slug}`)
    await expect(pager().getByRole('link', { name: /Next/ })).toHaveCount(0)
    await expect(pager().getByRole('link', { name: /Previous/ })).toHaveAttribute(
      'href',
      `/work/${projects.at(-2)!.slug}`,
    )
    await expect(pager().getByRole('link', { name: /Back to work/ })).toHaveAttribute('href', '/projects')
  })
})

test('the case-study header puts the actions beside the title on desktop and below it on a phone', async ({ page }) => {
  const position = async () =>
    page.evaluate(() => {
      const title = document.querySelector('#case-study-title')!.getBoundingClientRect()
      const live = [...document.querySelectorAll('main header a')]
        .find((a) => a.textContent?.includes('Live project'))!
        .getBoundingClientRect()
      return {
        besideTitle: live.left >= title.right - 1 || live.left > title.left + 300,
        below: live.top >= title.bottom - 1,
      }
    })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/work/skillmatch')
  await page.waitForLoadState('networkidle')
  expect((await position()).besideTitle).toBe(true)
  await page.setViewportSize({ width: 390, height: 844 })
  expect((await position()).below).toBe(true)
})

test('a project card shows its category and date on one line on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/projects')
  await page.waitForLoadState('networkidle')
  const wrapped = await page
    .locator('[data-project-card] [data-card-meta]')
    // One line of 13px mono text plus its padding is about 32px; a wrapped label would be twice that.
    .evaluateAll((els) => els.filter((el) => el.getBoundingClientRect().height > 40).length)
  expect(wrapped).toBe(0)
})

test('terminal projects show a recorded session', async ({ page }) => {
  await page.goto('/work/mini-rpg-battle')
  await expect(page.locator('[data-terminal-block]')).toContainText('Victory! Survived 10 rounds.')
})

test('unknown routes show a 404 page', async ({ page }) => {
  await page.goto('/work/does-not-exist')
  await expect(page.getByRole('heading', { name: "This page doesn't exist." })).toBeVisible()
})

test('theme is light by default and remembers a manual choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto('/')
  // Wait for hydration, otherwise the first click can land before the button has its handler.
  await page.waitForLoadState('networkidle')
  const isDark = () => page.evaluate(() => document.documentElement.dataset.theme === 'dark')
  expect(await isDark()).toBe(false)

  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  // The switch is a cross-fade, so the class changes a frame after the click.
  await expect.poll(isDark).toBe(true)
  await page.reload()
  await page.waitForLoadState('networkidle')
  expect(await isDark()).toBe(true)

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await expect.poll(isDark).toBe(false)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('color-scheme'))).toBe('light')
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
      '/writeups/skillmatch-attend-race-condition',
      '/writeups/fetching-links-you-dont-trust',
      '/writeups/stopping-an-ai-from-inventing-facts',
      '/writeups/sign-in-behind-a-proxy',
    ]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0)
      // The page shell clips overflow, so also check that no text block is cut off at the edge.
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
      '/about',
      '/work/skillmatch',
      '/work/thinkboard',
      '/work/mini-rpg-battle',
      '/resume',
      '/how-its-built',
      '/projects',
      '/writeups',
      '/lab',
      '/writeups/skillmatch-attend-race-condition',
      '/writeups/fetching-links-you-dont-trust',
      '/writeups/stopping-an-ai-from-inventing-facts',
      '/writeups/sign-in-behind-a-proxy',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
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
  // The preloads sit in the inline loader that starts the app after the first paint, so look for the file names.
  const resume = await (await request.get('/resume')).text()
  expect(resume).toMatch(/\/assets\/ResumePage-/)
  expect(resume).not.toMatch(/\/assets\/(CaseStudyPage|HomePage)-/)
  const caseStudy = await (await request.get('/work/thinkboard')).text()
  expect(caseStudy).toMatch(/\/assets\/CaseStudyPage-/)
  expect(caseStudy).not.toMatch(/\/assets\/(ResumePage|HomePage)-/)
})

test('fonts: the three Latin variable fonts are preloaded and no other font file ships', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const preloads = html.match(/rel="preload" as="font"[^>]+/g) ?? []
  expect(preloads).toHaveLength(3)
  for (const font of ['geist-latin-wght', 'bricolage-grotesque-latin-opsz', 'jetbrains-mono-latin-wght'])
    expect(html).toMatch(font)
  const css = await (await request.get(html.match(/\/assets\/index-[\w-]+\.css/)![0])).text()
  expect(css.match(/\.woff2/g)).toHaveLength(3)
})

test('large screenshots offer a small copy and reserve their space', async ({ page }) => {
  await page.goto('/work/thinkboard')
  const image = page.getByRole('img', { name: /ThinkBoard dark notes dashboard/ })
  await expect(image).toHaveAttribute('srcset', /thinkboard-screen-1-480\.webp 480w/)
  await expect(image).toHaveAttribute('width', '1000')
  await expect(image).toHaveAttribute('height', /\d+/)
})

test('rate-limiter demo: a burst hits 429, and per-visitor keys isolate the other visitor', async ({ page }) => {
  // The limiter's 10-second windows line up with the real clock, so a burst near the end of a window could spill
  // into the next one. Start the page's clock half a second into a window, which leaves plenty of time for the test.
  await page.clock.install({ time: new Date('2026-01-01T00:00:00.500Z') })
  await page.goto('/work/thinkboard')
  await hydrated(page)
  const demo = page.locator('[data-limiter-demo]')
  // The burst sends 15 requests 70 ms apart; run the clock past the last one so none lands after the next click.
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await page.clock.runFor(1100)
  await expect(demo.locator('[data-limiter-log] li[data-limited]').first()).toBeVisible({ timeout: 5000 })
  await expect(demo.getByRole('meter').first()).toHaveAttribute('aria-valuenow', '10')

  // Shared key: the other visitor is blocked by your burst.
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('Another visitor')
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('429')

  // Per-visitor keys: the same burst no longer affects them.
  await demo.getByLabel(/One key per visitor/).check()
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await page.clock.runFor(1100)
  await expect(demo.locator('[data-limiter-log] li[data-limited]').first()).toBeVisible({ timeout: 5000 })
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('200 OK')
})

test('writeups: listed on the writeups page, own pages, linked from case studies', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: `All ${notes.length} writeups` }).click()
  await expect(page).toHaveURL(/\/writeups$/)
  await expect(page.locator('main li').filter({ has: page.locator('a[href^="/writeups/"]') })).toHaveCount(notes.length)
  await page
    .getByRole('link', { name: /The race condition in SkillMatch/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/writeups\/skillmatch-attend-race-condition$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('race condition')
  await expect(page.locator('article code').first()).toBeVisible()
  await page.getByRole('link', { name: /Case study/ }).click()
  await expect(page).toHaveURL(/\/work\/skillmatch$/)
  await expect(page.getByRole('link', { name: /Read the writeup/ })).toHaveAttribute(
    'href',
    '/writeups/skillmatch-attend-race-condition',
  )
})

test('a case study opens with what it is, and the screenshots come after how it works', async ({ page }) => {
  await page.goto('/work/skillmatch')
  const y = async (locator: ReturnType<typeof page.locator>) => (await locator.boundingBox())!.y
  const what = await y(page.getByRole('heading', { name: 'What it is' }))
  const flow = await y(page.getByRole('heading', { name: 'How a request flows' }))
  const works = await y(page.getByRole('heading', { name: 'How it works' }))
  const media = await y(page.locator('#media'))
  const why = await y(page.locator('#why'))
  expect(what).toBeLessThan(flow)
  expect(works).toBeLessThan(media)
  expect(media).toBeLessThan(why)
  const copy = (await page.getByRole('button', { name: 'Copy link' }).boundingBox())!
  const writeup = (await page.getByRole('link', { name: /Read the writeup/ }).boundingBox())!
  // Copy link is the least important action, so it comes last.
  expect(copy.y).toBeGreaterThanOrEqual(writeup.y)
})

test('every case study lists a table-of-contents entry for each of its sections, and the reverse', async ({
  request,
}) => {
  for (const project of projects) {
    const html = await (await request.get(`/work/${project.slug}`)).text()
    const sections = caseStudySections(project)
    for (const { id } of sections) {
      expect(html, `${project.slug} section #${id}`).toContain(`id="${id}"`)
      expect(html, `${project.slug} contents link #${id}`).toContain(`href="#${id}"`)
    }
    // Nothing is rendered that the list does not know about.
    const rendered = [
      'what',
      'does',
      'works',
      'media',
      'why',
      'built',
      'code',
      'run',
      'outcome',
      'tradeoff',
      'learned',
      'next',
    ]
    const present = rendered.filter((id) => html.includes(`<section id="${id}"`))
    expect(present.sort(), project.slug).toEqual(sections.map((section) => section.id).sort())
  }
})

test('the writeup button spans the same row as the live project button on wide screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/work/signaldesk')
  const live = (await page.getByRole('link', { name: /Live project/ }).boundingBox())!
  const writeup = (await page.getByRole('link', { name: /Read the writeup/ }).boundingBox())!
  expect(Math.abs(writeup.width - live.width)).toBeLessThan(2)
})

test('the projects page lists the first project first', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.locator('[data-project-card]').first()).toContainText(projects[0].name)
})

test('a project with several writeups links to the list filtered to it', async ({ page }) => {
  await page.goto('/work/network-growth-assistant')
  await page.getByRole('link', { name: /Read the writeups/ }).click()
  await expect(page).toHaveURL(/\/writeups\?project=network-growth-assistant$/)
  await expect(page.locator('main li a[href^="/writeups/"]')).toHaveCount(2)
})

test('a page whose code fails to load shows a reload prompt, not a blank site', async ({ page }) => {
  await page.route(/\/assets\/ContactPage-[\w-]+\.js$/, (route) => route.abort())
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { name: "This page didn't load." })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reload the page' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()

  await page.getByRole('button', { name: 'Search portfolio' }).click()
  await page.getByRole('option', { name: 'Resume', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
})

test('a slow page keeps the current page on screen, then shows the new one', async ({ page }) => {
  // The Contact page’s code is held until 1.5 s after the click, so the background prefetch cannot finish first.
  let release = () => {}
  const clicked = new Promise<void>((resolve) => (release = resolve))
  await page.route(/\/assets\/ContactPage-[\w-]+\.js$/, async (route) => {
    await clicked
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/writeups')
  await expect(page.getByRole('heading', { name: /Writeups on things I built/ })).toBeVisible()
  await hydrated(page)
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).click()
  release()
  await expect(page.getByRole('heading', { name: /Writeups on things I built/ })).toBeVisible()
  await expect(page.locator('[aria-label="Loading page"]')).toHaveCount(0)

  await expect(page).toHaveURL(/\/contact$/, { timeout: 5000 })
  await expect(page.getByRole('heading', { level: 1, name: /Have an interesting problem/ })).toBeVisible()
})

test('if the current page’s code cannot load, the prerendered page stays readable', async ({ page }) => {
  await page.route(/\/assets\/ResumePage-[\w-]+\.js$/, (route) => route.abort())
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/projects')
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

test('Ctrl+K opens the search palette and jumps to a project', async ({ page }) => {
  await page.goto('/')
  // Wait for hydration so the key listener is attached.
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Search portfolio' })
  await expect(dialog).toBeVisible()
  await page.keyboard.type('ThinkBoard')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/work\/thinkboard$/)
})

test('screenshots are served as AVIF to browsers that support it', async ({ page }) => {
  await page.goto('/work/thinkboard')
  const source = page.locator('picture source[type="image/avif"]').first()
  await expect(source).toHaveAttribute('srcset', /thinkboard-screen-1(-480)?\.avif/)
  const avif = await page.request.get('/projects/thinkboard-screen-1.avif')
  expect(avif.status()).toBe(200)
  expect(avif.headers()['content-type']).toContain('image/avif')
})

test('printing the resume uses navy headings on white, even when the dark theme is on screen', async ({ browser }) => {
  const context = await browser.newContext()
  await context.addInitScript(() => localStorage.setItem('color-scheme', 'dark'))
  const page = await context.newPage()
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await page.emulateMedia({ media: 'print' })
  // The page fades colours over 250ms when the theme changes, so wait for it to settle.
  await expect
    .poll(() =>
      page.evaluate(() => ({
        heading: getComputedStyle(document.querySelector('h1')!).color,
        page: getComputedStyle(document.documentElement).backgroundColor,
      })),
    )
    .toEqual({ heading: 'rgb(27, 58, 107)', page: 'rgb(255, 255, 255)' })
  await context.close()
})

test('a page whose code 404s once recovers with an automatic reload', async ({ page }) => {
  let requests = 0
  await page.route(/\/assets\/ResumePage-[\w-]+\.js$/, (route) => {
    requests += 1
    // The browser reuses the failed preload for the import, so one page load makes one request.
    return requests === 1 ? route.fulfill({ status: 404, body: 'Not found' }) : route.continue()
  })
  await page.goto('/resume')
  // Wait for the reload's request, then for the reloaded page to settle.
  await expect.poll(() => requests).toBeGreaterThanOrEqual(2)
  await page.waitForLoadState('networkidle')
  // Only a hydrated page can flip the theme, so this proves the reload fixed it.
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()
  expect(requests).toBe(2)
})

test('a missing page file reloads at most once instead of looping', async ({ page }) => {
  let requests = 0
  await page.route(/\/assets\/ResumePage-[\w-]+\.js$/, (route) => {
    requests += 1
    return route.fulfill({ status: 404, body: 'Not found' })
  })
  await page.goto('/resume')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  await expect(page.getByRole('heading', { level: 1, name: 'Shervin Babaei' })).toBeVisible()
  // The original load plus one reload; a loop would keep growing this.
  expect(requests).toBe(2)
})

test('clicking a screenshot opens a viewer on the same page with every screenshot to click through', async ({
  page,
}) => {
  let popups = 0
  page.on('popup', () => (popups += 1))
  const shots = projects.find((project) => project.slug === 'skillmatch')!.screenshots!.length
  await page.goto('/work/skillmatch')
  await page.waitForLoadState('networkidle')
  await page
    .getByRole('button', { name: /Enlarge screenshot/ })
    .first()
    .click()

  const viewer = page.getByRole('dialog')
  await expect(viewer).toBeVisible()
  await expect(page).toHaveURL(/\/work\/skillmatch$/)
  expect(popups).toBe(0)
  await expect(viewer.getByRole('list', { name: 'All screenshots' }).getByRole('button')).toHaveCount(shots)
  await expect(viewer.getByText(new RegExp(`^1 of ${shots}`))).toBeVisible()

  // The magnifier: buttons, a percentage, and keys. Zoom out and fit are disabled until the picture is magnified.
  const readout = viewer.getByRole('status')
  await expect(readout).toHaveText('100%')
  await expect(viewer.getByRole('button', { name: 'Zoom out' })).toBeDisabled()
  await viewer.getByRole('button', { name: 'Zoom in' }).click()
  await expect(readout).not.toHaveText('100%')
  await expect(viewer.getByRole('button', { name: 'Zoom out' })).toBeEnabled()
  await viewer.getByRole('button', { name: 'Fit to window' }).click()
  await expect(readout).toHaveText('100%')
  await page.keyboard.press('+')
  await expect(readout).not.toHaveText('100%')
  await page.keyboard.press('0')
  await expect(readout).toHaveText('100%')

  await viewer.getByRole('button', { name: /Show screenshot 2/ }).click()
  await expect(viewer.getByText(new RegExp(`^2 of ${shots}`))).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(viewer.getByText(new RegExp(`^3 of ${shots}`))).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(viewer).toBeHidden()
})

test('form field outlines are at least 3:1 against the page and the card, in light and dark', async ({ browser }) => {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext()
    await context.addInitScript((value) => localStorage.setItem('color-scheme', value), theme)
    const page = await context.newPage()
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    const ratios = await page.evaluate(() => {
      const rgb = (value: string) => (value.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number)
      const luminance = (value: string) => {
        const [r, g, b] = rgb(value).map((channel) => {
          const v = channel / 255
          return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const ratio = (a: string, b: string) => {
        const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
        return (hi + 0.05) / (lo + 0.05)
      }
      // Resolve a token to an rgb() string by painting it on a probe element.
      const resolve = (token: string) => {
        const probe = document.createElement('span')
        probe.style.color = `var(${token})`
        document.body.append(probe)
        const color = getComputedStyle(probe).color
        probe.remove()
        return color
      }
      const field = document.querySelector('#contact-email') as HTMLElement
      const border = getComputedStyle(field).borderTopColor
      // The fields sit on the page colour inside the tinted form card, so check against both.
      return { page: ratio(border, resolve('--background')), card: ratio(border, resolve('--color-surface-hover')) }
    })
    expect(ratios.page, `${theme} against the page`).toBeGreaterThanOrEqual(3)
    expect(ratios.card, `${theme} against a card`).toBeGreaterThanOrEqual(3)
    await context.close()
  }
})

test('the contact form checks a field when you leave it, but stays quiet about empty ones', async ({ page }) => {
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
  const email = page.locator('#contact-email')
  await email.focus()
  await page.locator('#contact-name').focus()
  await expect(page.locator('#contact-email-error')).toHaveCount(0)
  await email.fill('not-an-email')
  await page.locator('#contact-name').focus()
  await expect(page.locator('#contact-email-error')).toHaveText("That email address doesn't look right.")
  await email.fill('me@company.com')
  await expect(page.locator('#contact-email-error')).toHaveCount(0)
})

test('a case study leads with its outcome, then its scope', async ({ page }) => {
  await page.goto('/work/signaldesk')
  const facts = page.getByLabel('At a glance')
  const labels = await facts.locator('dt').allInnerTexts()
  expect(labels.slice(0, 2)).toEqual(['OUTCOME', 'SCOPE'])
  await expect(facts.locator('dd').first()).toContainText('Built solo in nine days')
})

test('the 404 page and the resume page offer a way onward', async ({ page }) => {
  await page.goto('/no-such-page')
  const onward = page.getByRole('navigation', { name: 'Where to go instead' })
  await expect(onward.getByRole('link')).toHaveCount(4)
  await expect(onward.getByRole('link', { name: 'Read the writeups' })).toHaveAttribute('href', '/writeups')

  await page.goto('/resume')
  await expect(page.getByRole('link', { name: 'See the work behind it' })).toHaveAttribute('href', '/projects')
})

test('a case study states its key result in plain words', async ({ page }) => {
  await page.goto('/work/skillmatch')
  const glance = page.getByLabel('At a glance')
  await expect(glance).toContainText('I made 105 of the team’s 199 commits')
})

test('Work is marked as the current page on the projects page and on a case study', async ({ page }) => {
  for (const path of ['/projects', '/work/skillmatch']) {
    await page.goto(path)
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page')
  }
})

test('the old left-hand trace rail is gone', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: /trace/i })).toHaveCount(0)
})

test('the header marks the section you are reading and shows scroll progress', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  const progress = page.locator('header [data-slot="progress"]')

  await expect(nav.locator('[aria-current]')).toHaveCount(0)
  await expect(progress).toHaveAttribute('data-progress', '0')

  await page.evaluate(() => document.getElementById('about')!.scrollIntoView())
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location')
  expect(Number(await progress.getAttribute('data-progress'))).toBeGreaterThan(0)

  await page.evaluate(() => document.getElementById('contact')!.scrollIntoView())
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'location')
  await expect(nav.getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current', /.*/)

  await page.goto('/resume')
  await hydrated(page)
  await expect(nav.locator('[aria-current]')).toHaveCount(0)
})

test('canonical, og:url and share images use the custom domain', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('<link rel="canonical" href="https://shervin-babaei.me/"')
  expect(html).toContain('<meta property="og:url" content="https://shervin-babaei.me/"')
  expect(html).toContain('<meta property="og:image" content="https://shervin-babaei.me/og/home.png"')
  expect(html).toContain('<meta name="twitter:image" content="https://shervin-babaei.me/og/home.png"')
  expect(html).not.toContain('shervinbabaei.vercel.app')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('<loc>https://shervin-babaei.me/</loc>')
  expect(sitemap).not.toContain('shervinbabaei.vercel.app')
})

test('reduced motion: no infinite animations keep running on the home page', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const running = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations === Infinity)
      .map((animation) => animation.id || 'unnamed'),
  )
  expect(running).toEqual([])
})

test('projects page filters by type', async ({ page }) => {
  await page.goto('/projects')
  // Wait for hydration, otherwise the click can land before React attaches its handlers.
  await page.waitForLoadState('networkidle')
  const cards = page.locator('[data-project-card]')
  await expect(cards).toHaveCount(projects.length)
  // The two game projects come straight after the flagships.
  await expect(cards.nth(flagshipProjects.length).locator('h2')).toHaveText('Mini RPG Battle')
  await expect(cards.nth(flagshipProjects.length + 1).locator('h2')).toHaveText('Tic-Tac-Toe Minimax AI')
  await page.getByRole('button', { name: /^Hackathon/ }).click()
  await expect(page.getByRole('button', { name: /^Hackathon/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(cards).toHaveCount(projects.filter((project) => project.category === 'Hackathon').length)
  await page.getByRole('button', { name: /^All/ }).click()
  await expect(cards).toHaveCount(projects.length)
  // Cards without a screenshot show a short code preview instead.
  await expect(page.locator('[data-project-card]').filter({ hasText: 'Mini RPG Battle' })).toContainText(
    "WARRIOR'S PATH",
  )
  await expect(page.getByRole('link', { name: /More on GitHub/ })).toHaveAttribute('href', /github\.com/)
})

test('writeups are listed newest first, grouped by month, with totals at the top', async ({ page }) => {
  await page.goto('/writeups')
  await expect(page.locator('main')).toContainText(`${notes.length} writeups`)
  const cards = page.locator('main li a[href^="/writeups/"]')
  await expect(cards).toHaveCount(notes.length)
  await expect(cards.first()).toHaveAttribute('href', `/writeups/${notes[0].slug}`)
  const months = await page.locator('main section h2').allInnerTexts()
  expect(months.length).toBeGreaterThan(0)
  expect(months.every((month) => /^[A-Z][a-z]+ \d{4}$/.test(month))).toBe(true)
})

test('the Contact page has every way to reach me and the form', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByRole('heading', { level: 1, name: /Have an interesting problem/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Connect professionally/ })).toHaveAttribute('href', /linkedin/)
  await expect(page.getByRole('heading', { name: 'Send a message' })).toBeVisible()
  // The Contact page is already the question, so its footer is only the bottom row.
  await expect(page.locator('#contact-title')).toHaveCount(0)
})

test('each new writeup opens and is linked from its project page', async ({ page }) => {
  const pairs = [
    ['network-growth-assistant', 'fetching-links-you-dont-trust'],
    ['network-growth-assistant', 'stopping-an-ai-from-inventing-facts'],
    ['linklocker', 'sign-in-behind-a-proxy'],
  ]
  for (const [project, note] of pairs) {
    // The project page's writeup button opens the writeup, or the project's filtered list when it has several.
    await page.goto(`/work/${project}`)
    await page.getByRole('link', { name: /Read the writeup/ }).click()
    await expect(page).toHaveURL(/\/writeups/)
    if (!page.url().endsWith(`/writeups/${note}`)) {
      await expect(page.locator(`a[href="/writeups/${note}"]`).first()).toBeVisible()
    }
    await page.goto(`/writeups/${note}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.locator('pre').count()).toBeGreaterThan(0)
  }
})

test('writeups have a table of contents that jumps to a heading', async ({ page }) => {
  await page.goto('/writeups/skillmatch-attend-race-condition')
  const toc = page.getByRole('navigation', { name: 'On this page' })
  await expect(toc).toBeVisible()
  await toc.getByRole('link').nth(1).click()
  await expect(page).toHaveURL(/#.+/)
  await expect(page.locator(page.url().slice(page.url().indexOf('#')))).toBeInViewport()
  await expect(page.getByRole('button', { name: /Copy link/ })).toBeVisible()
})

test('back to top appears after scrolling and returns to the top', async ({ page }) => {
  await page.goto('/')
  await hydrated(page)
  const button = page.getByRole('button', { name: 'Back to top', includeHidden: true })
  await expect(button).toHaveAttribute('aria-hidden', 'true')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(button).toHaveAttribute('aria-hidden', 'false')
  await button.click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
})

test('inner page headings use the design’s column: 820px for the title, 560px for the lead', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const [path, id] of [
    ['/writeups', 'writeups-index-title'],
    ['/projects', 'projects-title'],
  ]) {
    await page.goto(path)
    const title = (await page.locator(`#${id}`).boundingBox())!
    const lead = (await page.locator(`#${id} + p`).boundingBox())!
    expect(Math.round(title.width), path).toBe(820)
    expect(Math.round(lead.width), path).toBe(560)
  }
})

test('each project shows only its few main tools, all of which are in the full stack', () => {
  for (const project of projects) {
    expect(project.mainStack.length, project.slug).toBeLessThanOrEqual(6)
    expect(project.mainStack.length, project.slug).toBeGreaterThanOrEqual(Math.min(4, project.stack.length))
    for (const item of project.mainStack) expect(project.stack, `${project.slug}: ${item}`).toContain(item)
  }
})

test('the resume PDF is one click away on wide screens: in the header and in the contact section', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: 'Download resume (PDF)' })).toHaveAttribute(
    'href',
    '/Shervin-Babaei-Resume.pdf',
  )
  await expect(page.locator('#contact').getByRole('link', { name: /Resume/ })).toHaveAttribute(
    'href',
    '/Shervin-Babaei-Resume.pdf',
  )
  const response = await page.request.get('/Shervin-Babaei-Resume.pdf')
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('pdf')
})

test('the home sections run work, writeups, lab, about, contact', async ({ page }) => {
  await page.goto('/')
  const ids = await page.locator('section[id]').evaluateAll((els) => els.map((el) => el.id))
  expect(ids).toEqual(['home', 'work', 'writeups', 'lab', 'about', 'contact'])
})

test('on a phone every project card on the projects page fits inside the screen', async ({ page }) => {
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    const rights = await page
      .locator('[data-project-card]')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().right)))
    expect(rights.length).toBeGreaterThan(0)
    for (const right of rights) expect(right, `${width}px`).toBeLessThanOrEqual(width)
  }
})

test('the commit history card shows merged PRs and active days, with no streak', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('[data-github]')
  await expect(card.getByText('PRs merged', { exact: true })).toBeVisible()
  await expect(card.getByText('Active days', { exact: true })).toBeVisible()
  await expect(card.getByText('Longest streak')).toHaveCount(0)
})

const searchResult = (message: string, date: string, count = 1, repo = 'ShervinBabaei2007/Portfolio') => ({
  total_count: count,
  items: Array.from({ length: count }, (_, index) => ({
    sha: `abc${String(index).padStart(4, '0')}def`,
    commit: { message, author: { date } },
    repository: { full_name: repo, private: false },
  })),
})

test('GitHub activity shows live recent commits, and hides itself when nothing is recent', async ({ page }) => {
  const recent = new Date(Date.now() - 2 * 86_400_000).toISOString()
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ json: searchResult('feat: live commit from the mock', recent) }),
  )
  await page.goto('/')
  const activity = page.locator('[data-github]')
  await expect(activity).toContainText('feat: live commit from the mock')
  await expect(activity).toContainText('2 days ago')
  await expect(activity).toContainText('Live from GitHub')
  // The year grid stays folded until asked for.
  await expect(activity.locator('[data-heatmap]')).toHaveCount(0)
  await activity.getByRole('button', { name: 'Show full history' }).click()
  await expect(activity.locator('[data-heatmap]')).toBeVisible()

  const stale = await page.context().newPage()
  await stale.route('https://api.github.com/**', (route) =>
    route.fulfill({ json: searchResult('chore: old commit', '2025-01-01T00:00:00Z') }),
  )
  await stale.goto('/')
  await stale.waitForLoadState('networkidle')
  if (!(await stale.locator('[data-github]').count())) return // stale snapshot and stale live data: hidden
  await expect(stale.locator('[data-github]')).not.toContainText('old commit')
})

test('the recent work list skips commits to this site, but the day view still shows them', async ({ page }) => {
  const recent = new Date(Date.now() - 2 * 86_400_000).toISOString()
  // A full page (100) so the live commits win over the snapshot for that day.
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      json: searchResult('chore: site-only commit', recent, 100, 'ShervinBabaei2007/Shervin-Portfolio'),
    }),
  )
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const activity = page.locator('[data-github]')
  await expect(activity).toContainText('Live from GitHub')
  const panel = activity.locator('[data-commit-panel]')
  await expect(panel).not.toContainText('chore: site-only commit')
  await expect(panel).toContainText('Nothing recent outside this site')

  await activity.getByRole('button', { name: 'Show full history' }).click()
  await activity.locator(`[data-heatmap] [data-day="${recent.slice(0, 10)}"]`).click()
  await expect(panel).toContainText('chore: site-only commit')
})

test('commit history keeps the full-year totals when the live request adds the newest commits', async ({ page }) => {
  const recent = new Date(Date.now() - 2 * 86_400_000).toISOString()
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ json: searchResult('feat: mock', recent, 100) }),
  )
  await page.goto('/')
  const activity = page.locator('[data-github]')
  await expect(activity).toContainText('Live from GitHub')
  const commits = activity.locator('dl > div').first().locator('dd')
  await expect.poll(async () => Number((await commits.innerText()).replace(/[,+]/g, ''))).toBeGreaterThan(100)
})

test('commit history: select a day to list its commits, then go back to the latest', async ({ page }) => {
  const recent = new Date(Date.now() - 2 * 86_400_000).toISOString()
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({ json: searchResult('feat: mock', recent, 100) }),
  )
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const activity = page.locator('[data-github]')
  await expect(activity.getByRole('heading', { name: 'Recent work' })).toBeVisible()

  await activity.getByRole('button', { name: 'Show full history' }).click()
  const days = activity.locator('[data-heatmap] [data-day]')
  expect(await days.count()).toBeGreaterThan(10)
  await days.nth(3).click()
  await expect(days.nth(3)).toHaveAttribute('data-selected', 'true')
  await expect(activity.getByRole('heading', { name: /^Commits on / })).toBeVisible()
  await expect(activity.getByRole('heading', { name: 'Recent work' })).toHaveCount(0)
  const links = activity.locator('[data-commit-panel] li a')
  expect(await links.count()).toBeGreaterThan(0)
  await expect(links.first()).toHaveAttribute('href', /^https:\/\/github\.com\/.+\/commit\/[0-9a-f]{7}$/)

  await activity.getByRole('button', { name: 'Show latest commits' }).click()
  await expect(activity.getByRole('heading', { name: 'Recent work' })).toBeVisible()
  await expect(days.nth(3)).toHaveAttribute('data-selected', 'false')

  // The same thing from the keyboard-friendly menu.
  const menu = activity.getByLabel('Show commits for')
  await menu.selectOption({ index: 2 })
  await expect(activity.getByRole('heading', { name: /^Commits on / })).toBeVisible()
  await menu.selectOption('')
  await expect(activity.getByRole('heading', { name: 'Recent work' })).toBeVisible()
  // The cells are a pointer shortcut and are not in the tab order.
  await expect(activity.locator('[data-heatmap] button')).toHaveCount(0)
})

test('a visitor who scrolls before the page hydrates stays where they scrolled', async ({ page }) => {
  // Hold the app's code back so the scroll happens on the prerendered page, as on a slow phone.
  await page.route(/\/assets\/index-[\w-]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    await route.continue()
  })
  await page.goto('/work/skillmatch')
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }))
  await hydrated(page)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(1500)
})
