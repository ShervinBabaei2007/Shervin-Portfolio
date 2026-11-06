import { lazy, Suspense, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import CodeBlock from './CodeBlock'
import ResponsiveImage from './ResponsiveImage'
import TerminalBlock from './TerminalBlock'

function CardMedia({ project }: { project: Project }) {
  if (project.screenshots?.length) {
    return (
      <div className="project-visual project-visual--screenshots" aria-hidden="true">
        <div className={`project-screenshot-strip project-screenshot-strip--${project.slug}`}>
          {project.screenshots.slice(0, 3).map((screenshot) => (
            <figure key={screenshot.src}>
              <ResponsiveImage src={screenshot.src} alt="" sizes="(max-width: 620px) 30vw, 200px" />
            </figure>
          ))}
        </div>
      </div>
    )
  }
  if (project.snippet) {
    return (
      <div className="project-visual project-visual--code" aria-hidden="true">
        <CodeBlock snippet={project.snippet} maxLines={11} showCaption={false} />
      </div>
    )
  }
  if (project.terminal) {
    return (
      <div className="project-visual project-visual--code" aria-hidden="true">
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

function ProjectCard({ project }: { project: Project }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetRequested, setSheetRequested] = useState(false)

  return (
    <article
      className="project-card"
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
      }}
    >
      <Link className="project-card-trigger" to={`/work/${project.slug}`} aria-label={`${project.name} case study`}>
        <CardMedia project={project} />
        <div className="project-copy">
          <div className="project-kicker">
            <span>{project.category}</span>
            <span>{project.date}</span>
          </div>
          <h3>{project.name}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-summary">{project.summary}</p>
          {project.signal && (
            <dl className="project-signal-grid">
              <div>
                <dt>I OWNED</dt>
                <dd>{project.signal.ownership}</dd>
              </div>
              <div>
                <dt>EVIDENCE</dt>
                <dd>{project.signal.evidence}</dd>
              </div>
            </dl>
          )}
          <blockquote className="project-insight">
            <span>THE ENGINEERING TURN</span>
            <p>{project.learned}</p>
          </blockquote>
          {!project.signal && (
            <p className="project-result">
              <span>Proof it shipped</span>
              {project.highlight}
            </p>
          )}
          <div className="project-card-footer">
            <span>{project.role}</span>
            <span>
              Read case study <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </Link>
      {
        <div className="project-links" aria-label={`${project.name} project links`}>
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
            <a href={project.live} target="_blank" rel="noreferrer">
              Live project <ArrowUpRight size={15} />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">
              Source code <Github size={15} />
            </a>
          )}
        </div>
      }
    </article>
  )
}

export default ProjectCard
