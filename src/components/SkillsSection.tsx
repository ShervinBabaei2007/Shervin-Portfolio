import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { projectsUsing, skillTabs, usageLevel } from '../data/skills'

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

const countFor = (skill: string) => projectsUsing(skill).length

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  return (
    <section className="skills-section section-wrap" id="skills" aria-labelledby="skills-title">
      <div className="section-heading skills-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-mark">05</span> TOOLS & CURIOSITIES
          </p>
          <h2 id="skills-title">
            What I work with<span>.</span>
          </h2>
        </div>
        <p className="section-aside">
          Every tool here is used in at least one <br />
          project you can open and read.
        </p>
      </div>
      <div className="skills-evidence-grid">
        <div className="skills-evidence">
          <h3>Used in these projects</h3>
          <Tabs defaultValue="web">
            <TabsList>
              {skillTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {skillTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <ul className="skill-group-list">
                  {tab.skills.map(({ name, note }) => {
                    const used = projectsUsing(name)
                    const matchCount = used.length
                    return (
                      <li key={name}>
                        <HoverCard openDelay={150}>
                          <HoverCardTrigger asChild>
                            <button
                              className="skill-chip"
                              type="button"
                              aria-pressed={activeSkill === name}
                              aria-label={`Show ${matchCount} project${matchCount === 1 ? '' : 's'} using ${name}`}
                              onClick={(event) => onSkillSelect(name, event.currentTarget)}
                            >
                              {name}
                              <span>{matchCount}</span>
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
              </TabsContent>
            ))}
          </Tabs>
          {activeSkill && (
            <p className="skills-evidence-status" aria-live="polite">
              {countFor(activeSkill)} matching {countFor(activeSkill) === 1 ? 'project' : 'projects'}.{' '}
              <a href="#work">
                View matching work <ArrowUpRight size={14} />
              </a>
            </p>
          )}
        </div>
        <div className="skills-evidence skills-evidence-secondary">
          <h3>Used to build this site</h3>
          <p>This portfolio is a project too. It is tested like one.</p>
          <div className="skill-group">
            <h4>Build</h4>
            <ul>
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>React Router</li>
            </ul>
          </div>
          <div className="skill-group">
            <h4>Quality</h4>
            <ul>
              <li>Playwright end-to-end tests</li>
              <li>axe-core accessibility checks</li>
              <li>Prerendered HTML</li>
            </ul>
          </div>
          <Link className="text-link" to="/how-its-built">
            How this site is built <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
