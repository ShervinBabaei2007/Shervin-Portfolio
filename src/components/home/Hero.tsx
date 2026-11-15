import { ArrowDown, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { facts } from '@/data/facts'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'
import RequestTrace from '@/components/home/RequestTrace'

// Counted from the project list, so the line cannot drift from what the page shows below.
const liveCount = projects.filter((project) => project.live).length

/** The top of the home page: headline, intro, call to action and the request trace. */
function Hero() {
  return (
    <section
      className="relative section-wrap grid min-h-[min(calc(100svh-var(--header-height)),40rem)] grid-cols-[1.08fr_.92fr] items-center gap-x-12 pt-[clamp(2rem,5svh,4rem)] pb-[var(--space-block)] max-[900px]:flex max-[900px]:min-h-0 max-[900px]:flex-col max-[900px]:items-stretch print:min-h-0 print:py-4"
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="z-[1]">
        <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border bg-card py-1.5 pr-4 pl-3 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          Open to junior, co-op and internship roles
        </p>
        <h1 id="hero-title" className="max-w-[20ch] text-h1 [&_span]:text-primary">
          Full-stack developer who goes <span>down the stack.</span>
        </h1>
        <p className="mt-6 measure text-[1.125rem] leading-[1.7] text-muted-foreground max-[620px]:text-base">
          I&apos;m {site.name}, a BCIT student in Vancouver. I build with React, TypeScript, Node.js and PostgreSQL:{' '}
          {projects.length} projects, {liveCount} of them live.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-[46px] px-[17px] text-control font-semibold">
            <Link to="/#work">
              See my projects <ArrowDown aria-hidden="true" />
            </Link>
          </Button>
          {/* The header has its own Resume button from 960px up, so this one only shows on smaller screens. */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-[46px] px-[17px] text-control font-semibold min-[960px]:hidden"
          >
            <a
              href="/Shervin-Babaei-Resume.pdf"
              download="Shervin-Babaei-Resume.pdf"
              aria-label="Download resume (PDF)"
            >
              Resume <Download aria-hidden="true" />
            </a>
          </Button>
        </div>
        <Link
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-control text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
          to="/work/gitscribe"
        >
          {facts.hackathon.placement} teams, {facts.hackathon.name}
        </Link>
      </div>
      <div className="w-full max-w-[400px] self-center justify-self-end max-[900px]:mt-9 max-[900px]:max-w-none max-[900px]:justify-self-stretch max-[620px]:hidden print:hidden">
        <RequestTrace />
      </div>
    </section>
  )
}

export default Hero
