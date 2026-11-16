import { ArrowRight, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import type { Project } from '@/data/projects'

const linkPill =
  'inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] no-underline transition-colors pointer-coarse:h-11'

/**
 * The "From the project" panel in the rail beside a writeup: which project it comes from, with a screenshot when
 * there is one, what the project is, its key result, and the two places to go next. Natural height.
 */
function WriteupAside({ project }: { project: Project }) {
  const shot = project.screenshots?.[0]
  return (
    // Wide screens only: on a phone the rail sits above the text, and the same links close the article.
    <section aria-label="About this writeup" className="rounded-md bg-surface-hover p-5 max-lg:hidden print:hidden">
      <p className="m-0 font-mono text-[13px] text-muted-foreground">From the project</p>
      <div className="mt-3 flex items-start gap-3.5">
        {shot && (
          <div
            className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[4px] bg-stage-1 [&_img]:block [&_img]:size-full [&_img]:object-cover [&_img]:object-top"
            aria-hidden="true"
          >
            <ResponsiveImage src={shot.src} alt="" sizes="96px" />
          </div>
        )}
        <div className="grid min-w-0 gap-1">
          <h2 className="m-0 text-[1.25rem] leading-tight tracking-[-0.025em]">{project.name}</h2>
          <p className="m-0 line-clamp-2 text-[14px] leading-[1.55] text-text-body">{project.subtitle}</p>
        </div>
      </div>
      <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
        {[project.category, ...project.mainStack.slice(0, 3)].map((item) => (
          <li key={item} className="rounded-full bg-canvas px-2.5 py-1 text-[13px] text-foreground">
            {item}
          </li>
        ))}
      </ul>
      <p className="m-0 mt-4 font-mono text-[13px] leading-[1.5] text-primary">{project.highlight}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to={`/work/${project.slug}`}
          aria-label={`Read the ${project.name} case study`}
          className={`${linkPill} bg-foreground text-background hover:bg-primary-fill hover:text-primary-foreground`}
        >
          Case study <ArrowRight size={15} aria-hidden="true" />
        </Link>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.name} source code on GitHub`}
            className={`${linkPill} border border-foreground/25 text-foreground hover:bg-foreground hover:text-background`}
          >
            Source code <Github size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  )
}

export default WriteupAside
