import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '@/components/shared/PageHero'
import Reveal from '@/components/shared/Reveal'
import { formatDay, formatMonth, notes, type Note } from '@/data/notes'
import { findProject } from '@/data/projects'

// The project's display name, or the slug itself if no project matches.
const projectName = (slug: string) => findProject(slug)?.name ?? slug

const totalMinutes = notes.reduce((sum, note) => sum + note.minutes, 0)
const projectCount = new Set(notes.map((note) => note.project)).size

/** Splits a newest-first list into month groups, keeping the order. */
function byMonth(list: Note[]) {
  const groups: { month: string; notes: Note[] }[] = []
  for (const note of list) {
    const month = formatMonth(note.date)
    const last = groups[groups.length - 1]
    if (last?.month === month) last.notes.push(note)
    else groups.push({ month, notes: [note] })
  }
  return groups
}

const plural = (count: number) => `${count} ${count === 1 ? 'writeup' : 'writeups'}`

function WriteupCard({ note }: { note: Note }) {
  return (
    <Link
      to={`/writeups/${note.slug}`}
      className="flex h-full flex-col justify-between gap-10 rounded-md bg-surface-hover p-[clamp(22px,2.2vw,28px)] text-foreground no-underline transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:text-foreground hover:shadow-[0_18px_40px_-24px_var(--color-shadow)]"
    >
      <span className="flex flex-col gap-3.5">
        <span className="flex justify-between gap-3 font-mono text-[13px] text-muted-foreground">
          <span>{projectName(note.project)}</span>
          {note.featured && <span className="text-primary">Featured</span>}
        </span>
        <span className="font-display text-[clamp(1.3125rem,1.8vw,1.5rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-balance">
          {note.title}
        </span>
        <span className="text-[15px] leading-normal text-text-body">{note.summary}</span>
      </span>
      <span className="flex justify-between gap-3 font-mono text-[13px]">
        <time dateTime={note.date} className="text-muted-foreground">
          {formatDay(note.date)}
        </time>
        <span className="text-primary">
          Read · {note.minutes} min <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  )
}

/** The Writeups page: every writeup as a card, grouped by month, newest first. */
function WriteupsIndexPage() {
  // A case study can link here filtered to its project (?project=slug). Read after mount, so the prerendered page
  // (the full list) and the first render in the browser are the same.
  const [searchParams] = useSearchParams()
  const [project, setProject] = useState<string | null>(null)
  useEffect(() => {
    const slug = searchParams.get('project')
    setProject(slug && notes.some((note) => note.project === slug) ? slug : null)
  }, [searchParams])

  const shown = project ? notes.filter((note) => note.project === project) : notes

  return (
    <>
      <PageHero
        id="writeups-index-title"
        command="ls ./writeups"
        title="Writeups on things I built"
        lead="Each writeup starts from real code in one of my projects, explains what it actually does, and ends with what I would change."
      >
        <p className="mt-6 mb-0 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px] text-muted-foreground">
          <span>{plural(notes.length)}</span>
          <span>{projectCount} projects</span>
          <span>{totalMinutes} minutes of reading</span>
        </p>
      </PageHero>
      <section className="section-wrap pb-[clamp(88px,10vw,144px)]" aria-label="All writeups">
        <div className="border-t border-foreground/15" />
        {project && (
          <p className="mt-6 mb-0 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-text-body" role="status">
            Showing {plural(shown.length)} about {projectName(project)}.
            <Link
              to="/writeups"
              className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4 hover:text-primary"
            >
              Show all {notes.length}
            </Link>
          </p>
        )}
        {byMonth(shown).map((group) => (
          <div key={group.month} className="mt-[clamp(40px,5vw,64px)]">
            <div className="mb-[clamp(20px,2.4vw,28px)] flex items-baseline justify-between gap-4 border-b border-foreground/15 pb-4">
              <h2 className="m-0 text-[clamp(1.625rem,2.6vw,2.25rem)] leading-none tracking-[-0.035em]">
                {group.month}
              </h2>
              <span className="font-mono text-[13px] text-muted-foreground">{plural(group.notes.length)}</span>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-[clamp(16px,2vw,24px)] p-0 min-[700px]:grid-cols-2 min-[1030px]:grid-cols-3">
              {group.notes.map((note, index) => (
                <Reveal key={note.slug} delay={(index % 3) * 0.06}>
                  <li className="min-w-0">
                    <WriteupCard note={note} />
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  )
}

export default WriteupsIndexPage
