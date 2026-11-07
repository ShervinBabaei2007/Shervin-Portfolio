import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { headingId } from '@/lib/utils'

/**
 * "On this page": jump links to the h2 headings of a writeup. The ids come from the same function NoteBody uses.
 * One column, with the numbers in a fixed-width column of their own so every number and every title lines up
 * whatever the length of the list.
 */
function TableOfContents({ headings }: { headings: string[] }) {
  if (headings.length < 3) return null
  return (
    <nav aria-label="On this page" className="print:hidden">
      <Card className="h-full gap-2 py-5">
        <CardHeader className="px-5">
          <p className="eyebrow">ON THIS PAGE</p>
        </CardHeader>
        <CardContent className="px-3">
          <ol className="m-0 grid list-none gap-0.5 p-0">
            {headings.map((heading, index) => (
              <li key={heading}>
                <a
                  href={`#${headingId(heading)}`}
                  className="grid min-h-[var(--target)] grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-2 rounded-md px-2 text-[.9375rem] text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-primary pointer-fine:min-h-9"
                >
                  <span className="font-mono text-meta text-primary tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{heading}</span>
                </a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </nav>
  )
}

export default TableOfContents
