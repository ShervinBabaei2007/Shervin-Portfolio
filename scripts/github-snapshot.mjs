// Saves your recent public commit history to src/data/github.json (counts per day and the latest
// commits) and src/data/github-commits.json (every commit, grouped by day), so the "Commit history"
// card is in the prerendered HTML and a clicked day can list its commits, even if the visitor's
// browser can't reach the GitHub API (it allows 10 search requests per minute and 60 other requests
// per hour per IP, which a shared office network can use up).
//
// Runs at the start of `npm run build`. Never fails the build: if GitHub is unreachable, or only part
// of the history could be fetched, the previous snapshot is kept. Set GITHUB_TOKEN (any token with no
// scopes) in Vercel's environment variables for a higher rate limit.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { importTs, root } from './lib.mjs'

const { commitSearchUrl, countByDay, dayOf, mergedPrsUrl, parseCommits, toTuple } = await importTs('src/lib/githubCommits.ts')

const WEEKS = 52
const MAX_PAGES = 10
const MAX_RETRIES = 3
const MAX_WAIT_MS = 65_000

const summaryFile = resolve(root, 'src/data/github.json')
const commitsFile = resolve(root, 'src/data/github-commits.json')
const siteSource = readFileSync(resolve(root, 'src/data/site.ts'), 'utf8')
const user = siteSource.match(/github:\s*'https:\/\/github\.com\/([^'/]+)'/)?.[1]

const sleep = (ms) => new Promise((done) => setTimeout(done, ms))

/** Fetches one search page, waiting out the rate limit (403/429) a few times before giving up. */
async function fetchPage(page) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(commitSearchUrl(user, page), {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    })
    if (response.ok) return (await response.json()).items ?? []
    const limited = response.status === 403 || response.status === 429
    if (!limited || attempt >= MAX_RETRIES) throw new Error(`GitHub responded ${response.status} (page ${page})`)
    const retryAfter = Number(response.headers.get('retry-after'))
    const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000 - Date.now()
    const wait = Math.min(MAX_WAIT_MS, Math.max(retryAfter * 1000 || 0, reset || 0, 15_000))
    console.log(`github snapshot: rate limited on page ${page}, waiting ${Math.round(wait / 1000)}s`)
    await sleep(wait)
  }
}

/** Merged pull requests over the same window as the commits. A failure here keeps the previous number. */
async function fetchMergedPrs(since) {
  try {
    const response = await fetch(mergedPrsUrl(user, since), {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
    const count = (await response.json()).total_count
    return Number.isInteger(count) ? count : null
  } catch (error) {
    console.warn(`github snapshot: merged PR count skipped (${error.message})`)
    return null
  }
}

try {
  if (!user) throw new Error('could not read the GitHub username from src/data/site.ts')
  const since = new Date(Date.now() - WEEKS * 7 * 86_400_000).toISOString().slice(0, 10)
  const commits = []
  let finished = false
  for (let page = 1; page <= MAX_PAGES && !finished; page++) {
    let items
    try {
      items = await fetchPage(page)
    } catch (error) {
      if (page === 1) throw error
      console.warn(`github snapshot: stopped early (${error.message})`)
      break
    }
    commits.push(...parseCommits(items))
    finished = items.length < 100 || (commits.length > 0 && dayOf(commits[commits.length - 1].date) < since)
  }
  if (commits.length === 0) throw new Error('no public commits found')

  // A partial run must never replace a fuller snapshot.
  const existing = JSON.parse(readFileSync(summaryFile, 'utf8'))
  const existingTotal = Object.values(existing.days ?? {}).reduce((sum, count) => sum + count, 0)
  if (!finished && commits.length <= existingTotal) {
    throw new Error(`only ${commits.length} of at least ${existingTotal} commits could be fetched`)
  }

  const inWindow = commits.filter((commit) => dayOf(commit.date) >= since)
  const days = countByDay(inWindow)
  const byDay = {}
  for (const commit of inWindow) (byDay[dayOf(commit.date)] ??= []).push(toTuple(commit))
  const mergedPrs = (await fetchMergedPrs(since)) ?? existing.mergedPrs ?? null
  const summary = { fetchedAt: new Date().toISOString(), mergedPrs, days, commits: commits.slice(0, 8) }
  writeFileSync(summaryFile, `${JSON.stringify(summary, null, 2)}\n`)
  writeFileSync(commitsFile, `${JSON.stringify(byDay)}\n`)
  console.log(`github snapshot: ${inWindow.length} commits over ${Object.keys(days).length} days, ${mergedPrs ?? 'unknown'} merged PRs`)
} catch (error) {
  console.warn(`github snapshot skipped (${error.message}); keeping the existing src/data/github*.json`)
}
