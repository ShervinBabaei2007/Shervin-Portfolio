import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import AsciiCanvas from '@/components/shared/AsciiCanvas'
import StatusCard from '@/components/home/StatusCard'
import { facts } from '@/data/facts'
import { projects } from '@/data/projects'
import { site } from '@/data/site'

const InspectOverlay = lazy(() => import('@/components/home/InspectOverlay'))

// Each letter of "down" drops and tilts by its own amount on hover.
const drops = [
  { y: '0.24em', r: '-10deg' },
  { y: '0.32em', r: '8deg' },
  { y: '0.18em', r: '-4deg' },
  { y: '0.36em', r: '12deg' },
]

const stats = [
  {
    value: String(projects.length),
    label: `projects built, ${projects.filter((project) => project.live).length} live`,
  },
  { value: facts.hackathon.placement, label: `teams at ${facts.hackathon.name}` },
  { value: facts.tests.unit.toLocaleString('en-CA'), label: 'unit tests on one solo app' },
]

// Staggered entrance: the delay for the .rise rule in tailwind.css.
const rise = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** The top of the home page: who I am, one line on what I do, a status card, and three numbers to check. */
function Hero() {
  const [inspecting, setInspecting] = useState(false)

  // Press I to toggle inspect mode (not while typing, and not with a modifier), Esc to leave it. Inspect mode is a
  // mouse feature (it reads what is under the pointer), so touch screens get neither the shortcut nor the button.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return
      if (event.key === 'i' || event.key === 'I') setInspecting((on) => !on)
      else if (event.key === 'Escape') setInspecting(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section
      className="relative section-wrap pt-[clamp(32px,6vw,88px)] pb-[clamp(40px,7vw,96px)] print:py-4"
      id="home"
      aria-labelledby="hero-title"
    >
      <AsciiCanvas />
      <p
        data-calm
        style={rise(0)}
        className="rise relative mb-[clamp(24px,3vw,40px)] font-mono text-[13px] text-muted-foreground"
      >
        <span className="text-primary">~</span> $ whoami
      </p>
      <div className="relative flex flex-wrap items-start gap-[clamp(36px,5vw,80px)]">
        <div className="flex min-w-0 flex-[7_1_480px] flex-col gap-[clamp(32px,4vw,48px)]">
          {/* The name is the first and largest thing on the page; the tagline under it says what I do. */}
          <div data-calm className="flex flex-col gap-[clamp(16px,2vw,24px)]">
            <h1
              id="hero-title"
              style={rise(80)}
              className="rise m-0 text-[clamp(2.875rem,6vw,5.875rem)] leading-[0.95] font-[650] tracking-[-0.045em]"
            >
              {site.name}
              <span className="text-highlight" aria-hidden="true">
                .
              </span>
            </h1>
            <p
              style={rise(170)}
              className="rise m-0 font-display text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-foreground"
            >
              Full-stack developer who goes <span className="sr-only">down</span>
              <span aria-hidden="true" className="inline-flex cursor-s-resize text-primary">
                {'down'.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block transition-transform duration-700 ease-[cubic-bezier(.3,1.8,.45,1)] hover:[transform:translateY(var(--y))_rotate(var(--r))]"
                    style={{ '--y': drops[index].y, '--r': drops[index].r } as CSSProperties}
                  >
                    {letter}
                  </span>
                ))}
              </span>{' '}
              the stack.
            </p>
          </div>
          <div data-calm style={rise(360)} className="rise flex max-w-[520px] flex-col gap-7">
            <p className="m-0 text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-[1.55] text-text-body">
              I&apos;m a {site.school} student in Vancouver. I build with React, TypeScript, Node.js and PostgreSQL,
              then write up what broke and what I learned.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                to="/#work"
                className="inline-flex h-12 items-center gap-2.5 rounded-full bg-foreground px-[22px] text-[15px] text-background no-underline transition-colors hover:bg-primary-fill hover:text-primary-foreground"
              >
                See selected work <span aria-hidden="true">↓</span>
              </Link>
              <a
                href="/Shervin-Babaei-Resume.pdf"
                download="Shervin-Babaei-Resume.pdf"
                aria-label="Download resume (PDF)"
                className="inline-flex min-h-11 items-center text-[15px] text-foreground underline decoration-1 underline-offset-4 hover:text-primary"
              >
                Resume <span aria-hidden="true">&nbsp;↗</span>
              </a>
            </div>
          </div>
        </div>
        <div data-calm style={rise(200)} className="rise mt-[0.12em] min-w-0 flex-[5_1_340px] self-start">
          <StatusCard inspecting={inspecting} onToggleInspect={() => setInspecting((on) => !on)} />
        </div>
      </div>

      <dl data-calm className="relative mt-[clamp(48px,6vw,80px)] flex flex-wrap gap-x-[clamp(24px,4vw,56px)]">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            // On phones each number sits on one row with its label beside it, instead of three tall blocks.
            className="flex flex-[1_1_200px] flex-col-reverse gap-1.5 border-t border-foreground/15 py-[18px] max-[620px]:flex-row-reverse max-[620px]:items-baseline max-[620px]:justify-between max-[620px]:gap-4 max-[620px]:py-3.5"
          >
            <dt className="font-mono text-[13px] text-muted-foreground max-[620px]:text-right">{label}</dt>
            <dd className="m-0 font-display text-[36px] leading-none font-semibold tracking-[-0.035em] whitespace-nowrap text-foreground max-[620px]:text-[26px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {inspecting && (
        <Suspense fallback={null}>
          <InspectOverlay onExit={() => setInspecting(false)} />
        </Suspense>
      )}
    </section>
  )
}

export default Hero
