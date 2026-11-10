import { ArrowDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { facts } from '@/data/facts'
import { site } from '@/data/site'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { Button } from '@/components/ui/button'
import RequestTrace from '@/components/home/RequestTrace'
import { DotPattern } from '@/components/ui/dot-pattern'

function Hero() {
  return (
    <section
      className="relative section-wrap grid min-h-[calc(100svh-var(--header-height))] grid-cols-[1.08fr_.92fr] items-center pt-[37px] pb-[5.5625rem] max-[900px]:flex max-[900px]:min-h-0 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:pt-[58px] max-[900px]:pb-[4.875rem] max-[620px]:pt-9 max-[620px]:pb-10 print:min-h-0 print:py-4"
      id="home"
      aria-labelledby="hero-title"
    >
      {/* A soft dot grid that fades out toward the edges. */}
      <div
        className="pointer-events-none absolute inset-x-0 inset-y-4 [mask-image:radial-gradient(ellipse_70%_65%_at_50%_45%,#000_20%,transparent_75%)] print:hidden"
        aria-hidden="true"
      >
        <DotPattern width={24} height={24} cr={1.1} className="fill-foreground/[.14]" />
      </div>
      <div className="z-[1] pt-[5px]">
        <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border bg-card/70 py-1.5 pr-4 pl-3 text-sm backdrop-blur-sm">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full rounded-full bg-primary/70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <AnimatedShinyText className="mx-0 max-w-none text-muted-foreground">
            Open to co-op and internships
          </AnimatedShinyText>
        </p>
        <p className="eyebrow">
          <span className="text-primary">01</span> VANCOUVER, BC <span className="text-muted-foreground">/</span> BCIT
        </p>
        <h1 id="hero-title" className="mt-[18px] max-w-[20ch] text-h1 max-[620px]:mt-[22px] [&_span]:text-primary">
          Full-stack developer who goes <span>down the stack.</span>
        </h1>
        <p className="mt-[22px] max-w-[58ch] text-[1.125rem] leading-[1.65] text-muted-foreground max-[620px]:max-w-[390px] max-[620px]:text-base">
          I&apos;m {site.name}. I follow the request from the interface through the API until everything makes sense.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 max-[900px]:mt-6 max-[900px]:gap-2.5">
          <Button asChild size="lg" className="h-[46px] px-[17px] text-control font-semibold">
            <Link to="/#work">
              See my projects <ArrowDown aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <Link
          className="mt-5 inline-flex min-h-11 items-center gap-2 font-mono text-control text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
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
