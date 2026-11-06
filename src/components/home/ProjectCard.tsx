import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const codeLike =
    '[&_.code-block]:m-0 [&_.code-block]:w-full [&_.terminal-block]:m-0 [&_.terminal-block]:w-full [&_pre]:overflow-hidden [&_pre]:text-xs [&_pre]:leading-[1.55]'
  if (project.snippet) {
    return (
      <div className={cn(visualClass, codeLike)} aria-hidden="true">
        <CodeBlock snippet={project.snippet} maxLines={11} showCaption={false} />
      </div>
    )
  }
  if (project.terminal) {
    return (
      <div className={cn(visualClass, codeLike)} aria-hidden="true">
        <TerminalBlock
          title={project.terminal.title}
          transcript={project.terminal.transcript}
          maxLines={11}
          showCaption={false}
        />
      </div>
    )
  }
  return null
}

const CaseStudySheet = lazy(() => import('./CaseStudySheet'))

const cardLink =
  'hit-area inline-flex items-center gap-[7px] text-sm font-semibold whitespace-nowrap no-underline hover:text-primary max-[360px]:text-xs'

function ProjectCard({ project }: { project: Project }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetRequested, setSheetRequested] = useState(false)

  return (
    <article
      // `project-card` keeps the pointer-follow glow and hover lift in styles.css.
      className="project-card"
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
      }}
    >
      <Link
        className="block w-full text-left no-underline focus-visible:-outline-offset-3"
        to={`/work/${project.slug}`}
        aria-label={`${project.name} case study`}
      >
        <CardMedia project={project} />
        <div className="relative z-[1] px-[22px] pt-5 pb-[22px] max-[620px]:p-5">
          <div className="flex justify-between font-mono text-muted-foreground">
            <span>{project.category}</span>
            <span>{project.date}</span>
          </div>
          <h3 className="mt-[15px] text-[1.6875rem] leading-[1.1] font-semibold max-[620px]:text-2xl">
            {project.name}
          </h3>
          <p className="mt-1.5 font-semibold">{project.subtitle}</p>
          <p className="mt-[11px] leading-[1.65] text-muted-foreground">{project.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
            {project.stack.slice(0, 5).map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
          <div className="mt-[18px] flex items-center justify-between gap-4 border-t pt-3.5 text-sm text-muted-foreground max-[620px]:flex-col max-[620px]:items-start max-[360px]:text-[.8125rem]">
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSheetRequested(true)
            setSheetOpen(true)
          }}
        >
          Quick look
        </Button>
        {sheetRequested && (
          <Suspense fallback={null}>
            <CaseStudySheet project={project} open={sheetOpen} onOpenChange={setSheetOpen} />
          </Suspense>
        )}
        {project.live && (
          <a className={cardLink} href={project.live} target="_blank" rel="noreferrer">
            Live project <ArrowUpRight size={15} />
          </a>
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
