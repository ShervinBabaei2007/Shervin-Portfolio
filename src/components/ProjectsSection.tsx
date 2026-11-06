import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flagshipProjects, moreProjects } from '../data/projects'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ProjectCard from './ProjectCard'

type ProjectsSectionProps = {
  activeSkill: string | null
  onClearSkill: () => void
}

function ProjectsSection({ activeSkill, onClearSkill }: ProjectsSectionProps) {
  const matches = (stack: string[]) => !activeSkill || stack.includes(activeSkill)
  const flagships = flagshipProjects.filter((project) => matches(project.stack))
  const others = moreProjects.filter((project) => matches(project.stack))

  return (
    <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-mark">02</span> SELECTED WORK
          </p>
          <h2 id="work-title">
            Built, broken, understood<span>.</span>
          </h2>
        </div>
        <p className="section-aside">
          The useful part isn&apos;t just what shipped. It&apos;s the <br />
          assumption each project forced me to rethink.
        </p>
      </div>
      {activeSkill && (
        <p className="active-skill-filter" aria-live="polite">
          Showing projects that use <strong>{activeSkill}</strong>.
          <button type="button" onClick={onClearSkill}>
            Clear skill filter
          </button>
        </p>
      )}
      {flagships.length > 0 && (
        <Carousel opts={{ align: 'start' }} aria-label="Featured projects" className="mx-auto w-full px-0 sm:px-12">
          <CarouselContent>
            {flagships.map((project) => (
              <CarouselItem key={project.slug} className="lg:basis-1/2">
                <ProjectCard project={project} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex" />
          <CarouselNext className="hidden sm:inline-flex" />
        </Carousel>
      )}
      {others.length > 0 && (
        <div className="more-projects">
          <h3>More projects</h3>
          <ul>
            {others.map((project) => (
              <li key={project.slug}>
                <Link to={`/work/${project.slug}`}>
                  <span className="more-projects-name">{project.name}</span>
                  <span className="more-projects-subtitle">{project.subtitle}</span>
                  <span className="more-projects-stack">{project.stack.slice(0, 3).join(', ')}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {flagships.length === 0 && others.length === 0 && (
        <p className="active-skill-filter">No projects use {activeSkill} yet.</p>
      )}
    </section>
  )
}

export default ProjectsSection
