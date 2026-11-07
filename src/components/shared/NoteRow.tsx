import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatDay, type Note } from '@/data/notes'
import { cn } from '@/lib/utils'

/**
 * One writeup as a card in the index, in the same style as the project cards so it stands out from the page:
 * a white card with a border and shadow, a Featured badge for the best ones, and an arrow that fills in on hover.
 */
function NoteRow({ note, project }: { note: Note; project?: string }) {
  return (
    <li>
      <Link
        className={cn(
          'group relative grid items-center gap-x-6 gap-y-3 overflow-hidden rounded-xl border bg-card p-5 text-card-foreground no-underline shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:p-6',
          'transition-[transform,box-shadow,border-color] duration-200 ease-in-out hover:border-primary hover:shadow-md focus-visible:border-primary',
          'motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none',
          // A coloured bar down the left edge: always there on a featured writeup, and on hover for the rest.
          "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary before:transition-opacity before:content-['']",
          note.featured
            ? 'before:opacity-100'
            : 'before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100',
        )}
        to={`/writeups/${note.slug}`}
      >
        <span className="grid gap-2">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-label text-muted-foreground">
            {note.featured && <Badge>Featured</Badge>}
            {project && <Badge variant="secondary">{project}</Badge>}
            <time dateTime={note.date}>{formatDay(note.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{note.minutes} min read</span>
          </span>
          <b className="text-xl leading-tight font-semibold transition-colors group-hover:text-primary group-focus-visible:text-primary">
            {note.title}
          </b>
          <span className="line-clamp-2 max-w-[70ch] leading-[1.6] text-muted-foreground">{note.summary}</span>
        </span>
        <span
          className="hidden size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:border-primary group-focus-visible:bg-primary group-focus-visible:text-primary-foreground sm:flex"
          aria-hidden="true"
        >
          <ArrowUpRight size={18} />
        </span>
      </Link>
    </li>
  )
}

export default NoteRow
