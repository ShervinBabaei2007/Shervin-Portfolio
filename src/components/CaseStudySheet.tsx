import { ArrowUpRight, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Project } from '../data/projects'
import CodeBlock from './CodeBlock'

/** A side-drawer summary of a case study. The full write-up stays at /work/:slug. */
function CaseStudySheet({ project }: { project: Project }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm">Quick look</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{project.name}</SheetTitle>
          <SheetDescription>{project.subtitle}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="min-h-0 flex-1 px-4">
          <div className="space-y-6 pb-8">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
            </div>
            <section>
              <h3 className="mb-2 text-sm font-semibold">System architecture</h3>
              <ol className="space-y-2 text-sm">
                {project.architecture.map((step, index) => (
                  <li key={step.label} className="flex gap-3">
                    <span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <span><b>{step.label}</b>. <span className="text-muted-foreground">{step.detail}</span></span>
                  </li>
                ))}
              </ol>
            </section>
            <Separator />
            <section>
              <h3 className="mb-2 text-sm font-semibold">Technical challenges</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {project.mine.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="mt-3 text-sm"><b>Trade-off.</b> <span className="text-muted-foreground">{project.tradeoff}</span></p>
              <p className="mt-2 text-sm"><b>Learned.</b> <span className="text-muted-foreground">{project.learned}</span></p>
            </section>
            {project.snippet && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-2 text-sm font-semibold">Code</h3>
                  <CodeBlock snippet={project.snippet} maxLines={16} />
                </section>
              </>
            )}
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link to={`/work/${project.slug}`}>Full case study <ArrowUpRight /></Link></Button>
              {project.live && <Button asChild variant="outline" size="sm"><a href={project.live} target="_blank" rel="noreferrer">Live demo <ArrowUpRight /></a></Button>}
              {project.github && <Button asChild variant="outline" size="sm"><a href={project.github} target="_blank" rel="noreferrer">Source <Github /></a></Button>}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CaseStudySheet
