import { ArrowUpRight, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flagshipProjects, moreProjects } from '@/data/projects'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import GitHubActivity from '@/components/home/GitHubActivity'
import ProjectCard from '@/components/home/ProjectCard'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import SectionHeading from '@/components/shared/SectionHeading'
import { cn, textLinkClass } from '@/lib/utils'

type ProjectsSectionProps = {
  activeSkill: string | null
  onClearSkill: () => void
}

function ProjectsSection({ activeSkill, onClearSkill }: ProjectsSectionProps) {
  const matches = (stack: string[]) => !activeSkill || stack.includes(activeSkill)
  const flagships = flagshipProjects.filter((project) => matches(project.stack))
  const others = moreProjects.filter((project) => matches(project.stack))

  return (
    <section
      className="section-wrap pt-[72px] pb-[120px] max-[620px]:pt-12 max-[620px]:pb-14"
      id="work"
      aria-labelledby="work-title"
    >
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
        <p
          className="mt-3 flex flex-wrap items-center gap-[5px] text-sm text-muted-foreground [&_strong]:text-foreground"
          aria-live="polite"
        >
          Showing projects that use <strong>{activeSkill}</strong>.
          <button
            type="button"
            className="hit-area ml-2 border-b border-current py-1 font-semibold text-primary"
            onClick={onClearSkill}
          >
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
              <CarouselItem
                key={project.slug}
                className="basis-[88%] sm:basis-[70%] md:basis-auto md:pl-0 [&>*]:h-full"
              >
                <ProjectCard project={project} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex md:hidden" />
          <CarouselNext className="hidden sm:inline-flex md:hidden" />
        </Carousel>
      )}
      {others.length > 0 && (
        <div className="mt-14">
          <h3 className="mb-1.5 text-[1.375rem] font-semibold">More projects</h3>
          <ul className="m-0 list-none border-t p-0">
            {others.map((project) => (
              <li key={project.slug}>
                <Link
                  className="grid min-h-16 grid-cols-[minmax(150px,.8fr)_minmax(0,2fr)_minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b px-1 py-3 no-underline transition-colors hover:bg-card hover:text-primary max-[1100px]:grid-cols-[minmax(140px,.8fr)_minmax(0,2fr)_auto] max-[900px]:grid-cols-[1fr_auto] max-[900px]:gap-x-3 max-[900px]:gap-y-0.5"
                  to={`/work/${project.slug}`}
                >
                  <span className="text-[1.0625rem] font-semibold max-[900px]:col-start-1">{project.name}</span>
                  <span className="text-[.9375rem] text-muted-foreground max-[900px]:col-start-1 max-[900px]:row-start-2 max-[900px]:text-sm">
                    {project.subtitle}
                  </span>
                  <span className="font-mono text-label text-muted-foreground max-[1100px]:hidden">
                    {project.stack.slice(0, 3).join(', ')}
                  </span>
                  <ArrowUpRight
                    className="text-primary max-[900px]:col-start-2 max-[900px]:row-[1/span_2]"
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!activeSkill && (
        <div className="mt-14 empty:hidden">
          <GitHubActivity />
        </div>
      )}
      {!activeSkill && (
        <p className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[.9375rem] text-muted-foreground">
          <Link className={cn(textLinkClass, 'text-foreground')} to="/lab">
            Try the rate-limiter lab <ArrowUpRight size={15} />
          </Link>
          <Link className={cn(textLinkClass, 'text-foreground')} to="/notes">
            Read my engineering notes <ArrowUpRight size={15} />
          </Link>
        </p>
      )}
      {flagships.length === 0 && others.length === 0 && (
        <Empty className="mt-8 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No projects use {activeSkill} yet</EmptyTitle>
            <EmptyDescription>Clear the filter to see everything I&apos;ve built.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" onClick={onClearSkill}>
              Clear skill filter
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}

export default ProjectsSection
