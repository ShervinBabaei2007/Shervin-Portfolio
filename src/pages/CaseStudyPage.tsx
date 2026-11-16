import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2, NotebookPen, Users } from 'lucide-react'
import ArticleLayout from '@/components/shared/ArticleLayout'
import AsciiCanvas from '@/components/shared/AsciiCanvas'
import TableOfContents from '@/components/shared/TableOfContents'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import CodeBlock from '@/components/shared/CodeBlock'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import ScreenshotGallery from '@/components/shared/ScreenshotGallery'
import TerminalBlock from '@/components/shared/TerminalBlock'
import { useCopy } from '@/hooks/useCopy'
import { caseStudySections, type CaseStudySection, type SectionId } from '@/lib/caseStudySections'
import { screenshotShape } from '@/lib/images'
import { cn } from '@/lib/utils'
import { notesForProject } from '../data/notes'
import { findProject, projects } from '../data/projects'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const h2Class = 'm-0 text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1] tracking-[-0.03em]'
// Sections are flat on the page, divided by a rule, like the sections of the home page.
const card = 'border-t border-foreground/15 pt-[clamp(28px,3vw,40px)]'
// The same look for the sections the article layout renders, which do not carry their own classes.
const articleCards =
  'grid grid-cols-[minmax(0,1fr)] gap-[clamp(40px,5vw,64px)] [&>section]:border-t [&>section]:border-foreground/15 [&>section]:pt-[clamp(28px,3vw,40px)]'

const bodyClass = 'mt-3 text-[1.0625rem] leading-[1.7] text-text-body max-[620px]:text-base'
const factDt = 'font-mono text-[13px] text-muted-foreground'
const factDd = 'mt-2 mb-0 text-[15px] leading-normal font-medium text-foreground'
// Header actions: pills that wrap on small screens and stack to the width of the column beside the title on wide ones.
const pill =
  'inline-flex h-11 items-center justify-between gap-2.5 rounded-full px-5 text-[15px] no-underline transition-colors min-[1024px]:w-full'
const inkPill = `${pill} bg-foreground text-background hover:bg-primary-fill hover:text-primary-foreground`
const outlinePill = `${pill} border border-foreground/25 bg-transparent text-foreground hover:bg-foreground hover:text-background`
const pagerLink =
  'grid gap-1.5 rounded-md bg-surface-hover px-6 py-5 text-foreground no-underline transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:text-foreground hover:shadow-[0_18px_40px_-24px_var(--color-shadow)] [&:hover_b]:text-primary'
const pagerLabel = 'flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground'

/** A list of steps numbered 01, 02, and so on. */
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-2.5 grid list-none gap-3 p-0">
      {steps.map((step, i) => (
        <li key={step} className="grid grid-cols-[30px_1fr] items-start gap-2.5">
          <span className="pt-1 font-mono text-[13px] text-primary">{String(i + 1).padStart(2, '0')}</span>
          <p className={cn(bodyClass, 'm-0')}>{step}</p>
        </li>
      ))}
    </ol>
  )
}

/** One project's case study page at /work/:slug, or the 404 page when the slug is unknown. */
function CaseStudyPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  const { copied, failed, copy } = useCopy()
  if (!project) return <NotFoundPage />

  const index = projects.indexOf(project)
  // No wrap-around: the first project has no previous one and the last has no next one, so those slots go back to the work list.
  const previous = projects[index - 1]
  const next = projects[index + 1]
  const relatedNotes = notesForProject(project.slug)
  // One writeup opens directly; several open the writeups list filtered to this project.
  const writeupHref =
    relatedNotes.length === 1 ? `/writeups/${relatedNotes[0].slug}` : `/writeups?project=${project.slug}`
  // The summary card under the title; the decision and evidence rows only appear for projects that have them.
  const glance: [string, string][] = [
    ['OUTCOME', project.result],
    ['SCOPE', project.role],
    ...(project.signal
      ? ([
          ['DECISION', project.signal.decision],
          ['EVIDENCE', project.signal.evidence],
        ] as [string, string][])
      : []),
  ]
  // A wide screenshot makes a good opening picture; a phone shot does not.
  const heroShot = project.screenshots?.find((shot) => screenshotShape(shot.src) === 'wide')
  const sections = caseStudySections(project)
  // A section only renders when `sections` lists it, so these empty defaults are never shown.
  const { overview = [], features = [], howItWorks = [] } = project
  // Renders the listed sections for one part of the page, in order.
  const render = (placement: CaseStudySection['placement']) =>
    sections.filter((section) => section.placement === placement).map((section) => views[section.id]())

  let copyLabel = 'Copy link'
  if (copied) copyLabel = 'Link copied'
  else if (failed) copyLabel = 'Copy it from the address bar'

  // One renderer per section id; `render` above picks which ones run.
  const views: Record<SectionId, () => ReactNode> = {
    what: () => (
      <section key="what" id="what" className={card}>
        <h2 className={h2Class}>What it is</h2>
        {overview.map((paragraph) => (
          <p key={paragraph} className={bodyClass}>
            {paragraph}
          </p>
        ))}
      </section>
    ),
    does: () => (
      <section key="does" id="does" className={card}>
        <h2 className={h2Class}>What it can do</h2>
        <ul className="mt-3 grid list-none gap-3 p-0 min-[760px]:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.title} className="rounded-md bg-surface-hover px-5 py-4">
              <h3 className="m-0 text-[1.0625rem] tracking-[-0.02em]">{feature.title}</h3>
              <p className="mt-1.5 mb-0 text-[15px] leading-[1.55] text-text-body">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>
    ),
    works: () => (
      <section key="works" id="works">
        <h2 className={h2Class}>How it works</h2>
        <StepList steps={howItWorks} />
      </section>
    ),
    media: () => (
      <section key="media" id="media">
        <h2 className={h2Class}>{project.video || project.screenshots ? 'Screenshots' : 'Illustration'}</h2>
        {project.video && (
          <figure className="mt-4">
            <video
              className="block h-auto w-full rounded-xl border bg-code"
              controls
              muted
              playsInline
              preload="none"
              poster={project.video.poster}
              width={1280}
              height={800}
            >
              <source src={project.video.src} type={project.video.type ?? 'video/mp4'} />
            </video>
            <figcaption className="mt-2 text-sm text-muted-foreground">{project.video.caption}</figcaption>
          </figure>
        )}
        {project.screenshots && (
          <div className="mt-4" aria-label={`${project.name} screenshots`} role="group">
            <ScreenshotGallery shots={project.screenshots} projectName={project.name} layout="strip" />
          </div>
        )}
        {project.illustration && !project.video && !project.screenshots && (
          <figure className="m-0 mt-4">
            <img
              className="block h-auto w-full rounded-xl border"
              src={project.illustration.src}
              alt={project.illustration.alt}
              width={960}
              height={540}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="mt-2 text-sm text-muted-foreground">
              Illustration, not a real screenshot. {project.illustration.caption} It is a sketch, so the real app may
              look different.
            </figcaption>
          </figure>
        )}
      </section>
    ),
    why: () => (
      <section key="why" id="why">
        <h2 className={h2Class}>Why</h2>
        <p className={bodyClass}>{project.why}</p>
      </section>
    ),
    built: () => (
      <section key="built" id="built">
        <h2 className={h2Class}>What I built</h2>
        <StepList steps={project.mine} />
      </section>
    ),
    code: () =>
      project.snippet && (
        <section key="code" id="code">
          <h2 className={h2Class}>The code</h2>
          <CodeBlock snippet={project.snippet} />
        </section>
      ),
    run: () =>
      project.terminal && (
        <section key="run" id="run">
          <h2 className={h2Class}>See it run</h2>
          <TerminalBlock title={project.terminal.title} transcript={project.terminal.transcript} />
        </section>
      ),
    outcome: () => (
      <section key="outcome" id="outcome">
        <h2 className={h2Class}>Outcome</h2>
        <p className={bodyClass}>{project.outcome}</p>
      </section>
    ),
    tradeoff: () => (
      <section
        key="tradeoff"
        id="tradeoff"
        className="rounded-md !border-t-0 bg-surface-hover p-[clamp(20px,2.4vw,32px)]"
      >
        <h2 className={h2Class}>The trade-off</h2>
        <p className={bodyClass}>{project.tradeoff}</p>
      </section>
    ),
    learned: () => (
      <section key="learned" id="learned">
        <h2 className={h2Class}>What I learned</h2>
        <p className={bodyClass}>{project.learned}</p>
      </section>
    ),
    next: () => (
      <section key="next" id="next">
        <h2 className={h2Class}>What I&apos;d fix next</h2>
        <p className={bodyClass}>{project.next}</p>
      </section>
    ),
  }

  return (
    <article aria-labelledby="case-study-title">
      {/* The top of the page: the ASCII field behind the title and actions, the facts row, then a big look at the app. */}
      <div className="relative section-wrap pt-[clamp(28px,4vw,56px)] pb-[clamp(40px,5vw,64px)]">
        <AsciiCanvas />
        <div className="relative">
          <PageBreadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Work', to: '/projects' },
            ]}
            current={project.name}
          />

          {/* Title block on the left, actions on the right (below the wide layout they wrap under the title). */}
          <header className="mt-[clamp(28px,4vw,48px)]">
            <div className="grid gap-8 min-[1024px]:grid-cols-[minmax(0,1fr)_20rem] min-[1024px]:items-end min-[1024px]:gap-16">
              <div data-calm>
                <p className="rise m-0 truncate font-mono text-[13px] text-muted-foreground">
                  <span className="text-primary">~</span> $ cat work/{project.slug}.md
                </p>
                <h1
                  id="case-study-title"
                  className="rise mt-5 mb-0 text-[clamp(2.75rem,5.6vw,5.25rem)] leading-[0.98] font-[650] tracking-[-0.045em]"
                  style={{ '--d': '80ms' } as CSSProperties}
                >
                  {project.name}
                </h1>
                <p
                  className="rise mt-5 mb-0 max-w-[60ch] text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.55] text-text-body"
                  style={{ '--d': '160ms' } as CSSProperties}
                >
                  {project.subtitle}
                </p>
                <p className="mt-4 mb-0 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[13px] text-muted-foreground">
                  <span>
                    {project.category} · {project.date}
                  </span>
                  <span className="inline-flex items-baseline gap-2">
                    <Users className="flex-none translate-y-0.5 text-primary" size={14} aria-hidden="true" />
                    {project.team}
                  </span>
                </p>
              </div>

              <div data-calm className="flex flex-wrap items-center gap-2.5 min-[1024px]:flex-col">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noreferrer" className={inkPill}>
                    Live project <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className={outlinePill}>
                    {project.teamRepo ? 'My fork' : 'Source code'} <Github size={16} aria-hidden="true" />
                  </a>
                )}
                {project.teamRepo && (
                  <a href={project.teamRepo} target="_blank" rel="noreferrer" className={outlinePill}>
                    Team repository <Github size={16} aria-hidden="true" />
                  </a>
                )}
                {relatedNotes.length > 0 && (
                  <Link to={writeupHref} className={outlinePill}>
                    {relatedNotes.length === 1 ? 'Read the writeup' : 'Read the writeups'}
                    <NotebookPen size={16} aria-hidden="true" />
                  </Link>
                )}
                <button
                  type="button"
                  className={cn(outlinePill, 'cursor-pointer font-mono text-[13px]')}
                  onClick={() => void copy(`${site.url}/work/${project.slug}`)}
                >
                  {copyLabel}
                  {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
                </button>
                <span className="sr-only" role="status">
                  {copied ? 'Link copied to clipboard.' : ''}
                </span>
              </div>
            </div>

            {/* The facts sit in columns with a rule above each, like the numbers under the home hero. */}
            <dl
              className="mt-[clamp(40px,5vw,64px)] mb-0 grid grid-cols-1 gap-x-[clamp(24px,4vw,56px)] min-[760px]:grid-cols-2 min-[1100px]:grid-cols-4"
              aria-label="At a glance"
            >
              {glance.map(([label, value], index) => (
                // The outcome leads: it reads bigger than the facts beside it.
                <div key={label} className="min-w-0 border-t border-foreground/15 py-[18px]">
                  <dt className={factDt}>{label}</dt>
                  <dd
                    className={
                      index === 0
                        ? 'mt-2 mb-0 font-display text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] text-foreground'
                        : factDd
                    }
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <h2 className="m-0 font-mono text-[13px] font-normal tracking-normal text-muted-foreground">
                Built with
              </h2>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {project.mainStack.map((t) => (
                  <li key={t} className="rounded-full bg-surface-hover px-3 py-1.5 text-[14px] text-foreground">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </header>
          {heroShot && (
            // The same screenshot is in the gallery below with its description, so this copy is decoration.
            <div
              className="relative mt-[clamp(40px,5vw,64px)] aspect-[16/8] overflow-hidden rounded-md bg-stage-1 max-[620px]:aspect-[16/10]"
              aria-hidden="true"
              data-case-hero
            >
              <div className="absolute top-[9%] left-[6%] w-[94%] overflow-hidden rounded-tl-md shadow-[0_30px_60px_-30px_rgb(27_26_24/0.45)] [&_img]:block [&_img]:h-auto [&_img]:w-full">
                <ResponsiveImage src={heroShot.src} alt="" sizes="(max-width: 1100px) 94vw, 1180px" priority />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="section-wrap pb-[clamp(56px,7vw,96px)]">
        <div className="grid gap-[clamp(40px,5vw,64px)]">{render('intro')}</div>
        <section className={`mt-[clamp(40px,5vw,64px)] ${card}`} aria-labelledby="architecture-title">
          <h2 id="architecture-title" className={h2Class}>
            How a request flows
          </h2>
          <ol className="mt-[18px] grid list-none grid-cols-4 gap-7 p-0 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[22px]">
            {project.architecture.map((node) => (
              // An arrow after each step points to the next one: sideways in rows, turned downward on phones.
              <li
                key={node.label}
                className={cn(
                  'relative grid gap-1 rounded-md bg-surface-hover px-4 py-3.5',
                  'after:absolute after:top-1/2 after:-right-[22px] after:-translate-y-1/2 after:font-mono after:text-lg after:text-primary',
                  'not-last:after:content-["→"] max-[1100px]:nth-2:after:content-none',
                  'max-[620px]:after:top-auto max-[620px]:after:right-auto max-[620px]:after:-bottom-6 max-[620px]:after:left-[18px] max-[620px]:after:translate-y-0 max-[620px]:after:rotate-90 max-[620px]:nth-2:not-last:after:content-["→"]',
                )}
              >
                <b className="font-display text-base font-semibold">{node.label}</b>
                <span className="text-[14px] leading-[1.45] text-text-body">{node.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        {project.demo === 'rate-limiter' && <RateLimiterDemo />}

        <ArticleLayout
          className="mt-[clamp(40px,5vw,64px)]"
          rail={<TableOfContents items={sections.map(({ id, label }) => ({ id, label }))} />}
        >
          <div className={articleCards}>{render('article')}</div>
        </ArticleLayout>
      </div>

      {/* The neighbouring projects; the footer band below is the call to action. */}
      <div className="section-wrap pb-[clamp(88px,10vw,144px)]">
        <div className="border-t border-foreground/15 pt-[clamp(28px,3vw,40px)]">
          {/* Previous and next case studies; at either end of the list the slot links back to the work section. */}
          <nav className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1" aria-label="More case studies">
            {previous ? (
              <Link className={pagerLink} to={`/work/${previous.slug}`}>
                <span className={pagerLabel}>
                  <ArrowLeft size={15} /> Previous
                </span>
                <b className="font-display text-[1.375rem] font-semibold tracking-[-0.025em]">{previous.name}</b>
              </Link>
            ) : (
              <Link className={pagerLink} to="/projects">
                <span className={pagerLabel}>
                  <ArrowLeft size={15} /> Back to work
                </span>
                <b className="font-display text-[1.375rem] font-semibold tracking-[-0.025em]">All projects</b>
              </Link>
            )}
            {next ? (
              <Link className={cn(pagerLink, 'text-right max-[620px]:text-left')} to={`/work/${next.slug}`}>
                <span className={cn(pagerLabel, 'justify-end max-[620px]:justify-start')}>
                  Next <ArrowRight size={15} />
                </span>
                <b className="font-display text-[1.375rem] font-semibold tracking-[-0.025em]">{next.name}</b>
              </Link>
            ) : (
              <Link className={cn(pagerLink, 'text-right max-[620px]:text-left')} to="/projects">
                <span className={cn(pagerLabel, 'justify-end max-[620px]:justify-start')}>
                  Back to work <ArrowUpRight size={15} />
                </span>
                <b className="font-display text-[1.375rem] font-semibold tracking-[-0.025em]">All projects</b>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </article>
  )
}

export default CaseStudyPage
