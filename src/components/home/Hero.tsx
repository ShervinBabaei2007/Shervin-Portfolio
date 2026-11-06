import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Braces, FileText, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { findProject, type Project } from '@/data/projects'
import { availabilityLine, site } from '@/data/site'
import { facts } from '@/data/facts'

const systemLayers = [
  {
    id: 'ui',
    number: '01',
    title: 'UI',
    caption: 'WHAT YOU SEE',
    detail: 'Turn user tasks into clear React screens, forms, and feedback.',
    projects: ['skillmatch', 'gitscribe', 'thinkboard'],
  },
  {
    id: 'api',
    number: '02',
    title: 'API',
    caption: 'HOW IT CONNECTS',
    detail: 'Connect interfaces to routes, authentication, and stored data.',
    projects: ['skillmatch', 'thinkboard', 'jicnic'],
  },
  {
    id: 'core',
    number: '03',
    title: 'CORE',
    caption: 'WHY IT WORKS',
    detail: 'Understand the rules, asynchronous work, and state behind a feature.',
    projects: ['discord-ai-bridge', 'thinkboard', 'mini-rpg-battle'],
  },
] as const

const proof = [
  { value: facts.hackathon.placement, label: `teams at ${facts.hackathon.name}`, to: '/work/gitscribe' },
  {
    value: `${facts.skillmatch.myCommits} commits`,
    label: `most on a ${facts.skillmatch.teamSize}-person team project`,
    to: '/work/skillmatch',
  },
  { value: `${facts.gpa} GPA`, label: `BCIT, graduating ${site.graduation}`, to: '/resume' },
]

function Hero() {
  const [activeLayerId, setActiveLayerId] = useState<(typeof systemLayers)[number]['id']>('ui')
  const activeLayer = systemLayers.find((layer) => layer.id === activeLayerId)!
  const layerProjects = activeLayer.projects
    .map((slug) => findProject(slug))
    .filter((project): project is Project => Boolean(project))

  return (
    <section className="hero section-wrap" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-mark">01</span> VANCOUVER, BC <span className="eyebrow-divider">/</span> BCIT
        </p>
        <h1 id="hero-title">
          Full-stack developer who goes <span>down the stack.</span>
        </h1>
        <p className="hero-intro">
          I&apos;m {site.name}. I like the moment a bug stops being mysterious. I build React and Node products end to
          end, then trace the request until I can explain the failure, the trade-off, and the fix in plain English.
        </p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Core stack">
          {['React', 'Node.js', 'TypeScript', 'Python'].map((tag, index) => (
            <Badge key={tag} variant={index % 2 ? 'secondary' : 'outline'}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" to="/#work">
            See my projects <ArrowDownRight size={16} />
          </Link>
          <Link className="button button-secondary" to="/resume">
            View resume <FileText size={16} />
          </Link>
          <a className="text-link hero-email" href={`mailto:${site.email}`}>
            <Mail size={16} /> {site.email}
          </a>
        </div>
        <ul className="hero-proof" aria-label="Highlights">
          {proof.map((item) => (
            <li key={item.value}>
              <Link to={item.to}>
                <b>{item.value}</b>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="hero-target">{availabilityLine()}</p>
      </div>
      <div className="hero-side">
        <div className="hero-art" role="group" aria-label="Explore projects by application layer">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <span className="art-cross art-cross-one">+</span>
          <span className="art-cross art-cross-two">+</span>
          <div className="art-center">
            <Braces size={31} strokeWidth={1.5} />
            <span>
              TRACE THE
              <br />
              WHOLE SYSTEM
            </span>
          </div>
          {systemLayers.map((layer) => (
            <button
              key={layer.id}
              className={`art-node art-node-${layer.id}${activeLayerId === layer.id ? ' is-active' : ''}`}
              type="button"
              aria-pressed={activeLayerId === layer.id}
              aria-label={`Show ${layer.title} layer projects`}
              onClick={() => setActiveLayerId(layer.id)}
            >
              <span>{layer.number}</span>
              <b>{layer.title}</b>
              <small>{layer.caption}</small>
            </button>
          ))}
        </div>
        <div className="hero-layer-panel" aria-live="polite">
          <div>
            <span className="hero-layer-label">
              {activeLayer.title} / {activeLayer.caption}
            </span>
            <p>{activeLayer.detail}</p>
          </div>
          <div className="hero-layer-projects" aria-label={`Projects that demonstrate ${activeLayer.title}`}>
            {layerProjects.map((project) => (
              <Link key={project.slug} to={`/work/${project.slug}`}>
                {project.name} <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
