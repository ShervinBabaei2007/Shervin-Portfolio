import type { ReactNode } from 'react'
import Reveal from '@/components/shared/Reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  /** Heading id, referenced by the section's aria-labelledby. */
  id: string
  /** Section number shown before the heading, for example "02". */
  number: string
  title: ReactNode
  /** A short supporting line, at the right of the heading on wide screens and under it on narrow ones. */
  aside?: ReactNode
  className?: string
}

/** The small mono number, the heading and a rule under both, which open every home-page section. */
function SectionHeading({ id, number, title, aside, className }: SectionHeadingProps) {
  return (
    <Reveal>
      <div
        className={cn(
          'mb-[clamp(32px,4vw,48px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-b border-foreground/15 pb-5',
          className,
        )}
      >
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-[13px] text-muted-foreground">{number}</span>
          <h2 id={id} className="m-0 text-[clamp(2rem,3.8vw,3.25rem)] leading-none tracking-[-0.04em]">
            {title}
          </h2>
        </div>
        {aside && <p className="m-0 max-w-[460px] text-[15px] leading-[1.5] text-muted-foreground">{aside}</p>}
      </div>
    </Reveal>
  )
}

export default SectionHeading
