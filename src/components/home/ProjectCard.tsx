import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import PendingFlag from '@/components/shared/PendingFlag'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import CodeBlock from '@/components/shared/CodeBlock'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import TerminalBlock from '@/components/shared/TerminalBlock'
import { cn } from '@/lib/utils'

/** The decorative thumbnail area: a dotted backdrop behind screenshots, code, or a terminal. */
const visualClass = cn(
  'relative z-[1] grid h-[215px] place-items-center overflow-hidden px-7 py-[19px] max-[620px]:h-[205px] max-[620px]:p-4',
  'bg-muted bg-[radial-gradient(color-mix(in_srgb,var(--foreground)_12%,transparent)_.8px,transparent_.8px)] bg-[length:13px_13px]',
)

function CardMedia({ project }: { project: Project }) {
  if (project.screenshots?.length) {
    return (
      <div className={cn(visualClass, 'block p-0 dark:brightness-[.94] dark:saturate-[.85]')} aria-hidden="true">
        <div className="absolute inset-0 grid size-full grid-cols-3 grid-rows-[minmax(0,1fr)] items-stretch justify-items-stretch gap-3 px-[18px] py-3.5 max-[620px]:gap-[7px] max-[620px]:px-2 [&_figure]:m-0 [&_figure]:grid [&_figure]:min-h-0 [&_figure]:min-w-0 [&_figure]:place-items-center [&_figure]:overflow-hidden [&_img]:block [&_img]:size-full [&_img]:min-h-0 [&_img]:object-contain">
          {project.screenshots.slice(0, 3).map((screenshot) => (
            <figure key={screenshot.src}>
              <ResponsiveImage src={screenshot.src} alt="" sizes="(max-width: 620px) 30vw, 200px" />
            </figure>
          ))}
        </div>
      </div>
    )
  }
  // The card shows a short preview: no outer margin, full width, a smaller font and no scrolling.
  const preview = { className: 'm-0 w-full', preClassName: 'overflow-hidden text-[.75rem] leading-[1.55]' }
  if (project.snippet) {
    return (
      <div className={visualClass} aria-hidden="true">
        <CodeBlock snippet={project.snippet} maxLines={11} showCaption={false} {...preview} />
      </div>
    )
  }
  if (project.terminal) {
    return (
      <div className={visualClass} aria-hidden="true">
        <TerminalBlock
          title={project.terminal.title}
          transcript={project.terminal.transcript}
          maxLines={11}
          showCaption={false}
          {...preview}
        />
      </div>
    )
  }
  return null
}

// Started early (hover, focus, touch) so the panel is usually ready by the time it is opened.
const loadSheet = () => import('./CaseStudySheet')
const CaseStudySheet = lazy(loadSheet)

const cardLink =
  'hit-area inline-flex items-center gap-[7px] text-sm font-semibold whitespace-nowrap no-underline hover:text-primary max-[360px]:text-xs'

const card =
  "relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border bg-card animate-card-reveal transition-[transform,box-shadow,border-color] duration-200 ease-in-out has-[:focus-visible]:border-primary before:pointer-events-none before:absolute before:inset-0 before:z-[2] before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] before:bg-[radial-gradient(360px_circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),var(--glow),transparent_68%)] pointer-fine:hover:border-primary pointer-fine:focus-within:border-primary pointer-fine:hover:shadow-[0_14px_32px_rgba(12,26,51,.12)] pointer-fine:focus-within:shadow-[0_14px_32px_rgba(12,26,51,.12)] motion-safe:pointer-fine:hover:-translate-y-1 motion-safe:pointer-fine:focus-within:-translate-y-1 pointer-fine:hover:before:opacity-100 motion-reduce:before:hidden forced-colors:before:hidden print:before:hidden print:animate-none print:break-inside-avoid print:shadow-none"

function ProjectCard({ project }: { project: Project }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetRequested, setSheetRequested] = useState(false)
  const [sheetLoading, setSheetLoading] = useState(false)

  return (
    <article
      // The pointer-follow glow reads --pointer-x/--pointer-y, which onPointerMove sets below.
      className={card}
      data-project-card
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
      }}
    >
      <Link
        className="flex w-full flex-1 flex-col text-left no-underline focus-visible:-outline-offset-3"
        to={`/work/${project.slug}`}
        aria-label={`${project.name} case study`}
      >
        <CardMedia project={project} />
        <div className="relative z-[1] flex flex-1 flex-col px-[22px] pt-5 pb-[22px] max-[620px]:p-5">
          <div className="flex justify-between font-mono text-muted-foreground">
            <span>{project.category}</span>
            <span>{project.date}</span>
          </div>
          <p className="mt-[15px] border-l-[3px] border-primary bg-muted px-3 py-2 text-sm font-semibold">
            {project.highlight}
          </p>
          <h3 className="mt-[15px] text-2xl leading-[1.15] font-semibold max-[620px]:text-xl">{project.name}</h3>
          <p className="mt-1.5 font-semibold">{project.subtitle}</p>
          <p className="mt-[11px] leading-[1.65] text-muted-foreground">{project.summary}</p>
          <div className="mt-4 mb-[18px] flex flex-wrap gap-1.5" aria-label="Stack">
            {project.stack.slice(0, 5).map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 border-t pt-3.5 text-sm text-muted-foreground max-[620px]:flex-col max-[620px]:items-start max-[360px]:text-[.8125rem]">
            <span>{project.role}</span>
            <span className="inline-flex items-center gap-[7px] font-semibold text-primary">
              Read case study <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
      <div
        className="relative z-[1] flex min-h-[54px] flex-wrap items-center gap-x-5 gap-y-2 border-t px-[22px] py-2.5 max-[620px]:gap-[18px] max-[620px]:px-5 max-[360px]:gap-3.5"
        aria-label={`${project.name} project links`}
      >
        {project.live && (
          <Button asChild size="sm" className="max-[620px]:h-11">
            <a href={project.live} target="_blank" rel="noreferrer">
              Live project <ArrowUpRight size={15} />
            </a>
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="max-[620px]:h-11"
          aria-busy={sheetLoading}
          onPointerEnter={() => void loadSheet()}
          onFocus={() => void loadSheet()}
          onTouchStart={() => void loadSheet()}
          onClick={() => {
            setSheetRequested(true)
            setSheetOpen(true)
          }}
        >
          {sheetLoading && <Spinner aria-hidden="true" role="presentation" />}
          Quick look
        </Button>
        {sheetRequested && (
          <Suspense fallback={<PendingFlag onChange={setSheetLoading} />}>
            <CaseStudySheet project={project} open={sheetOpen} onOpenChange={setSheetOpen} />
          </Suspense>
        )}
        {project.github && (
          <a className={cardLink} href={project.github} target="_blank" rel="noreferrer">
            Source code <Github size={15} />
          </a>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
