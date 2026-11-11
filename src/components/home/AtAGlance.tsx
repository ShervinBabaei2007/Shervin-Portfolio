import { Link } from 'react-router-dom'
import CountUp from '@/components/shared/CountUp'
import Reveal from '@/components/shared/Reveal'
import { Card } from '@/components/ui/card'
import { facts } from '@/data/facts'
import { projects } from '@/data/projects'

// Every figure comes from the site's own data (the project list and facts.ts), so it cannot drift from what the page shows.
const placement = Number(facts.hackathon.placement.match(/\d+/)?.[0])

const figures = [
  { value: projects.length, prefix: '', label: 'Projects built', detail: 'each with a case study', to: '/#work' },
  {
    value: facts.tests.unit,
    prefix: '',
    label: 'Unit tests',
    detail: 'solo, on Network Growth Assistant',
    to: '/work/network-growth-assistant',
  },
  {
    value: facts.skillmatch.myCommits,
    prefix: '',
    label: `of ${facts.skillmatch.teamCommits} commits`,
    detail: 'on SkillMatch, a team of three',
    to: '/work/skillmatch',
  },
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
    <section className="section-wrap" aria-label="At a glance">
      <Reveal>
        <Card className="gap-0 overflow-hidden py-0 shadow-none">
          <ul className="m-0 grid list-none grid-cols-4 p-0 max-[900px]:grid-cols-2">
            {figures.map(({ value, prefix, label, detail, to }) => (
              <li
                key={label}
                className="border-border not-last:border-r max-[900px]:odd:border-r max-[900px]:even:border-r-0 max-[900px]:nth-[-n+2]:border-b"
              >
                <Link
                  className="flex h-full flex-col px-8 py-8 no-underline transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring max-[620px]:px-5 max-[620px]:py-6"
                  to={to}
                  aria-label={`${prefix ? `${prefix} ` : ''}${value.toLocaleString('en-CA')} ${label}, ${detail}`}
                >
                  <p className="text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] leading-none font-semibold tracking-tight tabular-nums">
                    {prefix && (
                      <>
                        <span className="text-[.42em] font-normal text-muted-foreground">{prefix}</span>{' '}
                      </>
                    )}
                    <CountUp value={value} />
                  </p>
                  <p className="mt-4 font-mono text-label font-semibold tracking-wide text-primary uppercase">
                    {label}
                  </p>
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
