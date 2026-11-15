import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2, NotebookPen, Users } from 'lucide-react'
import ArticleLayout from '@/components/shared/ArticleLayout'
import TableOfContents from '@/components/shared/TableOfContents'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import ClosingCta from '@/components/shared/ClosingCta'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import CodeBlock from '@/components/shared/CodeBlock'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'
import ScreenshotGallery from '@/components/shared/ScreenshotGallery'
import TerminalBlock from '@/components/shared/TerminalBlock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/useCopy'
import { tone } from '@/lib/buttonTones'
import { caseStudySections, type CaseStudySection, type SectionId } from '@/lib/caseStudySections'
import { cn } from '@/lib/utils'
import { notesForProject } from '../data/notes'
import { findProject, projects } from '../data/projects'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const h2Class = 'text-h2 font-semibold'
const bodyClass = 'mt-2.5 text-[1.125rem] leading-[1.75] text-muted-foreground max-[620px]:text-[1.0625rem]'
const factDt = 'font-mono text-label text-muted-foreground'
// Header action buttons: a row that wraps on small screens, and a stack of equal-width buttons beside the title on wide ones.
const actionButton = 'h-11 px-[17px] text-control font-semibold min-[1024px]:w-full min-[1024px]:justify-between'
const factDd = 'mt-[5px] text-sm leading-normal font-semibold'
const pagerLink =
  'grid gap-1.5 rounded-xl border bg-card px-5 py-[18px] no-underline hover:border-primary [&:hover_b]:text-primary'
const pagerLabel = 'flex items-center gap-1.5 text-sm text-muted-foreground'

/** A list of steps numbered 01, 02, and so on. */
function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-2.5 grid list-none gap-3 p-0">
      {steps.map((step, i) => (
        <li key={step} className="grid grid-cols-[30px_1fr] items-start gap-2.5">
          <span className="pt-1 font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
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
    ['MY ROLE', project.role],
    ['KEY RESULT', project.result],
    ...(project.signal
      ? ([
          ['DECISION', project.signal.decision],
          ['EVIDENCE', project.signal.evidence],
        ] as [string, string][])
      : []),
  ]
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
      <section key="what" id="what" className="border-b py-10">
        <h2 className={h2Class}>What it is</h2>
        {overview.map((paragraph) => (
          <p key={paragraph} className={bodyClass}>
            {paragraph}
          </p>
        ))}
      </section>
    ),
    does: () => (
      <section key="does" id="does" className="border-b py-10">
        <h2 className={h2Class}>What it can do</h2>
        <ul className="mt-3 grid list-none gap-3 p-0 min-[760px]:grid-cols-2">
          {features.map((feature) => (
            <li key={feature.title} className="rounded-lg border bg-card px-4 py-3.5">
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-1 text-[.9375rem] leading-[1.6] text-muted-foreground">{feature.text}</p>
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
        className="mt-1 rounded-r-lg !border-b-0 border-l-[3px] border-l-primary bg-card px-5"
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
    <article className="section-wrap page-y" aria-labelledby="case-study-title">
      <PageBreadcrumb
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Work', to: '/#work' },
        ]}
        current={project.name}
      />

      {/* Title block on the left, actions on the right (stacked above the phone breakpoint's wide layout), summary card below. */}
      <header className="mt-[18px]">
        <div className="grid gap-6 min-[1024px]:grid-cols-[minmax(0,1fr)_23rem] min-[1024px]:items-start min-[1024px]:gap-12">
          <div>
            <p className="eyebrow">
              {project.category.toUpperCase()} <span className="text-muted-foreground">/</span>{' '}
              {project.date.toUpperCase()}
            </p>
            <h1 id="case-study-title" className="mt-3.5 text-title font-semibold">
              {project.name}
            </h1>
            <p className="mt-2 max-w-[60ch] text-[1.1875rem] leading-[1.6] text-muted-foreground">{project.subtitle}</p>
            <p className="mt-3.5 flex max-w-[70ch] items-baseline gap-2 text-sm leading-normal text-muted-foreground">
              <Users className="flex-none translate-y-0.5 text-primary" size={15} aria-hidden="true" /> {project.team}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 min-[1024px]:grid min-[1024px]:grid-cols-2 min-[1024px]:gap-2.5">
            {project.live && (
              <Button asChild size="lg" className={cn(actionButton, 'min-[1024px]:col-span-2')}>
                <a href={project.live} target="_blank" rel="noreferrer">
                  Live project <ArrowUpRight />
                </a>
              </Button>
            )}
            {project.github && (
              <Button asChild variant="outline" size="lg" className={actionButton}>
                <a href={project.github} target="_blank" rel="noreferrer">
                  {project.teamRepo ? 'My fork' : 'Source code'} <Github />
                </a>
              </Button>
            )}
            {project.teamRepo && (
              <Button asChild variant="outline" size="lg" className={actionButton}>
                <a href={project.teamRepo} target="_blank" rel="noreferrer">
                  Team repository <Github />
                </a>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className={actionButton}
              onClick={() => void copy(`${site.url}/work/${project.slug}`)}
            >
              {copyLabel}
              {copied ? <Check /> : <Link2 />}
            </Button>
            {relatedNotes.length > 0 && (
              <Button asChild size="lg" className={cn(actionButton, 'shadow-md min-[1024px]:col-span-2', tone.writeup)}>
                <Link to={writeupHref}>
                  {relatedNotes.length === 1 ? 'Read the writeup' : 'Read the writeups'} <NotebookPen />
                </Link>
              </Button>
            )}
            <span className="sr-only" role="status">
              {copied ? 'Link copied to clipboard.' : ''}
            </span>
          </div>
        </div>

        <dl
          className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-4 rounded-r-lg border-l-[3px] border-primary bg-card px-5 py-[18px] max-[620px]:mt-6 max-[620px]:grid-cols-1 max-[620px]:gap-[11px] max-[620px]:p-3.5 min-[621px]:max-[1099px]:grid-cols-2"
          aria-label="At a glance"
        >
          {glance.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className={factDt}>{label}</dt>
              <dd className={factDd}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5">
          <h2 className="eyebrow uppercase">Built with</h2>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {project.mainStack.map((t) => (
              <li key={t}>
                <Badge
                  variant="secondary"
                  className="rounded-md border-foreground/25 bg-foreground/10 px-3 py-1 font-mono text-[.8125rem] text-foreground"
                >
                  {t}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {render('intro')}
      <section className="mt-9 border-t pt-[22px] pb-1.5" aria-labelledby="architecture-title">
        <h2 id="architecture-title" className={h2Class}>
          How a request flows
        </h2>
        <ol className="mt-[18px] grid list-none grid-cols-4 gap-7 p-0 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[22px]">
          {project.architecture.map((node) => (
            // An arrow after each step points to the next one: sideways in rows, turned downward on phones.
            <li
              key={node.label}
              className={cn(
                'relative grid gap-1 rounded-lg border bg-card px-4 py-3.5',
                'after:absolute after:top-1/2 after:-right-[22px] after:-translate-y-1/2 after:font-mono after:text-lg after:text-primary',
                'not-last:after:content-["→"] max-[1100px]:nth-2:after:content-none',
                'max-[620px]:after:top-auto max-[620px]:after:right-auto max-[620px]:after:-bottom-6 max-[620px]:after:left-[18px] max-[620px]:after:translate-y-0 max-[620px]:after:rotate-90 max-[620px]:nth-2:not-last:after:content-["→"]',
              )}
            >
              <b className="text-base font-semibold">{node.label}</b>
              <span className="text-meta leading-[1.45] text-muted-foreground">{node.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.demo === 'rate-limiter' && <RateLimiterDemo />}

      <ArticleLayout
        className="mt-[18px] max-[620px]:mt-5"
        rail={<TableOfContents items={sections.map(({ id, label }) => ({ id, label }))} />}
      >
        <div className="grid grid-cols-[minmax(0,1fr)] [&>section]:border-b [&>section]:py-[26px]">
          {render('article')}
        </div>
      </ArticleLayout>

      <ClosingCta
        heading={`Working on something like ${project.name}?`}
        body="Tell me what you're building and I'll reply within two business days."
      />

      {/* Previous and next case studies; at either end of the list the slot links back to the work section. */}
      <nav className="mt-6 grid grid-cols-2 gap-4 max-[620px]:grid-cols-1" aria-label="More case studies">
        {previous ? (
          <Link className={pagerLink} to={`/work/${previous.slug}`}>
            <span className={pagerLabel}>
              <ArrowLeft size={15} /> Previous
            </span>
            <b className="text-xl font-semibold">{previous.name}</b>
          </Link>
        ) : (
          <Link className={pagerLink} to="/#work">
            <span className={pagerLabel}>
              <ArrowLeft size={15} /> Back to work
            </span>
            <b className="text-xl font-semibold">All projects</b>
          </Link>
        )}
        {next ? (
          <Link className={cn(pagerLink, 'text-right max-[620px]:text-left')} to={`/work/${next.slug}`}>
            <span className={cn(pagerLabel, 'justify-end max-[620px]:justify-start')}>
              Next <ArrowRight size={15} />
            </span>
            <b className="text-xl font-semibold">{next.name}</b>
          </Link>
        ) : (
          <Link className={cn(pagerLink, 'text-right max-[620px]:text-left')} to="/#work">
            <span className={cn(pagerLabel, 'justify-end max-[620px]:justify-start')}>
              Back to work <ArrowUpRight size={15} />
            </span>
            <b className="text-xl font-semibold">All projects</b>
          </Link>
        )}
      </nav>
    </article>
  )
}

export default CaseStudyPage
