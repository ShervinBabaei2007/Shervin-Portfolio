import { useEffect, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import snapshot from '@/data/github.json'
import { site } from '@/data/site'

type Repo = { name: string; url: string; description: string | null; language: string | null; pushedAt: string }

const user = site.github.split('/').pop()
const CACHE_KEY = 'github-activity'
const CACHE_MS = 15 * 60 * 1000
const FRESH_DAYS = 90

/**
 * A list of repos last pushed months ago signals the opposite of what this
 * section is for, so it only shows when the newest push is recent. For the
 * build snapshot, "recent" is measured from when the snapshot was taken, which
 * keeps the server and browser markup identical; live data is checked against now.
 */
const isFresh = (repos: Repo[], reference: number) =>
  repos.some((repo) => reference - new Date(repo.pushedAt).getTime() < FRESH_DAYS * 86_400_000)

const snapshotRepos = snapshot.repos as Repo[]
const snapshotIsFresh = snapshot.fetchedAt !== null && isFresh(snapshotRepos, new Date(snapshot.fetchedAt).getTime())

const absolute = (iso: string) =>
  new Date(iso).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Vancouver',
  })

function relative(iso: string, now: number) {
  const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return months === 1 ? 'a month ago' : `${months} months ago`
}

/**
 * Most recently pushed public repositories. The build-time snapshot is in the
 * prerendered HTML; after load, the browser asks the GitHub API for fresh data
 * (cached for 15 minutes) and quietly keeps the snapshot if that fails.
 */
function GitHubActivity() {
  const [repos, setRepos] = useState<Repo[]>(snapshotIsFresh ? snapshotRepos : [])
  const [live, setLive] = useState(false)
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    let cancelled = false
    const apply = (fresh: Repo[]) => {
      if (cancelled || !isFresh(fresh, Date.now())) return
      setRepos(fresh)
      setLive(true)
    }
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; repos: Repo[] } | null
      if (cached && Date.now() - cached.at < CACHE_MS) return apply(cached.repos)
    } catch {
      /* storage unavailable */
    }
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12&type=owner`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: Array<Repo & { html_url: string; pushed_at: string; fork: boolean }>) => {
        const fresh = data
          .filter((repo) => !repo.fork)
          .slice(0, 5)
          .map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            pushedAt: repo.pushed_at,
          }))
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos: fresh }))
        } catch {
          /* storage unavailable */
        }
        apply(fresh)
      })
      .catch(() => {
        /* rate-limited or offline: keep the snapshot */
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (repos.length === 0) return null

  return (
    <div className="border bg-card px-5 py-[18px]" data-github>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Github size={18} aria-hidden="true" /> Recently on GitHub
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {live ? 'Live from GitHub' : 'Updated at last deploy'}
        </span>
      </div>
      <ul className="m-0 mt-3 list-none p-0 [&>li+li]:border-t">
        {repos.map((repo) => (
          <li key={repo.name}>
            <a className="group grid gap-[3px] py-[11px] no-underline" href={repo.url} target="_blank" rel="noreferrer">
              <span className="inline-flex items-center gap-[5px] font-semibold [overflow-wrap:anywhere] group-hover:text-primary">
                {repo.name} <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              {repo.description && (
                <span className="text-sm leading-[1.45] text-muted-foreground">{repo.description}</span>
              )}
              <span className="flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-xs text-muted-foreground">
                {repo.language && <span>{repo.language}</span>}
                <span>
                  Pushed{' '}
                  <time dateTime={repo.pushedAt}>
                    {now === null ? absolute(repo.pushedAt) : relative(repo.pushedAt, now)}
                  </time>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GitHubActivity
