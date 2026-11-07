import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SkillLogo from '@/components/home/SkillLogo'
import SectionHeading from '@/components/shared/SectionHeading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { projects } from '@/data/projects'
import { projectsUsing, skillTabs, usageLevel } from '@/data/skills'
import { cn, textLinkClass } from '@/lib/utils'

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  const matches = activeSkill ? projectsUsing(activeSkill).length : 0

  return (
    <section className="section-wrap py-20 max-[620px]:py-12" id="skills" aria-labelledby="skills-title">
      <SectionHeading
        id="skills-title"
        number="04"
        eyebrow="TOOLS"
        title="What I work with"
        className="mb-8"
        aside={
          <>
            Highlighted skills are used in three or more projects. <br />
            Click a skill to filter the work above.
          </>
        }
      />
      <TooltipProvider delayDuration={120} skipDelayDuration={400} disableHoverableContent>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          {skillTabs.map((group) => (
            <Card key={group.id} data-skill-group className="gap-4">
              <CardHeader className="max-[620px]:px-4">
                <CardTitle className="text-lg">{group.label}</CardTitle>
                <CardDescription className="text-meta">{group.summary}</CardDescription>
              </CardHeader>
              {/* A container query, so tiles pair up when the card is wide enough rather than by screen width. */}
              <CardContent className="@container max-[620px]:px-4">
                <ul className="grid grid-cols-1 gap-2 @[17.5rem]:grid-cols-2 @[42rem]:grid-cols-3">
                  {group.skills.map(({ name, note }) => {
                    const used = projectsUsing(name)
                    const core = usageLevel(name) === 'Core'
                    return (
                      <li key={name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'group flex w-full flex-row items-center justify-between gap-3 rounded-lg border bg-background/40 p-3 text-left transition-colors',
                                // Narrow card: one compact row per skill. Wider card: a two-line tile (name, then usage bar).
                                '@[17.5rem]:flex-col @[17.5rem]:items-stretch @[17.5rem]:justify-start @[17.5rem]:gap-2',
                                'hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary/10',
                                core && 'border-primary/50',
                              )}
                              aria-pressed={activeSkill === name}
                              aria-label={`Show ${used.length} project${used.length === 1 ? '' : 's'} using ${name}`}
                              onClick={(event) => onSkillSelect(name, event.currentTarget)}
                            >
                              <span className="flex items-center gap-2.5">
                                <SkillLogo
                                  name={name}
                                  className={cn(
                                    'text-muted-foreground transition-colors group-hover:text-primary group-aria-pressed:text-primary',
                                    core && 'text-primary',
                                  )}
                                />
                                <span className="text-[.9375rem] font-medium">{name}</span>
                              </span>
                              <span className="flex w-24 shrink-0 items-center gap-2 font-mono text-label text-muted-foreground @[17.5rem]:w-auto">
                                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                                  <span
                                    className="block h-full rounded-full bg-primary/70"
                                    style={{ width: `${(used.length / projects.length) * 100}%` }}
                                  />
                                </span>
                                {used.length}
                              </span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            className="w-64 max-w-[calc(100vw-2rem)] px-4 py-3.5 text-left text-sm"
                            side="bottom"
                            sideOffset={8}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-[.9375rem] font-semibold">{name}</p>
                              <span className="rounded-full border border-background/40 px-2 py-0.5 text-label font-medium tracking-wide text-background uppercase">
                                {usageLevel(name)}
                              </span>
                            </div>
                            <p className="mt-1.5 leading-snug text-background/80">{note}</p>
                            {used.length > 0 && (
                              <div className="mt-3 border-t border-background/20 pt-3">
                                <p className="flex justify-between text-meta font-medium">
                                  <span>Used in</span>
                                  <span>
                                    {used.length} of {projects.length} projects
                                  </span>
                                </p>
                                <Progress
                                  className="mt-2 h-1.5 bg-background/25 [&_[data-slot=progress-indicator]]:bg-background"
                                  value={(used.length / projects.length) * 100}
                                  aria-label={`${name} is used in ${used.length} of ${projects.length} projects`}
                                />
                                <p className="mt-2.5 text-meta leading-snug text-background/80">
                                  {used.map((project) => project.name).join(' · ')}
                                </p>
                              </div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    )
                  })}
                </ul>
                {group.skills.some((skill) => skill.name === activeSkill) && (
                  <p className="mt-4 border-t pt-3 text-sm text-muted-foreground" aria-live="polite">
                    {matches} matching {matches === 1 ? 'project' : 'projects'}.{' '}
                    <a className="font-semibold text-primary underline-offset-4 hover:underline" href="#work">
                      View matching work <ArrowUpRight className="inline size-3.5" />
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </TooltipProvider>
      <Link className={cn(textLinkClass, 'mt-6 text-primary')} to="/how-its-built">
        How this site is built <ArrowUpRight size={15} />
      </Link>
    </section>
  )
}

export default SkillsSection
