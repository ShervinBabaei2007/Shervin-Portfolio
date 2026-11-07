import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type WindowFrameProps = { label?: string; className?: string; children: ReactNode }

/**
 * A browser-style window around a screenshot: three dots, an optional label, then the picture cropped to fit
 * (from the top). It is anchored to the bottom of its parent and has no bottom edge, so it reads as a window
 * peeking out of the card. Purely decorative, so parents hide it from assistive tech.
 */
function WindowFrame({ label, className, children }: WindowFrameProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full max-w-[560px] flex-col overflow-hidden rounded-t-lg border border-b-0 bg-card shadow-lg',
        className,
      )}
    >
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b bg-muted/60 px-3">
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="size-2 rounded-full bg-foreground/20" />
        <span className="size-2 rounded-full bg-foreground/20" />
        {label && (
          <span className="ml-3 truncate rounded bg-background px-2 py-0.5 font-mono text-label text-muted-foreground">
            {label}
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 [&_img]:block [&_img]:size-full [&_img]:object-cover [&_img]:object-top">
        {children}
      </div>
    </div>
  )
}

export default WindowFrame
