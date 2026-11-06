import { facts } from '@/data/facts'
import { ArrowRight, Code2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn, textLinkClass } from '@/lib/utils'

function AboutSection() {
  return (
    <section
      // Dark in both themes, so it pins the dark-theme accent (the light one is too dim on this background).
      className={cn(
        'bg-[var(--section-dark)] py-[98px] pb-[77px] text-[var(--on-dark)] max-[620px]:pt-[69px] max-[620px]:pb-[53px]',
        '[--primary:#8aa4ff] [--ring:#8aa4ff]',
        'bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[length:38px_38px]',
        'print:bg-none print:[&_*]:!text-black',
      )}
      id="about"
      aria-labelledby="about-title"
    >
      <div className="section-wrap grid grid-cols-[1fr_1.05fr] items-start gap-x-[12%] max-[900px]:gap-x-[7%] max-[620px]:block">
        <div className="relative min-h-[230px] max-[620px]:min-h-[200px]">
          <p className="eyebrow text-[#a9b6d3]">
            <span className="eyebrow-mark">05</span> A LITTLE ABOUT ME
          </p>
          <h2
            id="about-title"
            className="mt-[27px] text-[clamp(2.25rem,1.8rem+1.6vw,3rem)] leading-[1.1] [&_span]:text-primary"
          >
            Why I keep
            <br />
            digging<span>.</span>
          </h2>
          <div className="absolute bottom-[5px] left-0 flex items-center gap-3 text-[#c9d4ee] max-[620px]:bottom-0">
            <Code2 size={22} />
            <span className="font-mono text-sm leading-[1.55]">
              BUILD
              <br />
              UNDERSTAND
              <br />
              REPEAT
            </span>
          </div>
        </div>
        <div className="pt-11 max-[620px]:pt-[29px] [&>p:not(:first-child)]:text-base [&>p:not(:first-child)]:leading-[1.85] [&>p:not(:first-child)]:text-[#b4c0da] [&>p+p]:mt-4">
          <p className="mb-[18px] text-[1.3125rem] leading-[1.4] font-medium max-[620px]:text-[1.1875rem]">
            I keep following the request because “it works” has never been a satisfying ending for me.
          </p>
          <p>
            I&apos;m studying for a Diploma in Full-Stack Web Development at BCIT, with an {facts.gpa} GPA and an
            expected graduation in May 2027. My coursework includes object-oriented programming, databases, Agile
            development, UX/UI, and web application development.
          </p>
          <p>
            I like understanding how an application works from the interface through the API and data layer. I want to
            know what happens after fetch(), why one request can freeze an event loop, and what changes when the
            language model runs on my own machine. I&apos;m also learning lower-level languages like C, and I&apos;m
            looking for an internship, co-op, or junior role where I can contribute, learn from a team, and keep
            building that understanding.
          </p>
          <Link className={cn(textLinkClass, 'mt-[13px] text-[#e6ecf8] hover:text-[#c7d4ff]')} to="/resume">
            Read my resume <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-[39px] grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-[9px] self-end border-t border-white/15 pt-[17px] max-[620px]:mt-7 [&_b]:text-sm [&_b]:font-medium [&_span]:font-mono [&_span]:text-sm [&_span]:text-[#93a3c4]">
          <span>BASED IN</span>
          <b>Vancouver / Burnaby</b>
          <span>FOCUSED ON</span>
          <b>Full-stack + systems curiosity</b>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
