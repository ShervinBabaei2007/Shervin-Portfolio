import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findProject, type Project } from '@/data/projects'
import { cn } from '@/lib/utils'

// One request travels through three layers, in this order: the screen, the API behind it, then the rules at the core.
// Each layer lists the three projects that show it best: pick ones whose case study is really about that layer.
const layers = [
  {
    id: 'ui',
    number: '1',
    title: 'UI',
    caption: 'WHAT YOU SEE',
    detail: 'Turn user tasks into clear React screens, forms, and feedback.',
    projects: ['gitscribe', 'skillmatch', 'network-growth-assistant'],
  },
  {
    id: 'api',
    number: '2',
    title: 'API',
    caption: 'HOW IT CONNECTS',
    detail: 'Connect interfaces to routes, authentication, and stored data.',
    projects: ['thinkboard', 'skillmatch', 'linklocker'],
  },
  {
    id: 'core',
    number: '3',
    title: 'CORE',
    caption: 'WHY IT WORKS',
    detail: 'Understand the rules, asynchronous work, and state behind a feature.',
    projects: ['network-growth-assistant', 'discord-ai-bridge', 'mini-rpg-battle'],
  },
] as const

type LayerId = (typeof layers)[number]['id']

const monoLabel = 'font-mono text-label leading-[normal]'

/**
 * The hero's interactive diagram: a request follows a numbered path down through three layers. Select a step to see
 * what that layer means to me and which projects show it. Built on Tabs, so arrow keys move between steps and
 * screen readers hear tabs and a panel.
 */
function RequestTrace() {
  const [active, setActive] = useState<LayerId>('ui')

  return (
    <Card className="gap-0 overflow-hidden py-0 shadow-none">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-2.5">
        <span className={cn(monoLabel, 'tracking-wide text-muted-foreground')}>FOLLOW A REQUEST DOWN THE STACK</span>
        <span className={cn(monoLabel, 'shrink-0 text-muted-foreground')}>Select a step</span>
      </div>
      <Tabs value={active} onValueChange={(value) => setActive(value as LayerId)}>
        <TabsList aria-label="Explore projects by application layer" className="grid w-full">
          {layers.map((layer, index) => (
            <TabsTrigger
              key={layer.id}
              value={layer.id}
              className="group relative flex h-auto w-full items-center gap-3.5 rounded-none px-4 py-3.5 whitespace-normal hover:bg-muted/40 data-[state=active]:bg-muted/60"
            >
              {/* The step number, with a line running down to the next step so the order reads as a path. */}
              <span
                className={cn(
                  monoLabel,
                  'relative z-[1] grid size-7 shrink-0 place-items-center rounded-full border bg-background font-medium text-muted-foreground transition-colors duration-200 motion-reduce:transition-none',
                  'group-data-[state=active]:border-primary group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground',
                )}
                aria-hidden="true"
              >
                {layer.number}
              </span>
              {index < layers.length - 1 && (
                <span
                  className="absolute top-[calc(0.875rem+1.75rem)] -bottom-3.5 left-[calc(1rem+0.8125rem)] z-0 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              {/* One line per step: the name on the left and its caption on the right, so the row has no dead space. */}
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="text-base leading-none font-semibold text-muted-foreground group-data-[state=active]:text-foreground">
                  {layer.title}
                </span>
                <span className={cn(monoLabel, 'shrink-0 text-right text-muted-foreground')}>{layer.caption}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {layers.map((layer) => (
          <TabsContent
            key={layer.id}
            value={layer.id}
            className="animate-in border-t px-4 py-4 duration-200 fade-in-0 motion-reduce:animate-none"
          >
            <p className="text-[.875rem] leading-[1.55] text-muted-foreground">{layer.detail}</p>
            {/* A full-width list, one project per row, so the links line up and nothing wraps into a ragged gap. */}
            <ul
              className="m-0 mt-3 list-none divide-y overflow-hidden rounded-lg border p-0"
              aria-label={`Projects that demonstrate ${layer.title}`}
            >
              {layer.projects
                .map((slug) => findProject(slug))
                .filter((project): project is Project => Boolean(project))
                .map((project) => (
                  <li key={project.slug}>
                    <Link
                      className="flex min-h-9 items-center justify-between gap-3 px-3 py-1.5 text-meta text-foreground no-underline transition-colors hover:bg-muted/60 hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring pointer-coarse:min-h-11"
                      to={`/work/${project.slug}`}
                    >
                      <span className="font-medium">{project.name}</span>
                      <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                        <span className={monoLabel}>{project.category}</span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

export default RequestTrace
