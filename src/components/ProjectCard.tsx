import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '../data/projects'
import ProjectVisual from './ProjectVisual'

type ProjectCardProps = {
  project: Project
  onOpen: (project: Project) => void
}

function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <article
      className={`project-card project-card--${project.visual}`}
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
      }}
    >
      <button className="project-card-trigger" type="button" onClick={() => onOpen(project)} aria-label={`Open ${project.name} case study`}>
        <div className={project.screenshots?.length ? 'project-visual project-visual--screenshots' : 'project-visual'}>
          <ProjectVisual project={project} />
          {!project.screenshots?.length && <span className="project-visual-note">Illustrative interface preview</span>}
        </div>
        <div className="project-copy">
          <div className="project-kicker"><span>{project.number} / {project.category}</span>{project.featured && <span className="featured-label">FEATURED</span>}</div>
          <h3>{project.name}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-summary">{project.summary}</p>
          <div className="project-card-footer"><span>{project.role}</span><span>Read case study <ArrowUpRight size={15} /></span></div>
        </div>
      </button>
      {(project.live || project.github) && (
        <div className="project-links" aria-label={`${project.name} project links`}>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15} /></a>}
          {project.github && <a href={project.github} target="_blank" rel="noreferrer">Source code <Github size={15} /></a>}
        </div>
      )}
    </article>
  )
}

export default ProjectCard
