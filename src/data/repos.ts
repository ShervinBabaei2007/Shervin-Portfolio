import snapshot from './repos.json'
import { projects } from './projects'

/*
 * Public repositories saved by scripts/repos-snapshot.mjs (run at every build and weekly in CI).
 * Any repo without a case study in projects.ts shows up on the Projects page by itself, so a new public
 * repo needs no edits here. To give one a case study, add it to projects.ts and it moves out of this list.
 */
export type Repo = {
  name: string
  url: string
  description: string
  language: string | null
  homepage: string | null
  topics: string[]
  stars: number
  pushedAt: string
  createdAt: string
  commits: number | null
  thumbnail: string | null
  score: number
}

export const repos = snapshot.repos as Repo[]

const key = (url: string | undefined) => url?.toLowerCase().replace(/\/+$/, '')
const curated = new Set(projects.flatMap((project) => [key(project.github), key(project.teamRepo)]))

/** Public repos that have no case study yet, best first. */
export const otherRepos = repos.filter((repo) => !curated.has(key(repo.url)))
