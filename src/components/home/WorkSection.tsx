import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import WorkCard from '@/components/shared/WorkCard'
import { flagshipProjects, projects, spotlightProjects } from '@/data/projects'
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
      <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link to="/projects" className={outlinePill}>
          All {projects.length} projects <span aria-hidden="true">→</span>
        </Link>
        {/* The two names stay together on one line; on a phone the label sits on its own line above them. */}
        <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-0 text-[15px] text-muted-foreground max-[620px]:basis-full">
          <span className="font-mono text-[13px] max-[620px]:basis-full">Also built:</span>
          <span className="flex gap-x-4 whitespace-nowrap">
            {spotlightProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="inline-flex min-h-11 items-center text-foreground underline decoration-1 underline-offset-4 hover:text-primary"
              >
                {project.name}
              </Link>
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}

export default WorkSection
