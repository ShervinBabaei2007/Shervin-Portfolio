import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'

const skillGroups = [
  { title: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python'] },
  { title: 'Web', skills: ['React', 'Node.js', 'Express'] },
  { title: 'Data & APIs', skills: ['MongoDB', 'Redis', 'REST API', 'JWT', 'GitHub OAuth'] },
  { title: 'Delivery & testing', skills: ['GitHub Actions', 'Vercel', 'Figma', 'pytest'] },
] as const

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  return (
    <section className="skills-section section-wrap" id="skills" aria-labelledby="skills-title">
      <div className="section-heading skills-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">04</span> TOOLS & CURIOSITIES</p><h2 id="skills-title">What I work with<span>.</span></h2></div>
        <p className="section-aside">A growing toolkit, organized<br />around how I build.</p>
      </div>
      <div className="skills-evidence-grid">
        <div className="skills-evidence">
          <h3>Used in these projects</h3>
          {skillGroups.map((group, index) => (
            <div className="skill-group" key={group.title}>
              <span className="skill-number">0{index + 1}</span>
              <h4>{group.title}</h4>
              <ul>
                {group.skills.map((skill) => {
                  const matchCount = projects.filter((project) => project.stack.includes(skill)).length
                  const selected = activeSkill === skill
                  return (
                    <li key={skill}>
                      <button className="skill-chip" type="button" aria-pressed={selected} aria-label={`Show ${matchCount} project${matchCount === 1 ? '' : 's'} using ${skill}`} onClick={(event) => onSkillSelect(skill, event.currentTarget)}>
                        {skill}<span>{matchCount}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
          {activeSkill && (
            <p className="skills-evidence-status" aria-live="polite">
              {projects.filter((project) => project.stack.includes(activeSkill)).length} matching {projects.filter((project) => project.stack.includes(activeSkill)).length === 1 ? 'project' : 'projects'}.
              {' '}<a href="#work">View matching work <ArrowUpRight size={14} /></a>
            </p>
          )}
        </div>
        <div className="skills-evidence skills-evidence-secondary">
          <h3>Additional tools on my resume</h3>
          <p>Other technologies I&apos;ve used or studied; depth varies by tool.</p>
          <div className="skill-group"><h4>Frameworks & styling</h4><ul><li>Flask</li><li>TanStack</li><li>Tailwind CSS</li></ul></div>
          <div className="skill-group"><h4>Data & APIs</h4><ul><li>SQL</li><li>MySQL</li><li>PostgreSQL</li><li>Drizzle ORM</li><li>Sequelize</li><li>SQLAlchemy</li><li>WebSockets</li></ul></div>
          <div className="skill-group"><h4>Cloud & workflow</h4><ul><li>AWS EC2 / S3</li><li>Docker</li><li>Jira</li><li>Jest</li><li>Better Auth</li><li>OAuth 2.0</li></ul></div>
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
