import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react'
import snapshot from '@/data/github.json'
import { site } from '@/data/site'
import {
  buildWeeks,
  commitSearchUrl,
  commitsForDay,
  commitUrl,
  countByDay,
  dayOf,
  level,
  mergeDays,
  monthLabels,
  parseCommits,
  repoName,
  summarize,
  type Commit,
  type CommitsByDay,
  type DayCounts,
} from '@/lib/githubCommits'
import Reveal from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

// Every commit grouped by day is about 100 KB, so it is a separate chunk, fetched when a day is first used.
const loadCommits = () => import('@/data/github-commits.json')

const user = site.github.split('/').pop() as string
const CACHE_KEY = 'github-commits-v2'
const CACHE_MS = 15 * 60 * 1000
const FRESH_DAYS = 90
const WEEKS = 52
const SHOWN = 6

type Data = { days: DayCounts; commits: Commit[]; asOf: string }

/**
 * A history that stopped months ago signals the opposite of what this section is
 * for, so it only shows when the newest commit is recent. For the build snapshot,
 * "recent" is measured from when the snapshot was taken, which keeps the server
 * and browser markup identical; live data is checked against now.
 */
const isFresh = (commits: Commit[], reference: number) =>
  commits.some((commit) => reference - new Date(commit.date).getTime() < FRESH_DAYS * 86_400_000)

const snapshotData: Data | null = snapshot.fetchedAt
  ? {
      days: snapshot.days as DayCounts,
      commits: snapshot.commits as Commit[],
      asOf: dayOf(snapshot.fetchedAt),
    }
  : null
const snapshotIsFresh = snapshotData !== null && isFresh(snapshotData.commits, Date.parse(snapshot.fetchedAt as string))

const absolute = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Vancouver',
  })

function relative(iso: string, now: number) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000)
  if (minutes < 60) return `${Math.max(minutes, 1)} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? 'a month ago' : `${months} months ago`
}

const levelClass = ['bg-muted', 'bg-primary/25', 'bg-primary/45', 'bg-primary/70', 'bg-primary']

const getJson = (url: string, init?: RequestInit) =>
  fetch(url, init).then((response) =>
    response.ok ? response.json() : Promise.reject(new Error(String(response.status))),
  )

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
 * Commit history for every public repository: a contribution grid plus the latest
 * commits. The build-time snapshot is in the prerendered HTML; after load, the
 * browser asks the GitHub API for the newest commits (cached for 15 minutes),
 * merges them into the snapshot, and quietly keeps the snapshot if that fails.
 */
function GitHubActivity() {
  const [data, setData] = useState<Data | null>(snapshotIsFresh ? snapshotData : null)
  const [live, setLive] = useState(false)
  const [now, setNow] = useState<number | null>(null)
  /** The newest commits from the live request (empty until it succeeds). */
  const [liveCommits, setLiveCommits] = useState<Commit[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [byDay, setByDay] = useState<CommitsByDay | null>(null)
  const [dayStatus, setDayStatus] = useState<'idle' | 'loading' | 'error'>('idle')

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
    // The site's own function first (shared and cached); GitHub directly when it is not available, such as in local development.
    loadSearchPage()
      .then((body: { items: Parameters<typeof parseCommits>[0] }) => {
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

  const scroller = useRef<HTMLDivElement>(null)
  // On a narrow screen the grid scrolls sideways; start at the newest week.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth
  }, [data])

  if (!data) return null

  const weeks = buildWeeks(data.days, data.asOf, WEEKS)
  const stats = summarize(weeks)
  const months = monthLabels(weeks)
  const cols = { gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }

  const selectDay = (day: string) => {
    if (selectedDay === day) return setSelectedDay(null)
    setSelectedDay(day)
    if (byDay || dayStatus === 'loading') return
    setDayStatus('loading')
    loadCommits().then(
      (module) => {
        setByDay(module.default as unknown as CommitsByDay)
        setDayStatus('idle')
      },
      () => setDayStatus('error'),
    )
  }

  /** The menu's way to pick a day (or go back to the latest commits with an empty value). */
  const chooseDay = (day: string) => {
    if (!day) return setSelectedDay(null)
    if (day !== selectedDay) selectDay(day)
  }
  /** Days with at least one commit, newest first. */
  const activeDays = weeks
    .flat()
    .filter((cell) => !cell.future && cell.count > 0)
    .map((cell) => ({ day: cell.day, count: cell.count }))
    .reverse()

  const showDay = selectedDay !== null && dayStatus !== 'error'
  const dayCommits = selectedDay && byDay ? commitsForDay(selectedDay, byDay, liveCommits) : []
  const dayTitle = selectedDay ? longDay(selectedDay) : ''

  return (
    <Reveal>
      <div className="relative rounded-xl border bg-card p-6 max-[620px]:p-4 md:p-8" data-github>
        {live && <BorderBeam size={140} duration={9} colorFrom="var(--primary)" colorTo="var(--ring)" />}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            <h3 className="flex items-center gap-2.5 text-xl font-semibold">
              <Github size={20} aria-hidden="true" /> Commit history
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Every commit to my public repositories over the last year. Select a day to see what I committed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-label text-muted-foreground">
              <span
                className={cn('size-2 rounded-full', live ? 'bg-emerald-500' : 'bg-muted-foreground/50')}
                aria-hidden="true"
              />
              {live ? 'Live from GitHub' : 'Updated at last deploy'}
            </span>
            <a
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary no-underline hover:underline"
              href={site.github}
              target="_blank"
              rel="noreferrer"
            >
              @{user} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-4">
          {[
            ['Commits', stats.total.toLocaleString('en-CA')],
            ['Active days', stats.activeDays.toLocaleString('en-CA')],
            ['Longest streak', <span key="s">{stats.longestStreak} days</span>],
            ['Busiest day', <span key="b">{stats.busiest} commits</span>],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-card px-4 py-3.5">
              <dt className="font-mono text-label tracking-wide text-muted-foreground uppercase">{label}</dt>
              <dd className="mt-1 text-2xl leading-none font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <div
          ref={scroller}
          className="mt-6 overflow-x-auto p-1 pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          role="region"
          aria-label="Commit activity by day. Scrolls sideways on small screens."
          // A scrollable area must be reachable by keyboard (WCAG 2.1.1), or keyboard users cannot scroll it.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div
            className="grid min-w-[44rem] grid-cols-[auto_minmax(0,1fr)] gap-x-2.5 gap-y-1.5"
            role="group"
            aria-label={`Commit activity for the last year: ${stats.total} commits on ${stats.activeDays} days`}
            data-heatmap
          >
            <span aria-hidden="true" />
            <div className="grid gap-[3px] font-mono text-label text-muted-foreground" style={cols} aria-hidden="true">
              {months.map(({ column, name }) => (
                <span key={column} className="whitespace-nowrap" style={{ gridColumn: `${column + 1} / span 3` }}>
                  {name}
                </span>
              ))}
            </div>
            <div className="grid grid-rows-7 gap-[3px] font-mono text-label text-muted-foreground" aria-hidden="true">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, index) => (
                <span key={index} className="flex items-center leading-none">
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={cols}>
              {weeks
                .flatMap((week, column) => week.map((cell) => ({ ...cell, column })))
                .map((cell) => {
                  if (cell.future) return <span key={cell.day} aria-hidden="true" />
                  const box = cn('aspect-square rounded-[3px]', levelClass[level(cell.count)])
                  const stagger = { '--col': cell.column } as React.CSSProperties
                  const noun = `commit${cell.count === 1 ? '' : 's'}`
                  if (cell.count === 0) {
                    return (
                      <span
                        key={cell.day}
                        className={box}
                        style={stagger}
                        data-cell
                        title={`No commits on ${cell.day}`}
                        aria-hidden="true"
                      />
                    )
                  }
                  // The cells are 10px squares, too small to be touch targets of their own, so they are a pointer
                  // shortcut only (hidden from assistive tech). The "Show commits for" menu below does the same for everyone.
                  return (
                    <span
                      key={cell.day}
                      className={cn(
                        box,
                        'cursor-pointer transition-shadow hover:ring-2 hover:ring-foreground/60',
                        selectedDay === cell.day && 'ring-2 ring-foreground',
                      )}
                      title={`${cell.count} ${noun} on ${cell.day}`}
                      style={stagger}
                      data-cell
                      data-day={cell.day}
                      data-selected={selectedDay === cell.day}
                      aria-hidden="true"
                      onPointerEnter={() => void loadCommits()}
                      onClick={() => selectDay(cell.day)}
                    />
                  )
                })}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
            Show commits for
            <select
              className="h-10 max-w-[16rem] rounded-md border bg-card px-2.5 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              value={selectedDay ?? ''}
              onFocus={() => void loadCommits()}
              onChange={(event) => chooseDay(event.target.value)}
            >
              <option value="">Latest commits</option>
              {activeDays.map(({ day, count }) => (
                <option key={day} value={day}>
                  {longDay(day)} ({count})
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1.5 font-mono text-label text-muted-foreground" aria-hidden="true">
            Less
            {levelClass.map((name) => (
              <span key={name} className={cn('size-3 rounded-[3px]', name)} />
            ))}
            More
          </div>
        </div>

        <div className="mt-8" aria-live="polite" data-commit-panel>
          {showDay && selectedDay ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b pb-3">
                <h4 className="font-mono text-label tracking-wide text-muted-foreground uppercase">
                  Commits on {dayTitle} · {data.days[selectedDay] ?? dayCommits.length}
                </h4>
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedDay(null)}>
                  <ArrowLeft aria-hidden="true" /> Show latest commits
                </Button>
              </div>
              {dayStatus === 'loading' && !byDay ? (
                <p className="flex items-center gap-2.5 py-6 text-sm text-muted-foreground">
                  <Spinner aria-hidden="true" role="presentation" /> Loading commits…
                </p>
              ) : (
                <CommitList commits={dayCommits} now={now} showTime className="max-h-[26rem] overflow-y-auto" />
              )}
            </>
          ) : (
            <>
              <h4 className="border-b pb-3 font-mono text-label tracking-wide text-muted-foreground uppercase">
                Latest commits
              </h4>
              {selectedDay && dayStatus === 'error' && (
                <p className="pt-3 text-sm text-muted-foreground">Couldn&apos;t load that day&apos;s commits.</p>
              )}
              <CommitList
                commits={data.commits.slice(0, SHOWN)}
                now={now}
                className="max-md:[&>li:nth-child(n+4)]:hidden"
              />
            </>
          )}
        </div>
      </div>
    </Reveal>
  )
}

const longDay = (day: string) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

type CommitListProps = { commits: Commit[]; now: number | null; showTime?: boolean; className?: string }

/** Commits as links to GitHub. `showTime` prints the author's local time of day instead of "x ago". */
function CommitList({ commits, now, showTime = false, className }: CommitListProps) {
  return (
    <ul className={cn('m-0 grid list-none p-0 md:grid-cols-2 md:gap-x-12 [&>li]:border-b', className)}>
      {commits.map((commit) => (
        <li key={commit.sha}>
          <a className="group grid gap-1 py-3.5 no-underline" href={commitUrl(commit)} target="_blank" rel="noreferrer">
            <span className="flex min-w-0 items-center gap-1.5 font-medium group-hover:text-primary">
              <span className="truncate">{commit.message}</span>
              <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
            </span>
            <span className="flex flex-wrap gap-x-3 font-mono text-label text-muted-foreground">
              <span>{repoName(commit)}</span>
              <span>{commit.sha}</span>
              {showTime ? (
                <time dateTime={commit.date}>{commit.date.slice(11, 16)}</time>
              ) : (
                <time dateTime={commit.date}>{now === null ? absolute(commit.date) : relative(commit.date, now)}</time>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default GitHubActivity
