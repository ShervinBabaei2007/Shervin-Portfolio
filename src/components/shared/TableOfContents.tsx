import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/utils'

export type ContentsItem = { id: string; label: string }

/**
 * "On this page": jump links to the sections of a writeup or case study, with the section you are reading
 * highlighted as you scroll (and marked with aria-current for screen readers). One column, with the numbers in a
 * fixed-width column of their own so every number and every title lines up whatever the length of the list.
 *
 * In the rail on wide screens the list is always open. Below 1024px the rail sits above the text, so the list folds
 * behind one "On this page" button and the article starts on the first screen; picking a section folds it again.
 */
function TableOfContents({ items }: { items: ContentsItem[] }) {
  const active = useActiveSection(
    items.map((item) => item.id),
    true,
  )
  const [open, setOpen] = useState(false)
  const listId = useId()
  // Short pages with fewer than three sections get no contents list.
  if (items.length < 3) return null
  return (
    <nav aria-label="On this page" className="border-t border-foreground/15 pt-4 print:hidden">
      <p className="m-0 mb-2 font-mono text-[13px] text-muted-foreground max-lg:hidden">On this page</p>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md bg-surface-hover px-4 text-left font-mono text-[13px] text-foreground lg:hidden"
      >
        <span>
          On this page <span className="text-muted-foreground">· {items.length} sections</span>
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn('transition-transform motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>
      <ol id={listId} className={cn('m-0 grid list-none gap-0.5 p-0 max-lg:mt-2', !open && 'max-lg:hidden')}>
        {items.map((item, index) => {
          const current = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? 'location' : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  'grid min-h-[var(--target)] grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-x-2 rounded-md px-2 text-[15px] no-underline transition-colors pointer-fine:min-h-9',
                  current
                    ? 'bg-surface-hover font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground',
                )}
              >
                <span className="font-mono text-[13px] text-primary tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default TableOfContents
