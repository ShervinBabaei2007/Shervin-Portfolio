// Saves your most recently pushed public repositories to src/data/github.json,
// so the "Recently on GitHub" list is in the prerendered HTML even if the
// visitor's browser can't reach the GitHub API (it allows 60 unauthenticated
// requests per hour per IP, which a shared office network can use up).
//
// Runs at the start of `npm run build`. Never fails the build: if GitHub is
// unreachable, the previous snapshot is kept. Set GITHUB_TOKEN (any token with
// no scopes) in Vercel's environment variables for a higher rate limit.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { root } from './lib.mjs'

const target = resolve(root, 'src/data/github.json')
const siteSource = readFileSync(resolve(root, 'src/data/site.ts'), 'utf8')
const user = siteSource.match(/github:\s*'https:\/\/github\.com\/([^'/]+)'/)?.[1]

try {
  if (!user) throw new Error('could not read the GitHub username from src/data/site.ts')
  const response = await fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=12&type=owner`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
  const repos = (await response.json())
    .filter((repo) => !repo.fork && !repo.private)
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushed_at,
    }))
  writeFileSync(target, `${JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2)}\n`)
  console.log(`github snapshot: ${repos.length} repositories`)
} catch (error) {
  console.warn(`github snapshot skipped (${error.message}); keeping the existing src/data/github.json`)
}
