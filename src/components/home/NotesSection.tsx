import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, notes } from '@/data/notes'
import GitHubActivity from '@/components/home/GitHubActivity'
import SectionHeading from '@/components/shared/SectionHeading'

function NotesSection() {
  return (
    <section className="notes-section section-wrap" id="notes" aria-labelledby="notes-title">
      <SectionHeading
        id="notes-title"
        number="06"
        eyebrow="ENGINEERING NOTES"
        title="What the bugs taught me"
        aside={
          <>
            Real failure modes, trade-offs, and fixes I can <br />
            trace back to code—not polished hindsight.
          </>
        }
      />
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
