import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, notes } from '@/data/notes'
import GitHubActivity from '@/components/home/GitHubActivity'

function NotesSection() {
  return (
    <section className="notes-section section-wrap" id="notes" aria-labelledby="notes-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-mark">06</span> ENGINEERING NOTES
          </p>
          <h2 id="notes-title">
            What the bugs taught me<span>.</span>
          </h2>
        </div>
        <p className="section-aside">
          Real failure modes, trade-offs, and fixes I can <br />
          trace back to code—not polished hindsight.
        </p>
      </div>
      <div className="notes-layout">
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link to={`/notes/${note.slug}`}>
                <span className="note-meta">
                  <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
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
        <GitHubActivity />
      </div>
    </section>
  )
}

export default NotesSection
