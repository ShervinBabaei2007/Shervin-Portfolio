import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ArticleLayout from '@/components/shared/ArticleLayout'
import AsciiCanvas from '@/components/shared/AsciiCanvas'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import NoteBody from '@/components/shared/NoteBody'
import CopyLinkButton from '@/components/shared/CopyLinkButton'
import TableOfContents from '@/components/shared/TableOfContents'
import WriteupAside from '@/components/shared/WriteupAside'
import { findNote, formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'
import { headingId } from '@/lib/utils'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const footerLink =
  'grid gap-1.5 rounded-md bg-surface-hover px-6 py-5 text-foreground no-underline transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:text-foreground hover:shadow-[0_18px_40px_-24px_var(--color-shadow)] [&:hover_b]:text-primary'
const footerLabel = 'inline-flex items-center gap-1.5 font-mono text-[13px] text-muted-foreground'
const footerTitle = 'font-display text-[1.25rem] leading-[1.25] font-semibold tracking-[-0.025em]'

/** One writeup at /writeups/:slug, or the 404 page when the slug is unknown. */
function WriteupPage() {
  const { slug } = useParams()
  const note = findNote(slug)
  if (!note) return <NotFoundPage />

  const project = findProject(note.project)
  // The same ids NoteBody gives each h2, so the contents links and the scroll-spy find their sections.
  const contents = note.body.flatMap((block) =>
    block.type === 'h2' ? [{ id: headingId(block.text), label: block.text }] : [],
  )
  // Wraps around, so the last writeup links to the first; the link is hidden when there is only one.
  const next = notes[(notes.indexOf(note) + 1) % notes.length]

  return (
    <article aria-labelledby="note-title">
      {/* The top of the page: the ASCII field behind the project it comes from, the title, the summary and the byline. */}
      <div className="relative section-wrap pt-[clamp(28px,4vw,56px)] pb-[clamp(40px,5vw,64px)]">
        <AsciiCanvas />
        <div className="relative">
          <PageBreadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Writeups', to: '/writeups' },
            ]}
            current={note.title}
          />
          <header data-calm className="mt-[clamp(28px,4vw,48px)] max-w-[940px]">
            <p className="rise m-0 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[13px] text-muted-foreground">
              <span className="max-w-full truncate">
                <span className="text-primary">~</span> $ cat writeups/{note.slug}.md
              </span>
              {project && (
                <Link
                  className="inline-flex min-h-8 items-center rounded-full bg-surface-hover px-3 text-foreground no-underline transition-colors hover:text-primary pointer-coarse:min-h-11"
                  to={`/work/${project.slug}`}
                >
                  {project.name}
                </Link>
              )}
            </p>
            <h1
              id="note-title"
              className="rise mt-5 mb-0 text-[clamp(2.5rem,5.2vw,4.75rem)] leading-[0.98] font-[650] tracking-[-0.045em]"
              style={{ '--d': '80ms' } as CSSProperties}
            >
              {note.title}
            </h1>
            <p
              className="rise mt-6 mb-0 max-w-[62ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.55] text-text-body"
              style={{ '--d': '160ms' } as CSSProperties}
            >
              {note.summary}
            </p>
          </header>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-foreground/15 pt-5">
            <p className="m-0 font-mono text-[13px] text-muted-foreground">
              <span className="text-foreground">{site.name}</span> ·{' '}
              <time dateTime={note.date}>{formatDate(note.date)}</time> ·{' '}
              <span className="whitespace-nowrap">{note.minutes} min read</span>
            </p>
            <CopyLinkButton />
          </div>
        </div>
      </div>
      <div className="section-wrap pb-[clamp(56px,7vw,96px)]">
        <ArticleLayout
          className="mt-0"
          rail={
            <>
              <TableOfContents items={contents} />
              {project && <WriteupAside project={project} />}
            </>
          }
        >
          <NoteBody blocks={note.body} />
        </ArticleLayout>
      </div>

      {/* Where to read next; the footer band below is the call to action. */}
      <div className="section-wrap pb-[clamp(88px,10vw,144px)]">
        <footer className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 border-t border-foreground/15 pt-[clamp(28px,3vw,40px)]">
          {project && (
            <Link className={footerLink} to={`/work/${project.slug}`}>
              <span className={footerLabel}>Case study</span>
              <b className={footerTitle}>{project.name}</b>
            </Link>
          )}
          {next.slug !== note.slug && (
            <Link className={footerLink} to={`/writeups/${next.slug}`}>
              <span className={footerLabel}>
                Next writeup <ArrowRight size={14} aria-hidden="true" />
              </span>
              <b className={footerTitle}>{next.title}</b>
            </Link>
          )}
        </footer>
      </div>
    </article>
  )
}

export default WriteupPage
