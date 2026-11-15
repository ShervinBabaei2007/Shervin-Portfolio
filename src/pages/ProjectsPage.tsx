import { useState } from 'react'
import { ArrowLeft, ArrowRight, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatePresence, LazyMotion, MotionConfig, m } from 'motion/react'
import MoreOnGitHub from '@/components/home/MoreOnGitHub'
import ProjectCard from '@/components/home/ProjectCard'
import FilterBar from '@/components/shared/FilterBar'
import PageIntro from '@/components/shared/PageIntro'
import { Button } from '@/components/ui/button'
import { projects } from '../data/projects'
import { tone } from '@/lib/buttonTones'
import { loadMotion } from '@/lib/loadMotion'
import { cn } from '@/lib/utils'

// "All" plus each project category once, in the order they first appear.
const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

// Flagship projects first, then the rest in their data order.
const ordered = [...projects.filter((p) => p.flagship), ...projects.filter((p) => !p.flagship)]

/** The /projects page: every project, filterable by category. */
function ProjectsPage() {
  const [category, setCategory] = useState('All')
  const shown = category === 'All' ? ordered : ordered.filter((p) => p.category === category)
  // How many projects a filter button would show.
  const count = (name: string) =>
    name === 'All' ? projects.length : projects.filter((p) => p.category === name).length

  return (
    <section aria-labelledby="projects-title">
      {/* The projects sit on the tinted band used for Work on the home page, so the cards read as raised. */}
      <div className="section-band">
        <div className="section-wrap page-y">
          <Button asChild size="lg" className={cn('mb-6 font-semibold shadow-md', tone.ink)}>
            <Link to="/#work">
              <ArrowLeft aria-hidden="true" /> Back to Home
            </Link>
          </Button>
          <PageIntro
            eyebrow="PROJECTS"
            id="projects-title"
            title="Everything I've built"
            action={
              <Button asChild size="lg" className={cn('font-semibold shadow-md', tone.writeup)}>
                <Link to="/writeups">
                  <NotebookPen size={16} /> Writeups <ArrowRight size={15} />
                </Link>
              </Button>
            }
            lead="The full set, from the hackathon app to a Discord bot. Each one has a case study on what I built, what broke and what I would change."
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <FilterBar
              label="Filter projects by type"
              value={category}
              onChange={setCategory}
              options={categories.map((name) => ({ value: name, label: name, count: count(name) }))}
            />
            <span className="font-mono text-label text-muted-foreground" aria-hidden="true">
              Showing {shown.length} of {projects.length}
            </span>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
          </p>
          <h2 className="sr-only">All projects</h2>
          {/* Filtering slides the remaining cards into place instead of jumping; reduced motion turns it off. */}
          <MotionConfig
            reducedMotion="user"
            transition={{
              layout: { type: 'spring', stiffness: 260, damping: 32 },
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <LazyMotion features={loadMotion}>
              <m.ul layout className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:items-stretch">
                <AnimatePresence initial={false} mode="popLayout">
                  {shown.map((project, index) => (
                    <m.li
                      key={project.slug}
                      layout
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: Math.min(index, 7) * 0.04 } }}
                      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                      className="flex"
                    >
                      <div className="flex w-full [&>*]:h-full [&>*]:w-full">
                        <ProjectCard project={project} revealDelay={(index % 2) * 0.08} />
                      </div>
                    </m.li>
                  ))}
                </AnimatePresence>
              </m.ul>
            </LazyMotion>
          </MotionConfig>
        </div>
      </div>
      <div className="section-wrap pb-[var(--space-page)]">
        <MoreOnGitHub />
      </div>
    </section>
  )
}

export default ProjectsPage
