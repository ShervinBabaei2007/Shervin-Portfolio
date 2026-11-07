import { useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, m } from 'motion/react'
import MoreOnGitHub from '@/components/home/MoreOnGitHub'
import ProjectCard from '@/components/home/ProjectCard'
import PageIntro from '@/components/shared/PageIntro'
import { Button } from '@/components/ui/button'
import { projects } from '../data/projects'

const loadMotion = () => import('../lib/motionFeatures').then((module) => module.default)

const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

function ProjectsPage() {
  // Flagship projects first, then the rest in their data order.
  const ordered = [...projects.filter((p) => p.flagship), ...projects.filter((p) => !p.flagship)]
  const [category, setCategory] = useState('All')
  const shown = category === 'All' ? ordered : ordered.filter((p) => p.category === category)
  const count = (name: string) => (name === 'All' ? projects.length : projects.filter((p) => p.category === name).length)

  return (
    <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="projects-title">
      <PageIntro
        eyebrow="PROJECTS"
        id="projects-title"
        title="Everything I've built"
        lead="The full set, from the hackathon app to a Discord bot. Each one has a case study on what I built, what broke and what I would change."
      />
      <div role="group" aria-label="Filter projects by type" className="mt-6 flex flex-wrap gap-2">
        {categories.map((name) => (
          <Button
            key={name}
            type="button"
            size="sm"
            variant={category === name ? 'default' : 'outline'}
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
          >
            {name} <span className="tabular-nums opacity-90">{count(name)}</span>
          </Button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
      </p>
      <h2 className="sr-only">All projects</h2>
      {/* Filtering slides the remaining cards into place instead of jumping; reduced motion turns it off. */}
      <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease: 'easeOut' }}>
        <LazyMotion features={loadMotion}>
          <m.ul layout className="m-0 mt-6 grid list-none gap-6 p-0 md:grid-cols-2">
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map((project, index) => (
                <m.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
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
      <MoreOnGitHub />
    </section>
  )
}

export default ProjectsPage
