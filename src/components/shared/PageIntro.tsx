import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageIntroProps = { eyebrow: string; id: string; title: ReactNode; lead?: ReactNode; wide?: boolean }

/** Eyebrow, heading and lead paragraph that open the simple pages (404, writeups, how it's built). */
/** `wide` lets the heading and lead run the full width of the page instead of a narrow reading measure. */
function PageIntro({ eyebrow, id, title, lead, wide = false }: PageIntroProps) {
  return (
    <>
      <p className="mt-4 mb-7 eyebrow">{eyebrow}</p>
      <h1 id={id} className={cn('mt-3.5 text-title font-semibold', wide ? 'text-wrap' : 'max-w-[18ch]')}>
        {title}
      </h1>
      {lead && (
        <p className={cn('mt-4 mb-7 text-[1.125rem] leading-[1.65] text-muted-foreground', !wide && 'max-w-[60ch]')}>
          {lead}
        </p>
      )}
    </>
  )
}

export default PageIntro
