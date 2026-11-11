import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SkillLogo from '@/components/home/SkillLogo'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { projectsUsing, skillTabs } from '@/data/skills'
import { cn, textLinkClass } from '@/lib/utils'

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  const matches = activeSkill ? projectsUsing(activeSkill).length : 0

  return (
    <section className="section-wrap section-y" id="skills" aria-labelledby="skills-title">
      <SectionHeading
        id="skills-title"
        number="04"
        eyebrow="TOOLS"
        title="What I work with"
        aside="Every skill here shipped in a project. Click one to filter the work above."
      />
      <TooltipProvider delayDuration={120} skipDelayDuration={400} disableHoverableContent>
        <div className="grid items-stretch gap-6 lg:grid-cols-3">
          {skillTabs.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.08}>
              <Card data-skill-group className="gap-5">
                <CardHeader className="max-[620px]:px-4">
                  <CardTitle className="text-lg">{group.label}</CardTitle>
                  <CardDescription className="text-meta">{group.summary}</CardDescription>
                </CardHeader>
                {/* A container query, so tiles pair up when the card is wide enough rather than by screen width. */}
                <CardContent className="@container max-[620px]:px-4">
                  <ul className="grid grid-cols-1 gap-3 @[17.5rem]:grid-cols-2 @[42rem]:grid-cols-3">
                    {group.skills.map(({ name, note }) => {
                      const used = projectsUsing(name)
                      return (
                        <li key={name}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className={cn(
                                  'group flex w-full items-center gap-3 rounded-lg border bg-background/40 p-4 text-left transition-colors',
                                  'hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary/10',
                                )}
                                aria-pressed={activeSkill === name}
                                aria-label={`Show ${used.length} project${used.length === 1 ? '' : 's'} using ${name}`}
                                onClick={(event) => onSkillSelect(name, event.currentTarget)}
                              >
                                <SkillLogo
                                  name={name}
                                  className="text-muted-foreground transition-colors group-hover:text-primary group-aria-pressed:text-primary"
                                />
                                <span className="text-[.9375rem] font-medium">{name}</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              className="w-64 max-w-[calc(100vw-2rem)] px-4 py-3.5 text-left text-sm"
                              side="bottom"
                              sideOffset={8}
                            >
                              <p className="text-[.9375rem] font-semibold">{name}</p>
                              <p className="mt-1.5 leading-snug text-background/80">{note}</p>
                              {used.length > 0 && (
                                <div className="mt-3 border-t border-background/20 pt-3">
                                  <p className="text-meta font-medium">Used in</p>
                                  <p className="mt-1.5 text-meta leading-snug text-background/80">
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
                    <div className="mt-4 border-t pt-3 text-sm text-muted-foreground" aria-live="polite">
                      <p>
                        {matches} matching {matches === 1 ? 'project' : 'projects'}.{' '}
                        <a className="font-semibold text-primary underline-offset-4 hover:underline" href="#work">
                          View matching work <ArrowUpRight className="inline size-3.5" />
                        </a>
                      </p>
                      <p className="mt-2 leading-snug">
                        {projectsUsing(activeSkill ?? '').map((project, position) => (
                          <span key={project.slug}>
                            {position > 0 && ' · '}
                            <Link className={textLinkClass} to={`/work/${project.slug}`}>
                              {project.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </TooltipProvider>
      <Link className={cn(textLinkClass, 'mt-10 text-primary')} to="/how-its-built">
        How this site is built <ArrowUpRight size={15} />
      </Link>
    </section>
  )
}

export default SkillsSection
