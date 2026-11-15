import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { formatDay, type Note } from '@/data/notes'
import { cn } from '@/lib/utils'

/**
 * One writeup as a card in the index: a tile with the reading time, the project and a Featured badge, the title and
 * summary, and an arrow that fills in on hover. Raised off the page like the project cards.
 */
function NoteRow({ note, project }: { note: Note; project?: string }) {
  return (
    <li>
      <Link
        className={cn(
          'group relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-3 overflow-hidden rounded-2xl border border-foreground/15 bg-card p-5 text-card-foreground no-underline sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-6 sm:p-6',
          'shadow-[0_2px_4px_var(--color-shadow),0_24px_48px_-26px_var(--color-shadow)]',
          'transition-[transform,box-shadow,border-color] duration-200 ease-in-out hover:border-primary focus-visible:border-primary',
          'motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none',
        )}
        to={`/writeups/${note.slug}`}
      >
        {/* The reading time as a tile, so every card has the same anchor on the left. */}
        <span
          className="grid size-[4.5rem] place-items-center rounded-xl bg-primary/10 leading-none text-primary max-[620px]:size-14"
          aria-hidden="true"
        >
          <span className="text-[1.75rem] font-semibold tabular-nums max-[620px]:text-xl">{note.minutes}</span>
          <span className="-mt-3 font-mono text-label font-semibold tracking-wide uppercase max-[620px]:-mt-2">
            min
          </span>
        </span>
        <span className="grid min-w-0 gap-2">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-label text-muted-foreground">
            {note.featured && <Badge variant="featured">Featured</Badge>}
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
          className="hidden size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary-fill group-hover:text-primary-foreground group-focus-visible:border-primary group-focus-visible:bg-primary-fill group-focus-visible:text-primary-foreground sm:flex"
          aria-hidden="true"
        >
          <ArrowUpRight size={18} />
        </span>
      </Link>
    </li>
  )
}

export default NoteRow
