// Tells you which public repos deserve a case study, so you never have to compare them by hand.
// Usage: npm run rank            prints the ranking
//        npm run rank -- --out suggestions.md   also writes a Markdown note (only when there is something to say)
//
// It reads src/data/repos.json (refresh it with `npm run repos`) and src/data/projects.ts. A repo is a
// candidate when it has no case study and scores at least as high as your lowest-scoring flagship.
import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { importTs, root } from './lib.mjs'

const { projects } = await importTs('src/data/projects.ts')
const { repos } = JSON.parse(readFileSync(resolve(root, 'src/data/repos.json'), 'utf8'))

const key = (url) => url?.toLowerCase().replace(/\/+$/, '')
const byUrl = new Map(repos.map((repo) => [key(repo.url), repo]))
const curated = new Set(projects.flatMap((project) => [key(project.github), key(project.teamRepo)]))

const scored = (project) => byUrl.get(key(project.github)) ?? byUrl.get(key(project.teamRepo))
const flagships = projects.filter((project) => project.flagship)
const flagshipScores = flagships.map((project) => scored(project)?.score).filter((score) => score !== undefined)
const bar = flagshipScores.length ? Math.min(...flagshipScores) : 0

const row = (name, repo, tag) =>
  `${String(repo?.score ?? '-').padStart(5)}  ${name.padEnd(30)} ${String(repo?.commits ?? '-').padStart(4)} commits  ${repo?.homepage ? 'live' : '    '}  ${tag}`

console.log('Your projects, by score\n')
for (const project of projects)
  console.log(row(project.name, scored(project), project.flagship ? 'FLAGSHIP' : 'case study'))

const candidates = repos.filter((repo) => !curated.has(key(repo.url)) && repo.score >= bar)
console.log(`\nNo case study yet, scoring at or above your lowest flagship (${bar}):\n`)
if (candidates.length === 0) console.log('  none: nothing is waiting to be featured')
for (const repo of candidates) console.log(row(repo.name, repo, repo.url))

const outIndex = process.argv.indexOf('--out')
if (outIndex !== -1 && candidates.length) {
  const lines = candidates.map(
    (repo) =>
      `- [${repo.name}](${repo.url}): score ${repo.score}, ${repo.commits ?? '?'} commits${repo.homepage ? ', has a live demo' : ''}. ${repo.description}`,
  )
  writeFileSync(
    process.argv[outIndex + 1],
    `These public repositories have no case study yet but score at least as high as your lowest flagship (${bar}).\n\n${lines.join('\n')}\n\nTo feature one, add an entry to \`src/data/projects.ts\` (copy an existing one) and set \`flagship: true\` to put it on the home page. Until then, each appears under "More on GitHub" on the Projects page automatically.\n`,
  )
}
