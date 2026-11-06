import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Github, Link2, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import CodeBlock from '@/components/shared/CodeBlock'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'
import ScreenshotGallery from '@/components/shared/ScreenshotGallery'
import TerminalBlock from '@/components/shared/TerminalBlock'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/lib/utils'
import { notesForProject } from '../data/notes'
import { findProject, projects } from '../data/projects'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const h2Class = 'text-xl font-semibold'
const bodyClass =
  'mt-2.5 max-w-[70ch] text-[1.125rem] leading-[1.75] text-muted-foreground max-[620px]:text-[1.0625rem]'
const factDt = 'font-mono text-label text-muted-foreground'
const factDd = 'mt-[5px] text-sm leading-normal font-semibold'
const pagerLink =
  'grid gap-1.5 rounded-xl border bg-card px-5 py-[18px] no-underline hover:border-primary [&:hover_b]:text-primary'
const pagerLabel = 'flex items-center gap-1.5 text-sm text-muted-foreground'

function CaseStudyPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  const { copied, failed, copy } = useCopy()
  if (!project) return <NotFoundPage />

  const index = projects.indexOf(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const relatedNotes = notesForProject(project.slug)
  const glance: [string, string][] = [
    ['MY ROLE', project.role],
    ['KEY RESULT', project.highlight],
    ...(project.signal
      ? ([
          ['DECISION', project.signal.decision],
          ['EVIDENCE', project.signal.evidence],
        ] as [string, string][])
      : []),
  ]
  const sections: [string, string][] = [
    ['why', 'Why'],
    ['built', 'What I built'],
    ...(project.snippet ? ([['code', 'The code']] as [string, string][]) : []),
    ...(project.terminal ? ([['run', 'See it run']] as [string, string][]) : []),
    ['outcome', 'Outcome'],
    ['tradeoff', 'The trade-off'],
    ['learned', 'What I learned'],
    ['next', 'Fix next'],
  ]

  return (
    <article
      className="section-wrap pt-9 pb-24 max-[620px]:pt-[18px] max-[620px]:pb-16"
      aria-labelledby="case-study-title"
    >
      <PageBreadcrumb
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Work', to: '/#work' },
        ]}
        current={project.name}
      />

      <header className="mt-[18px]">
        <p className="eyebrow">
          {project.category.toUpperCase()} <span className="text-muted-foreground">/</span> {project.date.toUpperCase()}
        </p>
        <h1
          id="case-study-title"
          className="mt-3.5 text-[clamp(2.25rem,1.6rem+2.2vw,3.5rem)] leading-[1.08] font-semibold"
        >
          {project.name}
        </h1>
        <p className="mt-2 max-w-[60ch] text-[1.1875rem] leading-[1.6] text-muted-foreground">{project.subtitle}</p>

        <p className="mt-3.5 flex max-w-[70ch] items-baseline gap-2 text-sm leading-normal text-muted-foreground">
          <Users className="flex-none translate-y-0.5 text-primary" size={15} aria-hidden="true" /> {project.team}
        </p>

        <dl
          className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-4 rounded-r-lg border-l-[3px] border-primary bg-card px-5 py-[18px] max-[620px]:grid-cols-1 max-[620px]:gap-[11px] max-[620px]:p-3.5"
          aria-label="At a glance"
        >
          {glance.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className={factDt}>{label}</dt>
              <dd className={factDd}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {project.live && (
            <Button asChild size="lg" className="h-11 px-[17px] text-control font-semibold">
              <a href={project.live} target="_blank" rel="noreferrer">
                Live project <ArrowUpRight />
              </a>
            </Button>
          )}
          {project.github && (
            <Button asChild variant="outline" size="lg" className="h-11 px-[17px] text-control font-semibold">
              <a href={project.github} target="_blank" rel="noreferrer">
                {project.teamRepo ? 'My fork' : 'Source code'} <Github />
              </a>
            </Button>
          )}
          {project.teamRepo && (
            <Button asChild variant="outline" size="lg" className="h-11 px-[17px] text-control font-semibold">
              <a href={project.teamRepo} target="_blank" rel="noreferrer">
                Team repository <Github />
              </a>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 px-[17px] text-control font-semibold"
            onClick={() => void copy(`${site.url}/work/${project.slug}`)}
          >
            {copied ? <Check /> : <Link2 />}
            {copied ? 'Link copied' : failed ? 'Copy it from the address bar' : 'Copy link'}
          </Button>
          <span className="sr-only" role="status">
            {copied ? 'Link copied to clipboard.' : ''}
          </span>
        </div>

        <nav className="mt-6 flex flex-wrap gap-x-1 gap-y-1" aria-label="On this page">
          {sections.map(([id, label]) => (
            <a
              key={id}
              className="inline-flex min-h-8 items-center rounded-full border px-3 font-mono text-label text-muted-foreground no-underline transition-colors hover:border-primary hover:text-primary max-[620px]:min-h-11"
              href={`#${id}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      {project.video && (
        <figure className="mt-8">
          <video
            className="block h-auto w-full rounded-xl border bg-[#0f1a30]"
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
        <section className="mt-8" aria-label={`${project.name} screenshots`}>
          <ScreenshotGallery shots={project.screenshots} projectName={project.name} layout="strip" />
        </section>
      )}

      <section className="mt-9 border-t pt-[22px] pb-1.5" aria-labelledby="architecture-title">
        <h2 id="architecture-title" className={h2Class}>
          How a request flows
        </h2>
        <ol className="mt-[18px] grid list-none grid-cols-4 gap-7 p-0 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[22px]">
          {project.architecture.map((node) => (
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

      <div className="mt-[18px] grid grid-cols-[minmax(0,1fr)] items-start max-[620px]:mt-5">
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)] [&>section]:border-b [&>section]:py-[26px]">
            <section id="why">
              <h2 className={h2Class}>Why</h2>
              <p className={bodyClass}>{project.why}</p>
            </section>
            <section id="built">
              <h2 className={h2Class}>What I built</h2>
              <ol className="mt-2.5 grid list-none gap-3 p-0">
                {project.mine.map((step, i) => (
                  <li key={step} className="grid grid-cols-[30px_1fr] items-start gap-2.5">
                    <span className="pt-1 font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                    <p className={cn(bodyClass, 'm-0')}>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            {project.snippet && (
              <section id="code">
                <h2 className={h2Class}>The code</h2>
                <CodeBlock snippet={project.snippet} />
              </section>
            )}
            {project.terminal && (
              <section id="run">
                <h2 className={h2Class}>See it run</h2>
                <TerminalBlock title={project.terminal.title} transcript={project.terminal.transcript} />
              </section>
            )}
            <section id="outcome">
              <h2 className={h2Class}>Outcome</h2>
              <p className={bodyClass}>{project.outcome}</p>
            </section>
            <section
              id="tradeoff"
              className="mt-1 rounded-r-lg !border-b-0 border-l-[3px] border-l-primary bg-card px-5"
            >
              <h2 className={h2Class}>The trade-off</h2>
              <p className={bodyClass}>{project.tradeoff}</p>
            </section>
            <section id="learned">
              <h2 className={h2Class}>What I learned</h2>
              <p className={bodyClass}>{project.learned}</p>
            </section>
            <section id="next">
              <h2 className={h2Class}>What I&apos;d fix next</h2>
              <p className={bodyClass}>{project.next}</p>
            </section>
            {relatedNotes.length > 0 && (
              <section>
                <h2 className={h2Class}>Go deeper</h2>
                {relatedNotes.map((note) => (
                  <Link
                    key={note.slug}
                    className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border bg-card px-4 py-3.5 no-underline hover:border-primary"
                    to={`/notes/${note.slug}`}
                  >
                    <b className="text-[1.0625rem] font-semibold">{note.title}</b>
                    <span className="font-mono text-label text-muted-foreground">{note.minutes} min read</span>
                  </Link>
                ))}
              </section>
            )}
          </div>
          <div className="pt-6">
            <h2 className={h2Class}>Built with</h2>
            <ul className="mt-[15px] flex list-none flex-wrap gap-1.5 p-0">
              {project.stack.map((t) => (
                <li key={t}>
                  <Badge variant="outline" className="rounded-none font-mono font-normal">
                    {t}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <nav className="mt-14 grid grid-cols-2 gap-4 max-[620px]:grid-cols-1" aria-label="More case studies">
        <Link className={pagerLink} to={`/work/${previous.slug}`}>
          <span className={pagerLabel}>
            <ArrowLeft size={15} /> Previous
          </span>
          <b className="text-xl font-semibold">{previous.name}</b>
        </Link>
        <Link className={cn(pagerLink, 'text-right max-[620px]:text-left')} to={`/work/${next.slug}`}>
          <span className={cn(pagerLabel, 'justify-end max-[620px]:justify-start')}>
            Next <ArrowRight size={15} />
          </span>
          <b className="text-xl font-semibold">{next.name}</b>
        </Link>
      </nav>
    </article>
  )
}

export default CaseStudyPage
