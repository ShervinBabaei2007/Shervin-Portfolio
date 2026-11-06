import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock'
import RateLimiterDemo from '../components/RateLimiterDemo'
import ResponsiveImage from '../components/ResponsiveImage'
import TerminalBlock from '../components/TerminalBlock'
import { notesForProject } from '../data/notes'
import { findProject, projects } from '../data/projects'
import NotFoundPage from './NotFoundPage'

function CaseStudyPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  if (!project) return <NotFoundPage />

  const index = projects.indexOf(project)
  const previous = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const relatedNotes = notesForProject(project.slug)

  return (
    <article className="case-page section-wrap" aria-labelledby="case-study-title">
      <nav className="case-breadcrumb" aria-label="Breadcrumb">
        <Link to="/#work">
          <ArrowLeft size={15} /> All projects
        </Link>
      </nav>

      <header className="case-page-header">
        <p className="eyebrow">
          {project.category.toUpperCase()} <span className="eyebrow-divider">/</span> {project.date.toUpperCase()}
        </p>
        <h1 id="case-study-title">{project.name}</h1>
        <p className="case-study-subtitle">{project.subtitle}</p>

        <dl className="case-study-at-a-glance">
          <div>
            <dt>MY ROLE</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>KEY RESULT</dt>
            <dd>{project.highlight}</dd>
          </div>
          <div className="case-team">
            <dt>TEAM</dt>
            <dd>
              <Users size={15} aria-hidden="true" /> {project.team}
            </dd>
          </div>
        </dl>

        {project.signal && (
          <dl className="case-engineering-snapshot" aria-label="Engineering snapshot">
            <div>
              <dt>OWNERSHIP</dt>
              <dd>{project.signal.ownership}</dd>
            </div>
            <div>
              <dt>DECISION</dt>
              <dd>{project.signal.decision}</dd>
            </div>
            <div>
              <dt>EVIDENCE</dt>
              <dd>{project.signal.evidence}</dd>
            </div>
          </dl>
        )}

        {(project.live || project.github || project.teamRepo) && (
          <div className="case-study-links">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer">
                Live project <ArrowUpRight size={17} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer">
                {project.teamRepo ? 'My fork' : 'Source code'} <Github size={17} />
              </a>
            )}
            {project.teamRepo && (
              <a href={project.teamRepo} target="_blank" rel="noreferrer">
                Team repository <Github size={17} />
              </a>
            )}
          </div>
        )}
      </header>

      <section className="case-architecture" aria-labelledby="architecture-title">
        <h2 id="architecture-title">How a request flows</h2>
        <ol>
          {project.architecture.map((node) => (
            <li key={node.label}>
              <b>{node.label}</b>
              <span>{node.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      {project.video && (
        <figure className="case-video">
          <video controls muted playsInline preload="none" poster={project.video.poster} width={1280} height={800}>
            <source src={project.video.src} type={project.video.type ?? 'video/mp4'} />
          </video>
          <figcaption>{project.video.caption}</figcaption>
        </figure>
      )}

      {project.demo === 'rate-limiter' && <RateLimiterDemo />}

      <div className={project.screenshots ? 'case-study-layout' : 'case-study-layout case-study-layout--text-only'}>
        <div className="case-study-main">
          <div className="case-study-sections">
            <section>
              <h2>Why</h2>
              <p>{project.why}</p>
            </section>
            <section>
              <h2>What I built</h2>
              <ol>
                {project.mine.map((step, i) => (
                  <li key={step}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            {project.snippet && (
              <section>
                <h2>The code</h2>
                <CodeBlock snippet={project.snippet} />
              </section>
            )}
            {project.terminal && (
              <section>
                <h2>See it run</h2>
                <TerminalBlock title={project.terminal.title} transcript={project.terminal.transcript} />
              </section>
            )}
            <section>
              <h2>Outcome</h2>
              <p>{project.outcome}</p>
            </section>
            <section className="case-tradeoff">
              <h2>The trade-off</h2>
              <p>{project.tradeoff}</p>
            </section>
            <section>
              <h2>What I learned</h2>
              <p>{project.learned}</p>
            </section>
            <section>
              <h2>What I&apos;d fix next</h2>
              <p>{project.next}</p>
            </section>
            {relatedNotes.length > 0 && (
              <section className="case-notes">
                <h2>Go deeper</h2>
                {relatedNotes.map((note) => (
                  <Link key={note.slug} to={`/notes/${note.slug}`}>
                    <b>{note.title}</b>
                    <span>{note.minutes} min read</span>
                  </Link>
                ))}
              </section>
            )}
          </div>
          <div className="case-study-stack">
            <h2>Built with</h2>
            <ul className="tag-list">
              {project.stack.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        {project.screenshots && (
          <aside className="case-study-sidebar" aria-label={`${project.name} screenshots`}>
            <h2>Screens</h2>
            <div className="case-study-gallery">
              {project.screenshots.map((shot) => (
                <figure key={shot.src}>
                  <a
                    href={shot.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open full-size screenshot: ${shot.caption}`}
                  >
                    <ResponsiveImage src={shot.src} alt={shot.alt} sizes="(max-width: 900px) 92vw, 380px" />
                  </a>
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          </aside>
        )}
      </div>

      <nav className="case-pager" aria-label="More case studies">
        <Link to={`/work/${previous.slug}`}>
          <span>
            <ArrowLeft size={15} /> Previous
          </span>
          <b>{previous.name}</b>
        </Link>
        <Link to={`/work/${next.slug}`}>
          <span>
            Next <ArrowRight size={15} />
          </span>
          <b>{next.name}</b>
        </Link>
      </nav>
    </article>
  )
}

export default CaseStudyPage
