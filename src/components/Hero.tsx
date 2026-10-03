import { useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, Braces, FileDown } from 'lucide-react'
import { projects, type Project } from '../data/projects'

const systemLayers = [
  { id: 'ui', number: '01', title: 'UI', caption: 'WHAT YOU SEE', detail: 'Turn user tasks into clear React screens, forms, and feedback.', projects: ['SkillMatch', 'GitScribe', 'ThinkBoard'] },
  { id: 'api', number: '02', title: 'API', caption: 'HOW IT CONNECTS', detail: 'Connect interfaces to routes, authentication, and stored data.', projects: ['SkillMatch', 'ThinkBoard', 'Discord AI Automation Bridge'] },
  { id: 'core', number: '03', title: 'CORE', caption: 'WHY IT WORKS', detail: 'Understand the rules, asynchronous work, and state behind a feature.', projects: ['Discord AI Automation Bridge', 'Mini RPG Battle'] },
] as const

type HeroProps = {
  onOpenProject: (project: Project) => void
}

function Hero({ onOpenProject }: HeroProps) {
  const [activeLayerId, setActiveLayerId] = useState<(typeof systemLayers)[number]['id']>('ui')
  const activeLayer = systemLayers.find((layer) => layer.id === activeLayerId)!
  const layerProjects = activeLayer.projects
    .map((name) => projects.find((project) => project.name === name))
    .filter((project): project is Project => Boolean(project))

  return (
    <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-mark">01</span> VANCOUVER, BC <span className="eyebrow-divider">/</span> BCIT</p>
        <h1 id="hero-title">I build things<br />to understand<br /><span>how they work.</span></h1>
        <p className="hero-role">Shervin Babaei <span>·</span> BCIT Full-Stack Web Development</p>
        <p className="hero-intro">I build full-stack applications and trace how the interface, APIs, and data fit together.</p>
        <p className="hero-target">Seeking co-op and junior developer roles in Vancouver / Burnaby.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">Explore my work <ArrowDownRight size={16} /></a>
          <a className="button button-secondary" href="/Shervin_Babaei_Resume.pdf" download="Shervin_Babaei_Resume.pdf">Download resume <FileDown size={16} /></a>
        </div>
        <div className="hero-layer-panel" aria-live="polite">
          <div>
            <span className="hero-layer-label">{activeLayer.title} / {activeLayer.caption}</span>
            <p>{activeLayer.detail}</p>
          </div>
          <div className="hero-layer-projects" aria-label={`Projects that demonstrate ${activeLayer.title}`}>
            {layerProjects.map((project) => (
              <button key={project.name} type="button" onClick={() => onOpenProject(project)}>{project.name} <ArrowUpRight size={14} /></button>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-art" role="group" aria-label="Explore projects by application layer">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <span className="art-cross art-cross-one">+</span>
        <span className="art-cross art-cross-two">+</span>
        <div className="art-center"><Braces size={31} strokeWidth={1.5} /><span>TRACE THE<br />WHOLE SYSTEM</span></div>
        {systemLayers.map((layer) => (
          <button
            key={layer.id}
            className={`art-node art-node-${layer.id}${activeLayerId === layer.id ? ' is-active' : ''}`}
            type="button"
            aria-pressed={activeLayerId === layer.id}
            aria-label={`Show ${layer.title} layer projects`}
            onClick={() => setActiveLayerId(layer.id)}
          >
            <span>{layer.number}</span><b>{layer.title}</b><small>{layer.caption}</small>
          </button>
        ))}
      </div>
      <a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      <span className="hero-index">PORTFOLIO — 2026</span>
    </section>
  )
}

export default Hero
