import { Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import CountUp from '@/components/shared/CountUp'
import Reveal from '@/components/shared/Reveal'
import { facts } from '@/data/facts'
import { projects } from '@/data/projects'

// Every figure comes from the site's own data (the project list and facts.ts), so it cannot drift from what the page shows.
const liveCount = projects.filter((project) => project.live).length
// Pulls the first number out of the placement text, e.g. "Top 6" gives 6.
const placement = Number(facts.hackathon.placement.match(/\d+/)?.[0])

const figures = [
  { value: projects.length, prefix: '', label: 'Projects built', detail: '', to: '/#work' },
  { value: liveCount, prefix: '', label: 'Live web apps', detail: '', to: '/#work' },
  {
    value: facts.skillmatch.myCommits,
    prefix: '',
    label: `of ${facts.skillmatch.teamCommits} team commits`,
    detail: 'mine, on SkillMatch (a team of three)',
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

/**
 * The home page's bold full-width moment: the proof as huge numbers on a slab of the brand colour, edge to edge
 * between the hero and the work. Every figure links to the project behind it.
 */
function AtAGlance() {
  return (
    <section
      className="mt-[clamp(.75rem,2.5svh,1.75rem)] bg-primary-fill py-[clamp(1rem,3svh,2rem)] max-[620px]:py-5 print:bg-transparent print:py-4"
      aria-label="At a glance"
    >
      <div className="section-wrap">
        <Reveal>
          <ul className="m-0 grid list-none grid-cols-4 gap-5 p-0 max-[900px]:grid-cols-2 max-[620px]:gap-3">
            {figures.map(({ value, prefix, label, detail, to }) => (
              <li key={label} className="overflow-hidden rounded-2xl bg-card text-card-foreground shadow-lg">
                <Link
                  className="flex h-full flex-col px-6 py-[clamp(.75rem,2.2svh,1.25rem)] no-underline transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring max-[620px]:px-4 max-[620px]:py-4"
                  to={to}
                  aria-label={`${prefix ? `${prefix} ` : ''}${value.toLocaleString('en-CA')} ${label}${detail ? `, ${detail}` : ''}`}
                >
                  <p className="text-[clamp(2.25rem,min(1.2rem+3.6vw,8.5svh),4.75rem)] leading-none font-semibold tracking-tight tabular-nums">
                    {prefix && (
                      <>
                        <span className="text-[.36em] font-normal text-muted-foreground">{prefix}</span>{' '}
                      </>
                    )}
                    <CountUp value={value} />
                  </p>
                  <p className="mt-[clamp(.4rem,1.4svh,.75rem)] flex items-center gap-1.5 font-mono text-label font-semibold tracking-wide text-primary uppercase">
                    {prefix === 'Top' && <Trophy size={14} aria-hidden="true" />}
                    {label}
                  </p>
                  {detail && <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export default AtAGlance
