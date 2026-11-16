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

const { commitSearchUrl, countByDay, dayOf, mergedPrsUrl, parseCommits, toTuple } =
  await importTs('src/lib/githubCommits.ts')

// One year of history. GitHub search returns at most 1,000 results (10 pages of 100) per query, so the year is read
// in chunks: each chunk asks for commits on or before the oldest day the previous one reached. Up to 5 chunks.
const WEEKS = 52
const MAX_PAGES = 10
const MAX_CHUNKS = 5
// When rate limited, retry a page up to 3 times, waiting at most 65 seconds each time.
const MAX_RETRIES = 3
const MAX_WAIT_MS = 65_000

const summaryFile = resolve(root, 'src/data/github.json')
const commitsFile = resolve(root, 'src/data/github-commits.json')
// The username is read from the `github:` profile link in site.ts, so it lives in one place.
const siteSource = readFileSync(resolve(root, 'src/data/site.ts'), 'utf8')
const user = siteSource.match(/github:\s*'https:\/\/github\.com\/([^'/]+)'/)?.[1]
// This site's own repository; the card's recent list leaves it out, so the snapshot keeps enough other commits.
const siteRepo = siteSource.match(/siteRepo:\s*'([^']+)'/)?.[1]
// How many recent commits the snapshot keeps overall, and from other repositories.
const RECENT = 8

// Sent with every GitHub request; the token, when set, raises the rate limit.
const headers = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

/** Waits `ms` milliseconds. */
const sleep = (ms) => new Promise((done) => setTimeout(done, ms))

/** Fetches one search page, waiting out the rate limit (403/429) a few times before giving up. */
async function fetchPage(page, until) {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(commitSearchUrl(user, page, until), { headers, signal: AbortSignal.timeout(8000) })
    if (response.ok) return (await response.json()).items ?? []
    const limited = response.status === 403 || response.status === 429
    if (!limited || attempt >= MAX_RETRIES) throw new Error(`GitHub responded ${response.status} (page ${page})`)
    const retryAfter = Number(response.headers.get('retry-after'))
    const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000 - Date.now()
    // Wait as long as GitHub asks (at least 15s), but never more than MAX_WAIT_MS.
    const wait = Math.min(MAX_WAIT_MS, Math.max(retryAfter * 1000 || 0, reset || 0, 15_000))
    console.log(`github snapshot: rate limited on page ${page}, waiting ${Math.round(wait / 1000)}s`)
    await sleep(wait)
  }
}

/** Merged pull requests over the same window as the commits. A failure here keeps the previous number. */
async function fetchMergedPrs(since) {
  try {
    const response = await fetch(mergedPrsUrl(user, since), { headers, signal: AbortSignal.timeout(8000) })
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
  // The first day of the window, as YYYY-MM-DD.
  const since = new Date(Date.now() - WEEKS * 7 * 86_400_000).toISOString().slice(0, 10)
  // Keyed by repository and SHA: chunks overlap by a day, so the same commit can arrive twice.
  const found = new Map()
  let finished = false
  let stoppedEarly = false
  let until
  for (let chunk = 0; chunk < MAX_CHUNKS && !finished && !stoppedEarly; chunk++) {
    let oldest = null
    for (let page = 1; page <= MAX_PAGES; page++) {
      let items
      try {
        items = await fetchPage(page, until)
      } catch (error) {
        if (found.size === 0) throw error
        console.warn(`github snapshot: stopped early (${error.message})`)
        stoppedEarly = true
        break
      }
      for (const commit of parseCommits(items)) found.set(`${commit.repo}@${commit.sha}`, commit)
      if (items.length > 0) oldest = dayOf(items[items.length - 1].commit.author.date)
      // Done when a page comes back short (no more results) or the search has reached past the start of the window.
      if (items.length < 100 || (oldest && oldest < since)) {
        finished = true
        break
      }
    }
    if (finished || stoppedEarly) break
    // The next chunk starts a day after the oldest day reached, so a day split across two chunks is read in full.
    const next = new Date(Date.parse(`${oldest}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10)
    if (until && next >= until) break // more than 1,000 commits in two days: stop rather than loop
    until = next
  }
  const commits = [...found.values()].sort((a, b) => b.date.localeCompare(a.date))
  if (commits.length === 0) throw new Error('no public commits found')

  // A run that stopped on an error must never replace a fuller snapshot. A run that used every chunk without reaching
  // the start of the window is not partial but "capped": the card then says the count is a lower bound.
  const existing = JSON.parse(readFileSync(summaryFile, 'utf8'))
  const existingTotal = Object.values(existing.days ?? {}).reduce((sum, count) => sum + count, 0)
  const capped = !finished && !stoppedEarly
  if (stoppedEarly && commits.length <= existingTotal) {
    throw new Error(`only ${commits.length} of at least ${existingTotal} commits could be fetched`)
  }

  const inWindow = commits.filter((commit) => dayOf(commit.date) >= since)
  const days = countByDay(inWindow)
  // Commits grouped by day as compact tuples, for the clicked-day list.
  const byDay = {}
  for (const commit of inWindow) (byDay[dayOf(commit.date)] ??= []).push(toTuple(commit))
  const mergedPrs = (await fetchMergedPrs(since)) ?? existing.mergedPrs ?? null
  // The newest commits overall (for freshness) plus the newest from other repositories (for the recent list).
  const others = commits.filter((commit) => commit.repo !== siteRepo).slice(0, RECENT)
  const recent = [...new Map([...commits.slice(0, RECENT), ...others].map((commit) => [commit.sha, commit])).values()]
  recent.sort((a, b) => b.date.localeCompare(a.date))
  const summary = { fetchedAt: new Date().toISOString(), mergedPrs, capped, days, commits: recent }
  writeFileSync(summaryFile, `${JSON.stringify(summary, null, 2)}\n`)
  writeFileSync(commitsFile, `${JSON.stringify(byDay)}\n`)
  console.log(
    `github snapshot: ${inWindow.length}${capped ? '+ (search cap)' : ''} commits over ${Object.keys(days).length} days, ${mergedPrs ?? 'unknown'} merged PRs`,
  )
} catch (error) {
  console.warn(`github snapshot skipped (${error.message}); keeping the existing src/data/github*.json`)
}
