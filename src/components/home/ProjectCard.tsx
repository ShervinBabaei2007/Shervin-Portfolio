import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import LazyBoundary from '@/components/shared/LazyBoundary'
import PendingFlag from '@/components/shared/PendingFlag'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import images from '@/data/images.json'
import CodeBlock from '@/components/shared/CodeBlock'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import TerminalBlock from '@/components/shared/TerminalBlock'
import Reveal from '@/components/shared/Reveal'
import WindowFrame from '@/components/shared/WindowFrame'
import { cn } from '@/lib/utils'

/**
 * The decorative thumbnail area: one fixed height for every card, so a row of cards lines up whatever it shows
 * (a screenshot, code or a terminal), on a dotted backdrop.
 */
const mediaBase = cn(
  'relative z-[1] h-[240px] overflow-hidden max-[620px]:h-[220px]',
  'bg-muted bg-[radial-gradient(color-mix(in_srgb,var(--foreground)_12%,transparent)_.8px,transparent_.8px)] bg-[length:13px_13px]',
)
const visualClass = cn(mediaBase, 'grid place-items-center px-7 py-[19px] max-[620px]:p-4')

const catalog = images as Record<string, { width: number; height: number }>
/** Tall phone screenshots get the "phones peeking up" treatment; wide ones get a browser window. */
const isPortrait = (src: string) => {
  const info = catalog[src]
  return Boolean(info) && info.height / info.width > 1.2
}

function CardMedia({ project }: { project: Project }) {
  if (project.screenshots?.length) {
    const shots = project.screenshots
    return (
      <div
        className={cn(
          mediaBase,
          'flex items-end justify-center px-6 pt-6 max-[620px]:px-4 max-[620px]:pt-4 dark:brightness-[.94] dark:saturate-[.85]',
        )}
        aria-hidden="true"
        data-card-media
      >
        {isPortrait(shots[0].src) ? (
          <div className="flex h-full w-full items-end justify-center gap-3 max-[620px]:gap-2">
            {shots.slice(0, 3).map((shot, index) => (
              <figure
                key={shot.src}
                className={cn(
                  'm-0 w-[29%] max-w-[150px] overflow-hidden rounded-t-[20px] border border-b-0 bg-card p-1 pb-0 shadow-lg',
                  index === 1 ? 'h-full' : 'h-[86%]',
                )}
              >
                <div className="size-full overflow-hidden rounded-t-[16px] [&_img]:block [&_img]:size-full [&_img]:object-cover [&_img]:object-top">
                  <ResponsiveImage src={shot.src} alt="" sizes="(max-width: 620px) 30vw, 150px" />
                </div>
              </figure>
            ))}
          </div>
        ) : (
          <WindowFrame label={shots[0].caption}>
            <ResponsiveImage src={shots[0].src} alt="" sizes="(max-width: 620px) 90vw, 560px" />
          </WindowFrame>
        )}
      </div>
    )
  }
  // The card shows a short preview: no outer margin, full width, a smaller font and no scrolling.
  const preview = { className: 'm-0 w-full', preClassName: 'overflow-hidden text-[.75rem] leading-[1.55]' }
  // A recorded terminal session says more about a command-line project than code does, unless it is only a line or two.
  const terminalFirst = project.terminal && project.terminal.transcript.split(/\r?\n/).length >= 3
  if (project.snippet && !terminalFirst) {
    return (
      <div className={visualClass} aria-hidden="true" data-card-media>
        <CodeBlock snippet={project.snippet} maxLines={11} showCaption={false} {...preview} />
      </div>
    )
  }
  if (project.terminal) {
    return (
      <div className={visualClass} aria-hidden="true" data-card-media>
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
  // No screenshot, code or transcript: show the stack instead, so every card keeps the same media height.
  return (
    <div className={cn(visualClass, 'content-center')} aria-hidden="true" data-card-media>
      <div className="flex max-w-full flex-wrap justify-center gap-2 font-mono text-sm text-muted-foreground">
        {project.stack.slice(0, 6).map((item) => (
          <span key={item} className="rounded-md border bg-card px-2.5 py-1 shadow-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Started early (hover, focus, touch) so the panel is usually ready by the time it is opened.
const loadSheet = () => import('./CaseStudySheet')
const CaseStudySheet = lazy(loadSheet)

const cardLink =
  'hit-area inline-flex items-center gap-[7px] text-control font-semibold whitespace-nowrap no-underline hover:text-primary'

const card =
  "relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-[12px] border bg-card transition-[transform,box-shadow,border-color] duration-200 ease-in-out has-[:focus-visible]:border-primary before:pointer-events-none before:absolute before:inset-0 before:z-[2] before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] before:bg-[radial-gradient(360px_circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),var(--glow),transparent_68%)] pointer-fine:hover:border-primary pointer-fine:focus-within:border-primary pointer-fine:hover:shadow-[0_14px_32px_rgba(12,26,51,.12)] pointer-fine:focus-within:shadow-[0_14px_32px_rgba(12,26,51,.12)] motion-safe:pointer-fine:hover:-translate-y-1 motion-safe:pointer-fine:focus-within:-translate-y-1 pointer-fine:hover:before:opacity-100 motion-reduce:before:hidden forced-colors:before:hidden print:before:hidden print:break-inside-avoid print:shadow-none"

function ProjectCard({ project, revealDelay = 0 }: { project: Project; revealDelay?: number }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetRequested, setSheetRequested] = useState(false)
  const [sheetLoading, setSheetLoading] = useState(false)

  return (
    <Reveal delay={revealDelay}>
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
            <div className="flex justify-between gap-3 font-mono text-label text-muted-foreground" data-card-meta>
              <span>{project.category}</span>
              <span>{project.date}</span>
            </div>
            <p className="mt-[15px] border-l-[3px] border-primary bg-muted px-3 py-2 text-sm font-semibold">
              {project.highlight}
            </p>
            <h3 className="mt-[15px] text-h3 font-semibold">{project.name}</h3>
            <p className="mt-1.5 font-semibold">{project.subtitle}</p>
            <p className="mt-[11px] line-clamp-2 leading-[1.65] text-muted-foreground">{project.summary}</p>
            <div className="mt-4 mb-[18px] flex flex-wrap gap-1.5" aria-label="Stack">
              {project.stack.slice(0, 5).map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between gap-4 border-t pt-3.5 text-sm text-muted-foreground max-[620px]:flex-col max-[620px]:items-start">
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
            onPointerEnter={() => void loadSheet().catch(() => {})}
            onFocus={() => void loadSheet().catch(() => {})}
            onTouchStart={() => void loadSheet().catch(() => {})}
            onClick={() => {
              setSheetRequested(true)
              setSheetOpen(true)
            }}
          >
            {sheetLoading && <Spinner aria-hidden="true" role="presentation" />}
            Quick look
          </Button>
          {sheetRequested && (
            <LazyBoundary
              label="Quick look"
              onFail={() => {
                setSheetRequested(false)
                setSheetOpen(false)
                setSheetLoading(false)
              }}
            >
              <Suspense fallback={<PendingFlag onChange={setSheetLoading} />}>
                <CaseStudySheet project={project} open={sheetOpen} onOpenChange={setSheetOpen} />
              </Suspense>
            </LazyBoundary>
          )}
          {project.github && (
            <a className={cardLink} href={project.github} target="_blank" rel="noreferrer">
              Source code <Github size={15} />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  )
}

export default ProjectCard
