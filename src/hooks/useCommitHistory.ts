import { useCallback, useEffect, useState } from 'react'
import snapshot from '@/data/github.json'
import { site } from '@/data/site'
import {
  commitSearchUrl,
  commitsForDay,
  countByDay,
  dayOf,
  mergeDays,
  parseCommits,
  type Commit,
  type CommitsByDay,
  type DayCounts,
} from '@/lib/githubCommits'

// Every commit grouped by day is about 100 KB, so it is a separate chunk, fetched when a day is first used.
const loadCommitsByDay = () => import('@/data/github-commits.json')

// The GitHub username, taken from the end of the profile URL.
const user = site.github.split('/').pop() as string
// sessionStorage key for the live result; bump the version when its shape changes.
const CACHE_KEY = 'github-commits-v2'
const CACHE_MS = 15 * 60 * 1000
// The newest commit must be younger than this for the history to show.
const FRESH_DAYS = 90

/** Commit counts per day, the newest commits, and the day the data is from. */
export type CommitHistoryData = { days: DayCounts; commits: Commit[]; asOf: string }
// Progress of the by-day commit download.
type DayStatus = 'idle' | 'loading' | 'error'

/**
 * A history that stopped months ago signals the opposite of what this section is
 * for, so it only shows when the newest commit is recent. For the build snapshot,
 * "recent" is measured from when the snapshot was taken, which keeps the server
 * and browser markup identical; live data is checked against now.
 */
const isFresh = (commits: Commit[], reference: number) =>
  commits.some((commit) => reference - new Date(commit.date).getTime() < FRESH_DAYS * 86_400_000)

/** Merged pull requests over the last year, counted at build time (see scripts/github-snapshot.mjs). */
const mergedPrs = (snapshot as { mergedPrs?: number | null }).mergedPrs ?? null

// The build-time snapshot in the hook's data shape (null if the snapshot step never succeeded).
const snapshotData: CommitHistoryData | null = snapshot.fetchedAt
  ? {
      days: snapshot.days as DayCounts,
      commits: snapshot.commits as Commit[],
      asOf: dayOf(snapshot.fetchedAt),
    }
  : null
const snapshotIsFresh = snapshotData !== null && isFresh(snapshotData.commits, Date.parse(snapshot.fetchedAt as string))

// Fetches JSON, treating any non-2xx response as an error.
const getJson = (url: string, init?: RequestInit) =>
  fetch(url, init).then((response) =>
    response.ok ? response.json() : Promise.reject(new Error(String(response.status))),
  )

/** The site's own function first (shared and cached); GitHub directly when it is not available, such as in local development. */
async function loadSearchPage(): Promise<{ items: Parameters<typeof parseCommits>[0] }> {
  try {
    const body = await getJson('/api/github-commits')
    if (Array.isArray(body?.items)) return body
  } catch {
    /* no function here (or it failed): ask GitHub directly */
  }
  return getJson(commitSearchUrl(user), { headers: { Accept: 'application/vnd.github+json' } })
}

/**
 * The commit history behind the "Commit history" card: the build-time snapshot first (so the prerendered HTML and
 * the first browser render match), then, after mount, the newest commits from GitHub merged into it (cached for 15
 * minutes in sessionStorage). A failed or rate-limited request quietly keeps the snapshot.
 *
 * `data` is null when there is no history recent enough to show. `loadDays()` fetches every commit grouped by day
 * on first use (safe to call repeatedly, and it retries after an error); `commitsOn(day)` then lists that day's commits.
 */
export function useCommitHistory() {
  const [data, setData] = useState<CommitHistoryData | null>(snapshotIsFresh ? snapshotData : null)
  const [live, setLive] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  /** The newest commits from the live request (empty until it succeeds). */
  const [liveCommits, setLiveCommits] = useState<Commit[]>([])
  const [byDay, setByDay] = useState<CommitsByDay | null>(null)
  const [dayStatus, setDayStatus] = useState<DayStatus>('idle')

  // After mount: use the cached live result if it is recent, otherwise fetch the newest commits.
  useEffect(() => {
    setNow(Date.now())
    let cancelled = false
    // `complete` is true when the search returned fewer than a full page, so it already holds every commit.
    const apply = (commits: Commit[], complete: boolean) => {
      if (cancelled || !isFresh(commits, Date.now())) return
      const days = mergeDays(snapshotData?.days ?? {}, countByDay(commits), commits, complete)
      setData({ days, commits, asOf: new Date().toISOString().slice(0, 10) })
      setLiveCommits(commits)
      setLive(true)
    }
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as {
        at: number
        commits: Commit[]
        complete: boolean
      } | null
      if (cached && Date.now() - cached.at < CACHE_MS) return apply(cached.commits, cached.complete)
    } catch {
      /* storage unavailable */
    }
    loadSearchPage()
      .then((body) => {
        const commits = parseCommits(body.items)
        const complete = body.items.length < 100 // counted before private repositories are filtered out
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), commits, complete }))
        } catch {
          /* storage unavailable */
        }
        apply(commits, complete)
      })
      .catch(() => {
        /* rate-limited or offline: keep the snapshot */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Downloads the by-day commit list once; does nothing if it is loaded or already loading.
  const loadDays = useCallback(() => {
    if (byDay || dayStatus === 'loading') return
    setDayStatus('loading')
    loadCommitsByDay().then(
      (module) => {
        setByDay(module.default as unknown as CommitsByDay)
        setDayStatus('idle')
      },
      () => setDayStatus('error'),
    )
  }, [byDay, dayStatus])

  // The commits on one day (empty until loadDays has finished).
  const commitsOn = useCallback(
    (day: string) => (byDay ? commitsForDay(day, byDay, liveCommits) : []),
    [byDay, liveCommits],
  )

  return { data, live, now, user, mergedPrs, loadDays, commitsOn, daysLoaded: byDay !== null, dayStatus }
}
