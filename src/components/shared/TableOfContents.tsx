import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/utils'

export type ContentsItem = { id: string; label: string }

/**
 * "On this page": jump links to the sections of a writeup or case study, with the section you are reading
 * highlighted as you scroll (and marked with aria-current for screen readers). One column, with the numbers in a
 * fixed-width column of their own so every number and every title lines up whatever the length of the list.
 */
function TableOfContents({ items }: { items: ContentsItem[] }) {
  const active = useActiveSection(
    items.map((item) => item.id),
    true,
  )
  if (items.length < 3) return null
  return (
    <nav aria-label="On this page" className="print:hidden">
      <Card className="gap-2 py-5">
        <CardHeader className="px-5">
          <p className="eyebrow">ON THIS PAGE</p>
        </CardHeader>
        <CardContent className="px-3">
          <ol className="m-0 grid list-none gap-0.5 p-0">
            {items.map((item, index) => {
              const current = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={current ? 'location' : undefined}
                    className={cn(
                      'grid min-h-[var(--target)] grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-2 rounded-md px-2 text-[.9375rem] no-underline transition-colors pointer-fine:min-h-9',
                      current
                        ? 'bg-muted font-medium text-foreground shadow-[inset_3px_0_0_var(--primary)]'
                        : 'text-muted-foreground hover:bg-muted hover:text-primary',
                    )}
                  >
                    <span className="font-mono text-meta text-primary tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ol>
        </CardContent>
      </Card>
    </nav>
  )
}

export default TableOfContents
