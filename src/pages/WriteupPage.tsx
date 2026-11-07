import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ClosingCta from '@/components/shared/ClosingCta'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import NoteBody from '@/components/shared/NoteBody'
import CopyLinkButton from '@/components/shared/CopyLinkButton'
import TableOfContents from '@/components/shared/TableOfContents'
import WriteupAside from '@/components/shared/WriteupAside'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { findNote, formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'
import { cn } from '@/lib/utils'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const footerLink = 'grid gap-1.5 rounded-xl border bg-card px-[18px] py-4 no-underline hover:border-primary'
const footerLabel = 'inline-flex items-center gap-1.5 text-meta text-muted-foreground'

function WriteupPage() {
  const { slug } = useParams()
  const note = findNote(slug)
  if (!note) return <NotFoundPage />

  const project = findProject(note.project)
  const headings = note.body.flatMap((block) => (block.type === 'h2' ? [block.text] : []))
  const next = notes[(notes.indexOf(note) + 1) % notes.length]

  return (
    <article
      className="section-wrap pt-9 pb-[110px] max-[620px]:pt-[18px] max-[620px]:pb-16"
      aria-labelledby="note-title"
    >
      <PageBreadcrumb
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Writeups', to: '/writeups' },
        ]}
        current={note.title}
      />
      <header className="mt-[18px] border-b pb-8">
        <p className="eyebrow">WRITEUP</p>
        <h1
          id="note-title"
          className="mt-3.5 text-[clamp(2rem,1.5rem+1.8vw,3rem)] leading-[1.1] font-semibold text-wrap"
        >
          {note.title}
        </h1>
        <p className="mt-5 text-[1.25rem] leading-[1.65] text-muted-foreground">{note.summary}</p>
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-secondary font-mono text-xs text-secondary-foreground">SB</AvatarFallback>
            </Avatar>
            <p className="font-mono text-meta text-muted-foreground">
              <span className="text-foreground">{site.name}</span> ·{' '}
              <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
            </p>
          </div>
          <CopyLinkButton />
        </div>
        {/* The two cards are always the same height: the contents list sets it, and the project card fills it. */}
        <div className={cn('mt-8 grid items-stretch gap-5', project && 'lg:grid-cols-[minmax(0,1fr)_22rem]')}>
          <TableOfContents headings={headings} />
          {project && <WriteupAside project={project} />}
        </div>
      </header>
      <NoteBody blocks={note.body} />
      <ClosingCta
        heading="Found this useful?"
        body="I'm happy to talk through the details, or what I would do differently."
      />
      <footer className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5 border-t pt-6">
        {project && (
          <Link className={footerLink} to={`/work/${project.slug}`}>
            <span className={footerLabel}>Case study</span>
            <b className="text-[1.0625rem] leading-[1.3] font-semibold">{project.name}</b>
          </Link>
        )}
        {next.slug !== note.slug && (
          <Link className={footerLink} to={`/writeups/${next.slug}`}>
            <span className={footerLabel}>
              Next writeup <ArrowRight size={14} />
            </span>
            <b className="text-[1.0625rem] leading-[1.3] font-semibold">{next.title}</b>
          </Link>
        )}
      </footer>
    </article>
  )
}

export default WriteupPage
