import ProjectCard from '@/components/home/ProjectCard'
import PageIntro from '@/components/shared/PageIntro'
import { projects } from '../data/projects'

function ProjectsPage() {
  // Flagship projects first, then the rest in their data order.
  const ordered = [...projects.filter((p) => p.flagship), ...projects.filter((p) => !p.flagship)]

  return (
    <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="projects-title">
      <PageIntro
        eyebrow="PROJECTS"
        id="projects-title"
        title="Everything I've built"
        lead="The full set, from the hackathon app to a Discord bot. Each one has a case study on what I built, what broke and what I would change."
      />
      <ul className="m-0 mt-2 grid list-none gap-6 p-0 md:grid-cols-2">
        {ordered.map((project, index) => (
          <li key={project.slug} className="flex">
            <div className="flex w-full [&>*]:h-full [&>*]:w-full">
              <ProjectCard project={project} revealDelay={(index % 2) * 0.08} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProjectsPage
