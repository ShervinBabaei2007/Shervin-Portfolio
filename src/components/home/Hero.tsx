import { ArrowDown, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'
import TypedName from '@/components/home/TypedName'
import { Highlighter } from '@/components/ui/highlighter'
import { highlightColor } from '@/lib/colors'
import { portraitSrcSet } from '@/lib/portraits'

// The hero portrait is the totem photo from the About section (public/about/portrait-a-*, all 4:5).
const srcSet = (extension: string) => portraitSrcSet('portrait-a', [320, 480], extension)

/** The hero portrait: sized by the screen's height, so it never pushes the number cards below it off screen. */
function HeroPortrait() {
  return (
    <figure className="m-0 aspect-[4/5] h-[clamp(240px,42svh,380px)] flex-none justify-self-end overflow-hidden rounded-2xl border bg-card shadow-[0_24px_60px_-24px_var(--color-shadow)] max-[900px]:hidden print:hidden">
      <picture>
        <source type="image/avif" srcSet={srcSet('avif')} sizes="300px" />
        <source type="image/webp" srcSet={srcSet('webp')} sizes="300px" />
        <img
          src="/about/portrait-a-480.jpg"
          srcSet={srcSet('jpg')}
          sizes="300px"
          width={480}
          height={600}
          alt="Shervin Babaei outdoors in a grey hoodie, in front of a carved wooden totem"
          loading="eager"
          decoding="async"
          className="size-full object-cover"
        />
      </picture>
    </figure>
  )
}

/** The top of the home page, built around one question: where do I start? Name, role, one sentence, one button. */
function Hero() {
  return (
    <section
      className="relative section-wrap grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-12 pt-[clamp(1.25rem,5svh,3.5rem)] pb-[clamp(1rem,2.5svh,2rem)] max-[900px]:block print:py-4"
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="z-[1]">
        <p className="mb-[clamp(.75rem,2.2svh,1.5rem)] inline-flex items-center gap-2.5 rounded-full border bg-card py-1.5 pr-4 pl-3 text-sm text-muted-foreground">
          <span className="size-2 shrink-0 rounded-full bg-success" aria-hidden="true" />
          Open to junior, co-op and internship roles <span aria-hidden="true">·</span> Graduating {site.graduation}
        </p>
        {/* The name types itself in with CSS alone (TypedName), so the full name is in the prerendered HTML. The h1's
            label keeps it reading as one name to assistive tech. */}
        <h1
          id="hero-title"
          className="text-[clamp(2.75rem,1.4rem+5.4vw,5rem)] leading-[1.05] whitespace-nowrap"
          aria-label={site.name}
        >
          <TypedName text={site.name} />
        </h1>
        <h2 className="mt-[clamp(.5rem,1.6svh,1rem)] max-w-[28ch] text-h2-section [&_span]:text-primary">
          Full-stack developer who goes{' '}
          <span>
            <Highlighter action="underline" color={highlightColor} strokeWidth={2.5} iterations={2} padding={3}>
              down the stack.
            </Highlighter>
          </span>
        </h2>
        <p className="mt-[clamp(.75rem,2.2svh,1.5rem)] measure text-[1.125rem] leading-[1.7] text-muted-foreground max-[620px]:text-base">
          I&apos;m a BCIT student in Vancouver. I build with React, TypeScript, Node.js and PostgreSQL, then write up
          what broke and what I learned.
        </p>
        <div className="mt-[clamp(1rem,3svh,2rem)] flex flex-wrap items-center gap-3">
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
      </div>
      <HeroPortrait />
    </section>
  )
}

export default Hero
