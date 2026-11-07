import { headingId } from '@/lib/utils'

/** "On this page": jump links to the h2 headings of a writeup. The ids come from the same function NoteBody uses. */
function TableOfContents({ headings }: { headings: string[] }) {
  if (headings.length < 3) return null
  return (
    <nav aria-label="On this page" className="mt-8 rounded-xl border bg-card px-5 py-4 print:hidden">
      <p className="eyebrow">ON THIS PAGE</p>
      <ol className="m-0 mt-3 grid list-none gap-1 p-0">
        {headings.map((heading, index) => (
          <li key={heading}>
            <a
              href={`#${headingId(heading)}`}
              className="inline-flex min-h-[var(--target)] items-center gap-3 text-[.9375rem] text-muted-foreground no-underline transition-colors hover:text-primary"
            >
              <span className="font-mono text-meta tabular-nums text-primary">{String(index + 1).padStart(2, '0')}</span>
              {heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default TableOfContents
