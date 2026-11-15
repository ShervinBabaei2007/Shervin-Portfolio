import { ArrowUpRight, Github } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { Project } from '@/data/projects'
import CodeBlock from '@/components/shared/CodeBlock'

type Props = { project: Project; open: boolean; onOpenChange: (open: boolean) => void }

/** A side-drawer summary of a case study. The full write-up stays at /work/:slug. */
function CaseStudySheet({ project, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{project.name}</SheetTitle>
          <SheetDescription>{project.subtitle}</SheetDescription>
        </SheetHeader>
        {/* A plain scroller, not Radix ScrollArea: its inner table wrapper grows to fit the widest line of code, which pushed
            the text out of the frame. A focusable region keeps it usable by keyboard. */}
        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 focus-visible:outline-2 focus-visible:-outline-offset-2"
          // A scrolling region must be reachable by keyboard (axe: scrollable-region-focusable).
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          role="region"
          aria-label={`${project.name} details`}
        >
          <div className="space-y-6 pb-8 [overflow-wrap:anywhere]">
            <p className="text-sm leading-[1.7] text-muted-foreground">{project.nonTechnicalSummary}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.mainStack.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
            {project.signal && (
              <section className="grid gap-3 text-sm">
                <p>
                  <b>I owned.</b> <span className="text-muted-foreground">{project.signal.ownership}</span>
                </p>
                <p>
                  <b>Evidence.</b> <span className="text-muted-foreground">{project.signal.evidence}</span>
                </p>
              </section>
            )}
            <section>
              <h3 className="mb-2 text-sm font-semibold">System architecture</h3>
              {/* Each step is numbered 01, 02, and so on. */}
              <ol className="space-y-2 text-sm">
                {project.architecture.map((step, index) => (
                  <li key={step.label} className="flex gap-3">
                    <span className="font-mono text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <span>
                      <b>{step.label}</b>. <span className="text-muted-foreground">{step.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
            <Separator />
            <section>
              <h3 className="mb-2 text-sm font-semibold">Technical challenges</h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {project.mine.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                <b>Trade-off.</b> <span className="text-muted-foreground">{project.tradeoff}</span>
              </p>
              <p className="mt-2 text-sm">
                <b>Learned.</b> <span className="text-muted-foreground">{project.learned}</span>
              </p>
            </section>
            {project.snippet && (
              <>
                <Separator />
                <section>
                  <h3 className="mb-2 text-sm font-semibold">Code</h3>
                  <CodeBlock snippet={project.snippet} maxLines={16} focusable />
                </section>
              </>
            )}
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to={`/work/${project.slug}`}>
                  Full case study <ArrowUpRight />
                </Link>
              </Button>
              {project.live && (
                <Button asChild variant="outline" size="sm">
                  <a href={project.live} target="_blank" rel="noreferrer">
                    Live demo <ArrowUpRight />
                  </a>
                </Button>
              )}
              {project.github && (
                <Button asChild variant="outline" size="sm">
                  <a href={project.github} target="_blank" rel="noreferrer">
                    Source <Github />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CaseStudySheet
