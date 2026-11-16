import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import QuickAnswers from '@/components/about/QuickAnswers'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { facts } from '@/data/facts'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { projectsUsing, skillTabs } from '@/data/skills'
import { portraitSrcSet } from '@/lib/portraits'

// public/about/portrait-*, all 4:5. Widths are the generated files, smallest first.
const photos = [
  {
    name: 'portrait-c',
    alt: 'Shervin Babaei in an olive zip hoodie on a rocky shoreline, with the water and the bay behind him',
    widths: [480, 720],
  },
  {
    name: 'portrait-a',
    alt: 'Shervin Babaei outdoors in a grey hoodie, in front of a carved wooden totem',
    widths: [320, 480],
  },
  { name: 'portrait-b', alt: 'Shervin Babaei in a red polo, seated at home', widths: [320, 480] },
] as const

// A key fact in bold, so a story can be skimmed by its bold phrases.
const key = (text: string) => <strong className="font-semibold text-foreground">{text}</strong>

const stories: { title: string; paragraphs: ReactNode[] }[] = [
  {
    title: 'How I got here',
    paragraphs: [
      'I got into software to understand how things actually work, not just use them.',
      'That took me from full-stack web (React, TypeScript, Node.js, PostgreSQL) into running local models like Qwen through LM Studio and Ollama, and into C++, where I work through systems concepts to see what the machine is really doing.',
    ],
  },
  {
    title: 'How I debug',
    paragraphs: [
      'My Discord bot once went silent for everyone while the model was thinking: one HTTP request inside an async function was blocking the event loop.',
      <>
        A worker thread fixed it, and taught me code can look async and still not be. So I read what the layers
        underneath actually do, then publish a{' '}
        <Link className="text-foreground underline underline-offset-[3px] hover:text-primary" to="/writeups">
          writeup
        </Link>
        .
      </>,
    ],
  },
  {
    title: 'On a team',
    paragraphs: [
      <>
        I take ownership and follow through. I led the front end at {facts.hackathon.name}, where we placed{' '}
        {key(`${facts.hackathon.placement} teams`)} in 24 hours.
      </>,
      <>
        I also led backend and DevOps on SkillMatch with{' '}
        {key(`${facts.skillmatch.myCommits} of our ${facts.skillmatch.teamCommits} commits`)}. Solo on Network Growth
        Assistant, I wrote {key(`${facts.tests.unit.toLocaleString('en-CA')} unit tests`)}, because I&apos;d rather
        prove something works than assume it does. You can count on me to ship it, and to explain how it works
        afterward.
      </>,
    ],
  },
  {
    title: 'What I want next',
    paragraphs: [
      `I'm a ${site.school} student (${facts.gpa} average, graduating ${site.graduation}) looking for a junior full-stack role, co-op or internship in Vancouver, where code review is part of the culture.`,
      "I want to learn how good teams build, test, and ship software, and I'll take on hard problems to get there.",
    ],
  },
]

const quickFacts = [
  { label: 'Based in', value: 'Vancouver' },
  { label: 'Focused on', value: 'Full-stack + systems curiosity' },
  { label: 'Studying', value: `${site.school}, ${site.program.replace('Diploma in ', '')}` },
  { label: 'Open to', value: site.availability.roles },
]

// Each tool group with how many projects use at least one of its tools, most used first.
const toolGroups = skillTabs
  .map((group) => {
    const used = new Set(group.skills.flatMap((skill) => projectsUsing(skill.name).map((project) => project.slug)))
    return { ...group, used: used.size }
  })
  .sort((a, b) => b.used - a.used)

/** The photo, with three thumbnails to switch between them. */
function PortraitPicker() {
  const [active, setActive] = useState(0)
  const photo = photos[active]
  const sizes = '(min-width: 900px) 400px, 90vw'
  return (
    <figure className="m-0 max-w-[400px] min-w-0 flex-[4_1_260px]">
      <picture key={photo.name}>
        <source type="image/avif" srcSet={portraitSrcSet(photo.name, photo.widths, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={portraitSrcSet(photo.name, photo.widths, 'webp')} sizes={sizes} />
        <img
          src={`/about/${photo.name}-${photo.widths[1]}.jpg`}
          srcSet={portraitSrcSet(photo.name, photo.widths, 'jpg')}
          sizes={sizes}
          width={photo.widths[1]}
          height={photo.widths[1] * 1.25}
          alt={photo.alt}
          decoding="async"
          className="block aspect-[4/5] w-full rounded-md bg-surface-hover object-cover"
        />
      </picture>
      <div role="group" aria-label="Choose a photo" className="mt-3 flex gap-2">
        {photos.map((thumb, index) => (
          <button
            key={thumb.name}
            type="button"
            aria-pressed={index === active}
            aria-label={`Photo ${index + 1}`}
            onClick={() => setActive(index)}
            className="h-14 flex-1 cursor-pointer overflow-hidden rounded-[4px] border-2 border-transparent bg-surface-hover p-0 aria-pressed:border-foreground"
          >
            <img
              src={`/about/${thumb.name}-${thumb.widths[0]}.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
              className="block size-full object-cover"
            />
          </button>
        ))}
      </div>
    </figure>
  )
}

/** The About page: the one-line why, the story, the tools I have shipped with, and quick answers for employers. */
function AboutPage() {
  return (
    <>
      <PageHero
        id="about-page-title"
        command="cat about.md"
        size="medium"
        width="wide"
        title={
          <>
            I keep following the request because <span className="text-primary">“it works”</span> has never been enough
            for me.
          </>
        }
      />

      <section className="section-wrap" aria-labelledby="story-title">
        <SectionHeading id="story-title" number="01" title="Story" className="mb-[clamp(32px,4vw,56px)]" />
        <div className="flex flex-wrap items-start gap-[clamp(40px,6vw,96px)]">
          <PortraitPicker />
          <div className="grid min-w-0 flex-[8_1_420px] grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-[clamp(28px,3vw,48px)] gap-y-[clamp(36px,4vw,56px)]">
            {stories.map(({ title, paragraphs }, index) => (
              <Reveal key={title} delay={(index % 2) * 0.08}>
                <div className="flex flex-col gap-3">
                  <h3 className="m-0 text-[22px] tracking-[-0.025em]">{title}</h3>
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="m-0 text-base leading-[1.6] text-text-body">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal>
          <dl className="mt-[clamp(56px,7vw,96px)] mb-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-x-[clamp(24px,4vw,56px)]">
            {quickFacts.map(({ label, value }) => (
              <div key={label} className="border-t border-foreground/15 py-[18px]">
                <dt className="font-mono text-[13px] text-muted-foreground">{label}</dt>
                <dd className="mt-2 mb-0 font-display text-[20px] font-semibold tracking-[-0.02em] text-foreground first-letter:uppercase">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="section-wrap pt-[clamp(88px,10vw,144px)]" id="tools" aria-labelledby="tools-title">
        <SectionHeading
          id="tools-title"
          number="02"
          title="Tools"
          aside="Every skill here shipped in a project."
          className="mb-0"
        />
        {toolGroups.map((group) => (
          <Reveal key={group.id}>
            <div className="flex flex-wrap items-start gap-x-[clamp(24px,4vw,56px)] gap-y-4 border-b border-foreground/12 py-7">
              <div className="min-w-0 flex-[2_1_240px]">
                <h3 className="m-0 text-[22px] tracking-[-0.025em]">{group.label}</h3>
                <p className="mt-1.5 mb-0 text-[15px] leading-normal text-muted-foreground">{group.summary}</p>
              </div>
              <ul className="m-0 flex min-w-0 flex-[4_1_360px] list-none flex-wrap gap-2 p-0">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-full bg-surface-hover px-3 py-1.5 text-[15px] text-foreground"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
              <div className="flex flex-[1_1_160px] flex-col gap-2">
                <span className="font-mono text-[13px] text-muted-foreground">
                  Used in {group.used} of {projects.length} projects
                </span>
                <div className="flex gap-0.5" aria-hidden="true">
                  {projects.map((project, index) => (
                    <span
                      key={project.slug}
                      className={`h-1.5 flex-1 rounded-[1px] ${index < group.used ? 'bg-highlight' : 'bg-foreground/12'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      <section
        className="section-wrap py-[clamp(88px,10vw,144px)]"
        id="quick-answers"
        aria-labelledby="quick-answers-title"
      >
        <div className="flex flex-wrap items-start gap-x-[clamp(40px,6vw,96px)] gap-y-8">
          <div className="flex flex-[4_1_260px] flex-col gap-5">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[13px] text-muted-foreground">03</span>
              <h2
                id="quick-answers-title"
                className="m-0 text-[clamp(2rem,3.8vw,3.25rem)] leading-none tracking-[-0.04em]"
              >
                Quick answers
              </h2>
            </div>
            <p className="m-0 max-w-[36ch] text-base leading-[1.55] text-muted-foreground">
              What a hiring manager usually wants to know first, answered up front.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[15px]">
              <Link
                to="/resume"
                className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 hover:text-primary"
              >
                Read my resume&nbsp;<span aria-hidden="true">→</span>
              </Link>
              <Link
                to="/how-its-built"
                className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 hover:text-primary"
              >
                How this site is built&nbsp;<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="min-w-0 flex-[8_1_420px]">
            <QuickAnswers />
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
