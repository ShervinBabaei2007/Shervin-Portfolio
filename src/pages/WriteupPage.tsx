import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ArticleLayout from '@/components/shared/ArticleLayout'
import PageBreadcrumb from '@/components/shared/PageBreadcrumb'
import NoteBody from '@/components/shared/NoteBody'
import CopyLinkButton from '@/components/shared/CopyLinkButton'
import TableOfContents from '@/components/shared/TableOfContents'
import WriteupAside from '@/components/shared/WriteupAside'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { findNote, formatDate, notes } from '../data/notes'
import { findProject } from '../data/projects'
import { headingId } from '@/lib/utils'
import { raised } from '@/lib/surfaces'
import { site } from '../data/site'
import NotFoundPage from './NotFoundPage'

const footerLink = `grid gap-1.5 rounded-2xl border bg-card px-5 py-[18px] no-underline transition-colors hover:border-primary ${raised}`
const footerLabel = 'inline-flex items-center gap-1.5 text-meta text-muted-foreground'

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
      {/* Title block on the tinted band: the project it comes from, the title, the one-line summary and who wrote it. */}
      <div className="section-band">
        <div className="section-wrap pt-[clamp(1.25rem,3.5svh,2.25rem)] pb-[var(--space-block)]">
          <PageBreadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Writeups', to: '/writeups' },
            ]}
            current={note.title}
          />
          <header className="mt-[18px]">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="eyebrow">WRITEUP</span>
              {project && (
                <Link
                  className="inline-flex min-h-8 items-center rounded-full border border-foreground/15 bg-card px-3 font-mono text-label text-foreground no-underline transition-colors hover:border-primary hover:text-primary"
                  to={`/work/${project.slug}`}
                >
                  {project.name}
                </Link>
              )}
            </p>
            <h1 id="note-title" className="mt-4 max-w-[26ch] text-title font-semibold text-wrap">
              {note.title}
            </h1>
            <p className="mt-5 max-w-[62ch] text-[1.25rem] leading-[1.65] text-muted-foreground">{note.summary}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-foreground/10 pt-5">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary-fill font-mono text-xs text-primary-foreground">
                    SB
                  </AvatarFallback>
                </Avatar>
                <p className="font-mono text-meta text-muted-foreground">
                  <span className="text-foreground">{site.name}</span> ·{' '}
                  <time dateTime={note.date}>{formatDate(note.date)}</time> · {note.minutes} min read
                </p>
              </div>
              <CopyLinkButton />
            </div>
          </header>
        </div>
      </div>
      <div className="section-wrap pt-[var(--space-block)] pb-[var(--space-block)]">
        <ArticleLayout
          className="mt-0"
          rail={
            <>
              <TableOfContents items={contents} />
              {project && <WriteupAside project={project} />}
            </>
          }
        >
          {/* The text sits on a raised white sheet, like the cards around it, so it reads as the main thing on the page. */}
          <div
            className={`rounded-2xl border bg-card px-10 py-9 max-[900px]:px-6 max-[620px]:px-4 max-[620px]:py-6 ${raised}`}
          >
            <NoteBody blocks={note.body} />
          </div>
        </ArticleLayout>
      </div>

      {/* The ending sits on the tinted band used across the site: where to read next. The footer band below is the call to action. */}
      <div className="section-band">
        <div className="section-wrap grid gap-6 py-[var(--space-page)]">
          <footer className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
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
        </div>
      </div>
    </article>
  )
}

export default WriteupPage
