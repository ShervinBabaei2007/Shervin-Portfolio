import { useEffect, useRef } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/projects'

type CaseStudyDialogProps = {
  project: Project | null
  onClose: () => void
}

function CaseStudyDialog({ project, onClose }: CaseStudyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  return (
    <dialog
      ref={dialogRef}
      className="case-study-dialog"
      aria-labelledby={project ? 'case-study-title' : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault()
        dialogRef.current?.close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          dialogRef.current?.close()
        }
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
    >
      {project && (
        <div className="case-study-content">
          <div className="case-study-header">
            <p className="eyebrow"><span className="eyebrow-mark">{project.number}</span> {project.category} <span className="eyebrow-divider">/</span> PROJECT CASE STUDY</p>
            <form method="dialog"><button className="case-study-close" aria-label="Close case study">×</button></form>
          </div>
          <h2 id="case-study-title">{project.name}</h2>
          <p className="case-study-subtitle">{project.subtitle}</p>
          <dl className="case-study-at-a-glance">
            <div><dt>MY ROLE</dt><dd>{project.role}</dd></div>
            <div><dt>KEY RESULT</dt><dd>{project.highlight}</dd></div>
          </dl>
          {(project.github || project.live) && (
            <div className="case-study-links">
              {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub repository <Github size={17} /></a>}
              {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={17} /></a>}
            </div>
          )}
          <div className={project.screenshots ? 'case-study-layout' : 'case-study-layout case-study-layout--text-only'}>
            <div className="case-study-main">
              <div className="case-study-sections">
                <section><h3>Why</h3><p>{project.why}</p></section>
                <section><h3>Goal</h3><p>{project.goal}</p></section>
                <section><h3>Process</h3><ol>{project.process.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol></section>
                <section><h3>Outcome</h3><p>{project.outcome}</p></section>
                <section><h3>What I learned</h3><p>{project.learned}</p></section>
                <section><h3>What I&apos;d improve next</h3><p>{project.next}</p></section>
              </div>
              <div className="case-study-stack"><h3>Built with</h3><ul className="tag-list">{project.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
            </div>
            {project.screenshots && (
              <aside className={`case-study-sidebar case-study-sidebar--${project.visual}`} aria-label={`${project.name} project screenshots`}>
                <h3>Project screens</h3>
                <div className={`case-study-gallery case-study-gallery--${project.visual}`}>
                  {project.screenshots.map((screenshot) => (
                    <figure key={screenshot.src}>
                      <a href={screenshot.src} target="_blank" rel="noreferrer" aria-label={`Open full-size screenshot: ${screenshot.caption}`}>
                        <img src={screenshot.src} alt={screenshot.alt} loading="lazy" decoding="async" />
                      </a>
                      <figcaption>{screenshot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

export default CaseStudyDialog
