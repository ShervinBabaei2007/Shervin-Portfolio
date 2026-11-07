import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import NoteRow from '@/components/shared/NoteRow'
import PageIntro from '@/components/shared/PageIntro'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { formatMonth, notes, type Note } from '../data/notes'
import { findProject } from '../data/projects'

/** How many writeups show before "Show more". Newest first, so the latest are always on screen. */
const PAGE_SIZE = 8

const projectName = (slug: string) => findProject(slug)?.name ?? slug

/** Everything a search can match for one writeup, lowercased once. */
const searchText = new Map(
  notes.map((note) => [
    note.slug,
    [
      note.title,
      note.summary,
      projectName(note.project),
      ...note.body.flatMap((block) =>
        block.type === 'p' || block.type === 'h2' ? [block.text] : block.type === 'list' ? block.items : [],
      ),
    ]
      .join(' ')
      .toLowerCase(),
  ]),
)

/** Projects that have at least one writeup, with how many, in the order they first appear (newest first). */
const projectFilters = notes.reduce<{ slug: string; name: string; count: number }[]>((list, note) => {
  const existing = list.find((entry) => entry.slug === note.project)
  if (existing) existing.count += 1
  else list.push({ slug: note.project, name: projectName(note.project), count: 1 })
  return list
}, [])

/** Splits a newest-first list into month groups, keeping the order. */
function byMonth(list: Note[]) {
  const groups: { month: string; notes: Note[] }[] = []
  for (const note of list) {
    const month = formatMonth(note.date)
    const last = groups[groups.length - 1]
    if (last?.month === month) last.notes.push(note)
    else groups.push({ month, notes: [note] })
  }
  return groups
}

function WriteupsIndexPage() {
  const [query, setQuery] = useState('')
  const [project, setProject] = useState<string | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  const matches = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return notes.filter(
      (note) =>
        (!project || note.project === project) && terms.every((term) => searchText.get(note.slug)?.includes(term)),
    )
  }, [query, project])

  const shown = matches.slice(0, visible)
  const filtering = Boolean(query.trim() || project)
  const clear = () => {
    setQuery('')
    setProject(null)
    setVisible(PAGE_SIZE)
  }
  const choose = (next: string | null) => {
    setProject(next)
    setVisible(PAGE_SIZE)
  }

  return (
    <section className="section-wrap pt-16 pb-[110px]" aria-labelledby="writeups-index-title">
      <PageIntro
        wide
        eyebrow="WRITEUPS"
        id="writeups-index-title"
        title="Writeups on things I built and got wrong"
        lead="Each writeup starts from real code in one of my projects, explains what it actually does, and ends with what I would change."
      />

      <div className="mt-2 grid gap-4">
        <Input
          type="search"
          aria-label="Search writeups"
          placeholder="Search writeups"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setVisible(PAGE_SIZE)
          }}
          className="h-11 max-w-[32rem] md:text-base"
        />
        <div role="group" aria-label="Filter writeups by project" className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={project === null ? 'default' : 'outline'}
            aria-pressed={project === null}
            onClick={() => choose(null)}
          >
            All <span className="tabular-nums opacity-90">{notes.length}</span>
          </Button>
          {projectFilters.map((entry) => (
            <Button
              key={entry.slug}
              type="button"
              size="sm"
              variant={project === entry.slug ? 'default' : 'outline'}
              aria-pressed={project === entry.slug}
              onClick={() => choose(entry.slug)}
            >
              {entry.name} <span className="tabular-nums opacity-90">{entry.count}</span>
            </Button>
          ))}
        </div>
        <p className="font-mono text-label text-muted-foreground" aria-live="polite" data-writeup-count>
          {filtering
            ? `${matches.length} of ${notes.length} writeups`
            : `${notes.length} ${notes.length === 1 ? 'writeup' : 'writeups'}, newest month first, best first within each month`}
        </p>
      </div>

      {matches.length > 0 ? (
        <div className="mt-8 grid gap-12">
          {byMonth(shown).map((group) => (
            <section key={group.month} aria-labelledby={`month-${group.month.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2
                id={`month-${group.month.replace(/\s+/g, '-').toLowerCase()}`}
                className="mb-4 flex items-center gap-3 font-mono text-sm font-medium tracking-wide text-foreground uppercase"
              >
                {group.month}
                <span className="rounded-full border bg-card px-2 py-0.5 text-label font-normal text-muted-foreground tabular-nums">
                  {group.notes.length}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </h2>
              <ul className="m-0 grid list-none gap-4 p-0">
                {group.notes.map((note) => (
                  <NoteRow key={note.slug} note={note} project={projectName(note.project)} />
                ))}
              </ul>
            </section>
          ))}
          {matches.length > shown.length && (
            <div>
              <Button type="button" variant="outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
                Show more writeups ({matches.length - shown.length} left)
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Empty className="mt-8 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No writeups match</EmptyTitle>
            <EmptyDescription>Try a different word, or clear the filters to see everything.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" onClick={clear}>
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}

export default WriteupsIndexPage
