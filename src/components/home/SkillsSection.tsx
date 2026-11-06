import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
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
        className="mb-6"
        aside={
          <>
            Highlighted skills are used in three or more projects. <br />
            Click a skill to filter the work above.
          </>
        }
      />
      <TooltipProvider delayDuration={120} skipDelayDuration={400} disableHoverableContent>
        <div className="border-t">
          {skillTabs.map((group) => {
            return (
              <div
                key={group.id}
                data-skill-group
                className="grid items-start gap-x-8 gap-y-3 border-b py-5 md:grid-cols-[13rem_minmax(0,1fr)]"
              >
                <h3 className="text-base font-semibold">{group.label}</h3>
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {group.skills.map(({ name, note }) => {
                      const used = projectsUsing(name)
                      return (
                        <li key={name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  'hit-area inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                                  'hover:border-primary hover:text-primary',
                                  'aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary',
                                  usageLevel(name) === 'Core' ? 'border-primary/50 text-primary' : 'text-foreground',
                                )}
                                aria-pressed={activeSkill === name}
                                aria-label={`Show ${used.length} project${used.length === 1 ? '' : 's'} using ${name}`}
                                onClick={(event) => onSkillSelect(name, event.currentTarget)}
                              >
                                {name}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="w-64 max-w-[calc(100vw-2rem)] px-4 py-3.5 text-left text-sm"
                              side="bottom"
                              sideOffset={8}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <p className="text-[.9375rem] font-semibold">{name}</p>
                                <span className="rounded-full border border-background/40 px-2 py-0.5 text-[.6875rem] font-medium tracking-wide text-background uppercase">
                                  {usageLevel(name)}
                                </span>
                              </div>
                              <p className="mt-1.5 leading-snug text-background/80">{note}</p>
                              {used.length > 0 && (
                                <div className="mt-3 border-t border-background/20 pt-3">
                                  <p className="flex justify-between text-xs font-medium">
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
                                  <p className="mt-2.5 text-xs leading-snug text-background/80">
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
                </div>
              </div>
            )
          })}
        </div>
      </TooltipProvider>
      <Link className={cn(textLinkClass, 'mt-6 text-primary')} to="/how-its-built">
        How this site is built <ArrowUpRight size={15} />
      </Link>
    </section>
  )
}

export default SkillsSection
