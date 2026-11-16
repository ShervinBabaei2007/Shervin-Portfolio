import { Link } from 'react-router-dom'
import Reveal from '@/components/shared/Reveal'
import SectionHeading from '@/components/shared/SectionHeading'
import { notes } from '@/data/notes'
import { findProject } from '@/data/projects'
import { outlinePill } from '@/lib/surfaces'

// Three writeups from three different projects: a concurrency bug, a race condition and a security check.
const picks = ['one-blocking-call-froze-my-bot', 'skillmatch-attend-race-condition', 'fetching-links-you-dont-trust']
const shown = picks.flatMap((slug) => notes.filter((note) => note.slug === slug))

// The card keeps the summary's setup and leaves the payoff ("Here is why...") for the writeup itself.
const teaser = (summary: string) => {
  const sentences = summary.match(/[^.!?]+[.!?]+/g) ?? [summary]
  const end = sentences.findIndex((sentence, index) => index > 0 && /^\s*(Here|The cause)/.test(sentence))
  return (end === -1 ? sentences : sentences.slice(0, end)).join('').trim()
}

/** Three writeups as cards, then a link to all of them. */
function WriteupsSection() {
  return (
    <section className="section-wrap pt-[clamp(88px,10vw,144px)]" id="writeups" aria-labelledby="writeups-title">
      <SectionHeading
        id="writeups-title"
        number="02"
        title="Writeups"
        aside="Each writeup starts from real code in one of my projects, explains what it actually does, and ends with what I would change."
      />
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(16px,2vw,24px)] p-0">
        {shown.map((note, index) => (
          <Reveal key={note.slug} delay={index * 0.08}>
            <li className="flex">
              <Link
                to={`/writeups/${note.slug}`}
                className="flex w-full flex-col justify-between gap-10 rounded-md bg-surface-hover p-[clamp(22px,2.2vw,28px)] text-foreground no-underline transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1 hover:text-foreground hover:shadow-[0_18px_40px_-24px_var(--color-shadow)]"
              >
                <span className="flex flex-col gap-3.5">
                  <span className="font-mono text-[13px] text-muted-foreground">
                    {findProject(note.project)?.name ?? 'Writeup'}
                  </span>
                  <span className="font-display text-[clamp(1.3125rem,1.8vw,1.5rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-balance">
                    {note.title}
                  </span>
                  <span className="text-[15px] leading-normal text-text-body">{teaser(note.summary)}</span>
                </span>
                <span className="font-mono text-[13px] text-primary">
                  Read · {note.minutes} min <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      <div className="mt-[clamp(32px,4vw,48px)]">
        <Link to="/writeups" className={outlinePill}>
          All {notes.length} writeups <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default WriteupsSection
