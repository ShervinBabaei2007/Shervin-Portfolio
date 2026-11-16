/*
 * Shared by the GitHub activity card (in the browser) and scripts/github-snapshot.mjs
 * (at build time), so the snapshot and the live data have exactly the same shape.
 * Both read GitHub's commit search: it is the only public endpoint that returns
 * commit messages across all of a user's repositories.
 */

/** `repo` is `owner/repo`; `sha` is the 7-character short hash. */
export type Commit = { sha: string; repo: string; message: string; date: string }

/** The compact form stored per day in src/data/github-commits.json: [sha, owner/repo, message, date]. */
export type CommitTuple = [string, string, string, string]
/** That file's shape: the commits of each `YYYY-MM-DD` day. */
export type CommitsByDay = Record<string, CommitTuple[]>

/** Commits per calendar day, keyed `YYYY-MM-DD` in the author's own time zone. */
export type DayCounts = Record<string, number>

// The fields used from one result of GitHub's commit search.
type SearchItem = {
  sha: string
  commit: { message: string; author: { date: string } }
  repository: { full_name: string; private: boolean }
}

/**
 * Search URL for one page (100 commits) of the user's commits, newest first. `until` (YYYY-MM-DD) limits it to commits
 * on or before that day: GitHub search stops at 1,000 results, so the build script walks back a year in such chunks.
 */
export const commitSearchUrl = (user: string, page = 1, until?: string) =>
  `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${user}${until ? ` author-date:<=${until}` : ''}`)}&sort=author-date&order=desc&per_page=100&page=${page}`

/** Search URL for the user's merged pull requests (public repositories) since a `YYYY-MM-DD` day; only `total_count` is used. */
export const mergedPrsUrl = (user: string, since: string) =>
  `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${user} type:pr is:public is:merged merged:>=${since}`)}&per_page=1`

/** Turns search results into commits, dropping private repositories and keeping only each message's first line. */
export function parseCommits(items: SearchItem[]): Commit[] {
  return items
    .filter((item) => !item.repository.private)
    .map((item) => ({
      sha: item.sha.slice(0, 7),
      repo: item.repository.full_name,
      message: item.commit.message.split('\n')[0].trim(),
      date: item.commit.author.date,
    }))
}

/** The commit's page on GitHub. */
export const commitUrl = (commit: Commit) => `https://github.com/${commit.repo}/commit/${commit.sha}`
/** The repository name without its owner. */
export const repoName = (commit: Commit) => commit.repo.split('/')[1] ?? commit.repo
/** Packs a commit into the compact JSON form. */
export const toTuple = (commit: Commit): CommitTuple => [commit.sha, commit.repo, commit.message, commit.date]
/** Unpacks a commit from the compact JSON form. */
export const fromTuple = ([sha, repo, message, date]: CommitTuple): Commit => ({ sha, repo, message, date })

/** The `YYYY-MM-DD` part of an ISO date. */
export const dayOf = (iso: string) => iso.slice(0, 10)

/** How many commits fall on each day. */
export function countByDay(commits: Commit[]): DayCounts {
  const days: DayCounts = {}
  for (const commit of commits) {
    const day = dayOf(commit.date)
    days[day] = (days[day] ?? 0) + 1
  }
  return days
}

/**
 * Merges live counts into the older snapshot counts. The newest search page ends
 * part-way through its oldest day, so that day (and everything before it) keeps the
 * larger of the two counts and only the days after it are taken from live data.
 */
export function mergeDays(snapshot: DayCounts, live: DayCounts, liveCommits: Commit[], complete: boolean): DayCounts {
  if (complete || liveCommits.length === 0) return { ...live }
  const oldest = liveCommits.map((commit) => dayOf(commit.date)).sort()[0]
  const merged: DayCounts = {}
  for (const [day, count] of Object.entries(snapshot)) if (day < oldest) merged[day] = count
  merged[oldest] = Math.max(snapshot[oldest] ?? 0, live[oldest] ?? 0)
  for (const [day, count] of Object.entries(live)) if (day > oldest) merged[day] = count
  return merged
}

// One day in milliseconds.
const DAY = 86_400_000
// A timestamp as a `YYYY-MM-DD` day in UTC.
const toDay = (time: number) => new Date(time).toISOString().slice(0, 10)

/** Columns of 7 days (Sunday first), the last column being the week that contains `end`. */
export function buildWeeks(days: DayCounts, end: string, weeks: number) {
  const endTime = Date.parse(`${end}T00:00:00Z`)
  const lastSunday = endTime - new Date(endTime).getUTCDay() * DAY
  const columns: { day: string; count: number; future: boolean }[][] = []
  for (let week = weeks - 1; week >= 0; week--) {
    const column = []
    for (let weekday = 0; weekday < 7; weekday++) {
      const time = lastSunday - week * 7 * DAY + weekday * DAY
      const day = toDay(time)
      column.push({ day, count: days[day] ?? 0, future: time > endTime })
    }
    columns.push(column)
  }
  return columns
}

/** 0 for no commits, then four steps of increasing activity. */
export function level(count: number) {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 10) return 3
  return 4
}

/** Totals for the cells in view (future cells are ignored). */
export function summarize(weeks: ReturnType<typeof buildWeeks>) {
  const cells = weeks.flat().filter((cell) => !cell.future)
  return {
    total: cells.reduce((sum, cell) => sum + cell.count, 0),
    activeDays: cells.filter((cell) => cell.count > 0).length,
    activeWeeks: weeks.filter((week) => week.some((cell) => !cell.future && cell.count > 0)).length,
    weeks: weeks.length,
  }
}

// Short month names, indexed 0 (January) to 11.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** The month name for the first column of each month, so it can be printed above that column. */
export function monthLabels(weeks: ReturnType<typeof buildWeeks>) {
  const labels: { column: number; name: string }[] = []
  let previous = -1
  weeks.forEach((week, column) => {
    const month = Number(week[0].day.slice(5, 7)) - 1
    // Skip a label that would collide with the one before it (a partial first month).
    if (month !== previous && (labels.length === 0 || column - labels[labels.length - 1].column >= 3)) {
      labels.push({ column, name: MONTHS[month] })
    }
    previous = month
  })
  return labels
}

/**
 * The commits made on one day. Live commits win for days the newest search page fully covers
 * (every day after its oldest day); for that oldest day, and anything older, the snapshot is used
 * unless the live list is longer.
 */
export function commitsForDay(day: string, snapshot: CommitsByDay, live: Commit[]): Commit[] {
  const fromSnapshot = (snapshot[day] ?? []).map(fromTuple)
  const fromLive = live.filter((commit) => dayOf(commit.date) === day)
  if (fromLive.length === 0) return fromSnapshot
  const oldest = live.map((commit) => dayOf(commit.date)).sort()[0]
  return day > oldest || fromLive.length >= fromSnapshot.length ? fromLive : fromSnapshot
}
