/**
 * Newest public commits (Vercel Function). The page asks this first instead of calling GitHub from the
 * visitor's browser: GitHub's commit search allows 10 requests a minute per IP and, for browsers, answers
 * with an Access-Control-Allow-Origin value the browser rejects. This answer is shared and cached for 15
 * minutes, so every visitor costs at most one GitHub request per window.
 * Optional env var: GITHUB_TOKEN (any token with no scopes) for a higher rate limit.
 */
const USER = 'ShervinBabaei2007' // keep in sync with `site.github` in src/data/site.ts

type Item = {
  sha: string
  commit: { message: string; author: { date: string } }
  repository: { full_name: string; private: boolean }
}

export async function GET() {
  const url = `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${USER}`)}&sort=author-date&order=desc&per_page=100`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'portfolio-commit-history',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  })
  if (!response.ok) return new Response(JSON.stringify({ error: 'GitHub is unavailable.' }), { status: 502 })

  // Only the fields the page reads, so the response is a few KB instead of several hundred.
  const { items = [] } = (await response.json()) as { items?: Item[] }
  const slim = items.map((item) => ({
    sha: item.sha,
    commit: { message: item.commit.message.split('\n')[0], author: { date: item.commit.author.date } },
    repository: { full_name: item.repository.full_name, private: item.repository.private },
  }))
  return new Response(JSON.stringify({ items: slim }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
