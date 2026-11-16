/**
 * Newest public commits (Vercel Function). The page asks this first instead of calling GitHub from the
 * visitor's browser: GitHub's commit search allows 10 requests a minute per IP and, for browsers, answers
 * with an Access-Control-Allow-Origin value the browser rejects. This answer is shared and cached for 15
 * minutes, so every visitor costs at most one GitHub request per window.
 * Optional env var: GITHUB_TOKEN (any token with no scopes) for a higher rate limit.
 */
const USER = 'ShervinBabaei2007' // a Vercel function may not import from src/, so tests/github-api.spec.ts checks this against `site.github`

/** The parts of a GitHub commit search result this function keeps. */
type Item = {
  sha: string
  commit: { message: string; author: { date: string } }
  repository: { full_name: string; private: boolean }
}

// The last good answer this instance sent. If GitHub fails, a warm instance serves it again instead of an error.
let lastGood: string | null = null

/** Returns the newest 100 public commits, trimmed to what the page shows. */
export async function GET() {
  // Must equal commitSearchUrl(USER) in src/lib/githubCommits.ts; tests/github-api.spec.ts checks it.
  const url = `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${USER}`)}&sort=author-date&order=desc&per_page=100&page=1`
  // Stale data, cached for a minute, beats an error.
  const unavailable = () =>
    lastGood
      ? new Response(lastGood, {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=60' },
        })
      : new Response(JSON.stringify({ error: 'GitHub is unavailable.' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        })
  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-commit-history',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    })
  } catch (error) {
    console.error('github-commits: could not reach GitHub', error)
    return unavailable()
  }
  if (!response.ok) {
    console.error(`github-commits: GitHub answered ${response.status}`)
    return unavailable()
  }

  // Only the fields the page reads, so the response is a few KB instead of several hundred.
  const { items = [] } = (await response.json()) as { items?: Item[] }
  const slim = items.map((item) => ({
    sha: item.sha,
    commit: { message: item.commit.message.split('\n')[0], author: { date: item.commit.author.date } },
    repository: { full_name: item.repository.full_name, private: item.repository.private },
  }))
  lastGood = JSON.stringify({ items: slim })
  // Vercel's edge cache keeps it for 15 minutes, then serves the old copy for up to an hour while it refreshes.
  return new Response(lastGood, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
