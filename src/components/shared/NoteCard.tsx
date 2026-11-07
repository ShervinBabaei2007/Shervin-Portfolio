import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, type Note } from '@/data/notes'

/** One writeup in a list. `project` is shown after the reading time when given. */
function NoteCard({ note, project }: { note: Note; project?: string }) {
  return (
    <li>
      <Link
        className="grid gap-1.5 rounded-xl border bg-card px-5 py-[18px] no-underline transition-colors hover:border-primary"
        to={`/writeups/${note.slug}`}
      >
        <span className="font-mono text-label text-muted-foreground">
          <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
          {project ? ` · ${project}` : ''}
        </span>
        <b className="text-xl leading-tight font-semibold">{note.title}</b>
        <span className="leading-[1.6] text-muted-foreground">{note.summary}</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read writeup <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </Link>
    </li>
  )
}

export default NoteCard
