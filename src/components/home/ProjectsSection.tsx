import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flagshipProjects, moreProjects } from '@/data/projects'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import ProjectCard from '@/components/home/ProjectCard'
import SectionHeading from '@/components/shared/SectionHeading'

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
      <SectionHeading
        id="work-title"
        number="02"
        eyebrow="SELECTED WORK"
        title="Built, broken, understood"
        aside={
          <>
            The useful part isn&apos;t just what shipped. It&apos;s the <br />
            assumption each project forced me to rethink.
          </>
        }
      />
      {activeSkill && (
        <p className="active-skill-filter" aria-live="polite">
          Showing projects that use <strong>{activeSkill}</strong>.
          <button type="button" onClick={onClearSkill}>
            Clear skill filter
          </button>
        </p>
      )}
      {flagships.length > 0 && (
        <Carousel
          opts={{ align: 'start', breakpoints: { '(min-width: 768px)': { active: false } } }}
          aria-label="Featured projects"
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4 md:ml-0 md:grid md:grid-cols-2 md:gap-6">
            {flagships.map((project) => (
              <CarouselItem key={project.slug} className="basis-[88%] sm:basis-[70%] md:basis-auto md:pl-0">
                <ProjectCard project={project} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex md:hidden" />
          <CarouselNext className="hidden sm:inline-flex md:hidden" />
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
