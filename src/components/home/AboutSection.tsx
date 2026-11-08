import { useEffect, useState } from 'react'
import Reveal from '@/components/shared/Reveal'
import { Highlighter } from '@/components/ui/highlighter'
import { Particles } from '@/components/ui/particles'
import { facts } from '@/data/facts'
import { site } from '@/data/site'
import { cn, textLinkClass } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const quickFacts = [
  { label: 'BASED IN', value: 'Vancouver' },
  { label: 'FOCUSED ON', value: 'Full-stack + systems curiosity' },
  { label: 'STUDYING', value: `${site.school}, ${site.program.replace('Diploma in ', '')}` },
  { label: 'OPEN TO', value: site.availability.roles },
]

function AboutSection() {
  // Ambient particles are decoration: skipped for reduced motion, and only started after mount.
  const [ambient, setAmbient] = useState(false)
  useEffect(() => {
    setAmbient(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return (
    <section
      // Dark in both themes, so it pins the dark-theme accent (the light one is too dim on this background).
      className={cn(
        'bg-[var(--section-dark)] py-[98px] pb-[88px] text-[var(--on-dark)] max-[620px]:py-[64px]',
        '[--primary:#8aa4ff] [--ring:#8aa4ff]',
        'bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[length:38px_38px]',
        'relative overflow-hidden print:bg-none print:[&_*]:!text-black',
      )}
      id="about"
      aria-labelledby="about-title"
    >
      {ambient && (
        <Particles
          className="pointer-events-none absolute inset-0 print:hidden"
          quantity={50}
          ease={90}
          staticity={60}
          size={0.5}
          color="#8aa4ff"
        />
      )}
      <div className="relative section-wrap">
        <p className="eyebrow text-[#a9b6d3]">
          <span className="text-primary">03</span> WHY I KEEP DIGGING
        </p>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-[8%]">
          <h2 id="about-title" className="text-h2-section [&>span:last-child]:text-primary">
            I keep following the request because{' '}
            <Highlighter action="underline" color="#f5b042" strokeWidth={2.5} iterations={2} padding={3} isView>
              “it works”
            </Highlighter>{' '}
            has never been enough for me<span>.</span>
          </h2>
          <Reveal delay={0.1}>
            <div className="space-y-4 text-base leading-[1.75] text-[#b4c0da] lg:pt-2">
              <p>
                I&apos;m a Full-Stack Web Development student at BCIT (expected graduation May 2027, {facts.gpa}{' '}
                academic average). I build end-to-end applications with React, TypeScript, Node.js, and modern
                databases, and I&apos;ve started integrating AI into real developer tools.
              </p>
              <p>
                Recent work includes leading the frontend for GitScribe (Top 6 of 36 teams at Hack The Break 2026), an
                AI-powered commit message tool, and building Network Growth Assistance, a full-stack platform with
                authentication, PostgreSQL, and AI-assisted features. I also explore local language models, systems
                concepts in C++, and the details that sit between the interface, API, and data layer.
              </p>
              <Link className={cn(textLinkClass, 'mt-1 text-[#e6ecf8] hover:text-[#c7d4ff]')} to="/resume">
                Read my resume <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/15 pt-8 max-[620px]:mt-10 max-[620px]:grid-cols-1 md:grid-cols-4">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-label tracking-[.08em] text-[#93a3c4]">{fact.label}</dt>
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
