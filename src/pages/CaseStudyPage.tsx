import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import CodeBlock from '@/components/shared/CodeBlock'
import RateLimiterDemo from '@/components/shared/RateLimiterDemo'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import TerminalBlock from '@/components/shared/TerminalBlock'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { notesForProject } from '../data/notes'
import { findProject, projects } from '../data/projects'
import NotFoundPage from './NotFoundPage'

const h2Class = 'text-xl font-semibold'
const bodyClass =
  'mt-2.5 max-w-[70ch] text-[1.125rem] leading-[1.75] text-muted-foreground max-[620px]:text-[1.0625rem]'
const factDt = 'font-mono text-xs text-muted-foreground'
const factDd = 'mt-[5px] text-sm leading-normal font-semibold'
const snapshotDt = 'font-mono text-[.6875rem] tracking-[.045em] text-muted-foreground'
const snapshotDd = 'mt-[7px] text-sm leading-normal font-semibold'
const projectLink =
  'inline-flex min-h-11 items-center gap-2 text-[.9375rem] font-semibold text-primary no-underline underline-offset-4 hover:underline'
const pagerLink =
  'grid gap-1.5 border bg-card px-5 py-[18px] no-underline hover:border-primary [&:hover_b]:text-primary'
const pagerLabel = 'flex items-center gap-1.5 text-sm text-muted-foreground'

function CaseStudyPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  if (!project) return <NotFoundPage />

  const index = projects.indexOf(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const relatedNotes = notesForProject(project.slug)

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

      <header className="mt-[18px] max-w-[900px]">
        <p className="eyebrow">
          {project.category.toUpperCase()} <span className="eyebrow-divider">/</span> {project.date.toUpperCase()}
        </p>
        <h1
          id="case-study-title"
          className="mt-3.5 text-[clamp(2.5rem,1.8rem+2.4vw,4rem)] leading-[1.04] font-semibold"
        >
          {project.name}
        </h1>
        <p className="mt-2 max-w-[60ch] text-[1.1875rem] leading-[1.6] text-muted-foreground">{project.subtitle}</p>

        <dl className="mt-[26px] mb-2 grid grid-cols-[minmax(140px,.65fr)_minmax(0,1.35fr)] gap-x-6 gap-y-3.5 border-l-[3px] border-primary bg-background px-[18px] py-4 max-[620px]:grid-cols-1 max-[620px]:gap-[11px] max-[620px]:p-3.5">
          <div className="min-w-0">
            <dt className={factDt}>MY ROLE</dt>
            <dd className={factDd}>{project.role}</dd>
          </div>
          <div className="min-w-0">
            <dt className={factDt}>KEY RESULT</dt>
            <dd className={factDd}>{project.highlight}</dd>
          </div>
          <div className="col-span-full min-w-0">
            <dt className={factDt}>TEAM</dt>
            <dd className="mt-[5px] flex items-baseline gap-2 text-sm leading-normal">
              <Users className="translate-y-0.5 flex-none text-primary" size={15} aria-hidden="true" /> {project.team}
            </dd>
          </div>
        </dl>

        {project.signal && (
          <dl
            className="mt-[18px] mb-1 grid grid-cols-3 gap-px bg-border p-px max-[900px]:grid-cols-1 print:bg-transparent"
            aria-label="Engineering snapshot"
          >
            <div className="min-w-0 bg-card px-4 py-[15px]">
              <dt className={snapshotDt}>OWNERSHIP</dt>
              <dd className={snapshotDd}>{project.signal.ownership}</dd>
            </div>
            <div className="min-w-0 border-t-[3px] border-primary bg-card px-4 py-[15px] max-[900px]:border-t-0 max-[900px]:border-l-[3px]">
              <dt className={snapshotDt}>DECISION</dt>
              <dd className={snapshotDd}>{project.signal.decision}</dd>
            </div>
            <div className="min-w-0 bg-[color-mix(in_srgb,var(--primary)_14%,var(--card))] px-4 py-[15px]">
              <dt className={snapshotDt}>EVIDENCE</dt>
              <dd className={snapshotDd}>{project.signal.evidence}</dd>
            </div>
          </dl>
        )}

        {(project.live || project.github || project.teamRepo) && (
          <div className="mt-[19px] flex flex-wrap gap-x-[22px] gap-y-3">
            {project.live && (
              <a className={projectLink} href={project.live} target="_blank" rel="noreferrer">
                Live project <ArrowUpRight size={17} />
              </a>
            )}
            {project.github && (
              <a className={projectLink} href={project.github} target="_blank" rel="noreferrer">
                {project.teamRepo ? 'My fork' : 'Source code'} <Github size={17} />
              </a>
            )}
            {project.teamRepo && (
              <a className={projectLink} href={project.teamRepo} target="_blank" rel="noreferrer">
                Team repository <Github size={17} />
              </a>
            )}
          </div>
        )}
      </header>

      <section className="mt-9 border-t pt-[22px] pb-1.5" aria-labelledby="architecture-title">
        <h2 id="architecture-title" className={h2Class}>
          How a request flows
        </h2>
        <ol className="mt-[18px] grid list-none grid-cols-4 gap-7 p-0 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[22px]">
          {project.architecture.map((node) => (
            <li
              key={node.label}
              className={cn(
                'relative grid gap-1 border bg-card px-4 py-3.5',
                'after:absolute after:top-1/2 after:-right-[22px] after:-translate-y-1/2 after:font-mono after:text-lg after:text-primary',
                'not-last:after:content-["→"] max-[1100px]:nth-2:after:content-none',
                'max-[620px]:after:top-auto max-[620px]:after:right-auto max-[620px]:after:-bottom-6 max-[620px]:after:left-[18px] max-[620px]:after:translate-y-0 max-[620px]:after:rotate-90 max-[620px]:nth-2:not-last:after:content-["→"]',
              )}
            >
              <b className="text-base font-semibold">{node.label}</b>
              <span className="text-[.8125rem] leading-[1.45] text-muted-foreground">{node.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.video && (
        <figure className="mt-8">
          <video
            className="block h-auto w-full border bg-[#0f1a30]"
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

      {project.demo === 'rate-limiter' && <RateLimiterDemo />}

      <div
        className={cn(
          'mt-[18px] grid items-start gap-9 max-[620px]:mt-5 max-[620px]:grid-cols-1 max-[620px]:gap-[25px]',
          project.screenshots ? 'grid-cols-[minmax(0,1fr)_minmax(300px,.62fr)]' : 'grid-cols-[minmax(0,1fr)]',
        )}
      >
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)] [&>section]:border-b [&>section]:py-[26px]">
            <section>
              <h2 className={h2Class}>Why</h2>
              <p className={bodyClass}>{project.why}</p>
            </section>
            <section>
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
              <section>
                <h2 className={h2Class}>The code</h2>
                <CodeBlock snippet={project.snippet} />
              </section>
            )}
            {project.terminal && (
              <section>
                <h2 className={h2Class}>See it run</h2>
                <TerminalBlock title={project.terminal.title} transcript={project.terminal.transcript} />
              </section>
            )}
            <section>
              <h2 className={h2Class}>Outcome</h2>
              <p className={bodyClass}>{project.outcome}</p>
            </section>
            <section className="mt-1 !border-b-0 border-l-[3px] border-l-primary bg-card px-5">
              <h2 className={h2Class}>The trade-off</h2>
              <p className={bodyClass}>{project.tradeoff}</p>
            </section>
            <section>
              <h2 className={h2Class}>What I learned</h2>
              <p className={bodyClass}>{project.learned}</p>
            </section>
            <section>
              <h2 className={h2Class}>What I&apos;d fix next</h2>
              <p className={bodyClass}>{project.next}</p>
            </section>
            {relatedNotes.length > 0 && (
              <section>
                <h2 className={h2Class}>Go deeper</h2>
                {relatedNotes.map((note) => (
                  <Link
                    key={note.slug}
                    className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border bg-card px-4 py-3.5 no-underline hover:border-primary"
                    to={`/notes/${note.slug}`}
                  >
                    <b className="text-[1.0625rem] font-semibold">{note.title}</b>
                    <span className="font-mono text-xs text-muted-foreground">{note.minutes} min read</span>
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
                  <Badge variant="outline" className="rounded-none font-mono">
                    {t}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {project.screenshots && (
          <aside
            className="sticky top-[calc(var(--header-height)+20px)] min-w-0 self-start border-l pl-6 max-[900px]:static max-[620px]:border-t max-[620px]:border-l-0 max-[620px]:pt-[22px] max-[620px]:pl-0"
            aria-label={`${project.name} screenshots`}
          >
            <h2 className={cn(h2Class, 'mb-3.5 max-[620px]:text-lg')}>Screens</h2>
            <div className="m-0 grid grid-cols-1 gap-4">
              {project.screenshots.map((shot) => (
                <figure key={shot.src} className="m-0 min-w-0 p-0">
                  <a
                    className="grid min-h-[180px] place-items-center bg-background max-[620px]:min-h-[220px] [&_img]:block [&_img]:h-[clamp(190px,27svh,270px)] [&_img]:w-full [&_img]:object-contain max-[620px]:[&_img]:h-[280px]"
                    href={shot.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open full-size screenshot: ${shot.caption}`}
                  >
                    <ResponsiveImage src={shot.src} alt={shot.alt} sizes="(max-width: 900px) 92vw, 380px" />
                  </a>
                  <figcaption className="pt-2 text-sm text-muted-foreground">{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </aside>
        )}
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
