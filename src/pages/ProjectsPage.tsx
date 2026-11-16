import { useState } from 'react'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import WorkCard from '@/components/shared/WorkCard'
import { projects, spotlightProjects } from '@/data/projects'
import { site } from '@/data/site'
import { outlinePill } from '@/lib/surfaces'
import { cn } from '@/lib/utils'

const categoryOrder: string[] = ['Full-stack', 'Hackathon', 'AI tools', 'Systems']

// "All", then each category that has a project, in a fixed order.
const filters = ['All', ...categoryOrder.filter((name) => projects.some((project) => project.category === name))]

// Flagship projects first, then the spotlight, then the rest grouped by category (keeping their data order inside a
// group).
const ordered = [
  ...projects.filter((project) => project.flagship),
  ...spotlightProjects,
  ...projects
    .filter((project) => !project.flagship && !spotlightProjects.includes(project))
    .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)),
]

const count = (name: string) =>
  name === 'All' ? projects.length : projects.filter((project) => project.category === name).length

/** The Work page: every project as a picture card, filterable by type. */
function ProjectsPage() {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? ordered : ordered.filter((project) => project.category === filter)

  return (
    <>
      <PageHero
        id="projects-title"
        command="ls ./work"
        title="Everything I've built"
        lead="The full set, from the hackathon app to a Discord bot. Each one has a case study on what I built, what broke and what I would change."
      />
      <section className="section-wrap pb-[clamp(88px,10vw,144px)]" aria-label="Projects">
        <div
          role="group"
          aria-label="Filter projects by type"
          className="flex flex-wrap gap-2 border-y border-foreground/15 py-5"
        >
          {filters.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={name === filter}
              onClick={() => setFilter(name)}
              className={cn(
                'inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[15px] transition-colors pointer-coarse:h-11',
                name === filter
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-foreground/20 bg-transparent text-foreground hover:border-foreground',
              )}
            >
              {name}
              <span className="font-mono text-[12px] opacity-75 max-[620px]:text-[13px]">{count(name)}</span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
        </p>
        <ul className="m-0 mt-[clamp(40px,5vw,64px)] grid list-none grid-cols-1 gap-x-[clamp(20px,2.4vw,32px)] gap-y-[clamp(44px,4.5vw,64px)] p-0 min-[1030px]:grid-cols-2">
          {shown.map((project, index) => (
            <li key={project.slug} data-project-card className="min-w-0">
              <WorkCard project={project} index={index} headingLevel="h2" />
            </li>
          ))}
        </ul>
        <Reveal>
          <div className="mt-[clamp(40px,5vw,56px)] flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <p className="m-0 text-base text-text-body">Smaller and older repositories live on GitHub.</p>
            <a href={site.github} target="_blank" rel="noreferrer" className={outlinePill}>
              More on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}

export default ProjectsPage
