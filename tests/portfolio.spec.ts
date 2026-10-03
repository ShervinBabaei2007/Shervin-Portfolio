import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('hero identifies the target role and links to the real resume', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByText('Seeking co-op and junior developer roles in Vancouver / Burnaby.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'View resume' })).toHaveAttribute('href', '/Shervin_Babaei_Resume.pdf')
})

test('project filters and case studies keep project links independent', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Systems' }).click()
  await expect(page.getByText('01 PROJECT')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open Mini RPG Battle case study' })).toBeVisible()

  await page.getByRole('button', { name: 'All work' }).click()
  const opener = page.getByRole('button', { name: 'Open SkillMatch case study' })
  await opener.click()

  const dialog = page.getByRole('dialog', { name: 'SkillMatch' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Why' })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: "What I'd improve next" })).toBeVisible()
  await expect(dialog.locator('.case-study-at-a-glance')).toContainText('Backend & DevOps lead')
  await expect(dialog.locator('.case-study-at-a-glance')).toContainText('Vercel deployments automated on every merge')
  await expect(dialog.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute('href', 'https://github.com/ShervinBabaei2007/SkillMatch')
  await expect(dialog.getByRole('link', { name: 'Live project' })).toHaveAttribute('href', 'https://skillmatch-web.vercel.app/')
  const dashboard = dialog.getByRole('img', { name: /SkillMatch dashboard/ })
  await expect(dashboard).toBeVisible()
  await expect.poll(() => dashboard.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
})

test('case-study screenshots use a desktop sidebar and stack below text on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open SkillMatch case study' }).click()

  const dialog = page.getByRole('dialog', { name: 'SkillMatch' })
  const desktop = await dialog.evaluate((element) => {
    const main = element.querySelector('.case-study-main')!.getBoundingClientRect()
    const sidebar = element.querySelector('.case-study-sidebar')!.getBoundingClientRect()
    const narrative = element.querySelector('.case-study-sections p')!
    return {
      columns: getComputedStyle(element.querySelector('.case-study-layout')!).gridTemplateColumns.split(' ').length,
      sidebarIsRight: sidebar.left >= main.right,
      sidebarIsNarrower: sidebar.width < main.width,
      narrativeSize: parseFloat(getComputedStyle(narrative).fontSize),
      fullSizeLinks: [...element.querySelectorAll('.case-study-gallery a')].length,
    }
  })
  expect(desktop.columns).toBe(2)
  expect(desktop.sidebarIsRight).toBe(true)
  expect(desktop.sidebarIsNarrower).toBe(true)
  expect(desktop.narrativeSize).toBeGreaterThanOrEqual(18)
  expect(desktop.fullSizeLinks).toBe(3)

  await page.setViewportSize({ width: 390, height: 844 })
  const mobile = await dialog.evaluate((element) => {
    const main = element.querySelector('.case-study-main')!.getBoundingClientRect()
    const sidebar = element.querySelector('.case-study-sidebar')!.getBoundingClientRect()
    return {
      columns: getComputedStyle(element.querySelector('.case-study-layout')!).gridTemplateColumns.split(' ').length,
      sidebarAfterStory: sidebar.top >= main.bottom,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }
  })
  expect(mobile.columns).toBe(1)
  expect(mobile.sidebarAfterStory).toBe(true)
  expect(mobile.documentWidth).toBeLessThanOrEqual(mobile.viewportWidth)
})

test('projects without supplied links do not show empty link rows', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open Discord AI Automation Bridge case study' }).click()

  const dialog = page.getByRole('dialog', { name: 'Discord AI Automation Bridge' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.case-study-links')).toHaveCount(0)
  await expect(page.locator('.project-card--discord .project-links')).toHaveCount(0)
})

test('system layers open case studies for relevant project examples', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Show UI layer projects' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'SkillMatch', exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Show CORE layer projects' }).click()
  await expect(page.getByRole('button', { name: 'Show CORE layer projects' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Discord AI Automation Bridge', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mini RPG Battle', exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Mini RPG Battle', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Mini RPG Battle' })).toBeVisible()
})

test('skills show accurate project counts and filter evidence', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Show 1 project using Vercel' })).toBeVisible()
  await page.getByRole('button', { name: 'Show 3 projects using React' }).click()
  await expect(page.locator('.project-count')).toHaveText('03 PROJECTS')
  await expect(page.getByRole('button', { name: 'Show 1 project using Redis' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'View matching work' })).toBeVisible()
})

test('skill evidence chips filter matching projects and can be cleared', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Show 3 projects using React' }).click()

  await expect(page.locator('.project-count')).toHaveText('03 PROJECTS')
  await expect(page.getByText('Showing projects that use React.')).toBeVisible()
  await page.getByRole('link', { name: 'View matching work' }).click()
  await expect(page).toHaveURL(/#work$/)
  await expect(page.getByRole('button', { name: 'Open SkillMatch case study' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open Discord AI Automation Bridge case study' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Clear skill filter' }).click()
  await expect(page.locator('.project-count')).toHaveText('05 PROJECTS')
})

test('layout stays within phone, tablet, and desktop viewports', async ({ page }) => {
  await page.goto('/')

  for (const width of [320, 390, 768, 1024, 1440, 2048]) {
    await page.setViewportSize({ width, height: 900 })
    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      columns: getComputedStyle(document.querySelector('.project-grid')!).gridTemplateColumns.trim().split(/\s+/).length,
      headerPosition: getComputedStyle(document.querySelector('.site-header')!).position,
      navCenter: (() => {
        const rect = document.querySelector('.main-nav')!.getBoundingClientRect()
        return rect.left + rect.width / 2
      })(),
      visibleNavLinks: [...document.querySelectorAll('.main-nav a')]
        .filter((link) => getComputedStyle(link).display !== 'none')
        .map((link) => link.textContent?.trim()),
    }))

    expect(layout.documentWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.headerPosition).toBe('sticky')
    if (width >= 1280) expect(Math.abs(layout.navCenter - width / 2)).toBeLessThanOrEqual(2)
    if (width <= 620) expect(layout.visibleNavLinks).toEqual(['Work', 'About', 'Contact'])
    if (width <= 1100) expect(layout.columns).toBe(1)
  }
})

test('home, dark theme, and project dialog pass axe accessibility checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  let results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])

  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])

  await page.getByRole('button', { name: 'Open SkillMatch case study' }).click()
  results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
