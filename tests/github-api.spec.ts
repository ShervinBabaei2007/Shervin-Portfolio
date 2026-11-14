import { expect, test } from '@playwright/test'
import { GET } from '../api/github-commits'
import { site } from '../src/data/site'
import { commitSearchUrl } from '../src/lib/githubCommits'

// A Vercel function may not import from src/, so api/github-commits.ts keeps its own copy of the user name and the
// search query. This asks the function what it would send to GitHub and compares it with the shared builder the
// browser and the build script use, so the copies cannot drift apart.
test('the commits function asks GitHub for the same user and query as the site', async () => {
  const realFetch = globalThis.fetch
  let requested = ''
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    requested = String(input)
    return new Response(JSON.stringify({ items: [] }))
  }) as typeof fetch
  try {
    const response = await GET()
    expect(response.status).toBe(200)
  } finally {
    globalThis.fetch = realFetch
  }
  expect(requested).toBe(commitSearchUrl(site.github.split('/').pop() as string))
})
