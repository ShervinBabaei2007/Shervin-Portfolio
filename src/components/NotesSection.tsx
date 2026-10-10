import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, notes } from '../data/notes'
import GitHubActivity from './GitHubActivity'

function NotesSection() {
  return (
    <section className="notes-section section-wrap" id="notes" aria-labelledby="notes-title">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">06</span> ENGINEERING NOTES</p><h2 id="notes-title">Things I broke<span>.</span></h2></div>
        <p className="section-aside">Bugs, bad assumptions, and the moments that <br />changed how I build the next thing.</p>
      </div>
      <div className="notes-layout">
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={`/notes/${note.slug}`}>
                <span className="note-meta"><time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read</span>
                <b>{note.title}</b>
                <span className="note-summary">{note.summary}</span>
                <span className="note-read">Read note <ArrowUpRight size={15} aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
        <GitHubActivity />
      </div>
    </section>
  )
}

export default NotesSection
