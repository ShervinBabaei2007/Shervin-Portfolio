import { ArrowRight, ArrowUpRight, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { flagshipProjects, projects } from '@/data/projects'
import { projectsUsing } from '@/data/skills'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import GitHubActivity from '@/components/home/GitHubActivity'
import ProjectCard from '@/components/home/ProjectCard'
import RequestTrace from '@/components/home/RequestTrace'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import SectionHeading from '@/components/shared/SectionHeading'
import { tone } from '@/lib/buttonTones'
import { cn, textLinkClass } from '@/lib/utils'

type ProjectsSectionProps = {
  activeSkill: string | null
  onClearSkill: () => void
}

/** The home page "Selected work" section, which can be filtered by a skill picked in the skills section. */
function ProjectsSection({ activeSkill, onClearSkill }: ProjectsSectionProps) {
  const using = activeSkill ? projectsUsing(activeSkill) : null
  // The home page shows at most four flagships. With a skill filter on, every project that uses it is shown.
  const shown = (activeSkill ? projects : flagshipProjects.slice(0, 4)).filter(
    (project) => !using || using.includes(project),
  )

  return (
    <section className="section-band" id="work" aria-labelledby="work-title">
      <div className="section-wrap section-y">
        <SectionHeading
          id="work-title"
          number="01"
          eyebrow="SELECTED WORK"
          title="Built, broken, understood"
          aside="The useful part isn't just what shipped. It's the assumption each project forced me to rethink."
        />
        {activeSkill && (
          <p
            className="-mt-6 mb-8 flex flex-wrap items-center gap-[5px] text-sm text-muted-foreground [&_strong]:text-foreground"
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
        {/* The way in: pick a layer of the stack and it opens the projects that show it best. Hidden on phones, and while a
          skill filter is on (the filter already narrows the work). */}
        {!activeSkill && (
          <div className="mb-[var(--space-block)] grid items-center gap-x-16 gap-y-8 rounded-2xl border bg-muted/60 p-8 max-[899px]:p-6 max-[620px]:hidden min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
            <div>
              <p className="eyebrow text-primary">START HERE</p>
              <h3 className="mt-4 text-h2 font-semibold min-[1100px]:whitespace-nowrap">Not sure where to start?</h3>
              <p className="mt-5 measure text-[1.1875rem] leading-[1.7] text-muted-foreground">
                Follow one request through the layers of the stack. Each step opens the projects that show that layer
                best.
              </p>
            </div>
            <div className="w-full max-w-[460px] min-[1100px]:justify-self-end">
              <RequestTrace />
            </div>
          </div>
        )}
        {shown.length > 0 && (
          // Keyed on the filter, so the cards fade in when a skill is picked instead of snapping (never on first load).
          <div
            key={activeSkill ?? 'all'}
            className={
              activeSkill
                ? 'motion-safe:animate-in motion-safe:duration-500 motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3'
                : undefined
            }
          >
            <Carousel
              opts={{ align: 'start', breakpoints: { '(min-width: 768px)': { active: false } } }}
              aria-label="Featured projects"
              className="w-full"
            >
              <CarouselContent className="-ml-4 md:ml-0 md:grid md:grid-cols-2 md:items-stretch md:gap-[var(--space-card)]">
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
          </div>
        )}
        {/* The links, commit history and lab link only show when no skill filter is on. */}
        {!activeSkill && (
          <>
            <div className="mt-[var(--space-block)] flex flex-wrap gap-3">
              <Button asChild size="lg" className={cn('font-semibold shadow-md', tone.ink)}>
                <Link to="/projects">
                  View all projects <ArrowRight size={15} />
                </Link>
              </Button>
              <Button asChild size="lg" className={cn('font-semibold shadow-md', tone.writeup)}>
                <Link to="/writeups">
                  Read my writeups <ArrowUpRight size={15} />
                </Link>
              </Button>
            </div>
            <div className="mt-[var(--space-section)] empty:hidden">
              <GitHubActivity />
            </div>
            <p className="mt-[var(--space-block)]">
              <Link className={cn(textLinkClass, 'text-primary')} to="/lab">
                Try the rate-limiter lab <ArrowUpRight size={15} />
              </Link>
            </p>
          </>
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
      </div>
    </section>
  )
}

export default ProjectsSection
