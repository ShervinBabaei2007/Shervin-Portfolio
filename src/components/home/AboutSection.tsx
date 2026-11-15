import type { ReactNode } from 'react'
import { ArrowRight, Bug, ChevronDown, Compass, Target, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import AboutPortraits from '@/components/home/AboutPortraits'
import Reveal from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Highlighter } from '@/components/ui/highlighter'
import { facts } from '@/data/facts'
import { highlightColor } from '@/lib/colors'
import { site } from '@/data/site'
import { cn, textLinkClass } from '@/lib/utils'

// The four short facts in the strip at the bottom of the section.
const quickFacts = [
  { label: 'BASED IN', value: 'Vancouver' },
  { label: 'FOCUSED ON', value: 'Full-stack + systems curiosity' },
  { label: 'STUDYING', value: `${site.school}, ${site.program.replace('Diploma in ', '')}` },
  { label: 'OPEN TO', value: site.availability.roles },
]

// A key fact in bold, so a card can be skimmed by its title and its bold phrases.
const key = (text: string) => <strong className="font-semibold text-[var(--on-dark)]">{text}</strong>

/** One card: a title, the first sentence or two always visible, and the rest behind "Read more". */
type Story = { Icon: LucideIcon; title: string; short: ReactNode; more: ReactNode }

// The story, in four parts. Together `short` and `more` are the full text, so nothing is lost by collapsing it.
const stories: Story[] = [
  {
    Icon: Compass,
    title: 'How I got here',
    short: <>I got into software to understand how things actually work, not just use them.</>,
    more: (
      <>
        That took me from full-stack web (React, TypeScript, Node.js, PostgreSQL) into running local models like Qwen
        through LM Studio and Ollama, and into C++, where I work through systems concepts to see what the machine is
        really doing.
      </>
    ),
  },
  {
    Icon: Bug,
    title: 'How I debug',
    short: (
      <>
        My Discord bot once went silent for everyone while the model was thinking: one HTTP request inside an async
        function was blocking the event loop.
      </>
    ),
    more: (
      <>
        A worker thread fixed it, and taught me code can look async and still not be. So I read what the layers
        underneath actually do, then publish a{' '}
        <Link className={textLinkClass} to="/writeups">
          writeup
        </Link>
        .
      </>
    ),
  },
  {
    Icon: Users,
    title: 'On a team',
    short: (
      <>
        I take ownership and follow through. I led the front end at Hack the Break 2026, where we placed{' '}
        {key('Top 6 of 36 teams')} in 24 hours.
      </>
    ),
    more: (
      <>
        I also led backend and DevOps on SkillMatch with {key('105 of our 199 commits')}. Solo on Network Growth
        Assistant, I wrote {key(`${facts.tests.unit.toLocaleString('en-CA')} unit tests`)}, because I&apos;d rather
        prove something works than assume it does. You can count on me to ship it, and to explain how it works
        afterward.
      </>
    ),
  },
  {
    Icon: Target,
    title: 'What I want next',
    short: (
      <>
        I&apos;m a BCIT student ({facts.gpa} average, graduating May 2027) looking for a junior full-stack role, co-op
        or internship in Vancouver, where code review is part of the culture.
      </>
    ),
    more: (
      <>
        I want to learn how good teams build, test, and ship software, and I&apos;ll take on hard problems to get there.
      </>
    ),
  },
]

/** One story card, with its "Read more" toggle. The hidden text stays in the page, so it is still prerendered. */
function StoryCard({ Icon, title, short, more }: Story) {
  return (
    <Card
      data-about-card
      className="h-full gap-3 border-white/15 bg-white/[.04] py-5 text-[var(--on-dark)] shadow-none max-[620px]:gap-2 max-[620px]:py-4"
    >
      <CardHeader className="grid-cols-[auto_1fr] items-center gap-3 px-5 max-[620px]:px-4">
        <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary" aria-hidden="true">
          <Icon className="size-[18px]" />
        </span>
        <CardTitle className="text-[1.0625rem] leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 max-[620px]:px-4">
        <Collapsible className="flex flex-1 flex-col">
          <p className="text-[.9875rem] leading-[1.7] text-on-dark-muted max-[620px]:text-[.9375rem] max-[620px]:leading-[1.6]">
            {short}
          </p>
          <CollapsibleContent forceMount className="data-[state=closed]:hidden">
            <p className="mt-3 text-[.9875rem] leading-[1.7] text-on-dark-muted max-[620px]:text-[.9375rem] max-[620px]:leading-[1.6]">
              {more}
            </p>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group/more mt-auto -ml-2 min-h-11 w-fit self-start px-2 pt-0 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <span className="group-data-[state=open]/more:hidden">Read more</span>
              <span className="hidden group-data-[state=open]/more:inline">Show less</span>
              <ChevronDown
                className="transition-transform group-data-[state=open]/more:rotate-180"
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

/** The home page "Why I keep digging" section: the story as four cards, photos and quick facts. */
function AboutSection() {
  return (
    <section
      // Dark in both themes, so it pins the dark-theme accent (the light one is too dim on this background).
      className={cn(
        'bg-[var(--section-dark)] section-y text-[var(--on-dark)]',
        '[--primary-foreground:var(--primary-on-dark-foreground)] [--primary:var(--primary-on-dark)] [--ring:var(--primary-on-dark)]',
        'relative overflow-hidden print:bg-none print:[&_*]:!text-black',
      )}
      id="about"
      aria-labelledby="about-title"
    >
      <div className="relative section-wrap">
        <div className="grid items-start gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <p className="eyebrow text-on-dark-muted">
              <span className="text-primary">03</span> WHY I KEEP DIGGING
            </p>
            <h2
              id="about-title"
              className="mt-5 max-w-[22ch] text-h2-section lg:max-w-[33rem] [&>span:last-child]:text-primary"
            >
              I keep following the request because{' '}
              <Highlighter
                action="underline"
                color={highlightColor}
                strokeWidth={2.5}
                iterations={2}
                padding={3}
                isView
              >
                “it works”
              </Highlighter>{' '}
              has never been enough for me<span>.</span>
            </h2>
            <Reveal delay={0.05}>
              <AboutPortraits />
            </Reveal>
          </div>
          {/* The cards start level with the section label, so there is no empty corner beside the heading. */}
          <Reveal delay={0.1}>
            <div className="min-w-0 lg:pt-1">
              <div className="grid gap-4 min-[700px]:grid-cols-2 lg:items-stretch">
                {stories.map((story) => (
                  <StoryCard key={story.title} {...story} />
                ))}
              </div>
              <Button asChild size="lg" className="mt-6 font-semibold">
                <Link to="/resume">
                  Read my resume <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-8 max-[620px]:mt-8 max-[620px]:gap-x-5 max-[620px]:gap-y-6 max-[620px]:pt-6 md:grid-cols-4">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-label tracking-[.08em] text-on-dark-subtle">{fact.label}</dt>
                <dd className="mt-2 text-base leading-snug font-medium first-letter:uppercase">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutSection
