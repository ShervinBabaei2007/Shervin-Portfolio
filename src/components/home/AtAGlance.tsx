import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CountUp from '@/components/shared/CountUp'
import Reveal from '@/components/shared/Reveal'
import { facts } from '@/data/facts'
import { notes } from '@/data/notes'
import { projects } from '@/data/projects'
import { skillTabs } from '@/data/skills'

// Every figure is counted from the site's own data, so it cannot drift from what the page shows below.
const technologies = new Set(skillTabs.flatMap((group) => group.skills.map((skill) => skill.name))).size
const placement = Number(facts.hackathon.placement.match(/\d+/)?.[0])

const figures = [
  { value: projects.length, prefix: '', label: 'Projects built', detail: 'each with a case study', to: '/#work' },
  { value: technologies, prefix: '', label: 'Technologies used', detail: 'across those projects', to: '/#skills' },
  { value: notes.length, prefix: '', label: 'Writeups', detail: 'on bugs, fixes and design choices', to: '/writeups' },
  {
    value: placement,
    prefix: 'Top',
    label: `of ${facts.hackathon.teams} teams`,
    detail: facts.hackathon.name,
    to: '/work/gitscribe',
  },
]

/** A slim row of linked figures between the hero and the work: what has been built, at a glance. */
function AtAGlance() {
  return (
    <section className="section-wrap pb-6 max-[620px]:pb-2" aria-label="At a glance">
      <Reveal>
        {/* An open row: a hairline above and below and thin dividers between, with no card around it. */}
        <div>
          <ul className="m-0 grid list-none grid-cols-4 border-y p-0 max-[900px]:grid-cols-2">
            {figures.map(({ value, prefix, label, detail, to }) => (
              <li
                key={label}
                className="border-border not-last:border-r max-[900px]:odd:border-r max-[900px]:even:border-r-0 max-[900px]:nth-[-n+2]:border-b"
              >
                <Link
                  className="group relative flex h-full flex-col px-6 py-6 no-underline transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring max-[620px]:px-4 max-[620px]:py-5"
                  to={to}
                  aria-label={`${prefix ? `${prefix} ` : ''}${value} ${label}, ${detail}`}
                >
                  <ArrowUpRight
                    className="absolute top-4 right-4 size-4 text-muted-foreground/50 transition-[color,translate] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-focus-visible:text-primary motion-reduce:transition-none max-[620px]:top-3.5 max-[620px]:right-3.5"
                    aria-hidden="true"
                  />
                  <p className="text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-none font-medium tracking-tight">
                    {prefix && (
                      <>
                        <span className="text-[.42em] font-normal text-muted-foreground">{prefix}</span>{' '}
                      </>
                    )}
                    <CountUp value={value} />
                  </p>
                  <p className="mt-4 font-mono text-label tracking-wide text-primary uppercase">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}

export default AtAGlance
