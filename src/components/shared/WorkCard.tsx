import { Link } from 'react-router-dom'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'

// The three paper tones the stages cycle through, so neighbouring cards are told apart.
const stages = ['bg-stage-1', 'bg-stage-2', 'bg-stage-3']
const lift =
  'transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-x-2.5 group-hover:-translate-y-2.5'

// "Oct 2026 – Current" reads as "Oct 2026" on a card.
const cardDate = (date: string) => date.replace(/\s*–\s*current/i, '')

/** A dark code window with a few real lines from the project, for cards without a screenshot. */
function CodePreview({ file, lines }: { file: string; lines: string[] }) {
  return (
    <div
      aria-hidden="true"
      data-theme="dark"
      className={cn(
        'absolute top-[16%] -bottom-3 left-[8%] w-[96%] overflow-hidden rounded-tl-md bg-[var(--ink-panel)] font-mono text-[clamp(11px,1vw,13px)] leading-[1.7] text-foreground shadow-[0_30px_60px_-30px_rgb(27_26_24/0.55)]',
        lift,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-foreground/10 px-3.5 py-2.5 text-[11px] text-muted-foreground">
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="size-2 rounded-full bg-foreground/15" />
        <span className="ml-2">{file}</span>
      </div>
      <div className="px-4 py-3.5">
        {lines.map((line, index) => (
          <div
            key={index}
            className={cn(
              'whitespace-pre',
              /^\s*#/.test(line) ? 'text-muted-foreground' : line.startsWith('$') ? 'text-primary' : 'text-foreground',
            )}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

type WorkCardProps = {
  project: Project
  /** Position in its grid, which picks the stage tone. */
  index: number
  /** h2 on the Work page, where the cards are the main content; h3 under a home-page section heading. */
  headingLevel?: 'h2' | 'h3'
}

// Small outlined pills for the card's live and source links, raised above the card's stretched link.
const actionPill =
  'relative z-[3] inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/25 px-3.5 font-mono text-[13px] text-foreground no-underline transition-colors hover:bg-foreground hover:text-background pointer-coarse:h-11'

/**
 * The picture card used on the home page and the Work page: a tinted stage with the category and date, the
 * screenshot (or a code preview when there is none) offset to the bottom right, then the name, one line, the proof,
 * the main tools, and one-click links to the live app and the code.
 *
 * The name is the link to the case study, stretched over the whole card, so the card still opens as one target; the
 * live and code links sit above that stretched area so they can be clicked on their own.
 */
function WorkCard({ project, index, headingLevel = 'h3' }: WorkCardProps) {
  const Heading = headingLevel
  const shot = project.preview ? undefined : (project.screenshots?.[0] ?? project.illustration)
  const source = project.github ?? project.teamRepo
  return (
    <div className="group relative flex h-full min-w-0 flex-col gap-5 text-foreground">
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden rounded-md',
          project.cardStage === 'ink' ? 'bg-[var(--ink-panel)]' : stages[index % stages.length],
        )}
      >
        {/* The label stays light in both themes: it sits on the picture, not on the page. */}
        <span
          data-card-meta
          className="absolute top-3.5 left-3.5 z-[2] rounded-full bg-[#f3f0ea]/[0.92] px-[11px] py-1.5 font-mono text-[12px] whitespace-nowrap text-[#1b1a18] shadow-[0_2px_10px_-4px_rgb(27_26_24/0.3)] backdrop-blur-sm max-[620px]:text-[13px]"
        >
          {project.category} · {cardDate(project.date)}
        </span>
        {shot && (
          <ResponsiveImage
            src={shot.src}
            alt={shot.alt}
            sizes="(min-width: 1100px) 620px, 92vw"
            className={cn(
              'absolute top-[10%] left-[8%] h-auto w-[96%] max-w-none rounded-tl-md',
              project.cardStage === 'ink'
                ? 'shadow-[0_30px_70px_-20px_rgb(0_0_0/0.7)]'
                : 'shadow-[0_30px_60px_-30px_rgb(27_26_24/0.45)]',
              lift,
            )}
          />
        )}
        {project.preview && <CodePreview {...project.preview} />}
      </div>
      <div className="flex flex-col gap-2">
        <Heading className="m-0 text-[clamp(1.375rem,2vw,1.75rem)] leading-[1.2] tracking-[-0.03em]">
          <Link
            to={`/work/${project.slug}`}
            data-cursor="view"
            className="text-foreground no-underline transition-colors group-hover:text-primary after:absolute after:inset-0 after:z-[1] after:content-[''] hover:text-primary focus-visible:outline-none focus-visible:after:rounded-md focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-ring"
          >
            {project.name}
          </Link>
        </Heading>
        <p className="m-0 max-w-[52ch] text-base leading-normal text-text-body">{project.tagline}</p>
        <span className="font-mono text-[13px] text-primary">{project.cardProof ?? project.result}</span>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0" aria-label={`${project.name} main tools`}>
          {project.mainStack.slice(0, 4).map((tool) => (
            <li key={tool} className="rounded-full bg-surface-hover px-2.5 py-1 text-[13px] text-foreground">
              {tool}
            </li>
          ))}
        </ul>
        {(project.live || source) && (
          <div className="flex flex-wrap gap-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the ${project.name} live app`}
                className={actionPill}
              >
                Live app <span aria-hidden="true">↗</span>
              </a>
            )}
            {source && (
              <a
                href={source}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source code on GitHub`}
                className={actionPill}
              >
                Code <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkCard
