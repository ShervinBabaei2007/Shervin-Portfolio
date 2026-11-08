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
export type CommitsByDay = Record<string, CommitTuple[]>

/** Commits per calendar day, keyed `YYYY-MM-DD` in the author's own time zone. */
export type DayCounts = Record<string, number>

type SearchItem = {
  sha: string
  commit: { message: string; author: { date: string } }
  repository: { full_name: string; private: boolean }
}

export const commitSearchUrl = (user: string, page = 1) =>
  `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${user}`)}&sort=author-date&order=desc&per_page=100&page=${page}`

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

export const commitUrl = (commit: Commit) => `https://github.com/${commit.repo}/commit/${commit.sha}`
export const repoName = (commit: Commit) => commit.repo.split('/')[1] ?? commit.repo
export const toTuple = (commit: Commit): CommitTuple => [commit.sha, commit.repo, commit.message, commit.date]
export const fromTuple = ([sha, repo, message, date]: CommitTuple): Commit => ({ sha, repo, message, date })

export const dayOf = (iso: string) => iso.slice(0, 10)

export function countByDay(commits: Commit[]): DayCounts {
  const days: DayCounts = {}
  for (const commit of commits) days[dayOf(commit.date)] = (days[dayOf(commit.date)] ?? 0) + 1
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

const DAY = 86_400_000
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
export const level = (count: number) => (count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4)

/** Totals for the cells in view (future cells are ignored). */
export function summarize(weeks: ReturnType<typeof buildWeeks>) {
  const cells = weeks.flat().filter((cell) => !cell.future)
  let longest = 0
  let run = 0
  for (const cell of cells) {
    run = cell.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  return {
    total: cells.reduce((sum, cell) => sum + cell.count, 0),
    activeDays: cells.filter((cell) => cell.count > 0).length,
    longestStreak: longest,
    activeWeeks: weeks.filter((week) => week.some((cell) => !cell.future && cell.count > 0)).length,
    weeks: weeks.length,
  }
}

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
