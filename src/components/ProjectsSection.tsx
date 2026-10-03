import { useState } from 'react'
import { projects, type Project } from '../data/projects'
import ProjectCard from './ProjectCard'

const filters = ['All work', 'Full-stack', 'AI tools', 'Systems', 'Hackathon'] as const
type Filter = (typeof filters)[number]

type ProjectsSectionProps = {
  activeSkill: string | null
  onClearSkill: () => void
  onOpenProject: (project: Project) => void
}

function ProjectsSection({ activeSkill, onClearSkill, onOpenProject }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All work')
  const visibleProjects = activeSkill
    ? projects.filter((project) => project.stack.includes(activeSkill))
    : activeFilter === 'All work'
      ? projects
      : projects.filter((project) => project.category === activeFilter)

  return (
    <section className="work-section section-wrap" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">02</span> SELECTED WORK</p><h2 id="work-title">Built with intent<span>.</span></h2></div>
        <p className="section-aside">A few things I&apos;ve made,<br />and what I learned building them.</p>
      </div>
      <div className="filter-row" role="group" aria-label="Filter projects">
        {filters.map((filter) => (
          <button key={filter} className={activeFilter === filter && !activeSkill ? 'filter-button is-active' : 'filter-button'} type="button" aria-pressed={activeFilter === filter && !activeSkill} onClick={() => { setActiveFilter(filter); onClearSkill() }}>{filter}</button>
        ))}
        <span className="project-count">{String(visibleProjects.length).padStart(2, '0')} {visibleProjects.length === 1 ? 'PROJECT' : 'PROJECTS'}</span>
      </div>
      {activeSkill && (
        <p className="active-skill-filter" aria-live="polite">
          Showing projects that use <strong>{activeSkill}</strong>.
          <button type="button" onClick={onClearSkill}>Clear skill filter</button>
        </p>
      )}
      <div className="project-grid" aria-live="polite">
        {visibleProjects.map((project) => <ProjectCard key={project.name} project={project} onOpen={onOpenProject} />)}
      </div>
    </section>
  )
}

export default ProjectsSection
