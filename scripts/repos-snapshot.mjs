// Saves your public GitHub repositories to src/data/repos.json, so the "More on GitHub" list on the
// Projects page updates itself: push a new public repo and it appears at the next build, with a
// description (the repo's own, or the first paragraph of its README) and a preview thumbnail saved to
// public/repos/. Repos that already have a case study in src/data/projects.ts are left out of that list
// on the page, not here, so this file is simply "everything public".
//
// Each repo also gets a `score` (see scoreRepo) that `npm run rank` uses to suggest which repos deserve a
// case study. Nothing here decides what is "selected work": that stays your call, in projects.ts.
//
// Runs at the start of `npm run build` and weekly in .github/workflows/sync-repos.yml. Never fails the
// build: if GitHub is unreachable, the previous snapshot is kept. Set GITHUB_TOKEN (any token, no scopes)
// for a higher rate limit. Details already fetched for an unchanged repo (commit count, README summary)
// are reused, so a normal build makes one or two API calls.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { root } from './lib.mjs'

/** Repos whose name matches are coursework or old sites, not projects. */
const EXCLUDE_NAME = /portfolio|resume|^comp\d|week\d|class|lab\d|-lab$|_lab$|exercise|assignment|practice/i
/** Repo names to hide whatever the rules say (exact, case-insensitive). */
const HIDE = []

const summaryFile = resolve(root, 'src/data/repos.json')
const thumbDir = resolve(root, 'public/repos')
const siteSource = readFileSync(resolve(root, 'src/data/site.ts'), 'utf8')
const user = siteSource.match(/github:\s*'https:\/\/github\.com\/([^'/]+)'/)?.[1]

const headers = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}
const api = async (path, extra = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { ...headers, ...extra },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`GitHub responded ${response.status} for ${path}`)
  return response
}

/** README paragraphs that are legal notices, not a description. */
const BOILERPLATE = /viewing purposes|all rights reserved|licen[sc]e|copyright|permission/i

/** First plain paragraph of a README: no headings, badges, images, tables, HTML or code. */
function readmeSummary(markdown) {
  const clean = (line) =>
    line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`>]/g, '')
      .replace(/<[^>]+>/g, '')
      .trim()
  let paragraph = []
  let inCode = false
  for (const raw of markdown.split(/\r?\n/)) {
    if (raw.trim().startsWith('```')) inCode = !inCode
    if (inCode) continue
    const line = raw.trim()
    const skip = !line || /^(#|\||<|---|===|- |\* |\d+\.)/.test(line) || !clean(line) || BOILERPLATE.test(line)
    if (skip) {
      if (paragraph.length) break
      continue
    }
    paragraph.push(clean(line))
  }
  const text = paragraph.join(' ').replace(/\s+/g, ' ')
  return text.length > 220 ? `${text.slice(0, 217).trimEnd()}...` : text
}

/** How many commits `user` made, from the pagination link of a one-per-page listing. */
async function commitCount(repo) {
  const response = await api(`/repos/${user}/${repo}/commits?per_page=1&author=${user}`)
  const last = response.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/)?.[1]
  return last ? Number(last) : (await response.json()).length
}

/**
 * Roughly "how substantial and how finished": a live demo counts most, then real work (commits), then
 * recent activity. It is a nudge for `npm run rank`, not a judgement, so keep it simple and visible.
 */
function scoreRepo({ homepage, commits, pushedAt, stars, size }) {
  const days = (Date.now() - new Date(pushedAt).getTime()) / 86_400_000
  return Number(
    (
      (homepage ? 4 : 0) +
      Math.log2(1 + (commits ?? 0)) * 1.2 +
      (days <= 120 ? 2 : 0) +
      Math.log10(1 + size) * 0.5 +
      stars * 2
    ).toFixed(1),
  )
}

async function saveThumbnail(repo) {
  const file = resolve(thumbDir, `${repo}.webp`)
  if (existsSync(file)) return true
  try {
    const response = await fetch(`https://opengraph.githubassets.com/1/${user}/${repo}`, {
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) return false
    mkdirSync(thumbDir, { recursive: true })
    await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: 640 })
      .webp({ quality: 80 })
      .toFile(file)
    return true
  } catch {
    return false
  }
}

try {
  if (!user) throw new Error('could not read the GitHub username from src/data/site.ts')
  const previous = existsSync(summaryFile) ? JSON.parse(readFileSync(summaryFile, 'utf8')) : { repos: [] }
  const before = new Map(previous.repos.map((repo) => [repo.name, repo]))

  const listed = await (await api(`/users/${user}/repos?type=owner&per_page=100&sort=pushed`)).json()
  const hidden = new Set(HIDE.map((name) => name.toLowerCase()))
  const candidates = listed.filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      !repo.private &&
      repo.name.toLowerCase() !== user.toLowerCase() &&
      !EXCLUDE_NAME.test(repo.name) &&
      !hidden.has(repo.name.toLowerCase()),
  )

  const repos = []
  for (const repo of candidates) {
    const cached = before.get(repo.name)
    const unchanged = cached && cached.pushedAt === repo.pushed_at
    let { commits = null, description = repo.description ?? '' } = unchanged ? cached : {}
    if (!unchanged) {
      commits = await commitCount(repo.name).catch(() => cached?.commits ?? null)
      if ((repo.description ?? '').trim().length < 15) {
        const markdown = await api(`/repos/${user}/${repo.name}/readme`, { Accept: 'application/vnd.github.raw+json' })
          .then((response) => response.text())
          .catch(() => '')
        description = readmeSummary(markdown) || (repo.description ?? '')
      }
    }
    if (!description) continue // nothing to say about it yet
    const entry = {
      name: repo.name,
      url: repo.html_url,
      description,
      language: repo.language ?? null,
      homepage: repo.homepage || null,
      topics: repo.topics ?? [],
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      createdAt: repo.created_at,
      commits,
      thumbnail: (await saveThumbnail(repo.name)) ? `/repos/${repo.name}.webp` : null,
    }
    repos.push({ ...entry, score: scoreRepo({ ...entry, size: repo.size }) })
  }
  if (repos.length === 0) throw new Error('no public repositories found')

  repos.sort((a, b) => b.score - a.score || b.pushedAt.localeCompare(a.pushedAt))
  const next = `${JSON.stringify({ repos }, null, 2)}\n`
  if (!existsSync(summaryFile) || readFileSync(summaryFile, 'utf8') !== next) {
    writeFileSync(summaryFile, next)
    console.log(`repos snapshot: saved ${repos.length} repositories`)
  } else {
    console.log(`repos snapshot: ${repos.length} repositories, no changes`)
  }
} catch (error) {
  console.warn(`repos snapshot: kept the previous snapshot (${error.message})`)
}
