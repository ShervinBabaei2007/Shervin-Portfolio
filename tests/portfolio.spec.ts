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

test('hero states the role, links to the resume, and shows no stats or email', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Full-stack developer')
  await expect(page.getByRole('link', { name: 'View resume' }).first()).toHaveAttribute('href', '/resume')
  await expect(page.getByRole('list', { name: 'Highlights' })).toHaveCount(0)
  await expect(page.locator('#home')).not.toContainText('shervinb22')
  await expect(page.locator('#home').getByRole('link', { name: /Top 6 of 36 teams/ })).toHaveAttribute(
    'href',
    '/work/gitscribe',
  )
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
    '/notes',
    '/lab',
    '/notes/sliding-window-rate-limiting',
  ]) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
  }
  expect(errors).toEqual([])
})

test('home shows four flagships and a compact list for the rest', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-slot="carousel"] [data-project-card]')).toHaveCount(4)
  await expect(page.locator('#work ul li').filter({ has: page.locator('a[href^="/work/"]') })).toHaveCount(4)
  await expect(page.getByText('Illustrative interface preview')).toHaveCount(0)
})

test('case study is a shareable page with team context, code, and trade-off', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'SkillMatch case study' }).click()
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
  await expect(page).toHaveURL(/\/work\/gitscribe$/)
  await page.getByRole('navigation', { name: 'breadcrumb' }).getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/\/#work$/)
})

test('the lab is its own page and linked from home', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Try the rate-limiter lab/ }).click()
  await expect(page).toHaveURL(/\/lab$/)
  await expect(page.getByRole('heading', { level: 1, name: /Break the assumption/ })).toBeVisible()
  await expect(page.locator('[data-limiter-demo]')).toBeVisible()
})

test('case study opens with actions and jump links to its sections', async ({ page }) => {
  await page.goto('/work/skillmatch')
  const live = page.getByRole('link', { name: 'Live project' })
  await expect(live).toHaveAttribute('href', 'https://skillmatch-web.vercel.app/')
  await expect(live).toHaveAttribute('data-slot', 'button')
  await page.waitForLoadState('networkidle')
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'The trade-off' }).click()
  await expect(page).toHaveURL(/#tradeoff$/)
  await expect(page.locator('#tradeoff')).toBeInViewport()
})

test('the resume prints to one US Letter page and hides the screen-only toolbar', async ({ page }) => {
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
const contactForm = (page: Page) => page.locator('#contact form')

const fillContact = async (page: Page, skip?: 'topic') => {
  await contactForm(page).getByLabel('Name', { exact: true }).fill('Ada Lovelace')
  await contactForm(page).getByLabel('Email', { exact: true }).fill('ada@example.com')
  if (skip !== 'topic') await page.getByRole('radio', { name: 'Job Opportunity' }).click()
  await contactForm(page).getByLabel('Message', { exact: true }).fill('Hello, I would like to talk about a co-op.')
}

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
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
    await expect(page.getByText('Choose what this is about.')).toBeVisible()
    await expect(page.getByText('Write a short message so I know how to help.')).toBeVisible()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toBeFocused()
    await expect(contactForm(page).getByLabel('Name', { exact: true })).toHaveAttribute('aria-invalid', 'true')
    expect(requests).toEqual([])

    // An error goes away as soon as its field is fixed.
    await contactForm(page).getByLabel('Name', { exact: true }).fill('Ada')
    await expect(page.getByText('Enter your name.')).toBeHidden()
  })

  test('asks for a topic next to the topic field, not in a toast', async ({ page }) => {
    await fillContact(page, 'topic')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Choose what this is about.')).toBeVisible()
    await expect(page.getByText('Pick a topic first')).toHaveCount(0)
    await expect(page.getByRole('radio', { name: 'Job Opportunity' })).toBeFocused()
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
      .include('#contact')
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

test('Quick look shows it is busy while its panel is still loading', async ({ page }) => {
  await page.route(/\/assets\/CaseStudySheet-[\w-]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const button = page.locator('button', { hasText: 'Quick look' }).first()
  await button.click()
  await expect(button).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
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
  await page.route(/\/assets\/HomePage-[\w-]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })
  await page.goto('/notes')
  // No waiting for the network to go quiet: the delayed home chunk is already being fetched and would finish first.
  await expect(page.getByRole('heading', { name: /Notes on things I built/ })).toBeVisible()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  const bar = page.locator('[data-nav-progress]')

  // /resume's code is not delayed, so this change is quick and must not flash the bar.
  await nav.getByRole('link', { name: 'Resume' }).click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(bar).toHaveCount(0)

  // The home page's code takes 1.5 s: the bar appears while we wait, and goes once the page is shown.
  await nav.getByRole('link', { name: 'Contact' }).click()
  await expect(bar).toBeVisible({ timeout: 1200 })
  await expect(page.getByRole('status').filter({ hasText: 'Loading page' })).toBeAttached()
  await expect(page).toHaveURL(/\/#contact$/, { timeout: 5000 })
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
      for (const path of ['/', '/work/skillmatch', '/work/mini-rpg-battle', '/resume', '/notes', '/lab']) {
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
            if (!['DM Sans Variable', 'DM Mono'].includes(family))
              problems.push(`font ${family} "${text.slice(0, 30)}"`)
          }
          const loaded = document.fonts.check('16px "DM Sans Variable"') && document.fonts.check('16px "DM Mono"')
          return loaded ? problems : [...problems, 'site fonts not loaded']
        }, minimum)
        expect(found, `${path} on ${name}`).toEqual([])
      }
    })
  }
})

test.describe('reading width', () => {
  // DM Sans digits are wide, so a "ch" cap runs long: 70ch was 862px, over 100 characters a line.
  // Body text is about 740px and the 19px lead line under a case-study title about 780px, so 800px has room.
  // The closing card is skipped on purpose: it spans the page and holds one-line text, not prose.
  for (const width of [1440, 2560]) {
    test(`long prose stays under 800px wide at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 })
      for (const path of [
        '/work/skillmatch',
        '/work/job-application-tracker',
        '/notes/skillmatch-attend-race-condition',
        '/lab',
        '/how-its-built',
        '/resume',
      ]) {
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        const tooWide = await page.evaluate(() =>
          [...document.querySelectorAll('main p, main li:not(:has(p))')]
            .filter(
              (element) =>
                (element.textContent ?? '').trim().length >= 70 &&
                !element.closest(
                  'pre, [aria-hidden="true"], #closing-cta-title + p, section[aria-labelledby="closing-cta-title"]',
                ),
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

test.describe('the end of a page', () => {
  test('a case study ends with a way to get in touch, and the link works', async ({ page }) => {
    await page.goto('/work/skillmatch')
    await page.waitForLoadState('networkidle')
    const cta = page.getByRole('region', { name: 'Working on something like SkillMatch?' })
    await expect(cta.getByRole('link', { name: /Get in touch/ })).toHaveAttribute('href', '/#contact')
    await expect(cta.getByRole('link', { name: /View resume/ })).toHaveAttribute('href', '/resume')
    await expect(cta.getByRole('link', { name: /All projects/ })).toHaveAttribute('href', '/#work')
    await cta.getByRole('link', { name: /Get in touch/ }).click()
    await expect(page).toHaveURL(/\/#contact$/)
    await expect(page.locator('#contact')).toBeInViewport()
  })

  test('a note ends with the same next step', async ({ page }) => {
    await page.goto('/notes/skillmatch-attend-race-condition')
    const cta = page.getByRole('region', { name: 'Found this useful?' })
    await expect(cta.getByRole('link', { name: /Get in touch/ })).toHaveAttribute('href', '/#contact')
  })

  test('the project pager does not wrap around', async ({ page }) => {
    const pager = () => page.getByRole('navigation', { name: 'More case studies' })
    // First project: nothing before it, so the left slot goes back to the work list.
    await page.goto('/work/skillmatch')
    await expect(pager().getByRole('link', { name: /Previous/ })).toHaveCount(0)
    await expect(pager().getByRole('link', { name: /Back to work/ })).toHaveAttribute('href', '/#work')
    await expect(pager().getByRole('link', { name: /Next/ })).toHaveAttribute('href', '/work/gitscribe')
    // Last project: nothing after it, so the right slot goes back to the work list.
    await page.goto('/work/jicnic')
    await expect(pager().getByRole('link', { name: /Next/ })).toHaveCount(0)
    await expect(pager().getByRole('link', { name: /Previous/ })).toHaveAttribute('href', '/work/jinterest')
    await expect(pager().getByRole('link', { name: /Back to work/ })).toHaveAttribute('href', '/#work')
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

test('terminal projects show a recorded session', async ({ page }) => {
  await page.goto('/work/mini-rpg-battle')
  await expect(page.locator('[data-terminal-block]')).toContainText('Victory! Survived 10 rounds.')
})

test('unknown routes show a 404 page', async ({ page }) => {
  await page.goto('/work/does-not-exist')
  await expect(page.getByRole('heading', { name: "This page doesn't exist." })).toBeVisible()
})

test('skill chips filter projects and can be cleared', async ({ page }) => {
  await page.goto('/')
  // Wait for hydration, otherwise the click can land before React attaches its handlers.
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: /using Redis$/ }).click()
  await expect(page.getByText('Showing projects that use')).toBeVisible()
  await expect(page.locator('[data-slot="carousel"] [data-project-card]')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'More projects' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Clear skill filter' }).click()
  await expect(page.locator('[data-slot="carousel"] [data-project-card]')).toHaveCount(4)
})

test('every listed skill is backed by at least one project', async ({ page }) => {
  await page.goto('/')
  const labels = await page
    .locator('#skills button[aria-pressed]')
    .evaluateAll((buttons) => buttons.map((button) => button.getAttribute('aria-label') ?? ''))
  expect(labels.length).toBeGreaterThan(0)
  for (const label of labels) expect(Number(label.match(/Show (\d+) project/)?.[1])).toBeGreaterThan(0)
})

test('theme is dark by default and remembers a manual choice', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' })
  const page = await context.newPage()
  await page.goto('/')
  // Wait for hydration, otherwise the first click can land before the menu has its handlers.
  await page.waitForLoadState('networkidle')
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains('dark'))
  expect(await isDark()).toBe(true)

  await page.getByRole('button', { name: 'Choose theme' }).click()
  await page.getByRole('menuitemradio', { name: 'Light' }).click()
  expect(await isDark()).toBe(false)
  await page.reload()
  await page.waitForLoadState('networkidle')
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
      '/work/skillmatch',
      '/work/thinkboard',
      '/work/mini-rpg-battle',
      '/resume',
      '/how-its-built',
      '/notes',
      '/lab',
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
  const demo = page.locator('[data-limiter-demo]')
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await expect(demo.locator('[data-limiter-log] li[data-limited]').first()).toBeVisible({ timeout: 5000 })
  await expect(demo.getByRole('meter').first()).toHaveAttribute('aria-valuenow', '10')

  // Shared key: the other visitor is blocked by your burst.
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('Another visitor')
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('429')

  // Per-visitor keys: the same burst no longer affects them.
  await demo.getByLabel(/One key per visitor/).check()
  await demo.getByRole('button', { name: 'Burst 15 requests' }).click()
  await expect(demo.locator('[data-limiter-log] li[data-limited]').first()).toBeVisible({ timeout: 5000 })
  await demo.getByRole('button', { name: 'Other visitor sends 1' }).click()
  await expect(demo.locator('[data-limiter-log] li').first()).toContainText('200 OK')
})

test('engineering notes: listed on the notes page, own pages, linked from case studies', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Read my engineering notes/ }).click()
  await expect(page).toHaveURL(/\/notes$/)
  await expect(page.locator('main li').filter({ has: page.locator('a[href^="/notes/"]') })).toHaveCount(3)
  await page
    .getByRole('link', { name: /The race condition in SkillMatch/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/notes\/skillmatch-attend-race-condition$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('race condition')
  await expect(page.locator('article code').first()).toBeVisible()
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
  const activity = page.locator('[data-github]')
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
  if (!(await stale.locator('[data-github]').count())) return // stale snapshot and stale live data: hidden
  await expect(stale.locator('[data-github]')).not.toContainText('Old')
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
  await expect(page.getByRole('heading', { name: /Notes on things I built/ })).toBeVisible()
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page.getByRole('heading', { name: /Notes on things I built/ })).toBeVisible()
  await expect(page.locator('[aria-label="Loading page"]')).toHaveCount(0)

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

test('project carousel can be moved with the arrow keys on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('link', { name: 'SkillMatch case study', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('link', { name: 'GitScribe case study', exact: true })).toBeInViewport({ ratio: 0.9 })
})

test('screenshots are served as AVIF to browsers that support it', async ({ page }) => {
  await page.goto('/work/thinkboard')
  const source = page.locator('picture source[type="image/avif"]').first()
  await expect(source).toHaveAttribute('srcset', /thinkboard-screen-1(-480)?\.avif/)
  const avif = await page.request.get('/projects/thinkboard-screen-1.avif')
  expect(avif.status()).toBe(200)
  expect(avif.headers()['content-type']).toContain('image/avif')
})

test('printing the resume uses dark text on white, even when the dark theme is on screen', async ({ browser }) => {
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
    .toEqual({ heading: 'rgb(0, 0, 0)', page: 'rgb(255, 255, 255)' })
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
  // Only a hydrated page can open the theme menu, so this proves the reload fixed it.
  await page.getByRole('button', { name: 'Choose theme' }).click()
  await expect(page.getByRole('menuitemradio', { name: 'Light' })).toBeVisible()
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
  await expect(viewer.getByRole('list', { name: 'All screenshots' }).getByRole('button')).toHaveCount(3)
  await expect(viewer.getByText('1 of 3', { exact: true })).toBeVisible()

  await viewer.getByRole('button', { name: /Show screenshot 2/ }).click()
  await expect(viewer.getByText('2 of 3', { exact: true })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(viewer.getByText('3 of 3', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(viewer).toBeHidden()
})

test('the matching-projects message appears inside the group of the skill you clicked', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const web = page.locator('#skills [data-skill-group]').filter({ hasText: 'Web & Full-Stack' })
  const tools = page.locator('#skills [data-skill-group]').filter({ hasText: 'Tools & Infrastructure' })

  await page.getByRole('button', { name: /using JavaScript$/ }).click()
  await expect(web).toContainText('matching')
  await expect(tools).not.toContainText('matching')

  await page.getByRole('button', { name: /using Vercel$/ }).click()
  await expect(tools).toContainText('matching')
  await expect(web).not.toContainText('matching')
})

test('moving quickly between skills never leaves two tooltips open', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.locator('#skills').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /using React$/ }).hover()
  await page.waitForTimeout(250)
  await page.getByRole('button', { name: /using TypeScript$/ }).hover()
  await page.getByRole('button', { name: /using Python$/ }).hover()
  await page.waitForTimeout(400)
  await expect(page.getByRole('tooltip')).toHaveCount(1)
  await expect(page.getByRole('tooltip')).toContainText('Python')
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
  await expect(nav.getByRole('link', { name: 'Resume' })).toHaveAttribute('aria-current', 'page')
})
