import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SkillLogo from '@/components/home/SkillLogo'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { projects } from '@/data/projects'
import { projectsUsing, skillTabs } from '@/data/skills'
import { cn, textLinkClass } from '@/lib/utils'

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

/** Each group's skills, most-used first, and how many different projects the group appears in. */
const groups = skillTabs.map((group) => ({
  ...group,
  skills: [...group.skills].sort((a, b) => projectsUsing(b.name).length - projectsUsing(a.name).length),
  projectCount: new Set(group.skills.flatMap((skill) => projectsUsing(skill.name).map((project) => project.slug))).size,
}))

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
        {/* On a phone the six groups are one swipeable row (one card on screen, the next peeking in), not a 2,400px stack. */}
        <Carousel
          opts={{ align: 'start', breakpoints: { '(min-width: 621px)': { active: false } } }}
          aria-label="Skill groups"
          className="w-full"
        >
          <CarouselContent className="-ml-4 min-[621px]:ml-0 min-[621px]:grid min-[621px]:items-stretch min-[621px]:gap-6 lg:grid-cols-3">
            {groups.map((group, index) => (
              <CarouselItem key={group.id} className="basis-[88%] min-[621px]:basis-auto min-[621px]:pl-0 [&>*]:h-full">
                <Reveal delay={index * 0.08}>
                  <Card data-skill-group className="h-full gap-5">
                    <CardHeader className="max-[620px]:px-4">
                      <CardTitle className="text-lg">{group.label}</CardTitle>
                      <CardDescription className="text-meta">{group.summary}</CardDescription>
                      <p className="mt-1 font-mono text-label text-muted-foreground">
                        Used in {group.projectCount} of {projects.length} projects
                      </p>
                    </CardHeader>
                    {/* A container query, so tiles pair up when the card is wide enough rather than by screen width. */}
                    <CardContent className="@container max-[620px]:px-4">
                      <ul className="grid grid-cols-1 gap-2.5 min-[621px]:gap-3 @[17.5rem]:grid-cols-2 @[42rem]:grid-cols-3">
                        {group.skills.map(({ name, note }) => {
                          const used = projectsUsing(name)
                          return (
                            <li key={name}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className={cn(
                                      'group flex w-full items-center gap-2.5 rounded-lg border bg-background/40 p-3 text-left transition-colors min-[621px]:gap-3 min-[621px]:p-4',
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
                                    <span className="text-[.9375rem] font-medium max-[620px]:text-[.875rem]">
                                      {name}
                                    </span>
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </TooltipProvider>
      <Link className={cn(textLinkClass, 'mt-10 text-primary')} to="/how-its-built">
        How this site is built <ArrowUpRight size={15} />
      </Link>
    </section>
  )
}

export default SkillsSection
