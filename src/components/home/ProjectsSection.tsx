import { ArrowRight, ArrowUpRight, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flagshipProjects, projects } from '@/data/projects'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import GitHubActivity from '@/components/home/GitHubActivity'
import ProjectCard from '@/components/home/ProjectCard'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import SectionHeading from '@/components/shared/SectionHeading'
import { tone } from '@/lib/buttonTones'
import { cn } from '@/lib/utils'

type ProjectsSectionProps = {
  activeSkill: string | null
  onClearSkill: () => void
}

function ProjectsSection({ activeSkill, onClearSkill }: ProjectsSectionProps) {
  const matches = (stack: string[]) => !activeSkill || stack.includes(activeSkill)
  // The home page shows at most four flagships. With a skill filter on, every project that uses it is shown.
  const shown = (activeSkill ? projects : flagshipProjects.slice(0, 4)).filter((project) => matches(project.stack))

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
      {shown.length > 0 && (
        <Carousel
          opts={{ align: 'start', breakpoints: { '(min-width: 768px)': { active: false } } }}
          aria-label="Featured projects"
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4 md:ml-0 md:grid md:grid-cols-2 md:gap-6">
            {shown.map((project, index) => (
              <CarouselItem
                key={project.slug}
                className="basis-[88%] sm:basis-[70%] md:basis-auto md:pl-0 [&>*]:h-full"
              >
                <ProjectCard project={project} revealDelay={(index % 2) * 0.08} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:inline-flex md:hidden" />
          <CarouselNext className="hidden sm:inline-flex md:hidden" />
        </Carousel>
      )}
      {!activeSkill && (
        <div className="mt-10">
          <Button asChild size="lg" className={cn('font-semibold shadow-md', tone.ink)}>
            <Link to="/projects">
              View all projects <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      )}
      {!activeSkill && (
        <div className="mt-14 empty:hidden">
          <GitHubActivity />
        </div>
      )}
      {!activeSkill && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="font-semibold">
            <Link to="/lab">
              Try the rate-limiter lab <ArrowUpRight size={15} />
            </Link>
          </Button>
          <Button asChild size="lg" className={cn('font-semibold shadow-md', tone.ink)}>
            <Link to="/writeups">
              Read my writeups <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
      )}
      {shown.length === 0 && (
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
