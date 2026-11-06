import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import BackLink from '@/components/shared/BackLink'
import NoteBody from '@/components/shared/NoteBody'
import { findNote, formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const footerLink = 'grid gap-1.5 border bg-card px-[18px] py-4 no-underline hover:border-primary'
const footerLabel = 'inline-flex items-center gap-1.5 text-[.8125rem] text-muted-foreground'

function NotePage() {
  const { slug } = useParams()
  const note = findNote(slug)
  if (!note) return <NotFoundPage />

  const project = findProject(note.project)
  const next = notes[(notes.indexOf(note) + 1) % notes.length]

  return (
    <article
      className="section-wrap max-w-[760px] pt-9 pb-[100px] max-[620px]:pt-[18px] max-[620px]:pb-16"
      aria-labelledby="note-title"
    >
      <BackLink to="/notes">All notes</BackLink>
      <header className="mt-[18px] border-b pb-6">
        <p className="eyebrow">ENGINEERING NOTE</p>
        <h1 id="note-title" className="mt-3.5 text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-[1.1] font-semibold">
          {note.title}
        </h1>
        <p className="mt-4 text-[1.1875rem] leading-[1.6] text-muted-foreground">{note.summary}</p>
        <p className="mt-3.5 font-mono text-[.8125rem] text-muted-foreground">
          {site.name} · <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
        </p>
      </header>
      <NoteBody blocks={note.body} />
      <footer className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5 border-t pt-6">
        {project && (
          <Link className={footerLink} to={`/work/${project.slug}`}>
            <span className={footerLabel}>Case study</span>
            <b className="text-[1.0625rem] leading-[1.3] font-semibold">{project.name}</b>
          </Link>
        )}
        {next.slug !== note.slug && (
          <Link className={footerLink} to={`/notes/${next.slug}`}>
            <span className={footerLabel}>
              Next note <ArrowRight size={14} />
            </span>
            <b className="text-[1.0625rem] leading-[1.3] font-semibold">{next.title}</b>
          </Link>
        )}
      </footer>
    </article>
  )
}

export default NotePage
