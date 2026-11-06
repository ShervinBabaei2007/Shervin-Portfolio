import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'

function NotesIndexPage() {
  return (
    <section className="simple-page notes-index section-wrap" aria-labelledby="notes-index-title">
      <p className="eyebrow">ENGINEERING NOTES</p>
      <h1 id="notes-index-title">Notes on things I built and got wrong</h1>
      <p className="simple-page-lead">
        Each note starts from real code in one of my projects, explains what it actually does, and ends with what I
        would change.
      </p>
      <ul className="note-list note-list--page">
        {notes.map((note) => (
          <li key={note.slug}>
            <Link to={`/notes/${note.slug}`}>
              <span className="note-meta">
                <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read ·{' '}
                {findProject(note.project)?.name}
              </span>
              <b>{note.title}</b>
              <span className="note-summary">{note.summary}</span>
              <span className="note-read">
                Read note <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default NotesIndexPage
