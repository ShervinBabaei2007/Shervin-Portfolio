import { ArrowRight, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import ResponsiveImage from '@/components/shared/ResponsiveImage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Project } from '@/data/projects'

/**
 * The "From the project" card in the rail beside a writeup: which project it comes from, with a screenshot when
 * there is one, what the project is, its key result, and the two places to go next. Natural height.
 */
function WriteupAside({ project }: { project: Project }) {
  const shot = project.screenshots?.[0]
  return (
    <section aria-label="About this writeup" className="print:hidden">
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="gap-3 px-5 pt-5">
          <p className="eyebrow">FROM THE PROJECT</p>
          <div className="flex items-start gap-3.5">
            {shot && (
              <div
                className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md border bg-muted dark:brightness-[.94] [&_img]:block [&_img]:size-full [&_img]:object-cover [&_img]:object-top"
                aria-hidden="true"
              >
                <ResponsiveImage src={shot.src} alt="" sizes="96px" />
              </div>
            )}
            <div className="grid min-w-0 gap-1">
              <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
              <CardDescription className="line-clamp-2 leading-[1.55]">{project.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pt-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge>{project.category}</Badge>
            {project.stack.slice(0, 3).map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
          <p className="border-l-[3px] border-primary bg-muted px-3 py-2 text-sm font-semibold">{project.highlight}</p>
        </CardContent>
        <Separator className="mt-5" />
        <CardFooter className="flex flex-wrap gap-2 px-5 py-3.5">
          <Button asChild size="sm">
            <Link to={`/work/${project.slug}`} aria-label={`Read the ${project.name} case study`}>
              Case study <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {project.github && (
            <Button asChild size="sm" variant="outline">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source code on GitHub`}
              >
                Source code <Github aria-hidden="true" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </section>
  )
}

export default WriteupAside
