import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import WorkCard from '@/components/shared/WorkCard'
import { flagshipProjects, projects } from '@/data/projects'
import { outlinePill } from '@/lib/surfaces'

/** Selected work: the four flagship projects in a two-by-two grid, then a link to all of them. */
function WorkSection() {
  return (
    <section className="section-wrap pt-[clamp(56px,7vw,96px)]" id="work" aria-labelledby="work-title">
      <SectionHeading id="work-title" number="01" title="Selected work" />
      <div className="grid grid-cols-1 gap-x-[clamp(20px,2.4vw,32px)] gap-y-[clamp(44px,4.5vw,64px)] min-[1030px]:grid-cols-2">
        {flagshipProjects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.1}>
            <div className="min-w-0">
              <WorkCard project={project} index={index} />
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-[clamp(32px,4vw,48px)]">
        <Link to="/projects" className={outlinePill}>
          All {projects.length} projects <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default WorkSection
