import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Text on the left and a rail on the right, for writeups and case studies.
 *
 * The text takes all the width left of the rail, so it runs across towards it with no empty gap in the middle,
 * and the rail sits at the right edge of the page holding things a reader uses: the contents list, the project,
 * the stack. The rail is first in the page order, so below 1024px it simply stacks above the text and there is
 * only one copy of each navigation. On a large, tall enough window it sticks below the header while you read.
 */
function ArticleLayout({ rail, children, className }: { rail: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-x-14', className)}>
      <div
        className={cn(
          'grid content-start gap-5 lg:order-2 lg:self-start print:hidden',
          // Sticky only when the window is tall enough to show the whole rail, so it is never cut off.
          'lg:[@media(min-height:46rem)]:sticky lg:[@media(min-height:46rem)]:top-[calc(var(--header-height)+1.5rem)]',
        )}
      >
        {rail}
      </div>
      <div className="min-w-0 lg:order-1">{children}</div>
    </div>
  )
}

export default ArticleLayout
