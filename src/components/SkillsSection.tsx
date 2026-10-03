import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const skillGroups = [
  { title: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python'] },
  { title: 'Web', skills: ['React', 'Node.js', 'Express'] },
  { title: 'Data & APIs', skills: ['MongoDB', 'Redis', 'SQLite', 'REST API', 'JWT', 'WebSockets'] },
  { title: 'Delivery & testing', skills: ['Vercel', 'Auth0', 'Figma', 'pytest'] },
] as const

type SkillsSectionProps = {
  activeSkill: string | null
  onSkillSelect: (skill: string, trigger: HTMLElement) => void
}

const countFor = (skill: string) => projects.filter((project) => project.stack.includes(skill)).length

function SkillsSection({ activeSkill, onSkillSelect }: SkillsSectionProps) {
  return (
    <section className="skills-section section-wrap" id="skills" aria-labelledby="skills-title">
      <div className="section-heading skills-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">04</span> TOOLS & CURIOSITIES</p><h2 id="skills-title">What I work with<span>.</span></h2></div>
        <p className="section-aside">Every tool here is used in at least one <br />project you can open and read.</p>
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
                  const matchCount = countFor(skill)
                  return (
                    <li key={skill}>
                      <button
                        className="skill-chip"
                        type="button"
                        aria-pressed={activeSkill === skill}
                        aria-label={`Show ${matchCount} project${matchCount === 1 ? '' : 's'} using ${skill}`}
                        onClick={(event) => onSkillSelect(skill, event.currentTarget)}
                      >
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
              {countFor(activeSkill)} matching {countFor(activeSkill) === 1 ? 'project' : 'projects'}.
              {' '}<a href="#work">View matching work <ArrowUpRight size={14} /></a>
            </p>
          )}
        </div>
        <div className="skills-evidence skills-evidence-secondary">
          <h3>Used to build this site</h3>
          <p>This portfolio is a project too. It is tested like one.</p>
          <div className="skill-group"><h4>Build</h4><ul><li>React 18</li><li>TypeScript</li><li>Vite</li><li>React Router</li></ul></div>
          <div className="skill-group"><h4>Quality</h4><ul><li>Playwright end-to-end tests</li><li>axe-core accessibility checks</li><li>Prerendered HTML</li></ul></div>
          <Link className="text-link" to="/how-its-built">How this site is built <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
