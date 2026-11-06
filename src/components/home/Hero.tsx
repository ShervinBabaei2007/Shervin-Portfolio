import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Braces, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { findProject, type Project } from '@/data/projects'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'

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
        <h1
          id="hero-title"
          className="mt-[18px] max-w-[20ch] text-[clamp(2.5rem,1.3rem+4vw,4.25rem)] leading-[1.05] max-[620px]:mt-[22px] max-[360px]:text-[2.25rem] [&_span]:text-primary"
        >
          Full-stack developer who goes <span>down the stack.</span>
        </h1>
        <p className="mt-[22px] max-w-[58ch] text-[1.125rem] leading-[1.65] text-muted-foreground max-[620px]:max-w-[390px] max-[620px]:text-base">
          I&apos;m {site.name}. I like the moment a bug stops being mysterious. I build React and Node products end to
          end, then trace the request until I can explain the failure, the trade-off, and the fix in plain English.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 max-[900px]:mt-6 max-[900px]:gap-2.5">
          <Button asChild size="lg" className="h-[46px] px-[17px] text-[.8125rem] font-semibold">
            <Link to="/#work">
              See my projects <ArrowDownRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-[46px] px-[17px] text-[.8125rem] font-semibold">
            <Link to="/resume">
              View resume <FileText />
            </Link>
          </Button>
        </div>
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
