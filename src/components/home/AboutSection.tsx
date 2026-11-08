import { useEffect, useState } from 'react'
import Reveal from '@/components/shared/Reveal'
import { Button } from '@/components/ui/button'
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
                I got into software to understand how things actually work, not just use them. That took me from
                full-stack web (React, TypeScript, Node.js, PostgreSQL) into running local models like Qwen through LM
                Studio and Ollama, and into C++, where I work through systems concepts to see what the machine is really
                doing.
              </p>
              <p>
                It&apos;s also how I debug. My Discord bot once went silent for everyone while the model was thinking:
                one HTTP request inside an async function was blocking the event loop. A worker thread fixed it, and
                taught me code can look async and still not be. So I read what the layers underneath actually do, then
                publish a{' '}
                <Link className={textLinkClass} to="/writeups">
                  writeup
                </Link>
                .
              </p>
              <p>
                On a team, I take ownership and follow through. I led the front end at Hack the Break 2026, where we
                placed Top 6 of 36 teams in 24 hours, and led backend and DevOps on SkillMatch with 105 of our 199
                commits. Solo on Network Growth Assistant, I wrote 1,500+ unit tests, because I&apos;d rather prove
                something works than assume it does. You can count on me to ship it, and to explain how it works
                afterward.
              </p>
              <p>
                I&apos;m a BCIT student ({facts.gpa} average, graduating May 2027) looking for a co-op or internship in
                Vancouver, where code review is part of the culture. I want to learn how good teams build, test, and
                ship software, and I&apos;ll take on hard problems to get there.
              </p>
              <Button
                asChild
                size="lg"
                className="mt-3 bg-[#8aa4ff] font-semibold text-[#0a1122] shadow-[0_8px_24px_-8px_rgba(138,164,255,.6)] hover:bg-[#a5b9ff]"
              >
                <Link to="/resume">
                  Read my resume <ArrowRight size={15} />
                </Link>
              </Button>
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
