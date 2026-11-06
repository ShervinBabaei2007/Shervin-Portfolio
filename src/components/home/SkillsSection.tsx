import { ArrowUpRight, Cpu, Layers, Wrench, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '@/components/shared/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { projectsUsing, siteStack, skillTabs, usageLevel } from '@/data/skills'
import { cn, textLinkClass } from '@/lib/utils'

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

const icons: Record<(typeof skillTabs)[number]['id'], LucideIcon> = { web: Layers, systems: Cpu, tools: Wrench }

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  const matches = activeSkill ? projectsUsing(activeSkill).length : 0

  return (
    <section className="section-wrap py-20" id="skills" aria-labelledby="skills-title">
      <SectionHeading
        id="skills-title"
        number="07"
        eyebrow="TOOLS"
        title="What I work with"
        className="mb-8"
        aside={
          <>
            Green means used in three or more projects. <br />
            Click any skill to filter the work above.
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {skillTabs.map((group) => {
          const Icon = icons[group.id]
          return (
            <Card key={group.id}>
              <CardHeader>
                <Icon className="mb-2 size-5 text-primary" aria-hidden="true" />
                <CardTitle className="text-lg">{group.label}</CardTitle>
                <CardDescription>{group.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map(({ name, note }) => {
                    const used = projectsUsing(name)
                    return (
                      <li key={name}>
                        <HoverCard openDelay={150}>
                          <HoverCardTrigger asChild>
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
                          </HoverCardTrigger>
                          <HoverCardContent className="w-72 text-sm">
                            <p className="font-semibold">
                              {name} <Badge variant="outline">{usageLevel(name)}</Badge>
                            </p>
                            <p className="mt-1 text-muted-foreground">{note}</p>
                            {used.length > 0 && (
                              <p className="mt-2 text-xs text-muted-foreground">
                                Used in {used.map((project) => project.name).join(', ')}.
                              </p>
                            )}
                          </HoverCardContent>
                        </HoverCard>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {activeSkill && (
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {matches} matching {matches === 1 ? 'project' : 'projects'}.{' '}
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href="#work">
            View matching work <ArrowUpRight className="inline size-3.5" />
          </a>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-card px-5 py-4 text-sm">
        <span className="font-semibold">This site is a project too</span>
        {siteStack.map((group) => (
          <span key={group.title} className="text-muted-foreground">
            <b className="font-medium text-foreground">{group.title}:</b> {group.items.join(', ')}
          </span>
        ))}
        <Link className={cn(textLinkClass, 'ml-auto text-primary')} to="/how-its-built">
          How it is built <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  )
}

export default SkillsSection
