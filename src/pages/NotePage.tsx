import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import NoteBody from '../components/NoteBody'
import { findNote, formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

function NotePage() {
  const { slug } = useParams()
  const note = findNote(slug)
  if (!note) return <NotFoundPage />

  const project = findProject(note.project)
  const next = notes[(notes.indexOf(note) + 1) % notes.length]

  return (
    <article className="note-page section-wrap" aria-labelledby="note-title">
      <nav className="case-breadcrumb" aria-label="Breadcrumb">
        <Link to="/notes"><ArrowLeft size={15} /> All notes</Link>
      </nav>
      <header className="note-header">
        <p className="eyebrow">ENGINEERING NOTE</p>
        <h1 id="note-title">{note.title}</h1>
        <p className="note-standfirst">{note.summary}</p>
        <p className="note-byline">
          {site.name} · <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
        </p>
      </header>
      <NoteBody blocks={note.body} />
      <footer className="note-footer">
        {project && (
          <Link className="note-footer-link" to={`/work/${project.slug}`}>
            <span>Case study</span><b>{project.name}</b>
          </Link>
        )}
        {next.slug !== note.slug && (
          <Link className="note-footer-link" to={`/notes/${next.slug}`}>
            <span>Next note <ArrowRight size={14} /></span><b>{next.title}</b>
          </Link>
        )}
      </footer>
    </article>
  )
}

export default NotePage
