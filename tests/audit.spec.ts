import { readFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { contactLimits, contactTopics, emailPattern } from '../src/data/contact'
import { site } from '../src/data/site'

/** The app's script starts just after the first paint, so wait for React to take over before interacting. */
const hydrated = (page: Page) =>
  page.waitForFunction(() =>
    Object.keys(document.getElementById('root') ?? {}).some((key) => key.startsWith('__reactContainer')),
  )

const collectErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

const wcag = ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']
const violations = async (page: Page) =>
  (await new AxeBuilder({ page }).withTags(wcag).analyze()).violations.map((v) => `${v.id} (${v.nodes.length})`)

test.describe('accessibility in the states a visitor can reach', () => {
  test('the 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await page.waitForLoadState('networkidle')
    expect(await violations(page)).toEqual([])
  })

  test('the home page and a case study on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const path of ['/', '/work/skillmatch', '/writeups']) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      expect(await violations(page), path).toEqual([])
    }
  })

  test('the command palette, open', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog', { name: 'Search portfolio' })).toBeVisible()
    await page.keyboard.type('re')
    expect(await violations(page)).toEqual([])
  })

  test('the phone menu, open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await hydrated(page)
    await page.locator('button[aria-label="Open menu"]').click()
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    expect(await violations(page)).toEqual([])
  })

  test('Quick look, open', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.locator('button', { hasText: 'Quick look' }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(await violations(page)).toEqual([])
  })
})

test.describe('the whole site', () => {
  test('every page in the sitemap loads without console errors, and every internal link resolves', async ({
    page,
    request,
  }) => {
    test.setTimeout(180_000)
    // The live GitHub request is outside this site's control (and rate-limited per IP), so answer it locally.
    await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))
    const sitemap = await (await request.get('/sitemap.xml')).text()
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
    expect(paths.length).toBeGreaterThan(20)

    const errors = collectErrors(page)
    const links = new Set<string>()
    for (const path of paths) {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
      )
      for (const href of hrefs)
        if (href.startsWith('/') && !href.startsWith('//')) links.add(href.split('#')[0].split('?')[0] || '/')
    }
    expect(errors).toEqual([])

    const broken: string[] = []
    for (const link of links) {
      const response = await request.get(link)
      if (!response.ok()) broken.push(`${link} -> ${response.status()}`)
    }
    expect(broken).toEqual([])
  })

  test('the server and the form agree on the contact rules', () => {
    const server = readFileSync('api/contact.ts', 'utf8')
    const topics = [...server.match(/const topics = \[(.*?)\]/)![1].matchAll(/'([^']+)'/g)].map((match) => match[1])
    expect(topics).toEqual(contactTopics)
    expect(server).toContain(emailPattern.source)
    for (const [field, max] of Object.entries(contactLimits)) {
      expect(server, field).toContain(`clean(data.${field}, ${max})`)
    }
  })

  test('security headers are configured for every route', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
      headers: { source: string; headers: { key: string; value: string }[] }[]
    }
    const everything = config.headers.find((rule) => rule.source === '/(.*)')!
    const keys = everything.headers.map((header) => header.key)
    expect(keys).toEqual(
      expect.arrayContaining(['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options', 'Permissions-Policy']),
    )
  })
})

test.describe('keyboard only', () => {
  test('the skip link comes first, then the header, and focus is always visible', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()

    // Tab through the header: every stop must show a focus indicator that is not just the browser default.
    await page.goto('/')
    await hydrated(page)
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Tab') // the skip link, which sits before the header
    const seen: string[] = []
    for (let step = 0; step < 8; step++) {
      await page.keyboard.press('Tab')
      await page.waitForTimeout(350) // buttons fade their ring in, so read it once the transition has finished
      const info = await page.evaluate(() => {
        const element = document.activeElement as HTMLElement
        const style = getComputedStyle(element)
        // A strong indicator is a solid outline of 2px or more, or a fully opaque ring of 2px or more (rgb, not rgba) in box-shadow.
        return {
          name: element.getAttribute('aria-label') ?? element.textContent?.trim().slice(0, 30) ?? '',
          outline:
            (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2) ||
            /rgb\([^)]*\) 0px 0px 0px [2-9]px/.test(style.boxShadow),
          inHeader: Boolean(element.closest('header')) || element.id === 'main',
        }
      })
      if (!info.inHeader) break
      seen.push(info.name)
      expect(info.outline, `focus indicator on "${info.name}"`).toBe(true)
    }
    expect(seen.length).toBeGreaterThanOrEqual(5)
  })

  test('the palette opens and closes from the keyboard and returns focus', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.waitForLoadState('networkidle')
    const trigger = page.getByRole('button', { name: 'Search portfolio' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Search portfolio' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('combobox')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('a form field shows a clear focus indicator', async ({ page }) => {
    await page.goto('/#contact')
    await hydrated(page)
    await page.getByLabel('Name').focus()
    const indicator = await page.evaluate(() => {
      const style = getComputedStyle(document.activeElement as HTMLElement)
      const ring = getComputedStyle(document.documentElement).getPropertyValue('--ring').trim()
      return { borderColor: style.borderTopColor, outline: style.outlineStyle, ring }
    })
    // Either an outline, or the border turns the ring colour (shadcn inputs): both are a strong change.
    expect(indicator.outline !== 'none' || indicator.borderColor !== 'rgba(0, 0, 0, 0)').toBe(true)
    expect(indicator.ring).not.toBe('')
  })
})

test.describe('command palette', () => {
  test('finds a writeup by its title and opens it', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: 'Search portfolio' })
    await expect(dialog).toBeVisible()
    await page.keyboard.type('fetches links')
    await expect(dialog.getByRole('option', { name: /fetches links/ })).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/writeups\/fetching-links-you-dont-trust$/)
  })

  test('finds a skill and filters the work by it', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.waitForLoadState('networkidle')
    await page.keyboard.press('Control+k')
    const dialog = page.getByRole('dialog', { name: 'Search portfolio' })
    await expect(dialog).toBeVisible()
    await page.keyboard.type('Redis')
    await dialog.getByRole('option', { name: /^Redis/ }).click()
    await expect(page.getByText('Showing projects that use')).toBeVisible()
    await expect(page.locator('#work')).toBeInViewport()
    // A reload does not apply the skill a second time.
    await page.reload()
    await expect(page.getByText('Showing projects that use')).toHaveCount(0)
  })
})

test.describe('contact', () => {
  test('the email can be copied, with confirmation', async ({ browser }) => {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
    const page = await context.newPage()
    await page.goto('/#contact')
    await hydrated(page)
    await page.getByRole('button', { name: 'Copy email' }).click()
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(site.email)
    await expect(page.getByText('Email copied')).toBeVisible()
    await context.close()
  })

  test('a dropped connection gets a plain message and a way to email instead', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort())
    await page.goto('/#contact')
    await hydrated(page)
    await page.getByLabel('Name').fill('Test Person')
    await page.locator('#contact-email').fill('test@example.com')
    await page.getByRole('radio', { name: 'General Inquiry' }).click()
    await page.getByLabel('Message').fill('Hello there')
    await page.getByRole('button', { name: 'Send message' }).click()
    const alert = page.getByRole('alert').filter({ hasText: 'Message not sent' })
    await expect(alert).toContainText("couldn't reach the server")
    await expect(alert).not.toContainText('Failed to fetch')
    await expect(alert.getByRole('link', { name: site.email })).toBeVisible()
    await expect(page.getByLabel('Message')).toHaveValue('Hello there')
  })
})

test.describe('resilience', () => {
  test('if Quick look cannot load, a message appears and the page stays intact', async ({ page }) => {
    await page.route(/\/assets\/CaseStudySheet-[\w-]+\.js$/, (route) => route.abort())
    await page.goto('/')
    await hydrated(page)
    const button = page.locator('button', { hasText: 'Quick look' }).first()
    await button.click()
    await expect(page.getByText('Quick look could not load')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(button).toHaveAttribute('aria-busy', 'false')
  })
})

test.describe('theme colour', () => {
  test('the browser bar colour follows the theme', async ({ page }) => {
    const themeColor = () => page.locator('meta[name="theme-color"]').getAttribute('content')
    await page.goto('/')
    await hydrated(page)
    expect(await themeColor()).toBe('#0a1122')
    await page.getByRole('button', { name: 'More' }).click()
    await page.getByRole('menuitemradio', { name: 'Light' }).click()
    expect(await themeColor()).toBe('#f6f8fc')
    // And it is right from the first paint after a reload, before the app starts.
    await page.reload()
    expect(await themeColor()).toBe('#f6f8fc')
  })
})

test.describe('small controls on touch screens', () => {
  test('are at least 44px tall', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    const page = await context.newPage()
    await page.goto('/work/skillmatch')
    await hydrated(page)
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true)
    const copyCode = await page.locator('#code button').first().boundingBox()
    expect(copyCode!.height).toBeGreaterThanOrEqual(43.5)
    await page.goto('/projects')
    await hydrated(page)
    const repoLink = await page.locator('[data-more-repos] a').first().boundingBox()
    expect(repoLink!.height).toBeGreaterThanOrEqual(43.5)
    await page.goto('/#contact')
    await hydrated(page)
    const copyEmail = await page.getByRole('button', { name: 'Copy email' }).boundingBox()
    expect(copyEmail!.height).toBeGreaterThanOrEqual(43.5)
    await context.close()
  })
})

test.describe('animation', () => {
  test('stops drawing frames while the animated sections are off screen', async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __frames: number }
      w.__frames = 0
      const original = window.requestAnimationFrame.bind(window)
      window.requestAnimationFrame = (callback) => {
        w.__frames++
        return original(callback)
      }
    })
    const frames = (ms: number) =>
      page.evaluate(async (duration) => {
        const w = window as unknown as { __frames: number }
        const before = w.__frames
        await new Promise((resolve) => setTimeout(resolve, duration))
        return w.__frames - before
      }, ms)

    await page.goto('/')
    await hydrated(page)
    // At the top of the page the particles (About) and the globe (Contact) are far below the screen.
    await page.waitForTimeout(800)
    expect(await frames(600)).toBeLessThan(8)

    // Scrolled to the About section, the particles are on screen and animate.
    await page.locator('#about-title').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    expect(await frames(600)).toBeGreaterThan(15)
  })
})

test.describe('the rail beside writeups and case studies', () => {
  const writeup = '/writeups/fetching-links-you-dont-trust'

  test('sits to the right of the text on a wide screen and above it on a narrow one', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(writeup)
    await page.waitForLoadState('networkidle')
    const contents = (await page.getByRole('navigation', { name: 'On this page' }).boundingBox())!
    const project = (await page.getByRole('region', { name: 'About this writeup' }).boundingBox())!
    const text = (await page.locator('#note-body > p').first().boundingBox())!
    expect(contents.x).toBeGreaterThan(text.x + text.width)
    expect(project.x).toBeCloseTo(contents.x, 0)
    expect(project.y).toBeGreaterThan(contents.y + contents.height)

    await page.setViewportSize({ width: 1000, height: 900 })
    await page.waitForTimeout(200)
    const stacked = (await page.getByRole('navigation', { name: 'On this page' }).boundingBox())!
    const body = (await page.locator('#note-body').boundingBox())!
    expect(stacked.y + stacked.height).toBeLessThanOrEqual(body.y)
    expect(stacked.x).toBeCloseTo(body.x, 0)
  })

  test('stays in view while you read, unless the window is too short to show all of it', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(writeup)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, 1800))
    await page.waitForTimeout(300)
    const top = (await page.getByRole('navigation', { name: 'On this page' }).boundingBox())!.y
    // Just below the header (78px plus a little air), not scrolled away.
    expect(top).toBeGreaterThan(80)
    expect(top).toBeLessThan(140)

    await page.setViewportSize({ width: 1440, height: 640 })
    await page.waitForTimeout(200)
    const position = await page.evaluate(
      () => getComputedStyle(document.querySelector('nav[aria-label="On this page"]')!.parentElement!).position,
    )
    expect(position).toBe('static')
  })

  test('marks the section you are reading as you scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(writeup)
    await page.waitForLoadState('networkidle')
    const target = page.locator('#note-body h2').nth(3)
    const heading = (await target.textContent())!
    await target.evaluate((element) =>
      window.scrollBy(0, element.getBoundingClientRect().top - window.innerHeight * 0.33),
    )
    const current = page.getByRole('navigation', { name: 'On this page' }).locator('[aria-current="location"]')
    await expect(current).toHaveCount(1)
    await expect(current).toContainText(heading)
  })

  test('there is one contents list on each page, wide or narrow', async ({ page }) => {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      for (const path of [writeup, '/work/skillmatch', '/work/gitscribe']) {
        await page.goto(path)
        await expect(page.getByRole('navigation', { name: 'On this page' }), `${path} at ${width}`).toHaveCount(1)
      }
    }
  })

  test('the contents links work from the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(writeup)
    await page.waitForLoadState('networkidle')
    const links = page.getByRole('navigation', { name: 'On this page' }).getByRole('link')
    await links.first().focus()
    await page.keyboard.press('Tab')
    await expect(links.nth(1)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#.+/)
    await expect(page.locator(page.url().slice(page.url().indexOf('#')))).toBeInViewport()
  })

  test('a case study puts the stack and related writeups in the rail too', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/work/skillmatch')
    await page.waitForLoadState('networkidle')
    const sections = (await page.locator('#why').boundingBox())!
    for (const name of ['Built with', 'Go deeper']) {
      const heading = (await page.getByRole('heading', { name }).boundingBox())!
      expect(heading.x, name).toBeGreaterThan(sections.x + sections.width)
    }
  })
})

test('the header never runs its links into the search button', async ({ page }) => {
  for (const width of [1024, 1060, 1100, 1180, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    await page.goto('/')
    const overlap = await page.evaluate(() => {
      const links = [...document.querySelectorAll('nav[aria-label="Main navigation"] a')]
        .map((a) => a.getBoundingClientRect())
        .filter((box) => box.width > 0)
      const search = document.querySelector('button[aria-label="Search portfolio"]')!.getBoundingClientRect()
      return Math.round(Math.max(...links.map((box) => box.right)) - search.left)
    })
    expect(overlap, `at ${width}px`).toBeLessThanOrEqual(0)
  }
})
