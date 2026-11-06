import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Braces, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { findProject, type Project } from '@/data/projects'
import { facts } from '@/data/facts'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

/*
 * Small text uses the size tokens in tailwind.css (text-label, text-meta, text-control), which add no line-height,
 * plus leading-[normal] where the old stylesheet's font: shorthand reset it.
 * The three layer nodes sit on the orbit at fixed percentages; the phone/tablet set is the max-[900px] group.
 */
const orbit = 'absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border'
const node =
  'absolute z-[1] flex min-h-[92px] min-w-[100px] cursor-pointer flex-col justify-center rounded-[12px] border bg-card p-3 text-left text-foreground shadow-[0_8px_24px_rgba(12,26,51,.06)] transition-[transform,border-color,box-shadow] duration-[180ms] ease-[ease] max-[900px]:min-h-[78px] max-[900px]:min-w-[85px] max-[900px]:p-[9px] ' +
  'hover:border-primary hover:shadow-[0_10px_30px_rgba(12,26,51,.14)] motion-safe:hover:-translate-y-0.5 ' +
  'aria-pressed:border-primary aria-pressed:shadow-[0_10px_30px_rgba(12,26,51,.14),inset_0_-3px_0_var(--primary)] motion-safe:aria-pressed:-translate-y-0.5 ' +
  'focus-visible:z-[3] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-ring ' +
  'forced-colors:aria-pressed:[forced-color-adjust:none] forced-colors:aria-pressed:border-[Highlight] forced-colors:aria-pressed:bg-[Highlight] forced-colors:aria-pressed:[color:HighlightText]'
const nodePosition = {
  ui: 'top-[11%] left-[23%] max-[900px]:top-[7%] max-[900px]:left-[20%]',
  api: 'top-[47%] right-0 max-[900px]:-right-[1%]',
  core: 'bottom-[6%] left-[28%] max-[900px]:bottom-[4%] max-[900px]:left-[25%]',
} as const
const cross = 'absolute font-mono text-[22px] leading-[normal] text-primary'
const monoLabel = 'font-mono text-label leading-[normal]'

function Hero() {
  const [activeLayerId, setActiveLayerId] = useState<(typeof systemLayers)[number]['id']>('ui')
  const activeLayer = systemLayers.find((layer) => layer.id === activeLayerId)!
  const layerProjects = activeLayer.projects
    .map((slug) => findProject(slug))
    .filter((project): project is Project => Boolean(project))

  return (
    <section
      className="relative section-wrap grid min-h-[calc(100svh-var(--header-height))] grid-cols-[1.08fr_.92fr] items-center pt-[37px] pb-[5.5625rem] max-[900px]:flex max-[900px]:min-h-0 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:pt-[58px] max-[900px]:pb-[4.875rem] max-[620px]:pt-9 max-[620px]:pb-10 print:min-h-0 print:py-4"
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="z-[1] animate-rise-in pt-[5px]">
        <p className="eyebrow">
          <span className="text-primary">01</span> VANCOUVER, BC <span className="text-muted-foreground">/</span> BCIT
        </p>
        <h1
          id="hero-title"
          className="mt-[18px] max-w-[20ch] text-[clamp(2.5rem,1.3rem+4vw,4.25rem)] leading-[1.05] max-[620px]:mt-[22px] max-[360px]:text-[2.25rem] [&_span]:text-primary"
        >
          Full-stack developer who goes <span>down the stack.</span>
        </h1>
        <p className="mt-[22px] max-w-[58ch] text-[1.125rem] leading-[1.65] text-muted-foreground max-[620px]:max-w-[390px] max-[620px]:text-base">
          I&apos;m {site.name}. I follow the request from the interface through the API until everything makes sense.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 max-[900px]:mt-6 max-[900px]:gap-2.5">
          <Button asChild size="lg" className="h-[46px] px-[17px] text-control font-semibold">
            <Link to="/#work">
              See my projects <ArrowDownRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-[46px] px-[17px] text-control font-semibold">
            <Link to="/resume">
              View resume <FileText />
            </Link>
          </Button>
        </div>
        <Link
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-control text-muted-foreground no-underline transition-colors hover:text-primary"
          to="/work/gitscribe"
        >
          <span className="text-primary">&#9670;</span> {facts.hackathon.placement} teams, {facts.hackathon.name}
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="grid justify-items-end gap-2 self-center max-[900px]:mt-9 max-[900px]:justify-items-stretch max-[620px]:hidden">
        <div
          className="relative mt-2.5 aspect-square w-full max-w-[400px] animate-reveal-in justify-self-end max-[900px]:mt-[38px] max-[900px]:w-[min(100%,360px)] max-[900px]:self-center max-[900px]:justify-self-center"
          role="group"
          aria-label="Explore projects by application layer"
        >
          <div className={cn(orbit, 'w-[47%]')} />
          <div className={cn(orbit, 'w-[73%] border-dashed border-(color:--ring-2)')} />
          <div className={cn(orbit, 'w-[94%] border-(color:--ring-3)')} />
          <span className={cn(cross, 'top-[17%] right-[19%]')}>+</span>
          <span className={cn(cross, 'bottom-[18%] left-[8%]')}>+</span>
          <div className="absolute top-1/2 left-1/2 flex size-[118px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-[9px] rounded-full bg-[linear-gradient(145deg,var(--primary),var(--accent-dark))] text-primary-foreground shadow-[0_10px_30px_color-mix(in_srgb,var(--primary)_35%,transparent)] max-[900px]:size-[98px] forced-colors:border forced-colors:border-[CanvasText] max-[900px]:[&_svg]:w-[25px]">
            <Braces size={31} strokeWidth={1.5} />
            <span className="text-center font-mono text-label leading-[1.5]">
              TRACE THE
              <br />
              WHOLE SYSTEM
            </span>
          </div>
          {systemLayers.map((layer) => (
            <button
              key={layer.id}
              className={cn(node, nodePosition[layer.id])}
              type="button"
              aria-pressed={activeLayerId === layer.id}
              aria-label={`Show ${layer.title} layer projects`}
              onClick={() => setActiveLayerId(layer.id)}
            >
              <span className={cn(monoLabel, 'text-primary')}>{layer.number}</span>
              <b className="mt-1 text-[1.125rem] leading-[normal] font-semibold">{layer.title}</b>
              <small className={cn(monoLabel, 'mt-[3px] text-muted-foreground')}>{layer.caption}</small>
            </button>
          ))}
        </div>
        <div
          className="mt-0 grid w-[min(100%,400px)] max-w-[590px] grid-cols-[minmax(0,1fr)] items-start gap-3.5 border-t pt-[13px] max-[900px]:w-full print:hidden"
          aria-live="polite"
        >
          <div>
            <span className={cn(monoLabel, 'text-primary')}>
              {activeLayer.title} / {activeLayer.caption}
            </span>
            <p className="mt-[5px] text-[.875rem] leading-[1.5] text-muted-foreground">{activeLayer.detail}</p>
          </div>
          <div
            className="flex flex-wrap justify-start gap-x-3.5 gap-y-1.5"
            aria-label={`Projects that demonstrate ${activeLayer.title}`}
          >
            {layerProjects.map((project) => (
              <Link
                className="hit-area inline-flex cursor-pointer items-center gap-1 border-0 border-b bg-transparent py-1 text-meta text-foreground no-underline hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                key={project.slug}
                to={`/work/${project.slug}`}
              >
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
