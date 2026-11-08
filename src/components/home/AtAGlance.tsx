import { Link } from 'react-router-dom'
import CountUp from '@/components/shared/CountUp'
import Reveal from '@/components/shared/Reveal'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
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
        {/* The same bordered card on a dotted muted backdrop that the project cards use, so it stands off the page. */}
        <Card
          className={cn(
            'gap-0 overflow-hidden bg-muted py-0 shadow-sm',
            'bg-[radial-gradient(color-mix(in_srgb,var(--foreground)_12%,transparent)_.8px,transparent_.8px)] bg-[length:13px_13px]',
          )}
        >
          <ul className="m-0 grid list-none grid-cols-4 p-0 max-[900px]:grid-cols-2">
            {figures.map(({ value, prefix, label, detail, to }) => (
              <li
                key={label}
                className="border-border not-last:border-r max-[900px]:odd:border-r max-[900px]:even:border-r-0 max-[900px]:nth-[-n+2]:border-b"
              >
                <Link
                  className="flex h-full flex-col px-6 py-6 no-underline transition-colors hover:bg-card focus-visible:bg-card focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring max-[620px]:px-4 max-[620px]:py-5"
                  to={to}
                  aria-label={`${prefix ? `${prefix} ` : ''}${value} ${label}, ${detail}`}
                >
                  <p className="text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-none font-semibold tracking-tight tabular-nums">
                    {prefix && (
                      <>
                        <span className="text-[.42em] font-normal text-muted-foreground">{prefix}</span>{' '}
                      </>
                    )}
                    <CountUp value={value} />
                  </p>
                  <p className="mt-4 font-mono text-label font-semibold tracking-wide text-primary uppercase">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </Reveal>
    </section>
  )
}

export default AtAGlance
