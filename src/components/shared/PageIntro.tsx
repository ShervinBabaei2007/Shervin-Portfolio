import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageIntroProps = { eyebrow: string; id: string; title: ReactNode; lead?: ReactNode; wide?: boolean; action?: ReactNode }

/** Eyebrow, heading and lead paragraph that open the simple pages (404, writeups, how it's built). */
/** `wide` lets the heading and lead run the full width of the page instead of a narrow reading measure. */
/** `action` (a button, say) sits on the right of the heading, and drops below it when there is no room. */
function PageIntro({ eyebrow, id, title, lead, wide = false, action }: PageIntroProps) {
  const heading = (
    <h1 id={id} className={cn('mt-3.5 text-title font-semibold', wide ? 'text-wrap' : 'max-w-[18ch]')}>
      {title}
    </h1>
  )
  return (
    <>
      <p className="mt-4 mb-7 eyebrow">{eyebrow}</p>
      {action ? (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {heading}
          {action}
        </div>
      ) : (
        heading
      )}
      {lead && (
        <p className={cn('mt-4 mb-7 text-[1.125rem] leading-[1.65] text-muted-foreground', !wide && 'max-w-[60ch]')}>
          {lead}
        </p>
      )}
    </>
  )
}

export default PageIntro
