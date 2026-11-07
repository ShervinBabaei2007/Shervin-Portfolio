import Reveal from '@/components/shared/Reveal'
import { facts } from '@/data/facts'
import { notes } from '@/data/notes'
import { projects } from '@/data/projects'
import { skillTabs } from '@/data/skills'

// Every figure is counted from the site's own data, so it cannot drift from what the page shows below.
const technologies = new Set(skillTabs.flatMap((group) => group.skills.map((skill) => skill.name))).size
const placement = Number(facts.hackathon.placement.match(/\d+/)?.[0])

const figures = [
  { value: projects.length, prefix: '', label: 'Projects built', detail: 'each with a case study' },
  { value: technologies, prefix: '', label: 'Technologies used', detail: 'across those projects' },
  { value: notes.length, prefix: '', label: 'Writeups', detail: 'on bugs, fixes and design choices' },
  { value: placement, prefix: 'Top ', label: `of ${facts.hackathon.teams} teams`, detail: facts.hackathon.name },
]

/** A short row of numbers between the hero and the work: what has been built, at a glance. */
function AtAGlance() {
  return (
    <section className="section-wrap pb-6 max-[620px]:pb-2" aria-label="At a glance">
      <ul className="m-0 grid list-none grid-cols-4 overflow-hidden rounded-xl border bg-card p-0 max-[900px]:grid-cols-2">
        {figures.map((figure, index) => (
          <Reveal key={figure.label} delay={index * 0.07}>
            <li className="border-r px-6 py-6 last:border-r-0 max-[900px]:border-b max-[900px]:odd:border-r max-[900px]:even:border-r-0 max-[900px]:nth-last-[-n+2]:border-b-0 max-[620px]:px-4 max-[620px]:py-5">
              <p className="text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] leading-none font-semibold tracking-tight">
                {figure.prefix}
                {figure.value}
              </p>
              <p className="mt-3 font-mono text-label tracking-wide text-primary uppercase">{figure.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{figure.detail}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

export default AtAGlance
