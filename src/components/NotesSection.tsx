import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, notes } from '../data/notes'
import GitHubActivity from './GitHubActivity'

function NotesSection() {
  return (
    <section className="notes-section section-wrap" id="notes" aria-labelledby="notes-title">
      <div className="section-heading">
        <div><p className="eyebrow"><span className="eyebrow-mark">05</span> ENGINEERING NOTES</p><h2 id="notes-title">Writing it down<span>.</span></h2></div>
        <p className="section-aside">Short write-ups on bugs I found in my own <br />code and what I learned fixing them.</p>
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
